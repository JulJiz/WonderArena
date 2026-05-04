import { useEffect, useRef } from "react"

interface Player {
    id: string
    x: number
    y: number
}

interface Props {
    players: Player[]
    myId: string
}

const CANVAS_SIZE = 400
const ARENA_RADIUS = 180
const ARENA_CENTER = CANVAS_SIZE / 2
const PLAYER_RADIUS = 18

export const GameCanvas = ({ players, myId }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

        ctx.beginPath()
        ctx.arc(ARENA_CENTER, ARENA_CENTER, ARENA_RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = "#1a1a2e"
        ctx.fill()
        ctx.strokeStyle = "#555"
        ctx.lineWidth = 3
        ctx.stroke()

        players.forEach((player, index) => {
            const isMe = player.id === myId
            const hue = isMe ? 0 : 210

            ctx.beginPath()
            ctx.arc(player.x, player.y, PLAYER_RADIUS, 0, Math.PI * 2)
            ctx.fillStyle = `hsl(${hue}, 80%, 55%)`
            ctx.shadowColor = `hsl(${hue}, 80%, 70%)`
            ctx.shadowBlur = 12
            ctx.fill()
            ctx.shadowBlur = 0

            ctx.fillStyle = "#fff"
            ctx.font = "bold 11px Arial"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(isMe ? "Tu" : `J${index + 1}`, player.x, player.y)
        })
    }, [players, myId])

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            style={{
                border: "2px solid #333",
                borderRadius: "50%",
                display: "block"
            }}
        />
    )
}
