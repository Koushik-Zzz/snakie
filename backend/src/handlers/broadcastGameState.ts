import type { RoomState } from "../types";

export const broadcastGameState = (room: RoomState, winnerId: string | null = null) => {
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
      winner: winnerId
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
