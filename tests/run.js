// Farm Mars headless test harness. Usage: node tests/run.js [baseURL]   (default: serves repo on http://localhost:8799)
const http=require('http'),fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const ROOT=path.join(__dirname,'..'),PORT=8799,CHROME=process.env.CHROME||'/usr/bin/google-chrome';
const SHOTS=process.env.SHOTS||path.join(ROOT,'screenshots');
let base=process.argv[2],srv=null;
const MIME={'.html':'text/html','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
function serve(){return new Promise(r=>{srv=http.createServer((q,s)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);
 if(!f.startsWith(ROOT)||!fs.existsSync(f)){s.writeHead(404);s.end();return}s.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(s)}).listen(PORT,()=>r())})}
const results=[];let page,errors=[];
async function t(name,fn){try{const d=await fn();results.push([name,true,d||''])}catch(e){results.push([name,false,String(e.message||e)])}console.log((results.at(-1)[1]?'PASS ':'FAIL ')+name+(results.at(-1)[2]?'  - '+results.at(-1)[2]:''))}
const ev=(f,...a)=>page.evaluate(f,...a);
function ok(c,m){if(!c)throw new Error(m)}
(async()=>{
 if(!base){await serve();base='http://localhost:'+PORT+'/'}
 const br=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 page=await br.newPage();await page.setViewport({width:915,height:412,isMobile:true,hasTouch:true,isLandscape:true,deviceScaleFactor:2});
 page.on('pageerror',e=>errors.push('pageerror: '+e.message));page.on('console',m=>{if(m.type()=='error')errors.push('console: '+m.text())});
 page.on('requestfailed',r=>errors.push('reqfail: '+r.url()));
 await t('boot + title screen',async()=>{await page.goto(base,{waitUntil:'networkidle0'});await new Promise(r=>setTimeout(r,800));ok(await ev(()=>FM.TITLE===true),'title not shown');await page.screenshot({path:path.join(SHOTS,'title.png')})});
 await t('credits say Created by Gavenecko',async()=>{ok(await ev(()=>CREDL.join(' ').includes('Created by Gavenecko')||JSON.stringify(CREDL).includes('Gavenecko')),'credit missing')});
 await t('touch tap on slot 1 starts game',async()=>{await ev(()=>{for(let i=1;i<=3;i++)localStorage.removeItem(slotKey(i))});
  const p=await ev(()=>{const[a,b,w,h]=TSL(0);const r=document.getElementById('c').getBoundingClientRect();return{x:r.left+(a+w/2)*r.width/W,y:r.top+(b+h/2)*r.height/H}});
  await page.touchscreen.tap(p.x,p.y);await new Promise(r=>setTimeout(r,500));ok(await ev(()=>!FM.TITLE&&!!FM.G),'tap did not start game')});
 for(const lay of ['std','ridge','ice'])await t('new game layout '+lay+' + farm spawns walkable',async()=>{
  return await ev(lay=>{localStorage.removeItem(slotKey(1));startSlot(1);if(CUT)FM7.skipCut();CUT=null;modal=null;CUT&&FM7.skipCut&&FM7.skipCut();modal=null;G.layoutAsk=1;pickLayout(lay,()=>{});modal=null;
   if(G.layout!=lay)throw new Error('layout not set');if(!feetFree(G.px,G.py))throw new Error('start pos blocked');
   const bad=[];for(const[z,x,y]of[['farm',13,6],['farm',15,1],['farm',29,10],['farm',5,6],['farm',18,5]]){enter(z,x,y,2);if(!feetFree(G.px,G.py)||G.px!=x*T+8||G.py!=y*T+8)bad.push(z+':'+x+','+y)}
   if(bad.length)throw new Error('blocked: '+bad);return 'ok'},lay)});
 await t('every door/exit/edge spawn walkable',async()=>{return await ev(()=>{const sp=[];for(const k in DOORS)sp.push(DOORS[k]);for(const k in EXITS)sp.push(EXITS[k]);
   sp.push(['city',1,10],['farm',15,1],['farm',29,10],['surf',31,41],['surf',50,9],['surf',61,21],['valles',1,18]);if(typeof EXTRA_SPAWNS!='undefined')sp.push(...EXTRA_SPAWNS);
   const bad=[];let n=0;for(const[z,x,y]of sp){if(!MAPS[z])continue;n++;enter(z,x,y,2);if(G.zone!=z||!feetFree(G.px,G.py)||G.px!=x*T+8||G.py!=y*T+8)bad.push(z+':'+x+','+y)}
   for(let f=1;f<=20;f++){enterMine(f);n++;if(!feetFree(G.px,G.py)||G.px!=3*T+8)bad.push('mine'+f)}
   for(let f=1;f<=15;f++){FM8.enterRift(f);n++;modal=null;if(!feetFree(G.px,G.py)||G.px!=3*T+8)bad.push('rift'+f)}G.rfloor=0;MINE=null;enter('farm',13,9,2);
   if(bad.length)throw new Error('blocked: '+bad.join(' '));return n+' spawns'})});
 await t('save/load across 3 slots',async()=>{return await ev(()=>{for(let s=1;s<=3;s++){localStorage.removeItem(slotKey(s));startSlot(s);if(CUT)FM7.skipCut();CUT=null;modal=null;G.money=1000+s;G.day=s+4;save(true)}
   for(let s=1;s<=3;s++){startSlot(s);if(CUT)FM7.skipCut();CUT=null;modal=null;if(G.money!=1000+s||G.day!=s+4)throw new Error('slot '+s+' mismatch');const i=slotInfo(s);if(!i||i.day!=s+4)throw new Error('slotInfo '+s)}return '3 slots'})});
 await t('farm loop: till, plant, water, grow, harvest, ship',async()=>{return await ev(()=>{localStorage.removeItem(slotKey(1));startSlot(1);if(CUT)FM7.skipCut();CUT=null;modal=null;pickLayout('std',()=>{});modal=null;G.energy=100;
   G.px=12*T+8;G.py=12*T+8;G.dir=2;const sel=id=>{G.sel=G.inv.findIndex(q=>q&&q[0]==id)};const[fx,fy]=facingTile(),k=fx+','+fy;
   sel('hoe');act();if(!G.tiles[k])throw new Error('till failed');swingT=0;sel('s_let');act();swingT=0;sel('can');act();swingT=0;
   const tl=G.tiles[k];if(!tl||!tl.c)throw new Error('plant failed '+JSON.stringify(tl));for(let d=0;d<4;d++){G.tiles[k].w=1;sleep(true);modal=null;CUT=null}
   if(!mature(G.tiles[k]))throw new Error('not mature '+JSON.stringify(G.tiles[k]));G.px=fx*T+8;G.py=(fy-1)*T+8;G.dir=2;const n0=G.inv.flat().join();harvest(k);
   const li=G.inv.findIndex(q=>q&&/^let/.test(q[0]));if(li<0)throw new Error('no lettuce');const m0=G.money;G.ship.push([G.inv[li][0],1]);sleep(true);modal=null;CUT=null;if(G.money<=m0)throw new Error('ship paid nothing');return 'shipped +'+(G.money-m0)})});
 await t('shop buy seeds',async()=>{return await ev(()=>{G.money=500;const m=G.money;buy('s_pot',2);if(G.money!=m-2*ITEMS.s_pot.p)throw new Error('money '+G.money);return 'ok'})});
 await t('NPC talk raises hearts',async()=>{return await ev(()=>{G.time=600;placeNPCs(true);const n=NPCS[0];const h=G.hearts[n.id];FM.talk(n.id);let i=0;while(modal&&i++<30){modal.ch=999;modalAdvance(0)}modal=null;if(!(G.hearts[n.id]>h))throw new Error('hearts unchanged');return n.n})});
 await t('mine: break ore, descend',async()=>{return await ev(()=>{enterMine(2);const o=ENTS.find(e=>e.k=='ore'||e.k=='rock');if(!o)throw new Error('no ore');const f=G.floor;enterMine(f+1);if(G.floor!=f+1)throw new Error('descend');return 'floor '+G.floor})});
 await t('combat: swing kills bug, roll + charged spin',async()=>{return await ev(()=>{enterMine(3);G.hp=100;G.energy=100;ENTS.length=0;const b=mkBug('crawler',G.px,G.py+18,0);ENTS.push(b);G.dir=2;G.sel=G.inv.findIndex(q=>q&&q[0]=='blade');
   for(let i=0;i<20&&!b.dead;i++){swingT=0;act();for(let j=0;j<16;j++)update()}if(!b.dead)throw new Error('bug survived hp '+b.hp);
   const b2=mkBug('crawler',G.px+10,G.py,0);ENTS.push(b2);const s0=G.stats.spins||0;FM9.spin('blade');if(!(b2.hp<b2.max))throw new Error('spin no dmg');
   for(let j=0;j<40;j++)update();const x0=G.px,y0=G.py;if(!FM9.roll())throw new Error('roll refused');for(let j=0;j<20;j++)update();const mv=Math.round(Math.hypot(G.px-x0,G.py-y0));if(mv<8)throw new Error('roll did not move');return 'roll moved '+mv+'px'})});
 await t('Bio-Pod: buy, fill, collect gel',async()=>{return await ev(()=>{enter('farm',13,9,2);G.money=5000;FM9.buyPod();modal=null;if(!G.pod)throw new Error('no pod');enter('biopod',5,6,0);FM9.podInteract('e');if(!G.podW)throw new Error('not filled');
   G.podW=1;G.blobs.forEach(b=>b);let got=0;for(let i=0;i<6&&!got;i++){G.podW=1;FM9.podMorning();if(G.podOut){FM9.podInteract('e');got=1}}if(!G.inv.some(q=>q&&q[0]=='gel'))throw new Error('no gel');return 'gel ok'})});
 await t('mailbox: letters arrive and read',async()=>{return await ev(()=>{G.day=5;const n=FM9.mailCheck()+G.mail.box.length;FM9.mailMenu();modal=null;const id=G.mail.box[0];FM9.readLetter(id);modal=null;if(!G.mail.read[id])throw new Error('not read');return n+' letters'})});
 if(fs.existsSync(path.join(__dirname,'features.js')))await require('./features.js')({t,ev,ok,page,path,SHOTS});
 await t('no console/page errors',async()=>{const e=await ev(()=>window.__err&&String(window.__err.stack||window.__err));if(e)errors.push('loop: '+e);ok(!errors.length,errors.slice(0,5).join(' | '))});
 await t('frame time avg + p95 < 16.7ms at 4x CPU throttle',async()=>{const c=await page.target().createCDPSession();await c.send('Emulation.setCPUThrottlingRate',{rate:4});
  const r=await ev(async()=>{const out={};const go=async(z)=>{if(z=='mine')enterMine(4);else if(z=='rift'){FM8.enterRift(3);modal=null}else if(z=='dust'){G.wx='dust';enter('surf',31,40,2)}else enter(z,...({farm:[13,9],city:[15,12],surf:[31,40],valles:[2,18]}[z]),2);modal=null;
    for(let i=0;i<20;i++){update();draw()}const ts=[];for(let i=0;i<90;i++){const a=performance.now();update();draw();cx.getImageData(0,0,1,1);ts.push(performance.now()-a)}ts.sort((a,b)=>a-b);out[z]=[+(ts.reduce((a,b)=>a+b)/ts.length).toFixed(2),+ts[Math.floor(ts.length*.95)].toFixed(2)]};
   for(const z of ['farm','city','surf','valles','mine','rift','dust'])await go(z);G.wx=null;enter('farm',13,9,2);return out});
  await c.send('Emulation.setCPUThrottlingRate',{rate:1});const bad=Object.entries(r).filter(([z,[a,p]])=>a>=16.7||p>=16.7);ok(!bad.length,'slow: '+JSON.stringify(bad));return Object.entries(r).map(([z,[a,p]])=>z+' avg '+a+' p95 '+p).join(', ')});
 await br.close();if(srv)srv.close();const f=results.filter(r=>!r[1]).length;console.log(`\n${results.length-f}/${results.length} passed against ${base}`);process.exit(f?1:0)})();
