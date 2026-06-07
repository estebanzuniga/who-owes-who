import { create } from 'zustand'
import api from '../api/axios'
import { type CoupleAccount } from '../types/coupleAccount'

interface CoupleAccountState {
  accounts: CoupleAccount[]
  loading: boolean
  fetchAccounts: () => Promise<void>
}

export const useCoupleAccountStore = create<CoupleAccountState>((set) => ({
  accounts: [],
  loading: false,

  fetchAccounts: async () => {
    set({ loading: true })
    try {
      const { data } = await api.get<CoupleAccount[]>('/account')
      set({ accounts: data, loading: false })
    } catch {
      set({ loading: false })
    }
  },
}))
