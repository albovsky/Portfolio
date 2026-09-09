// Bake the existing character artwork into a cacheable SVG, outside React's DOM.
import { readFileSync, writeFileSync } from 'node:fs'
const portrait = JSON.parse(readFileSync(new URL('../components/portraits/glib-ascii.json', import.meta.url), 'utf8'))
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const shapes = [], silhouette = []
for (const [y, line] of portrait.text.split('\n').entries()) {
  const runs = []
  for (let x = 0; x < portrait.columns; x++) {
    const level = portrait.tones[y * portrait.columns + x], last = runs.at(-1)
    if (last && last.level === level) last.text += line[x]
    else runs.push({text: line[x], start: x, level})
  }
  const solid = runs.filter(run => run.level >= 0)
  if (solid.length) silhouette.push(`<rect x="${solid[0].start * 6}" y="${y * 10}" width="${(solid.at(-1).start + solid.at(-1).text.length - solid[0].start) * 6}" height="10"/>`)
  const spans = runs.filter(run => run.level > 0).map(run => {
    const tone = run.level / 9, shade = Math.round(110 * (1-tone) ** 2)
    return `<tspan x="${run.start*6}" textLength="${run.text.length*6}" lengthAdjust="spacingAndGlyphs" fill="rgb(${shade},${shade},${shade})" stroke="rgb(${shade},${shade},${shade})" stroke-width="${(Math.max(0,(tone-.4)/.6)*.45).toFixed(2)}">${escape(run.text)}</tspan>`
  }).join('')
  shapes.push(`<text y="${y*10+8}" xml:space="preserve">${spans}</text>`)
}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${portrait.columns*6} ${portrait.rows*10}"><g fill="#fdfdfb">${silhouette.join('')}</g><g font-family="Courier New,Courier,monospace" font-size="10" font-weight="700" stroke-linejoin="round" paint-order="stroke fill" style="white-space:pre;font-variant-ligatures:none">${shapes.join('')}</g></svg>`
writeFileSync(new URL('../public/portraits/glib-ascii-face.svg',import.meta.url),svg)
