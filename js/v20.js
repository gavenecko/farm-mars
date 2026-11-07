// ===== v23 (Release B): NPC routines & reactions, Earth letters, weird crops, Martian wildlife =====
(function(){
const hr=()=>Math.floor(G.time/60),wd=()=>G.day%7;
// ---------- walkability helpers ----------
function mapOf(z){return z==G.zone?curMap():MAPS[z]}
function walk(z,x,y){const m=mapOf(z);if(!m||y<1||x<1||y>=m.length-1||x>=m[0].length-1)return false;const t=m[y][x];return!isSolid(z,t)&&!'XDMuvPY'.includes(t)&&!(z=='farm'&&(G.objs[x+','+y]||(G.tiles[x+','+y]&&G.tiles[x+','+y].gi)))}
function nearFree(z,x,y){if(walk(z,x,y))return[x,y];for(let r=1;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++)if(walk(z,x+a,y+b))return[x+a,y+b];return[x,y]}
function bfs(z,sx,sy,gx,gy){if(!walk(z,gx,gy))return null;const prev={},q=[[sx,sy]];prev[sx+','+sy]=null;let i=0;while(i<q.length){const[x,y]=q[i++];if(x==gx&&y==gy){const p=[];let k=x+','+y;while(k&&k!=sx+','+sy){p.unshift(k.split(',').map(Number));k=prev[k]}return p}
 for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const k=(x+a)+','+(y+b);if(!(k in prev)&&walk(z,x+a,y+b)){prev[k]=x+','+y;q.push([x+a,y+b])}}}return null}
// door tile in zone z leading toward zone tz (or nearest door/edge exit); returns the walkable tile next to it
function doorFor(z,tz,fx,fy){const m=mapOf(z);if(!m)return null;let best=null,bd=1e9;
 for(let y=0;y<m.length;y++)for(let x=0;x<m[0].length;x++){const t=m[y][x];if(t!='D'&&t!='X')continue;const d=DOORS[z+':'+x+','+y],ex=EXITS[z];let pr=(d&&d[0]==tz)||(ex&&t=='D')?0:1000;
  const adj=[[x,y+1],[x,y-1],[x+1,y],[x-1,y]].find(([a,b])=>walk(z,a,b));if(!adj)continue;const s=pr+Math.hypot(x-fx,y-fy);if(s<bd){bd=s;best={door:[x,y],adj}}}return best}
// ---------- routines: weekly meetups & walks ----------
const ROUT=[
 {id:'lunch',n:'Cafe lunch',d:[1,3,5],h:[12,14],at:{kai:['cafe',7,4],mo:['cafe',8,4]},talk:['kai','mo',["Same table as always, Mo?","Best seat in the dome, son."]]},
 {id:'jog',n:'Morning jog',d:[2,4,6],h:[7,9],at:{ava:['city',12,16],zara:['city',14,16]},talk:['ava','zara',["Two more laps around the plaza!","Low gravity jogging is cheating and I love it."]]},
 {id:'plaza',n:'Plaza evening',d:[0,3,6],h:[18,20],at:{vega:['city',16,11],ruiz:['city',18,11],theo:['city',17,12]},talk:['vega','ruiz',["Council minutes are done. Want to look at stars?","Only if Theo brings the good telescope."]]},
 {id:'study',n:'Study session',d:[1,4],h:[15,17],at:{theo:['cc',10,4],pip:['cc',11,4]},talk:['theo','pip',["So what makes the sky red?","Dust! Iron dust! ...Do I get a sticker?"]]},
 {id:'market',n:'Market browse',d:[2,5],h:[10,12],at:{ruiz:['shop',4,4],kai:['shop',6,4]},talk:['ruiz','kai',["You're buying ALL the glowcaps?","Stew night. Don't judge me."]]}
];
const rActive=(r,h=hr(),d=wd())=>r.d.includes(d)&&h>=r.h[0]&&h<r.h[1];
function routineFor(id,h,d){for(const r of ROUT)if(r.at[id]&&rActive(r,h,d)&&MAPS[r.at[id][0]]){const[z,x,y]=r.at[id];const[a,b]=nearFree(z,x,y);return[z,a,b,r]}return null}
{const _sf=schedFor;schedFor=function(n,h){const r=_sf(n,h);if(G.spouse==n.id||(isFestival()&&h>=9&&h<16))return r;const q=routineFor(n.id,h,wd());return q?[q[0],q[1],q[2]]:r}}
// NPCs walk to/through doors instead of popping between zones in front of you
{const _pn=placeNPCs;placeNPCs=function(snap){const prev={};if(!snap)for(const id in npcRT){const r=npcRT[id];prev[id]={z:r.zone,x:r.x,y:r.y}}
 _pn.apply(this,arguments);trackRecent();if(snap)return;
 for(const id in npcRT){const r=npcRT[id],p=prev[id];if(!p)continue;const tx=Math.floor(r.hx/T),ty=Math.floor(r.hy/T);
  if(p.z==G.zone&&r.zone!=G.zone){const to=r.zone,dd=doorFor(G.zone,to=='away'?'city':to,Math.floor(p.x/T),Math.floor(p.y/T)),path=dd&&bfs(G.zone,Math.floor(p.x/T),Math.floor(p.y/T),dd.adj[0],dd.adj[1]);
   if(path){r.leave={z:to,x:r.hx,y:r.hy,door:dd.door,p:path};r.zone=G.zone;r.x=p.x;r.y=p.y;r.path=path}}
  else if(r.zone==G.zone&&p.z!=G.zone){const dd=doorFor(G.zone,p.z,tx,ty),path=dd&&bfs(G.zone,dd.adj[0],dd.adj[1],tx,ty);if(path){r.x=dd.adj[0]*T+8;r.y=dd.adj[1]*T+8;r.path=path;r.arrive=1;emote(id,'note')}}
  else if(r.zone==G.zone&&Math.hypot(r.x-r.hx,r.y-r.hy)>40){const path=bfs(G.zone,Math.floor(r.x/T),Math.floor(r.y/T),tx,ty);if(path)r.path=path}}}}
function npcTick(){for(const id in npcRT){const r=npcRT[id];if(r.leave&&r.leave.p&&r.leave.p.length&&r.path!==r.leave.p)r.path=r.leave.p;if(r.leave&&(!r.path||!r.path.length)){const L=r.leave;r.leave=null;r.zone=L.z;r.x=L.x;r.y=L.y;r.path=null;if(L.door)doorPuff(L.door)}}}
let PUFF=null;function doorPuff(d){PUFF={x:d[0],y:d[1],t:30,z:G.zone};sfx('door')}
// ---------- recent events & reactions ----------
function trackRecent(){if(!G)return;const R=G.rec=G.rec||{};if(G.wx=='dust')R.storm=G.day;if(G.wedDay&&G.spouse)R.wed=G.wedDay;
 const nd=Object.keys((G.oc&&G.oc.done)||{}).length+Object.keys(G.muse||{}).length;if(R.donN==null)R.donN=nd;if(nd>R.donN){R.don=G.day;R.donN=nd}}
const recentOf=()=>{const R=G.rec||{},o=[];if(R.storm!=null&&G.day-R.storm<=1)o.push('storm');if(R.wed!=null&&G.day-R.wed<=3)o.push('wed');if(R.don!=null&&G.day-R.don<=2)o.push('don');return o};
const REACT={
 storm:{ava:"That storm last night shredded two antenna struts. I love a challenge. $h",kai:"Storm days, everyone wants soup. I made forty liters. $h",ruiz:"The storm carried spores from the canyon. Fascinating, and also itchy. $t",mo:"Storms get in my knees. Forty years and they still do. $s",zara:"Grounded by the storm. I hate sitting still. $a",theo:"Did you hear the static during the storm? It almost sounded like singing. $t",vega:"Storm damage reports are on my desk. Thank you for staying safe out there. $n",pip:"The storm sounded like a giant cat purring on the dome! $h",nyx:"From orbit the storm looked like a red hurricane eating the plains. $t"},
 wed:{ava:"Still smiling about the wedding. You two looked so happy. $h",kai:"The wedding cake recipe is now a cafe classic. Thank you for the excuse. $h",ruiz:"A wedding! Even the plants seemed to bloom brighter that night. $l",mo:"Reminded me of my own wedding. Different planet, same nerves. $s",zara:"I flew a loop over the wedding. Did you see it? $h",theo:"I logged the stars visible during your wedding. For posterity. $l",vega:"Officiating your wedding was the best part of my term. $l",pip:"I caught the bouquet! Well. It hit me. Same thing. $h",nyx:"Watched the wedding feed from orbit. Congratulations, groundling. $h"},
 don:{ava:"Heard you donated to the restoration. The colony's lucky to have you. $h",kai:"Someone said you've been donating things. I'll name a muffin after you. $h",ruiz:"Your donations will help the next generation understand this place. $l",mo:"Giving back to the colony, huh? Your aunt would be proud. $s",zara:"Donations? Look at you, colony hero. $h",theo:"Every donation adds a line to Mars' history. Yours is getting long. $l",vega:"The council noticed your donations. Truly, thank you. $l",pip:"I donated a rock once! It was a regular rock. They kept it anyway. $h",nyx:"News of your donations reached the station. We're all impressed. $h"}};
const REACTP={storm:[['ava','zara',["That storm was something else.","I'd have flown through it if Vega let me."]],['mo','kai',["Storm's got my knees creaking.","Soup's on the house today, Mo."]]],
 wed:[['kai','ava',["Did you see the newlyweds at the plaza?","Cutest couple in the dome."]],['pip','vega',["When I grow up I want a wedding with a rocket.","Let's start with a cake."]]],
 don:[['vega','ruiz',["More donations came in today.","The Old Colony is breathing again."]],['theo','mo',["The museum's getting crowded.","Good. Mars should remember."]]]};
let INJ=[];function syncPairs(){if(typeof PAIRS=='undefined')return;for(const p of INJ){const i=PAIRS.indexOf(p);if(i>=0)PAIRS.splice(i,1)}INJ=[];if(!G)return;
 const add=p=>{INJ.push(p);PAIRS.unshift(p)};for(const r of ROUT)if(rActive(r))add(r.talk);for(const e of recentOf())for(const p of REACTP[e])add(p)}
{const _c=chat;chat=function(n){const first=!G.talked[n.id+G.day];_c.apply(this,arguments);if(!first||!modal||!modal.pages)return;G.rheard=G.rheard||{};
 for(const e of recentOf()){const k=e+(G.rec[e])+n.id;if(G.rheard[k]||!REACT[e][n.id]||G.spouse==n.id&&e=='wed')continue;G.rheard[k]=1;modal.pages.unshift(REACT[e][n.id]);break}
 const q=routineFor(n.id,hr(),wd());if(q&&!G.rheard['r'+q[3].id+G.day+n.id]){G.rheard['r'+q[3].id+G.day+n.id]=1;modal.pages.push({lunch:"I always have lunch here on these sols. Routine keeps me sane.",jog:"Jogging day! Want to join us next time?",plaza:"Evenings at the plaza are my favorite part of the week.",study:"Study session! Pip asks the best questions.",market:"Market day. Don't tell anyone how much I spend here."}[q[3].id])}}}
// ---------- Earth letters ----------
const E=()=>{G.earth=G.earth||{read:{},ch:{}};return G.earth};
const gav=()=>({cr:'the credits you sent',vid:'your video from the dome',lily:'the pressed Lumen Lily you sent',ltr:'your long letter'}[E().ch.earth2]||'your letter');
const EAR={
 earth1:{from:'Mom (Earth)',t:'Mail from home',cond:g=>g.day>=4,body:()=>"Sweetheart! Your Earth mail finally cleared quarantine. Everyone's well. Grandma Rosa asks every day if you've grown anything yet - she still keeps her sunflowers out back. Write when you can. Tell us how it really is up there.",
  ch:[['cheer','Write back: tell them about the farm',"You write about the dome, the first sprouts, the friends you've made. It feels good to brag a little."],['honest','Write back: admit it\'s lonely sometimes',"You write honestly about the long nights and the red quiet. It's a relief to say it out loud."]]},
 earth2:{from:'Teo (little brother)',t:'Grandma is in the hospital',cond:g=>(g.earth&&g.earth.read.earth1!=null&&g.day>=g.earth.read.earth1+4),cg:'earth1',body:()=>"Hey. Mom didn't want to worry you, but Grandma had a fall in the garden. She's in the hospital. She's okay-ish. She keeps asking about 'the Mars farm'. "+(E().ch.earth1=='honest'?"She said to tell you lonely is just what growing feels like.":"She made the nurses read your letter twice.")+" Could you send her something?",
  ch:[['cr','Send 1500cr for her care',"Transfer queued. It's not much from 225 million km, but it's something.",g=>g.money>=1500,g=>{g.money-=1500}],['vid','Record a video message from the dome',"You film the farm at dawn and say everything you never said at the airport."],['lily','Send a pressed Lumen Lily',"You press a glowing lily between two sheets of polymer. It still faintly shines.",g=>cnt('lum')>0,()=>rem('lum',1)],['ltr','Write a long letter',"You write until your hand cramps. Every page smells faintly of soil."]]},
 earth3:{from:'Grandma Rosa',t:'In her own handwriting',cond:g=>(g.earth&&g.earth.ch.earth2&&g.day>=g.earth.read.earth2+4),att:['s_sun',5],body:()=>"My dear farmer. Thank you for "+gav()+". I keep it beside me. The nurses think I'm very important now. I've tucked seeds from my sunflowers into this envelope. They're stubborn like you. Plant them where the light is kind and tell me if they bloom on Mars. - Rosa",
  ch:[['plant','Promise to plant them right away',"You hold the little seed packet a long time before writing back: I promise."],['keep','Promise to keep them safe',"You write back that you'll guard them like treasure until the perfect day."]]},
 earth4:{from:'Mom (Earth)',t:'Grandma Rosa',cond:g=>(g.earth&&g.earth.ch.earth3&&g.day>=g.earth.read.earth3+5),cg:'earth2',body:()=>"Sweetheart, I'm so sorry to tell you this in a letter. Grandma Rosa passed away peacefully on Sunday, in the morning, with the window open to her garden. She had "+gav()+" with her. She talked about your farm until the end. She was so proud.",
  ch:[['grow','Write back: "I\'ll make her garden grow here."',"You promise to grow her sunflowers under the dome. Somehow it feels like keeping her close."],['wish','Write back: "I wish I had been there."',"You write that you wish you'd been there. Mom writes back within an hour: 'She knew. She always knew.'"]]},
 earth5:{from:'Mom & Teo',t:'Sunflowers on two planets',cond:g=>(g.earth&&g.earth.ch.earth4&&(g.stats.sunH||0)>=1),cg:'earth3',att:['s_sun',10],body:()=>"We printed the photo of your sunflowers and put it on Grandma's porch, right next to her real ones. Two gardens, two planets. Teo says it's 'objectively the coolest thing anyone in this family has ever done'. More seeds enclosed - from her garden, for yours. We love you."}};
for(const id in EAR){const e=EAR[id];LETTERS.push([id,e.from,e.t,e.body(),e.cond,e.att])}
{const _rl=readLetter;readLetter=function(id){const e=EAR[id];if(!e)return _rl.apply(this,arguments);const L=LETTERS.find(l=>l[0]==id);L[3]=e.body();const er=E(),first=er.read[id]==null;if(first)er.read[id]=G.day;_rl.apply(this,arguments);
 let m=modal;if(e.ch&&!er.ch[id]){m.opts=e.ch.map(([k,t,res,ok,fx])=>({t:t+(ok&&!ok(G)?' (unavailable)':''),f:()=>{if(ok&&!ok(G)){sfx('bad');toast('Not possible right now');readLetter(id);return}if(fx)fx(G);er.ch[id]=k;sfx('heart');say('Your reply',[res],[{t:'Back to mailbox',f:()=>mailMenu()},{t:'Close'}]);mailCheck()}}))}
 if(id=='earth5'&&first){G.decor=G.decor||{};G.decor.rosa=1}
 if(e.cg&&first&&window.FM16)FM16.showCG(e.cg,e.from+': '+e.t,[e.body()],m)}}
{const _hv=harvest;harvest=function(k){const t=G.tiles[k],c=t&&t.c,r=_hv.apply(this,arguments);if(r&&c){G.stats.sunH=(G.stats.sunH||0)+(c=='sun'?1:0);if(c=='stc')G.stats.stcH=(G.stats.stcH||0)+1;if(c=='sun'&&G.earth&&G.earth.ch.earth4&&!(G.mail&&G.mail.got.earth5)){mailCheck();toast('A letter from Earth just arrived...')}}return r}}
// ---------- weird crops ----------
const stormy=()=>G.wx=='dust'||season()=='Storm';
{const _sm=seedMenu;seedMenu=function(){const s1=CROPS.sun.s,s2=CROPS.stc.s;CROPS.sun.s=[];if(!stormy())CROPS.stc.s=[];try{_sm.apply(this,arguments)}finally{CROPS.sun.s=s1;CROPS.stc.s=s2}}}
{const _sl=sleep;sleep=function(p){const st=stormy(),g0={};for(const k in G.tiles){const t=G.tiles[k];if(t.c=='stc')g0[k]=t.g}_sl.apply(this,arguments);let held=0;
 if(!st)for(const k in g0){const t=G.tiles[k];if(t.c=='stc'&&t.g>g0[k]){t.g=g0[k];held++}}const gi=formGiants();
 if(modal&&modal.pages){if(held)modal.pages.push(held+' Static Bloom'+(held>1?'s':'')+' waited for a storm and did not grow.');if(gi)modal.pages.push('Something HUGE happened in the field overnight: '+gi+' Giant Crater Gourd'+(gi>1?'s':'')+'!');const fx=foxMorning();if(fx)modal.pages.push(fx)}
 trackRecent();syncPairs();save(true)}}
function formGiants(force){G.giant=G.giant||{};let n=0;for(const k in G.tiles){const[x,y]=k.split(',').map(Number);let ok=true;
 for(let a=0;a<3&&ok;a++)for(let b=0;b<3&&ok;b++){const t=G.tiles[(x+a)+','+(y+b)];if(!t||t.c!='grd'||!mature(t)||t.gi)ok=false}
 if(!ok||!(force||G.dbgGiant||hash(G.day,x*37+y)%100<40))continue;for(let a=0;a<3;a++)for(let b=0;b<3;b++){const t=G.tiles[(x+a)+','+(y+b)];t.c=null;t.g=0;t.gi=k}G.giant[k]={c:'grd',x,y,d:G.day};n++}return n}
function giantAt(x,y){const t=G.tiles[x+','+y];return t&&t.gi&&G.giant&&G.giant[t.gi]?t.gi:null}
function chopGiant(k){if(!useEnergy(6))return;const g=G.giant[k];for(let a=0;a<3;a++)for(let b=0;b<3;b++){const t=G.tiles[(g.x+a)+','+(g.y+b)];if(t)delete t.gi}delete G.giant[k];add('grd',15);G.stats.giant=(G.stats.giant||0)+1;parts((g.x+1.5)*T,(g.y+1.5)*T,'#ff9a3a',30,1.6);shake&&shake(4);sfx('break');floatTxt((g.x+1.5)*T,g.y*T,'+15 Crater Gourd!','#ffd27a');checkAch()}
{const _a=act;act=function(){if(G.zone=='farm'&&!FISHING){const[fx,fy]=facingTile(),k=giantAt(fx,fy);if(k){chopGiant(k);return}}if(foxNear()&&cur()&&(ITEMS[cur()[0]].crop||ITEMS[cur()[0]].food)&&!G.fox?.ad){foxAct();return}return _a.apply(this,arguments)}}
{const _sa=solidAt;solidAt=function(px_,py_){if(G&&G.zone=='farm'&&G.giant){const x=Math.floor(px_/T),y=Math.floor(py_/T),t=G.tiles[x+','+y];if(t&&t.gi)return true}return _sa(px_,py_)}}
function drawGiant(X,Y){const b=Math.sin(tick/40)*.6,E=(x,y,rx,ry,c)=>{cx.fillStyle=c;cx.beginPath();cx.ellipse(Math.round(X+x),Math.round(Y+y+b),rx,ry,0,0,Math.PI*2);cx.fill()};E(24,42,23,5,'#0005');
 E(24,26,23,17,'#8a3a10');E(24,25,22,16,'#e0782a');for(const[o,w]of[[-14,7],[-5,8],[5,8],[14,7]])E(24+o,25,w,15,o<0?'#f08a3a':'#e87a2a');for(const o of[-10,0,10])R(X+24+o,Y+10+b,1,30,'#b0501a');E(16,17,6,4,'#ffc89088');E(14,15,2,2,'#fff8');
 R(X+22,Y+2+b,4,9,'#5a3a1a');E(30,9,7,3,'#5bbf3a');E(17,10,5,3,'#3a8a2a');R(X+31,Y+5+b,1,4,'#3a8a2a')}
// ---------- Martian wildlife: dust fox & ore-sniffer ----------
const FOXH=[35,38];let FOX=null,SN=null;
const fx_=()=>{G.fox=G.fox||{fed:0,day:-1,love:0};return G.fox},sn_=()=>{G.sniff=G.sniff||{iron:0,found:0};return G.sniff};
function foxRT(){const f=fx_();if(f.ad){if(G.zone=='mine'||G.zone=='phobos'||String(G.zone).startsWith('h_nyx'))return null;if(!FOX||FOX.z!=G.zone){FOX={z:G.zone,x:G.px+14,y:G.py+4,f:1,mv:0};if(solidAt(FOX.x,FOX.y)){FOX.x=G.px;FOX.y=G.py}}return FOX}
 if(G.zone!='surf')return null;if(!FOX||FOX.z!='surf'){const[a,b]=nearFree('surf',FOXH[0],FOXH[1]);FOX={z:'surf',x:a*T+8,y:b*T+8,hx:a*T+8,hy:b*T+8,f:1,mv:0}}return FOX}
function foxNear(){const p=foxRT();return p&&Math.hypot(p.x-G.px,p.y-G.py)<26}
function foxAct(){const f=fx_(),p=foxRT();if(f.ad){if(f.pet==G.day){floatTxt(p.x,p.y-14,f.n+' wags happily','#ffd');return}f.pet=G.day;f.love=Math.min(10,f.love+1);sfx('heart');parts(p.x,p.y-10,'#ffb070',8,1);floatTxt(p.x,p.y-16,'♥ '+f.n,'#ffb070');checkAch();return}
 const s=cur();if(!s||!(ITEMS[s[0]].crop||ITEMS[s[0]].food)){say('Dust Fox','A small rust-colored fox watches you from behind a rock, ears twitching. It looks hungry.'+(f.fed?' (Fed '+f.fed+'/3 sols)':'')+'\nHold a crop or some food and offer it.');return}
 if(f.day==G.day){floatTxt(p.x,p.y-14,'The fox is full today','#ffd');return}take(G.sel);f.fed++;f.day=G.day;sfx('heart');parts(p.x,p.y-8,'#ffb070',6,1);
 if(f.fed>=3){f.ad=1;f.n='Ember';f.love=3;checkAch();const pg=['The dust fox eats from your glove, then curls around your boots like it has always belonged there.','Ember the dust fox now follows you - even home. Pet her each sol (face her, press TALK/ACT). A happy fox digs up forage gifts.'];if(window.FM16)FM16.showCG('fox','A New Friend',pg);else say('A New Friend',pg)}
 else say('Dust Fox','The fox snatches the food and darts back a few steps... then sits and stares at you. ('+f.fed+'/3 sols - come back tomorrow)')}
function foxMorning(){const f=G.fox;if(!f||!f.ad)return'';FOX=null;if(f.love>=4&&hash(G.day,7)%100<45){const it=['glowcap','lily',G.terra>=1?'mclover':'glowcap','crys'][hash(G.day,3)%4];if(ITEMS[it]){add(it);return f.n+' the dust fox left a gift by your door: '+ITEMS[it].n+'.'}}return''}
function updFox(){const p=foxRT();if(!p)return;const f=fx_();p.mv=0;
 if(!f.ad){if(!p.tgt||Math.random()<.004)p.tgt=[p.hx+(Math.random()-.5)*48,p.hy+(Math.random()-.5)*32];const dx=p.tgt[0]-p.x,dy=p.tgt[1]-p.y,d=Math.hypot(dx,dy);if(Math.hypot(G.px-p.x,G.py-p.y)<20&&!cur()){p.tgt=[p.x+(p.x-G.px),p.y+(p.y-G.py)]}if(d>2){const nx=p.x+dx/d*.6,ny=p.y+dy/d*.6;if(!solidAt(nx,ny)){p.x=nx;p.y=ny;p.mv=1;p.f=dx>0?1:0}else p.tgt=null}return}
 const tx=G.px+18*(G.dir==3?1:G.dir==1?-1:0)+(G.dir%2?0:12),ty=G.py+(G.dir==0?14:G.dir==2?-12:2),dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy);if(d>220){p.x=G.px;p.y=G.py;return}
 if(d>14){const sp=Math.min(d>60?2.3:1.3,d/10),nx=p.x+dx/d*sp,ny=p.y+dy/d*sp;if(!solidAt(nx,ny)){p.x=nx;p.y=ny}else if(!solidAt(nx,p.y))p.x=nx;else if(!solidAt(p.x,ny))p.y=ny;p.mv=1;p.f=dx>0?1:0}}
function drawFox(p,X,Y){const b=p.mv&&tick%10<5?1:0,fl=p.f?1:-1,c='#d8783a',l='#f0a060',w='#fff2e0',d='#7a3a1a';R(X-7,Y-1,14,3,'#0004');
 R(X-5,Y-7-b,11,6,c);R(X-5,Y-7-b,11,1,l);R(X-fl*9-2,Y-9-b+Math.round(Math.sin(tick/9)),6,4,c);R(X-fl*11-1,Y-8-b,3,3,w);
 R(X+fl*5-3,Y-12-b,7,6,c);R(X+fl*5-3,Y-16-b,2,4,d);R(X+fl*5+2,Y-16-b,2,4,d);R(X+fl*5-2,Y-15-b,1,2,l);R(X+fl*5+2,Y-15-b,1,2,l);R(X+fl*8,Y-9-b,2,2,w);R(X+fl*9,Y-9-b,1,1,'#222');R(X+fl*5-1,Y-11-b,1,1,'#222');R(X+fl*5+1,Y-11-b,1,1,'#222');
 R(X-4,Y-1,2,1,d);R(X+3,Y-1,2,1,d);if(G.fox&&G.fox.ad&&G.fox.pet==G.day&&tick%120<40)R(X+fl*2,Y-20-b,2,2,'#f6a')}
// ore-sniffer (rock mole) in the mines
function snRT(){const s=sn_();if(G.zone!='mine'||!MINE)return null;if(!s.ad&&(G.floor||1)<2)return null;if(!SN||SN.m!==MINE){const[a,b]=nearFreeHere(Math.floor(G.px/T)+3,Math.floor(G.py/T)+2);SN={m:MINE,x:a*T+8,y:b*T+8,t:0,f:1,mv:0}}return SN}
function nearFreeHere(x,y){for(let r=0;r<8;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const X=(x+a)*T+8,Y=(y+b)*T+8;if(!solidAt(X,Y)&&!solidAt(X-4,Y)&&!solidAt(X+4,Y))return[x+a,y+b]}return[x,y]}
function snNear(){const p=snRT();return p&&Math.hypot(p.x-G.px,p.y-G.py)<26}
function snAct(){const s=sn_(),p=snRT();if(s.ad){if(s.pet!=G.day){s.pet=G.day;sfx('heart');floatTxt(p.x,p.y-14,'♥ '+s.n,'#c9b0ff')}else floatTxt(p.x,p.y-14,s.n+' sniffs the air','#ddd');return}
 const need=3-s.iron;if(cnt('iron')>=need){rem('iron',need);s.iron=3;s.ad=1;s.n='Pebble';sfx('heart');checkAch();say('Ore-Sniffer',['The little rock mole crunches the ferrite ore happily, then snuffles at your boots.','Pebble the ore-sniffer joins you in the mines! It sniffs out ore veins (they sparkle) and sometimes digs up a bonus chunk.'])}
 else say('Ore-Sniffer','A round rock mole with a twitchy nose sniffs at your pockets. It smells ore on you. Bring 3 Ferrite Ore to befriend it. (You have '+cnt('iron')+')')}
function updSn(){const p=snRT();if(!p)return;const s=sn_();p.mv=0;p.t++;let tx,ty;
 if(s.ad){const ores=ENTS.filter(e=>e.k=='ore'&&!e.dead);let o=null,bd=320;for(const e of ores){const d=Math.hypot(e.x-p.x,e.y-p.y)+Math.hypot(e.x-G.px,e.y-G.py)*.5;if(d<bd&&!e.sniffed){bd=d;o=e}}
  if(o){tx=o.x;ty=o.y+10;if(Math.hypot(p.x-tx,p.y-ty)<10&&!o.sniffed){o.sniffed=1;s.found++;parts(o.x,o.y-4,'#ffe27a',8,1);if(s.found%3==0){const it=o.t=='stone'?'iron':o.t;add(it);floatTxt(p.x,p.y-16,s.n+' dug up '+ITEMS[it].n+'!','#ffe27a');sfx('coin')}else floatTxt(p.x,p.y-16,'*sniff sniff*','#ddd')}}
  else{tx=G.px-14;ty=G.py+6}}else{tx=p.x+Math.sin(p.t/50)*8;ty=p.y}
 const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy);if(d>260&&s.ad){p.x=G.px;p.y=G.py;return}if(d>3){const sp=s.ad?Math.min(1.6,d/8):.3,nx=p.x+dx/d*sp,ny=p.y+dy/d*sp;if(!solidAt(nx,ny)){p.x=nx;p.y=ny}else if(!solidAt(nx,p.y))p.x=nx;else if(!solidAt(p.x,ny))p.y=ny;p.mv=1;p.f=dx>0?1:0}}
function drawSn(p,X,Y){const b=p.mv&&tick%8<4?1:0,fl=p.f?1:-1;R(X-6,Y-1,12,3,'#0005');ob(cx,X-6,Y-9-b,12,9,'#8a7a8a');R(X-4,Y-9-b,7,2,'#b0a0b0');R(X+fl*6-1,Y-6-b,3,3,'#f8a0b0');R(X+fl*3,Y-7-b,1,1,'#111');R(X-5,Y-1,2,1,'#5a4a5a');R(X+3,Y-1,2,1,'#5a4a5a');for(const q of[-3,0,3])R(X+q,Y-11-b,1,2,'#6a5a6a')}
{const _i=interact;interact=function(){if(!nearNPC()){if(foxNear()){foxAct();return}if(snNear()){snAct();return}if(G.zone=='farm'){const[fx,fy]=facingTile(),k=giantAt(fx,fy);if(k){say('Giant Crater Gourd','A colossal gourd, three tiles wide. Press USE/ACT facing it to harvest (6 energy, 15 gourds).');return}}}return _i.apply(this,arguments)}}
// ---------- per-frame hooks ----------
{const _u=update;update=function(){_u.apply(this,arguments);if(TITLE||CRED||!G)return;npcTick();if(!modal&&!menu){updFox();updSn()}if(PUFF&&--PUFF.t<=0)PUFF=null;if(tick%300==0){trackRecent();syncPairs()}}}
{const _de=drawExtra;drawExtra=function(D,ox,oy,z){_de(D,ox,oy,z);const night=G.time>=18*60||G.time<6*60+30;
 if(z=='farm'){for(const k in (G.giant||{})){const g=G.giant[k],X=g.x*T-ox,Y=g.y*T-oy;if(X<-60||X>W+10||Y<-60||Y>H+10)continue;D.push([Y+44,()=>drawGiant(X,Y)])}
  for(const k in G.tiles){const t=G.tiles[k];if(!t.c||!CROPS[t.c])continue;const C=CROPS[t.c];if(!C.glow&&!C.storm)continue;const[x,y]=k.split(',').map(Number),X=x*T-ox,Y=y*T-oy;if(X<-30||X>W+30||Y<-30||Y>H+30)continue;const st=t.g/C.days;
   if(C.glow&&st>=.5){if(night){light(X+8,Y+6,st>=1?34:20,C.c);light(X+8,Y+6,12,'#ffffff')}if(tick%50<3+(night?6:0))parts(X+ox+4+hash(x,y)%8,Y+oy+2,C.c,1,.4)}
   if(C.storm&&stormy()&&tick%30<3)D.push([Y+14,()=>{R(X+4+hash(x,tick)%8,Y+hash(y,tick)%10,1,4,'#e8e0ff')}])}}
 const fp=foxRT();if(fp&&fp.z==z){const X=fp.x-ox,Y=fp.y-oy;D.push([Y,()=>drawFox(fp,X,Y)]);if(!G.fox.ad&&Math.hypot(fp.x-G.px,fp.y-G.py)<50)D.push([Y+1,()=>txt('Dust Fox',X,Y-22,'#ffd0a0',6,'center')])}
 const sp=snRT();if(sp){const X=sp.x-ox,Y=sp.y-oy;D.push([Y,()=>drawSn(sp,X,Y)]);if(!G.sniff.ad&&Math.hypot(sp.x-G.px,sp.y-G.py)<60)D.push([Y+1,()=>txt('Ore-Sniffer',X,Y-18,'#d8c8ff',6,'center')]);if(G.sniff.ad)for(const e of ENTS)if(e.k=='ore'&&e.sniffed&&!e.dead&&tick%40<20){const ex=e.x-ox,ey=e.y-oy;D.push([ey+5,()=>{R(ex-6,ey-12,2,2,'#ffe27a');R(ex+5,ey-6,2,2,'#ffe27a')}])}}
 if(PUFF&&PUFF.z==z){const X=PUFF.x*T-ox+8,Y=PUFF.y*T-oy+8;D.push([Y+20,()=>{for(let i=0;i<4;i++)R(X-6+i*4,Y-PUFF.t/3-i,3,3,'#ffffff66')}])}}}
// ---------- achievements ----------
ACH.push(['fox','Dust Fox Friend','Befriend the dust fox',g=>!!(g.fox&&g.fox.ad)],['sniff','Nose for Ore','Befriend the ore-sniffer',g=>!!(g.sniff&&g.sniff.ad)],['giant','Giant Harvest','Harvest a giant crop',g=>(g.stats.giant||0)>=1],['stormh','Storm Chaser','Harvest a Static Bloom',g=>(g.stats.stcH||0)>=1],['rosa',"Rosa's Garden",'Grow Grandma Rosa\'s sunflowers',g=>!!(g.mail&&g.mail.read&&g.mail.read.earth5)]);
// ---------- debug menu ----------
if(window.FM17&&FM17.CGT)Object.assign(FM17.CGT,{earth1:'Earth: Letter from Home',earth2:"Earth: Rosa's Garden",earth3:'Earth: Sunflowers on Mars',fox:'Dust Fox Befriended'});
{const _st=FM17.setTab;FM17.setTab=function(t){_st.apply(this,arguments);const bd=document.querySelector('#dbg .bd');if(!bd)return;
 const sec=(title,items)=>{const h=document.createElement('h3');h.textContent=title;const row=document.createElement('div');row.className='row';for(const[l,f]of items){const b=document.createElement('button');b.textContent=l;b.onclick=()=>{f();if(DBG.open)FM17.setTab(t)};row.appendChild(b)}bd.appendChild(h);bd.appendChild(row)};
 const go=(z,x,y)=>{FM17.closeDbg();modal=null;CUT=null;if(z=='mine')enterMine(x);else enter(z,x,y,2)};
 if(t=='Warp')sec('v23: Wildlife & routines',[['Dust fox (surface)',()=>go('surf',FOXH[0]-1,FOXH[1])],['Ore-sniffer (mine floor 3)',()=>go('mine',3)],...ROUT.map(r=>['Routine: '+r.n,()=>{G.day+=((r.d[0]-wd())+7)%7;G.time=r.h[0]*60;lastHour=-1;placeNPCs(true);syncPairs();const[z,x,y]=Object.values(r.at)[0];const[a,b]=nearFree(z,x,y+2);go(z,a,b)}])]);
 if(t=='Events')sec('v23 events',[...Object.keys(EAR).map((id,i)=>['Earth letter '+(i+1)+': '+EAR[id].t,()=>FM17.replay(()=>{const er=E();for(const k of Object.keys(EAR).slice(0,i)){er.read[k]=er.read[k]??G.day-6;er.ch[k]=er.ch[k]||(EAR[k].ch?EAR[k].ch[0][0]:1)}delete er.read[id];delete er.ch[id];G.mail=G.mail||{box:[],read:{},got:{}};if(!G.mail.box.includes(id))G.mail.box.push(id);G.mail.got[id]=1;readLetter(id)})]),
  ['CG: Dust fox',()=>FM17.replay(()=>FM16.showCG('fox','A New Friend',['Ember curls around your boots.']))],['Giant crop forms tonight',()=>FM17.replay(()=>{plantGrid('grd',true);G.dbgGiant=1;formGiants(true);G.dbgGiant=0;enter('farm',19,13,0);say('Giant crop','A Giant Crater Gourd!')})],
  ['NPC storm reactions',()=>FM17.replay(()=>{G.rec=G.rec||{};G.rec.storm=G.day;say('Storm talk',NPCS.filter(n=>REACT.storm[n.id]).map(n=>n.n+': '+REACT.storm[n.id]))})],['NPC wedding reactions',()=>FM17.replay(()=>say('Wedding talk',NPCS.filter(n=>REACT.wed[n.id]).map(n=>n.n+': '+REACT.wed[n.id])))],['NPC donation reactions',()=>FM17.replay(()=>say('Donation talk',NPCS.filter(n=>REACT.don[n.id]).map(n=>n.n+': '+REACT.don[n.id])))]]);
 if(t=='Give'){sec('v23: Crops & wildlife',[['Weird seeds x5',()=>{add('s_stc',5);add('s_lum',5);add('s_grd',9);add('s_sun',5)}],['Plant 3x3 gourds (ripe)',()=>plantGrid('grd',true)],['Plant Lumen Lilies (ripe)',()=>plantGrid('lum',true,5,1)],['Force dust storm',()=>{G.wx='dust';if(typeof DUSTD!='undefined')DUSTD=-1}],['Adopt dust fox',()=>{const f=fx_();f.ad=1;f.n='Ember';f.love=5;f.fed=3;FOX=null;checkAch()}],['Adopt ore-sniffer',()=>{const s=sn_();s.ad=1;s.n='Pebble';s.iron=3;SN=null;checkAch()}],['Reset wildlife',()=>{G.fox=null;G.sniff=null;FOX=null;SN=null}],['Reset Earth letters',()=>{G.earth=null;if(G.mail){for(const id in EAR){delete G.mail.got[id];delete G.mail.read[id];delete G.mail.read[id+'_att'];G.mail.box=G.mail.box.filter(q=>q!=id)}}}]])}}}
function plantGrid(c,ripe,w=3,h=3,x0=18,y0=12){for(let a=0;a<w;a++)for(let b=0;b<h;b++){const k=(x0+a)+','+(y0+b);delete G.objs[k];G.tiles[k]={c,g:ripe?CROPS[c].days:0,w:1,dry:0}}}
window.FM20={ROUT,routineFor,REACT,REACTP,recentOf,trackRecent,syncPairs,EAR,formGiants,giantAt,chopGiant,plantGrid,foxRT,foxAct,foxNear,updFox,snRT,snAct,updSn,doorFor,bfs,nearFree,npcTick,stormy,FOXH,resetRT:()=>{FOX=null;SN=null}};
})();
