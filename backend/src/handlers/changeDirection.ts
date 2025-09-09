import { clients, rooms } from ".."

/**
 * @param clientId ID of the player changing direction
 * @param direction New direction to set ('up', 'down', 'left', 'right')
 */
export const changeDirection = ({ clientId, roomId, direction}: { clientId: string, roomId: string, direction: 'up' | 'down' | 'left' | 'right' }) => {
    
    const room = rooms.get(roomId);
    if (!room) {
    console.error("Room not found for client:", clientId);
    return;
    }

    const player = room.players.get(clientId);
    if (!player) {
    console.error("Player not found in room:", roomId);
    return;
    }

    const isOppositeDirection = (current: string, newDir: string) => {

    const opposites = {
    'up': 'down',
    'down': 'up',
    'left': 'right',
    'right': 'left'
    }

    return opposites[current as keyof typeof opposites] === newDir
    } 

    if (!isOppositeDirection(player.direction, direction)) {
    player.direction = direction;
    console.log(`Player ${clientId} changed direction to ${direction}`)
    } else {
    console.log(`Player ${clientId} attempted to change to opposite direction ${direction}, ignored.`)
    }
}
