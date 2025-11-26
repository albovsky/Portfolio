"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const galleries = [
  { 
    id: 101, 
    title: "Bin 4 Burger Lounge", 
    client: "Bin 4 Burger Lounge",
    tags: ["Food", "Interior"], 
    year: "2023",
    slug: "bin-4-burger-lounge",
    image: "/projects/photo/bin-4-burger-lounge/cover.jpg" 
  },
  { 
    id: 102, 
    title: "Hi Five Chicken", 
    client: "Hi Five Chicken",
    tags: ["Food", "Commercial"], 
    year: "2023",
    slug: "hi-five-chicken",
    image: "/projects/photo/hi-five-chicken/cover.jpg" 
  },
  { 
    id: 1, 
    title: "Neon City", 
    client: "Personal Project",
    tags: ["Urban", "Neon"], 
    year: "2024",
    slug: "neon-city",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop" 
  },
  { 
    id: 2, 
    title: "Silent Hills", 
    client: "Personal Project",
    tags: ["Landscape", "Mood"], 
    year: "2023",
    slug: "silent-hills",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop" 
  },
  { 
    id: 3, 
    title: "Abstract Faces", 
    client: "Personal Project",
    tags: ["Portrait", "Abstract"], 
    year: "2024",
    slug: "abstract-faces",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop" 
  },
  { 
    id: 4, 
    title: "Night Life", 
    client: "Personal Project",
    tags: ["Street", "Night"], 
    year: "2023",
    slug: "night-life",
    image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1974&auto=format&fit=crop" 
  },
  { 
    id: 5, 
    title: "Geometry", 
    client: "Personal Project",
    tags: ["Architecture", "Minimal"], 
    year: "2024",
    slug: "geometry",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop" 
  },
  { 
    id: 6, 
    title: "Shadows", 
    client: "Personal Project",
    tags: ["Experimental", "Shadow"], 
    year: "2022",
    slug: "shadows",
    image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=2070&auto=format&fit=crop" 
  },
]

export default function PhotoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 px-6 md:px-12 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 max-w-4xl"
      >
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
          Selected Works
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A collection of moments captured through the lens. Exploring light, shadow, and the human experience.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleries.map((gallery, index) => (
          <Link href={`/photo/${gallery.slug}`} key={gallery.id} className="block group">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              {/* Image Container - Slick Rounded Window */}
              <div className="aspect-video overflow-hidden rounded-[2.5rem] relative border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: [0.32, 0.725, 0.06, 0.965] }}
                  src={gallery.image}
                  alt={gallery.title}
                  className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
                />
                
                {/* Floating Chip - Metadata */}
                <div className="absolute top-6 left-6 z-20 flex flex-col items-start gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                  {/* Title & Client Chip */}
                  <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex flex-col">
                    <span className="text-lg font-bold text-white tracking-tight leading-none mb-1">
                      {gallery.title}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                      <span>{gallery.client}</span>
                      <span className="w-1 h-1 rounded-full bg-white/30" />
                      <span>{gallery.year}</span>
                    </div>
                  </div>

                  {/* Tags Chip */}
                  <div className="flex gap-2">
                    {gallery.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
