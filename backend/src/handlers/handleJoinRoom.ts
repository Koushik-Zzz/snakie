import { clients, rooms } from "..";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../constants/constants";
import type { PlayerState, RoomState } from "../types";
import type { WebSocket } from "ws";
import { broadcastGameState } from "./broadcastGameState";

/**
 * 
 * @param clientId ID of the player joining the room
 * @param ws WebSocket connection of the player
 * @param roomId ID of the room to join
 */
export function handleJoinRoom({ clientId, ws, roomId }: { clientId: string, ws: WebSocket, roomId: string }) {
    const room = rooms.get(roomId)
    if (!room) {
        ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Room not found" }
        }))
        return;
    }

    
    if (room.state.players.size >= 2) {
        ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Room was full"}
        }))
        return;
    }

    const newPlayerState: PlayerState = {
        snake: [generateStartPosition(room.state)],
        direction: 'left',
        score: 0,
        ws: ws
    };
    clients.set(ws, { clientId, roomId });
    room.addPlayer(clientId, newPlayerState);
}

const generateStartPosition = (room: RoomState): { x: number; y: number } => {
    let position = { x: 0, y: 0 };
    let isOnSnake: boolean;

    do {
        isOnSnake = false;
        position = {
            x: Math.floor(Math.random() * BOARD_WIDTH),
            y: Math.floor(Math.random() * BOARD_HEIGHT)
        };
        for (const player of room.players.values()) {
            for (const segment of player.snake) {
                if (segment.x === position.x && segment.y === position.y) {
                    isOnSnake = true;
                    break
                }
            }
            if (isOnSnake) break;
        }
    } while (isOnSnake);

    return position
}