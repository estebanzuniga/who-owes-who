import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authMiddleware } from '../middleware/auth.js'
import { validateBody } from '../middleware/schemaValidator.js'
import { tryCatch } from '../lib/tryCatch.js'
import { env } from '../lib/env.js'
import ms from 'ms';

export const coupleAccountRouter = Router();
coupleAccountRouter.use(authMiddleware);

coupleAccountRouter.post('/', tryCatch(async (req, res) => {
  const existingCoupleAccounts = await prisma.coupleAccount.findMany({
    where: {
      OR: [
        { creatorId: req.user.id },
        { invitedId: req.user.id },
      ],
    }
  });

  if (existingCoupleAccounts.length >= env.MAX_ACCOUNT_COUPLES_PER_USER) {
    res.status(400).json({ message: 'User has reached the maximum number of couples allowed' });
    return;
  }

  const couple = await prisma.coupleAccount.create({
    data: {
      creatorId: req.user.id,
    },
  })

  const invite = await prisma.coupleInvite.create({
    data: {
      coupleId: couple.id,
      expiresAt: new Date(Date.now() + ms(env.INVITE_TOKEN_EXPIRY as ms.StringValue)),
    },
  });

  res.status(201).json({ couple, invitationLink: `${env.FRONTEND_URL}/join/?token=${invite.token}` });
}));

coupleAccountRouter.get('/:coupleId', tryCatch(async (req, res) => {
  const { coupleId } = req.params;

  const couple = await prisma.coupleAccount.findFirst({
    where: {
      id: coupleId as string,
    },
    include: {
      creator: { select: { id: true, email: true, name: true } },
      invited: { select: { id: true, email: true, name: true } },
    },
  });

  if (!couple) {
    res.status(404).json({ message: 'Couple not found' });
    return;
  }

  res.json(couple);
}));

coupleAccountRouter.delete('/:coupleId', tryCatch(async (req, res) => {
  const coupleId = req.params.coupleId as string;

  const toDeleteCouple = await prisma.coupleAccount.findFirst({
    where: {
      id: coupleId,
    }
  });

  if (!toDeleteCouple) {
    res.status(404).json({ message: 'Couple not found' });
    return;
  }

  if (toDeleteCouple.creatorId !== req.user.id && toDeleteCouple.invitedId !== req.user.id) {
    res.status(403).json({ message: 'User is not a member of this couple' });
    return;
  }

  const deletedCouple = await prisma.coupleAccount.delete({
    where: {
      id: coupleId,
    },
  });

  res.json({ message: 'Couple deleted successfully', couple: deletedCouple });
}));

const coupleInviteSchema = z.object({
  coupleId: z.cuid(),
});

coupleAccountRouter.post('/invite', validateBody(coupleInviteSchema), tryCatch(async (req, res) => {
  const { coupleId } = req.body;
  
  const couple = await prisma.coupleAccount.findFirst({
    where: {
      id: coupleId,
    },
  });

  if (!couple) {
    res.status(403).json({ message: 'Not the couple creator' });
    return;
  }

  if (couple.invitedId) {
    res.status(400).json({ message: 'Couple already has a partner' });
    return;
  }

  await prisma.coupleInvite.deleteMany({
    where: {
      coupleId: couple.id,
    },
  });

  const invite = await prisma.coupleInvite.create({
    data: {
      coupleId: couple.id,
      expiresAt: new Date(Date.now() + ms(env.INVITE_TOKEN_EXPIRY as ms.StringValue)),
    },
  });

  res.json({ invitationLink: `${env.FRONTEND_URL}/join/?token=${invite.token}` });
}));

const joinCoupleSchema = z.object({
  token: z.cuid(),
});

coupleAccountRouter.post('/join', validateBody(joinCoupleSchema), tryCatch(async (req, res) => {
  const { token } = req.body;
  
  const invite = await prisma.coupleInvite.findUnique({
    where: { token },
    include: { couple: true },
  })

  if (!invite) {
    res.status(404).json({ message: 'Invalid invite token' });
    return;
  }

  let coupleAccount = await prisma.coupleAccount.findUnique({
    where: { id: invite.coupleId },
  });

  if (!coupleAccount) {
    res.status(404).json({ message: 'Couple not found' });
    return;
  }

  if (invite.usedAt) {
    res.status(400).json({ message: 'Invite token has already been used' });
    return;
  }

  if (invite.expiresAt < new Date()) {
    res.status(400).json({ message: 'Invite token has expired' });
    return;
  }

  if (invite.couple.creatorId === req.user.id) {
    res.status(400).json({ message: 'User is already the couple creator' });
    return;
  }

  if (invite.couple.invitedId) {
    res.status(400).json({ message: 'Couple already has a partner' });
    return;
  }

  coupleAccount = await prisma.coupleAccount.update({
    where: { id: invite.coupleId },
    data: { invitedId: req.user.id },
  });
  
  await prisma.coupleInvite.update({
    where: { token: invite.token },
    data: { usedAt: new Date() },
  });

  res.json(coupleAccount);
}));
