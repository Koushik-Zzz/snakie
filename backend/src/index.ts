import express from "express";
import { createServer } from "http"
import { nanoid } from "nanoid";
import { WebSocketServer } from "ws";
import { handleCreateRoom } from "./handlers/handleCreateRoom";
import { handleJoinRoom } from "./handlers/handleJoinRoom";
const PORT = 8080;
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server })

export const rooms = new Map() // this room array will hold all the rooms state
export const clients = new Map(); 


wss.on("connection", (ws) => {
    const clientId = nanoid(6); // this player's id when a new connection is made we give them a unique id
    clients.set(ws, { clientId, roomId: null })
    console.log("Client connected");

    ws.on("message", (rawMessages) => {
        console.log(`Received message: ${rawMessages}`);
        let messages;
        try {
            messages = JSON.parse(rawMessages.toString())
        } catch (error) {
            console.error("Failed to parse message", rawMessages.toString())
            return;
        }
        
        switch (messages.type) {
            case "createRoom":
                handleCreateRoom({ clientId, ws });
                break;
            case "joinRoom":
                handleJoinRoom({ clientId, ws, roomId: messages.payload.roomId })
                break;
            default:
                console.error("Unknown message type:", messages.type);
                break;
        }
        
    })

    ws.on("close", () => {
        const clientData = clients.get(ws);
        if (!clientData) return;

        console.log(`Client disconnected: ${clientData.clientId}`);

        const { clientId, roomId } = clientData;

        if (roomId) {
            const room = rooms.get(roomId);
            if (room) {
                room.players.delete(clientId)

                if (room.players.size === 0) {
                    rooms.delete(roomId);
                    console.log(`Room ${roomId} is empty and has been deleted.`);
                } else {
                    const remainingPlayerIds = Array.from(room.players.keys());
                    for (const player of room.players.values()) {
                        player.ws.send(JSON.stringify({
                            type: "updatePlayers",
                            payload: { players: remainingPlayerIds }
                        }))
                    }
                }
            }
        }
        clients.delete(ws);
    })

    ws.on("error", (error) => {
        console.error(`WebSocket error: ${error}`);
    })
})

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

