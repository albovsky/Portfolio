"use client"

import Link from "next/link"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useAnimation } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { TimeTooltip } from "@/components/time-tooltip"

export default function Home() {
  const [dayPart, setDayPart] = useState("day")
  const [roleIndex, setRoleIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isNameHovering, setIsNameHovering] = useState(false)
  const [isTimeHovering, setIsTimeHovering] = useState(false)
  const [displayedName, setDisplayedName] = useState("")
  const roles = ["📸 Photographer", "🎥 Videographer", "🎬 Motion Designer", "✨ Digital Creator", "🎨 Designer", "🛠️ Indie Hacker", "🚁 Drone Pilot", "📺 YouTuber"]
  const fullName = "Ukrainian: Альбовський Гліб Михайлович"

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setDayPart("morning")
    else if (hour < 18) setDayPart("afternoon")
    else setDayPart("evening")

    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isNameHovering) {
      setDisplayedName("")
      let currentIndex = 0
      const typeInterval = setInterval(() => {
        if (currentIndex <= fullName.length) {
          setDisplayedName(fullName.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(typeInterval)
        }
      }, 50)
      return () => clearInterval(typeInterval)
    } else {
      setDisplayedName("")
    }
  }, [isNameHovering])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-visible">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center px-6 md:px-12 relative z-10">
        {/* Organic Background Blobs - Removed as per request */}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl overflow-visible"
        >
          <div className="flex flex-col gap-4">
            {/* Hello - Large, distinct */}
            <div className="text-7xl md:text-8xl lg:text-9xl font-serif italic text-zinc-600 tracking-tighter leading-none -mr-16">
              <InteractiveHello />
            </div>
            
            {/* Greeting sentence */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-white drop-shadow-2xl">
              <span className="">Hope your </span>
              <motion.span
                className="relative inline-block cursor-pointer group"
                onMouseEnter={() => setIsTimeHovering(true)}
                onMouseLeave={() => setIsTimeHovering(false)}
              >
                <span className="text-white underline decoration-wavy underline-offset-8 decoration-2">{dayPart}</span>
                <AnimatePresence>
                  {isTimeHovering && <TimeTooltip />}
                </AnimatePresence>
              </motion.span>
              <span className=""> is going well.</span>
            </h1>
            
            {/* Introduction sentence */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-white drop-shadow-2xl">
              <span className="">My name is </span>
              <motion.span 
                className="relative inline-block cursor-pointer group"
                onMouseEnter={() => setIsNameHovering(true)}
                onMouseLeave={() => setIsNameHovering(false)}
              >
                <span className="relative z-10 font-display border-b-2 border-white/80 pb-1">Glib</span>
                <motion.span 
                  className="absolute inset-x-0 bottom-2 h-4 bg-white/20 -z-10 rounded-full blur-sm"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
                <AnimatePresence>
                  {isNameHovering && (
                    <motion.div
                      layout="position"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ 
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 },
                        layout: { duration: 0.3, ease: "easeOut" }
                      }}
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 z-50 bg-zinc-900 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl whitespace-nowrap text-left font-normal tracking-normal leading-normal text-lg"
                    >
                      <span className="text-white/90 font-mono">{displayedName}<span className="animate-pulse text-white">_</span></span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.span>
              <span className=""> and I am</span>
              <br />
              <motion.span 
                layout
                transition={{ duration: 0.7, ease: [0.32, 0.725, 0.06, 0.965] }}
                className="inline-flex items-center text-white relative cursor-pointer group h-[1.2em] align-middle"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={roles[roleIndex]}
                    layout="position"
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                    transition={{ duration: 0.7, ease: [0.32, 0.725, 0.06, 0.965] }}
                    className="block whitespace-nowrap"
                  >
                    {roles[roleIndex]}
                  </motion.span>
                </AnimatePresence>
                
                <AnimatePresence>
                  {isHovering && (
                    <motion.div
                      layout="position"
                      initial={{ opacity: 0, scale: 0.95, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: 20 }}
                      transition={{ 
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 },
                        layout: { duration: 0.7, ease: [0.32, 0.725, 0.06, 0.965] }
                      }}
                      className="absolute left-full top-1/2 -translate-y-1/2 ml-8 z-50 bg-zinc-900 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl min-w-[340px] hidden lg:block text-left font-normal tracking-normal leading-normal"
                    >
                      <div className="flex flex-col gap-3">
                        {roles.map((role, index) => (
                          <motion.div 
                            key={role}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`text-lg font-mono transition-colors flex items-center gap-3 ${
                              index === roleIndex ? "text-primary font-bold" : "text-white/40 hover:text-white/80"
                            }`}
                          >
                            <span className="text-xl opacity-80">{role.split(" ")[0]}</span>
                            <span className="tracking-tight">{role.split(" ").slice(1).join(" ")}</span>
                          </motion.div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-white/5 text-xs font-mono text-white/30 italic font-normal tracking-normal">
                          (jack of all trades, master of fun)
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.span>
            </h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 flex items-center gap-3 text-lg md:text-xl text-white/80 font-light"
          >
            <span>Currently Technical Designer at</span>
            <span className="text-white font-medium flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center overflow-hidden">
                 <img src="/logos/MahiGaming_Logo-White.png" alt="MahiGaming" className="w-full h-full object-contain p-1" />
              </div>
              MahiGaming
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-12 left-6 md:left-12"
        >
          <Link href="/photo" className="group flex items-center gap-3 text-white hover:text-primary transition-colors font-mono uppercase text-sm tracking-widest bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 hover:border-primary/50">
             View Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* Navigation Grid */}
      {/* Navigation Grid */}
      <section 
        className="grid grid-cols-1 md:grid-cols-3 h-screen gap-6 p-6 md:p-12"
        style={{ perspective: "1000px" }}
      >
        {[
          { title: "Photography", href: "/photo", color: "from-white/10 to-white/5", hoverColor: "group-hover:from-white/20 group-hover:to-white/10" },
          { title: "Videography", href: "/video", color: "from-white/10 to-white/5", hoverColor: "group-hover:from-white/20 group-hover:to-white/10" },
          { title: "Motion", href: "/motion", color: "from-white/10 to-white/5", hoverColor: "group-hover:from-white/20 group-hover:to-white/10" },
        ].map((item, index) => (
          <TiltCard key={item.title} item={item} index={index} />
        ))}
      </section>
    </div>
  )
}

function TiltCard({ item, index }: { item: any; index: number }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 })

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    x.set(clientX - left - width / 2)
    y.set(clientY - top - height / 2)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  const rotateX = useTransform(mouseY, [-300, 300], [25, -25])
  const rotateY = useTransform(mouseX, [-300, 300], [-25, 25])

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative h-full w-full"
    >
      <Link
        href={item.href}
        className="group relative flex h-full w-full items-center justify-center rounded-[2rem] border border-white/5 hover:border-white/20 transition-all duration-500 bg-black/10 backdrop-blur-sm"
        style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
      >
        {/* Gradient Background - Moved to a separate div to allow overflow-hidden on it if needed, but we want 3D pop */}
        <div className={`absolute inset-0 rounded-[2rem] overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} ${item.hoverColor} transition-colors duration-500 opacity-50 group-hover:opacity-100`} />
            <div className="absolute inset-0 bg-transparent backdrop-blur-3xl" />
        </div>
        
        {/* Floating Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, z: 0 }}
          whileInView={{ opacity: 1, scale: 1, z: 60 }}
          transition={{ delay: index * 0.1 }}
          className="relative z-10 text-center"
          style={{ transform: "translateZ(60px)" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">
            {item.title}
          </h2>
          <div className="h-1 w-12 bg-white/50 mx-auto mt-4 rounded-full group-hover:w-24 transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </motion.div>

        <span className="absolute bottom-8 left-8 font-mono text-xs text-white/60 group-hover:text-white transition-colors border border-white/10 px-3 py-1 rounded-full" style={{ transform: "translateZ(40px)" }}>
          0{index + 1}
        </span>
        <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors" style={{ transform: "translateZ(40px)" }}>
          <ArrowRight className="w-5 h-5 text-white/80 group-hover:text-white group-hover:-rotate-45 transition-all duration-300" />
        </div>
      </Link>
    </motion.div>
  )
}

function InteractiveHello() {
  const controls = useAnimation()
  
  const handleClick = () => {
    controls.start({
      scale: [1, 1.2, 0.9, 1.1, 1],
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { duration: 0.6, ease: "easeInOut" }
    })
  }

  return (
    <motion.span
      animate={controls}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="inline-block hover:text-primary transition-colors select-none will-change-transform"
      style={{ 
        cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewport='0 0 100 100' style='fill:black;font-size:48px;'><text y='50%' font-size='48'>👋</text></svg>") 16 0, auto`,
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased'
      }}
    >
      Hello!
    </motion.span>
  )
}
