"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGameStore } from "@/store/gameStore"
import { useState } from "react"
import GameScreen from "@/components/GameScreen"

export default function HomePage() {

  const {
    playerName,
    setPlayerName,
    roomId,
    createRoom,
    joinRoom,
    error
  } = useGameStore()

  const [joinRoomId, setJoinRoomId] = useState("");

  if (roomId) {
    return <GameScreen />;
  }

  const handleJoin = () => {
    if (joinRoomId) {
      joinRoom(joinRoomId)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-primary rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 border-2 border-secondary rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 border-2 border-primary rounded-full animate-pulse delay-500"></div>
      </div>

      <Card className="w-full max-w-md glassmorphism-strong shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-4xl font-bold text-balance neon-glow">SNAKE RIVALS</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">Real-time multiplayer snake game</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Player name input */}
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter Your Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="text-center text-lg font-medium bg-input/50 border-border/50 focus:border-primary focus:ring-primary/50"
              maxLength={20}
              readOnly
            />
          </div>

          {/* Primary actions */}
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={createRoom}
              className="h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground neon-glow transition-all duration-300"
            >
              Create Room
            </Button>

            <Button
              variant="secondary"
              className="h-12 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground neon-glow-secondary transition-all duration-300"
              disabled
            >
              Join Random Game
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or join specific room</span>
            </div>
          </div>

          {/* Join specific room */}
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Enter Room ID"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              className="text-center font-mono bg-input/50 border-border/50 focus:border-secondary focus:ring-secondary/50"
              maxLength={6}
            />

            <Button
              onClick={handleJoin}
              variant="outline"
              className="w-full h-10 border-border/50 hover:border-primary hover:bg-primary/10 transition-all duration-300 bg-transparent"
            >
              Join Room
            </Button>
          </div>
          {error && <p className="text-sm text-center text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
