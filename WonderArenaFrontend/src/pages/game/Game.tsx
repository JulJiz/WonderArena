import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import type { Socket } from "socket.io-client"
import { GameCanvas } from "./GameCanvas"
import { BASE_URL } from "../../consts/api"
import { useAuth } from "../../contexts/AuthProvider"

interface Player {
    id: string
    x: number
    y: number
}

type DeviceMotionEventWithPermission = typeof DeviceMotionEvent & {
    requestPermission?: () => Promise<PermissionState>
}

export const Game = () => {
    const { accessToken } = useAuth()
    const [players, setPlayers] = useState<Player[]>([])
    const [myId, setMyId] = useState("")
    const [winner, setWinner] = useState<string | null>(null)
    const [eliminated, setEliminated] = useState<string | null>(null)
    const [sensorActive, setSensorActive] = useState(false)
    const socketRef = useRef<Socket | null>(null)
    const sensorActiveRef = useRef(false)
    const latestTiltRef = useRef({ x: 0, y: 0 })
    const sensorHandlerRef = useRef<((event: DeviceMotionEvent) => void) | null>(null)
    const moveIntervalRef = useRef<number | null>(null)


    useEffect(() => {
        if (!accessToken) return

        const socket = io(BASE_URL, {
            path: "/socket",
            auth: { token: accessToken }
        })

        socketRef.current = socket

        socket.on("connect", () => {
            setMyId(socket.id ?? "")
        })

        socket.on("game-update", ({ players }: { players: Player[] }) => {
            setPlayers(players)
        })

        socket.on("player-eliminated", ({ id }: { id: string }) => {
            setEliminated(id)
        })

        socket.on("game-over", ({ winner }: { winner: string }) => {
            setWinner(winner)
        })

        return () => {
            socket.disconnect()
            socketRef.current = null
        }
    }, [accessToken])

    useEffect(() => {
        return () => {
            if (sensorHandlerRef.current) {
                window.removeEventListener("devicemotion", sensorHandlerRef.current)
            }

            if (moveIntervalRef.current) {
                window.clearInterval(moveIntervalRef.current)
            }
        }
    }, [])

    const moverJugador = (dx: number, dy: number) => {
        socketRef.current?.emit("player-move", { dx, dy })
    }

    const initSensor = () => {
        if (sensorActiveRef.current) return

        const handleMotion = (event: DeviceMotionEvent) => {
            const acceleration = event.accelerationIncludingGravity ?? event.acceleration
            latestTiltRef.current = {
                x: acceleration?.x ?? 0,
                y: acceleration?.y ?? 0
            }
        }

        window.addEventListener("devicemotion", handleMotion)
        sensorHandlerRef.current = handleMotion
        moveIntervalRef.current = window.setInterval(() => {
            const { x, y } = latestTiltRef.current
            moverJugador(x, y)
        }, 100)

        sensorActiveRef.current = true
        setSensorActive(true)
    }

    const activarSensor = async () => {
        if (!("DeviceMotionEvent" in window)) return

        const DeviceMotion = DeviceMotionEvent as DeviceMotionEventWithPermission
        if (typeof DeviceMotion.requestPermission === "function") {
            const permission = await DeviceMotion.requestPermission()
            if (permission !== "granted") return
        }

        initSensor()
    }

    if (winner) {
        return (
            <section>
                <h1>{winner === myId ? "🏆 ¡Ganaste!" : "💀 ¡Perdiste!"}</h1>
                <p>{winner === myId ? "Eres el ultimo jugador en pie." : "Otro jugador gano la arena."}</p>
            </section>
        )
    }

    return (
        <section>
            <h1>🏟 WonderArena</h1>
            <GameCanvas players={players} myId={myId} />
            {eliminated && <p>Jugador eliminado de la arena: {eliminated}</p>}
            {!sensorActive && (
                <button onClick={activarSensor}>Activar sensor</button>
            )}
            {sensorActive && (
                <p>Inclina tu telefono para moverte!</p>
            )}
        </section>
    )
}
