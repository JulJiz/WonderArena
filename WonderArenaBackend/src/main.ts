import express, { Request, Response } from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import "dotenv/config"

import { AuthRouter } from "./routes/auth/auth.router"
import { GameRouter } from "./routes/game/game.router"
import { SupabaseClient } from "./clients/AuthClient"
import { addPlayer, getState, getWinner, movePlayer, removePlayer, resolveCollisions } from "./game/arena"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/auth", AuthRouter)
app.use("/game", GameRouter)

app.get("/", (_req: Request, res: Response) => {
    res.send("WonderArena Backend")
})

const rawServer = createServer(app)

const io = new Server(rawServer, {
    path: "/socket",
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.use(async (socket, next) => {
    const token = socket.handshake.auth.token
    if (typeof token !== "string") {
        next(new Error("Unauthorized"))
        return
    }

    const { data, error } = await SupabaseClient.auth.getUser(token)
    if (error || !data.user) {
        next(new Error("Unauthorized"))
        return
    }

    next()
})

io.on("connection", (socket) => {
    addPlayer(socket.id)
    io.emit("game-update", { players: getState() })

    socket.on("player-move", (payload: { dx?: unknown, dy?: unknown }) => {
        const dx = Number(payload?.dx)
        const dy = Number(payload?.dy)
        if (!Number.isFinite(dx) || !Number.isFinite(dy)) return

        const wasEliminated = movePlayer(socket.id, dx, dy)
        resolveCollisions()

        io.emit("game-update", { players: getState() })

        if (wasEliminated) {
            io.emit("player-eliminated", { id: socket.id })
        }

        const winner = getWinner()
        if (winner) {
            io.emit("game-over", { winner })
        }
    })

    socket.on("disconnect", () => {
        removePlayer(socket.id)
        io.emit("game-update", { players: getState() })
    })
})

rawServer.listen(8080, () => {
    console.log("Server running on port 8080")
})
