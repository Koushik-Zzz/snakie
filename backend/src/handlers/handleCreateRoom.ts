import { nanoid } from "nanoid"
import type { PlayerState, RoomState } from "../types";
import { clients, rooms } from "..";
import type { WebSocket } from "ws";

/**
 * @param clientId ID of the player creating the room
 * @param ws WebSocket connection of the player
 */
export const handleCreateRoom = ({ clientId, ws }: { clientId: string, ws: WebSocket }) => {
    try {
        const roomId = nanoid(6);
        console.log(`Creating room with ID: ${roomId} for client: ${clientId}`);
        const playersState: PlayerState = {
            snake: [{ x: 10, y: 10 }],
            direction: 'right',
            score: 0,
            ws: ws
        };
    
        const roomState: RoomState = {
            players: new Map([[clientId, playersState]]),
            food: { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) },
            status: 'waiting'
        }
        clients.set(ws, { clientId, roomId })
        rooms.set(roomId, roomState);
        ws.send(JSON.stringify({
            type: "roomCreated",
            payload: { roomId: roomId, playerId: clientId }
        }));

    } catch (error) {
        console.error("Error creating room:", error);
        ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Failed to create room" }
        }));
    }
}