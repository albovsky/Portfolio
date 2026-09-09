import Image from 'next/image'

// The character artwork is an independent, cacheable image: no glyph hydration,
// ResizeObserver, or recurring text mutations on the main thread.
export function AsciiPortrait() {
  return <div className="ascii-portrait">
    <Image src="/portraits/glib-ascii-face.svg"
      alt="ASCII portrait of Glib with his neck and shoulders, from his original photograph"
      fill sizes="(max-width: 699px) 42vw, 320px" preload
      className="ascii-portrait-image" />
  </div>
}
