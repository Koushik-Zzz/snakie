import { nanoid } from "nanoid"
import { rooms } from "..";
import type { ClientData, PlayerState, RoomState } from "../types";

export const handleCreateRoom = ({clientId, ws}: ClientData) => {
    try {
        const roomId = nanoid(6);
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