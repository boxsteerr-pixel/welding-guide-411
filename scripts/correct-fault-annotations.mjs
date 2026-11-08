import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const sharp = createRequire(import.meta.url)('C:/Users/BOXSTER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(import.meta.dirname, '..');
const manualPath = path.join(root, 'data/manual.json');
const manual = JSON.parse(await fs.readFile(manualPath, 'utf8'));
const fixes = [
  {id:'tia-program-download', index:3, source:'tia-original-image7.webp', note:'原图红框：选择“同步”。'},
  {id:'tia-program-download', index:4, source:'tia-original-image9.webp', note:'按原图红框，先点击“项目（P）”，再选择“归档（H）”。'},
  {id:'tia-program-download', index:6, source:'tia-original-image11.webp', note:'原图红框标出目标磁盘、归档文件夹及文件列表。'},
  {id:'laser-alarm-history', index:3, source:'alarm-history-image4.webp', note:'查看激光报警实时信息。', box:[.24,.16,.43,.45]},
  {id:'laser-alarm-history', index:4, source:'alarm-history-image5.webp', note:'查看激光报警历史信息。', box:[.18,.19,.44,.46]}
];
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const replacements = [];
for (const fix of fixes) {
  const item = manual.faults.find(entry => entry.id === fix.id);
  const step = item.steps[fix.index];
  const photo = await sharp(path.join(root,'assets/images/procedures/originals',fix.source)).resize({width:1000}).png().toBuffer();
  const meta = await sharp(photo).metadata();
  const width=1200, top=130, photoLeft=100, footerTop=top+meta.height+55;
  const lines=fix.note.match(/.{1,21}/gu) || [];
  const height=footerTop+100+lines.length*58;
  let frame='';
  if (fix.box) {
    const [x,y,w,h]=fix.box, left=photoLeft+x*1000, yPos=top+y*meta.height;
    frame=`<rect x="${left}" y="${yPos}" width="${w*1000}" height="${h*meta.height}" fill="none" stroke="white" stroke-width="12"/><rect x="${left}" y="${yPos}" width="${w*1000}" height="${h*meta.height}" fill="none" stroke="#087ca7" stroke-width="6"/>`;
  }
  const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="white"/><rect width="100%" height="100" fill="#073e6c"/><text x="30" y="66" fill="white" font-family="Microsoft YaHei" font-size="40">${fix.index+1}. ${escape(step.title)}</text></svg>`);
  const overlay=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${frame}<rect x="40" y="${footerTop}" width="1120" height="${height-footerTop-30}" fill="#edf5fb"/><text x="65" y="${footerTop+55}" font-family="Microsoft YaHei" font-size="48" fill="#12344d">${lines.map((s,i)=>`<tspan x="65" dy="${i?58:0}">${escape(s)}</tspan>`).join('')}</text></svg>`);
  const old=step.image, output=`./assets/images/procedures/${fix.id}-corrected-${String(fix.index+1).padStart(2,'0')}.webp`;
  await sharp(svg).composite([{input:photo,left:photoLeft,top},{input:overlay,left:0,top:0}]).webp({quality:93}).toFile(path.join(root,output));
  step.image=output;
  step.alt=fix.note;
  replacements.push({old,output});
}
await fs.writeFile(manualPath,JSON.stringify(manual,null,2)+'\n');
const swPath=path.join(root,'service-worker.js');let sw=await fs.readFile(swPath,'utf8');
for (const {old,output} of replacements) sw=sw.replace(old,output);
await fs.writeFile(swPath,sw);
console.log(`Corrected ${replacements.length} fault figures`);
