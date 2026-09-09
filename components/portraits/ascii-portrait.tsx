"use client"

import portrait from './glib-ascii.json'
import { useEffect, useRef, useState } from 'react'

// Character density AND ink tone preserve the photograph's facial contrast.
const lines = portrait.text.split('\n')
const rows = lines.map((line, y) => {
  const runs: { text: string; start: number; level: number }[] = []
  for (let x = 0; x < portrait.columns; x++) {
    const level = portrait.tones[y * portrait.columns + x]
    const last = runs[runs.length - 1]
    if (last && last.level === level) last.text += line[x]
    else runs.push({ text: line[x], start: x, level })
  }
  return runs
})

export function AsciiPortrait() {
  const width = portrait.columns * 6
  const height = portrait.rows * 10
  const root = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ width: 200, height: 240, radius: 24 })
  useEffect(() => {
    const node = root.current
    if (!node) return
    const measure = () => {
      const box = { width: node.clientWidth, height: node.clientHeight }
      const radius = parseFloat(getComputedStyle(node).getPropertyValue('--bento-radius')) || 24
      setSize(current => current.width === box.width && current.height === box.height && current.radius === radius
        ? current : { width: box.width, height: box.height, radius })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    let inView = false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer: ReturnType<typeof setInterval> | undefined
    let step = 0
    const updateMotion = () => {
      const paused = !inView || document.hidden || reduced.matches
      node.dataset.paused = String(paused)
      if (paused) {
        clearInterval(timer)
        timer = undefined
      } else if (timer === undefined) {
        timer = setInterval(() => {
          const groups = node.querySelectorAll<SVGGElement>('[data-ascii-symbols]')
          const group = groups[step++ % groups.length]
          if (!group) return
          const variant = group.dataset.variant === 'alternate' ? 'primary' : 'alternate'
          group.querySelectorAll<SVGTSpanElement>('tspan').forEach(row => {
            row.textContent = row.getAttribute(`data-${variant}`)
          })
          group.dataset.variant = variant
        }, 150)
      }
    }
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      updateMotion()
    })
    visibility.observe(node)
    document.addEventListener('visibilitychange', updateMotion)
    reduced.addEventListener('change', updateMotion)
    return () => {
      clearInterval(timer)
      reduced.removeEventListener('change', updateMotion)
      observer.disconnect()
      visibility.disconnect()
      document.removeEventListener('visibilitychange', updateMotion)
    }
  }, [])
  const frameWidth = Math.max(1, size.width)
  const frameHeight = Math.max(1, size.height)
  // Keep the portrait fitted, but extend its character field to the entire frame.
  const scale = Math.min(Math.max(1, frameWidth - 16) / width, Math.max(1, frameHeight - 8) / height)
  const portraitX = (frameWidth - width * scale) / 2
  // Anchor the bust to the lower frame edge; keep breathing room above the hair.
  const portraitY = frameHeight - height * scale
  const fieldX = -portraitX / scale
  const fieldY = -portraitY / scale
  const fieldWidth = frameWidth / scale
  const fieldHeight = frameHeight / scale
  const backgroundFontSize = 24
  const backgroundCellWidth = 18
  const backgroundCellHeight = 28
  const fieldColumns = Math.ceil(fieldWidth / backgroundCellWidth) + 4
  const fieldRows = Math.ceil(fieldHeight / backgroundCellHeight) + 4
  // Eight staggered groups swap symbols in place, without moving the grid.
  // Each row is one text run, with spaces retaining the original character grid.
  const background = Array.from({ length: 8 }, (_, layer) => ({
    lines: Array.from({ length: fieldRows }, (_, y) => {
      const symbols = Array.from({ length: fieldColumns }, (_, x) => {
        const i = y * fieldColumns + x
        if ((x + y * 3) % 8 !== layer) return [' ', ' ']
        return [['.', ':', '+', '-', '/', '*'][i % 6], ['+', '/', ':', '*', '.', '-'][(i * 7) % 6]]
      })
      return { primary: symbols.map(pair => pair[0]).join(''), alternate: symbols.map(pair => pair[1]).join('') }
    }),
  }))
  const inset = 1
  const radius = Math.min(size.radius, frameWidth / 2 - inset, frameHeight / 2 - inset)
  const points: { x: number; y: number; angle: number }[] = []
  const horizontal = frameWidth - 2 * (radius + inset)
  const vertical = frameHeight - 2 * (radius + inset)
  // Place actual hyphens along straight edges and quarter circles; no stroked border.
  for (let x = 0; x <= horizontal; x += 4) {
    points.push({x:inset+radius+x,y:inset,angle:0}, {x:inset+radius+x,y:frameHeight-inset,angle:0})
  }
  for (let y = 0; y <= vertical; y += 4) {
    points.push({x:inset,y:inset+radius+y,angle:90}, {x:frameWidth-inset,y:inset+radius+y,angle:90})
  }
  const corners = [
    {x:inset+radius,y:inset+radius,start:180},
    {x:frameWidth-inset-radius,y:inset+radius,start:270},
    {x:frameWidth-inset-radius,y:frameHeight-inset-radius,start:0},
    {x:inset+radius,y:frameHeight-inset-radius,start:90},
  ]
  const steps = Math.max(2, Math.ceil(Math.PI * radius / 8))
  for (const corner of corners) for (let i = 1; i < steps; i++) {
    const angle = corner.start + i / steps * 90
    const radians = angle * Math.PI / 180
    points.push({x:corner.x+Math.cos(radians)*radius,y:corner.y+Math.sin(radians)*radius,angle:angle+90})
  }
  return <svg ref={root} className="ascii-portrait" data-paused="true" role="img" aria-labelledby="ascii-portrait-title" viewBox={`0 0 ${frameWidth} ${frameHeight}`} preserveAspectRatio="xMidYMid meet" width="100%" height="100%" style={{ display:'block',position:'absolute',inset:0,width:'100%',height:'100%',overflow:'hidden' }}>
    <title id="ascii-portrait-title">ASCII portrait of Glib with his neck and shoulders, from his original photograph, with softly animated text in the background</title>
    <g data-ascii-frame aria-hidden="true" fill="#8b9186" fontFamily="Courier New, Courier, monospace" fontSize="6" textAnchor="middle" dominantBaseline="central">
      {points.map((point,index)=><text key={index} x={point.x} y={point.y} transform={`rotate(${point.angle} ${point.x} ${point.y})`}>-</text>)}
    </g>
    <defs>
      <clipPath id="ascii-field-clip">
        <rect x={inset + 1} y={inset + 1} width={Math.max(0, frameWidth - 4)} height={Math.max(0, frameHeight - 4)} rx={Math.max(0, radius - 1)} />
      </clipPath>
      <mask id="ascii-field-mask" maskUnits="userSpaceOnUse" x={fieldX} y={fieldY} width={fieldWidth} height={fieldHeight}>
        <rect x={fieldX} y={fieldY} width={fieldWidth} height={fieldHeight} fill="white" />
        {rows.map((runs, y) => {
          const silhouette = runs.filter(run => run.level >= 0)
          if (!silhouette.length) return null
          const first = silhouette[0]
          const last = silhouette[silhouette.length - 1]
          return <rect key={y} x={first.start * 6} y={y * 10} width={(last.start + last.text.length - first.start) * 6} height="10" fill="black" />
        })}
      </mask>
    </defs>
    <g clipPath="url(#ascii-field-clip)" aria-hidden="true">
      <g transform={`translate(${portraitX} ${portraitY}) scale(${scale})`}>
        <g mask="url(#ascii-field-mask)" fontFamily="Courier New, Courier, monospace" fontSize={backgroundFontSize} fill="#7b8574">
          {background.map((layer, index) => <g key={index} data-ascii-symbols data-variant="primary" opacity=".32">
            <text xmlSpace="preserve" style={{whiteSpace:'pre',fontVariantLigatures:'none'}}>
              {layer.lines.map((line, y) => <tspan key={y}
                x={Array.from({ length: fieldColumns }, (_, x) => fieldX + (x - 2) * backgroundCellWidth).join(' ')}
                y={fieldY + (y - 2) * backgroundCellHeight + 12}
                data-primary={line.primary} data-alternate={line.alternate}
              >{line.primary}</tspan>)}
            </text>
          </g>)}
        </g>
      </g>
    </g>
    <g clipPath="url(#ascii-field-clip)">
    <g transform={`translate(${portraitX} ${portraitY}) scale(${scale})`} aria-hidden="true" fontFamily="Courier New, Courier, monospace" fontSize="10" fontWeight="700" style={{whiteSpace:'pre',fontVariantLigatures:'none'}}>
      {rows.map((runs,y)=><text key={y} y={y*10+8} xmlSpace="preserve">{runs.filter(run=>run.level>0).map(run=>{
        const tone = run.level / 9
        const shade = Math.round(110 * Math.pow(1 - tone, 2))
        const ink = `rgb(${shade},${shade},${shade})`
        // Reinforce shadow glyphs at small display sizes without closing up highlights.
        const strokeWidth = Math.max(0, (tone - .4) / .6) * .45
        return <tspan key={run.start} x={run.start*6} textLength={run.text.length*6} lengthAdjust="spacingAndGlyphs" fill={ink} stroke={ink} strokeWidth={strokeWidth} strokeLinejoin="round" paintOrder="stroke fill">{run.text}</tspan>
      })}</text>)}
    </g>
    </g>
  </svg>
}
