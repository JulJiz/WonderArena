import express from "express"
import AuthController from "./auth.controller"

export const AuthRouter = express.Router()

AuthRouter.post("/signup", AuthController.signup)
AuthRouter.post("/login", AuthController.login)
