export type Palette = { outline: string; coat: string; shade: string; light: string; bib: string; stripe: string; eye: string; nose: string; ear: string }
export const catPalettes: Record<"Pusha" | "Bonita", Palette> = {
  Pusha: { outline:"#826348", coat:"#e5c49a", shade:"#c8a176", light:"#fff4e3", bib:"#fffaf2", stripe:"#bd9468", eye:"#b38a47", nose:"#ab796d", ear:"#e0b29a" },
  Bonita: { outline:"#785039", coat:"#cf914f", shade:"#a66a38", light:"#eab475", bib:"#e6b47d", stripe:"#a96636", eye:"#ad8545", nose:"#9b6758", ear:"#d69580" },
}
