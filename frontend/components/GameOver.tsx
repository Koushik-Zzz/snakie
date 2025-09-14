"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star, RotateCcw } from "lucide-react"

export default function GameOverModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Modal */}
      <Card className="relative w-full max-w-md glassmorphism-strong shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Trophy className="h-16 w-16 text-primary neon-glow" />
              <Star className="absolute -top-2 -right-2 h-6 w-6 text-secondary animate-pulse" />
            </div>
          </div>

          <CardTitle className="text-3xl font-bold text-balance">
            <span className="text-primary neon-glow">VICTORY!</span>
          </CardTitle>
          <p className="text-lg text-muted-foreground mt-2">Congratulations!</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Final Score */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Final Score</p>
            <p className="text-4xl font-bold text-primary neon-glow">0</p>
          </div>

          {/* Leaderboard submission */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Submit your score to the leaderboard</p>
              <Input
                type="text"
                placeholder="Enter your name"
                value={""}
                className="text-center text-lg font-medium bg-input/50 border-border/50 focus:border-primary focus:ring-primary/50"
                maxLength={20}
                readOnly
              />
            </div>
            <Button className="w-full h-12 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground neon-glow-secondary transition-all duration-300">
              Submit to Leaderboard
            </Button>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            <Button className="h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground neon-glow transition-all duration-300">
              Play Again
            </Button>
            <Button
              variant="outline"
              className="h-10 border-border/50 hover:border-secondary hover:bg-secondary/10 transition-all duration-300 bg-transparent"
            >
              Back to Lobby
            </Button>
          </div>

          {/* Stats or achievements could go here */}
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">Keep practicing!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
