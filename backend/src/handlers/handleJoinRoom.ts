import { clients, rooms } from "..";
import type { PlayerState } from "../types";
import type { WebSocket } from "ws";

export function handleJoinRoom({ clientId, ws, roomId }: { clientId: string, ws: WebSocket, roomId: string }) {
    if (!rooms.has(roomId)) {
        ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Room not found" }
        }))
    }

    const room = rooms.get(roomId);
    if (room.players.size >= 2) {
        ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Room was full"}
        }))
    }

    const newPlayerState: PlayerState = {
        snake: [{ x: 10, y: 10 }],
        direction: 'right',
        score: 0,
        ws: ws
    };
    clients.set(ws, { clientId, roomId });
    room.players.set(clientId, newPlayerState)

    const allPlayerIds = Array.from(room.players.keys())
    for (const player of room.players.values()) {
        player.ws.send(JSON.stringify({
            type: "updatePlayers",
            payload: { players: allPlayerIds }
        }))
    }

}