"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { CardContent, CardLabel } from "./grid"
const photos = [
  { title: "Bin 4 Burger Lounge", slug: "bin-4-burger-lounge", image: "/projects/photo/bin-4-burger-lounge/cover.jpg" },
  { title: "Hi Five Chicken", slug: "hi-five-chicken", image: "/projects/photo/hi-five-chicken/cover.jpg" },
]
export function PhotographyCard() {
  const [index, setIndex] = useState(0)
  const photo = photos[index]
  return <CardContent className="photo-card">
    <CardLabel>Selected photography</CardLabel>
    <Link href={`/photo/${photo.slug}`} className="photo-preview" aria-label={`Open ${photo.title} gallery`}>
      <Image src={photo.image} alt={photo.title} fill sizes="(min-width: 1200px) 620px, (min-width: 700px) 90vw, 100vw" className="object-cover" />
    </Link>
    <div className="photo-footer">
      <div aria-live="polite"><h2 className="bento-subtitle">{photo.title}</h2><Link className="bento-text-link" href="/photo">All photography</Link></div>
      <div className="photo-controls"><button className="bento-action" aria-label="Previous photograph" onClick={() => setIndex((index + photos.length - 1) % photos.length)}><ArrowLeft size={18} /></button><span className="bento-label">{index + 1}/{photos.length}</span><button className="bento-action" aria-label="Next photograph" onClick={() => setIndex((index + 1) % photos.length)}><ArrowRight size={18} /></button></div>
    </div>
  </CardContent>
}
