import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const sharp=createRequire(import.meta.url)('C:/Users/BOXSTER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(import.meta.dirname,'..'),dir=path.join(root,'assets/images/procedures');
const sourceDir=path.join(dir,'originals');await fs.mkdir(sourceDir,{recursive:true});
// Each target is checked against the supplied source image: left, top, width, height.
// Blue = observe/identify; orange = operate. No device values are synthesized.
const a=(text,box,observe=false)=>({text,box,observe});
const plans={
 'glass-cleaning':{folder:'glass-cleaning',files:[1,2,3,4,5,6,7,8],notes:[
 [a('边部光栅位置；接收器清洁上表面，发射器清洁下表面。',[.68,.0,.23,.18],true),a('定期清理边丝，避免遮挡光栅及旁侧限位。',[.70,.78,.20,.22],true)],
 [a('接收器上表面带缝处：清洁此部位。',[.38,.48,.36,.24])],
 [a('焊缝摄像头位置。',[.08,.10,.20,.30],true),a('熔透摄像头位置。',[.50,.66,.20,.30],true),a('间隙摄像头位置。',[.81,.60,.18,.32],true)],
 [a('摄像头保护玻璃位置图一；保护玻璃可取下清洁。',[.33,.32,.62,.32])],
 [a('摄像头保护玻璃位置图二；保护玻璃可取下清洁。',[.24,.27,.60,.38])],
 [a('2#光栅发射器。',[.10,.16,.18,.28],true),a('1#光栅发射器。',[.49,.0,.16,.22],true),a('2#光栅反光板。',[.15,.63,.17,.26],true),a('1#光栅反光板。',[.55,.55,.16,.25],true)],
 [a('定位光栅反光板；带头、带尾定位不准时优先擦拭。',[.28,.22,.45,.35]),a('反光板一般每周至少擦拭一次。',[.28,.22,.45,.35],true)],
 [a('另一处定位光栅反光板；按原图位置擦拭。',[.40,.42,.43,.33])]
 ]},
 'laser-alarm-history':{folder:'alarm-history',files:[1,2,3,4,5],notes:[
 [a('在HMI报警信息中查看激光设备报警。',[.03,.15,.80,.20],true)],
 [a('激光调整画面：选择已设定IP地址192.168.0.200。',[.36,.32,.25,.19]),a('点击“正常”进入。',[.38,.49,.12,.05])],
 [a('在激光调整窗口点击“Int”，进入激光报警信息。',[.505,.48,.025,.055])],
 [a('此画面为激光报警实时信息。',[.26,.23,.47,.54],true)],
 [a('此画面为激光报警历史信息。',[.26,.25,.47,.53],true)]
 ]},
 'qcds-sensor-parameters':{folder:'qcds-parameters',files:[1,2,3,4,5,6],notes:[
 [a('点击“配置”。',[.285,.32,.075,.07]),a('选择“阈值管理”。',[.29,.66,.19,.06]),a('选择“阈值参数”。',[.49,.69,.17,.055])],
 [a('按材料、板厚等条件选择参数记录。',[.06,.11,.78,.72]),a('进入“部分设置”。',[.86,.16,.13,.08])],
 [a('勾选需要修改的熔透率参数。',[.46,.61,.025,.07]),a('修改熔透率上阈值；图中数值是示例。',[.36,.61,.055,.07]),a('完成后点击“保存”。',[.71,.83,.09,.06])],
 [a('Gain（Raw）：限定值16、32、64、128等；减小图像比例变大，增大则变小。',[.21,.21,.56,.055]),a('Width、Height分别为宽度、高度。',[.20,.48,.58,.10],true),a('水平与垂直Binning参数数值要相同；原文说明1相较2放大4倍。',[.20,.69,.58,.09])],
 [a('Exposure Time增加则提高光斑亮度，减小则降低光斑亮度。',[.09,.61,.69,.055])],
 [a('原图所标曲线参数：增加则熔透率曲线比例变小，减小则变大。',[.35,.67,.18,.045]),a('飞溅淡化选项：开启后会降低光斑及对接间隙线清晰度。',[.33,.71,.17,.045])]
 ]},
 'qcds-camera-change':{folder:'qcds-camera',files:[2,1,4,3,6,5],notes:[
 [a('操作→运行权限→调试员。',[.24,.10,.09,.06]),a('运行权限菜单。',[.27,.16,.27,.07]),a('选择“调试员”。',[.55,.28,.21,.06])],
 [a('输入原文调试员密码9999。',[.32,.35,.59,.15]),a('点击“确定”。',[.33,.74,.29,.14])],
 [a('点击“配置”。',[.27,.06,.08,.06]),a('点击“系统配置”。',[.30,.38,.25,.065])],
 [a('间隙、焊缝传感器选择项。',[.32,.31,.055,.15]),a('熔透、外形传感器选择项。',[.61,.31,.06,.15]),a('选择目标传感器后点击“保存”。',[.60,.87,.14,.06])],
 [a('保存系统配置后会出现重启提示。',[.59,.91,.14,.06]),a('确认提示，需重新启动ProV3才能使配置生效。',[.63,.66,.17,.06])],
 [a('点击“文件”。',[.07,.13,.10,.07]),a('选择“退出”。',[.08,.72,.28,.06]),a('退出后从桌面重新打开ProV3，进入QCDS。',[.08,.72,.28,.06],true)]
 ]},
 'width-alarm-check':{folder:'width-original',files:[1,'2.png'],notes:[
 [a('在“功能选择”中找到“摄像头测宽”。',[.22,.81,.37,.055])],
 [a('出现板宽偏差过大的报警，对中自动步会停止。',[.15,.08,.85,.20],true),a('点击“板宽确认”后，对中自动步才会恢复。',[.86,.64,.09,.23]),a('实测与实际宽度偏差＞10mm时，现场确认正确值后覆盖错误值。',[.77,.68,.085,.18],true)]
 ]},
 'tia-program-download':{folder:'tia-original',files:[1,3,6,7,9,10,11],notes:[
 [a('打开项目后，“保存项目”用于保存修改。',[.11,.52,.18,.20]),a('下载方向：本地→PLC。',[.73,.50,.045,.20]),a('上载方向：PLC→本地。',[.78,.50,.045,.20])],
 [a('FC、FB、DB块修改后，图标显示在线与离线不同。',[.74,.50,.055,.20],true)],
 [a('先保存项目，再下载。出现此提示后点击“确定”查看需同步的程序块。',[.72,.70,.17,.08])],
 [a('选择“同步”，等待传输完成；正常时在总结窗口点击“完成”。',[.42,.85,.15,.10])],
 [a('点击左上角“项目（P）”。',[.13,.22,.17,.07]),a('选择“归档（H）”。',[.15,.58,.19,.06])],
 [a('查看并确认归档目标路径。',[.24,.23,.69,.11],true),a('按原文执行归档操作。',[.60,.83,.16,.055])],
 [a('在目标路径磁盘中找到归档文件夹。',[.06,.61,.20,.055],true),a('原图展示归档文件列表。',[.42,.19,.56,.38],true)]
 ]},
 'guide-wheel-height':{folder:'wheel-original',files:[1,2],notes:[
 [a('原图为入、出口导向轮高度测量布置。',[.33,.29,.40,.22],true)],
 [a('原图为测量表及导向轮布置。',[.10,.09,.40,.20],true),a('原附件未给出小车具体位置、目标高度、允许偏差或完整调整步骤。',[.05,.03,.80,.55],true)]
 ]}
};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
// Final bounds checked at full image size against source annotations.
plans['laser-alarm-history'].notes[1][0].box=[.385,.424,.13,.033];
plans['laser-alarm-history'].notes[1][1].box=[.389,.46,.055,.033];
plans['laser-alarm-history'].notes[2][0].box=[.248,.50,.025,.045];
plans['qcds-sensor-parameters'].notes[0][0].box=[.30,.22,.055,.05];
plans['tia-program-download'].notes[5][0].box=[.28,.74,.65,.07];
plans['tia-program-download'].notes[5][1].box=[.63,.86,.13,.05];
plans['qcds-sensor-parameters'].notes[2][0].box=[.485,.70,.025,.035];
plans['qcds-sensor-parameters'].notes[2][1].box=[.375,.70,.073,.035];
plans['qcds-sensor-parameters'].notes[2][2].box=[.739,.93,.075,.032];
plans['qcds-sensor-parameters'].notes[3][2].box=[.20,.665,.58,.065];
plans['qcds-sensor-parameters'].notes[5][0].box=[.32,.612,.13,.023];
plans['qcds-sensor-parameters'].notes[5][0].text='滤波阈值增加则熔透率曲线比例变小，减小则曲线比例变大。';
plans['qcds-sensor-parameters'].notes[5][1].box=[.315,.646,.025,.015];
plans['qcds-camera-change'].notes[3][1].box=[.69,.31,.055,.15];
plans['qcds-camera-change'].notes[4][0].box=[.63,.855,.14,.05];
plans['qcds-camera-change'].notes[4][1].box=[.67,.585,.17,.065];
plans['qcds-camera-change'].notes[5][2].box=null;
plans['glass-cleaning'].notes[6][1].box=null;
plans['guide-wheel-height'].notes[1][1].box=null;
const manualPath=path.join(root,'data/manual.json'),m=JSON.parse(await fs.readFile(manualPath,'utf8'));
let count=0;
for(const entry of m.faults){
 if(entry.id==='rofin-laser')continue;
 const plan=plans[entry.id];if(plan.files.length!==entry.steps.length)throw Error(entry.id);
 for(const [i,step] of entry.steps.entries()){
  const raw=String(plan.files[i]).includes('.')?`image${plan.files[i]}`:`image${plan.files[i]}.jpeg`;
  const sourceName=`${plan.folder}-${path.parse(raw).name}.webp`,source=path.join(sourceDir,sourceName);
  try{await fs.access(source);}catch{await sharp(path.join(root,'review/source-import',plan.folder,raw)).resize({width:2400,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:97}).toFile(source);}
  const photo=await sharp(source).resize(1000).sharpen({sigma:.5,m1:.4,m2:.8}).png().toBuffer(),meta=await sharp(photo).metadata();
  const defs=plan.notes[i];
  const rows=defs.map(d=>({...d,lines:d.text.match(/.{1,19}/g)||[]}));
  const footerHeight=rows.reduce((n,r)=>n+Math.max(120,60+r.lines.length*54)+20,0);
  const height=meta.height+footerHeight+300,overlay=[];
  let ly=meta.height+200;
  for(const [j,d] of rows.entries()){
   const color=d.observe?'#087ca7':'#df4b16';
   if(d.box){
   const [x,y,w,h]=d.box;
   const xx=100+x*1000,yy=130+y*meta.height;
   overlay.push(`<rect x="${xx}" y="${yy}" width="${w*1000}" height="${h*meta.height}" fill="none" stroke="white" stroke-width="9"/><rect x="${xx}" y="${yy}" width="${w*1000}" height="${h*meta.height}" fill="none" stroke="${color}" stroke-width="5"/><circle cx="${xx+20}" cy="${Math.max(110,yy-22)}" r="20" fill="white" stroke="${color}" stroke-width="4"/><text x="${xx+20}" y="${Math.max(110,yy-22)+9}" text-anchor="middle" font-family="Arial" font-size="28" fill="${color}">${j+1}</text>`);
   }
   const rh=Math.max(120,60+d.lines.length*54);
   overlay.push(`<rect x="40" y="${ly}" width="1120" height="${rh}" rx="8" fill="#edf5fb"/><text x="65" y="${ly+54}" font-family="Microsoft YaHei" font-size="48" fill="#12344d">${d.lines.map((s,k)=>`<tspan x="65" dy="${k?54:0}">${k?'':j+1+' · '}${esc(s)}</tspan>`).join('')}</text>`);ly+=rh+20;
  }
  const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}"><rect width="1200" height="${height}" fill="white"/><rect width="1200" height="100" fill="#073e6c"/><text x="30" y="65" fill="white" font-family="Microsoft YaHei" font-size="40">${i+1}. ${esc(step.title)}</text></svg>`);
  const base=await sharp(svg).composite([{input:photo,left:100,top:130}]).png().toBuffer();
  const name=`${entry.id}-mobile-${String(i+1).padStart(2,'0')}.webp`;
  await sharp(base).composite([{input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}">${overlay.join('')}</svg>`)}]).webp({quality:95}).toFile(path.join(dir,name));
  step.image=`./assets/images/procedures/${name}`;step.alt=rows.map((d,j)=>`${j+1}：${d.text}`).join(' ');
  // Retain source requirements while removing the obsolete export truncation note.
  step.text=step.text.replace(/附件导出页底部画面不完整，请以现场界面为准。/g,'').replace(/本条保留原图内容。/g,'');
  if(entry.id==='tia-program-download'&&i===5)step.text='查看归档目标路径并按原文进行归档；此处已恢复完整原图。';
  count++;
 }
}
m.machine.manualVersion='0.5.0';await fs.writeFile(manualPath,JSON.stringify(m,null,2)+'\n');
const swpath=path.join(root,'service-worker.js');let sw=await fs.readFile(swpath,'utf8');
sw=sw.replace(/welding-guide-411-v\d+/,'welding-guide-411-v17');
sw=sw.replace(/const CORE_ASSETS = (\[[\s\S]*?\])\.map/,(_,json)=>'const CORE_ASSETS = '+JSON.stringify([...JSON.parse(json).filter(x=>!x.startsWith('./assets/images/procedures/')),...m.faults.flatMap(e=>e.steps.map(s=>s.image))],null,2)+'.map');
await fs.writeFile(swpath,sw);console.log(`Prepared ${count} mobile figures in 7 procedures`);
