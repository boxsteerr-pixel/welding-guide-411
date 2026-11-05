import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('C:/Users/BOXSTER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'assets/images/procedures');
const files = (await fs.readdir(dir)).filter(f => f.endsWith('.png')).sort();
for (const file of files) {
  if (['glass-cleaning-1.png','width-alarm-check-2.png'].includes(file)) continue;
  await sharp(path.join(dir, file)).webp({quality:94, effort:6}).toFile(path.join(dir, file.replace('.png','.webp')));
}
for (let i=0; i<files.length; i+=6) {
  const group=files.slice(i,i+6);
  const cells=await Promise.all(group.map(async (f,j)=>({input:await sharp(path.join(dir,f)).resize(500,690,{fit:'contain',background:'#dddddd'}).png().toBuffer(), left:j%3*500,top:Math.floor(j/3)*720+30})));
  const labels=group.map((f,j)=>`<text x="${j%3*500+8}" y="${Math.floor(j/3)*720+22}">${f}</text>`).join('');
  cells.push({input:Buffer.from(`<svg width="1500" height="1440"><g font-family="Arial" font-size="18">${labels}</g></svg>`),left:0,top:0});
  await sharp({create:{width:1500,height:1440,channels:3,background:'white'}}).composite(cells).png().toFile(path.join(root,`review/source-import/contact-${i/6+1}.png`));
}
console.log(`Prepared ${files.length} source page images`);
