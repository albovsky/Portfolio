import Image from 'next/image'
import photoMetadata from '@/lib/photo-metadata.json'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// This would ideally come from a shared data source or CMS
const projects = [
  { 
    title: "Bin 4 Burger Lounge", 
    category: "Food & Interior", 
    year: "2023",
    slug: "bin-4-burger-lounge",
  },
  { 
    title: "Hi Five Chicken", 
    category: "Food Photography", 
    year: "2023",
    slug: "hi-five-chicken",
  },
  { title: "Neon City", category: "Urban", year: "2024", slug: "neon-city" },
  { title: "Silent Hills", category: "Landscape", year: "2023", slug: "silent-hills" },
  { title: "Abstract Faces", category: "Portrait", year: "2024", slug: "abstract-faces" },
  { title: "Night Life", category: "Street", year: "2023", slug: "night-life" },
  { title: "Geometry", category: "Architecture", year: "2024", slug: "geometry" },
  { title: "Shadows", category: "Experimental", year: "2022", slug: "shadows" },
]

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)
  
  if (!project) {
    return <div className="min-h-screen flex items-center justify-center">Project not found</div>
  }

  const images = Object.entries(photoMetadata).filter(([src]) => src.startsWith(`/projects/photo/${slug}/`))

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="pt-32 px-6 md:px-12 pb-12">
        <Link 
          href="/photo" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Gallery
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
          {project.title}
        </h1>
        <div className="flex items-center gap-4 text-lg font-mono text-muted-foreground">
          <span>{project.category}</span>
          <span>—</span>
          <span>{project.year}</span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="px-6 md:px-12 pb-24">
        {images.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map(([image, dimensions], index) => (
              <div key={image} className="break-inside-avoid">
                <Image
                  {...dimensions}
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  src={image} 
                  alt={`${project.title} - ${index + 1}`} 
                  className="w-full h-auto rounded-lg hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[40vh] flex items-center justify-center border border-dashed border-border rounded-lg bg-card/50">
            <p className="text-muted-foreground">No photos available for this project yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
