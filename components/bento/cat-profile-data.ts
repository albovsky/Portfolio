export const pushaStats = [
  { label: "Nap power", value: 10, rating: "MAX" },
  { label: "Loaf form", value: 10, rating: "10/10" },
  { label: "Personal space", value: 2, rating: "2/10" },
  { label: "Zoomies", value: 8, rating: "8/10" },
] as const

export const bonitaStats = [
  { label: "Redness", value: 10, rating: "MAX" },
  { label: "Furniture respect", value: 1, rating: "1/10" },
  { label: "Chaos", value: 9, rating: "9/10" },
  { label: "Cuteness", value: 10, rating: "10/10" },
] as const

// Calendar age, using the viewer's local date rather than elapsed days.
export function getPushaAge(now = new Date()): number {
  const beforeBirthday = now.getMonth() === 0 && now.getDate() < 23
  return Math.max(0, now.getFullYear() - 2022 - Number(beforeBirthday))
}

export function subscribeToAgeChange(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>
  const schedule = () => {
    const now = new Date()
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    timer = setTimeout(() => { onChange(); schedule() }, midnight.getTime() - now.getTime() + 20)
  }
  const refresh = () => {
    if (document.hidden) return
    clearTimeout(timer)
    onChange()
    schedule()
  }
  schedule()
  document.addEventListener("visibilitychange", refresh)
  return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", refresh) }
}

export function getServerAge(): null { return null }
