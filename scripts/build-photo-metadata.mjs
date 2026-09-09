// Record intrinsic image dimensions once, instead of reading the filesystem per request.
import { readdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
const root = new URL('../public/projects/photo/', import.meta.url)
const dimensions = {}
for (const directory of await readdir(root, {withFileTypes: true})) {
  if (!directory.isDirectory()) continue
  const folder = new URL(encodeURIComponent(directory.name) + '/', root)
  for (const file of await readdir(folder)) {
    if (!/\.(jpe?g|png|webp)$/i.test(file) || file.startsWith('.')) continue
    const {width, height} = await sharp(fileURLToPath(new URL(encodeURIComponent(file), folder))).metadata()
    dimensions[`/projects/photo/${directory.name}/${file}`] = {width, height}
  }
}
await writeFile(new URL('../lib/photo-metadata.json', import.meta.url), JSON.stringify(dimensions, null, 2) + '\n')
