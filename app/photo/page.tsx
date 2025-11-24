"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const galleries = [
  { 
    id: 101, 
    title: "Bin 4 Burger Lounge", 
    category: "Food & Interior", 
    year: "2023",
    slug: "bin-4-burger-lounge",
    image: "/projects/photo/bin-4-burger-lounge/cover.jpg" 
  },
  { 
    id: 102, 
    title: "Hi Five Chicken", 
    category: "Food Photography", 
    year: "2023",
    slug: "hi-five-chicken",
    image: "/projects/photo/hi-five-chicken/cover.jpg" 
  },
  { 
    id: 1, 
    title: "Neon City", 
    category: "Urban", 
    year: "2024",
    slug: "neon-city",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop" 
  },
  { 
    id: 2, 
    title: "Silent Hills", 
    category: "Landscape", 
    year: "2023",
    slug: "silent-hills",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop" 
  },
  { 
    id: 3, 
    title: "Abstract Faces", 
    category: "Portrait", 
    year: "2024",
    slug: "abstract-faces",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop" 
  },
  { 
    id: 4, 
    title: "Night Life", 
    category: "Street", 
    year: "2023",
    slug: "night-life",
    image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1974&auto=format&fit=crop" 
  },
  { 
    id: 5, 
    title: "Geometry", 
    category: "Architecture", 
    year: "2024",
    slug: "geometry",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop" 
  },
  { 
    id: 6, 
    title: "Shadows", 
    category: "Experimental", 
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        {galleries.map((gallery, index) => (
          <Link href={`/photo/${gallery.slug}`} key={gallery.id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group cursor-pointer"
            >
              {/* Image Container */}
              <div className="aspect-[4/5] overflow-hidden rounded-lg mb-6 relative">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay" />
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: [0.32, 0.725, 0.06, 0.965] }}
                  src={gallery.image}
                  alt={gallery.title}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Content */}
              <div className="flex justify-between items-start border-t border-white/10 pt-4">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-1 group-hover:text-primary transition-colors">
                    {gallery.title}
                  </h2>
                  <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
                    {gallery.category}
                  </p>
                </div>
                <span className="font-mono text-sm text-muted-foreground">
                  {gallery.year}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
