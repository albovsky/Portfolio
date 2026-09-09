"use client"

import { gsap } from "gsap"
import { Draggable, ScrollTrigger } from "gsap/all"

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, ScrollTrigger)
}

export { Draggable, ScrollTrigger, gsap }
