import express from "express";
import { createServer } from "http"
import { nanoid } from "nanoid";
import { WebSocketServer } from "ws";
const PORT = 8080;
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server })

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        console.log(`Received message: ${message}`);
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

