// Farm Mars v22 - Old Colony Restoration (bundles, sections, unlocks, rail, forecast) + Visible Terraforming
(()=>{
// ================= OLD COLONY =================
// interior map 30x14: 3 rooms top, 3 rooms bottom, central hall; exit door on the west wall
const OCW=30,OCH=14;
{const rows=[];for(let y=0;y<OCH;y++){let r='';for(let x=0;x<OCW;x++){let t='o';
 if(x==0||x==OCW-1||y==0||y==OCH-1)t='w';
 if((y==5||y==8)&&!((x>=4&&x<=5)||(x>=13&&x<=14)||(x>=23&&x<=24)))t='w';
 if((x==9||x==18)&&(y<5||y>8))t='w';
 if(x==0&&y==7)t='D';r+=t}rows.push(r)}
 MAPS.oldcol=fromStr(rows)}
const ROOMS=[
 {id:'hydro',n:'Hydroponics Wing',r:[1,1,8,4],p:[4,2],c:'#3a8a4a',u:'Greenhouse Wing: your farm greenhouse grows larger (or a free greenhouse if you had none).'},
 {id:'shop',n:'Machine Shop',r:[10,1,17,4],p:[13,2],c:'#c8802a',u:'Scrap Line: the old fabricators deliver ore to you every morning.'},
 {id:'med',n:'Med Bay',r:[19,1,28,4],p:[23,2],c:'#e8f0f4',u:'Med Bay: +25 max energy and a stock of medkits.'},
 {id:'radio',n:'Radio Tower',r:[1,9,8,12],p:[4,10],c:'#3ad0ff',u:'Weather Radio: tomorrow\'s forecast every night, and on the Radio Tower console.'},
 {id:'rail',n:'Rail Depot',r:[10,9,17,12],p:[13,10],c:'#b0b8c8',u:'Colony Rail: minecart fast travel between Farm, City, Airlock, Mine and Old Colony.'},
 {id:'vault',n:'Founders\' Vault',r:[19,9,28,12],p:[23,10],c:'#ffd23a',u:'The Old Colony lives again: 5000cr, a Founders\' Statue and the colony\'s thanks.'}];
for(const R0 of ROOMS)MAPS.oldcol[R0.p[1]][R0.p[0]]='Y';
SOLID.add('Y');DZ.oldcol=['#4a4248','#3e383e','#ffb050','#2a2428'];
const OCB=[
 {id:'h1',room:'hydro',n:'Dust & Bloom Crops',in:{pot:5,dbn:3,glo:2},rw:['money',500]},
 {id:'h2',room:'hydro',n:'Frost & Storm Crops',in:{frb:3,icl:2,dst:2,vol:1},rw:['spr',3]},
 {id:'h3',room:'hydro',n:'Quality Harvest',in:{wht_s:3,tom_s:2},rw:['qspr',2]},
 {id:'s1',room:'shop',n:'Ore Delivery',in:{iron:20,cob:5},rw:['money',800]},
 {id:'s2',room:'shop',n:'Gem Crate',in:{crys:5,jasp:3,opal:1},rw:['hgem',1]},
 {id:'s3',room:'shop',n:'Artisan Goods',in:{tom_t:1,mel_d:2,cheese:1},rw:['money',1200]},
 {id:'m1',room:'med',n:'Field Medicine',in:{lily:5,glowcap:5,vmoss:2},rw:['medkit',3]},
 {id:'m2',room:'med',n:'Kitchen Rations',in:{stew:1,salad:1,omelet:1},rw:['money',900]},
 {id:'r1',room:'radio',n:'Signal Parts',in:{sglass:3,chit:10,venom:3},rw:['money',700]},
 {id:'r2',room:'radio',n:'Night Sky',in:{meteorite:1,startonic:1,mrock:2},rw:['opal',2]},
 {id:'l1',room:'rail',n:'Dome Fish',in:{carp:2,eel:2,koi:1},rw:['money',600]},
 {id:'l2',room:'rail',n:'Wild Waters',in:{dgud:1,bfin:1,brine:1,sglf:1},rw:['money',1500]},
 {id:'v1',room:'vault',n:'Relics of Mars',in:{rel1:1,rel2:1,rel3:1},rw:['money',1000]},
 {id:'v2',room:'vault',n:'Treasures of the Deep',in:{hgem:1,core:1,gel:2},rw:['money',2000]},
 {id:'v3',room:'vault',n:'Founders\' Fund',in:{$:10000},rw:['money',0]}];
const oc=()=>{G.oc=G.oc||{b:{},done:{},unl:{},pin:null};G.oc.b=G.oc.b||{};G.oc.done=G.oc.done||{};G.oc.unl=G.oc.unl||{};return G.oc};
const iname=k=>k=='$'?'Credits':ITEMS[k]?ITEMS[k].n:k;
function have(b,k){return(oc().b[b.id]||{})[k]||0}
function bDone(b){return!!oc().done[b.id]}
function bProg(b){let h=0,t=0;for(const k in b.in){t+=b.in[k];h+=Math.min(have(b,k),b.in[k])}return[h,t]}
function roomBundles(id){return OCB.filter(b=>b.room==id)}
function roomDone(id){return roomBundles(id).every(bDone)}
function roomFrac(id){const bs=roomBundles(id);return bs.filter(bDone).length/bs.length}
function ocAllDone(){return ROOMS.every(r=>roomDone(r.id))}
function donate(b){const o=oc(),d=o.b[b.id]=o.b[b.id]||{};let n=0;
 for(const k in b.in){const need=b.in[k]-(d[k]||0);if(need<=0)continue;
  if(k=='$'){const g=Math.min(need,G.money);if(g>0){G.money-=g;d[k]=(d[k]||0)+g;n+=g}continue}
  const g=Math.min(need,cnt(k));if(g>0){rem(k,g);d[k]=(d[k]||0)+g;n+=g}}
 if(n)sfx('coin');else{sfx('bad');toast('Nothing you carry fits this bundle yet')}
 if(!bDone(b)&&Object.keys(b.in).every(k=>(d[k]||0)>=b.in[k]))completeBundle(b);return n}
function completeBundle(b,quiet){const o=oc();o.done[b.id]=G.day;if(o.pin==b.id)o.pin=null;const[k,q]=b.rw;let msg='';
 if(k=='money'){if(q){G.money+=q;msg=q+'cr'}}else{add(k,q);msg=q+' '+iname(k)}
 G.stats.ocB=(G.stats.ocB||0)+1;if(!quiet){sfx('wed');parts(G.px,G.py-12,'#ffd27a',18,1.6);toast('Bundle complete: '+b.n+(msg?' (+'+msg+')':''))}
 const R0=ROOMS.find(r=>r.id==b.room);if(roomDone(R0.id)&&!o.unl[R0.id])unlock(R0.id,quiet);checkAch()}
function unlock(id,quiet){const o=oc();o.unl[id]=G.day;const R0=ROOMS.find(r=>r.id==id);
 if(id=='hydro')applyGH();if(id=='med'){G.maxEn+=25;add('medkit',3)}
 if(id=='vault'){G.money+=5000;G.decor=G.decor||{};G.decor.fstatue=1}
 if(!quiet){const pg=['The '+R0.n+' hums back to life! '+R0.u];if(ocAllDone())pg.push('Every light in the Old Colony is on.');say(R0.n+' restored',pg);
  if(ocAllDone()&&!o.fin){o.fin=G.day;const nx=modal;modal=null;finale()}}
 else if(ocAllDone())o.fin=o.fin||G.day}
function finale(){for(const n of NPCS)addHearts(n,.5);sfx('wed');
 const pg=['Word spreads fast. By dusk, half of New Cydonia has walked out to the Old Colony with lanterns.','MAYOR VEGA: "Forty years ago, this dome was everything we had. Tonight it\'s a home again. Because of you."','OLD MO: "...I helped weld that tower. Never thought I\'d see it blink again."','The radio tower blinks. The minecarts rattle. The vault door stands open, and inside: the founders\' names, and room for one more.'];
 if(window.FM16)FM16.showCG('oldcol','Old Colony Restored',pg,null);else say('Old Colony Restored',pg)}
// greenhouse wing
function applyGH(){if(typeof GHR=='undefined')return;if(!G.gh){G.gh=1}if(oc().unl.hydro){GHR[0]=18;GHR[3]=12}}
function resetGH(){if(typeof GHR!='undefined'){GHR[0]=22;GHR[3]=10}}
{const _ss=startSlot;startSlot=function(s){resetGH();const r=_ss.apply(this,arguments);if(G&&G.oc&&G.oc.unl&&G.oc.unl.hydro)applyGH();return r}}
// ---------- bundle UI ----------
function roomMenu(id){const R0=ROOMS.find(r=>r.id==id),bs=roomBundles(id);
 const o=bs.map(b=>{const[h,t]=bProg(b);return{t:(bDone(b)?'✓ ':oc().pin==b.id?'★ ':'□ ')+b.n+'  '+(bDone(b)?'done':h+'/'+t),f:()=>bundleView(b)}});
 if(id=='radio'&&oc().unl.radio)o.unshift({t:'📻 Tomorrow\'s forecast',f:()=>say('Radio Tower',[forecastText()],[{t:'Back',f:()=>roomMenu(id)}])});
 if(id=='rail'&&oc().unl.rail)o.unshift({t:'🚃 Ride the Colony Rail',f:railMenu});
 o.push({t:'All sections',f:ocMenu},{t:'Close'});
 say(R0.n,[roomDone(id)?'Restored! '+R0.u:'Bundles needed to restore the '+R0.n+'. Reward when complete: '+R0.u],o);modal.ch=999}
function bundleView(b){const d=oc().b[b.id]||{};const lines=Object.keys(b.in).map(k=>{const h=Math.min(d[k]||0,b.in[k]),own=k=='$'?G.money:cnt(k);return(h>=b.in[k]?'✓ ':'· ')+iname(k)+' '+h+'/'+b.in[k]+(h<b.in[k]?' (bag '+own+')':'')});
 const rw=b.rw[0]=='money'?(b.rw[1]?b.rw[1]+'cr':'Vault key'):b.rw[1]+' '+iname(b.rw[0]);
 const o=[];if(!bDone(b)){o.push({t:'Donate what I have',f:()=>{donate(b);if(!modal||modal.name==b.n||!bDone(b))bundleView(b)}});o.push({t:oc().pin==b.id?'Unpin from tracker':'Pin to tracker',f:()=>{oc().pin=oc().pin==b.id?null:b.id;bundleView(b)}})}
 o.push({t:'Back',f:()=>roomMenu(b.room)});say(b.n,[lines.join('\n')+'\nReward: '+rw],o);modal.ch=999}
function ocMenu(){say('Old Colony',['Restoration: '+OCB.filter(bDone).length+'/'+OCB.length+' bundles'],ROOMS.map(r=>({t:(roomDone(r.id)?'✓ ':'')+r.n+'  '+roomBundles(r.id).filter(bDone).length+'/'+roomBundles(r.id).length,f:()=>roomMenu(r.id)})).concat([{t:'Close'}]));modal.ch=999}
// ---------- tracker (below the side-quest tracker) ----------
const trRect=()=>[W-176,64,170,22];
{const _d=draw;draw=function(){_d.apply(this,arguments);if(!G||TITLE||CRED||modal||menu||CUT||!G.oc||!G.oc.pin)return;const b=OCB.find(q=>q.id==G.oc.pin);if(!b)return;
 const[x,y,w,h]=trRect(),[hv,t]=bProg(b);const ready=Object.keys(b.in).every(k=>have(b,k)+(k=='$'?G.money:cnt(k))>=b.in[k]);
 R(x,y,w,h,'#0a0614c0');R(x,y,2,h,ready?'#7f7':'#9ad0ff');txt('⌂ '+b.n,x+6,y+8,'#9ad0ff',7);
 const miss=Object.keys(b.in).filter(k=>have(b,k)<b.in[k]).map(k=>iname(k)+' '+Math.min(b.in[k],have(b,k)+(k=='$'?G.money:cnt(k)))+'/'+b.in[k]);txt((ready?'Ready! ':'')+miss.slice(0,2).join(', '),x+6,y+18,ready?'#9f9':'#cfd6e8',6)}}
{const _t=onTap;onTap=function(x,y){if(G&&!TITLE&&!CRED&&!modal&&!menu&&!CUT&&G.oc&&G.oc.pin){const[a,b,w,h]=trRect();if(x>=a&&x<=a+w&&y>=b&&y<=b+h){const q=OCB.find(z=>z.id==G.oc.pin);if(q){bundleView(q);sfx('menu');return true}}}return _t.apply(this,arguments)}}
// ---------- entrance on the surface ----------
const OCD=[12,35];
{const m=MAPS.surf;for(let y=32;y<=38;y++)for(let x=8;x<=20;x++)m[y][x]='r';for(let x=10;x<=14;x++)m[34][x]='R';for(const x of[10,11,13,14])m[35][x]='R';m[OCD[1]][OCD[0]]='D';
 DOORS['surf:'+OCD[0]+','+OCD[1]]=['oldcol',1,7];EXITS.oldcol=['surf',OCD[0],OCD[1]+1]}
{const _gs=genSurface;genSurface=function(){return _gs().filter(e=>{const x=Math.floor(e.x/T),y=Math.floor(e.y/T);return!(x>=8&&x<=20&&y>=32&&y<=38)})}}
{const _dt=drawTile;drawTile=function(g,z,t,v){if(z=='surf'&&t=='D'){_dt(g,z,'r',v);return}return _dt(g,z,t,v)}}
if(window.HOMEN)HOMEN.oldcol='Old Colony';
// ---------- rail ----------
const RAIL={farm:['Farm',28,13],city:['New Cydonia',27,13],surf:['Airlock',35,41],mine:['Mine Entrance',47,10],oldcol:['Old Colony',13,7]};
const railZ=k=>k=='mine'?'surf':k;
function railMenu(){if(!oc().unl.rail){say('Colony Rail','The rails are rusted through. Restore the Old Colony Rail Depot to run the minecarts again.');return}
 const here=G.zone;say('Colony Rail','Where to? (free, 10 minutes)',Object.entries(RAIL).filter(([k])=>!(railZ(k)==here&&Math.hypot(G.px-RAIL[k][1]*T,G.py-RAIL[k][2]*T)<60)).map(([k,[n,x,y]])=>({t:'🚃 '+n,f:()=>{modal=null;G.time=Math.min(G.time+10,1550);G.stats.rail=(G.stats.rail||0)+1;enter(railZ(k),x,y+1,2);sfx('door');toast('The minecart rattles to '+n)}})).concat([{t:'Stay'}]));modal.ch=999}
const nearRail=()=>{for(const k in RAIL){if(k=='oldcol')continue;const[n,x,y]=RAIL[k];if(railZ(k)==G.zone&&Math.hypot(G.px-(x*T+8),G.py-(y*T+8))<20)return k}return null};
// ---------- interactions ----------
{const _in=interact;interact=function(){if(G.zone=='oldcol'){const[fx,fy]=facingTile();if(tileAt(fx,fy)=='Y'){const R0=ROOMS.find(r=>r.p[0]==fx&&r.p[1]==fy);if(R0){roomMenu(R0.id);return}}}
 if(!nearNPC()&&nearRail()){railMenu();return}
 if(G.zone=='surf'&&!nearNPC()){const[fx,fy]=facingTile();if(OPL.some(([x,y])=>x==fx&&y==fy)&&plotAct(fx,fy))return}
 return _in()}}
{const _a=act;act=function(){if(G.zone=='oldcol'){const[fx,fy]=facingTile();if(tileAt(fx,fy)=='Y'){interact();return}}
 if(G.zone=='surf'&&!nearNPC()){const[fx,fy]=facingTile();if(OPL.some(([x,y])=>x==fx&&y==fy)&&plotAct(fx,fy))return}
 if(!nearNPC()&&nearRail()&&!cur()){railMenu();return}return _a()}}
// ---------- daily effects (scrap line, forecast) ----------
function seeded(day){let s=(day*2654435761+12345)>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
{const _rw=rollWeather;rollWeather=function(){const mr=Math.random;Math.random=seeded(G.day);try{return _rw()}finally{Math.random=mr}}}
const WXN={null:'Clear skies',meteor:'Meteor shower overnight',flare:'Solar flare warning',dust:'DUST STORM',rain:'Rain'};
function forecastFor(day){const d0=G.day,wx=G.wx,mc=G.metc,dd=typeof DUSTD!='undefined'?DUSTD:null;let w;G.day=day;try{rollWeather();w=G.wx}finally{G.day=d0;G.wx=wx;G.metc=mc;if(dd!==null)DUSTD=dd}return w}
function forecastText(){const w=forecastFor(G.day+1);return'RADIO CYDONIA: Tomorrow - '+(WXN[w]||w||'Clear skies')+'.'+(w=='dust'?' Stay near the dome!':w=='meteor'?' Watch your fields for falling rocks.':'')}
{const _sl=sleep;sleep=function(p){const fc=G.oc&&G.oc.unl&&G.oc.unl.radio?forecastText():null;_sl.apply(this,arguments);
 if(G.oc&&G.oc.unl){const ex=[];if(G.oc.unl.shop){const n=3+(Math.random()<.4?1:0);add('iron',n);if(Math.random()<.35)add('cob',1);ex.push('SCRAP LINE: '+n+' ferrite delivered from the Old Colony fabricators.')}
  if(G.oc.unl.radio){G.fcast=forecastText();ex.push(G.fcast)}
  if(ex.length){if(modal&&modal.pages)modal.pages.push(...ex);else toast(ex[0])}}}}
// ---------- intro letter ----------
if(typeof LETTERS!='undefined')LETTERS.push(['oldcol','Mayor Vega','The First Dome','Before New Cydonia there was the First Dome, south-west of the surface airlock. A storm cracked it and we moved out. The bones are still good. Bring the old sections what they need (look for the consoles inside) and we can wake it up again.',g=>g.day>=3]);
// ================= VISIBLE TERRAFORMING =================
const OPL=[];for(let y=37;y<=38;y++)for(let x=16;x<=19;x++)OPL.push([x,y]);
Object.assign(ITEMS,{
 mclover:{n:'Mars Clover',v:45,c:'#7ad06a',food:15,d:'Hardy clover from the lichen fields. Terraforming stage 1+.'},
 cbloom:{n:'Crater Bloom',v:90,c:'#ff8ac8',d:'A pink flower that only grows outside under a thicker sky.'},
 reed:{n:'Lake Reed',v:140,c:'#9ac85a',d:'Grows at the edge of the new crater lakes.'},
 mbar:{n:'Martian Barley',v:150,c:'#e8c86a',food:30,d:'The first grain grown under open Martian sky.'},
 skyb:{n:'Skyberry',v:280,c:'#5a8aff',food:45,d:'Sweet berries that ripen only in the blue-sky era.'},
 s_mbar:{n:'Barley Seeds',p:80,c:'#e8c86a',d:'Outdoor-only. Plant in the Open-Sky Field (needs terraform stage 2).'},
 s_skyb:{n:'Skyberry Seeds',p:160,c:'#5a8aff',d:'Outdoor-only. Plant in the Open-Sky Field (needs terraform stage 3).'}});
const OCROP={s_mbar:{out:'mbar',days:4,st:2},s_skyb:{out:'skyb',days:6,st:3}};
function plotAct(x,y){const k=x+','+y,P=G.oplot=G.oplot||{},p=P[k],s=cur();
 if(p&&p.g>=OCROP[p.s].days){delete P[k];add(OCROP[p.s].out,1+(Math.random()<.25?1:0));addXP('farm',10);sfx('harvest');floatTxt(x*T+8,y*T,'+'+ITEMS[OCROP[p.s].out].n,'#ffd27a');G.stats.oharv=(G.stats.oharv||0)+1;checkAch();return true}
 if(p){toast(ITEMS[OCROP[p.s].out].n+': '+p.g+'/'+OCROP[p.s].days+' days');return true}
 if(s&&OCROP[s[0]]){const c=OCROP[s[0]];if(G.terra<c.st){toast('The open air is still too thin (needs terraform stage '+c.st+')');sfx('bad');return true}P[k]={s:s[0],g:0};take(G.sel);sfx('plant');return true}
 if(G.terra<2){toast('Open-Sky Field: nothing grows out here until terraform stage 2');return true}
 toast('Open-Sky Field: plant Barley or Skyberry seeds here');return true}
{const _sl=sleep;sleep=function(p){_sl.apply(this,arguments);if(G.oplot)for(const k in G.oplot)G.oplot[k].g++}}
{const _sm=shopMenu;shopMenu=function(){_sm.apply(this,arguments);if(modal&&modal.opts&&G.terra>=2){const add2=(id)=>modal.opts.splice(modal.opts.length-1,0,{t:ITEMS[id].n+' - '+ITEMS[id].p+'cr (outdoor)',f:()=>{buy(id);shopMenu()}});add2('s_mbar');if(G.terra>=3)add2('s_skyb')}}}
// new forageables by stage
{const _gs=genSurface;genSurface=function(){const E=_gs();if(!G||!G.terra)return E;const m=MAPS.surf;let n=0,g=0;const want=[0,6,10,14][Math.min(3,G.terra)];
 while(n<want&&g++<600){const x=2+Math.floor(Math.random()*60),y=2+Math.floor(Math.random()*40);if(m[y][x]!='r'||(x>=8&&x<=20&&y>=32&&y<=38))continue;
  const nearLake=typeof isPool=='function'&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>isPool(x+a,y+b));
  const t=G.terra>=3&&nearLake?'reed':G.terra>=2&&Math.random()<.45?'cbloom':G.terra>=3&&Math.random()<.3?'reed':'mclover';
  E.push({k:'plant',t,x:x*T+8,y:y*T+8});n++}return E}}
// paint terraform stages onto the cached surface/canyon background
{const _bg=bgCache;bgCache=function(z,m){let c=_bg(z,m);if(!c||(z!='surf'&&z!='valles'))return c;
 if(c._tf!==undefined&&c._tf!==G.terra){delete BGK[z+(z=='surf'?G.terra:'')];c=_bg(z,m)}
 if(c._tf===undefined){paintTerra(c.getContext('2d'),z,m);c._tf=G.terra}return c}}
function paintTerra(g,z,m){const st=G.terra||0;if(!st)return;const base=z=='surf'?'r':null;
 for(let y=0;y<m.length;y++)for(let x=0;x<m[0].length;x++){const t=m[y][x];if(z=='surf'?t!='r':('RWX'.includes(t)))continue;const h=hash(x*7+3,y*11+5)%100,X=x*T,Y=y*T;
  if(h<26){g.fillStyle=st>=2?'#5a9a3a':'#6a8a4a';g.fillRect(X+2+h%5,Y+4+h%5,8+h%5,5);g.fillRect(X+4+h%4,Y+2+h%5,4,9);g.fillStyle=st>=2?'#7ac04a':'#8aa86a';g.fillRect(X+3+h%5,Y+4+h%5,3,2)}
  if(st>=2&&h>=26&&h<56){g.fillStyle=h%2?'#8ad85a':'#5ab03a';for(let i=0;i<4;i++){const gx=X+1+((h*3+i*4)%12),gy=Y+5+((h+i*7)%8);g.fillRect(gx,gy,2,4);g.fillRect(gx+1,gy-2,1,3)}}
  if(st>=2&&h>=56&&h<61){g.fillStyle='#6aa8d8';g.fillRect(X+3,Y+8,9,3);g.fillStyle='#bfe8ff';g.fillRect(X+4,Y+8,3,1)}
  if(st>=3&&h>=61&&h<75){g.fillStyle='#5ab04a';g.fillRect(X,Y+10,T,6);g.fillStyle='#7ad06a';for(let i=0;i<4;i++)g.fillRect(X+i*4+1,Y+8+(i%2),1,4);if(h%4==0){g.fillStyle=['#ff8ac8','#ffd23a','#fff'][h%3];g.fillRect(X+6,Y+9,2,2)}}}}
// critters: insects (stage 2+), birds (stage 3)
function critters(ox,oy){const st=G.terra||0;if(st<2)return;const hr=G.time/60,day=hr>6&&hr<19;
 if(day)for(let i=0;i<(st>=3?8:5);i++){const t=tick/30+i*1.7,x=(hash(i,77)%W+Math.sin(t)*30+tick*.15*(i%2?1:-1)%W+W)%W,y=60+hash(77,i)%(H-90)+Math.sin(t*2.3)*8;R(x,y,1,1,i%3?'#ffe86a':'#cfffcf');if(tick%6<3)R(x-1,y-1,1,1,'#fff8')}
 if(st>=3&&day){for(let i=0;i<5;i++){const p=((tick*.5+i*130)%(W+80))-40,y=22+i*6+Math.sin((tick+i*40)/12)*3,w=Math.floor(tick/8+i)%2;R(p,y,2,1,'#2a2a3a');R(p-2,y-w,2,1,'#2a2a3a');R(p+2,y-w,2,1,'#2a2a3a')}}}
{const _d=draw;draw=function(){_d.apply(this,arguments);if(!G||TITLE||CRED||CUT)return;if((G.zone=='surf'||G.zone=='valles')&&!modal)critters()}}
// world overlays: old colony dome, rail stations, open-sky field, farm dome view
{const _de=drawExtra;drawExtra=function(D,ox,oy,z){_de(D,ox,oy,z);
 if(z=='surf'){const f=OCB.filter(bDone).length/OCB.length,X=10*T-ox,Y=31*T-oy;
  if(X>-120&&X<W+40&&Y>-60&&Y<H+40)D.push([35*T-oy,()=>{cx.fillStyle='#6a5a5a';cx.beginPath();cx.ellipse(X+40,Y+56,44,42,0,Math.PI,0);cx.fill();
   cx.fillStyle=f>=1?'#9ad0ffaa':'#5a6a7a88';cx.beginPath();cx.ellipse(X+40,Y+56,38,36,0,Math.PI,0);cx.fill();
   for(let i=0;i<6;i++){const a=Math.PI+i/5*Math.PI,lit=i/6<f;R(X+40+Math.cos(a)*30-2,Y+56+Math.sin(a)*28-2,4,4,lit?'#ffd890':'#2a2228');if(lit)light(X+40+Math.cos(a)*30,Y+56+Math.sin(a)*28,14,'#fd8')}
   if(f<1){cx.strokeStyle='#1a1214';cx.lineWidth=1;cx.beginPath();cx.moveTo(X+20,Y+30);cx.lineTo(X+30,Y+40);cx.lineTo(X+26,Y+50);cx.moveTo(X+58,Y+26);cx.lineTo(X+52,Y+38);cx.stroke()}
   R(X+34,Y+50,14,14,'#2a2228');R(X+36,Y+52,10,12,f>=1?'#ffd890':'#4a3a3a');txt('OLD COLONY',X+40,Y+12,'#ffd27a',6,'center');
   R(X+70,Y+6,2,40,'#8a8a9a');if(oc().unl.radio&&tick%60<30){R(X+69,Y+4,4,3,'#f33');light(X+71,Y+5,10,'#f33')}}]);
  // open sky field
  for(const[x,y]of OPL){const P=(G.oplot||{})[x+','+y],PX=x*T-ox,PY=y*T-oy;if(PX<-T||PX>W||PY<-T||PY>H)continue;D.push([-9000,()=>{R(PX+1,PY+1,T-2,T-2,G.terra>=2?'#5a3a2a':'#4a2a26');R(PX+1,PY+1,T-2,1,'#7a5a3a')}]);
   if(P){const c=OCROP[P.s],fr=Math.min(1,P.g/c.days),col=ITEMS[c.out].c;D.push([PY+T,()=>{R(PX+7,PY+12-fr*8,2,4+fr*8,'#4a8a3a');if(fr>=1){R(PX+4,PY+2,8,5,col);R(PX+5,PY+3,2,2,'#fff8')}else R(PX+5,PY+10-fr*6,6,2,'#6ab04a')}])}}
  {const X=16*T-ox,Y=36*T-oy;if(X>-80&&X<W)D.push([-8999,()=>txt('OPEN-SKY FIELD',X+32,Y+12,G.terra>=2?'#9f9':'#a88',5,'center')])}}
 for(const k in RAIL){if(k=='oldcol'||railZ(k)!=z)continue;const[n,x,y]=RAIL[k],X=x*T-ox,Y=y*T-oy;if(X<-30||X>W+30||Y<-30||Y>H+30)continue;const on=G.oc&&G.oc.unl&&G.oc.unl.rail;
  D.push([Y+T,()=>{R(X-6,Y+12,28,3,'#5a5a6a');R(X-6,Y+13,28,1,'#8a8a9a');R(X+1,Y+2,14,10,on?'#c8a050':'#6a5a4a');R(X+2,Y+3,12,4,on?'#e8c870':'#7a6a5a');R(X+2,Y+11,3,3,'#222');R(X+11,Y+11,3,3,'#222');R(X+7,Y-10,2,12,'#888');R(X+2,Y-12,12,5,on?'#2a6a4a':'#4a3a3a');txt(on?'RAIL':'RUST',X+8,Y-8,'#fff',4,'center',0)}])}
 if(z=='farm'){const st=G.terra||0,m=MAPS.farm,mw=m[0].length*T;D.push([-99999,()=>{const Y=-oy;const sky=st>=2?['#5a9ae0','#a8d0f0']:['#c8905a','#e8b07a'];
   for(let x=0;x<mw;x+=T){const X=x-ox;if(X<-T||X>W)continue;R(X,Y+2,T,10,sky[0]);R(X,Y+6,T,6,sky[1]);const hh=hash(x,9)%5;R(X,Y+9-hh,T,4+hh,st>=1?(st>=2?'#5a8a4a':'#7a6a4a'):'#a8502e');
    if(st>=3&&hash(x,3)%4==0)R(X+2,Y+11,12,2,'#4aa8e8');R(X,Y+12,T,2,'#9ad0ff55');R(X+7,Y+2,1,12,'#ccd8e888')}}])}
 if(z=='oldcol')ocRooms(D,ox,oy)}}
function ocRooms(D,ox,oy){for(const R0 of ROOMS){const[a,b,c,d]=R0.r,X=a*T-ox,Y=b*T-oy,w=(c-a+1)*T,h=(d-b+1)*T,f=roomFrac(R0.id),done=roomDone(R0.id),pX=R0.p[0]*T-ox,pY=R0.p[1]*T-oy;
 D.push([-9500,()=>{if(done){R(X,Y,w,h,R0.c+'22');for(let i=0;i<3;i++)light(X+w*(i+1)/4,Y+8,30,R0.c)}
  if(!done){for(let i=0;i<5;i++){const hx=hash(i,a*7+b),cxp=X+hx%(w-12),cyp=Y+(hash(b,i*3)%(h-12));if(i/5>=f){R(cxp,cyp,10,6,'#2a2228');R(cxp+2,cyp-2,6,3,'#3a3236')}}
   cx.strokeStyle='#1a1214';cx.beginPath();cx.moveTo(X+8,Y+2);cx.lineTo(X+14,Y+12);cx.lineTo(X+10,Y+22);cx.stroke()}
  if(done){if(R0.id=='hydro')for(let i=0;i<6;i++){R(X+8+i*18,Y+h-12,12,6,'#5a3a2a');R(X+10+i*18,Y+h-18,3,7,'#4aa84a');R(X+14+i*18,Y+h-20,3,9,'#6ac84a')}
   if(R0.id=='shop'){const a2=tick/20;R(X+8,Y+h-20,30,14,'#6a6a7a');R(X+12+Math.cos(a2)*4,Y+h-16,4,4,'#ffd27a')}
   if(R0.id=='med')for(let i=0;i<3;i++){R(X+10+i*36,Y+h-18,24,12,'#e8f0f4');R(X+10+i*36,Y+h-18,6,12,'#9ad0e8')}
   if(R0.id=='radio'){R(X+w-24,Y+6,4,h-14,'#8a8a9a');if(tick%40<20)R(X+w-26,Y+4,8,3,'#f44')}
   if(R0.id=='rail'){for(let i=0;i<w;i+=6)R(X+i,Y+h-10,3,6,'#5a4a3a');R(X,Y+h-9,w,1,'#aab');R(X,Y+h-5,w,1,'#aab');const cxp=X+((tick*.4)%(w-20));R(cxp,Y+h-18,18,9,'#c8a050')}
   if(R0.id=='vault'){R(X+w-34,Y+6,26,h-14,'#c8a030');cx.strokeStyle='#ffe890';cx.beginPath();cx.arc(X+w-21,Y+6+(h-14)/2,8,0,6.3);cx.stroke()}}
  const bn=roomBundles(R0.id);for(let i=0;i<bn.length;i++)R(X+4+i*7,Y+3,5,3,bDone(bn[i])?'#7f7':'#533');txt(R0.n,X+w/2,Y+h-2,done?'#ffd27a':'#a99',5,'center',0)}]);
 D.push([pY+T,()=>{R(pX+2,pY,12,14,'#3a3236');R(pX+3,pY+1,10,7,done?'#7affc8':(tick%50<25?'#ffb050':'#5a3a2a'));R(pX+6,pY+9,4,4,'#2a2228')}]);
 if(!done)D.push([99999,()=>{cx.fillStyle='rgba(0,0,0,'+(.42-.3*f)+')';cx.fillRect(X,Y,w,h)}])}}
// ---------- NPC reactions to each terraform stage ----------
const TFL={1:{ava:"Did you see the lichen out past the airlock? Green on red. I stared at it for an hour. $h",kai:"Someone brought a lichen sample into the cafe. I put it on the counter like a trophy. $h",ruiz:"Lichen colonies, self-sustaining! I've waited my whole career for this. $l",mo:"Green stuff on the rocks out there. In forty years I never saw a speck of it. $s",zara:"From the shuttle you can see green streaks now. Mars is blushing. $h",theo:"The surface albedo changed on my instruments. That's us. We did that. $t",vega:"Stage one. The council said it couldn't be done in our lifetime. $h",pip:"I touched the moss! It's squishy! Mom says don't lick it. I didn't. Mostly. $h",nyx:"From up here the plains look bruised green. Weird. Pretty. $t"},
 2:{ava:"The sky's going blue. I keep looking up and walking into doorframes. $h",kai:"New menu item: Blue Sky Soda. Yes, I'm cashing in. $h",ruiz:"Insects! Pollinators! Do you know what this means for the crops? $l",mo:"Puddles. Actual puddles. My knees ache like Earth again. $t",zara:"Flying in a blue sky. It's like the old Earth videos. I cried a little, don't tell. $s",theo:"Rayleigh scattering, finally! Sorry. I mean: the sky is blue! $h",vega:"Barley is growing in open air. Open air! Get some seeds from the shop. $h",pip:"There are BUGS. Real outside bugs. I named one Gerald. $h",nyx:"The atmosphere glows at the limb now. The station crew keeps crowding the window. $h"},
 3:{ava:"A lake. On Mars. I went out there and just sat with my boots in the water. $l",kai:"I'm planning a picnic by the lake. You're invited, obviously. $l",ruiz:"Birds. I don't even know where they came from - the Ark seed vaults, I suppose. Beautiful. $s",mo:"Water in the craters. My old partner would've loved this. I hope he can see it. $s",zara:"Landed next to the lake and skipped stones. Low gravity skipping is the best. $h",theo:"The lake reflects the stars at night. Two skies. I could live out there. $l",vega:"We did it. Mars is waking up. Thank you - from all of us. $l",pip:"I saw a bird!!! It looked at me!!! Best day ever!!! $h",nyx:"I can see your lake from orbit. It winks blue every pass. Show-off. $h"}};
{const _c=chat;chat=function(n){const key=n.id+G.day,first=!G.talked[key];_c.apply(this,arguments);const st=G.terra||0;if(!st||!first||!modal||!modal.pages)return;G.tfHeard=G.tfHeard||{};
 const k=n.id+st;if(G.tfHeard[k])return;const l=(TFL[st]||{})[n.id];if(!l)return;G.tfHeard[k]=1;modal.pages.unshift(l)}}
// terraform stage CGs (first time each stage is reached)
{const _u=update;update=function(){_u.apply(this,arguments);if(!G||TITLE||modal||CUT||menu||!G.terra)return;G.tfCG=G.tfCG||0;
 if(G.terra>G.tfCG){G.tfCG=G.terra;const s=G.terra;SURF=null;if(window.FM16)FM16.showCG('tf'+s,['Lichen Fields','Blue Sky','The First Lake'][s-1],[['Outside the dome, grey-green lichen creeps across the red plains.','New forageables (Mars Clover) are sprouting on the surface.'],['The sky over Mars is turning blue. Grass, puddles, and tiny insects!','The shop now sells outdoor-only Barley seeds for the Open-Sky Field.'],['The craters fill with water. Birds wheel over a blue lake.','Skyberries and Lake Reeds can now be found outside.']][s-1])}}}
// achievements
ACH.push(['ocb1','Restorer','Complete an Old Colony bundle',g=>(g.stats.ocB||0)>=1],['ocall','First Dome','Restore the entire Old Colony',g=>!!(g.oc&&g.oc.fin)],['opsky','Open-Sky Farmer','Harvest a crop grown outside the dome',g=>(g.stats.oharv||0)>=1],['rail','All Aboard','Ride the Colony Rail',g=>(g.stats.rail||0)>=1]);
if(window.FM17&&FM17.CGT)Object.assign(FM17.CGT,{oldcol:'Old Colony Restored',tf1:'Terraform: Lichen Fields',tf2:'Terraform: Blue Sky',tf3:'Terraform: The First Lake'});
// ---------- debug menu ----------
if(window.FM17){const _st=FM17.setTab;FM17.setTab=function(t){_st(t);const el=document.getElementById('dbg');if(!el)return;const bd=el.querySelector('.bd');if(!bd)return;
 const sec=(title,items)=>{const h=document.createElement('h3');h.textContent=title;const row=document.createElement('div');row.className='row';for(const[l,f]of items){const b=document.createElement('button');b.textContent=l;b.onclick=()=>{f();if(DBG.open)FM17.setTab(t)};row.appendChild(b)}bd.appendChild(h);bd.appendChild(row)};
 const go=(z,x,y)=>{FM17.closeDbg();modal=null;CUT=null;enter(z,x,y,2)};
 if(t=='Warp')sec('v22: Old Colony & terraforming',[['Old Colony',()=>go('oldcol',2,7)],['Old Colony entrance',()=>go('surf',OCD[0],OCD[1]+1)],['Open-Sky Field',()=>go('surf',17,39)],...ROOMS.map(r=>[r.n,()=>go('oldcol',r.p[0],r.p[1]+1)]),...Object.entries(RAIL).map(([k,[n,x,y]])=>['Rail: '+n,()=>go(railZ(k),x,y+1)])]);
 if(t=='Events')sec('v22 events',[['Old Colony finale',()=>FM17.replay(()=>finale())],['Intro letter',()=>FM17.replay(()=>{const L=LETTERS.find(l=>l[0]=='oldcol');say(L[1]+': '+L[2],[L[3]])})],...[1,2,3].map(s=>['Terraform CG '+s,()=>FM17.replay(()=>{G.terra=s;G.tfCG=s-1})]),['NPC terraform lines',()=>FM17.replay(()=>{const st=Math.max(1,G.terra||1);say('Colonists react (stage '+st+')',NPCS.filter(n=>TFL[st][n.id]).map(n=>n.n+': '+TFL[st][n.id]))})],['Forecast',()=>FM17.replay(()=>say('Radio',[forecastText()]))]]);
 if(t=='Give'){sec('v22: Old Colony',[...ROOMS.map(r=>['Restore '+r.n,()=>{for(const b of roomBundles(r.id))if(!bDone(b))completeBundle(b,true)}]),['Restore ALL (with finale)',()=>{for(const b of OCB)if(!bDone(b))completeBundle(b,true);FM17.closeDbg();finale()}],['Reset Old Colony',()=>{G.oc={b:{},done:{},unl:{},pin:null};resetGH()}],['Bundle items x10',()=>{for(const b of OCB)for(const k in b.in)if(k!='$'&&ITEMS[k])add(k,10)}]]);
  sec('v22: Terraforming (visual stage)',[0,1,2,3].map(n=>['Stage '+n+(G.terra==n?' ✓':''),()=>{G.terra=n;G.tfCG=n;SURF=null}]).concat([['Outdoor seeds x5',()=>{add('s_mbar',5);add('s_skyb',5)}],['Grow Open-Sky Field',()=>{for(const k in G.oplot||{})G.oplot[k].g=99}]]))}};}
window.FM19={ROOMS,OCB,oc,donate,completeBundle,unlock,roomMenu,bundleView,ocMenu,finale,railMenu,RAIL,forecastFor,forecastText,seeded,OPL,OCROP,plotAct,TFL,paintTerra,bDone,roomDone,ocAllDone,trRect,OCD,applyGH};
})();
