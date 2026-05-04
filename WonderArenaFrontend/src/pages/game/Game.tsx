import { useRef, useState } from "react"
import { GameCanvas } from "./GameCanvas"

interface Player {
    id: string
    x: number
    y: number
}

export const Game = () => {
    const [players, setPlayers] = useState<Player[]>([])
    const [myId, setMyId] = useState("")
    const [winner, setWinner] = useState<string | null>(null)
    const [eliminated, setEliminated] = useState<string | null>(null)
    const [sensorActive, setSensorActive] = useState(false)
    const sensorActiveRef = useRef(false)
    const latestTiltRef = useRef({ x: 0, y: 0 })


    const moverJugador = (_dx: number, _dy: number) => {
    }

    const initSensor = () => {
    }

    const activarSensor = () => {
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
            {eliminated && <p>Jugador eliminado de la arena</p>}
            {!sensorActive && (
                <button onClick={activarSensor}>Activar sensor</button>
            )}
            {sensorActive && (
                <p>Inclina tu telefono para moverte!</p>
            )}
        </section>
    )
}
