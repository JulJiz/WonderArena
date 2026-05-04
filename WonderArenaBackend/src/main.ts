import express, { Request, Response } from "express"
import { createServer } from "http"
import cors from "cors"
import "dotenv/config"

import { AuthRouter } from "./routes/auth/auth.router"
import { GameRouter } from "./routes/game/game.router"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/auth", AuthRouter)
app.use("/game", GameRouter)

app.get("/", (_req: Request, res: Response) => {
    res.send("WonderArena Backend")
})

const rawServer = createServer(app)

rawServer.listen(8080, () => {
    console.log("Server running on port 8080")
})
