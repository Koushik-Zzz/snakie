import express from "express";
import { createServer } from "http"
import { nanoid } from "nanoid";
import { WebSocket, WebSocketServer } from "ws";
import { handleCreateRoom } from "./handlers/handleCreateRoom";
import { handleJoinRoom } from "./handlers/handleJoinRoom";
import { messageSchema } from "./types/validation";
import { Room } from "./Room";

const PORT = 8080;
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server })

export const rooms = new Map<string, Room>();  // this room array will hold all the rooms state
export const clients = new Map<WebSocket, { clientId: string, roomId: string | null }>(); 


wss.on("connection", (ws) => {
    const clientId = nanoid(6); // this player's id when a new connection is made we give them a unique id
    clients.set(ws, { clientId, roomId: null })
    console.log("Client connected");

    ws.on("message", (rawMessages) => {
        console.log(`Received message: ${rawMessages}`);
        let rawData;
        try {
            rawData = JSON.parse(rawMessages.toString())
        } catch (error) {
            console.error("Failed to parse message", rawMessages.toString())
            return;
        }

        const validateMsg = messageSchema.safeParse(rawData);

        if (!validateMsg.success) {
            console.error("Invalid message", validateMsg.error)
            return;
        }

        const messages = validateMsg.data;


        const clientData = clients.get(ws);
        if (!clientData) {
            return;
        }
        
        switch (messages.type) {
            case "createRoom":
                handleCreateRoom({ clientId, ws });
                break;
            case "joinRoom":
                handleJoinRoom({ clientId, ws, roomId: messages.payload.roomId })
                break;
            case "changeDirection":
                if (clientData.roomId) {
                    const room = rooms.get(clientData.roomId)
                    room?.changePlayerDirection(clientData.clientId, messages.payload.direction)
                }
                break;

            default:
                console.error("Unknown message type:", (messages as any).type);
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
                room.removePlayer(clientId)

                if (room.state.players.size === 0) {
                    rooms.delete(roomId)
                    console.log(`Room ${roomId} is empty and has been deleted.`)
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