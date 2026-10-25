// Farm Mars v2 - core logic
const W=384,H=216;
const PLOOK={skin:'#f0c090',hair:'#8a3a1a',style:'cap',top:'#2a8a6a',pants:'#3a3a5a',acc:'#ffb020'};
let G,ENTS=[],SURF=null,MINE=null,PR=[],P=[],FT=[],tick=0,anim=0,swingT=0,swingId=null,invT=0,npcRT={},robot={x:15*T,y:12*T,tx:15*T,ty:12*T};
const DIRV=[[0,-1],[1,0],[0,1],[-1,0]];
function newGame(){return{v:2,day:1,time:360,money:400,energy:100,maxEn:100,hp:100,o2:100,zone:'farm',px:12*T+8,py:9*T+8,dir:2,sel:0,
 inv:[['hoe',1],['can',1],['pick',1],['blade',1],['s_pot',6],['s_let',6],['s_wht',4],null,null,null].concat(Array(20).fill(null)),
 tools:{hoe:1,can:1,pick:1,blade:1},tiles:{},objs:{},ship:[],hearts:{ava:0,kai:0,ruiz:0,mo:0},talked:{},gifted:{},events:{},dating:{},spouse:null,wedDay:0,
 bundles:{},deep:0,bossDead:0,floor:0,music:true,sfx:true,stats:{harvest:0,mined:0,bugs:0}}}
function migrate(o){const g=newGame();g.day=o.day||1;g.money=o.money||0;g.hearts=Object.assign(g.hearts,o.hearts||{});g.spouse=o.spouse||null;if(g.spouse){g.dating[g.spouse]=1;g.hearts[g.spouse]=10}
 for(const k in o.tiles||{}){const t=o.tiles[k];g.tiles[k]={w:t.w||0,c:t.c&&CROPS[t.c]?t.c:null,g:t.g||0,dry:0}}
 let i=7;for(const s of o.inv||[])if(s&&ITEMS[s[0]]&&!ITEMS[s[0]].tool&&i<30)g.inv[i++]=[s[0],s[1]];return g}
function save(quiet){try{localStorage.setItem('farmmars2',JSON.stringify(G));if(!quiet)toast('Game saved')}catch(e){}}
function load(){try{const s=JSON.parse(localStorage.getItem('farmmars2'));if(s&&s.v==2){const n=newGame();for(const k in n)if(s[k]===undefined)s[k]=n[k];while(s.inv.length<30)s.inv.push(null);return s}}catch(e){}
 try{const o=JSON.parse(localStorage.getItem('farmmars1'));if(o&&o.day){const g=migrate(o);g.migrated=1;return g}}catch(e){}return null}
const season=(d=G.day)=>SEASONS[Math.floor((d-1)/SOLS_PER_SEASON)%4],seasonIdx=(d=G.day)=>Math.floor((d-1)/SOLS_PER_SEASON)%4,year=()=>1+Math.floor((G.day-1)/(SOLS_PER_SEASON*4)),solOfSeason=()=>(G.day-1)%SOLS_PER_SEASON+1;
// ---------- inventory ----------
function add(id,q=1){for(const s of G.inv)if(s&&s[0]==id&&!ITEMS[id].tool){s[1]+=q;return true}const i=G.inv.findIndex(s=>!s);if(i<0){toast('Bag full!');sfx('bad');return false}G.inv[i]=[id,q];return true}
function take(i,q=1){const s=G.inv[i];s[1]-=q;if(s[1]<=0)G.inv[i]=null}
const cur=()=>G.inv[G.sel],cnt=id=>G.inv.reduce((a,s)=>a+(s&&s[0]==id?s[1]:0),0);
function rem(id,q){for(let i=0;i<30&&q>0;i++){const s=G.inv[i];if(s&&s[0]==id){const t=Math.min(q,s[1]);take(i,t);q-=t}}}
const hasAll=inn=>Object.entries(inn).every(([i,q])=>cnt(i)>=q);
// ---------- messages ----------
let modal=null,toastT=0,toastS='',menu=null;function toast(s){toastS=s;toastT=150}
function say(name,pages,opts,look){if(typeof pages=='string')pages=[pages];modal={name,pages,pi:0,ch:0,opts:opts||null,sel:0,look}}
function floatTxt(x,y,s,c='#fff'){FT.push({x,y,s,c,l:50})}
function parts(x,y,c,n=8,sp=1.5){for(let i=0;i<n;i++)P.push({x,y,vx:(Math.random()-.5)*2*sp,vy:-Math.random()*2*sp,l:20+Math.random()*15,c,gr:.12})}
// ---------- world ----------
function curMap(){return G.zone=='mine'?MINE.m:MAPS[G.zone]}
function tileAt(x,y){const m=curMap();return m[y]&&m[y][x]}
function solidAt(px_,py_){const x=Math.floor(px_/T),y=Math.floor(py_/T),t=tileAt(x,y);if(t===undefined)return true;if(isSolid(G.zone,t))return true;
 if(G.zone=='farm'&&G.objs[x+','+y])return true;
 if(G.zone=='surf'||G.zone=='mine')for(const e of ENTS)if(e.k=='ore'&&Math.abs(e.x-px_)<6&&Math.abs(e.y-py_)<5)return true;return false}
function enter(zone,tx,ty,dir){G.zone=zone;G.px=tx*T+8;G.py=ty*T+8;if(dir!==undefined)G.dir=dir;sfx('door');PR=[];
 if(zone=='surf'){G.o2=100;ENTS=SURF||(SURF=genSurface());toast('Airlock cycled. O2 refilled.')}
 else if(zone=='mine'){ENTS=MINE.E}else ENTS=[];placeNPCs(true)}
function enterMine(f){G.floor=f;MINE=genMine(f);G.deep=Math.max(G.deep,f);if(MINE.boss&&G.bossDead){MINE.E=[];MINE.m[MINE.ly][MINE.lx]='v'}enter('mine',3,3,2);toast('Mine floor '+f+(MINE.boss&&!G.bossDead?' - something stirs...':''));if(MINE.boss&&!G.bossDead)sfx('roar')}
function facingTile(){const d=DIRV[G.dir];return[Math.floor(G.px/T)+d[0],Math.floor((G.py-2)/T)+d[1]]}
function useEnergy(n){if(G.energy<n){toast('Too tired... eat or sleep');sfx('bad');return false}G.energy-=n;return true}
// ---------- farm ----------
function targetTiles(tool){const[fx,fy]=facingTile(),d=DIRV[G.dir],tier=G.tools[tool]||1,out=[[fx,fy]];
 if(tier==2)out.push([fx+d[0],fy+d[1]],[fx+2*d[0],fy+2*d[1]]);
 if(tier==3){out.length=0;const cx_=fx+d[0],cy=fy+d[1];for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)out.push([cx_+a,cy+b])}return out}
const mature=t=>t&&t.c&&t.g>=CROPS[t.c].days;
function harvest(k){const t=G.tiles[k],c=t.c;if(!add(c))return false;const[x,y]=k.split(',').map(Number);parts(x*T+8,y*T+8,CROPS[c].c,10);floatTxt(x*T+8,y*T,'+'+CROPS[c].n,'#bfa');sfx('harvest');G.stats.harvest++;
 if(CROPS[c].re){t.g=CROPS[c].days-CROPS[c].re}else{t.c=null;t.g=0}return true}
function act(){if(swingT>4)return;const s=cur();const[fx,fy]=facingTile(),k=fx+','+fy;
 if(G.zone=='farm'&&mature(G.tiles[k])){harvest(k);return}
 if(!s){interact();return}const id=s[0],it=ITEMS[id];
 if(it.food||it.use){consume();return}
 if(G.zone=='farm'){
  if(it.place){if(tileAt(fx,fy)=='g'&&!G.tiles[k]&&!G.objs[k]){G.objs[k]=id;take(G.sel);sfx('plant');toast('Placed '+it.n)}else sfx('bad');return}
  if(it.seed){const t=G.tiles[k];if(t&&!t.c){if(!CROPS[it.seed].s.includes(seasonIdx())){toast(CROPS[it.seed].n+" won't grow in "+season()+' season');sfx('bad');return}t.c=it.seed;t.g=0;t.dry=0;take(G.sel);sfx('plant');parts(fx*T+8,fy*T+10,'#7a4a2a',4)}return}
  if(id=='hoe'||id=='can'){const tl=targetTiles(id);if(!useEnergy(id=='hoe'?1+tl.length:Math.ceil(tl.length/2)))return;swing(id);
   for(const[x,y]of tl){const kk=x+','+y;
    if(id=='hoe'){if(G.objs[kk]){add(G.objs[kk]);delete G.objs[kk];toast('Picked up');continue}if(tileAt(x,y)=='g'&&!G.tiles[kk]){G.tiles[kk]={w:0,c:null,g:0,dry:0};parts(x*T+8,y*T+10,'#8a4a2a',5)}}
    else{const t=G.tiles[kk];if(t){t.w=1;t.dry=0;parts(x*T+8,y*T+8,'#6cf',5,1)}}}
   sfx(id=='hoe'?'till':'water');return}
  if(id=='pick'||id=='blade'){swing(id);sfx('swing');return}}
 if(G.zone=='surf'||G.zone=='mine'){if(id!='pick'&&id!='blade'&&id!='hoe'){toast('Equip pickaxe or blade');return}
  if(!useEnergy(id=='pick'?2:1))return;swing(id);sfx('swing');const d=DIRV[G.dir],ax=G.px+d[0]*12,ay=G.py-4+d[1]*12;
  const pd=[0,1,2,4][G.tools.pick],bd=[0,2,4,7][G.tools.blade];
  for(const e of ENTS){if(e.dead)continue;const r=e.t=='queen'?26:15;if(Math.hypot(e.x-ax,e.y-4-ay)>r)continue;
   if(e.k=='ore'){if(id=='pick'){e.hp-=pd;sfx('clink');parts(e.x,e.y-4,ITEMS[e.t]?ITEMS[e.t].c:'#887',5);if(e.hp<=0){e.dead=1;sfx('break');G.stats.mined++;
     if(e.t=='stone'){if(Math.random()<.3)add('iron')}else{const q=e.t=='iron'?2:1;add(e.t,q);floatTxt(e.x,e.y-10,'+'+q+' '+ITEMS[e.t].n,'#9ef')}}}else{sfx('clink');floatTxt(e.x,e.y-10,'clang','#888')}}
   if(e.k=='bug'){const dmg=id=='blade'?bd:Math.max(1,pd-1);e.hp-=dmg;e.hit=8;const a=Math.atan2(e.y-G.py,e.x-G.px),kb=e.t=='queen'?.5:4;e.vx=Math.cos(a)*kb;e.vy=Math.sin(a)*kb;sfx('hit');parts(e.x,e.y-4,BUGS[e.t].c2,6);floatTxt(e.x,e.y-14,'-'+dmg,'#ff8');
    if(e.hp<=0)killBug(e)}}
  ENTS=ENTS.filter(e=>!e.dead);if(G.zone=='mine')MINE.E=ENTS;else SURF=ENTS;return}
 if(id=='pick'||id=='blade'||id=='hoe'||id=='can'){swing(id);sfx('swing')}}
function killBug(e){e.dead=1;G.stats.bugs++;const b=BUGS[e.t];parts(e.x,e.y,b.c2,16,2.5);sfx('break');
 if(b.boss){G.bossDead=1;add('core');G.money+=1000;MINE.m[MINE.ly][MINE.lx]='v';say('VICTORY','The Crystal Queen shatters into a thousand singing shards! You found the Queen Core and 1000cr of crystal dust. A ladder leads deeper...');sfx('wed');setMusic('mine')}
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
 if(z=='surf'||z=='mine'){for(const e of ENTS)if(e.k=='plant'&&!e.dead&&Math.hypot(e.x-G.px,e.y-G.py)<20){e.dead=1;add(e.t);sfx('harvest');floatTxt(e.x,e.y-10,'+'+ITEMS[e.t].n,'#bfa');ENTS=ENTS.filter(q=>!q.dead);if(z=='mine')MINE.E=ENTS;else SURF=ENTS;return}}
 if(z=='farm'){if(Math.hypot(robot.x-G.px,robot.y-G.py)<22){say('R0-V3R',['*beep boop* Good sol, farmer!',['I water 3 dry crops every morning.','Sprinklers make my job easier. Craft them in the MENU!','Crops left dry 2 sols will wilt. 3 sols... *sad beep*','Each season lasts '+SOLS_PER_SEASON+' sols. Plant what is in season!'][G.day%4]]);sfx('talk');return}
  if(t=='B'){const s=cur();if(s&&ITEMS[s[0]].v>0&&!ITEMS[s[0]].tool){G.ship.push([s[0],s[1]]);toast('Shipped '+s[1]+' '+ITEMS[s[0]].n+' (paid overnight)');G.inv[G.sel]=null;sfx('coin')}else say('Shipping Bin','Hold an item and press ACT to ship it. Payment arrives overnight.');return}
  if(t=='T'){say('Water Tank','Recycled ice-melt. Your water can never runs dry.');return}
  if(t=='H'){say('Habitat','Walk through the door to go inside.');return}}
 if(z=='home'){if(t=='b'){say('Bed','Sleep and end Sol '+G.day+'?',[{t:'Sleep (saves game)',f:sleep},{t:'Not yet'}]);return}
  if(t=='k'){cookMenu();return}if(t=='p'){say('','A potted Glowcap. It pulses gently, like breathing.');return}}
 if(z=='cafe'&&(t=='c'||t=='s')){cafeMenu();return}
 if(z=='shop'&&(t=='c'||t=='s'||t=='h')){shopMenu();return}
 if(z=='cc'){if(t=='q'){bundleMenu();return}if(t=='j'){openMenu('craft');return}}
 if(z=='city'){if(t=='F')say('Fountain','Recycled colony water. A plaque reads "New Cydonia, est. 2079".'+(Object.keys(G.bundles).length>=2?' The restored lights dance in rainbow colors.':''));if(t=='A')say('Habitat Row','Residential pods. The neighbors are asleep. Probably.');if(t=='S')say('Bench','You sit for a moment and watch the neon flicker.')}
 if(z=='surf'&&t=='O')say('Alien Obelisk','Ancient glyphs glow beneath the dust. Nobody knows who built these.')}
// menus as dialog options
let shopQty=1;
function shopMenu(){const si=seasonIdx(),o=[{t:'Buy seeds ('+season()+')',f:seedMenu},{t:'Upgrade tools',f:upgMenu},{t:'Sell held item',f:()=>{sellHeld();shopMenu()}},{t:'Sell all crops/ores/forage',f:()=>{sellAll();shopMenu()}}];
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
function sellAll(){let v=0;G.inv.forEach((s,i)=>{if(s){const it=ITEMS[s[0]];if((it.crop||['iron','crys','cob','pla','glowcap','lily','vmoss','chit','venom'].includes(s[0]))){v+=it.v*s[1];G.inv[i]=null}}});G.money+=v;toast(v?'Sold for '+v+'cr':'Nothing to sell');if(v)sfx('coin')}
function buy(id,q=1){const p=ITEMS[id].p*q;if(G.money<p){toast('Not enough credits');sfx('bad');return}if(add(id,q)){G.money-=p;sfx('coin');toast('Bought '+q+' '+ITEMS[id].n)}}
function cafeMenu(){const kai=npcRT.kai&&npcRT.kai.zone=='cafe';say('Red Dust Cafe',kai?'KAI: "What can I get you?"':'A self-serve kiosk blinks at you.',[{t:'Red Dust Latte 30cr',f:()=>{buy('coffee');cafeMenu()}},{t:'Cydonia Bun 25cr',f:()=>{buy('bun');cafeMenu()}},{t:'Leave'}],kai?NPCS[1].look:null)}
function cookMenu(){const o=RECIPES.filter(r=>r.cook).map(r=>({t:ITEMS[r.id].n+': '+Object.entries(r.in).map(([i,q])=>q+' '+ITEMS[i].n).join(', '),f:()=>{craft(r);cookMenu()}}));o.push({t:'Done'});say('Kitchen','What should we cook?',o)}
function craft(r){if(r.cook&&G.zone!='home'){toast('Cook at your home kitchen');sfx('bad');return}if(!hasAll(r.in)){toast('Missing ingredients');sfx('bad');return}for(const[i,q]of Object.entries(r.in))rem(i,q);add(r.id);sfx('craft');toast('Made '+ITEMS[r.id].n)}
function bundleMenu(){const o=BUNDLES.map((b,i)=>({t:(G.bundles[i]?'[DONE] ':'')+b.n+': '+Object.entries(b.in).map(([k,q])=>cnt(k)+'/'+q+' '+ITEMS[k].n).join(', '),f:()=>{if(G.bundles[i]){bundleMenu();return}if(hasAll(b.in)){for(const[k,q]of Object.entries(b.in))rem(k,q);G.bundles[i]=1;G.money+=b.r;sfx('wed');say('Community Center',b.n+' complete! +'+b.r+'cr. The colony cheers!'+(Object.keys(G.bundles).length==BUNDLES.length?' ALL BUNDLES DONE - New Cydonia is thriving thanks to you!':''))}else{toast('Missing items');sfx('bad');bundleMenu()}}}));
 o.push({t:'Leave'});say('Community Board','Help the colony grow. Rewards in credits.',o)}
// ---------- NPCs ----------
function schedFor(n,h){if(G.spouse==n.id){return h<9||h>=21?['home',7,3]:h<17?['farm',9,8]:['home',3,4]}let e=n.sched[0];for(const s of n.sched)if(h>=s[0])e=s;return[e[1],e[2],e[3]]}
function placeNPCs(snap){const h=Math.floor(G.time/60);for(const n of NPCS){const[z,x,y]=schedFor(n,h);let r=npcRT[n.id];if(!r)r=npcRT[n.id]={x:x*T+8,y:y*T+8,dir:2,f:0,zone:z};
 if(r.zone!=z||snap&&r.zone!=G.zone){r.zone=z;r.x=x*T+8;r.y=y*T+8}r.hx=x*T+8;r.hy=y*T+8;if(r.zone=='home'&&G.spouse!=n.id)r.zone='away'}}
function heartsCap(n){return n.mar&&!G.dating[n.id]&&G.spouse!=n.id?8:10}
function addHearts(n,v){G.hearts[n.id]=Math.max(0,Math.min(heartsCap(n),G.hearts[n.id]+v))}
function talk(n){const r=npcRT[n.id];r.dir=Math.abs(G.px-r.x)>Math.abs(G.py-r.y)?(G.px>r.x?1:3):(G.py>r.y?2:0);sfx('talk');
 const h=G.hearts[n.id],key=n.id+G.day;
 for(const lv of[3,6,9])if(h>=lv&&n.ev[lv]&&!G.events[n.id+lv]){G.events[n.id+lv]=1;say(n.n+' ♥ Event',n.ev[lv],[{t:'♥',f:()=>{sfx('heart');addHearts(n,.5);if(n.id=='mo'&&lv==6){G.maxEn+=10}}}],n.look);return}
 const opts=[{t:'Chat',f:()=>chat(n)}];const s=cur();if(s&&!ITEMS[s[0]].tool)opts.push({t:'Give '+ITEMS[s[0]].n,f:()=>gift(n)});opts.push({t:'Bye'});
 const greet=G.spouse==n.id?['Hey, love.','There you are! I missed you.','Welcome home, farmer.'][G.day%3]:h<2?'Oh, hello.':h<5?'Hey, good to see you!':h<8?'Hi! I was hoping you\'d come by.':'*smiles brightly* Hi you.';
 say(n.n,greet,opts,n.look)}
function chat(n){const key=n.id+G.day,first=!G.talked[key];if(first){G.talked[key]=1;addHearts(n,.4)}
 let l;if(G.spouse==n.id){l=[["Morning! I watered a few crops for you.","Don't overdo it on the surface, okay?"],["I love our little dome life.","Remember our wedding? The whole plaza glowed."],["Let's watch Phobos rise tonight.","You're the best thing that happened to me on Mars."]][G.day%3];if(first){G.energy=Math.min(G.maxEn,G.energy+15);sfx('heart')}}
 else{const tier=Math.min(3,Math.floor(G.hearts[n.id]/2.5)),ls=n.lines[tier];l=[ls[G.day%ls.length]];if(n.season&&n.season[season()]&&G.day%2)l.push(n.season[season()])}
 say(n.n,l,null,n.look)}
function gift(n){const s=cur(),id=s[0],key=n.id+G.day;
 if(id=='bouquet'){if(!n.mar){say(n.n,"Flowers? That's sweet, but I'm happily single.",null,n.look);return}if(G.hearts[n.id]<8){say(n.n,'Oh... I think we should get to know each other better first.',null,n.look);return}
  take(G.sel);G.dating[n.id]=1;sfx('heart');say(n.n,['...For me? You mean... like, DATING?','*'+n.n+' laughs and hugs you tight*','Yes! Absolutely yes.'],null,n.look);return}
 if(id=='pendant'){if(!G.dating[n.id]){say(n.n,'A pendant? We should be dating first...',null,n.look);return}if(G.hearts[n.id]<10){say(n.n,'I love you, but... give us a little more time. (10 hearts)',null,n.look);return}
  take(G.sel);G.spouse=n.id;G.wedDay=G.day;sfx('wed');say('Wedding',['You kneel in the neon plaza and offer the Red Pendant.',n.n.toUpperCase()+': "Yes! A thousand times yes!"','The next morning, all of New Cydonia gathers under the dome. Old Mo cries. Dr. Ruiz throws Glowberry petals.',n.n+' moves into your habitat. Your spouse will help on the farm and cheer you on each sol. ♥'],null,n.look);return}
 if(G.gifted[key]){say(n.n,'You already gave me something today!',null,n.look);return}
 take(G.sel);G.gifted[key]=1;const lk=n.likes.includes(id),ht=n.hates.includes(id);addHearts(n,lk?1.5:ht?-.5:.5);if(lk)sfx('heart');
 say(n.n,lk?'I LOVE this! How did you know?':ht?'Uh... thanks? Not really my thing.':'Thanks, that\'s thoughtful.',null,n.look)}
// ---------- day cycle ----------
function sleep(passed){sfx('sleep');let earn=0;for(const[i,q]of G.ship)earn+=ITEMS[i].v*q;G.ship=[];G.money+=earn;
 const oldS=seasonIdx();let grew=0,wilted=0,died=0;
 for(const k in G.tiles){const t=G.tiles[k];if(t.c){if(t.w){t.g++;t.dry=0;grew++}else{t.dry++;if(t.dry>=3){t.c=null;t.g=0;died++}else if(t.dry==2)wilted++}}t.w=0}
 G.day++;const ns=seasonIdx();let killed=0;if(ns!=oldS)for(const k in G.tiles){const t=G.tiles[k];if(t.c&&!CROPS[t.c].s.includes(ns)){t.c=null;killed++}}
 // morning: sprinklers, robot, spouse
 let sp=0;for(const k in G.objs){const[x,y]=k.split(',').map(Number),q=G.objs[k]=='qspr';for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){if(!a&&!b||(!q&&a&&b))continue;const t=G.tiles[(x+a)+','+(y+b)];if(t){t.w=1;t.dry=0;sp++}}}
 let r=0;for(const k in G.tiles){const t=G.tiles[k];if(t.c&&!t.w&&r<3){t.w=1;t.dry=0;r++}}
 let spouseMsg='';if(G.spouse){const sn=NPCS.find(q=>q.id==G.spouse),roll=G.day%3;if(roll==0){for(const k in G.tiles)if(G.tiles[k].c){G.tiles[k].w=1;G.tiles[k].dry=0}spouseMsg=sn.n+' watered all the crops before you woke up.'}else if(roll==1){add(sn.id=='kai'?'pie':'stew');spouseMsg=sn.n+' cooked you something. Check your bag!'}else{add(sn.id=='ava'?'crys':'coffee',2);spouseMsg=sn.n+' left a gift by the bed.'}}
 G.time=360;G.energy=passed?Math.round(G.maxEn*.6):G.maxEn;G.hp=100;G.o2=100;G.zone='home';G.px=8*T+8;G.py=3*T+8;G.dir=2;ENTS=[];SURF=genSurface();PR=[];G.talked={};G.gifted={};
 for(const id in npcRT)delete npcRT[id];placeNPCs(true);save(true);
 const pg=[(passed?'You collapsed from exhaustion and a drone carried you home. ':'')+'Sol '+G.day+' - '+season()+' season, Year '+year()+'.','Shipping earned '+earn+'cr. '+(grew?grew+' crops grew. ':'')+(r?'R0-V3R watered '+r+'. ':'')+(sp?'Sprinklers watered '+sp+'. ':'')];
 if(wilted||died)pg.push((wilted?wilted+' crops are wilting - water them! ':'')+(died?died+' crops withered away.':''));
 if(ns!=oldS)pg.push('A new season begins: '+season()+'!'+(killed?' '+killed+' out-of-season crops died.':'')+' New seeds are at Supply & Tech.');
 if(spouseMsg)pg.push(spouseMsg);say('Good morning',pg)}
