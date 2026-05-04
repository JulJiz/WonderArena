import { Request, Response, NextFunction } from "express"
import { SupabaseClient } from "../clients/AuthClient"

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        res.status(400).json({ message: "Missing authorization header" })
        return
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
        res.status(400).json({ message: "Missing token on authorization header" })
        return
    }

    const { data, error } = await SupabaseClient.auth.getUser(token)
    if (!data || error) {
        res.status(401).json({ message: "No Authorized" })
        return
    }

    next()
}
