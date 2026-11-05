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
for(const plan of plans)for(const label of plan[2])label[2]=label[2].replace(/^[①②③④⑤⑥]/,'');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
// Tight target bounds in the corrected screen: x, y, width, height.
// Blue bounds identify information to observe; orange bounds identify controls.
const bounds=[
 [[.00,.80,.06,.07,'observe'],[.71,.90,.10,.09]],
 [[.14,.36,.81,.07],[.14,.47,.81,.07],[.57,.63,.37,.08]],
 [[.91,.10,.085,.09],[.91,.18,.085,.06],[.91,.24,.085,.065],[.90,.80,.095,.09],[.00,.80,.11,.10],[.11,.80,.105,.10],[.215,.80,.10,.10],[.315,.80,.105,.10]],
 [[.90,.79,.095,.09],[.00,.79,.11,.10],[.11,.79,.105,.10],[.315,.79,.105,.10],[.215,.79,.10,.10],[.91,.16,.085,.15]],
 [[.36,.38,.50,.13,'observe'],[.11,.91,.10,.085]],
 [[.07,.91,.10,.08]],
 [[.01,.13,.85,.65]],
 [[.15,.15,.21,.43],[.59,.88,.105,.10]],
 [[.28,.33,.42,.35,'observe'],[.02,.86,.10,.10]],
 [[.055,.69,.17,.07,'observe'],[.79,.89,.10,.10]],
 [[.065,.86,.085,.10],[.07,.67,.16,.07,'observe']]
];
// Map a photographed quadrilateral to a rectangle using bilinear interpolation.
// This changes geometry only; no interface text or controls are synthesized.
const quads={
 0:[[.09,.025],[.93,.055],[.91,.95],[.09,.98]],
 2:[[.022,.064],[.994,.055],[.977,.940],[.040,.964]],
 3:[[.085,.245],[.84,.215],[.84,.925],[.10,.99]],
 4:[[.01,.02],[.98,.01],[.98,.98],[.02,.98]],
 6:[[.01,.025],[.98,.005],[.98,.97],[.02,.99]],
 7:[[.02,.025],[.98,.01],[.98,.97],[.03,.99]]
};
plans[0][2][0][0]=.045;
plans[0][2][1][0]=.77;
plans[0][2][1][1]=.94;
plans[3][2].forEach((label,j)=>{const xy=[[.95,.82],[.11,.88],[.22,.88],[.41,.88],[.32,.88],[.95,.22]][j];label[0]=xy[0];label[1]=xy[1];});
plans[4][2][0][0]=.36;plans[4][2][0][1]=.37;
plans[6][2][0][0]=.09;plans[6][2][0][1]=.10;
plans[6][2][0][2]='在列表中选择原文指定的程序55';
plans[8][2][0][0]=.29;plans[8][2][0][1]=.51;
async function rectify(src,quad){
 const {data,info}=await sharp(src).removeAlpha().raw().toBuffer({resolveWithObject:true});
 if(!quad)return sharp(src).resize(1000).sharpen({sigma:.6,m1:.4,m2:1}).png().toBuffer();
 const w=1000,h=Math.round(info.height/info.width*1000),out=Buffer.alloc(w*h*3);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const u=x/(w-1),v=y/(h-1);
  const sx=((1-v)*((1-u)*quad[0][0]+u*quad[1][0])+v*((1-u)*quad[3][0]+u*quad[2][0]))*(info.width-1);
  const sy=((1-v)*((1-u)*quad[0][1]+u*quad[1][1])+v*((1-u)*quad[3][1]+u*quad[2][1]))*(info.height-1);
  const a=Math.floor(sx),b=Math.floor(sy),dx=sx-a,dy=sy-b;
  for(let c=0;c<3;c++){const pixel=(xx,yy)=>data[(Math.min(info.height-1,yy)*info.width+Math.min(info.width-1,xx))*3+c];out[(y*w+x)*3+c]=Math.round(pixel(a,b)*(1-dx)*(1-dy)+pixel(a+1,b)*dx*(1-dy)+pixel(a,b+1)*(1-dx)*dy+pixel(a+1,b+1)*dx*dy);}
 }
 return sharp(out,{raw:{width:w,height:h,channels:3}}).sharpen({sigma:.6,m1:.4,m2:1}).png().toBuffer();
}
for(const [i,[page,box,labels]] of plans.entries()){
 const photo=await rectify(path.join(dir,`image${i+1}.jpeg`),quads[i]);
 const pm=await sharp(photo).metadata();const height=pm.height+labels.length*140+360;
 const imageTop=130;
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}"><rect width="1200" height="${height}" fill="white"/><rect width="1200" height="100" fill="#073e6c"/><text x="32" y="65" font-family="Microsoft YaHei" font-size="42" fill="white">${i+1}. ${esc(item.steps[i].title)}</text>`;
 const overlay=[];
 for(const [j,[tx,ty,label]] of labels.entries()){
  const [bx,by,bw,bh,kind]=bounds[i][j];
  const xx=100+bx*1000,yy=imageTop+by*pm.height,ly=pm.height+210+j*140;
  const color=kind==='observe'?'#087ca7':'#df4b16';
  const lines=[];for(let k=0;k<label.length;k+=19)lines.push(label.slice(k,k+19));
  const cx=bx>.89&&by<.35?xx-27:xx+20;
  const cy=bx>.89&&by<.35?yy+bh*pm.height/2:yy-23;
  overlay.push(`<rect x="${xx}" y="${yy}" width="${bw*1000}" height="${bh*pm.height}" rx="3" fill="none" stroke="white" stroke-width="9"/><rect x="${xx}" y="${yy}" width="${bw*1000}" height="${bh*pm.height}" rx="3" fill="none" stroke="${color}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="20" fill="white" stroke="${color}" stroke-width="4"/><text x="${cx}" y="${cy+9}" text-anchor="middle" font-family="Arial" font-size="28" fill="${color}">${j+1}</text><rect x="40" y="${ly}" width="1120" height="120" rx="8" fill="#edf5fb" stroke="#b7cde0"/><text x="65" y="${ly+48}" font-family="Microsoft YaHei" font-size="48" fill="#12344d">${lines.map((s,k)=>`<tspan x="65" dy="${k?54:0}">${k?'':j+1+' · '}${esc(s)}</tspan>`).join('')}</text>`);
 }
 const footer=i===3?'打点顺序依据原文下方总结；原页上方④标注措辞与总结不一致。':i===4?'原文展示值：1000Hz、100%、0%、10ms、P（Fix）；不是通用设定值。':'原始界面截图 · 按原手顺重新编排标注';
 const footerLines=footer.match(/.{1,35}/g)||[];
 svg+=`<text x="40" y="${height-75}" font-family="Microsoft YaHei" font-size="30" fill="#334c60">${footerLines.map((s,k)=>`<tspan x="40" dy="${k?38:0}">${esc(s)}</tspan>`).join('')}</text></svg>`;
 const base=await sharp(Buffer.from(svg)).composite([{input:photo,left:100,top:imageTop}]).png().toBuffer();
 const arrows=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}">${overlay.join('')}</svg>`);
 const filename=`rofin-clean-${String(i+1).padStart(2,'0')}.webp`;
 await sharp(base).composite([{input:arrows}]).webp({quality:95}).toFile(path.join(dir,filename));
 item.steps[i].image=`./assets/images/procedures/${filename}`;
}
m.machine.manualVersion='0.4.2';await fs.writeFile(manualPath,JSON.stringify(m,null,2)+'\n');
const swPath=path.join(root,'service-worker.js');let sw=await fs.readFile(swPath,'utf8');sw=sw.replace(/welding-guide-411-v\d+/,'welding-guide-411-v16');
sw=sw.replace(/const CORE_ASSETS = (\[[\s\S]*?\])\.map/,(_,json)=>'const CORE_ASSETS = '+JSON.stringify([...JSON.parse(json).filter(x=>!x.startsWith('./assets/images/procedures/')),...m.faults.flatMap(e=>e.steps.map(s=>s.image))],null,2)+'.map');
await fs.writeFile(swPath,sw);console.log('Recomposed 11 original laser screens');
