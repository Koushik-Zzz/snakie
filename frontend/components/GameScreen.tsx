"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import MobileControls from "@/components/MobileControls"

export default function GameScreen() {
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
          variant="outline"
          className="border-border/50 hover:border-primary hover:bg-primary/10 bg-transparent"
        >
          ← Back to Lobby
        </Button>

        <Card className="glassmorphism px-4 py-2">
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#a3e635", boxShadow: `0 0 8px #a3e635` }}
              ></div>
              <span className="font-medium">Player 1:</span>
              <span className="font-bold text-primary">0</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#f97316", boxShadow: `0 0 8px #f97316` }}
              ></div>
              <span className="font-medium">Player 2:</span>
              <span className="font-bold text-primary">0</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Game canvas */}
      <div className="relative">
        <canvas
          width={400}
          height={400}
          className="border-2 border-primary/50 rounded-lg neon-glow bg-gray-900"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary mb-2">Game Paused</h3>
            <p className="text-muted-foreground">Use arrow keys to play</p>
          </div>
        </div>
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
