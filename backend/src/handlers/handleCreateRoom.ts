import { nanoid } from "nanoid"
import type { PlayerState, RoomState } from "../types";
import { clients, rooms } from "..";
import type { WebSocket } from "ws";
import { Room } from "../Room";

/**
 * @param clientId ID of the player creating the room
 * @param ws WebSocket connection of the player
 */
export const handleCreateRoom = ({ clientId, ws }: { clientId: string, ws: WebSocket }) => {
    try {
        const room = new Room();
        console.log(`Creating room with ID: ${room.id} for client: ${clientId}`);
        const playersState: PlayerState = {
            snake: [{ x: 10, y: 10 }],
            direction: 'right',
            score: 0,
            ws: ws
        };

        room.addPlayer(clientId, playersState);
        clients.set(ws, { clientId, roomId: room.id });
        rooms.set(room.id, room);
        ws.send(JSON.stringify({
            type: "roomCreated",
            payload: { roomId: room.id, playerId: clientId }
        }));

    } catch (error) {
        console.error("Error creating room:", error);
        ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Failed to create room" }
        }));
    }
}