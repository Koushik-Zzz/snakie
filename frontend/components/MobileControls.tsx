"use client"

import { Button } from "@/components/ui/button"
import { useGameStore } from "@/store/gameStore"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

export default function MobileControls() {
  const { changeDirection } = useGameStore()
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden">
      <div className="glassmorphism-strong rounded-2xl p-4 shadow-2xl">
        <div className="grid grid-cols-3 gap-2 w-32 h-32">
          {/* Top row - Up button */}
          <div></div>
          <Button
            onClick={() => changeDirection('up')}
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 neon-glow transition-all duration-200 active:scale-95"
          >
            <ChevronUp className="h-5 w-5 text-primary" />
          </Button>
          <div></div>

          {/* Middle row - Left and Right buttons */}
          <Button
            onClick={() => changeDirection('left')}
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 neon-glow transition-all duration-200 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 text-primary" />
          </Button>
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary/50"></div>
          </div>
          <Button
            onClick={() => changeDirection('right')}
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 neon-glow transition-all duration-200 "
          >
            <ChevronRight className="h-5 w-5 text-primary" />
          </Button>

          {/* Bottom row - Down button */}
          <div></div>
          <Button
            onClick={() => changeDirection('down')}
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 neon-glow transition-all duration-200 active:scale-95"
          >
            <ChevronDown className="h-5 w-5 text-primary" />
          </Button>
          <div></div>
        </div>
      </div>
    </div>
  )
}
