"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import MobileControls from "@/components/MobileControls"
import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/gameStore";
import GameOverModal from "./GameOver";


const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 500;
const GRID_SIZE = 12.5
const SNAKE_COLORS = ["#a3e635", "#f97316"]; 

export default function GameScreen() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { gameState, changeDirection, playerId, disconnect } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          changeDirection('up');
          break;
        case 'ArrowDown':
          changeDirection('down');
          break;
        case 'ArrowLeft':
          changeDirection('left');
          break;
        case 'ArrowRight':
          changeDirection('right');
          break;
      };
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !gameState) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT)

    if (gameState.food) {
      ctx.fillStyle = '#38bdf8'
      ctx.fillRect(gameState.food.x * GRID_SIZE, gameState.food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10
      ctx.fillRect(gameState.food.x * GRID_SIZE, gameState.food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      ctx.shadowBlur = 0;
    }

    gameState.players.forEach((player, index) => {
      ctx.fillStyle = SNAKE_COLORS[index] || '#a3e635';
      player.snake.forEach((segment, segmentIndex) => {
        if (segmentIndex === 0) {
          ctx.fillStyle = `hsl(${index === 0 ? 80 : 25}, 80%, 60%)`;
        } else {
          ctx.fillStyle = `hsl(${index === 0 ? 80 : 25}, 70%, 50%)`;
        }
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
      })
    })
  }, [gameState])

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Connecting to server...</p>
      </div>
    );
  }

  if (gameState.status === 'ended') {
    return <GameOverModal />;
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-96 h-96 border-4 border-primary rounded-full"
            style={{ animationDuration: "20s" }}
          ></div>
        </div>
      </div>

      {/* Header with scoreboard */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <Button
          onClick={disconnect}
          variant="outline"
          className="border-border/50 hover:border-primary hover:bg-primary/10 bg-transparent"
        >
          ← Back to Lobby
        </Button>

        <Card className="glassmorphism px-4 py-2">
          <div className="flex gap-6 text-sm">
            {gameState.players.map((p, i) => (
              <div className="flex items-center gap-2" key={p.id}>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: SNAKE_COLORS[i] }}
                ></div>
                <span className="font-medium">{p.id === playerId ? "You" : "Opponent"}</span>
                <span className="font-bold text-primary">{p.score}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Game canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={BOARD_WIDTH}
          height={BOARD_HEIGHT}
          className="border-2 border-primary/50 rounded-lg neon-glow bg-gray-900"
        />
        {/* <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary mb-2">Game Paused</h3>
            <p className="text-muted-foreground">Use arrow keys to play</p>
          </div>
        </div> */}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm">
          <span className="hidden md:inline">Use arrow keys to control your snake • </span>
          <span className="md:hidden">Use the controls below • </span>
          Collect blue food to grow and score points
        </p>
      </div>
      <div className="w-full max-w-4xl flex justify-center">
        <MobileControls  />
      </div>
    </div>
  )
}
