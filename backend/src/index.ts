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

export const rooms = new Map()
wss.on("connection", (ws) => {
    const clientId = nanoid(6);
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
                handleCreateRoom({clientId, ws});
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
        console.log("Client disconnected");
    })

    ws.on("error", (error) => {
        console.error(`WebSocket error: ${error}`);
    })
})

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

