import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/BOXSTER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(import.meta.dirname,'..');
const dir=path.join(root,'assets/images/procedures');
// Rectangles are fractions of the original rendered page: left, top, right, bottom.
// Each rectangle isolates one source photograph or one operating screen.
const panels={
 'glass-cleaning-2':[['边部光栅现场位置',.40,.20,.78,.72],['接收器上表面清洁位置',.78,.20,.99,.72]],
 'glass-cleaning-3':[['各摄像头现场位置',.06,.29,.51,.80],['摄像头保护玻璃位置图一',.52,.29,.76,.80],['摄像头保护玻璃位置图二',.77,.29,.98,.80]],
 'glass-cleaning-4':[['定位光栅发射器位置',.05,.29,.48,.83],['定位光栅反光板位置图一',.51,.30,.73,.77],['定位光栅反光板位置图二',.76,.30,.97,.77]],
 'rofin-laser-1':[['激光器显示画面',.14,.27,.86,.60],['操作模式登录画面',.14,.63,.86,.92]],
 'rofin-laser-2':[['激光器操作模式及按钮',.14,.12,.87,.54]],
 'rofin-laser-3':[['手动打点控制画面',.12,.12,.88,.54]],
 'rofin-laser-4':[['查看数据并点击程序',.14,.12,.51,.31],['点击脉冲',.48,.36,.85,.54],['选择脉冲程序55',.14,.60,.49,.83],['修改常用数据并提交',.49,.60,.86,.83]],
 'rofin-laser-5':[['客户端不是主控装置故障',.14,.12,.86,.34],['查看主控装置离线状态',.14,.42,.86,.62],['设定主控装置并查看在线状态',.14,.70,.86,.90]],
 'width-alarm-check-1':[['功能选择中的摄像头测宽',.14,.15,.86,.44],['测宽报警及板宽确认',.14,.50,.86,.78]],
 'laser-alarm-history-1':[['焊机HMI激光设备报警',.13,.13,.87,.40],['选择激光器地址进入激光调整',.13,.48,.87,.75]],
 'laser-alarm-history-2':[['激光调整画面与Int按钮',.13,.12,.87,.40],['激光报警实时信息',.12,.59,.50,.80],['激光报警历史信息',.50,.59,.88,.80]],
 'qcds-sensor-parameters-1':[['打开阈值参数',.14,.14,.86,.39],['选择参数记录',.14,.40,.86,.62],['修改熔透率阈值并保存',.14,.63,.86,.91]],
 'qcds-sensor-parameters-2':[['图像比例及宽度高度参数',.11,.12,.89,.57],['光斑亮度参数',.11,.60,.89,.91]],
 'qcds-sensor-parameters-3':[['熔透率曲线及飞溅显示',.10,.10,.90,.90]],
 'qcds-camera-change-1':[['进入调试员权限',.01,.125,.55,.29],['输入调试员密码',.58,.125,.89,.29],['打开系统配置',.01,.30,.55,.55],['选择传感器并保存',.58,.30,.95,.55],['确认重启提示',.14,.56,.55,.83],['退出ProV3并重新打开',.57,.56,.96,.83]],
 'tia-program-download-1':[['保存项目与下载方向',.11,.13,.87,.37],['检查程序块在线离线状态',.14,.39,.82,.55],['下载后确认同步提示',.14,.67,.76,.88]],
 'tia-program-download-2':[['同步程序块并完成',.13,.08,.87,.32],['选择项目归档',.13,.43,.87,.74],['查看归档目标路径',.13,.76,.87,.99]],
 'tia-program-download-3':[['在目标路径查找归档文件',.12,.29,.88,.84]],
 'guide-wheel-height-1':[['导向轮高度测量布置',.14,.15,.65,.34],['导向轮测量表安装位置',.14,.35,.85,.91]]
};
const file=path.join(root,'data/manual.json');
const manual=JSON.parse(await fs.readFile(file,'utf8'));
let count=0;
for(const entry of manual.faults){
 const next=[];
 for(const old of entry.steps){
  const key=path.basename(old.image,'.webp');
  const defs=panels[key]; if(!defs) throw Error('Missing crop plan '+key);
  const src=path.join(dir,key+'.png'); const meta=await sharp(src).metadata();
  for(const [i,[label,x1,y1,x2,y2]] of defs.entries()){
   const left=Math.round(x1*meta.width),top=Math.round(y1*meta.height);
   const width=Math.round(x2*meta.width)-left,height=Math.round(y2*meta.height)-top;
   const name=`${key}-panel-${i+1}.webp`;
   await sharp(src).extract({left,top,width,height}).webp({quality:95,effort:5}).toFile(path.join(dir,name));
   next.push({title:label,text:i===0?old.text:`${old.title}：${label}。操作说明见本组第一张图。`,image:`./assets/images/procedures/${name}`,alt:`${label}，源手顺截图`});count++;
  }
 }
 entry.steps=next;
}
manual.machine.manualVersion='0.3.0';
await fs.writeFile(file,JSON.stringify(manual,null,2)+'\n');
const swfile=path.join(root,'service-worker.js');let sw=await fs.readFile(swfile,'utf8');
sw=sw.replace(/welding-guide-411-v\d+/,'welding-guide-411-v13');
const images=manual.faults.flatMap(e=>e.steps.map(s=>s.image));
sw=sw.replace(/const CORE_ASSETS = (\[[\s\S]*?\])\.map/,(_,json)=>'const CORE_ASSETS = '+JSON.stringify([...JSON.parse(json).filter(p=>!p.startsWith('./assets/images/procedures/')),...images],null,2)+'.map');
await fs.writeFile(swfile,sw);
console.log(`Prepared ${count} individual images`);
