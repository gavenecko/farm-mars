// Farm Mars v10 - season-1 balance trim, Cydonia Museum (donations + rewards), dust storms with Dust Wraiths and Storm Glass,
// Magma Vents mine floors (6-10) with Ember Beetles, fishing treasure chests + perfect catches + Storm Glassfish, more NPC talk, tap-to-talk
// ---------- balance (tools/econ_sim.py: strong player ~2,100cr end of season 1, was ~3,700 in the model) ----------
{const nv={pot:43,let:27,wht:23};for(const k in nv){CROPS[k].v=nv[k];if(ITEMS[k])ITEMS[k].v=nv[k];if(ITEMS[k+'_s'])ITEMS[k+'_s'].v=Math.round(nv[k]*1.25);if(ITEMS[k+'_g'])ITEMS[k+'_g'].v=Math.round(nv[k]*1.6)}}
// ---------- new items ----------
Object.assign(ITEMS,{sglass:{n:'Storm Glass',v:180,c:'#ffd9a0',d:'Sand fused into glass by a dust storm. Only found during storms.'},
 efos:{n:'Ember Fossil',v:420,c:'#ff7a3a',d:'A fossil baked inside volcanic rock, from the Magma Vents.'},
 sglf:{n:'Storm Glassfish',v:340,c:'#ffe0b0',food:40,d:'Rises to the surface only during dust storms.'},
 statue:{n:'Curator Statue',v:0,c:'#ffd23a',d:'A golden statue for completing the museum.'}});
FISH.sglf={n:'Storm Glassfish',v:340,c:'#ffe0b0',zone:.17,spd:2.8};
BUGS.wraith={hp:7,spd:.7,dmg:9,c:'#b0785a',c2:'#ffd0a0',drop:'sglass'};
BUGS.ember={hp:10,spd:.5,dmg:12,c:'#7a2a18',c2:'#ffa040',drop:'chit'};
SOLID.add('C');SOLID.add('Y');
// ---------- museum ----------
const MUSE={min:['iron','cob','crys','pla','jasp','opal','frz','metor','rshard','hgem','core','wcore'],art:['rel1','rel2','rel3','rel4','rel5','rel6','sglass','efos'],
 fish:['carp','eel','koi','dgud','bfin','ipik','sray','brine','cryp','sglf']};
const MALL=[...MUSE.min,...MUSE.art,...MUSE.fish];
const MREW=[[5,'money',300,'300cr'],[10,'qspr',2,'2 Quality Sprinklers'],[15,'rGlow',1,'a Glow Ring'],[20,'s_stf',5,'5 Starfruit Seeds'],[25,'money',1500,'1500cr'],[MALL.length,'statue',1,'the golden Curator Statue + 5000cr']];
{const c=MAPS.city;for(let y=9;y<=11;y++)for(let x=23;x<=28;x++)c[y][x]='H';c[11][25]='D'}
MAPS.museum=fromStr(['wwwwwwwwwwwwww','wCCCCooooCCCCw','woooooooooooow','wCooCooooCooCw','woooooooooooow','woooooocooooow','woooooooooooow','wwwwwwDwwwwwww']);
DOORS['city:25,11']=['museum',6,6];EXITS.museum=['city',25,12];
DZ.museum=['#3a2a2a','#2e2020','#ffd27a','#241818'];
const EXTRA_SPAWNS=[['city',25,12],['museum',6,6]];
// move a few city schedule spots off the new building
for(const n of NPCS){for(const s of n.sched){if(s[1]!='city')continue;if(n.id=='zara'&&s[2]==26&&s[3]==12){s[2]=28;s[3]=13}if(n.id=='zara'&&s[2]==26&&s[3]==9){s[2]=30;s[3]=9}if(n.id=='pip'&&s[2]==25&&s[3]==13){s[2]=21;s[3]=14}}}
if(typeof FEST!='undefined'){FEST.zara=[24,13];}
const mus=()=>{if(!G.muse)G.muse={};return G.muse},mcount=()=>Object.keys(mus()).filter(k=>MALL.includes(k)).length;
function museumMenu(pg=0){const have=MALL.filter(id=>!mus()[id]&&cnt(id)>0),o=[];const per=4,sl=have.slice(pg*per,pg*per+per);
 for(const id of sl)o.push({t:'Donate '+ITEMS[id].n,f:()=>donate(id,pg)});if(have.length>(pg+1)*per)o.push({t:'More...',f:()=>museumMenu(pg+1)});
 o.push({t:'View collection',f:()=>museumView()},{t:'Leave'});const n=mcount(),nx=MREW.find(r=>r[0]>n);
 say('Cydonia Museum',[(theoIn()?'THEO: "Every stone and fish tells us something about this planet."':'A curator drone hums politely.')+'\nDonations: '+n+'/'+MALL.length+(nx?' - next reward at '+nx[0]+': '+nx[3]:' - collection complete!')+(have.length?'':'\nNothing new to donate in your bag.')],o);modal.ch=999}
function donate(id,pg){if(!cnt(id)||mus()[id])return;rem(id,1);mus()[id]=G.day;sfx('coin');parts(G.px,G.py-12,ITEMS[id].c,12,1.4);floatTxt(G.px,G.py-26,'Donated '+ITEMS[id].n,'#ffd27a');addXP('forage',10);
 const n=mcount();for(const[k,it,q,nm]of MREW)if(n==k&&!(G.museR||{})[k]){G.museR=G.museR||{};G.museR[k]=1;if(it=='money')G.money+=q;else add(it,q);if(it=='statue')G.money+=5000;sfx('wed');
  say('Cydonia Museum',[n+' donations! The colony thanks you.','Reward: '+nm+'.'],[{t:'Back',f:()=>museumMenu(pg)}]);checkAch();return}checkAch();museumMenu(pg)}
function museumView(){const L=(nm,a)=>nm+' '+a.filter(i=>mus()[i]).length+'/'+a.length+': '+a.map(i=>mus()[i]?ITEMS[i].n:'???').join(', ');
 say('Collection',[L('MINERALS',MUSE.min),L('ARTIFACTS',MUSE.art),L('FISH',MUSE.fish)],[{t:'Back',f:()=>museumMenu()}])}
const theoIn=()=>npcRT.theo&&npcRT.theo.zone=='museum';
{const _sf=schedFor;schedFor=function(n,h){if(n.id=='theo'&&h>=10&&h<13&&G.spouse!=n.id&&!isFestival()&&G.day%7!=0)return['museum',10,4];return _sf(n,h)}}
// ---------- weather: dust storms ----------
{const _rw=rollWeather;rollWeather=function(){const m=_rw();if(m||G.day<3||isFestival())return m;if(Math.random()<.13&&season()!='Bloom'){G.wx='dust';DUSTD=-1;return 'DUST STORM! Red sand is howling across the surface today. Air runs thin outside and Dust Wraiths roam the plains - but storms leave rare Storm Glass behind, and Storm Glassfish rise in the reservoir.'}return m}}
let DUSTD=-1,DUSTP=[];
const dusty=()=>G&&G.wx=='dust'&&(G.zone=='surf'||G.zone=='valles');
function dustSpawn(){if(G.wx!='dust'||G.zone!='surf'||DUSTD==G.day)return;DUSTD=G.day;const m=MAPS.surf;let n=0,g=0;
 while(n<10&&g++<500){const x=2+Math.floor(Math.random()*60),y=2+Math.floor(Math.random()*40),t=m[y][x];if(t!='r'||Math.abs(x-31.5)<5&&y>34)continue;
  const X=x*T+8,Y=y*T+8;if(ENTS.some(e=>Math.hypot(e.x-X,e.y-Y)<20))continue;ENTS.push(n<6?{k:'plant',t:'sglass',x:X,y:Y}:mkBug('wraith',X,Y,1));n++}storeE()}
{const _e=enter;enter=function(z,x,y,d){_e(z,x,y,d);if(z=='surf')dustSpawn()}}
// ---------- Magma Vents (mine floors 6-10) ----------
const isMag=()=>G.zone=='mine'&&MINE&&MINE.mag;
{const _gm=genMine;genMine=function(f){const M=_gm(f);if(f>=6&&f<=10&&!M.boss){M.mag=1;M.vents=[];const m=M.m;let s=f*7717+3;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  for(let y=0;y<m.length;y++)for(let x=0;x<m[0].length;x++)if(m[y][x]=='m')m[y][x]='E';
  for(let i=0,g=0;i<6&&g<300;g++){const x=6+Math.floor(r()*(m[0].length-8)),y=4+Math.floor(r()*(m.length-6));if(m[y][x]!='E'||M.E.some(e=>Math.abs(e.x-(x*T+8))<24&&Math.abs(e.y-(y*T+8))<24))continue;m[y][x]='Y';M.vents.push([x,y]);i++}
  let k=0;for(const e of M.E)if(e.k=='bug'&&k++%2==0){e.t='ember';e.hp=e.max=Math.round(BUGS.ember.hp*(1+f*.15))}
  if(!M.E.some(e=>e.t=='ember')){M.E.push(mkBug('ember',(m[0].length-6)*T+8,(m.length-6)*T+8,f))}}return M}}
{const _em=enterMine;enterMine=function(f){_em(f);if(MINE&&MINE.mag&&!(G.seen||{}).mag){G.seen=G.seen||{};G.seen.mag=1;say('Magma Vents',['Heat rolls up from the floor. Basalt glows orange through the cracks.','Ember Beetles live here - they spit fire, but their shells sometimes hold Ember Fossils. (Floors 6-10)'])}}}
// ---------- enemy AI for new types ----------
{const _h=hostile;hostile=function(){_h();for(const e of ENTS){if(e.k!='bug'||e.dead)continue;if(e.t!='wraith'&&e.t!='ember')continue;const b=BUGS[e.t],d=Math.hypot(G.px-e.x,G.py-e.y),a=Math.atan2(G.py-e.y,G.px-e.x);
  if(e.t=='wraith'){const sp=b.spd*(d<140?1:0);const w=Math.sin(e.tm/20)*.6,mx=Math.cos(a+w)*sp,my=Math.sin(a+w)*sp;if(!solidAt(e.x+mx,e.y))e.x+=mx;if(!solidAt(e.x,e.y+my))e.y+=my}
  else{if(d<120){const mx=Math.cos(a)*b.spd,my=Math.sin(a)*b.spd;if(!solidAt(e.x+mx,e.y))e.x+=mx;if(!solidAt(e.x,e.y+my))e.y+=my}if(d<150&&e.tm%150==75){for(const o of[-.35,0,.35])shoot(e,a+o,1.5,8)}}}}}
{const _k=killBug;killBug=function(e){_k(e);if(e.t=='ember'&&Math.random()<.22){add('efos');floatTxt(e.x,e.y-20,'+Ember Fossil!','#ff9a5a');sfx('coin')}if(e.t=='wraith'){G.stats.wraith=(G.stats.wraith||0)+1}}}
// O2 drains faster in a dust storm
{const _u=update;update=function(){_u();if(!G||TITLE||modal||menu||CUT)return;if(dusty()&&tick%110==0)G.o2=Math.max(0,G.o2-1);
  if(dusty()){if(DUSTP.length<90)DUSTP.push({x:Math.random()*W,y:Math.random()*H,v:2+Math.random()*3,l:Math.random()*8+4});for(const p of DUSTP){p.x+=p.v;p.y+=p.v*.18;if(p.x>W+10){p.x=-10;p.y=Math.random()*H}}}}}
// ---------- fishing: treasure, perfect catch, storm glassfish ----------
{const _pf=pickFish;pickFish=function(){if(G.wx=='dust'&&G.zone=='farm'&&Math.random()<.3)return 'sglf';return _pf()}}
{const _fa=fishAct;fishAct=function(){const was=FISHING&&FISHING.ph;_fa();const f=FISHING;if(was=='bite'&&f&&f.ph=='reel'){f.miss=0;if(Math.random()<.3)f.tr={p:.15+Math.random()*.7,got:0,done:0}}}}
{const _uf=updFish;updFish=function(){const f=FISHING;_uf();if(!FISHING||FISHING.ph!='reel')return;const g=FISHING;const inz=g.fp>=g.bar&&g.fp<=g.bar+g.bw;if(!inz)g.miss=(g.miss||0)+1;
  if(g.tr&&!g.tr.done){if(g.tr.p>=g.bar&&g.tr.p<=g.bar+g.bw){g.tr.got++;if(g.tr.got>=70){g.tr.done=1;sfx('coin');floatTxt(G.px,G.py-30,'Treasure!','#ffd27a')}}}}}
const TREAS=[['jasp',2],['opal',1],['metor',2],['crys',3],['gel',2],['s_mel',3],['cob',3],['medkit',1]];
{const _fw=fishWin;fishWin=function(){const f=FISHING,k=f&&f.k,tr=f&&f.tr&&f.tr.done,perf=f&&(f.miss||0)<15;_fw();if(!k)return;
  if(perf){add(k);addXP('fish',12);floatTxt(G.px,G.py-38,'PERFECT! +1 '+FISH[k].n,'#ffd27a');G.stats.perfect=(G.stats.perfect||0)+1}
  if(tr){const r=TREAS[Math.floor(Math.random()*TREAS.length)];if(Math.random()<.12){const rl='rel'+(1+Math.floor(Math.random()*6));add(rl);toast('Treasure chest: '+ITEMS[rl].n+'!')}else{add(r[0],r[1]);toast('Treasure chest: '+r[1]+'x '+ITEMS[r[0]].n)}G.stats.treasure=(G.stats.treasure||0)+1}checkAch()}}
{const _df=drawFish;drawFish=function(ox,oy){_df(ox,oy);const f=FISHING;if(!f||f.ph!='reel'||!f.tr||f.tr.done)return;const X=W-120,Y=34,h=110,ty=Y+h-f.tr.p*h-5;
  R(X-6,ty,10,8,'#7a4a1a');R(X-6,ty,10,3,'#c8862a');R(X-2,ty+3,2,2,'#ffd23a');if(tick%20<10)R(X-5,ty+1,1,1,'#fff');R(X-7,ty+10,12,2,'#300');R(X-7,ty+10,12*Math.min(1,f.tr.got/70),2,'#ffd23a')}}
// ---------- NPC talk: storm + museum lines ----------
const DUSTL={ava:"Storm days I double-check every dome seal. Twice. Stay inside if you can.",kai:"Dust storm means a full bar tonight. Nobody wants to be outside.",ruiz:"If you go out in this storm, carry an extra O2 canister. Doctor's orders.",
 mo:"Storms shake loose glass on the plains. Shiny stuff. Worth a fortune at the museum.",zara:"All shuttles grounded. I hate sitting still.",theo:"The storm hides the stars, but the glass it leaves behind is beautiful.",
 vega:"Storm protocol is in effect. Keep the airlocks closed, folks.",pip:"Can we go see the Dust Wraiths? Mom says no. Mom always says no."};
const MUSL={ava:"I saw your name on the museum donor wall. Fancy.",kai:"Theo won't stop talking about your donations. Seriously.",ruiz:"The museum has better fossils than my textbooks now. Thanks to you.",
 mo:"Saw that ore you gave the museum. I mined rocks like that before you were born.",zara:"If you find anything weird out there, the museum's the place. Not my cockpit.",theo:"Every piece you bring fills in a page of this planet's story. Keep going.",
 vega:"The museum gets more visitors than city hall now. I'm not jealous.",pip:"I went to the museum! The fish one is my favorite. It looks grumpy."};
const MAGL={mo:"Floors 6 to 10 run hot - Magma Vents. Ember Beetles spit fire, so keep moving.",ruiz:"Burns from the Magma Vents? I've treated three this week. Dodge-roll, please."};
{const _c=chat;chat=function(n){const key=n.id+G.day;if(!G.talked[key]&&!isFestival()&&G.spouse!=n.id){let l=null;
  if(G.wx=='dust'&&DUSTL[n.id])l=DUSTL[n.id];else if(MAGL[n.id]&&G.deep>=6&&!(G.seen||{})['mag'+n.id]&&G.deep<=12){G.seen=G.seen||{};G.seen['mag'+n.id]=1;l=MAGL[n.id]}else if(mcount()>=3&&(G.day+n.id.length)%4==0&&MUSL[n.id])l=MUSL[n.id];
  if(l){G.talked[key]=1;addHearts(n,.4);emote(n.id,'note');say(n.n,[l],null,n.look);return}}return _c(n)}}
// ---------- interaction ----------
{const _i=interact;interact=function(){if(G&&!modal&&G.zone=='museum'&&!nearNPC()){const[fx,fy]=facingTile(),t=tileAt(fx,fy);if(t=='C'||t=='c'){museumMenu();sfx('menu');return}}return _i()}}
{const _a=act;act=function(){if(G&&!modal&&G.zone=='museum'&&!FISHING){const[fx,fy]=facingTile(),t=tileAt(fx,fy);if(t=='C'||t=='c'){museumMenu();sfx('menu');return}}return _a()}}
// tap-to-talk: tap an NPC who is close to you
{const _ot=onTap;onTap=function(x,y){if(G&&!TITLE&&!modal&&!menu&&!CUT&&!MINI&&!FLY&&!FISHING){const m=curMap(),mw=m[0].length*T,mh=m.length*T;let ox=Math.round(CAM.x),oy=Math.round(CAM.y);if(mw<W)ox=Math.round(-(W-mw)/2);if(mh<H)oy=Math.round(-(H-mh)/2);
  const wx=x+ox,wy=y+oy;for(const n of NPCS){const r=npcRT[n.id];if(!r||r.zone!=G.zone)continue;if(Math.hypot(wx-r.x,wy-(r.y-10))<14&&Math.hypot(G.px-r.x,G.py-r.y)<56){talk(n);return true}}}return _ot(x,y)}}
// ---------- art ----------
{const _dt=drawTile;drawTile=function(g,z,t,v){if(z=='mine'&&(t=='E'||t=='Y')){px(g,0,0,T,T,'#2a1612');let s=v*97+5;const r=()=>(s=(s*16807)%2147483647)%T;for(let i=0;i<10;i++)px(g,r(),r(),1,1,'#3e2018');
  if(v==1){px(g,3,7,6,1,'#ff5a1a');px(g,8,8,4,1,'#ff5a1a');px(g,5,6,2,1,'#ffb04a')}if(v==2){px(g,10,3,1,5,'#c83a10');px(g,11,7,3,1,'#c83a10')}
  if(t=='Y'){px(g,1,2,14,13,'#140a08');px(g,2,1,12,3,'#3a1a10');px(g,4,5,8,6,'#ff4a10');px(g,5,6,6,4,'#ffa030');px(g,7,7,2,2,'#fff0a0')}return}
  if(z=='museum'&&t=='C'){px(g,0,0,T,T,'#3a2a2a');return}_dt(g,z,t,v)}}
{const _dp=drawPlant;drawPlant=function(e,X,Y){if(e.t!='sglass')return _dp(e,X,Y);const g=Math.sin(tick/12+e.x)*.5+.5;R(X-5,Y+1,10,3,'#0004');
  cx.fillStyle='#ffd9a0';cx.beginPath();cx.moveTo(X-4,Y+1);cx.lineTo(X-1,Y-9);cx.lineTo(X+2,Y+1);cx.fill();cx.fillStyle='#ffb070';cx.beginPath();cx.moveTo(X+1,Y+1);cx.lineTo(X+4,Y-5);cx.lineTo(X+6,Y+1);cx.fill();
  R(X-2,Y-6,1,4,'#fff');if(g>.6)R(X-1,Y-11-g*2,1,1,'#fff');light(X,Y-4,14,'#ffc080')}}
{const _db=drawBug;drawBug=function(e,X,Y){const b=BUGS[e.t];if(e.t=='wraith'){const f=tick/8+e.x;cx.globalAlpha=e.hit?1:.75+.2*Math.sin(f);
  for(let i=0;i<14;i++){const a=f+i*.8,r=2+i*.55;R(X+Math.cos(a)*r,Y-2-i*1.3+Math.sin(a)*r*.4,3,2,e.hit?'#fff':i%3?b.c:b.c2)}ob(cx,X-4,Y-20,8,7,e.hit?'#fff':'#6a3a2a');R(X-3,Y-18,2,2,'#ffe060');R(X+1,Y-18,2,2,'#ffe060');cx.globalAlpha=1}
  else if(e.t=='ember'){const fr=Math.floor(tick/6)%2,c=e.hit?'#fff':b.c;R(X-7,Y+2,14,3,'#0006');for(let i=0;i<3;i++){R(X-9,Y-4+i*3+fr,3,1,'#5a2a1a');R(X+6,Y-4+i*3+(1-fr),3,1,'#5a2a1a')}
   ob(cx,X-6,Y-9,12,10,c);R(X-6,Y-9,12,2,'#5a2a1a');const gl=e.tm%150>55&&e.tm%150<75;R(X-4,Y-6,3,1,gl?'#fff0a0':b.c2);R(X+1,Y-4,4,1,b.c2);R(X-1,Y-8,1,6,b.c2);R(X-3,Y-11,2,2,'#ff3a1a');R(X+1,Y-11,2,2,'#ff3a1a');light(X,Y-4,gl?26:16,'#ff6a1a')}
  else return _db(e,X,Y);if(e.hp<e.max){R(X-6,Y-24,12,2,'#300');R(X-6,Y-24,12*e.hp/e.max,2,'#f44')}}}
{const _ds=drawStructures;drawStructures=function(ox,oy,D){_ds(ox,oy,D);const z=G.zone,night=G.time>=1140||G.time<390;
 if(z=='city'){const X=23*T-ox,Y=9*T-oy-14,w=6*T,h=3*T+14;if(!(X>W||X+w<0||Y>H||Y+h<-30)){D.push([11*T-oy+T,()=>{R(X+4,Y+h,w,5,'#0005');R(X,Y+10,w,h-10,'#e8dcc0');for(let i=0;i<w;i+=16)R(X+i+2,Y+18,5,h-20,'#d0c4a8'),R(X+i+2,Y+18,5,2,'#fff8');
   cx.fillStyle='#b8a888';cx.beginPath();cx.moveTo(X-4,Y+12);cx.lineTo(X+w/2,Y-8);cx.lineTo(X+w+4,Y+12);cx.fill();R(X-4,Y+10,w+8,3,'#8a7a5a');R(X+w/2-10,Y,20,7,'#0a0610');txt('MUSEUM',X+w/2,Y+6,'#ffd27a',6,'center',0);light(X+w/2,Y+3,30,'#ffd27a');
   for(const wx of[10,w-24])R(X+wx,Y+24,14,12,night?'#ffd890':'#8ac8e8');doorAnim(25,11,ox,oy,'#ffd27a')}])}}
 if(z=='museum'){const m=curMap();let ci=0;const items=MALL.filter(i=>mus()[i]);for(let y=0;y<m.length;y++)for(let x=0;x<m[0].length;x++){if(m[y][x]!='C')continue;const X=x*T-ox,Y=y*T-oy,idx=ci++;
   D.push([Y+T,()=>{R(X,Y+6,T,10,'#6a4a2a');R(X,Y+6,T,2,'#a07040');R(X+1,Y-6,14,13,'#9ad8ff30');R(X+1,Y-6,14,1,'#e8f8ff');R(X+1,Y-6,1,13,'#e8f8ff80');
    for(let j=0;j<3;j++){const id=items[idx*3+j];if(!id)continue;cx.save();cx.translate(X+(j-1)*4,Y-6);cx.scale(.5,.5);drawIcon(cx,id,8,4);cx.restore()}if((tick+idx*13)%120<4)R(X+11,Y-4,2,2,'#fff')}])}
   const X=7*T-ox,Y=5*T-oy;D.push([Y+T,()=>{R(X-2,Y-4,T+4,4,'#ffd27a');txt(mcount()+'/'+MALL.length,X+8,Y-6,'#ffd27a',6,'center')}]);light(X+8,Y,30,'#ffd27a');
   if(G.museR&&G.museR[MALL.length]){const X=11*T-ox,Y=5*T-oy;D.push([Y+T,()=>{R(X+3,Y+8,10,6,'#8a6a2a');ob(cx,X+5,Y-6,6,14,'#ffd23a');R(X+6,Y-9,4,4,'#ffd23a');R(X+6,Y-5,1,8,'#fff8')}]);light(X+8,Y,24,'#ffd23a')}}
 if(isMag()&&MINE.vents)for(const[x,y]of MINE.vents){const X=x*T-ox+8,Y=y*T-oy+8;if(X<-30||X>W+30||Y<-30||Y>H+30)continue;light(X,Y,30+Math.sin(tick/9+x)*4,'#ff5a1a');if((tick+x*11)%24<2)parts(x*T+8,y*T+4,'#ff8a3a',1,.4)}}}
{const _d=draw;draw=function(){_d();if(!G||TITLE||CRED||CUT)return;if(dusty()){cx.fillStyle='rgba(170,80,30,.34)';cx.fillRect(0,0,W,H);for(let i=0;i<DUSTP.length;i++){const p=DUSTP[i];R(p.x,p.y,p.l,i%3?1:2,i%4?'#ffc890aa':'#fff0d0cc')}
  const g=cx.createRadialGradient(W/2,H/2,60,W/2,H/2,W*.62);g.addColorStop(0,'rgba(80,30,10,0)');g.addColorStop(1,'rgba(90,35,10,.75)');cx.fillStyle=g;cx.fillRect(0,0,W,H);if(tick%300<120)txt('DUST STORM - O2 draining faster',W/2,H-62,'#ffd0a0',7,'center')}}}
{const _di=drawIcon;drawIcon=function(g,id,X,Y){if(id=='sglass'){px(g,X+4,Y+3,3,11,'#ffd9a0');px(g,X+8,Y+6,3,8,'#ffb070');px(g,X+5,Y+4,1,6,'#fff');return}
  if(id=='efos'){ob(g,X+2,Y+4,12,9,'#5a2a1a');px(g,X+5,Y+6,6,1,'#ff7a3a');px(g,X+4,Y+8,1,3,'#ff7a3a');px(g,X+6,Y+8,1,3,'#ff7a3a');px(g,X+8,Y+8,1,3,'#ff7a3a');px(g,X+10,Y+8,1,2,'#ff7a3a');return}
  if(id=='sglf'){ob(g,X+3,Y+6,9,5,'#ffe0b0');px(g,X+12,Y+5,3,7,'#ffb070');px(g,X+5,Y+7,1,1,'#000');px(g,X+4,Y+6,6,1,'#fff');return}
  if(id=='statue'){px(g,X+4,Y+12,8,3,'#8a6a2a');ob(g,X+6,Y+3,4,9,'#ffd23a');px(g,X+6,Y+1,4,3,'#ffd23a');return}_di(g,id,X,Y)}}
ACH.push(['muse5','Patron','Donate 5 items to the museum',g=>Object.keys(g.muse||{}).length>=5],['museAll','Curator','Complete the museum collection',g=>Object.keys(g.muse||{}).length>=MALL.length],
 ['wraith','Storm Chaser','Defeat 5 Dust Wraiths',g=>(g.stats.wraith||0)>=5],['treasure','Lucky Line','Reel in 3 fishing treasures',g=>(g.stats.treasure||0)>=3],['perfect','Perfectionist','Land 10 perfect catches',g=>(g.stats.perfect||0)>=10]);
LETTERS.push(['museum','Theo','The Museum is Open',"The Cydonia Museum opened in the plaza! Bring minerals, artifacts and fish - every donation helps us understand Mars. There are rewards for donors.",g=>g.day>=5],
 ['storms','Ava','Dust Storm Safety','When a dust storm hits, air runs out faster outside. But the storms leave Storm Glass behind... and Mo swears Dust Wraiths drop it too.',g=>g.day>=8]);
window.FM10={MUSE,MALL,MREW,museumMenu,donate,museumView,mcount,dustSpawn,DUSTL,MUSL,isMag,TREAS};
