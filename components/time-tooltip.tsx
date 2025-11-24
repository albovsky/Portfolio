import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function TimeTooltip() {
  const [time, setTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000) // Update every minute
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours()
  const minutes = time.getMinutes()
  
  // Day is 6:00 to 18:00 (12 hours)
  // Night is 18:00 to 6:00 (12 hours)
  const isDay = hours >= 6 && hours < 18
  
  // Calculate progress 0-1 within the current 12-hour window
  let targetProgress = 0
  if (isDay) {
    targetProgress = ((hours - 6) * 60 + minutes) / (12 * 60)
  } else {
    // Handle night wrapping around midnight
    let adjustedHour = hours
    if (hours < 6) adjustedHour += 24
    targetProgress = ((adjustedHour - 18) * 60 + minutes) / (12 * 60)
  }

  // Animation values
  const progress = useMotionValue(0)
  
  useEffect(() => {
    // Animate from 0 to targetProgress on mount
    const controls = animate(progress, targetProgress, {
      type: "spring",
      stiffness: 50,
      damping: 15, // Slightly higher damping for smoother curve follow
      mass: 1
    })
    return controls.stop
  }, [targetProgress, progress])

  // Transform progress to x,y coordinates along the arc
  const x = useTransform(progress, (p) => {
    const angle = Math.PI - (p * Math.PI)
    return 80 + 60 * Math.cos(angle) - 12 // cx + r * cos(angle) - halfSize
  })
  
  const y = useTransform(progress, (p) => {
    const angle = Math.PI - (p * Math.PI)
    return 80 - 60 * Math.sin(angle) - 12 // cy - r * sin(angle) - halfSize
  })

  return (
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
      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 bg-zinc-900/95 backdrop-blur-sm border border-white/10 p-4 rounded-xl shadow-2xl min-w-[180px]"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-40 h-24 overflow-hidden">
          {/* Sky Gradient Background */}
          <div className={`absolute inset-0 opacity-20 rounded-t-full ${
            isDay ? 'bg-gradient-to-b from-sky-400 to-sky-100' : 'bg-gradient-to-b from-indigo-900 to-slate-900'
          }`} />
          
          <svg width="160" height="90" className="absolute bottom-0">
            {/* The Curve */}
            <path
              d="M 20 80 A 60 60 0 0 1 140 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="text-white/20"
            />
            
            {/* The Moving Body (Sun/Moon) */}
            <foreignObject x="0" y="0" width="160" height="90">
              <motion.div
                style={{ x, y }}
                className={`absolute top-0 left-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  isDay ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-slate-200 drop-shadow-[0_0_8px_rgba(226,232,240,0.5)]'
                }`}
              >
                {isDay ? <Sun size={20} fill="currentColor" /> : <Moon size={20} fill="currentColor" />}
              </motion.div>
            </foreignObject>
          </svg>
          
          {/* Horizon Line */}
          <div className="absolute bottom-0 w-full h-[1px] bg-white/10" />
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-white">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-white/40 font-mono uppercase tracking-wider">
            {isDay ? 'Daytime' : 'Nighttime'}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
