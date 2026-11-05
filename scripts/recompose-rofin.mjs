import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const sharp=createRequire(import.meta.url)('C:/Users/BOXSTER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(import.meta.dirname,'..'),dir=path.join(root,'assets/images/procedures');
// Source page crop, followed by callout target fractions within the crop.
const plans=[
 [1,[.185,.277,.832,.596],[[.12,.82,'状态灯：绿正常／黄报警／红故障'],[.70,.91,'点击“登录”进入操作模式']]],
 [1,[.15,.63,.545,.913],[[.45,.39,'用户名：operator'],[.45,.52,'密码：operator'],[.73,.69,'点击“正常”登录']]],
 [2,[.15,.089,.73,.49],[[.95,.15,'解锁密码1234；0为锁定'],[.95,.23,'M：手动模式，用于手动打点'],[.95,.29,'A：自动模式'],[.94,.78,'修改功率等级（百分比）'],[.10,.83,'电源'],[.20,.82,'高压'],[.29,.81,'出激光'],[.39,.80,'光闸']]],
 [3,[.247,.13,.719,.43],[[.946,.78,'①修改功率等级并确认'],[.166,.86,'②打开激光电源'],[.260,.85,'③待机启动：点击高压'],[.437,.84,'④打点前打开光闸'],[.355,.85,'⑤点击出激光；结束后关光闸'],[.957,.41,'⑥由M切换回A自动模式']]],
 [4,[.15,.13,.506,.30],[[.45,.43,'查看频率、占空比、等级与时间'],[.18,.92,'点击“程序”']]],
 [4,[.485,.366,.848,.529],[[.11,.94,'点击“脉冲”']]],
 [4,[.15,.61,.485,.821],[[.10,.51,'选择P对应的脉冲程序55']]],
 [4,[.491,.61,.848,.821],[[.21,.30,'修改频率、占空比、持续时间'],[.63,.90,'完成后点击“提交”']]],
 [5,[.236,.13,.762,.337],[[.51,.46,'故障：客户端不是主控装置'],[.07,.90,'点击“状态”按钮']]],
 [5,[.237,.426,.762,.616],[[.10,.73,'主控装置显示离线'],[.84,.94,'点击“》”按钮']]],
 [5,[.246,.705,.754,.892],[[.10,.91,'点击“设定主控装置”'],[.10,.72,'确认主控装置在线']]]
];
const manualPath=path.join(root,'data/manual.json'),m=JSON.parse(await fs.readFile(manualPath,'utf8'));
const item=m.faults.find(e=>e.id==='rofin-laser');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
for(const [i,[page,box,labels]] of plans.entries()){
 const src=path.join(dir,`rofin-laser-${page}.png`),meta=await sharp(src).metadata();
 const [x,y,r,b]=box;const left=Math.round(meta.width*x),top=Math.round(meta.height*y);
 const photo=await sharp(src).extract({left,top,width:Math.round(meta.width*r)-left,height:Math.round(meta.height*b)-top}).resize(1000).png().toBuffer();
 const pm=await sharp(photo).metadata();const height=Math.max(pm.height+240,labels.length*110+180);
 const imageTop=130;
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${height}"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="#e34720" stroke-width="2"/></marker></defs><rect width="1600" height="${height}" fill="white"/><rect width="1600" height="100" fill="#073e6c"/><text x="32" y="65" font-family="Microsoft YaHei" font-size="36" fill="white">${i+1}. ${esc(item.steps[i].title)}</text>`;
 const overlay=[];
 for(const [j,[tx,ty,label]] of labels.entries()){
  const xx=40+tx*1000,yy=imageTop+ty*pm.height,ly=150+j*110;
  const lines=[];for(let k=0;k<label.length;k+=15)lines.push(label.slice(k,k+15));
  overlay.push(`<path d="M1080 ${ly+24} L1048 ${ly+24} L${xx} ${yy}" stroke="#e34720" stroke-width="3" fill="none" marker-end="url(#arrow)"/><circle cx="${xx}" cy="${yy}" r="15" fill="white" stroke="#e34720" stroke-width="3"/><text x="${xx}" y="${yy+6}" text-anchor="middle" font-family="Arial" font-size="19" fill="#c83a18">${j+1}</text><rect x="1080" y="${ly}" width="490" height="90" rx="8" fill="#edf5fb" stroke="#b7cde0"/><text x="1097" y="${ly+32}" font-family="Microsoft YaHei" font-size="27" fill="#12344d">${lines.map((s,k)=>`<tspan x="1097" dy="${k?34:0}">${k?'':j+1+' · '}${esc(s)}</tspan>`).join('')}</text>`);
 }
 const footer=i===3?'打点顺序依据原文下方总结；原页上方④标注措辞与总结不一致。':i===4?'原文展示值：1000Hz、100%、0%、10ms、P（Fix）；不是通用设定值。':'原始界面截图 · 按原手顺重新编排标注';
 svg+=`<text x="35" y="${height-35}" font-family="Microsoft YaHei" font-size="26" fill="#334c60">${esc(footer)}</text></svg>`;
 const base=await sharp(Buffer.from(svg)).composite([{input:photo,left:40,top:imageTop}]).png().toBuffer();
 const arrows=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${height}"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="#e34720" stroke-width="2"/></marker></defs>${overlay.join('')}</svg>`);
 const filename=`rofin-recomposed-${String(i+1).padStart(2,'0')}.webp`;
 await sharp(base).composite([{input:arrows}]).webp({quality:95}).toFile(path.join(dir,filename));
 item.steps[i].image=`./assets/images/procedures/${filename}`;
}
m.machine.manualVersion='0.4.1';await fs.writeFile(manualPath,JSON.stringify(m,null,2)+'\n');
const swPath=path.join(root,'service-worker.js');let sw=await fs.readFile(swPath,'utf8');sw=sw.replace('welding-guide-411-v14','welding-guide-411-v15');
sw=sw.replace(/const CORE_ASSETS = (\[[\s\S]*?\])\.map/,(_,json)=>'const CORE_ASSETS = '+JSON.stringify([...JSON.parse(json).filter(x=>!x.startsWith('./assets/images/procedures/')),...m.faults.flatMap(e=>e.steps.map(s=>s.image))],null,2)+'.map');
await fs.writeFile(swPath,sw);console.log('Recomposed 11 original laser screens');
