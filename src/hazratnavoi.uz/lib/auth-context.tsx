"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface SiteUser { id: string; phone: string; name: string }

interface AuthContextType {
  user: SiteUser | null
  setUser: (u: SiteUser | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<SiteUser | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("site_user")
    if (saved) setUserState(JSON.parse(saved))
  }, [])

  function setUser(u: SiteUser | null) {
    setUserState(u)
    if (u) localStorage.setItem("site_user", JSON.stringify(u))
    else localStorage.removeItem("site_user")
  }

  function logout() {
    setUser(null)
    fetch("/api/auth/logout", { method: "POST" })
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
