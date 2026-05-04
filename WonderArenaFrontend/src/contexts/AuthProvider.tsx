import { createContext, useContext, useState } from "react"

interface AuthContextType {
    accessToken: string | null
    login: (tokens: { accessToken: string }) => void
}

const AuthContext = createContext<AuthContextType>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken] = useState<string | null>(null)

    const login = (_tokens: { accessToken: string }) => {
    }

    return (
        <AuthContext.Provider value={{ accessToken, login }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
