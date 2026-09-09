// Recreate the portrait as text from the ORIGINAL photograph, never an AI image.
// Run: node scripts/create-ascii-portrait.mjs [source.jpg]
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
const source = process.argv[2] ?? 'assets/portraits/glib-original.jpg';
// Fewer samples make each real character legible at the card’s display size.
const columns = 80;
const rows = 57;
const crop = { left: 48, top: 16, width: 340, height: 402 };
// Head, neck, and visible shoulder silhouette in the 418 × 418 source.
// Keep the neck and shirt; exclude the colored circular backdrop.
const silhouette = [[48,418],[72,400],[103,386],[120,374],[122,350],[104,328],[91,307],[81,273],[79,239],[82,209],[79,172],[82,127],[101,81],[142,49],[185,29],[225,30],[268,42],[298,62],[315,99],[328,149],[331,205],[323,250],[314,278],[308,310],[299,343],[297,360],[319,373],[349,381],[375,397],[388,418]];
function inside(x,y) {
  let result = false;
  for(let i=0,j=silhouette.length-1;i<silhouette.length;j=i++) {
    const [xi,yi]=silhouette[i], [xj,yj]=silhouette[j];
    if ((yi>y)!==(yj>y) && x<(xj-xi)*(y-yi)/(yj-yi)+xi) result=!result;
  }
  return result;
}
const normalized = await sharp(source).resize(418,418).toBuffer();
const {data,info} = await sharp(normalized).extract(crop).resize(columns,rows,{fit:'fill'}).greyscale().sharpen({sigma:0.5}).raw().toBuffer({resolveWithObject:true});
const ramp = ' .:-=+*#%@';
const tones = [];
const lines = Array.from({length:rows},(_,y)=>Array.from({length:columns},(_,x)=>{
  if(!inside(crop.left+(x+.5)/columns*crop.width,crop.top+(y+.5)/rows*crop.height)) { tones.push(-1); return ' '; }
  const luminance=data[(y*columns+x)*info.channels]/255;
  // A gentle curve retains midtones in cheeks and forehead instead of erasing them.
  const darkness=Math.pow(Math.max(0,Math.min(1,(.99-luminance)/.9)),.95);
  const level=Math.min(ramp.length-1,Math.round(darkness*(ramp.length-1)));
  tones.push(level);
  return ramp[level];
}).join(''));
await writeFile('components/portraits/glib-ascii.json',JSON.stringify({columns,rows,text:lines.join('\n'),tones},null,2)+'\n');
console.log(`Wrote ${columns} × ${rows} tonal ASCII characters from ${source}`);
