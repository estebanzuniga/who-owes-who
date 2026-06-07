import { type User } from "./auth"

export interface CoupleAccount {
  id: string
  name: string
  currency: string
  createdAt: string
  creatorId: string
  invitedId: string | null
  creator: User
  invited: User | null
}