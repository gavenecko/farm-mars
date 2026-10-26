// Farm Mars v2 - core logic
const W=384,H=216;
const PLOOK={skin:'#f0c090',hair:'#8a3a1a',style:'cap',top:'#2a8a6a',pants:'#3a3a5a',acc:'#ffb020'};
let VALL=null,SLOT=1,EMO={},FADE=0;const slotKey=s=>s==1?'farmmars2':'farmmars2_'+s;
let G,ENTS=[],SURF=null,MINE=null,PR=[],P=[],FT=[],tick=0,anim=0,swingT=0,swingId=null,invT=0,npcRT={},robot={x:15*T,y:12*T,tx:15*T,ty:12*T};
const DIRV=[[0,-1],[1,0],[0,1],[-1,0]];
function newGame(){return{v:2,day:1,time:360,money:400,energy:100,maxEn:100,hp:100,o2:100,zone:'farm',px:12*T+8,py:9*T+8,dir:2,sel:0,
 inv:[['hoe',1],['can',1],['pick',1],['blade',1],['s_pot',6],['s_let',6],['s_wht',4],['rod',1],null,null].concat(Array(20).fill(null)),
 tools:{hoe:1,can:1,pick:1,blade:1},tiles:{},objs:{},ship:[],hearts:Object.fromEntries(NPCS.map(n=>[n.id,0])),animals:[],research:{},req:null,xp:{farm:0,mine:0,combat:0,forage:0,fish:0},terra:0,ach:{},rover:0,kids:0,talked:{},gifted:{},events:{},dating:{},spouse:null,wedDay:0,
 bundles:{},deep:0,bossDead:0,floor:0,music:true,sfx:true,stats:{harvest:0,mined:0,bugs:0}}}
function migrate(o){const g=newGame();g.day=o.day||1;g.money=o.money||0;g.hearts=Object.assign(g.hearts,o.hearts||{});g.spouse=o.spouse||null;if(g.spouse){g.dating[g.spouse]=1;g.hearts[g.spouse]=10}
 for(const k in o.tiles||{}){const t=o.tiles[k];g.tiles[k]={w:t.w||0,c:t.c&&CROPS[t.c]?t.c:null,g:t.g||0,dry:0}}
 let i=8;for(const s of o.inv||[])if(s&&ITEMS[s[0]]&&!ITEMS[s[0]].tool&&i<30)g.inv[i++]=[s[0],s[1]];return g}
function save(quiet){try{localStorage.setItem(slotKey(SLOT),JSON.stringify(G));if(!quiet)toast('Game saved')}catch(e){}}
function load(){try{const s=JSON.parse(localStorage.getItem(slotKey(SLOT)));if(s&&s.v==2){const n=newGame();for(const k in n)if(s[k]===undefined)s[k]=n[k];for(const q of NPCS)if(s.hearts[q.id]==null)s.hearts[q.id]=0;while(s.inv.length<30)s.inv.push(null);if(!s.inv.some(q=>q&&q[0]=='rod')){const i=s.inv.findIndex(q=>!q);if(i>=0)s.inv[i]=['rod',1]}return s}}catch(e){}
 if(SLOT==1)try{const o=JSON.parse(localStorage.getItem('farmmars1'));if(o&&o.day){const g=migrate(o);g.migrated=1;return g}}catch(e){}return null}
const season=(d=G.day)=>SEASONS[Math.floor((d-1)/SOLS_PER_SEASON)%4],seasonIdx=(d=G.day)=>Math.floor((d-1)/SOLS_PER_SEASON)%4,year=()=>1+Math.floor((G.day-1)/(SOLS_PER_SEASON*4)),solOfSeason=()=>(G.day-1)%SOLS_PER_SEASON+1;
// ---------- inventory ----------
function add(id,q=1){for(const s of G.inv)if(s&&s[0]==id&&!ITEMS[id].tool){s[1]+=q;return true}const i=G.inv.findIndex(s=>!s);if(i<0){toast('Bag full!');sfx('bad');return false}G.inv[i]=[id,q];return true}
function take(i,q=1){const s=G.inv[i];s[1]-=q;if(s[1]<=0)G.inv[i]=null}
const cur=()=>G.inv[G.sel],cnt=id=>G.inv.reduce((a,s)=>a+(s&&(s[0]==id||ITEMS[s[0]].base==id)?s[1]:0),0);
function rem(id,q){for(let i=0;i<30&&q>0;i++){const s=G.inv[i];if(s&&(s[0]==id||ITEMS[s[0]].base==id)){const t=Math.min(q,s[1]);take(i,t);q-=t}}}
const hasAll=inn=>Object.entries(inn).every(([i,q])=>cnt(i)>=q);
// ---------- messages ----------
let modal=null,toastT=0,toastS='',menu=null;function toast(s){toastS=s;toastT=150}
function say(name,pages,opts,look){if(typeof pages=='string')pages=[pages];modal={name,pages,pi:0,ch:0,opts:opts||null,sel:0,look}}
function floatTxt(x,y,s,c='#fff'){FT.push({x,y,s,c,l:50})}
function parts(x,y,c,n=8,sp=1.5){for(let i=0;i<n;i++)P.push({x,y,vx:(Math.random()-.5)*2*sp,vy:-Math.random()*2*sp,l:20+Math.random()*15,c,gr:.12})}
// ---------- world ----------
function curMap(){return G.zone=='mine'?MINE.m:MAPS[G.zone]}
function tileAt(x,y){const m=curMap();return m[y]&&m[y][x]}
function solidAt(px_,py_){const x=Math.floor(px_/T),y=Math.floor(py_/T),t=tileAt(x,y);if(t===undefined)return true;if(isSolid(G.zone,t)||G.zone=='surf'&&t=='c'&&isPool(x,y))return true;
 if(G.zone=='farm'&&G.objs[x+','+y])return true;
 if(OUTZ(G.zone))for(const e of ENTS)if(e.k=='ore'&&Math.abs(e.x-px_)<6&&Math.abs(e.y-py_)<5)return true;return false}
function enter(zone,tx,ty,dir){FADE=18;G.zone=zone;G.px=tx*T+8;G.py=ty*T+8;if(dir!==undefined)G.dir=dir;sfx('door');PR=[];toastT=0;
 if(zone=='surf'){G.o2=100;ENTS=SURF||(SURF=genSurface());toast('Airlock cycled. O2 refilled.')}
 else if(zone=='mine'){ENTS=MINE.E}else if(zone=='valles'){G.o2=100;ENTS=VALL||(VALL=genValles())}else ENTS=[];placeNPCs(true);unstick(false)}
const TRIG='XDMuv';
function feetFree(x,y){return !solidAt(x-5,y-3)&&!solidAt(x+5,y-3)&&!solidAt(x-5,y)&&!solidAt(x+5,y)}
function openTile(tx,ty){const t=tileAt(tx,ty);if(t===undefined||isSolid(G.zone,t)||G.zone=='surf'&&t=='c'&&isPool(tx,ty)||TRIG.includes(t))return false;if(!feetFree(tx*T+8,ty*T+8))return false;
 let n=0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const u=tileAt(tx+a,ty+b);if(u!==undefined&&(!isSolid(G.zone,u)))n++}return n>=2}
// nudge player to nearest walkable tile if inside a collider (or always when forced)
function unstick(force){if(!force&&feetFree(G.px,G.py))return false;const sx=Math.floor(G.px/T),sy=Math.floor((G.py-2)/T);
 for(let r=force?1:0;r<20;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){if(Math.max(Math.abs(a),Math.abs(b))!=r)continue;if(openTile(sx+a,sy+b)){G.px=(sx+a)*T+8;G.py=(sy+b)*T+8;return true}}
 G.zone='farm';G.px=13*T+8;G.py=9*T+8;ENTS=[];return true}
function enterMine(f){G.floor=f;MINE=genMine(f);G.deep=Math.max(G.deep,f);if(MINE.boss&&G.bossDead){MINE.E=[];MINE.m[MINE.ly][MINE.lx]='v'}enter('mine',3,3,2);toast('Mine floor '+f+(MINE.boss&&!G.bossDead?' - something stirs...':''));if(MINE.boss&&!G.bossDead)sfx('roar')}
function facingTile(){const d=DIRV[G.dir];return[Math.floor(G.px/T)+d[0],Math.floor((G.py-2)/T)+d[1]]}
function useEnergy(n){if(G.energy<n){toast('Too tired... eat or sleep');sfx('bad');return false}G.energy-=n;return true}
// ---------- farm ----------
function targetTiles(tool){const[fx,fy]=facingTile(),d=DIRV[G.dir],tier=G.tools[tool]||1,out=[[fx,fy]];
 if(tier==2)out.push([fx+d[0],fy+d[1]],[fx+2*d[0],fy+2*d[1]]);
 if(tier==3){out.length=0;const cx_=fx+d[0],cy=fy+d[1];for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)out.push([cx_+a,cy+b])}return out}
const mature=t=>t&&t.c&&t.g>=CROPS[t.c].days;
function harvest(k){const t=G.tiles[k],c=t.c;if(!add(qualId(c)))return false;addXP('farm',6);if(Math.random()<[0,.2,.4][perk('farm')])add(c);const[x,y]=k.split(',').map(Number);parts(x*T+8,y*T+8,CROPS[c].c,10);floatTxt(x*T+8,y*T,'+'+CROPS[c].n,'#bfa');sfx('harvest');G.stats.harvest++;
 if(CROPS[c].re){t.g=CROPS[c].days-CROPS[c].re}else{t.c=null;t.g=0}return true}
let FISHING=null;
function startFish(){FISHING={ph:'wait',t:0,bite:60+Math.random()*120};sfx('water');toast('Casting... wait for a bite, then press USE')}
function fishAct(){const f=FISHING;if(f.ph=='wait'){FISHING=null;toast('Reeled in too early');return}
 if(f.ph=='bite'){const r=Math.random(),k=r<(perk('fish')>=2?.24:.12)?'koi':r<.4?'eel':'carp';f.ph='reel';f.k=k;f.pos=0;f.dir=1;f.zw=Math.min(.6,FISH[k].zone*(perk('fish')?1.3:1));f.zs=Math.random()*(1-f.zw);sfx('menu');return}
 if(f.ph=='reel'){const ok=f.pos>=f.zs&&f.pos<=f.zs+f.zw;FISHING=null;if(ok&&add(f.k)){sfx('harvest');G.stats.fish=(G.stats.fish||0)+1;addXP('fish',12);floatTxt(G.px,G.py-24,'Caught '+FISH[f.k].n+'!','#9ef')}else{sfx('bad');toast('It got away!')}}}
function updFish(){const f=FISHING;f.t++;if(f.ph=='wait'&&f.t>f.bite){f.ph='bite';f.t=0;sfx('clink')}if(f.ph=='bite'&&f.t>50){FISHING=null;toast('It got away!');sfx('bad')}
 if(f.ph=='reel'){f.pos+=f.dir*FISH[f.k].spd/100;if(f.pos>1||f.pos<0){f.dir*=-1;f.pos=Math.max(0,Math.min(1,f.pos))}}}
function act(){if(FISHING){fishAct();return}if(swingT>4)return;const s=cur();const[fx,fy]=facingTile(),k=fx+','+fy;
 if(G.zone=='farm'&&mature(G.tiles[k])){harvest(k);return}
 if(!s){interact();return}const id=s[0],it=ITEMS[id];
 if(it.food||it.use){consume();return}
 if(G.zone=='farm'){
  if(id=='rod'){if(tileAt(fx,fy)=='P'){if(useEnergy(2)){swing('rod');startFish()}}else toast('Face the reservoir to fish');return}
  if(it.place){if(tileAt(fx,fy)=='g'&&!G.tiles[k]&&!G.objs[k]){G.objs[k]=id;take(G.sel);sfx('plant');toast('Placed '+it.n)}else sfx('bad');return}
  if(it.seed){const t=G.tiles[k];if(t&&!t.c){if(!CROPS[it.seed].s.includes(seasonIdx())){toast(CROPS[it.seed].n+" won't grow in "+season()+' season');sfx('bad');return}t.c=it.seed;t.g=0;t.dry=0;take(G.sel);sfx('plant');parts(fx*T+8,fy*T+10,'#7a4a2a',4)}return}
  if(id=='hoe'||id=='can'){const tl=targetTiles(id);if(!useEnergy(id=='hoe'?1+tl.length:Math.ceil(tl.length/2)))return;swing(id);
   for(const[x,y]of tl){const kk=x+','+y;
    if(id=='hoe'){if(G.objs[kk]){add(G.objs[kk]);delete G.objs[kk];toast('Picked up');continue}if(tileAt(x,y)=='g'&&!G.tiles[kk]){G.tiles[kk]={w:0,c:null,g:0,dry:0};parts(x*T+8,y*T+10,'#8a4a2a',5)}}
    else{const t=G.tiles[kk];if(t){t.w=1;t.dry=0;parts(x*T+8,y*T+8,'#6cf',5,1)}}}
   sfx(id=='hoe'?'till':'water');return}
  if(id=='pick'||id=='blade'||it.wpn){swing(id);sfx('swing');return}}
 if(OUTZ(G.zone)){if(id!='pick'&&id!='blade'&&id!='hoe'&&!it.wpn){toast('Equip pickaxe or a weapon');return}
  if(!useEnergy(id=='pick'?2:id=='hammer'?3:1))return;swing(id);sfx('swing');const d=DIRV[G.dir],reach=id=='lance'?24:id=='hammer'?0:12,ax=G.px+d[0]*reach,ay=G.py-4+d[1]*reach;if(id=='hammer'){parts(G.px,G.py-2,'#fa4',18,2.5);sfx('break')}
  const pd=[0,1,2,4][G.tools.pick]+(perk('mine')?1:0),cb=perk('combat')?2:0,bd=[0,2,4,7][G.tools.blade]+cb;
  for(const e of ENTS){if(e.dead||e.under)continue;const r=(e.t=='queen'||e.t=='wyrm'?26:15)+(id=='hammer'?14:id=='lance'?3:0);if(Math.hypot(e.x-ax,e.y-4-ay)>r)continue;
   if(e.k=='ore'){if(id=='pick'){e.hp-=pd;sfx('clink');parts(e.x,e.y-4,ITEMS[e.t]?ITEMS[e.t].c:'#887',5);if(e.hp<=0){e.dead=1;sfx('break');G.stats.mined++;addXP('mine',4);
     if(e.t=='stone'){if(Math.random()<.3)add('iron')}else{const q=(e.t=='iron'?2:1)+(perk('mine')>=2?1:0);add(e.t,q);floatTxt(e.x,e.y-10,'+'+q+' '+ITEMS[e.t].n,'#9ef')}}}else{sfx('clink');floatTxt(e.x,e.y-10,'clang','#888')}}
   if(e.k=='bug'){const dmg=id=='blade'?bd:id=='lance'?6+cb:id=='hammer'?9+cb:Math.max(1,pd-1);e.hp-=dmg;e.hit=8;const a=Math.atan2(e.y-G.py,e.x-G.px),kb=e.t=='queen'?.5:4;e.vx=Math.cos(a)*kb;e.vy=Math.sin(a)*kb;sfx('hit');parts(e.x,e.y-4,BUGS[e.t].c2,6);floatTxt(e.x,e.y-14,'-'+dmg,'#ff8');
    if(e.hp<=0)killBug(e)}}
  ENTS=ENTS.filter(e=>!e.dead);storeE();return}
 if(id=='pick'||id=='blade'||id=='hoe'||id=='can'){swing(id);sfx('swing')}}
function killBug(e){e.dead=1;G.stats.bugs++;const b=BUGS[e.t];addXP('combat',b.boss?150:8);parts(e.x,e.y,b.c2,16,2.5);sfx('break');
 if(e.t=='wyrm'){wyrmDie(e)}else if(b.boss){G.bossDead=1;add('core');G.money+=1000;MINE.m[MINE.ly][MINE.lx]='v';say('VICTORY','The Crystal Queen shatters into a thousand singing shards! You found the Queen Core and 1000cr of crystal dust. A ladder leads deeper...',[{t:'Roll the credits',f:()=>rollCredits('game')},{t:'Continue'}]);sfx('wed');setMusic('mine')}
 else if(Math.random()<.7){add(b.drop);floatTxt(e.x,e.y-10,'+'+ITEMS[b.drop].n,'#c9f')}}
function swing(id){swingT=14;swingId=id}
function consume(){const s=cur();if(!s)return;const it=ITEMS[s[0]];
 if(it.use=='o2'){if(G.zone!='surf'&&G.zone!='mine'){toast('Save it for the surface');return}G.o2=Math.min(100,G.o2+60);toast('O2 +60')}
 else if(it.use=='hp'){G.hp=Math.min(100,G.hp+60);toast('HP +60')}
 else{G.energy=Math.min(G.maxEn,G.energy+it.food);G.hp=Math.min(100,G.hp+Math.round(it.food/2));toast('Ate '+it.n+' (+'+it.food+' EN)')}
 take(G.sel);sfx('plant')}
// ---------- interaction ----------
function nearNPC(){for(const id in npcRT){const n=npcRT[id];if(n.zone==G.zone&&Math.hypot(n.x-G.px,n.y-G.py)<(EXITS[G.zone]?36:22))return NPCS.find(q=>q.id==id)}return null}
function interact(){const n=nearNPC();if(n){talk(n);return}
 const[fx,fy]=facingTile(),t=tileAt(fx,fy),k=fx+','+fy,z=G.zone;
 if(z=='farm'&&mature(G.tiles[k])){harvest(k);return}
 if(OUTZ(z)){for(const e of ENTS)if(e.k=='plant'&&!e.dead&&Math.hypot(e.x-G.px,e.y-G.py)<20){e.dead=1;add(e.t);addXP('forage',6);if(Math.random()<(perk('forage')?.3:0))add(e.t);sfx('harvest');floatTxt(e.x,e.y-10,'+'+ITEMS[e.t].n,'#bfa');ENTS=ENTS.filter(q=>!q.dead);storeE();return}}
 if(z=='farm'){const an=G.animals.find(a=>Math.hypot(a.x-G.px,a.y-G.py)<20);if(an){petAnimal(an);return}if(t=='N'){barnInfo();return}}
 if(z=='city'&&t=='Q'){boardMenu();return}
 if(z=='farm'){if(Math.hypot(robot.x-G.px,robot.y-G.py)<22){say('R0-V3R',['*beep boop* Good sol, farmer!',['I water 3 dry crops every morning.','Sprinklers make my job easier. Craft them in the MENU!','Crops left dry 2 sols will wilt. 3 sols... *sad beep*','Each season lasts '+SOLS_PER_SEASON+' sols. Plant what is in season!'][G.day%4]]);sfx('talk');return}
  if(t=='B'){const s=cur();if(s&&ITEMS[s[0]].v>0&&!ITEMS[s[0]].tool){G.ship.push([s[0],s[1]]);toast('Shipped '+s[1]+' '+ITEMS[s[0]].n+' (paid overnight)');G.inv[G.sel]=null;sfx('coin')}else say('Shipping Bin','Hold an item and press ACT to ship it. Payment arrives overnight.');return}
  if(t=='T'){say('Water Tank','Recycled ice-melt. Your water can never runs dry.');return}
  if(t=='H'){say('Habitat','Walk through the door to go inside.');return}}
 if(z=='home'){if(t=='b'){say('Bed','Sleep and end Sol '+G.day+'?',[{t:'Sleep (saves game)',f:sleep},{t:'Not yet'}]);return}
  if(t=='k'){cookMenu();return}if(t=='p'){say('','A potted Glowcap. It pulses gently, like breathing.');return}}
 if(z=='cafe'&&(t=='c'||t=='s')){cafeMenu();return}
 if(z=='shop'&&(t=='c'||t=='s'||t=='h')){shopMenu();return}
 if(z=='cc'){if(t=='q'){bundleMenu();return}if(t=='j'){openMenu('craft');return}}
 if(z=='city'&&t=='F'&&isFestival()&&!G.feast&&seasonIdx()){festAct();return}if(z=='city'&&t=='F'&&isFestival()&&!G.feast){G.feast=G.day;G.energy=G.maxEn;add('pie');sfx('wed');say('Founders\' Festival Feast','The colony shares a feast around the fountain. You eat your fill (energy restored) and take home a Moonmelon Pie!');return}
 if(z=='city'){if(t=='F')say('Fountain','Recycled colony water. A plaque reads "New Cydonia, est. 2079".'+(Object.keys(G.bundles).length>=2?' The restored lights dance in rainbow colors.':''));if(t=='A')say('Habitat Row','Residential pods. The neighbors are asleep. Probably.');if(t=='S')say('Bench','You sit for a moment and watch the neon flicker.')}
 if(z=='surf'&&t=='O')say('Alien Obelisk','Ancient glyphs glow beneath the dust. Nobody knows who built these.')}
// menus as dialog options
let shopQty=1;
function shopMenu(){const si=seasonIdx(),o=[{t:'Buy seeds ('+season()+')',f:seedMenu},{t:'Upgrade tools',f:upgMenu},{t:'Sell held item',f:()=>{sellHeld();shopMenu()}},{t:'Sell all crops/ores/forage',f:()=>{sellAll();shopMenu()}}];
 o.splice(2,0,{t:'Livestock (barn animals)',f:livestockMenu});if(G.deep>=3)o.splice(3,0,{t:'Weapons',f:weaponMenu});if(G.terra>=1&&!G.rover)o.splice(2,0,{t:'Surface Rover 3000cr',f:()=>{if(G.money>=3000){G.money-=3000;G.rover=1;sfx('wed');say('Supply & Tech','Your rover is parked by the airlock. You will drive it automatically on the surface - twice as fast!')}else{toast('Not enough credits');sfx('bad')}}});
 if(Object.values(G.hearts).some(h=>h>=8))o.push({t:'Dome Bouquet 200cr',f:()=>{buy('bouquet');shopMenu()}});
 if(Object.keys(G.dating).length&&!G.spouse)o.push({t:'Red Pendant 500cr',f:()=>{buy('pendant');shopMenu()}});o.push({t:'Leave'});
 say('Supply & Tech','"Seeds, gear, trade. What do you need?"  ('+G.money+'cr)',o)}
function seedMenu(){const o=[{t:'Quantity: x'+shopQty+' (tap to change)',f:()=>{shopQty=shopQty==1?5:shopQty==5?10:1;seedMenu()}}];
 for(const k in CROPS)if(CROPS[k].s.includes(seasonIdx()))o.push({t:CROPS[k].n+' seeds '+CROPS[k].p*shopQty+'cr',f:()=>{buy('s_'+k,shopQty);seedMenu()}});o.push({t:'Back',f:shopMenu});
 say('Supply & Tech','In-season seeds. You have '+G.money+'cr.',o)}
function upgMenu(){const o=[];for(const tl of['hoe','can','pick','blade']){const nt=G.tools[tl]+1,u=UPG[nt];if(!u){o.push({t:ITEMS[tl].n+': MAX',f:upgMenu});continue}
  o.push({t:ITEMS[tl].n+' > '+TOOL_TIER_NAMES[nt]+' '+u.cr+'cr+'+Object.entries(u.in).map(([i,q])=>q+' '+ITEMS[i].n.split(' ')[0]).join(','),f:()=>{if(G.money>=u.cr&&hasAll(u.in)){G.money-=u.cr;for(const[i,q]of Object.entries(u.in))rem(i,q);G.tools[tl]=nt;sfx('craft');toast(ITEMS[tl].n+' upgraded!')}else{toast('Need more credits/materials');sfx('bad')}upgMenu()}})}
 o.push({t:'Back',f:shopMenu});say('Tool Bench','Hoe/Can: Ferrite = 3 tiles, Cobalt = 3x3. Pick/Blade: more damage.',o)}
function sellHeld(){const s=cur();if(s&&ITEMS[s[0]].v&&!ITEMS[s[0]].tool){const v=ITEMS[s[0]].v*s[1];G.money+=v;toast('Sold for '+v+'cr');G.inv[G.sel]=null;sfx('coin')}else{toast('Hold something sellable');sfx('bad')}}
function sellAll(){let v=0;G.inv.forEach((s,i)=>{if(s){const it=ITEMS[s[0]];if((it.crop||['iron','crys','cob','pla','glowcap','lily','vmoss','chit','venom','frz','egg','milk','jasp','opal','saltb','scale'].includes(s[0]))){v+=it.v*s[1];G.inv[i]=null}}});G.money+=v;toast(v?'Sold for '+v+'cr':'Nothing to sell');if(v)sfx('coin')}
function buy(id,q=1){const p=ITEMS[id].p*q;if(G.money<p){toast('Not enough credits');sfx('bad');return}if(add(id,q)){G.money-=p;sfx('coin');toast('Bought '+q+' '+ITEMS[id].n)}}
function cafeMenu(){const kai=npcRT.kai&&npcRT.kai.zone=='cafe';say('Red Dust Cafe',kai?'KAI: "What can I get you?"':'A self-serve kiosk blinks at you.',[{t:'Red Dust Latte 30cr',f:()=>{buy('coffee');cafeMenu()}},{t:'Cydonia Bun 25cr',f:()=>{buy('bun');cafeMenu()}},{t:'Leave'}],kai?NPCS[1].look:null)}
function cookMenu(){const o=RECIPES.filter(r=>r.cook).map(r=>({t:ITEMS[r.id].n+': '+Object.entries(r.in).map(([i,q])=>q+' '+ITEMS[i].n).join(', '),f:()=>{craft(r);cookMenu()}}));o.push({t:'Done'});say('Kitchen','What should we cook?',o)}
function craft(r){if(r.cook&&G.zone!='home'){toast('Cook at your home kitchen');sfx('bad');return}if(!hasAll(r.in)){toast('Missing ingredients');sfx('bad');return}for(const[i,q]of Object.entries(r.in))rem(i,q);add(r.id);sfx('craft');toast('Made '+ITEMS[r.id].n)}
function bundleMenu(){const o=[{t:G.terra<3?'Terraforming: '+TERRA[G.terra].n+' (stage '+(G.terra+1)+'/3)':'Terraforming: COMPLETE',f:terraMenu},{t:'Research Archive ('+Object.keys(G.research).length+'/'+RESEARCH.length+' donated)',f:researchMenu}].concat(BUNDLES.map((b,i)=>({t:(G.bundles[i]?'[DONE] ':'')+b.n+': '+Object.entries(b.in).map(([k,q])=>cnt(k)+'/'+q+' '+ITEMS[k].n).join(', '),f:()=>{if(G.bundles[i]){bundleMenu();return}if(hasAll(b.in)){for(const[k,q]of Object.entries(b.in))rem(k,q);G.bundles[i]=1;G.money+=b.r;sfx('wed');say('Community Center',b.n+' complete! +'+b.r+'cr. The colony cheers!'+(Object.keys(G.bundles).length==BUNDLES.length?' ALL BUNDLES DONE - New Cydonia is thriving thanks to you!':''))}else{toast('Missing items');sfx('bad');bundleMenu()}}})));
 o.push({t:'Leave'});say('Community Board','Help the colony grow. Rewards in credits.',o)}
// ---------- NPCs ----------
const isFestival=()=>solOfSeason()==SOLS_PER_SEASON;
function schedFor(n,h){if(isFestival()&&h>=9&&h<16&&G.spouse!=n.id){const sp=FEST[n.id];return['city',sp[0],sp[1]]}if(G.spouse==n.id){return h<9||h>=21?['home',7,3]:h<17?['farm',9,8]:['home',3,4]}let e=n.sched[0];for(const s of n.sched)if(h>=s[0])e=s;return[e[1],e[2],e[3]]}
function placeNPCs(snap){const h=Math.floor(G.time/60);for(const n of NPCS){const[z,x,y]=schedFor(n,h);let r=npcRT[n.id];if(!r)r=npcRT[n.id]={x:x*T+8,y:y*T+8,dir:2,f:0,zone:z};
 if(r.zone!=z||snap&&r.zone!=G.zone){r.zone=z;r.x=x*T+8;r.y=y*T+8}r.hx=x*T+8;r.hy=y*T+8;if(r.zone=='home'&&G.spouse!=n.id)r.zone='away'}}
function heartsCap(n){return n.mar&&!G.dating[n.id]&&G.spouse!=n.id?8:10}
function addHearts(n,v){G.hearts[n.id]=Math.max(0,Math.min(heartsCap(n),G.hearts[n.id]+v))}
function talk(n){const r=npcRT[n.id];r.dir=Math.abs(G.px-r.x)>Math.abs(G.py-r.y)?(G.px>r.x?1:3):(G.py>r.y?2:0);sfx('talk');
 const h=G.hearts[n.id],key=n.id+G.day;
 for(const lv of[3,4,6,7,9])if(h>=lv&&n.ev[lv]&&!G.events[n.id+lv]){G.events[n.id+lv]=1;say(n.n+' ♥ Event',n.ev[lv],[{t:'♥',f:()=>{sfx('heart');addHearts(n,.5);if(n.id=='mo'&&lv==6){G.maxEn+=10}if(n.id=='vega'&&lv==6){G.money+=500}}}],n.look);return}
 const opts=[{t:'Chat',f:()=>chat(n)}];const s=cur();if(s&&!ITEMS[s[0]].tool)opts.push({t:'Give '+ITEMS[s[0]].n,f:()=>gift(n)});opts.push({t:'Bye'});
 const greet=G.spouse==n.id?['Hey, love.','There you are! I missed you.','Welcome home, farmer.'][G.day%3]:h<2?'Oh, hello.':h<5?'Hey, good to see you!':h<8?'Hi! I was hoping you\'d come by.':'*smiles brightly* Hi you.';
 say(n.n,greet,opts,n.look)}
function chat(n){const key=n.id+G.day,first=!G.talked[key];if(first&&isFestival()&&npcRT[n.id].zone=='city'&&Math.floor(G.time/60)>=9&&Math.floor(G.time/60)<16){G.talked[key]=1;addHearts(n,1.4);sfx('heart');say(n.n,['Happy '+festName()+'! The whole colony is out tonight.',['Dance with me later?','Try the festival feast at the fountain!','Seventeen years since the first dome. Look how far we came.'][G.day%3]],null,n.look);return}if(first){G.talked[key]=1;addHearts(n,.4);emote(n.id,'note')}
 let l;if(G.spouse==n.id){l=[["Morning! I watered a few crops for you.","Don't overdo it on the surface, okay?"],["I love our little dome life.","Remember our wedding? The whole plaza glowed."],["Let's watch Phobos rise tonight.","You're the best thing that happened to me on Mars."]][G.day%3];if(first){G.energy=Math.min(G.maxEn,G.energy+15);sfx('heart')}}
 else{const tier=Math.min(3,Math.floor(G.hearts[n.id]/2.5)),ls=n.lines[tier];l=[ls[G.day%ls.length]];if(n.season&&n.season[season()]&&G.day%2)l.push(n.season[season()])}
 say(n.n,l,null,n.look)}
function gift(n){const s=cur(),id=ITEMS[s[0]].base||s[0],key=n.id+G.day;
 if(id=='bouquet'){if(!n.mar){say(n.n,"Flowers? That's sweet, but I'm happily single.",null,n.look);return}if(G.hearts[n.id]<8){say(n.n,'Oh... I think we should get to know each other better first.',null,n.look);return}
  take(G.sel);G.dating[n.id]=1;sfx('heart');say(n.n,['...For me? You mean... like, DATING?','*'+n.n+' laughs and hugs you tight*','Yes! Absolutely yes.'],null,n.look);return}
 if(id=='pendant'){if(!G.dating[n.id]){say(n.n,'A pendant? We should be dating first...',null,n.look);return}if(G.hearts[n.id]<10){say(n.n,'I love you, but... give us a little more time. (10 hearts)',null,n.look);return}
  take(G.sel);G.spouse=n.id;G.wedDay=G.day;sfx('wed');say('Wedding',['You kneel in the neon plaza and offer the Red Pendant.',n.n.toUpperCase()+': "Yes! A thousand times yes!"','The next morning, all of New Cydonia gathers under the dome. Old Mo cries. Dr. Ruiz throws Glowberry petals.',n.n+' moves into your habitat. Your spouse will help on the farm and cheer you on each sol. ♥'],null,n.look);modal.scene='wed';modal.wl=n.look;modal.wid=n.id;modal.mood='love';return}
 if(G.gifted[key]){say(n.n,'You already gave me something today!',null,n.look);return}
 take(G.sel);G.gifted[key]=1;const lk=n.likes.includes(id),ht=n.hates.includes(id),bd=isBday(n);addHearts(n,(lk?1.5:ht?-.5:.5)*(bd?3:1));if(lk||bd)sfx('heart');emote(n.id,lk?'heart':ht?'angry':'note');
 say(n.n,(bd?(ht?'On my BIRTHDAY? ...Wow. ':'You remembered my birthday! '):'')+(lk?'I LOVE this! How did you know?':ht?'Uh... thanks? Not really my thing.':'Thanks, that\'s thoughtful.'),null,n.look);modal.mood=lk||bd?'love':ht?'angry':'happy'}
function isBday(n,d=G.day){const b=BDAY[n.id];return b&&seasonIdx(d)==b[0]&&((d-1)%SOLS_PER_SEASON+1)==b[1]}
function emote(id,k){EMO[id]={k,e:tick+160};const r=npcRT[id];if(r&&k=='heart')parts(r.x,r.y-26,'#f6a',8,1)}
// ---------- day cycle ----------
function sleep(passed){sfx('sleep');let earn=0;for(const[i,q]of G.ship)earn+=ITEMS[i].v*q;G.ship=[];G.money+=earn;
 const oldS=seasonIdx();let grew=0,wilted=0,died=0;
 for(const k in G.tiles){const t=G.tiles[k];if(t.c){if(t.w){t.g++;t.dry=0;grew++}else{t.dry++;if(t.dry>=3){t.c=null;t.g=0;died++}else if(t.dry==2)wilted++}}t.w=0}
 G.day++;const ns=seasonIdx();let killed=0;if(ns!=oldS)for(const k in G.tiles){const t=G.tiles[k];if(t.c&&!CROPS[t.c].s.includes(ns)){t.c=null;killed++}}
 // morning: sprinklers, robot, spouse
 let sp=0;for(const k in G.objs){const[x,y]=k.split(',').map(Number),q=G.objs[k]=='qspr';for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){if(!a&&!b||(!q&&a&&b))continue;const t=G.tiles[(x+a)+','+(y+b)];if(t){t.w=1;t.dry=0;sp++}}}
 let r=0;for(const k in G.tiles){const t=G.tiles[k];if(t.c&&!t.w&&r<3){t.w=1;t.dry=0;r++}}
 const prod=animalsMorning();let kidMsg='';if(G.spouse&&!G.kids&&G.day-G.wedDay>=7&&G.hearts[G.spouse]>=10){G.kids=1;G.kidDay=G.day;kidMsg='Big news! You and '+NPCS.find(q=>q.id==G.spouse).n+' welcomed a baby into your habitat. Welcome to the colony, little one!'}
 genReq(true);const bdn=NPCS.filter(q=>isBday(q,G.day));
 let spouseMsg='';if(G.spouse){const sn=NPCS.find(q=>q.id==G.spouse),roll=G.day%3;if(roll==0){for(const k in G.tiles)if(G.tiles[k].c){G.tiles[k].w=1;G.tiles[k].dry=0}spouseMsg=sn.n+' watered all the crops before you woke up.'}else if(roll==1){add(sn.id=='kai'?'pie':'stew');spouseMsg=sn.n+' cooked you something. Check your bag!'}else{add(sn.id=='ava'?'crys':'coffee',2);spouseMsg=sn.n+' left a gift by the bed.'}}
 VALL=null;G.time=360;G.energy=passed?Math.round(G.maxEn*.6):G.maxEn;G.hp=100;G.o2=100;G.zone='home';G.px=8*T+8;G.py=3*T+8;G.dir=2;ENTS=[];SURF=genSurface();PR=[];G.talked={};G.gifted={};
 for(const id in npcRT)delete npcRT[id];placeNPCs(true);save(true);
 const pg=[(passed?'You collapsed from exhaustion and a drone carried you home. ':'')+'Sol '+G.day+' - '+season()+' season, Year '+year()+'.','Shipping earned '+earn+'cr. '+(grew?grew+' crops grew. ':'')+(r?'R0-V3R watered '+r+'. ':'')+(sp?'Sprinklers watered '+sp+'. ':'')];
 if(wilted||died)pg.push((wilted?wilted+' crops are wilting - water them! ':'')+(died?died+' crops withered away.':''));
 if(ns!=oldS)pg.push('A new season begins: '+season()+'!'+(killed?' '+killed+' out-of-season crops died.':'')+' New seeds are at Supply & Tech.');
 if(prod)pg.push(prod);if(kidMsg)pg.push(kidMsg);if(G.terra<3&&G.day>=2&&G.day%3==0)pg.push('MAYOR VEGA (radio): The terraforming project needs you. Next stage: '+TERRA[G.terra].n+'. Check the Community Center.');checkAch();if(bdn.length)pg.push('Today is '+bdn.map(q=>q.n).join(' & ')+'\'s birthday! A gift today means triple friendship.');pg.push('New request on the city board: '+reqText());if(spouseMsg)pg.push(spouseMsg);if(isFestival())pg.push('Today is the '+festName()+"! Join everyone in the New Cydonia plaza from 9:00 to 16:00.");G.feast=0;say('Good morning',pg)}

// ---------- animals ----------
const ANAMES=['Dusty','Rusty','Phoebe','Deimos','Nugget','Olympus','Clucky','Valles','Crater','Pebble'];
function livestockMenu(){const o=Object.entries(ANIMALS).map(([k,a])=>({t:'Buy '+a.n+' '+a.p+'cr (gives '+ITEMS[a.prod].n+(a.every>1?' every '+a.every+' sols':' daily')+')',f:()=>{if(G.animals.length>=8){toast('Barn is full (8)');sfx('bad')}else if(G.money<a.p){toast('Not enough credits');sfx('bad')}else{G.money-=a.p;const nm=ANAMES[G.animals.length%ANAMES.length];G.animals.push({t:k,n:nm,love:0,pet:0,x:(11+G.animals.length%4)*T+8,y:6*T+8,tx:0,ty:0});sfx('coin');toast(a.n+' "'+nm+'" moved into your barn!')}livestockMenu()}}));
 o.push({t:'Back',f:shopMenu});say('Supply & Tech','Livestock live in your farm barn. Pet them daily so they are happy and produce more. ('+G.animals.length+'/8 animals, '+G.money+'cr)',o)}
function petAnimal(a){if(a.pet==G.day){floatTxt(a.x,a.y-16,a.n+' is happy','#fcf');return}a.pet=G.day;a.love=Math.min(10,a.love+1);sfx('heart');parts(a.x,a.y-12,'#f6a',8,1);floatTxt(a.x,a.y-16,'♥ '+a.n,'#f8c')}
function barnInfo(){say('Barn',G.animals.length?G.animals.map(a=>a.n+' the '+ANIMALS[a.t].n+' '+'♥'.repeat(Math.ceil(a.love/2))+(a.pet==G.day?' (petted)':'')).join(' · '):'An empty barn. Buy Mars hens and goats at Supply & Tech.')}
function animalsMorning(){if(!G.animals.length)return '';const got={};for(const a of G.animals){if(a.pet!=G.day)a.love=Math.max(0,a.love-.5);const A=ANIMALS[a.t];if(G.day%A.every)continue;let q=1;if(a.love>=8&&Math.random()<.5)q++;if(q&&add(A.prod,q))got[A.prod]=(got[A.prod]||0)+q}
 const s=Object.entries(got).map(([k,q])=>q+' '+ITEMS[k].n).join(', ');return s?'Your animals produced '+s+'.':'Your animals seem a little lonely. Pet them!'}
function updAnimals(){for(const a of G.animals){if(!a.tx||Math.random()<.004){a.tx=(9+Math.random()*20)*T;a.ty=(6+Math.random()*12)*T}const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy);a.mv=d>2&&tick%3!=0;if(a.mv){const s=a.t=='hen'?.35:.28,nx=a.x+dx/d*s,ny=a.y+dy/d*s;if(!solidAt(nx,ny)){a.x=nx;a.y=ny}else a.tx=0;a.f=dx>0}}}
// ---------- requests board ----------
const REQPOOL=['pot','let','wht','tom','glo','mel','frb','cac','dst','iron','crys','cob','glowcap','lily','chit','carp','eel','egg','milk'];
function genReq(force){if(!force&&G.req&&G.req.day==G.day)return;const si=seasonIdx(),pool=REQPOOL.filter(k=>!CROPS[k]||CROPS[k].s.includes(si)),it=pool[Math.floor(Math.random()*pool.length)],npc=NPCS[Math.floor(Math.random()*NPCS.length)],q=Math.max(1,Math.min(5,Math.round(160/ITEMS[it].v)));
 G.req={day:G.day,npc:npc.id,it,q,r:Math.round(ITEMS[it].v*q*2+60),done:0}}
function reqText(){const r=G.req,n=NPCS.find(q=>q.id==r.npc);return n.n+' needs '+r.q+' '+ITEMS[r.it].n+' ('+r.r+'cr + friendship)'}
function boardMenu(){genReq();const r=G.req;if(r.done){say('Request Board','Request complete! New requests are posted every morning.');return}
 say('Request Board',[reqText()+'. You have '+cnt(r.it)+'/'+r.q+'.'],[{t:'Deliver '+r.q+' '+ITEMS[r.it].n,f:()=>{if(cnt(r.it)>=r.q){rem(r.it,r.q);r.done=1;G.money+=r.r;const n=NPCS.find(q=>q.id==r.npc);addHearts(n,1);emote(n.id,'heart');G.stats.reqs=(G.stats.reqs||0)+1;sfx('coin');say(n.n,'Thank you so much! Here, '+r.r+'cr as promised.',null,n.look)}else{toast('You need '+r.q+' '+ITEMS[r.it].n);sfx('bad')}}},{t:'Leave'}])}
// ---------- research archive ----------
function researchMenu(){const have=RESEARCH.filter(k=>!G.research[k]&&cnt(k)>0),n=Object.keys(G.research).length;
 say('Research Archive',['DR. RUIZ: Bring one of each Martian specimen for the archive. Milestones: 5 = 500cr, 10 = 2 Quality Sprinklers, '+RESEARCH.length+' = a big surprise.','Donated '+n+'/'+RESEARCH.length+': '+(n?RESEARCH.filter(k=>G.research[k]).map(k=>ITEMS[k].n).join(', '):'nothing yet')+'.'],
  [{t:have.length?'Donate '+have.length+' new specimen(s)':'Nothing new to donate',f:()=>{if(!have.length){researchMenu();return}const b=n;for(const k of have){rem(k,1);G.research[k]=G.day}const a=Object.keys(G.research).length;let msg='Donated: '+have.map(k=>ITEMS[k].n).join(', ')+'.';
   if(b<5&&a>=5){G.money+=500;msg+=' Milestone 5: +500cr!'}if(b<10&&a>=10){add('qspr',2);msg+=' Milestone 10: 2 Quality Sprinklers!'}if(b<RESEARCH.length&&a>=RESEARCH.length){G.maxEn+=20;G.money+=2000;msg+=' ARCHIVE COMPLETE! +2000cr and +20 max energy.'}
   sfx('craft');emote('ruiz','heart');say('Research Archive',msg)}},{t:'Back',f:bundleMenu}])}
// ---------- weapons ----------
function weaponMenu(){const o=[];for(const[k,need]of[['lance',3],['hammer',8]]){const own=cnt(k)>0;o.push({t:ITEMS[k].n+(own?' (owned)':G.deep>=need?' '+ITEMS[k].p+'cr':' (reach mine floor '+need+')'),f:()=>{if(!own&&G.deep>=need)buy(k);weaponMenu()}})}
 o.push({t:'Back',f:shopMenu});say('Supply & Tech','Weapons for the deep mines. '+G.money+'cr.',o)}

// ---------- skills ----------
const lvl=k=>Math.min(10,Math.floor(Math.sqrt((G.xp[k]||0)/20))),perk=k=>lvl(k)>=10?2:lvl(k)>=5?1:0;
function addXP(k,n){const a=lvl(k);G.xp[k]=(G.xp[k]||0)+n;const b=lvl(k);if(b>a){sfx('craft');floatTxt(G.px,G.py-30,SKILLS[k]+' Lv '+b+'!','#ffd27a');if(b==5||b==10)toast('New perk: '+PERKS[k][b==10?1:0]);else toast(SKILLS[k]+' reached level '+b)}}
function checkAch(){for(const[id,n,,f]of ACH)if(!G.ach[id]&&f(G)){G.ach[id]=G.day;toast('Achievement: '+n+'!');sfx('heart')}}
// ---------- terraforming ----------
function terraMenu(){if(G.terra>=3){say('Terraforming','All three stages are complete. Mars is waking up.',[{t:'Roll the credits',f:()=>rollCredits('game')},{t:'Back',f:bundleMenu}]);return}
 const s=TERRA[G.terra];say('Terraforming - Stage '+(G.terra+1)+'/3',[s.n+': '+s.d,'Needs '+s.cr+'cr + '+Object.entries(s.in).map(([k,q])=>cnt(k)+'/'+q+' '+ITEMS[k].n).join(', ')+'.'],
  [{t:'Build '+s.n,f:()=>{if(G.money>=s.cr&&hasAll(s.in)){G.money-=s.cr;for(const[k,q]of Object.entries(s.in))rem(k,q);G.terra++;if(G.terra>=3)SURF=null;sfx('wed');for(const n of NPCS)addHearts(n,.5);checkAch();
    const msg=['Lichen spores drift over the plains. Within days, the red dust is streaked with green.','The processor roars to life. The sky over the surface turns a pale, impossible blue.','The ice melts. For the first time in three billion years, water fills the craters of Mars.'][G.terra-1];
    say('Stage '+G.terra+' complete!',[msg,'The whole colony cheers. Everyone\'s friendship +0.5 hearts.'],G.terra==3?[{t:'Roll the credits',f:()=>rollCredits('game')},{t:'Later'}]:null)}else{toast('Need more credits/materials');sfx('bad');terraMenu()}}},{t:'Back',f:bundleMenu}])}
