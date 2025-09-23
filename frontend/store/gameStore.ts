import { create } from 'zustand'

interface Player {
    id: string;
    snake: {x: number; y: number}[];
    score: number;
}

interface GameState {
    players: Player[];
    food: { x: number; y: number } | null;
    status: 'waiting' | 'playing' | 'ended';
    winner?: string | null;
}

interface StoreState {
    websocket: WebSocket | null;
    gameState: GameState | null;
    playerId: string | null;
    roomId: string | null;

    playerName: string;
    error: string | null;

    connect: () => void;
    setPlayerName: (name: string) => void;
    createRoom: () => void;
    joinRoom: (roomId: string) => void;
    changeDirection: (direction: 'up' | 'down' | 'left' | 'right') => void;
    disconnect: () => void;
}


export const useGameStore = create<StoreState>((set, get) => ({
  websocket: null,
  gameState: null,
  playerId: null,
  roomId: null,
  playerName: '',
  error: null,

  setPlayerName: (name) => set({ playerName: name }),

  connect: () => {
    if (get().websocket) return; 

    const socket = new WebSocket('ws://localhost:8080/');

    socket.onopen = () => {
        console.log('WebSocket connected');
        set({ websocket: socket, error: null });
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data)

        switch (message.type) {
            case 'roomCreated':
                set({ roomId: message.payload.roomId, playerId: message.payload.playerId, error: null });
                break;
            case 'gameStateUpdate':
                set({ gameState: message.payload });
                break;
            // case 'updatePlayers':
                // set({ gameState: {...(get().gameState || { players: [], food: null, gameStatus: 'waiting' }), players: message.payload } });
                // break;
            case 'error':
                set({ error: message.payload.message });
                break;
        }
    }

    socket.onerror = () => {
        set({ error: 'WebSocket connection error.' });
    };

    socket.onclose = () => {
        console.log('WebSocket disconnected');
        set({ websocket: null, gameState: null, playerId: null, roomId: null });
    }
  },

  createRoom: () => {
    const ws = get().websocket;
    if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'createRoom' }));
    }
  },

  joinRoom: (roomId) => {
    const ws = get().websocket;
    if (ws?.readyState === WebSocket.OPEN) {
        set({ roomId: roomId, error: null })
        ws.send(JSON.stringify({ type: 'joinRoom', payload: { roomId } }));
    }
  },

  changeDirection: (direction) => {
    const ws = get().websocket;
    if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'changeDirection', payload: { direction } }));
    }
  },

  disconnect: () => {
    const ws = get().websocket;
    if (ws) {
        ws.close();
        set({ websocket: null, gameState: { players: [], food: null, status: 'waiting' }, playerId: null, roomId: null });
    }
  }
}))