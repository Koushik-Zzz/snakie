import { nanoid } from "nanoid";
import type { RoomState, PlayerState } from "./types";
import { rooms } from ".";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants/constants";
import { broadcastGameState } from "./handlers/broadcastGameState";

export class Room {
    public id: string;
    public state: RoomState;
    private gameLoopId: NodeJS.Timeout | null = null;

    constructor() {
        this.id = nanoid(6);
        this.state = {
            players: new Map(),
            food: { x: 0, y: 0 },
            status: 'waiting',
        }
        this.state.food = this.generateNewFood()
    }

    addPlayer(clientId: string, playerState: PlayerState) {
        this.state.players.set(clientId, playerState);
        if (this.state.players.size === 2) {
            this.startGame();
        } else {
            broadcastGameState(this.state);
        }
    }

    removePlayer(clientId: string) {
        this.state.players.delete(clientId);
        if (this.state.players.size < 2 && this.state.status === 'playing') {
            const winnerId = this.state.players.keys().next().value || null;
            this.endGame(winnerId)
        } else {
            broadcastGameState(this.state)
        }
    }

    changePlayerDirection(
        clientId: string,
        newDirection: 'up' | 'down' | 'left' | 'right'
    ) {
        const player = this.state.players.get(clientId)
        if (!player) return;

        const isOppositeDirection = (current: string, newDir: string) => {
            const opposites = { 
                up: 'down', 
                down: 'up', 
                left: 'right', 
                right: 'left' 
            };
            return opposites[current as keyof typeof opposites] === newDir
        }

        if (!isOppositeDirection(player.direction, newDirection)) {
            player.direction = newDirection
        }
    }

    startGame() {
        this.state.status = 'playing';

        if (this.gameLoopId) {
            clearInterval(this.gameLoopId);
        }
        this.gameLoopId = setInterval(() => this.gameLoop(), 150);
        broadcastGameState(this.state);
    }

    endGame(winnerId: string | null) {
        if (this.gameLoopId) {
            clearInterval(this.gameLoopId);
            this.gameLoopId = null;
        }
        this.state.status = 'ended';
        broadcastGameState(this.state, winnerId);
    }

    reset() {
        let i = 0;
        for (const player of this.state.players.values()) {
            player.snake = [i === 0 ? { x: 10, y:10 } : { x: 30, y:30 }]
            player.score = 0;
            player.direction = 'right';
            i++;
        }

        this.state.food = this.generateNewFood()

        this.startGame()
    }

    private gameLoop() {
        if (this.state.status !== 'playing') return;

        const previousHeads = new Map<string, { x: number, y: number }>();
        for (const [playerId, player] of this.state.players.entries()) {
            if (player.snake[0]) {
                previousHeads.set(playerId, { ...player.snake[0] });
            }
        }

        for (const player of this.state.players.values()) {
            this.moveSnakeHead(player);
        }

        let collidedPlayers = new Set<string>();
        const playerIds = Array.from(this.state.players.keys());

        if (playerIds.length === 2) {
            const player1 = this.state.players.get(playerIds[0]!);
            const player2 = this.state.players.get(playerIds[1]!);
            if (
                player1?.snake[0]?.x === player2?.snake[0]?.x &&
                player1?.snake[0]?.y === player2?.snake[0]?.y
            ) {
                collidedPlayers.add(playerIds[0]!);
                collidedPlayers.add(playerIds[1]!);
            }
        }

        for (const [playerId, player] of this.state.players.entries()) {
            if (this.checkCollision(player, previousHeads)) {
                collidedPlayers.add(playerId);
            }
        }

        if (collidedPlayers.size > 0) {
            let winnerId: string | null = null;
            
            if (this.state.players.size - collidedPlayers.size === 1) {
                winnerId = playerIds.find(id => !collidedPlayers.has(id)) || null;
            } 
            
            else if (collidedPlayers.size === this.state.players.size) {
                const players = Array.from(this.state.players.values())

                if (players.length > 1 && players[0]?.score !== players[1]?.score) {
                    winnerId = players.sort((a, b) => b.score - a.score)[0]?.ws.clientId;
                }
            }

            this.endGame(winnerId);
            return;
        }

        let foodEaten = false;
        for (const player of this.state.players.values()) {
            if (this.checkFoodCollision(player)) {
                player.score += 1;
                foodEaten = true;
            } else {
                player.snake.pop()
            }
        }

        if (foodEaten) {
            this.state.food = this.generateNewFood()
        }

        broadcastGameState(this.state);

    }


// ----- Helper functions -----

    private moveSnakeHead = (player: PlayerState) => {
        const head = player.snake[0];
        if (!head) return;
        const newHead = this.calculateNewHead(head, player.direction);
        player.snake.unshift(newHead);
    }

    private calculateNewHead = (head: { x: number, y: number }, direction: 'up' | 'down' | 'left' | 'right') => {
        switch (direction) {
            case 'up': return { x: head.x, y: head.y - 1 };
            case 'down': return { x: head.x, y: head.y + 1 };
            case 'left': return { x: head.x - 1, y: head.y };
            case 'right': return { x: head.x + 1, y: head.y };
            default: return head;
        }
    }

    private generateNewFood = () => {
        let newFoodPosition: { x: number, y: number };
        let isOnSnake: boolean;
        do {
            isOnSnake = false;
            newFoodPosition = {
                x: Math.floor(Math.random() * BOARD_WIDTH),
                y: Math.floor(Math.random() * BOARD_HEIGHT),
            };
            for (const player of this.state.players.values()) {
                for (const segment of player.snake) {
                    if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
                        isOnSnake = true;
                        break;
                    }
                }
                if (isOnSnake) break;
            }
        } while (isOnSnake);
        return newFoodPosition;
    }

    private checkSelfCollision = (player: PlayerState): boolean => {
        const head = player.snake[0];
        if (!head) return false;
        const body = player.snake.slice(1);
        for (const segment of body) {
            if (segment.x === head.x && segment.y === head.y) {
                return true;
            }
        }
        return false;
    }

    private checkWallCollision = (player: PlayerState): boolean => {
        const head = player.snake[0];
        if (!head) return false;
        return head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT;
    }

    private checkFoodCollision(player: PlayerState): boolean {
        const head = player.snake[0];
        if (!head) return false;
        return head.x === this.state.food.x && head.y === this.state.food.y;
    }

    private checkCollision(player: PlayerState, oldHeads: Map<string, { x: number; y: number }>): boolean {
        return (
            this.checkWallCollision(player) ||
            this.checkSelfCollision(player) ||
            this.checkPlayerCollisionWithOthers(player, oldHeads)
        );
    }

    private checkPlayerCollisionWithOthers = (player: PlayerState, oldHeads: Map<string, { x: number, y: number }>): boolean => {
        const head = player.snake[0];
        if (!head) return false;

        for (const otherPlayer of this.state.players.values()) {
            if (otherPlayer === player) continue;

            if (otherPlayer.snake.some(segment => segment.x == head.x && segment.y === head.y)) {
                return true;
            }
        }
        return false;
    }
}