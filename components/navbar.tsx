"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 mix-blend-difference text-white pointer-events-none"
    >
      <Link href="/" className="pointer-events-auto">
        <img 
          src="/logos/AS_LogoMini_TP%20Small.png" 
          alt="ALBOVSKY" 
          className="h-18 w-auto object-contain" 
        />
      </Link>
      
      <nav className="flex items-center gap-8 pointer-events-auto">
        {["Photo", "Video", "Motion", "Toolbox"].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className="text-sm font-mono uppercase tracking-widest hover:underline underline-offset-4 decoration-primary decoration-2"
          >
            {item}
          </Link>
        ))}
        <Button variant="outline" size="sm" className="rounded-none border-white/20 bg-transparent hover:bg-white hover:text-black transition-colors font-mono uppercase text-xs hidden md:inline-flex" asChild>
            <Link href="https://github.com/albovsky" target="_blank">
                GitHub
            </Link>
        </Button>
      </nav>
    </motion.header>
  )
}
