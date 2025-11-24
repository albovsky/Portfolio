"use client"

import { motion } from "framer-motion"

const videos = [
  { id: 1, title: "The Awakening", duration: "02:14" },
  { id: 2, title: "Urban Rhythm", duration: "01:30" },
  { id: 3, title: "Lost in Time", duration: "03:45" },
  { id: 4, title: "Digital Dreams", duration: "01:15" },
]

export default function VideoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 px-6 md:px-12">
      <motion.h1 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-9xl font-bold tracking-tighter mb-12 text-transparent stroke-text hover:text-primary transition-colors duration-500 cursor-default"
        style={{ WebkitTextStroke: "1px var(--foreground)" }}
      >
        VIDEO
      </motion.h1>

      <div className="flex flex-col gap-0 pb-24">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group border-t border-white/10 py-12 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors px-4"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter group-hover:translate-x-4 transition-transform duration-300">
              {video.title}
            </h2>
            <span className="font-mono text-sm text-muted-foreground group-hover:text-primary transition-colors">
              {video.duration}
            </span>
          </motion.div>
        ))}
        <div className="border-t border-white/10" />
      </div>
    </div>
  )
}
