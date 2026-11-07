// Farm Mars v21 - Phobos Station expansion (Nyx + Low-G Drift), Storm Derby race, Cydonia Springs spa, new CGs
(()=>{
// ---------- items & furniture ----------
Object.assign(ITEMS,{
 snowg:{n:'Phobos Snowglobe',v:0,c:'#9ad0ff',d:'Mars swirls inside. Hang it at home.'},
 mrock:{n:'Moon Rock',v:80,c:'#b0b8c8',d:'A pebble from Phobos. Makes a fine gift.'},
 zgtea:{n:'Zero-G Tea',v:60,c:'#7affc8',food:40,d:'Floats in the cup. Somehow still warm.'},
 bathb:{n:'Bath Bomb',v:40,c:'#ff9ad0',d:'Fizzes turquoise in the Springs.'},
 ticket:{n:'Derby Ribbon',v:0,c:'#ffd23a',d:'Proof you finished the Storm Derby.'},
});
FURN.snowg={n:'Phobos Snowglobe',p:0,x:7,y:0,fest:1};
FURN.lantern=FURN.lantern||{n:'Ice Lantern',p:0,x:5,y:2,fest:1};

// ---------- Nyx (Phobos station keeper) ----------
const NYX={id:'nyx',n:'Nyx',look:{skin:'#c8a090',hair:'#1a2a4a',style:'bob',top:'#2a4a7a',pants:'#1a2030',acc:'#3af0ff'},
 likes:['mrock','pice','meteorite','crys','zgtea'],hates:['let'],
 sched:[[6,'h_nyx',3,3],[8,'phobos',5,5],[10,'phobos',14,4],[14,'phobos',5,5],[18,'phobos',20,5],[22,'h_nyx',3,3]],
 lines:[["NYX: Station ops. Call me Nyx. Don't float into the bulkheads. $n","Gravity is a suggestion up here. Watch your step - or don't. $n"],
  ["NYX: Mars looks soft from this window. Don't believe it. $t","I trade belt ice for gossip. Which do you want? $h"],
  ["NYX: Most colonists visit once, take a photo, leave. You keep coming back. $h","Careful. The station gets lonely enough without favorites. $l"],
  ["NYX: Stay for the next Earthrise. I'll make tea. Zero-G tea. It... tries. $l","Don't look at me like that. The tea is serious business. $h"]],
 season:{Storm:"Storm season grounds every shuttle. Quiet shifts. I hate quiet. $a",Frost:"Frost nights make the stars feel closer. Come look sometime. $t"},
 ev:{3:["Nyx hands you a tether clip. $n","NYX: Rookies forget. Clip in before you look out the big window. $n","NYX: ...Not that you're a rook. You just look like you'd forget. $h"],
  6:["The observation deck is empty except for Nyx and a slowly spinning mug. $n","NYX: I used to think I'd go back to Earth. Then I watched Mars wake up under us. $s","NYX: Don't tell Vega I said the dome looks small from here. $t"],
  9:["Nyx floats a Moon Rock into your palm. $n","NYX: From the far side. I climbed out to get it. Stupid, honestly. $h","NYX: Keep it. So you remember there's more sky than the dome. $l"]}};
if(!NPCS.find(n=>n.id=='nyx')){NPCS.push(NYX);BDAY.nyx=[3,4];FEST.nyx=[16,12]}
if(window.FM15&&FM15.WHO&&!FM15.WHO.includes('nyx'))FM15.WHO.push('nyx');
if(typeof EYE=='object'){} // chibi eyes use default

// ---------- Nyx bunk on Phobos ----------
HOMES.nyx={door:[22,3],out:[22,4],n:"Nyx's Bunk",pal:['#2a3450','#222840','#3af0ff','#101428'],bed:[1,1,'#2a4a7a'],sit:[3,3],
 f:[['desk',6,1,3,1,'#3a4a6a'],['window',8,0,2,0],['rug',3,3,4,3,'#1a3a6a'],['locker',10,5,1,1,'#4a5a70']],
 read:['window','Through a tiny porthole: nothing but stars, and the curve of Mars far below.'],
 home:["Welcome to the bunk. Mind the floating socks. $n","Station housing. Closet-sized. Perfect. $h","Tea? $l"],
 ev:["Nyx dims the cabin lights. Mars fills the porthole. $n","NYX: \"Some people need dirt under their boots. I need this view. ...And maybe company.\" $l"]};
{const h=HOMES.nyx,z=HOMEZ('nyx'),rows=[];for(let y=0;y<8;y++){let r='';for(let x=0;x<12;x++)r+=(y==0||x==0||x==11)?'w':(y==7?(x==5?'D':'w'):'o');rows.push(r)}
 const m=fromStr(rows);m[7]=m[7].map((c,x)=>x==5?'D':'w');
 const solid=(x,y,w,hh)=>{for(let j=0;j<hh;j++)for(let i=0;i<w;i++)if(m[y+j]&&m[y+j][x+i]=='o')m[y+j][x+i]='x'};
 solid(h.bed[0],h.bed[1],2,2);for(const f of h.f)if(f[0]!='rug'&&f[4]>0)solid(f[1],f[2],f[3],f[4]);
 MAPS[z]=m;DZ[z]=h.pal;window.HOMEN[z]=h.n;EXITS[z]=['phobos',h.out[0],h.out[1]];
 h.orbital=1;window.NYXBUNK=h}

// ---------- Expand Phobos Station ----------
MAPS.phobos=fromStr([
"wwwwwwwwwwwwwwwwwwwwwwwwwwww",
"wsssswwwwwwkkkkkkwwwwsssssw",
"wooooooooooooooooooooooooow",
"woooooooooooooooooooooDoooow",
"wooooooooooooooooooooooooow",
"woooorrrrrroooooorrrrrrooow",
"wooeoooooooooooooooooohooow",
"wooooooototooooooototooooow",
"wooooooooooooooooooooooooow",
"wooooooooooggggooooooooooow",
"wooooooooooggggooooooooooow",
"wooooooooooooooooooooooooow",
"wwwwwwwwwwwwDwwwwwwwwwwwwww"]);
// door from bunk already EXITS; add door tile link on phobos
DOORS['phobos:22,3']=['h_nyx',5,6];
DOORS['phobos:12,12']=['port',6,6];
EXITS.phobos=['port',6,6];
// Prefer specific DOORS entries over zone EXITS (Phobos bunk / exit), but never bypass home locks
{const _tr=triggers;triggers=function(){const tx=Math.floor(G.px/T),ty=Math.floor((G.py-2)/T),t=tileAt(tx,ty),z=G.zone;
 if(t=='D'){const key=z+':'+tx+','+ty,d=DOORS[key];
  if(d){if(z=='city'){for(const id in HOMES){const h=HOMES[id];if(h.door[0]==tx&&h.door[1]==ty)return _tr()}} // let v12 handle locks
   enter(d[0],d[1],d[2],0);return}}
 return _tr()}}

// keep DZ
DZ.phobos=DZ.phobos||['#3a4050','#30364a','#9ad0ff','#1a2030'];

// Low-G floor tiles 'g' walkable
{const _is=isSolid;isSolid=function(zone,t){if(zone=='phobos'&&t=='g')return false;return _is(zone,t)}}

// ---------- Cydonia Springs ----------
MAPS.springs=fromStr([
"wwwwwwwwwwwwwwww",
"wsssssoooooosssw",
"woooooooooooooow",
"woooccccooooooow",
"woooooooooooooow",
"wooooppppppoooow",
"wooooppppppoooow",
"wooooppppppoooow",
"woooooooooooooow",
"wootooooooottoow",
"woooooooooooooow",
"wwwwwwwwDwwwwwww"]);
DZ.springs=['#3a2a28','#2e221f','#7affc8','#1a1210'];
// garden door into springs (east habitat garden)
MAPS.city[19][26]='D';
DOORS['city:26,19']=['springs',8,10];
EXITS.springs=['city',26,20];
// pool tiles 'p' in springs: walkable water
{const _is=isSolid;isSolid=function(zone,t){if(zone=='springs'&&t=='p')return false;if(zone=='phobos'&&t=='g')return false;return _is(zone,t)}}

if(window.HOMEN)HOMEN.h_nyx="Nyx's Bunk";
if(window.FM17){/* ZN patched in setTab */}

// ---------- Low-G Drift Catch minigame ----------
let LG=null;
function lgStart(){modal=null;LG={t:0,x:W/2,y:H/2,vx:0,vy:0,tx:W/2,ty:H/2,it:[],sc:0,combo:0,over:0,dur:1500,fx:[]};sfx('shoot')}
function lgStep(){const s=LG;if(s.over){s.over++;return}s.t++;
 const dx=s.tx-s.x,dy=s.ty-s.y;s.vx=s.vx*.92+Math.max(-2.2,Math.min(2.2,dx*.04));s.vy=s.vy*.92+Math.max(-2.2,Math.min(2.2,dy*.04));
 s.x=Math.max(70,Math.min(W-70,s.x+s.vx));s.y=Math.max(36,Math.min(H-36,s.y+s.vy));
 const lv=s.t/s.dur,rate=Math.max(12,28-lv*14);
 if(s.t%Math.round(rate)==0){const r=Math.random(),side=Math.floor(Math.random()*4);let x,y,vx,vy;
  if(side==0){x=70+Math.random()*(W-140);y=30;vx=(Math.random()-.5)*1.2;vy=.7+lv}else if(side==1){x=70+Math.random()*(W-140);y=H-30;vx=(Math.random()-.5)*1.2;vy=-(.7+lv)}
  else if(side==2){x=70;y=40+Math.random()*(H-80);vx=.7+lv;vy=(Math.random()-.5)*1.2}else{x=W-70;y=40+Math.random()*(H-80);vx=-(.7+lv);vy=(Math.random()-.5)*1.2}
  s.it.push({x,y,vx,vy,k:r<.12?'gold':r<.3+lv*.1?'junk':'rock',w:0})}
 for(const i of s.it){i.x+=i.vx;i.y+=i.vy;i.w++;if(!i.d&&Math.hypot(i.x-s.x,i.y-s.y)<14){i.d=1;if(i.k=='junk'){s.combo=0;s.sc=Math.max(0,s.sc-2);sfx('bad');s.fx.push({x:i.x,y:i.y,t:0,s:'-2',c:'#f66'})}
  else{const pts=i.k=='gold'?3:1;s.sc+=pts;s.combo++;sfx(i.k=='gold'?'coin':'blip');s.fx.push({x:i.x,y:i.y,t:0,s:'+'+pts,c:i.k=='gold'?'#ffd23a':'#9ad0ff'})}}}
 s.it=s.it.filter(i=>!i.d&&i.x>-20&&i.x<W+20&&i.y>-20&&i.y<H+20);for(const f of s.fx)f.t++;s.fx=s.fx.filter(f=>f.t<30);
 if(s.t>=s.dur){s.over=1;G.lgHi=Math.max(G.lgHi||0,s.sc);G.stats.lgPlays=(G.stats.lgPlays||0)+1;G.mrock=(G.mrock||0);const n=Math.min(5,1+Math.floor(s.sc/12));for(let i=0;i<n;i++)add('mrock');
  let bonus='';if(s.sc>=35){G.lgPrize=G.lgPrize||{};const y=year()+'-'+seasonIdx();if(!G.lgPrize[y]){G.lgPrize[y]=1;add('snowg');G.decor=G.decor||{};G.decor.snowg=1;bonus=' +Snowglobe decor!'}}
  s.msg=n+' Moon Rock'+(n==1?'':'s')+bonus;checkAch();sfx('wed')}}
function drawLG(){const s=LG;panel(56,8,W-112,H-16,'#050818','#5ad0ff');
 for(let i=0;i<50;i++){const x=60+hash(i,3)%(W-120),y=12+(hash(3,i)%(H-28)+s.t*(.04+i%3*.02))%(H-28);R(x,y,1,1,i%7?'#fff5':'#8cf8')}
 // Mars limb
 cx.fillStyle='#c44a2a44';cx.beginPath();cx.arc(W+40,H/2,120,0,6.3);cx.fill();
 for(const i of s.it){if(i.k=='junk'){R(i.x-3,i.y-3,6,6,'#6a3a2a');R(i.x-2,i.y-5,4,3,'#fa4')}
  else if(i.k=='gold'){R(i.x-2,i.y-2,4,4,'#ffd23a');R(i.x-1,i.y-1,2,2,'#fff')}
  else{R(i.x-3,i.y-2,6,5,'#a8b0c0');R(i.x-2,i.y-1,2,2,'#d0d8e8')}}
 const bx=Math.round(s.x),by=Math.round(s.y);R(bx-6,by-4,12,8,'#c8d0e0');R(bx-4,by-2,8,4,'#7cf');R(bx-8,by,3,2,'#3af');R(bx+5,by,3,2,'#3af'); // player suit
 for(const f of s.fx)txt(f.s,f.x,f.y-f.t*.5,f.c,7,'center');
 txt('LOW-G DRIFT',W/2,22,'#9ad0ff',8,'center');txt('Score '+s.sc+(s.combo>=8?'  COMBO x'+s.combo:''),72,22,'#fff',6);txt(Math.max(0,Math.ceil((s.dur-s.t)/60))+'s',W-72,22,'#ffd23a',6,'right');
 if(s.t<120&&!s.over)txt('Tap to drift! Catch rocks, dodge junk.',W/2,H/2,'#fff',6,'center');
 if(s.over){panel(W/2-84,H/2-24,168,48,'#0a1020f0','#5ad0ff');txt('TIME! Score '+s.sc,W/2,H/2-8,'#9ad0ff',8,'center');txt(s.msg||'',W/2,H/2+6,'#ffd23a',6,'center');if(s.over>40)txt('tap to continue',W/2,H/2+18,'#aaa',6,'center')}}
function lgEnd(){LG=null;phobosAct()}

// ---------- Storm Derby race ----------
let DERBY=null;
function derbyStart(){modal=null;G.feast=G.day;DERBY={t:0,x:W/2,tx:W/2,k:0,lane:1,dist:0,spd:2.2,obs:[],rival:[],place:1,over:0,len:2400,boost:0,fx:[]};
 for(let i=0;i<3;i++)DERBY.rival.push({x:80+i*70,lane:i%3,dist:-40-i*80,spd:2+Math.random()*.4,c:['#ff6a3a','#3aff9a','#6aa8ff'][i],n:['Zara','Pip','Theo'][i]});
 sfx('shoot')}
function derbyStep(){const d=DERBY;if(d.over){d.over++;return}d.t++;
 if(d.k)d.tx=d.x+d.k*28;d.x+=Math.max(-4,Math.min(4,d.tx-d.x));d.x=Math.max(64,Math.min(W-64,d.x));
 d.lane=Math.max(0,Math.min(2,Math.round((d.x-80)/((W-160)/2))));
 const boost=d.boost>0?(d.boost--,1.7):1;d.spd=2.2+d.dist/d.len*1.4;d.dist+=d.spd*boost;
 if(d.t%Math.max(10,26-Math.floor(d.dist/200))==0){const lane=Math.floor(Math.random()*3);d.obs.push({lane,y:-10,r:6+Math.random()*5,kind:Math.random()<.18?'boost':'rock'})}
 for(const o of d.obs){o.y+=d.spd*boost*1.1;const lx=80+o.lane*((W-160)/2);if(!o.hit&&o.y>H-50&&o.y<H-28&&Math.abs(d.x-lx)<18){o.hit=1;if(o.kind=='boost'){d.boost=45;sfx('coin');d.fx.push({x:d.x,y:H-40,t:0,s:'BOOST',c:'#7affc8'})}
  else{d.spd*=.55;sfx('hurt');typeof shake=='function'&&shake(3,0);d.fx.push({x:d.x,y:H-40,t:0,s:'HIT',c:'#f66'})}}}
 d.obs=d.obs.filter(o=>o.y<H+20);
 for(const r of d.rival){r.dist+=r.spd*(.95+Math.sin(d.t/40+r.x)*.08);r.x=80+r.lane*((W-160)/2)+Math.sin(d.t/25+r.x)*.0;if(Math.random()<.01)r.lane=Math.max(0,Math.min(2,r.lane+(Math.random()<.5?-1:1)))}
 d.place=1+d.rival.filter(r=>r.dist>d.dist).length;
 for(const f of d.fx)f.t++;d.fx=d.fx.filter(f=>f.t<28);
 if(d.dist>=d.len){d.over=1;const prize=[1500,700,300,100][Math.min(3,d.place-1)];G.money+=prize;G.derbyHi=Math.min(G.derbyHi||99,d.place);G.stats.derby=(G.stats.derby||0)+1;add('ticket');
  for(const n of NPCS)if(['zara','pip','theo','vega'].includes(n.id))addHearts(n,.4);d.msg='Place #'+d.place+'  +'+prize+'cr';checkAch();sfx(d.place==1?'wed':'coin')}}
function drawDerby(){const d=DERBY;panel(48,6,W-96,H-12,'#1a0a08','#ff8a3a');
 // track
 for(let i=0;i<12;i++){const y=((d.dist*1.5+i*20)%(H-40))+16;R(70,y,W-140,2,'#0004')}
 for(let L=0;L<3;L++){const x=80+L*((W-160)/2);R(x-16,14,32,H-28,L==1?'#5a2a1844':'#3a1a1044')}
 for(const o of d.obs){const x=80+o.lane*((W-160)/2);if(o.kind=='boost'){R(x-8,o.y,16,10,'#7affc888');txt('>>',x,o.y+8,'#7affc8',7,'center')}else{R(x-6,o.y,12,10,'#6a3a2a');R(x-4,o.y-4,8,5,'#9a5a3a')}}
 for(const r of d.rival){const y=H-48-(r.dist-d.dist)*.35;if(y<20||y>H-10)continue;const x=80+r.lane*((W-160)/2);R(x-8,y,16,10,r.c);R(x-6,y+2,4,4,'#222');R(x+2,y+2,4,4,'#222');txt(r.n[0],x,y-2,'#fff',6,'center')}
 const px=Math.round(d.x),py=H-42;R(px-9,py,18,11,d.boost?'#ffd27a':'#e8e0d0');R(px-7,py+2,5,5,'#222');R(px+2,py+2,5,5,'#222');R(px-3,py-4,6,5,'#7cf');
 for(const f of d.fx)txt(f.s,f.x,f.y-f.t*.5,f.c,7,'center');
 txt('STORM DERBY',W/2,20,'#ffd27a',8,'center');txt('#'+d.place,72,20,'#fff',7);txt(Math.min(100,Math.floor(d.dist/d.len*100))+'%',W-72,20,'#ff8a3a',7,'right');
 if(d.t<100&&!d.over)txt('Steer ←/→ or tap  ·  hit green BOOST pads',W/2,H/2,'#fff',6,'center');
 if(d.over){panel(W/2-90,H/2-28,180,54,'#140808f0','#ffd23a');txt(d.place==1?'YOU WIN!':'FINISH #'+d.place,W/2,H/2-10,'#ffd23a',9,'center');txt(d.msg||'',W/2,H/2+6,'#fff',7,'center');if(d.over>40)txt('tap to continue',W/2,H/2+20,'#aaa',6,'center')}}
function derbyEnd(){const p=G.derbyHi;if(window.FMEV)FMEV('derby',p);DERBY=null;const pg=[p==1?'You take first place! The crowd (and Pip) go wild.':'You finish the dusty track. Ribbons and cheers all around.','A Derby Ribbon is pinned to your jacket.'];if(window.FM16)FM16.showCG('derby','Storm Derby',pg);else say('Storm Derby',pg)}

// ---------- override Storm Derby festival ----------
{const _fa=festAct;festAct=function(){const s=seasonIdx();if(s!=3)return _fa();G.fests=G.fests||{};G.fests[s]=1;G.feast=G.day;
 say('Storm Derby',['Rovers line up under a bruised Storm-season sky. Dust already stings your teeth.'],[
  {t:'Race it yourself!',f:derbyStart},
  {t:'Bet 200cr on a racer (pays 3x)',f:()=>{const rc=[['Zara\'s "Red Comet"',.45],['Pip\'s "Junkbot 9000"',.3],['Theo\'s "Stargazer"',.25]];
   say('Storm Derby','Pick a racer:',rc.map(([n,p])=>({t:n,f:()=>{if(G.money<200){toast('Not enough credits');return}G.money-=200;let r=Math.random(),w=rc.length-1;for(let k=0,acc=0;k<rc.length;k++){acc+=rc[k][1];if(r<acc){w=k;break}}const win=rc[w][0]==n;if(win)G.money+=600;sfx(win?'coin':'bad');checkAch();say('Storm Derby',[rc[w][0]+' wins!',win?'Your bet pays 600cr!':'Better luck next storm.'])}})).concat([{t:'Back',f:()=>festAct()}]))}},
  {t:'Just watch',f:()=>{checkAch();say('Storm Derby','Rovers vanish into the dust. Pip\'s Junkbot loses a wheel and keeps going. Everyone cheers.')}}]);}}

// ---------- Phobos interactions ----------
function phobosAct(){const nyx=npcRT.nyx&&npcRT.nyx.zone=='phobos';
 say('Phobos Station',[nyx?'NYX: "Welcome aboard. Exchange, Drift gym, or just stare at Mars - your call."':'The station hums. An automated attendant blinks.'],[
  {t:'Phobos Exchange',f:exchMenu2},{t:'Low-G Drift Catch (free)',f:lgStart},
  {t:'Observation deck',f:()=>{if(window.FM16)FM16.showCG('phobos','Phobos Station',['Mars fills the window - too big to hold in one look.','Somewhere down there, your farm is a green speck.'],()=>phobosLog());else phobosLog()}},
  {t:'Leave'}]);modal.ch=999}
function exchMenu2(){say('Phobos Exchange',['"Rare goods from the outer belt. Credits only. Nyx takes a cut."'],[
 {t:'Rift Key - 1800cr',f:()=>{ITEMS.riftkey.p=1800;buy('riftkey');exchMenu2()}},
 {t:'Starfruit Seeds - 200cr',f:()=>{buy('s_stf');exchMenu2()}},
 {t:'Phobos Ice (+70 energy) - 90cr',f:()=>{buy('pice');exchMenu2()}},
 {t:'Zero-G Tea - 70cr',f:()=>{ITEMS.zgtea.p=70;buy('zgtea');exchMenu2()}},
 {t:'Moon Rock gift - 100cr',f:()=>{ITEMS.mrock.p=100;buy('mrock');exchMenu2()}},
 {t:'Phobos Snowglobe (decor) - 400cr',f:()=>{if(G.decor&&G.decor.snowg){toast('Already displayed at home');return exchMenu2()}if(G.money<400){toast('Not enough credits');sfx('bad');return}G.money-=400;G.decor=G.decor||{};G.decor.snowg=1;sfx('coin');checkAch();toast('Snowglobe hung at home');exchMenu2()}},
 {t:'Back',f:phobosAct}]);modal.ch=999}
exchMenu=exchMenu2;

{const _pa=phobosArrive;phobosArrive=function(){_pa();
 // re-enter expanded map at better spawn if first time already said
 if(G.phob===1&&G.stats.phobos===1){/* first visit dialogue already shown */}
 else if(G.zone=='phobos'){/* ok */}
 // nudge spawn into open floor
 if(G.zone=='phobos'){G.px=14*T+8;G.py=8*T+8}}}

// ---------- Springs spa ----------
function springsMenu(){const inPool=tileAt(Math.floor(G.px/T),Math.floor(G.py/T))=='p';
 const o=[];
 if(inPool)o.push({t:'Soak (restore energy, HP, O2)',f:soak});
 o.push({t:'Buy Bath Bomb - 50cr',f:()=>{ITEMS.bathb.p=50;buy('bathb');springsMenu()}});
 const dateable=NPCS.filter(n=>n.mar&&(G.spouse==n.id||(G.dating&&G.dating[n.id])||(G.hearts[n.id]||0)>=6));
 if(dateable.length)o.push({t:'Invite someone to soak…',f:()=>say('Cydonia Springs','Who do you invite?',dateable.map(n=>({t:n.n,f:()=>springDate(n)})).concat([{t:'Back',f:springsMenu}]))});
 o.push({t:'Leave'});
 say('Cydonia Springs',['Geothermal pools bubble under grow-lights. Steam smells faintly of iron and mint.',inPool?'You\'re standing in the warm water.':'Step into the turquoise pool to soak.'],o);modal.ch=999}
function soak(){if(G.springDay==G.day&&!(G.dbgSandbox)){toast('Once per day is enough - your fingers are prunes');return springsMenu()}
 G.springDay=G.day;G.energy=G.maxEn;G.hp=G.maxHp||100;G.o2=100;G.stats.soaks=(G.stats.soaks||0)+1;
 if(cnt('bathb')>0){rem('bathb',1);G.energy=Math.min(G.maxEn+20,G.energy+20);toast('Bath Bomb fizzes! +bonus energy');sfx('wed')}else sfx('heart');
 parts(G.px,G.py-8,'#7affc8',16);checkAch();
 if(window.FM16)FM16.showCG('springs','Cydonia Springs',['Warm water. Soft steam. For a minute the colony\'s noise is far away.','You feel new.'],()=>{});else say('Cydonia Springs',['Ahh. Perfect.']);}
function springDate(n){modal=null;addHearts(n,1.2);G.springDay=G.day;G.energy=G.maxEn;G.hp=G.maxHp||100;G.o2=100;sfx('heart');
 const lines={ava:['AVA: "I almost fell asleep. Don\'t tell the reactor."','She leans on your shoulder. The water glows between you.'],
  kai:['KAI: "Okay this is better than any latte."','Kai hums a little cafe tune under the steam.'],
  zara:['ZARA: "Don\'t splash me. ...Okay, splash me a little."','She laughs, neon earrings fogging up.'],
  theo:['THEO: "The steam makes the stars blur. I don\'t mind."','Theo\'s glasses mist. He doesn\'t wipe them.']};
 const pg=(lines[n.id]||[n.n+': "This is nice."','You soak together until the lanterns dim.']).slice();
 if(window.FM16)FM16.showCG('springs',n.n+' · Springs Date',pg,null);else say(n.n+' · Springs Date',pg,null,n.look)}

// ---------- wire interact/act ----------
{const _in=interact;interact=function(){const[fx,fy]=facingTile(),t=tileAt(fx,fy),z=G.zone;
 if(z=='phobos'&&(t=='c'||t=='e'||t=='h'||t=='k'||t=='g')){phobosAct();return}
 if(z=='springs'&&(t=='c'||t=='p'||t=='s')){springsMenu();return}
 return _in()}}
{const _a=act;act=function(){const[fx,fy]=facingTile(),t=tileAt(fx,fy),z=G.zone;
 if(z=='phobos'&&'cehkg'.includes(t)&&t&&!nearNPC()){phobosAct();return}
 if(z=='springs'&&'cps'.includes(t)&&t&&!nearNPC()){springsMenu();return}
 // soak if standing in pool
 if(z=='springs'&&tileAt(Math.floor(G.px/T),Math.floor(G.py/T))=='p'&&!nearNPC()){springsMenu();return}
 return _a()}}

// ---------- schedule: Zara sometimes on Phobos ----------
{const _sf=schedFor;schedFor=function(n,h){const r=_sf(n,h);if(G.spouse==n.id||(isFestival()&&h>=9&&h<16))return r;
 if(n.id=='zara'&&h>=11&&h<14&&G.port&&G.day%5==2)return['phobos',8,6];
 if(n.id=='theo'&&h>=15&&h<17&&G.port&&G.day%6==1)return['phobos',16,3];
 if(n.id=='nyx'){if(h>=22||h<8)return['h_nyx',3,3];return r}
 return r}}

// ---------- draw: snowglobe, springs water, phobos gym glow, derby/LG overlays ----------
{const _dI=drawInterior;drawInterior=function(ox,oy,D,night){_dI(ox,oy,D,night);const z=G.zone,O=(x,y)=>[x*T-ox,y*T-oy];
 if(z=='home'&&G.decor&&G.decor.snowg){const[X,Y]=O(7,0);D.push([Y+T,()=>{R(X+4,Y+2,8,8,'#9ad0ff88');R(X+5,Y+3,6,6,'#c44a2a');R(X+6,Y+6,2,2,'#3a8');R(X+3,Y+9,10,2,'#d8d0c0')}])}
 if(z=='springs'){for(let y=5;y<=7;y++)for(let x=5;x<=10;x++){if(MAPS.springs[y][x]!='p')continue;const[X,Y]=O(x,y);const wob=Math.sin(tick/18+x+y)*1;
  R(X,Y+2,T,T-2,'#1a6a7a');R(X+1,Y+3+wob,T-2,T-5,'#3ad0c8aa');if((x+y+tick/10)%5<1)R(X+4,Y+4,2,2,'#eff')}
  light(8*T-ox,6*T-oy,50,'#7affc855')}
 if(z=='phobos'){for(let y=9;y<=10;y++)for(let x=11;x<=14;x++){if(MAPS.phobos[y][x]!='g')continue;const[X,Y]=O(x,y);R(X,Y,T,T,'#1a3050');R(X+2,Y+2,T-4,T-4,'#3af0ff22');if(tick%20<10)R(X+6,Y+6,4,4,'#3af0ff55')}
  // bunk door marker
  const[X,Y]=O(22,3);R(X+4,Y+2,8,12,'#2a4a7a');R(X+6,Y+6,4,6,'#1a2030');txt('NYX',X+8,Y, '#3af',5,'center')}}}

// ---------- game loop hooks for LG + DERBY ----------
{const _u=update;update=function(){if(LG){tick++;if(typeof padPoll=='function')padPoll();lgStep();if(LG.over>40&&DBG&&DBG.replay)lgEnd();return}if(DERBY){tick++;if(typeof padPoll=='function')padPoll();derbyStep();if(DERBY.over>40&&DBG&&DBG.replay)derbyEnd();return}return _u()}}
{const _d=draw;draw=function(){_d.apply(this,arguments);if(LG&&G&&!TITLE)drawLG();if(DERBY&&G&&!TITLE)drawDerby()}}
{const _ot=onTap;onTap=function(x,y){if(LG){if(LG.over>40)lgEnd();else if(!LG.over){LG.tx=x;LG.ty=y}return true}
 if(DERBY){if(DERBY.over>40)derbyEnd();else if(!DERBY.over)DERBY.tx=x;return true}return _ot(x,y)}}
addEventListener('keydown',e=>{if(!LG&&!DERBY)return;e.stopImmediatePropagation();const k=e.key.toLowerCase();
 if(LG){if(LG.over>40&&[' ','enter','e','escape'].includes(k)){lgEnd();return}if(!LG.over){if(k=='arrowleft'||k=='a')LG.tx=LG.x-40;if(k=='arrowright'||k=='d')LG.tx=LG.x+40;if(k=='arrowup'||k=='w')LG.ty=LG.y-40;if(k=='arrowdown'||k=='s')LG.ty=LG.y+40}}
 if(DERBY){if(DERBY.over>40&&[' ','enter','e','escape'].includes(k)){derbyEnd();return}if(k=='arrowleft'||k=='a')DERBY.k=-1;if(k=='arrowright'||k=='d')DERBY.k=1}},true);
addEventListener('keyup',e=>{if(!DERBY)return;const k=e.key.toLowerCase();if(['arrowleft','a','arrowright','d'].includes(k))DERBY.k=0},true);

// ---------- city label for springs door ----------
{const _dh=typeof drawHomes=='function'?null:null}
{const _ov=typeof overlays=='function'?overlays:null;/* label via drawInterior city hook */}
{const _di=drawInterior;/* already patched */}
// draw a small sign on city door for springs
{const _d=draw;draw=function(){_d.apply(this,arguments);if(!G||TITLE||LG||DERBY||G.zone!='city')return;
 const m=curMap(),mw=m[0].length*T,mh=m.length*T;let ox=Math.round(CAM.x),oy=Math.round(CAM.y);if(mw<W)ox=-(W-mw)/2;if(mh<H)oy=-(H-mh)/2;
 const X=26*T-ox,Y=19*T-oy;if(X>-20&&X<W&&Y>-20&&Y<H){R(X+2,Y-10,12,8,'#2a1a18');txt('SPA',X+8,Y-4,'#7affc8',5,'center')}}}

// ---------- ACH ----------
ACH.push(['lgdrift','Low-G Ace','Score 35+ in Low-G Drift',g=>(g.lgHi||0)>=35],
 ['derby1','Dust Champion','Win the Storm Derby',g=>(g.derbyHi||99)==1],
 ['springs','Pruned','Soak at Cydonia Springs 5 times',g=>(g.stats&&g.stats.soaks||0)>=5],
 ['nyx6','Orbital Friend','Reach 6 ♥ with Nyx',g=>(g.hearts&&g.hearts.nyx||0)>=6]);

// ---------- CGs in album / debug ----------
if(window.FM17&&FM17.CGT)Object.assign(FM17.CGT,{phobos:'Phobos Earthrise',springs:'Cydonia Springs',derby:'Storm Derby'});
if(window.FM16){const _cg=FM16.cgLoad||null}

// ---------- Debug menu extensions ----------
if(window.FM17){
 const CGT=FM17.CGT;Object.assign(CGT,{phobos:'Phobos Earthrise',springs:'Cydonia Springs',derby:'Storm Derby'});
 const _st=FM17.setTab;
 FM17.setTab=function(t){_st(t);const el=document.getElementById('dbg');if(!el)return;const bd=el.querySelector('.bd');if(!bd)return;
  if(t=='Warp'){const row=document.createElement('div');row.className='row';row.style.marginTop='8px';
   for(const[lab,fn]of[['Cydonia Springs',()=>{FM17.closeDbg();modal=null;enter('springs',8,8,0)}],['Phobos Station',()=>{G.port=1;FM17.closeDbg();modal=null;enter('phobos',14,8,0)}],["Nyx's Bunk",()=>{FM17.closeDbg();modal=null;enter('h_nyx',5,4,0)}],['Low-G Drift',()=>{FM17.closeDbg();lgStart()}]]){const b=document.createElement('button');b.textContent=lab;b.onclick=fn;row.appendChild(b)}
   const h=document.createElement('h3');h.textContent='v21 locations';bd.appendChild(h);bd.appendChild(row)}
  if(t=='Events'){const row=document.createElement('div');row.className='row';
   for(const[lab,fn]of[['Storm Derby race',()=>FM17.replay(()=>{G.time=10*60;derbyStart()})],['Low-G Drift',()=>FM17.replay(()=>lgStart())],['Springs soak CG',()=>FM17.replay(()=>{if(window.FM16)FM16.showCG('springs','Cydonia Springs',['Warm water. Soft steam.'])})],['Phobos CG',()=>FM17.replay(()=>{if(window.FM16)FM16.showCG('phobos','Phobos Station',['Mars fills the window.'])})],['Springs date (spouse)',()=>FM17.replay(()=>{const n=NPCS.find(q=>q.id==(G.spouse||'ava'));springDate(n)})]]){const b=document.createElement('button');b.textContent=lab;b.onclick=fn;row.appendChild(b)}
   const h=document.createElement('h3');h.textContent='v21 events';bd.appendChild(h);bd.appendChild(row)}
  if(t=='Time'){const row=document.createElement('div');row.className='row';
   const b=document.createElement('button');b.textContent='Storm Derby day (sol 7 Storm)';b.onclick=()=>{const yr0=(year()-1)*28;G.day=yr0+3*7+7;G.time=10*60;G.feast=0;placeNPCs(true);FM17.closeDbg();enter('city',16,12,2)};row.appendChild(b);bd.appendChild(row)}
 }
}
// ---------- first-load hearts for Nyx ----------
{const _ld=load;load=function(){const r=_ld();if(G&&G.hearts&&G.hearts.nyx==null)G.hearts.nyx=0;return r}
 const _ng=newGame;newGame=function(){const g=_ng();g.hearts.nyx=g.hearts.nyx||0;return g}}

// ---------- version chip ----------
{const _d=draw;draw=function(){_d.apply(this,arguments);if(TITLE){txt('v25',W-18,H-6,'#ffb0d888',6,'right')}}}

// Skip city-door facade for orbital homes (Nyx)
{const _de=drawExtra;drawExtra=function(D,ox,oy,z){let door=null;if(z=='city'&&HOMES.nyx){door=HOMES.nyx.door;HOMES.nyx.door=[-99,-99]}
  try{return _de(D,ox,oy,z)}finally{if(door)HOMES.nyx.door=door}}}

window.FM18={lgStart,derbyStart,springsMenu,phobosAct,soak,springDate,NYX,get LG(){return LG},get DERBY(){return DERBY},state:()=>({lg:LG,derby:DERBY})};
})();
