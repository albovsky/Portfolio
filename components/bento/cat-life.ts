export type Name = "Pusha" | "Bonita"
export type Activity = "sleep" | "eat" | "play" | "scratch" | "watch" | "walk" | "zoomies" | "tumble" | "groom" | "belly" | "silly" | "snuggle"
type Routine = Exclude<Activity, "walk" | "zoomies" | "tumble">
export type Resident = { name: Name; facing: 1 | -1; activity: Activity; destination: Routine; x: number; y: number; remaining: number; cycle: number; food: number; rest: number; joy: number }
const routines: Record<Name, Routine[]> = {
  Pusha: ["sleep", "groom", "eat", "watch", "silly", "scratch", "play"],
  Bonita: ["play", "silly", "groom", "eat", "watch", "sleep", "scratch"],
}
export const labels: Record<Activity, string> = { sleep: "Taking a little nap", eat: "Having a snack", play: "Chasing the yarn", scratch: "A very good scratch", watch: "Watching the world", walk: "On a little adventure", zoomies: "Full-speed zoomies!", tumble: "A playful little tumble", groom: "Washing a paw and polishing the whiskers", belly: "Belly up, dreaming of treats", silly: "Being a very silly little cat", snuggle: "A little grooming from Pusha" }
export function getActivityLabel(cat: Pick<Resident, "name" | "activity">): string {
  return cat.activity === "snuggle" && cat.name === "Pusha" ? "Grooming Bonita" : labels[cat.activity]
}
export const locations: Record<Routine, [number, number][]> = {
  groom: [[205, 287], [400, 287]], belly: [[105, 267], [153, 266]],
  silly: [[289, 298], [369, 299]], snuggle: [[298, 300], [350, 296]],
  sleep: [[105, 267], [153, 266]], eat: [[411, 294], [503, 294]],
  play: [[289, 298], [369, 299]], scratch: [[530, 290], [540, 292]], watch: [[286, 250], [402, 252]],
}
const durations: Record<Routine, number> = { sleep: 17, eat: 9, play: 12, scratch: 8, watch: 10, groom: 9, belly: 14, silly: 8, snuggle: 10 }
export const initial: Resident[] = [
  { name: "Pusha", facing: 1, activity: "sleep", destination: "sleep", x: 105, y: 267, remaining: 10, cycle: 0, food: 78, rest: 66, joy: 82 },
  { name: "Bonita", facing: 1, activity: "play", destination: "play", x: 369, y: 299, remaining: 7, cycle: 0, food: 73, rest: 86, joy: 88 },
]
export function sendTo(cat: Resident, destination: Routine): Resident {
  const [x,y] = locations[destination][cat.name === "Pusha" ? 0 : 1]
  if (cat.activity !== "walk" && x === cat.x && y === cat.y) {
    return { ...cat, activity: destination, destination, remaining: durations[destination] }
  }
  return { ...cat, facing: x < cat.x ? -1 : 1, activity: "walk", destination, x, y, remaining: 3 }
}
function advance(cat: Resident): Resident {
  const updated = { ...cat, remaining: cat.remaining - 1,
    food: Math.max(20, Math.min(100, cat.food + (cat.activity === "eat" ? 3 : -.12))),
    rest: Math.max(20, Math.min(100, cat.rest + (["sleep", "belly"].includes(cat.activity) ? 1.6 : -.15))),
    joy: Math.max(20, Math.min(100, cat.joy + (["play", "scratch", "silly", "snuggle", "groom"].includes(cat.activity) ? 1.2 : -.1))),
  }
  if (updated.remaining > 0) return updated
  if (cat.activity === "walk") return { ...updated, activity: cat.destination, remaining: durations[cat.destination] }
  // Small follow-through moments happen in place, without another walk.
  if (cat.activity === "sleep") return { ...updated, activity: "belly", remaining: durations.belly }
  if (cat.activity === "eat") return { ...updated, activity: "groom", remaining: durations.groom }
  const cycle = (cat.cycle + 1) % routines[cat.name].length
  const destination = cat.food < 45 ? "eat" : cat.rest < 45 ? "sleep" : routines[cat.name][cycle]
  return sendTo({ ...updated, cycle }, destination)
}

// Both cats arrive before the shared grooming clock starts. A command can
// replace these destinations at any point, so there are no delayed callbacks.
export function advanceResidents(cats: Resident[], socialDue = false, night = false): Resident[] {
  const socialActive = cats.some(cat => cat.activity === "snuggle" || (cat.activity === "walk" && cat.destination === "snuggle"))
  if (socialDue && !night && !socialActive && cats.every(cat => !["walk", "sleep", "belly"].includes(cat.activity) && cat.food > 45)) {
    return cats.map(cat => sendTo(cat, "snuggle"))
  }
  if (socialActive && cats.some(cat => cat.activity === "walk")) {
    return cats.map(cat => cat.activity === "snuggle" ? cat : advance(cat))
  }
  if (night) return cats.map(cat => {
    if (["sleep", "belly"].includes(cat.activity) && cat.remaining <= 1) {
      return { ...cat, activity: cat.activity === "sleep" ? "belly" : "sleep", remaining: 14, rest: Math.min(100, cat.rest + 1.6) }
    }
    return advance(cat)
  })
  return cats.map(advance)
}
