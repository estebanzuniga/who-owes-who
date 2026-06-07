import { create } from 'zustand'
import api from '../api/axios'
import { type User } from '../types/auth'

interface AuthState {
  user: User | null
  loading: boolean
  fetchMe: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  fetchMe: async () => {
    try {
      const { data } = await api.get<User>('/auth/profile')
      set({ user: data, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },

  logout: async () => {
    await api.post('/auth/logout')
    set({ user: null })
  },
}))