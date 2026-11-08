import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/BOXSTER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(import.meta.dirname,'..');
const target=process.argv[2];
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{try{let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));assert.ok(file.startsWith(root+path.sep)||file===root);if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(await fs.readFile(file));}catch{res.writeHead(404);res.end();}});
if(!target)await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url=target||`http://127.0.0.1:${server.address().port}/`;
let browser;
try {
  browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage(), errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(url+'#section=faults');
  await page.waitForFunction(()=>document.querySelectorAll('#fault-list details').length===8);
  await page.screenshot({path:path.join(root,'review/source-import/mobile-list.png'),fullPage:true});
  const entries=page.locator('#fault-list details');
  for(let i=0;i<8;i++) {
    const entry=entries.nth(i);
    await entry.locator('summary').click();
    for(const img of await entry.locator('img').all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(img=>img.decode());
      assert.ok(await img.evaluate(img=>img.naturalWidth>=250));
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    if(i===0)await page.screenshot({path:path.join(root,'review/source-import/mobile-cleaning.png'),fullPage:true});
    const img=entry.locator('img').last();
    await img.scrollIntoViewIfNeeded();
    const before=await page.evaluate(()=>scrollY);
    await img.click();
    assert.equal(await page.locator('#image-modal').evaluate(n=>n.hidden),false);
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>document.querySelector('#image-modal').hidden);
    assert.ok(Math.abs(await page.evaluate(()=>scrollY)-before)<3);
    await entry.locator('summary').click();
  }
  await page.locator('#search-input').fill('板宽确认');
  await page.locator('#search-input').press('Enter');
  assert.equal(await entries.count(),1);
  assert.match(await entries.first().innerText(),/测宽装置/);
  await page.locator('#search-input').fill('');
  await page.locator('#search-input').press('Enter');
  await page.waitForFunction(()=>document.querySelectorAll('#fault-list details').length===8);
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await page.waitForFunction(async()=>{const keys=await caches.keys();return keys.includes('welding-guide-411-v27');});
  const cached=await page.evaluate(async()=>{const c=await caches.open('welding-guide-411-v27');return (await c.keys()).filter(r=>r.url.includes('/procedures/')).length;});
  assert.equal(cached,69);
  await context.setOffline(true);
  await page.reload();
  await page.waitForFunction(()=>document.querySelectorAll('#fault-list details').length===8);
  await entries.last().locator('summary').click();
  await entries.last().locator('img').last().evaluate(img=>img.decode());
  await page.locator('nav button[data-section="inspection"]:visible').first().click();
  assert.equal(await page.locator('#inspection-list details').count(), 4);
  assert.equal(await page.locator('.home-return').getAttribute('href'), '../welding-guide-home/');
  assert.deepEqual(errors,[]);
  console.log(`PASS ${url}: 8 entries, 47 images, mobile layout, search, image viewer/position, offline reload`);
} finally {if(browser)await browser.close();if(!target)await new Promise(resolve=>server.close(resolve));}
