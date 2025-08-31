// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import corsMiddleware from "@/middleware/cors";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  await corsMiddleware(req, res)
  res.status(200).json({ message: "Hello from Next.js backend" });
}
