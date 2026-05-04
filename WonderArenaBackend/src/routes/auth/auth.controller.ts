import { Request, Response } from "express"
import AuthRepository from "./auth.repository"

const signup = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const response = await AuthRepository.createUser({ email, password })
    res.json(response)
}


export default { signup }
