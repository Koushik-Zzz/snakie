import { WebSocket } from 'ws';

export type ClientData = {
    clientId: string, 
    ws: WebSocket
}

export type PlayerState = {
    snake: { x: number, y: number }[],
    direction: 'up' | 'down' | 'left' | 'right',
    score: number,
    ws: WebSocket 
};

export type RoomState = {
    players: Map<string, PlayerState>,
    food: { x: number, y: number },
    status: 'waiting' | 'playing' | 'ended'
};