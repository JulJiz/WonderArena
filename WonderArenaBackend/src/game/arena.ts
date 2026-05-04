interface Player {
    id: string
    x: number
    y: number
}

export const ARENA_RADIUS = 180
const ARENA_CENTER = { x: 200, y: 200 }
const PLAYER_RADIUS = 18
const MOVE_SPEED = 3

const players = new Map<string, Player>()

export const addPlayer = (id: string): void => {
    const index = players.size
    const angle = (index / Math.max(index, 1)) * Math.PI * 2
    const spawnRadius = 80
    players.set(id, {
        id,
        x: ARENA_CENTER.x + Math.cos(angle) * spawnRadius,
        y: ARENA_CENTER.y + Math.sin(angle) * spawnRadius,
    })
}

export const removePlayer = (id: string): void => {
    players.delete(id)
}

export const movePlayer = (id: string, dx: number, dy: number): boolean => {
    const player = players.get(id)
    if (!player) return false

    player.x += dx * MOVE_SPEED
    player.y += dy * MOVE_SPEED

    const distFromCenter = Math.sqrt(
        (player.x - ARENA_CENTER.x) ** 2 +
        (player.y - ARENA_CENTER.y) ** 2
    )

    if (distFromCenter > ARENA_RADIUS - PLAYER_RADIUS) {
        players.delete(id)
        return true
    }

    return false
}

export const resolveCollisions = (): void => {
    const list = Array.from(players.values())
    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            const a = list[i]
            const b = list[j]
            const dx = b.x - a.x
            const dy = b.y - a.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < PLAYER_RADIUS * 2 && dist > 0) {
                const overlap = (PLAYER_RADIUS * 2 - dist) / 2
                const nx = dx / dist
                const ny = dy / dist
                a.x -= nx * overlap
                a.y -= ny * overlap
                b.x += nx * overlap
                b.y += ny * overlap
            }
        }
    }
}

export const getState = (): Player[] => {
    return Array.from(players.values())
}

export const getWinner = (): string | null => {
    if (players.size === 1) {
        return Array.from(players.keys())[0]
    }
    return null
}
