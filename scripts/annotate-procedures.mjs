import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const sharp=createRequire(import.meta.url)('C:/Users/BOXSTER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(import.meta.dirname,'..');
const p=path.join(root,'assets/images/procedures');
const data=JSON.parse(await fs.readFile(path.join(root,'data/manual.json'),'utf8'));
// Labels are transcribed from the supplied procedures; unclear identification is not inferred.
const notes={
 'glass-cleaning':[
  '红框为边部光栅位置。接收器清洁上表面；发射器清洁下表面。','红框：接收器上表面带缝处，需清洁。',
  '按原图标注辨认焊缝、熔透和间隙摄像头。','红框为摄像头保护玻璃位置，可取下清洁。','红框为摄像头保护玻璃位置，可取下清洁。',
  '原图分别标出1#、2#发射器与反光板。','红框：定位光栅反光板，定位不准时优先擦拭。','红框：定位光栅反光板，定位不准时优先擦拭。'],
 'rofin-laser':[
  '激光调整中使用原文IP地址192.168.0.200进入。绿色正常、黄色报警、红色故障。','登录操作模式：用户名operator；密码operator。',
  '0锁定、M手动、A自动；原文解锁密码1234。画面下方依次为电源、高压、出激光、光闸。',
  '手动打点按原文总结：功率确认→电源→高压→打点前开光闸→出激光→打点后关光闸→切回自动。原图④标注与总结措辞不一致。',
  '查看画面常用数据，点击左下方“程序”。原文数值是示例。','点击左下方红圈内“脉冲”。','选择P对应的脉冲程序55。','修改频率、占空比、持续时间等，完成后点击“提交”。',
  '出现“客户端不是主控装置”时，点击左下方“状态”。','查看主控装置离线状态，点击右下方“》”。','点击“设定主控装置”，确认主控装置为在线状态。'],
 'width-alarm-check':['功能选择画面中，红框为“摄像头测宽”。','板宽偏差报警时，对中自动步停止；按“板宽确认”后恢复。若实测与实际偏差＞10mm，现场确认正确值后覆盖错误值。'],
 'laser-alarm-history':['HMI报警信息中出现激光设备报警。','点击激光调整画面，选择已设定IP地址192.168.0.200，点击“正常”。','进入激光调整画面，点击“Int”进入报警信息。','图四：激光报警实时信息。','图五：激光报警历史信息。'],
 'qcds-sensor-parameters':['依原图编号：配置→阈值管理→阈值参数。','按材料和板厚等条件选择参数记录，再按原图进入部分设置。','勾选需要修改的熔透率参数，修改上阈值后保存；图中数值是示例。','Gain（Raw）减小则图像比例变大，增大则变小；限定值16、32、64、128等。水平和垂直参数数值需相同。','Exposure Time增加提高光斑亮度，减小降低光斑亮度。','原图所标曲线参数增加则曲线比例变小；飞溅淡化会降低光斑和对接间隙线清晰度。'],
 'qcds-camera-change':['依原图编号：操作→运行权限→调试员。','输入原文调试员密码9999，点击确定。','依原图编号：配置→系统配置。','在系统配置中选择目标传感器，点击保存。','保存后确认提示；配置生效需重新启动ProV3。','点击文件→退出，再从桌面打开ProV3进入QCDS。'],
 'tia-program-download':['打开博图项目。原图区分保存、本地→PLC、PLC→本地。','修改FC、FB、DB块后，图标显示在线与离线不同。','点击保存项目、下载；弹出同步提示后点击“确定”。','选择同步，传输完成后一切正常时点击“完成”。','点击“项目（P）”→“归档（H）”。','点击归档后查看目标路径。附件导出页底部画面不完整，请以现场界面为准。','在目标路径磁盘中找到归档文件夹。'],
 'guide-wheel-height':['原文展示导向轮高度的测量布置。','原文展示导向轮与测量表布置；未给出目标高度或完整调整步骤。']
};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const wrap=(str,n)=>{const out=[];for(let i=0;i<str.length;i+=n)out.push(str.slice(i,i+n));return out;};
for(const entry of data.faults){
 if(notes[entry.id]?.length!==entry.steps.length)throw Error(`annotation count ${entry.id}`);
 for(const [i,step] of entry.steps.entries()){
  const old=path.basename(step.image);const input=path.join(p,old);
  // The first width image had its red target clipped. Return to the unmodified source page.
  let img=sharp(input);
  if(old==='width-alarm-check-1-panel-1.webp'){
   const source=path.join(p,'width-alarm-check-1.webp');const m=await sharp(source).metadata();
   img=sharp(source).extract({left:Math.round(m.width*.14),top:Math.round(m.height*.16),width:Math.round(m.width*.72),height:Math.round(m.height*.35)});
  }
  // Restore the original side callouts that extended past the previous crop.
  if(old==='rofin-laser-3-panel-1.webp' || old==='rofin-laser-2-panel-1.webp'){
   const page=old.startsWith('rofin-laser-3')?'rofin-laser-3.webp':'rofin-laser-2.webp';
   const source=path.join(p,page),m=await sharp(source).metadata();
   img=sharp(source).extract({left:0,top:Math.round(m.height*.12),width:m.width,height:Math.round(m.height*.43)});
  }
  const photo=await img.resize({width:1200,withoutEnlargement:false}).png().toBuffer();
  const meta=await sharp(photo).metadata();const note=notes[entry.id][i];const lines=wrap(note,31);
  const footer=68+lines.length*44;const total=meta.height+100+footer;
  const svg=`<svg width="1200" height="${total}" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="${total}" fill="#fff"/><rect width="1200" height="100" fill="#073e6c"/><text x="36" y="64" fill="white" font-size="38" font-weight="bold" font-family="Microsoft YaHei">${esc(step.title)}</text><rect y="${meta.height+100}" width="1200" height="${footer}" fill="#edf5fb"/><text x="36" y="${meta.height+155}" fill="#142b3d" font-size="32" font-family="Microsoft YaHei">${lines.map((s,j)=>`<tspan x="36" dy="${j?44:0}">${esc(s)}</tspan>`).join('')}</text></svg>`;
  const name=old.replace('.webp','-annotated.webp');
  await sharp(Buffer.from(svg)).composite([{input:photo,left:0,top:100}]).webp({quality:94}).toFile(path.join(p,name));
  const previous=step.text;
  step.image=`./assets/images/procedures/${name}`;step.text=previous && !previous.includes('操作说明见本组第一张图') && previous!==note ? `${note} ${previous}` : note;step.alt=`${step.title}：${note}`;
 }
}
data.machine.manualVersion='0.4.0';
await fs.writeFile(path.join(root,'data/manual.json'),JSON.stringify(data,null,2)+'\n');
const swpath=path.join(root,'service-worker.js');let sw=await fs.readFile(swpath,'utf8');
sw=sw.replace(/welding-guide-411-v\d+/,'welding-guide-411-v14');
const images=data.faults.flatMap(e=>e.steps.map(s=>s.image));
sw=sw.replace(/const CORE_ASSETS = (\[[\s\S]*?\])\.map/,(_,json)=>'const CORE_ASSETS = '+JSON.stringify([...JSON.parse(json).filter(x=>!x.startsWith('./assets/images/procedures/')),...images],null,2)+'.map');
await fs.writeFile(swpath,sw);console.log('Annotated',images.length,'images');
