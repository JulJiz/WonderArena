import { createContext, useContext, useState } from "react"
import { getTokens, saveTokens } from "../utils/storage"

interface AuthContextType {
    accessToken: string | null
    login: (tokens: { accessToken: string }) => void
}

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    login: () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(() => {
        return getTokens().accessToken ?? null
    })

    const login = (tokens: { accessToken: string }) => {
        saveTokens(tokens)
        setAccessToken(tokens.accessToken)
    }

    return (
        <AuthContext.Provider value={{ accessToken, login }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
