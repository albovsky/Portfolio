"use client"

import { motion } from "framer-motion"

const projects = [
  { id: 1, title: "Kinetic Type", client: "Personal" },
  { id: 2, title: "Brand Reveal", client: "TechCorp" },
  { id: 3, title: "UI Interactions", client: "AppStudio" },
  { id: 4, title: "3D Abstract", client: "ArtGallery" },
  { id: 5, title: "Logo Animation", client: "StartupX" },
]

export default function MotionPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 px-6 md:px-12">
      <motion.h1 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-9xl font-bold tracking-tighter mb-12 text-transparent stroke-text hover:text-primary transition-colors duration-500 cursor-default"
        style={{ WebkitTextStroke: "1px var(--foreground)" }}
      >
        MOTION
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-24">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="aspect-video bg-secondary relative group overflow-hidden rounded-none border border-white/10 hover:border-primary/50 transition-colors"
          >
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:scale-150 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1 group-hover:border-l-black transition-colors" />
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p className="font-mono text-xs text-muted-foreground">{project.client}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
