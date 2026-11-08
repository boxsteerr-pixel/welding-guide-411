import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const sharp = createRequire(import.meta.url)('C:/Users/BOXSTER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(import.meta.dirname, '..');
const manualPath = path.join(root, 'data/manual.json');
const manual = JSON.parse(await fs.readFile(manualPath, 'utf8'));
// Boxes mark only components that are visually identifiable in the source images.
const boxes = {
  'inspection-encoder': [ [[.23,.12,.39,.65]], [[.26,.16,.65,.65]], [[.10,.12,.54,.68]], [] ],
  'inspection-wheel': [ [[.32,.12,.35,.48]], [[.30,.14,.35,.42]] ],
  'inspection-displacement': [ [[.30,.17,.60,.54]], [], [], [], [[.18,.38,.54,.12]], [], [] ],
  'inspection-optics': [
    [[.25,.24,.26,.23],[.39,.50,.25,.28]],
    [[.32,.25,.07,.08],[.24,.64,.08,.08],[.56,.50,.08,.08]],
    [[.15,.18,.68,.60]], [[.15,.40,.57,.32]], [[.45,.38,.17,.13]],
    [[.28,.68,.29,.20]], [[.28,.43,.37,.24]], [], [[.58,.10,.12,.13],[.54,.67,.33,.17]]
  ]
};
const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const oldImages = [];
const newImages = [];
for (const item of manual.inspection) {
  for (const [index, step] of item.steps.entries()) {
    oldImages.push(step.image);
    const source = path.join(root, step.image);
    const meta = await sharp(source).metadata();
    const width = meta.width, height = meta.height;
    const regions = boxes[item.id][index];
    const marks = regions.map(([x,y,w,h], i) => {
      const left = Math.round(x*width), top = Math.round(y*height), rw = Math.round(w*width), rh = Math.round(h*height);
      return `<rect x="${left}" y="${top}" width="${rw}" height="${rh}" rx="8" fill="none" stroke="white" stroke-width="12"/><rect x="${left}" y="${top}" width="${rw}" height="${rh}" rx="8" fill="none" stroke="#e2481b" stroke-width="7"/>`;
    }).join('');
    const note = step.text;
    const charsPerLine = Math.max(16, Math.floor((width-100)/33));
    const lines = Array.from(note.matchAll(new RegExp(`.{1,${charsPerLine}}`, 'gu')), m => m[0]);
    const footerHeight = 70 + lines.length*46;
    const footer = `<rect x="0" y="${height}" width="${width}" height="${footerHeight}" fill="#f0f7fc"/><text x="32" y="${height+55}" font-family="Microsoft YaHei" font-size="30" fill="#173e5b">${lines.map((line,i)=>`<tspan x="32" dy="${i ? 46 : 0}">${escape(line)}</tspan>`).join('')}</text>`;
    const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height+footerHeight}">${marks}${footer}</svg>`);
    const output = `./assets/images/procedures/${item.id}-annotated-${String(index+1).padStart(2,'0')}.webp`;
    await sharp({create:{width,height:height+footerHeight,channels:3,background:'white'}}).composite([{input:await fs.readFile(source),left:0,top:0},{input:svg,left:0,top:0}]).webp({quality:94}).toFile(path.join(root,output));
    step.image = output;
    step.alt = `${step.title}。${note}`;
    newImages.push(output);
  }
}
manual.machine.manualVersion = '0.8.1';
await fs.writeFile(manualPath, JSON.stringify(manual,null,2)+'\n');
const swPath=path.join(root,'service-worker.js');
let sw=await fs.readFile(swPath,'utf8');
sw=sw.replace('welding-guide-411-v24','welding-guide-411-v25');
sw=sw.replace(/const CORE_ASSETS = (\[[\s\S]*?\])\.map/,(_,json)=>'const CORE_ASSETS = '+JSON.stringify([...JSON.parse(json).filter(x=>!oldImages.includes(x)),...newImages],null,2)+'.map');
await fs.writeFile(swPath,sw);
console.log(`Annotated ${newImages.length} images`);
