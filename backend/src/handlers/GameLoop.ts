import { rooms } from "..";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../constants/constants";
import type { PlayerState, RoomState } from "../types";

const GameLoop = () => {
  for (const room of rooms.values()) {
    if (room.status !== "playing") continue;

    let collisionDetail = { occurred: false, winner: null as string | null };
    for (const player of room.players.values()) {
      moveSnakeHead(player);
    }

    for (const [playerId, player] of room.players.entries()) {
      const hasCollision =
        checkWallCollision(player) ||
        checkSelfCollision(player) ||
        checkPlayerCollisionWithOthers(player, room);

      if (hasCollision) {
        collisionDetail.occurred = true;
        for (const otherPlayerId of room.players.keys()) {
          if (playerId !== otherPlayerId) {
            collisionDetail.winner = otherPlayerId;
            break;
          }
        }
        break;
      }
    }

    if (collisionDetail.occurred) {
      room.status = "ended";
      continue;
    }

    let foodEaten = false;
    for (const player of room.players.values()) {
      if (checkFoodCollision(player, room.food)) {
        player.score += 1;
        foodEaten = true;
      } else {
        player.snake.pop();
      }
    }
    if (foodEaten) {
      room.food = generateNewFood(room);
    }

    broadcastGameState(room);
  }
};

export const handleGameLoop = () => {
  setInterval(GameLoop, 150);
};

// ----- Helper functions -----

const moveSnakeHead = (player: PlayerState) => {
  const head = player.snake[0];
  if (!head) return;
  const newHead = calculateNewHead(head, player.direction);
  player.snake.unshift(newHead);
};

const calculateNewHead = (
  head: { x: number; y: number },
  direction: string
) => {
  switch (direction) {
    case "up":
      return { x: head.x, y: head.y - 1 };
    case "down":
      return { x: head.x, y: head.y + 1 };
    case "left":
      return { x: head.x - 1, y: head.y };
    case "right":
      return { x: head.x + 1, y: head.y };
    default:
      return head;
  }
};

const generateNewFood = (room: RoomState) => {
  let newFoodPosition = { x: 0, y: 0 };
  let isOnSnake = false;

  do {
    isOnSnake = false;
    newFoodPosition = {
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT),
    };
    for (const player of room.players.values()) {
      for (const segment of player.snake) {
        if (
          segment.x === newFoodPosition.x &&
          segment.y === newFoodPosition.y
        ) {
          isOnSnake = true;
          break;
        }
      }
      if (isOnSnake) break;
    }
  } while (isOnSnake);

  return newFoodPosition;
};

const checkSelfCollision = (player: PlayerState): boolean => {
  const head = player.snake[0];
  const body = player.snake.slice(1);

  for (const segment of body) {
    if (head?.x === segment.x && head?.y === segment.y) {
      return true;
    }
  }
  return false;
};

const checkWallCollision = (player: PlayerState): boolean => {
  const head = player.snake[0];
  if (!head) return false;
  return (
    head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT
  );
};

const checkFoodCollision = (
  player: PlayerState,
  food: { x: number; y: number }
): boolean => {
  const head = player.snake[0];
  if (!head) return false;
  return head.x === food.x && head.y === food.y;
};

const checkPlayerCollision = (
  player1: PlayerState,
  player2: PlayerState
): boolean => {
  if (player1 === player2) return false;
  const head1 = player1.snake[0];

  for (const segment of player2.snake) {
    if (head1?.x === segment.x && head1?.y === segment.y) {
      return true;
    }
  }
  return false;
};

const checkPlayerCollisionWithOthers = (player: PlayerState, room: RoomState): boolean => {
    for (const [otherPlayerId, otherPlayer] of room.players.entries()) {
        if (player === otherPlayer) continue; // Compare player objects directly
        if (checkPlayerCollision(player, otherPlayer)) {
            return true;
        }
    }
    return false;
};

const broadcastGameState = (room: RoomState) => {
  const playersData = Array.from(room.players.entries()).map(
    ([playerId, playerState]) => ({
      id: playerId,
      snake: playerState.snake,
      score: playerState.score,
    })
  );

  const message = {
    type: "gameStateUpdate",
    payload: {
      players: playersData,
      food: room.food,
      status: room.status,
    },
  };

  const messageString = JSON.stringify(message);

  for (const player of room.players.values()) {
    try {
      player.ws.send(messageString);
    } catch (error) {
      console.error("Failed to send game state to player:", error);
    }
  }
};
