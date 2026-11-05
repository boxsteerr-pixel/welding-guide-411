import fs from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const manual = JSON.parse(await fs.readFile(new URL('data/manual.json',root),'utf8'));
const step = (id,page,title,text) => ({title,text,image:`./assets/images/procedures/${id}-${page}.webp`,alt:`${title} · 附件原页及现场标注`});
const entry=(id,title,summary,keywords,steps,risk='medium')=>({id,title,summary,risk,keywords,steps});
manual.machine.manualVersion='0.2.0';
manual.machine.lastUpdated='2026-11-05';
manual.machine.contentStatus='已录入8项异常处理手顺';
manual.notices=[{level:'info',title:'内容范围',body:'异常处理已收录8份现场手顺，包含操作、参数配置与维护内容。'}];
manual.faults=[
  entry('glass-cleaning','各光栅、摄像头玻璃片清洁','边部光栅、摄像头保护玻璃及1#、2#定位光栅反光板清洁。',['光栅','摄像头','玻璃片','清洁','边丝','定位不准','反光板'],[
    step('glass-cleaning',2,'边部光栅清洁确认','边部光栅接收器清洁上表面（带缝处），发射器清洁下表面（带缝处）。边丝易遮挡边部光栅及旁侧两个限位，需定期点检、及时清理；预热、退火加热装置容易放电，两个加热装置区域也要保证无边丝。'),
    step('glass-cleaning',3,'摄像头位置及保护玻璃清洁','沿WS方向（由右向左）依次为最外侧焊缝摄像头、穿透率摄像头、间隙摄像头。间隙和焊缝摄像头的保护玻璃可直接扣出，取下后进行清洁。'),
    step('glass-cleaning',4,'1#、2#定位光栅反光板清洁','遇带头、带尾定位不准时，应优先擦拭反光板；反光板一般1周至少擦拭一次。发射器、反光板位置见原图。')]),
  entry('rofin-laser','罗芬激光源操作手顺','激光源登录、操作模式、手动打点、常用数据及主控装置故障处理。',['罗芬','ROFIN','激光源','手动打点','主控装置','operator','功率等级','光闸'],[
    step('rofin-laser',1,'进入激光器显示及登录画面','通过“激光调整”按钮设定IP地址192.168.0.200，以观察者（Viewer）身份进入显示画面。绿色表示正常、黄色表示报警、红色表示故障。操作模式登录用户名、密码均为operator。'),
    step('rofin-laser',2,'操作模式和启动流程','原文解锁密码1234。0为锁定模式，M为手动模式（手动激光打点），A为自动模式。按钮包括电源、高压、出激光、光闸。原文启动流程：电源启动→水试验→丝极启动→待机启动→激光器已启动。'),
    step('rofin-laser',3,'手动激光打点','按原页下方“总结”：①修改激光功率等级并确认；②打开激光电源；③出现待机启动，点击高压按钮；④激光打点前打开光闸；⑤出现激光器已启动，点击出激光按钮，打点结束后关闭光闸；⑥将手动模式M切换到自动模式A。原页上方④标注与下方总结措辞不一致，保留原页供核对。'),
    step('rofin-laser',4,'修改激光打点常用数据','点击“程序”→“脉冲”，选择P对应的脉冲程序（55），修改频率、占空比、持续时间等，完成后点击“提交”。原文展示数据：频率1000Hz、占空比100%、功率等级0%、持续时间10ms、脉冲模式P（Fix）；这些为附件展示值。'),
    step('rofin-laser',5,'解除激光器主控装置故障','出现“客户端不是主控装置”时，点击“状态”按钮，观察主控装置为离线状态，点击“》”按钮，再点击“设定主控装置”，观察主控装置变为在线状态。')],'high'),
  entry('width-alarm-check','测宽装置使用及报警功能确认','摄像头测宽入口、板宽偏差报警及板宽确认操作。',['测宽','板宽确认','摄像头测宽','对中自动步','误差过大','10mm'],[
    step('width-alarm-check',1,'测宽入口与报警确认','在“功能选择”中找到“摄像头测宽”按钮。出现“实测与机组板宽误差过大，注意检测”报警信息时，对中自动步会停止，此时需点击“板宽确认”，对中自动步才会恢复。若实测宽度数值确实与实际宽度数值存在较大偏差（＞10mm），现场人员需确认好宽度值，将正确数值覆盖错误数值。')]),
  entry('laser-alarm-history','查找激光报警信息','从焊机HMI进入激光器实时报警和历史报警画面。',['激光报警','实时信息','历史信息','Int','192.168.0.200'],[
    step('laser-alarm-history',1,'从HMI进入激光调整','当焊机HMI报警信息中出现激光设备报警，点击“激光调整画面”按钮，选择激光器已设定IP地址192.168.0.200，点击“正常”按钮。'),
    step('laser-alarm-history',2,'查看实时报警和历史报警','进入激光调整画面后，点击“Int”按钮，进入激光报警信息画面。图四为激光报警实时信息，图五为激光报警历史信息。')]),
  entry('qcds-sensor-parameters','QCDS图像修改传感器参数','阈值参数、熔透传感器图像及熔透率曲线参数配置。',['QCDS','阈值','熔透率','传感器参数','图像比例','光斑亮度','水平','垂直'],[
    step('qcds-sensor-parameters',1,'修改阈值参数','原文以熔透率上阈值为例：通过“配置”→“阈值管理”→“阈值参数”进入参数表，按原图标注选择记录及参数，修改后点击“保存”。具体选项、勾选位置见原页；截图内数值为示例。'),
    step('qcds-sensor-parameters',2,'修改熔透传感器图像配置','Gain（Raw）减小则图像比例变大，增大则图像比例变小，原文限定数值为16、32、64、128等。Width、Height分别为宽度、高度。水平、垂直参数两个数值要相同；原文说明“1＝放大4倍的2”。曝光相关参数增加则提高光斑亮度，减小则降低光斑亮度，参数位置见原图。'),
    step('qcds-sensor-parameters',3,'调整熔透率曲线及飞溅显示','原图所标曲线参数增加则熔透率曲线比例变小，减小则曲线比例变大。打开原图所标选项可淡化光斑周围飞溅，但会降低光斑和对接间隙线清晰度。')],'high'),
  entry('qcds-camera-change','QCDS系统修改传感器摄像头','原文手顺为关闭间隙、焊缝、熔透、外形传感器，并保存配置、重启ProV3。',['QCDS','摄像头','关闭传感器','间隙','焊缝','熔透','外形','ProV3','系统配置'],[
    step('qcds-camera-change',1,'修改传感器配置并重启ProV3','①点击“操作”→“运行权限”→“调试员”，原文密码9999；②点击“配置”→“系统配置”；③按原图选择需要修改的间隙、焊缝、熔透或外形传感器，点击“保存”；④保存后出现提示窗口，需要重新启动ProV3；⑤点击“文件”→“退出”；⑥从桌面重新打开ProV3，进入QCDS界面。')],'high'),
  entry('tia-program-download','博图程序备份下载手顺','程序块修改后的保存、下载、同步及项目归档。',['博图','TIA','PLC','FC','FB','DB','下载','备份','同步','归档'],[
    step('tia-program-download',1,'保存项目并下载程序块','打开项目进入博图程序。修改FC、FB、DB块后，状态图标会显示在线与离线不同。点击“保存项目”，再点击“下载”，在弹出的界面选择“确定”，查看需要同步的程序块。原图区分“本地→PLC”和“PLC→本地”两个方向。'),
    step('tia-program-download',2,'完成同步并归档','选择同步，待传输完成出现总结窗口；一切正常时点击“完成”。程序块状态按原图恢复后，在左上角“项目（P）”中选择“归档（H）”，查看归档目标路径。'),
    step('tia-program-download',3,'查找归档文件','在目标路径的磁盘中找到归档文件夹，目录示例及标注见原页。')],'high'),
  entry('guide-wheel-height','调整411焊机导向轮高度','C411下导向轮高度测量及现场量具布置图。',['导向轮','下导向轮','高度','测量','入口','出口','百分表'],[
    step('guide-wheel-height',1,'测量入、出口导向轮高度','按照原图查看入、出口导向轮高度测量和量具布置。附件未给出小车具体位置、目标高度、允许偏差或完整调整步骤，本条保留原图内容。')],'high')
];
await fs.writeFile(new URL('data/manual.json',root),JSON.stringify(manual,null,2)+'\n');
const swURL=new URL('service-worker.js',root);
let sw=await fs.readFile(swURL,'utf8');
sw=sw.replace(/welding-guide-411-v\d+/, 'welding-guide-411-v12');
const images=manual.faults.flatMap(x=>x.steps.map(s=>s.image));
sw=sw.replace(/const CORE_ASSETS = (\[[\s\S]*?\])\.map/, (_,json)=> {
  const core=JSON.parse(json).filter(x=>!x.startsWith('./assets/images/procedures/'));
  return 'const CORE_ASSETS = '+JSON.stringify([...core,...images],null,2)+'.map';
});
await fs.writeFile(swURL,sw);
console.log(`Imported ${manual.faults.length} procedures and ${images.length} source pages`);
