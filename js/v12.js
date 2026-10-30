// Farm Mars v12 (round 14): resident homes + character visual pass
// ---------- HOMES ----------
// door tiles on Habitat Row (A block x3-9, y16-19). bottom doors face the plaza (y20), top doors face y15.
const HOMES={
 ava:{door:[3,19],out:[3,20],n:"Ava's Workshop Hab",pal:['#3a4a5a','#33414f','#ffd23a','#1e2a36'],bed:[9,1,'#1fb5b5'],sit:[3,3],
  f:[['bench',1,1,3,1,'#6a6a7a'],['toolwall',1,0,3,0],['blueprint',6,0,2,0],['crate',10,5,1,1,'#a87a3a'],['crate',10,6,1,1,'#8a6a2a'],['rug',4,3,4,3,'#2a6a7a'],['lamp',8,1,1,1,'#ffd23a'],['plant',1,6,1,1,'#3a8']],
  read:['blueprint','A blueprint for a "Self-Sealing Dome Panel v9". The margins are full of crossed-out sums and one note: "ask the farmer for more iron?"'],
  home:["Welcome to my workshop! Mind the solder, it's still warm.","I fix the whole colony's gear, and then I come home and fix more gear. It's relaxing, I swear.","See that blueprint? If it works, nobody will ever have to patch a dome by hand again."],
  ev:["Ava pulls out a small box. Inside is a tiny brass farmer figurine.","AVA: \"I make one for everyone I care about. This one is you. Don't laugh!\""]},
 kai:{door:[5,19],out:[5,20],n:"Kai's Loft",pal:['#4a2a2a','#3e2222','#ff7ad8','#26141a'],bed:[1,1,'#d43a9a'],sit:[6,3],
  f:[['counter',7,1,4,1,'#c8c8d0'],['stove',8,1,1,1],['spices',7,0,4,0],['table',5,4,2,1,'#7a4a2a'],['neon',2,0,2,0,'#ff2ad8','EAT'],['plant',10,6,1,1,'#3a8'],['rug',4,3,4,3,'#6a2a4a']],
  read:['spices','A rack of hand-labelled jars: "Crater Salt", "Glowcap Dust", "DO NOT TOUCH - Ghost Pepper (Mo-proof)".'],
  home:["Hungry? There's always something on the stove here.","Home is where I test recipes that are too weird for the cafe.","Shh, don't tell anyone that my secret sauce is mostly Glowcap and nostalgia."],
  ev:["Kai slides a bowl across the counter. It smells like the farm after rain.","KAI: \"I named this one after you. It's not on the menu. It's just for us.\""]},
 ruiz:{door:[7,19],out:[7,20],n:"Dr. Ruiz's Quarters",pal:['#dde6ea','#c8d4da','#3a6','#4a6a7a'],bed:[10,1,'#eeeeee'],sit:[4,4],
  f:[['books',1,1,4,1,'#5a3a2a'],['diploma',6,0,1,0],['desk',3,5,3,1,'#6a4a3a'],['plant',10,6,1,1,'#3a8'],['plant',1,6,1,1,'#5c6'],['rug',6,3,3,3,'#5a8a9a']],
  read:['diploma','"Doctor of Medicine, Tharsis Medical Academy." A sticky note underneath says: "Remember why you came to Mars."'],
  home:["You found my quarters. I usually spend all my time at the clinic, so this is a nice change.","I keep the plants for the oxygen. And because they never complain about their check-ups.","Sit down if you like. Doctor's orders: rest more."],
  ev:["Ruiz shows you an old photo of a crowded Earth hospital ward.","RUIZ: \"I left all that to build something better here. You remind me that it was worth it.\""]},
 mo:{door:[9,19],out:[9,20],n:"Old Mo's Den",pal:['#4a3a2a','#3e3022','#ffaa3a','#2a2018'],bed:[1,1,'#a65a2a'],sit:[6,4],
  f:[['minerals',6,1,4,1,'#3a2a1a'],['pickwall',2,0,1,0],['armchair',7,4,1,1,'#7a2a2a'],['stove',10,5,1,1],['rug',5,3,4,3,'#6a3a1a'],['lamp',10,1,1,1,'#ffaa3a']],
  read:['minerals','Old Mo\'s rock collection. Each one is labelled with a floor number and a date. The oldest label is faded and simply says "Day One".'],
  home:["Come in, come in. Wipe the dust off your boots, or don't. Everything's dusty anyway.","Forty years in those tunnels. Every rock on that shelf has a story.","Sit by the heater. These old bones like the warmth."],
  ev:["Mo lifts a battered pickaxe off the wall and hands it to you to hold.","MO: \"My first pick. When I'm gone, I want you to have it. Now don't get all misty on me.\""]},
 zara:{door:[3,16],out:[3,15],n:"Zara's Neon Studio",pal:['#2a1a3a','#241632','#3af0ff','#140a20'],bed:[9,1,'#ff7a1a'],sit:[4,4],
  f:[['synth',1,1,3,1,'#222'],['neon',5,0,3,0,'#3af0ff','ZARA'],['mirror',9,0,1,0],['speaker',1,5,1,2],['speaker',10,5,1,2],['rug',4,3,4,3,'#6a1a7a']],
  read:['synth','A synth covered in stickers. Track list on the screen: "Dust Storm Disco", "Phobos at 2am", "Farm Song (for you?)".'],
  home:["Welcome to the studio! Don't touch the faders. Okay, touch one.","This is where I make the playlists for the Airlock.","The neon's not too much, right? ...Okay, it's a little too much. I love it."],
  ev:["Zara hits play. A soft synth melody fills the room, and it sounds a lot like the crickets on your farm.","ZARA: \"I wrote it after visiting your farm. It's called 'Home'.\""]},
 theo:{door:[5,16],out:[5,15],n:"Theo's Observatory Flat",pal:['#22284a','#1c2240','#bff','#10142a'],bed:[1,1,'#3a4aa0'],sit:[6,4],
  f:[['telescope',9,1,1,1],['starmap',4,0,3,0],['books',1,5,3,1,'#3a2a4a'],['desk',6,1,2,1,'#5a4a6a'],['rug',4,3,4,3,'#2a3a7a'],['fossil',10,5,1,1]],
  read:['starmap','A star chart with Earth circled in red. Next to it someone has written "too far" and then, later, "but look how bright it is".'],
  home:["Oh! Visitors are rare. Sorry about all the notes everywhere.","The telescope's pointed at Earth. Some nights I just look.","Did you know Phobos is getting closer to Mars every year? About two metres every century."],
  ev:["Theo lets you look through the telescope. A tiny blue dot shimmers in the eyepiece.","THEO: \"Everyone I ever knew is on that dot. And yet, I think I'd rather be here.\""]},
 vega:{door:[7,16],out:[7,15],n:"Mayor Vega's Residence",pal:['#3a1a2a','#321624','#ffd23a','#200c18'],bed:[10,1,'#7a1a3a'],sit:[4,4],
  f:[['desk',3,1,3,1,'#5a2a1a'],['flag',1,0,1,0],['globe',8,5,1,1],['portrait',6,0,2,0],['plant',1,6,1,1,'#3a8'],['rug',3,3,5,3,'#7a1a3a'],['books',8,1,2,1,'#4a2a1a']],
  read:['portrait','A portrait of the first 40 colonists. A much younger Vega stands at the front, already wearing that cap.'],
  home:["Ah, welcome. Even a mayor needs a place to put her feet up.","Paperwork follows me home. Every single night.","That portrait is the first landing crew. Half of them still live in New Cydonia."],
  ev:["Vega takes a pin from her desk: the colony seal, in gold.","VEGA: \"Honorary Founder. It's not official. Yet. But you've earned it.\""]},
 pip:{door:[9,16],out:[9,15],n:"Pip's Family Hab",pal:['#3a5a3a','#335233','#ff4a4a','#1e321e'],bed:[1,1,'#2ac87a'],sit:[6,4],
  f:[['toys',9,5,2,1],['drawings',4,0,3,0],['table',6,1,2,1,'#c87a3a'],['rover',3,5,1,1],['rug',4,3,4,3,'#2a7aaa'],['plant',10,1,1,1,'#3a8']],
  read:['drawings','Crayon drawings stuck to the wall: a robot, a cow with antennae, and a stick figure in a big hat labelled "THE FARMER (my friend)".'],
  home:["This is my room! Don't step on my rover.","Mom says I have to tidy up before bedtime. Mom says that a lot.","Want to see my drawings? That one's you!"],
  ev:["Pip hands you a crayon drawing of the two of you on the farm, under a giant smiling Phobos.","PIP: \"You can keep it! I'll draw another one. I'll draw a hundred!\""]},
};
window.HOMEN={};
const HOMEZ=id=>'h_'+id,homeOf=z=>z&&z.startsWith('h_')?z.slice(2):null;
for(const id in HOMES){const h=HOMES[id],z=HOMEZ(id),rows=[];for(let y=0;y<8;y++){let r='';for(let x=0;x<12;x++)r+=(y==0||x==0||x==11)?'w':(y==7?(x==5?'D':'w'):'o');rows.push(r)}
 const m=fromStr(rows);m[7]=m[7].map((c,x)=>x==5?'D':'w');
 const solid=(x,y,w,hh)=>{for(let j=0;j<hh;j++)for(let i=0;i<w;i++)if(m[y+j]&&m[y+j][x+i]=='o')m[y+j][x+i]='x'};
 solid(h.bed[0],h.bed[1],2,2);for(const f of h.f)if(f[0]!='rug'&&f[4]>0)solid(f[1],f[2],f[3],f[4]);
 MAPS[z]=m;DZ[z]=h.pal;window.HOMEN[z]=h.n;
 MAPS.city[h.door[1]][h.door[0]]='D';DOORS['city:'+h.door[0]+','+h.door[1]]=[z,5,6];EXITS[z]=['city',h.out[0],h.out[1]]}
// residents sleep/relax at home instead of vanishing
for(const n of NPCS){const h=HOMES[n.id];if(!h)continue;n.sched=n.sched.map(s=>s[1]=='home'?[s[0],HOMEZ(n.id),h.sit[0],h.sit[1]]:s)}
const homeOpen=()=>G.time>=420&&G.time<1320;// 7:00-22:00
function homeLocked(id){if(G.spouse==id)return false;return !homeOpen()&&(G.hearts[id]||0)<6}
{const _tr=triggers;triggers=function(){if(G&&G.zone=='city'){const tx=Math.floor(G.px/T),ty=Math.floor((G.py-2)/T);for(const id in HOMES){const h=HOMES[id];if(h.door[0]==tx&&h.door[1]==ty&&homeLocked(id)){
   const n=NPCS.find(q=>q.id==id);G.px=h.out[0]*T+8;G.py=h.out[1]*T+8;if(!(TOASTLOCK>tick)){toast("Locked. "+n.n+" is asleep. (Open 7:00-22:00, or at 6+ hearts)");sfx('bad');TOASTLOCK=tick+90}return}}}
 return _tr.apply(this,arguments)}}
let TOASTLOCK=0;
// home dialogue, home heart events
{const _t=talk;talk=function(n){_t(n);const id=homeOf(G.zone);if(id!=n.id||!modal||!HOMES[id]||(modal.name||'').includes('Event'))return;const h=HOMES[id];G.events=G.events||{};
 if((G.hearts[id]||0)>=5&&!G.events['homeEv_'+id]&&G.spouse!=id){G.events['homeEv_'+id]=G.day;addHearts(n,1);modal={name:n.n+' - Heart Event',pages:h.ev.slice(),pi:0,ch:0,opts:null,sel:0,look:n.look,mood:'love'};sfx('heart');return}
 const k='homeL_'+id;if(G.events[k]!=G.day){G.events[k]=G.day;modal.pages.unshift(h.home[G.day%h.home.length])}}}
function homeRead(){const id=homeOf(G.zone);if(!id)return false;const h=HOMES[id],[fx,fy]=facingTile();
 const hit=(f)=>fx>=f[1]&&fx<f[1]+f[3]&&fy>=f[2]&&fy<=f[2]+Math.max(0,f[4]-1);const f=h.f.find(f=>f[0]==h.read[0]&&(hit(f)||f[4]==0&&fx>=f[1]&&fx<f[1]+f[3]&&fy<=1));
 if(f){say(h.n,h.read[1]);sfx('menu');G.events=G.events||{};G.events['read_'+id]=1;return true}
 if(fx>=h.bed[0]&&fx<h.bed[0]+2&&fy>=h.bed[1]&&fy<h.bed[1]+2){say(h.n,"It's a neatly made bed. Better not.");return true}return false}
{const _i=interact;interact=function(){if(G&&!modal&&!nearNPC()&&homeRead())return;return _i()}}
{const _a=act;act=function(){if(G&&!modal&&!FISHING&&!nearNPC()&&homeOf(G.zone)&&homeRead())return;return _a()}}
// ---------- furniture art ----------
function furn(f,X,Y){const[k,,,w,h,c,lab]=f,W2=w*T,H2=Math.max(1,h)*T;
 switch(k){
 case'rug':R(X,Y,W2,H2,c);R(X+2,Y+2,W2-4,H2-4,shade(c,.15));R(X+4,Y+4,W2-8,H2-8,c);for(let i=6;i<W2-6;i+=6)R(X+i,Y+H2/2,2,2,shade(c,.4));break;
 case'bench':case'desk':case'table':case'counter':R(X,Y+2,W2,H2-6,'#1a0f1a');R(X+1,Y+3,W2-2,4,shade(c,.25));R(X+1,Y+7,W2-2,H2-12,c);R(X+2,Y+H2-5,2,4,shade(c,-.4));R(X+W2-4,Y+H2-5,2,4,shade(c,-.4));
  if(k=='bench'){R(X+6,Y-1,6,4,'#9aa');R(X+18,Y,4,3,'#f80');R(X+30,Y-2,8,5,'#3a3')}if(k=='desk'){R(X+W2/2-6,Y-6,12,9,'#1a1a24');R(X+W2/2-5,Y-5,10,6,tick%90<45?'#6cf':'#5be');R(X+4,Y,6,2,'#fff')}
  if(k=='counter'){R(X+4,Y,6,3,'#ddd');R(X+W2-12,Y-2,4,5,'#a33')}if(k=='table'){R(X+6,Y+1,6,2,'#fff');R(X+W2-12,Y,4,3,'#ffd27a')}break;
 case'stove':R(X,Y+1,T,T-1,'#1a0f1a');R(X+1,Y+2,14,13,'#556');R(X+2,Y+3,12,3,'#889');R(X+3,Y+8,10,5,'#222');R(X+4,Y+9,8,3,tick%20<10?'#f62':'#fa3');light(X+8,Y+10,18,'#f84');break;
 case'crate':R(X+1,Y+1,14,14,'#1a0f1a');R(X+2,Y+2,12,12,c);R(X+2,Y+2,12,1,shade(c,.3));R(X+2,Y+7,12,1,shade(c,-.3));R(X+7,Y+2,1,12,shade(c,-.3));break;
 case'lamp':R(X+7,Y+4,2,11,'#333');R(X+4,Y+14,8,2,'#222');R(X+3,Y,10,5,c);R(X+4,Y+1,8,1,'#fff8');light(X+8,Y+3,34,c);break;
 case'plant':R(X+4,Y+10,8,6,'#8a4a2a');R(X+4,Y+10,8,1,'#b86a3a');R(X+3,Y+2,4,8,c);R(X+8,Y,5,10,shade(c,.2));R(X+6,Y+4,4,6,shade(c,-.2));R(X+9,Y+1,2,2,'#cfc');break;
 case'books':case'minerals':R(X,Y-6,W2,H2+6,'#1a0f1a');R(X+1,Y-5,W2-2,H2+4,c);for(let r=0;r<3;r++){R(X+1,Y-5+r*7+6,W2-2,1,shade(c,-.4));for(let i=2;i<W2-3;i+=3){const col=k=='books'?['#c33','#36c','#3a6','#db3','#a5c'][(i+r)%5]:['#e0603a','#6cf','#c8f','#ffd27a','#9f6','#ccc'][(i+r*2)%6];R(X+i,Y-5+r*7+(k=='books'?1:3),2,k=='books'?5:3,col)}}break;
 case'armchair':R(X,Y+2,T,14,'#1a0f1a');R(X+1,Y+3,14,12,c);R(X+3,Y+7,10,5,shade(c,.2));R(X+1,Y+3,14,2,shade(c,.3));break;
 case'telescope':R(X+6,Y+8,1,8,'#888');R(X+10,Y+8,1,8,'#888');R(X+8,Y+6,1,10,'#aaa');R(X+2,Y,12,5,'#1a0f1a');R(X+3,Y+1,10,3,'#c8c0a0');R(X+3,Y+1,10,1,'#fff');R(X+12,Y,3,5,'#556');break;
 case'globe':R(X+7,Y+11,2,4,'#a87');R(X+4,Y+14,8,2,'#5a3a2a');R(X+3,Y+1,10,10,'#1a0f1a');R(X+4,Y+2,8,8,'#c8502a');R(X+5,Y+3,3,2,'#e88a5a');R(X+8,Y+6,3,2,'#8a2a1a');break;
 case'synth':R(X,Y+3,W2,10,'#1a0f1a');R(X+1,Y+4,W2-2,8,'#333');for(let i=3;i<W2-3;i+=3)R(X+i,Y+8,2,4,i%9?'#fff':'#111');R(X+3,Y+5,10,2,tick%30<15?'#3af0ff':'#ff2ad8');light(X+W2/2,Y+6,26,'#3af0ff');break;
 case'speaker':R(X+1,Y,14,H2,'#1a0f1a');R(X+2,Y+1,12,H2-2,'#2a2a34');const p=tick%16<8?1:0;R(X+4,Y+4,8,8,'#111');R(X+5+p,Y+5+p,6-2*p,6-2*p,'#556');R(X+5,Y+18,6,6,'#111');R(X+6,Y+19,4,4,'#445');break;
 case'toys':R(X+2,Y+4,W2-4,12,'#1a0f1a');R(X+3,Y+5,W2-6,10,'#e84');R(X+3,Y+5,W2-6,2,'#fa6');R(X+6,Y,5,5,'#3cf');R(X+14,Y+1,6,4,'#fd3');R(X+22,Y,3,6,'#c3c');break;
 case'rover':R(X+2,Y+6,12,6,'#1a0f1a');R(X+3,Y+7,10,4,'#ccc');R(X+5,Y+4,4,3,'#6cf');R(X+3,Y+11,3,3,'#333');R(X+10,Y+11,3,3,'#333');break;
 case'fossil':R(X+2,Y+4,12,10,'#1a0f1a');R(X+3,Y+5,10,8,'#a89070');R(X+5,Y+7,6,1,'#e8dcc0');R(X+5,Y+9,6,1,'#e8dcc0');R(X+7,Y+6,1,5,'#e8dcc0');break;
 // wall-mounted (h==0): drawn on the wall row
 case'toolwall':R(X+2,Y+3,W2-4,10,'#5a4a3a');R(X+6,Y+4,2,8,'#ccc');R(X+14,Y+4,6,3,'#f80');R(X+16,Y+7,2,5,'#aaa');R(X+28,Y+5,8,2,'#ccc');R(X+31,Y+5,2,7,'#a87');break;
 case'blueprint':case'starmap':case'drawings':case'portrait':R(X+2,Y+2,W2-4,12,'#1a0f1a');R(X+3,Y+3,W2-6,10,k=='blueprint'?'#2a5ab0':k=='starmap'?'#0a1030':k=='portrait'?'#6a4a2a':'#f4ead8');
  if(k=='blueprint'){for(let i=5;i<W2-5;i+=5)R(X+i,Y+5,1,6,'#9cf');R(X+5,Y+8,W2-10,1,'#9cf')}if(k=='starmap'){for(let i=0;i<9;i++)R(X+4+(i*7)%(W2-8),Y+4+(i*5)%8,1,1,'#fff');R(X+W2-12,Y+7,2,2,'#f44')}
  if(k=='drawings'){R(X+5,Y+5,6,6,'#f66');R(X+16,Y+4,8,7,'#6cf');R(X+30,Y+5,6,6,'#fd3');R(X+32,Y+3,2,2,'#333')}if(k=='portrait'){R(X+4,Y+4,W2-8,8,'#c8b090');for(let i=6;i<W2-6;i+=4)R(X+i,Y+6,2,5,'#3a2a2a')}break;
 case'diploma':R(X+2,Y+3,12,10,'#a87a3a');R(X+3,Y+4,10,8,'#f4ead8');R(X+5,Y+6,6,1,'#555');R(X+5,Y+8,6,1,'#555');R(X+9,Y+10,3,2,'#c33');break;
 case'pickwall':R(X+3,Y+4,10,3,'#999');R(X+2,Y+5,2,3,'#888');R(X+12,Y+5,2,3,'#888');R(X+7,Y+6,2,9,'#7a4a2a');break;
 case'mirror':R(X+3,Y+1,10,14,'#ffd27a');R(X+4,Y+2,8,12,'#9cd8f0');R(X+5,Y+3,2,6,'#fff8');break;
 case'flag':R(X+3,Y+1,1,14,'#ccc');R(X+4,Y+2,10,7,'#c8302a');R(X+7,Y+4,4,3,'#ffd23a');break;
 case'spices':R(X+2,Y+8,W2-4,2,'#7a4a2a');for(let i=4;i<W2-4;i+=5)R(X+i,Y+3,4,5,['#c33','#db3','#3a6','#a5c','#e84'][i%5]);break;
 case'neon':{const on=tick%120<110;R(X+2,Y+3,W2-4,10,'#0a0610');txt(lab,X+W2/2,Y+11,on?c:shade(c,-.6),7,'center',0);if(on)light(X+W2/2,Y+8,40,c);break}
 }}
function drawBed(X,Y,c){R(X,Y,32,30,'#1a0f1a');R(X+1,Y+1,30,6,'#7a5a3a');R(X+1,Y+7,30,22,'#e8e8f8');R(X+3,Y+8,11,7,'#fff');R(X+1,Y+15,30,14,c);R(X+1,Y+15,30,2,shade(c,.3));R(X+1,Y+27,30,2,shade(c,-.3))}
{const _de=typeof drawExtra=='function'?drawExtra:null;drawExtra=function(D,ox,oy,z){if(_de)_de(D,ox,oy,z);
 if(z=='city'){for(const id in HOMES){const h=HOMES[id],X=h.door[0]*T-ox,Y=h.door[1]*T-oy;if(X<-20||X>W+20||Y<-30||Y>H+30)continue;const top=h.door[1]==16,lk=homeLocked(id),n=NPCS.find(q=>q.id==id);
   D.push([(top?16:20)*T-oy+(top?-T*4:1),()=>{R(X+1,Y-(top?0:6),14,top?14:20,'#1a0f1a');R(X+2,Y-(top?-1:5),12,top?12:18,shade(n.look.top,-.25));R(X+3,Y-(top?-2:4),10,2,shade(n.look.top,.2));R(X+11,Y+(top?8:4),2,2,lk?'#f44':'#6f6');
    R(X+4,Y-(top?-4:2),8,4,G.time>=1080||G.time<420?'#ffd890':'#8ad8ff');txt(n.n.split(' ').pop(),X+8,Y+(top?-2:-9),'#fff',6,'center',0)}])}}
 const id=homeOf(z);if(!id)return;const h=HOMES[id];
 for(const f of h.f){const X=f[1]*T-ox,Y=f[2]*T-oy;if(f[0]=='rug')D.push([-9999,()=>furn(f,X,Y)]);else if(f[4]==0)D.push([-999,()=>furn(f,X,Y)]);else D.push([(f[2]+f[4])*T-oy,()=>furn(f,X,Y)])}
 const bx=h.bed[0]*T-ox,by=h.bed[1]*T-oy;D.push([by+2*T-6,()=>drawBed(bx,by,h.bed[2])])}}
// ---------- CHARACTER VISUAL PASS ----------
const drawCharV1=drawChar,drawPortraitV1=drawPortrait;
const CC=new Map();const OL='#1a0f1a';
function outline(c){const g=c.getContext('2d'),w=c.width,h=c.height,d=g.getImageData(0,0,w,h),a=d.data,o=new Uint8ClampedArray(a);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(a[i+3])continue;if((x>0&&a[i-1])||(x<w-1&&a[i+7])||(y>0&&a[i-w*4+3])||(y<h-1&&a[i+w*4+3])){o[i]=26;o[i+1]=15;o[i+2]=26;o[i+3]=255}}
 d.data.set(o);g.putImageData(d,0,0)}
function rr(g,x,y,w,h,c){px(g,x+1,y,w-2,h,c);px(g,x,y+1,w,h-2,c)}// rounded rect
function charSprite(look,dir,frame,suit,swing){const key=look.skin+look.hair+look.style+look.top+look.pants+look.acc+dir+frame+(suit?1:0)+(swing?1:0)+(look.small?'s':'');let c=CC.get(key);if(c)return c;
 c=document.createElement('canvas');c.width=18;c.height=27;const g=c.getContext('2d'),O=1,sk=look.skin,hr=look.hair,tp=look.top,pn=look.pants,ac=look.acc||shade(tp,.4);
 const ph=[0,1,0,-1][frame&3],bob=(frame&1)?1:0,side=dir==1||dir==3,fl=dir==3;const X=O,Y=O+1;
 const P=(x,y,w,h,col)=>px(g,fl?X+16-x-w:X+x,Y+y,w,h,col);
 // legs (4-frame stride, knee lift on passing frames)
 const sh='#2a1a24',sh2='#4a3a44';
 if(side){const a=ph*2;P(6+a,17,3,5-(ph<0?1:0),pn);P(7-a,17,3,5-(ph>0?1:0),shade(pn,-.25));P(6+a,21-(ph<0?1:0),4,2,sh);P(7-a,21-(ph>0?1:0),4,2,shade(sh,-.2));P(6+a,21-(ph<0?1:0),1,1,sh2)}
 else{const l=ph>0?1:0,r=ph<0?1:0;P(5,17,3,5-l,pn);P(9,17,3,5-r,pn);P(5,17,1,4,shade(pn,.2));P(11,17,1,4,shade(pn,-.25));P(4,21-l,4,2,sh);P(9,21-r,4,2,sh);P(4,21-l,2,1,sh2);P(9,21-r,2,1,sh2)}
 // torso
 const by=10+bob;rr(g,fl?X+16-4-9:X+4,Y+by,9,8,tp);P(4,by,9,1,shade(tp,.3));P(4,by+1,1,6,shade(tp,.18));P(12,by+1,1,6,shade(tp,-.28));P(4,by+7,9,1,shade(tp,-.35));
 P(4,by+5,9,1,shade(pn,-.1));if(dir==2){P(7,by,3,2,ac);P(8,by+5,1,1,'#ffd27a')}else if(side)P(9,by+1,2,3,shade(tp,.15));
 if(suit){P(4,by+3,9,1,'#fa2');if(dir==0)P(5,by+1,7,5,'#778'),P(6,by+2,5,1,'#99a');else if(side)P(3,by+1,2,6,'#778')}
 // arms with hands, swing opposite legs
 const sw=swing?0:ph;if(side){P(7-sw,by+1,3,6,shade(tp,-.1));P(7-sw,by+6,3,2,sk);P(7-sw,by+1,1,5,shade(tp,.2))}
 else{P(2,by+1-sw,2,6,shade(tp,.05));P(13,by+1+sw,2,6,shade(tp,-.2));P(2,by+6-sw,2,2,sk);P(13,by+6+sw,2,2,shade(sk,-.1))}
 // head: rounded, shaded
 const hy=1+bob,skd=shade(sk,-.22),skl=shade(sk,.15);rr(g,fl?X+16-3-11:X+3,Y+hy,11,10,sk);P(4,hy,8,1,skl);P(12,hy+2,1,6,skd);P(4,hy+9,9,1,skd);
 if(dir==0){rr(g,fl?X+16-3-11:X+3,Y+hy-1,11,10,hr);P(5,hy,4,1,shade(hr,.35));P(4,hy+8,9,1,shade(hr,-.3));P(12,hy+1,1,7,shade(hr,-.2))}
 else{const eb=shade(hr,-.35);
  if(dir==2){P(5,hy+4,2,3,'#fff');P(10,hy+4,2,3,'#fff');P(6,hy+5,1,2,'#1a1830');P(10,hy+5,1,2,'#1a1830');P(5,hy+4,1,1,'#fff');P(5,hy+3,2,1,eb);P(10,hy+3,2,1,eb);
   P(4,hy+7,2,1,'#f88a8a');P(11,hy+7,2,1,'#f88a8a');P(7,hy+8,3,1,shade(sk,-.4));P(8,hy+7,1,1,skd)}
  else{P(10,hy+4,2,3,'#fff');P(11,hy+5,1,2,'#1a1830');P(10,hy+3,2,1,eb);P(13,hy+5,1,2,skd);P(11,hy+8,2,1,shade(sk,-.4));P(9,hy+7,2,1,'#f88a8a');P(5,hy+4,2,3,skd)}
  const st=look.style,hl=shade(hr,.35),hd=shade(hr,-.3);
  if(st!='bald'){rr(g,fl?X+16-3-11:X+3,Y+hy-1,11,4,hr);P(5,hy-1,5,1,hl);P(4,hy,1,1,hl);
   if(side){P(3,hy,4,6,hr);P(3,hy+5,3,1,hd);P(4,hy+1,1,3,hl)}
   if(st=='bob'){P(2,hy+1,2,8,hr);P(13,hy+1,2,8,hd);P(2,hy+8,2,1,hd);if(dir==2)P(4,hy+2,4,1,hr)}
   else if(st=='spiky'){P(4,hy-3,2,2,hr);P(7,hy-4,2,3,hr);P(10,hy-3,2,2,hr);P(12,hy-2,2,2,hd);P(7,hy-4,1,1,hl);if(dir==2)P(4,hy+2,2,1,hr),P(10,hy+2,2,1,hr)}
   else if(st=='long'){P(2,hy+1,2,12,hr);P(13,hy+1,2,12,hd);P(2,hy+12,2,1,hd);P(2,hy+3,1,5,hl)}
   else if(st=='cap'){rr(g,fl?X+16-2-13:X+2,Y+hy-2,13,4,ac);P(4,hy-2,6,1,shade(ac,.35));P(2,hy+1,13,1,shade(ac,-.3));if(dir==2)P(7,hy-1,3,2,shade(ac,-.25));else if(side)P(12,hy+1,4,2,ac)}
   else if(st=='beard'){P(3,hy-1,11,2,hr)}}else{P(4,hy,8,1,shade(sk,.35));P(6,hy+1,3,1,shade(sk,.25))}
  if(st=='beard'){if(dir==2){P(4,hy+6,9,4,hr);P(6,hy+10,5,1,hr);P(7,hy+7,3,1,shade(sk,-.4));P(4,hy+6,1,3,hl)}else P(8,hy+6,6,4,hr)}
  if(st=='bald'&&dir!=0){P(3,hy+2,1,3,'#9a9a9a');P(13,hy+2,1,3,'#9a9a9a')}}
 outline(c);
 if(suit){g.fillStyle='#bff9';const cxp=X+8.5,cyp=Y+hy+4.5;for(let a=0;a<64;a++){const t=a/64*6.283,xx=Math.round(cxp+Math.cos(t)*7.5),yy=Math.round(cyp+Math.sin(t)*7.2);g.fillRect(xx,yy,1,1)}g.fillStyle='#fffc';g.fillRect(X+5,Y+hy-2,3,1)}
 if(CC.size>600)CC.clear();CC.set(key,c);return c}
drawChar=function(g,X,Y,look,dir,frame,o={}){if(!look||!look.skin)return drawCharV1(g,X,Y,look,dir,frame,o);const f=frame&3;
 px(g,X+3,Y+22,11,3,'#0005');px(g,X+2,Y+23,13,1,'#0003');g.drawImage(charSprite(look,dir,f,o.suit,o.swing),Math.round(X)-1,Math.round(Y)-2);
 if(o.carry){const c=o.carry,b=(f&1)?1:0;ob(g,X+5,Y-6+b,6,6,c);px(g,X+6,Y-5+b,2,2,'#fff8')}};
// ---------- portraits: dedicated 24x21 bust, drawn at 2x for dialogue ----------
const PC2={};
function bust(look,mood,blink){const key=JSON.stringify(look)+mood+blink;if(PC2[key])return PC2[key];const c=document.createElement('canvas');c.width=24;c.height=21;const g=c.getContext('2d'),P=(x,y,w,h,col)=>px(g,x,y,w,h,col);
 const sk=look.skin,hr=look.hair,tp=look.top,ac=look.acc||shade(tp,.4),skd=shade(sk,-.2),skl=shade(sk,.14),hl=shade(hr,.35),hd=shade(hr,-.3),st=look.style;
 // shoulders
 rr(g,2,16,20,6,tp);P(2,16,20,1,shade(tp,.3));P(9,16,6,2,ac);P(11,17,2,3,shade(tp,-.3));P(20,17,2,4,shade(tp,-.25));
 P(10,14,4,3,skd);// neck
 if(st=='long'){P(4,5,3,13,hr);P(17,5,3,13,hd)}
 // head
 rr(g,5,3,14,13,sk);P(6,3,10,1,skl);P(18,5,1,8,skd);P(6,15,12,1,skd);P(5,6,1,6,skl);P(4,8,1,3,skd);P(19,8,1,3,skd);
 // eyes
 const ey=9;if(blink){P(7,ey+1,3,1,'#1a1830');P(14,ey+1,3,1,'#1a1830')}else if(mood=='love'){P(7,ey,1,1,'#1a1830');P(8,ey-1,1,1,'#1a1830');P(9,ey,1,1,'#1a1830');P(14,ey,1,1,'#1a1830');P(15,ey-1,1,1,'#1a1830');P(16,ey,1,1,'#1a1830')}
 else{P(7,ey-1,3,4,'#fff');P(14,ey-1,3,4,'#fff');P(8,ey,2,3,'#1a1830');P(14,ey,2,3,'#1a1830');P(8,ey,1,1,'#fff');P(14,ey,1,1,'#fff');if(mood=='sad')P(17,ey+3,1,2,'#8cf')}
 const bw=shade(hr=='#dddddd'||st=='bald'?'#888888':hr,-.35);if(mood=='angry'){P(7,ey-3,3,1,bw);P(9,ey-2,1,1,bw);P(14,ey-3,3,1,bw);P(14,ey-2,1,1,bw)}else{P(7,ey-2,3,1,bw);P(14,ey-2,3,1,bw)}
 P(11,ey+2,2,2,skd);P(6,ey+3,2,1,'#f8909088');P(16,ey+3,2,1,'#f8909088');
 const mk=shade(sk,-.45);if(mood=='happy'||mood=='love'){P(9,ey+5,6,1,mk);P(10,ey+6,4,1,'#c04050');P(9,ey+4,1,1,mk);P(14,ey+4,1,1,mk)}else if(mood=='sad'||mood=='angry'){P(10,ey+5,4,1,mk);P(9,ey+6,1,1,mk);P(14,ey+6,1,1,mk)}else{P(10,ey+5,4,1,mk);P(14,ey+4,1,1,mk)}
 // hair
 if(st!='bald'){rr(g,5,1,14,5,hr);P(7,1,6,1,hl);P(6,2,2,1,hl);P(5,5,2,3,hr);P(17,5,2,3,hd);
  if(st=='bob'){P(3,4,3,11,hr);P(18,4,3,11,hd);P(3,14,3,1,hd);P(7,5,5,2,hr);P(3,6,1,4,hl)}
  else if(st=='spiky'){P(6,-0,2,2,hr);P(9,0,3,1,hr);P(10,-0,2,1,hl);P(14,0,3,2,hr);P(17,1,2,3,hd);P(7,5,3,1,hr);P(13,5,3,1,hr)}
  else if(st=='long'){P(4,3,2,4,hr);P(18,3,2,4,hd);P(6,5,4,1,hr)}
  else if(st=='cap'){rr(g,4,0,16,5,ac);P(6,0,8,1,shade(ac,.35));P(3,4,18,2,shade(ac,-.25));P(10,1,4,3,shade(ac,-.15));P(5,6,2,2,hr);P(17,6,2,2,hr)}
  else if(st=='beard'){P(5,11,14,4,hr);P(7,15,10,2,hr);P(9,17,6,1,hd);P(10,13,4,1,mk);P(6,11,1,3,hl)}}
 else{P(7,3,8,1,shade(sk,.3));P(4,7,1,4,'#9a9a9a');P(19,7,1,4,'#9a9a9a');if(look.acc){P(6,8,5,1,'#333');P(13,8,5,1,'#333');P(11,8,2,1,'#333')}}
 outline(c);return PC2[key]=c}
drawPortrait=function(g,X,Y,look,s=3,mood='',blink=false){if(!look||!look.skin)return drawPortraitV1(g,X,Y,look,s,mood,blink);const k=s>=3?2:1,c=bust(look,mood,blink);g.imageSmoothingEnabled=false;
 const w=24*k,h=21*k,bw=16*s,bh=14*s;g.drawImage(c,0,0,24,21,Math.round(X+(bw-w)/2),Math.round(Y+(bh-h)),w,h)};
window.FM12={HOMES,HOMEZ,homeOf,homeLocked,homeOpen,charSprite,bust,drawCharV1,drawPortraitV1,homeRead,CC};
