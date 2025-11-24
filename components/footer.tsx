"use client"

import { useState } from "react"
import { SecretGame } from "@/components/secret-game"

export function Footer() {
  const [showGame, setShowGame] = useState(false)

  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Albovsky
          </a>
          . The source code is available on{" "}
          <a
            href="https://github.com/albovsky"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
          <button
            onClick={() => setShowGame(true)}
            className="ml-2 text-muted-foreground/20 hover:text-red-500 transition-colors cursor-help text-xs"
          >
            (don't click it)!
          </button>
        </p>
      </div>
      
      <SecretGame isOpen={showGame} onClose={() => setShowGame(false)} />
    </footer>
  )
}
