import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'
import { setToken as saveToken, getToken, removeToken } from '../lib/auth'

type Role = 'USER' | 'DRIVER' | 'COMPANY' | 'ADMIN' | string

export interface User {
  id: string
  phone: string
  role: Role
}

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  loginWithToken: (token: string, user?: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(getToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function bootstrap() {
      const t = getToken()
      if (t) {
        try {
          const res = await api.get('/auth/me')
          setUser(res.data.user)
          setToken(t)
        } catch (err) {
          removeToken()
        }
      }
      setLoading(false)
    }
    bootstrap()
  }, [])

  function loginWithToken(tok: string, u?: User) {
    saveToken(tok)
    setToken(tok)
    if (u) setUser(u)
  }

  function logout() {
    removeToken()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
