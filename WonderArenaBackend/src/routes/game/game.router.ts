import express from "express"
import GameController from "./game.controller"

export const GameRouter = express.Router()

GameRouter.get("/state", GameController.getGameState)
