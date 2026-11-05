import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFile(path.join(root, file), "utf8");
const files = ["index.html", "css/style.css", "js/app.js", "data/manual.json", "manifest.json", "service-worker.js", "assets/icons/icon.svg", "assets/icons/icon-192.png", "assets/icons/icon-512.png"];
await Promise.all(files.map((file) => stat(path.join(root, file))));
const [html, app, dataText, manifestText, sw] = await Promise.all([read("index.html"), read("js/app.js"), read("data/manual.json"), read("manifest.json"), read("service-worker.js")]);
const manual = JSON.parse(dataText);
const manifest = JSON.parse(manifestText);

assert.equal(manual.machine.machineId, "411");
assert.equal(manual.machine.machineName, "411激光焊机");
assert.equal(manual.machine.manualVersion, "0.5.0");
assert.equal(manual.faults.length, 8);
assert.equal(new Set(manual.faults.map(item => item.id)).size, 8);
assert.deepEqual(manual.maintenance, []);
assert.deepEqual(manual.safety, []);
assert.equal(manifest.start_url, "./");
assert.equal(manifest.scope, "./");
assert.match(sw, /const CACHE_NAME = "welding-guide-411-v17"/);
assert.match(html, /id="currentTime"/);
assert.match(html, /system-time\.js\?v=1/);
assert.match(sw, /system-time\.js\?v=1/);
assert.match(sw, /const CACHE_PREFIX = "welding-guide-411-"/);
assert.match(sw, /\.\/data\/manual\.json/);
assert.match(app, /fetch\("\.\/data\/manual\.json"/);
assert.match(html, /data-section="faults"/);
assert.match(html, /id="image-modal"/);

const combined = `${html}\n${app}\n${dataText}\n${manifestText}\n${sw}`;
assert.doesNotMatch(combined, /boxsteerr-pixel\.github\.io\/welding-guide\//, "不得引用101线上资源");
assert.doesNotMatch(combined, /(?:src|href)=["']\/welding-guide\//, "不得硬编码101路径");
const images = manual.faults.flatMap(item => {
  assert.ok(item.title && item.summary && item.keywords.length && item.steps.length, item.id);
  for (const step of item.steps) assert.ok(step.text && step.alt && step.image, item.id);
  return item.steps.map(step => step.image);
});
assert.equal(images.length, 47);
assert.equal(new Set(images).size, images.length);
for (const image of images) {
  assert.match(image, /^\.\/assets\/images\/procedures\/[a-z0-9-]+\.webp$/);
  assert.ok((await stat(path.join(root, image))).size > 1000, image);
}
const listeners = new Map(), cacheStore = new Map();
const cache = {addAll: async urls => {for (const url of urls) cacheStore.set(url, {ok:true,url});},match:async request=>cacheStore.get(typeof request==='string'?request:request.url)};
let pending;
vm.runInNewContext(sw, {URL, Promise, self:{location:{href:'https://test/welding-guide-411/service-worker.js',origin:'https://test'},addEventListener:(name,fn)=>listeners.set(name,fn)},caches:{open:async()=>cache},fetch:async()=>{throw Error('offline');}});
listeners.get('install')({waitUntil:p=>pending=p}); await pending;
for (const image of images) {
  const url=new URL(image,'https://test/welding-guide-411/').href;
  assert.ok(cacheStore.has(url), `首次安装应缓存原图: ${image}`);
  let response;
  listeners.get('fetch')({request:{url,method:'GET',mode:'cors',destination:'image'},respondWith:p=>response=p});
  assert.ok((await response).ok, `离线原图: ${image}`);
}
console.log("welding-guide-411 validation: PASS");
