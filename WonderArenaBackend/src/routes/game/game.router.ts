import express from "express"
import GameController from "./game.controller"
import { AuthMiddleware } from "../../middlewares/Auth.middleware"

export const GameRouter = express.Router()

GameRouter.get("/state", AuthMiddleware, GameController.getGameState)
