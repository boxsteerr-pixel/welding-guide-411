# welding-guide-411

411激光焊机操作工快速处置手册的独立 PWA 项目。异常处理已录入8份现场手顺，源页按现场图片与操作画面拆分成47张独立图片，图片随应用安装缓存并可放大。

版本0.4.0逐图补充了源手顺中的操作说明，并恢复测宽入口及激光打点截图中被截去的标注。博图归档目标路径截图在源文导出页底部不完整，条目中予以注明。

## 2026-11-05 内容录入

按用户要求，以下内容统一放入“异常处理”：光栅及摄像头玻璃片清洁、罗芬激光源、测宽装置及报警确认、查找激光报警信息、QCDS传感器参数、QCDS摄像头配置、博图程序备份下载、导向轮高度测量。

文档以只读方式通过WPS/Office导出核验页，再转为2000像素长边WebP；保留原页文字、截图、箭头与标注。PPT封面及测宽文档末尾空白页不作为步骤收录。源文件不改写。`scripts/read-source-procedures.ps1`用于重新读取桌面附件，核对中间文件保存在不纳入版本管理的`review/source-import/`。

源文限制：导向轮附件未提供目标高度、允许偏差和完整调整步骤；激光打点原页④标注与同页下方总结存在措辞不一致。对应条目保留原页并注明。文中参数为原文展示值，不扩大为通用设定值。

## 目录职责

- `data/manual.json`：设备信息、版本与全部手册内容的主要维护入口。
- `assets/images/`：本设备独立图片目录；建议保留能辨认设备细节的清晰度，不设500KB硬上限。
- `css/style.css`、`js/app.js`：通用模板表现与交互，复制到其他设备时通常无需修改。
- `manifest.json`、`service-worker.js`：本设备独立 PWA 配置和缓存边界。

## 内容结构

`faults`、`maintenance`、`safety` 均为项目数组。项目可使用以下字段：

```json
{
  "id": "unique-item-id",
  "title": "经审核的项目标题",
  "risk": "high",
  "keywords": ["关键词"],
  "summary": "简短说明",
  "checks": ["检查项"],
  "stopConditions": ["必须停机并上报的条件"],
  "steps": [
    {
      "title": "步骤标题",
      "text": "经审核的操作说明",
      "image": "./assets/images/example.jpg",
      "alt": "图片中的设备部位说明"
    }
  ]
}
```

正式内容必须经设备、安全与现场责任人审核。大图查看支持按钮缩放、双指缩放、拖动与浏览器返回关闭。

## 本地检查

必须通过 HTTP 服务打开，不能直接双击 `index.html`，否则浏览器会限制 JSON 读取和 Service Worker。

```powershell
node tests/validate.mjs
```

复制为后续设备模板时，至少修改：`data/manual.json` 的 `machine`、`manifest.json`、Service Worker 的 `CACHE_NAME/CACHE_PREFIX`、图标和 README。
