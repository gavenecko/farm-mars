// Procedural 32-bit style pixel art
function px(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)}
function shade(hex,a){let c=hex.replace('#','');if(c.length==3)c=c.split('').map(q=>q+q).join('');const n=parseInt(c,16);let r=n>>16,g=n>>8&255,b=n&255;
 const f=a<0?0:255,t=Math.abs(a);r=Math.round(r+(f-r)*t);g=Math.round(g+(f-g)*t);b=Math.round(b+(f-b)*t);return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)}
function ob(g,x,y,w,h,c,o='#1a0f1a'){px(g,x-1,y-1,w+2,h+2,o);px(g,x,y,w,h,c)}
// ---------- tile cache ----------
const TC={};function tileImg(zone,t,v){const k=zone+t+v;if(TC[k])return TC[k];const c=document.createElement('canvas');c.width=c.height=T;const g=c.getContext('2d');drawTile(g,zone,t,v);TC[k]=c;return c}
function dither(g,base,dark,light,v,dens=10){px(g,0,0,T,T,base);let s=v*131+7;const r=()=>(s=(s*16807)%2147483647)%T;for(let i=0;i<dens;i++)px(g,r(),r(),1,1,dark);for(let i=0;i<dens/2;i++)px(g,r(),r(),1,1,light)}
function drawTile(g,z,t,v){
 if(z=='farm'){if(t=='W'){px(g,0,0,T,T,'#4a2412');px(g,0,0,T,3,'#6a3a20');px(g,0,4,T,10,'#8fd8ff30');px(g,v%2?4:10,4,1,10,'#dff8');px(g,0,13,T,3,'#2a1208');return}
  dither(g,'#c9733d','#b05f30','#e09058',v,14);if(v==1){px(g,5,9,1,3,'#6a9a3a');px(g,6,8,1,2,'#8aba4a')}if(v==2){px(g,9,4,3,2,'#a0603a');px(g,9,4,3,1,'#d08a58')}
  if(t=='q'){px(g,2,2,12,12,'#6a3a20');px(g,3,3,10,10,'#4a2a18');[[4,4,'#ff6a9a'],[9,6,'#ffd23a'],[6,9,'#9ae8ff'],[11,11,'#ff6a9a']].forEach(([a,b,c])=>{px(g,a,b+1,1,3,'#3a8a3a');px(g,a-1,b,3,2,c)})}
  if(t=='P'){px(g,0,0,T,T,'#1a5a8a');px(g,0,0,T,2,'#2a7aaa');px(g,(v*5)%12+1,6,4,1,'#8ef');px(g,(v*7+6)%12,11,3,1,'#5ac');return}
  if(t=='X'){px(g,0,0,T,T,'#555a66');px(g,1,1,14,14,'#2a2e38');for(let i=2;i<14;i+=3)px(g,2,i,12,1,'#ffb020')}}
 else if(z=='city'){if(t=='W'){px(g,0,0,T,T,'#1a0e24');px(g,0,12,T,2,'#ff2ad8');px(g,0,14,T,2,'#600a58');return}
  const a=(v%2)?'#3a2a44':'#342540';px(g,0,0,T,T,a);px(g,0,0,T,1,'#4a3858');px(g,0,0,1,T,'#4a3858');px(g,15,0,1,T,'#251a30');px(g,0,15,T,1,'#251a30');
  if(v==3){px(g,4,4,8,8,'#0ff2');px(g,6,6,4,4,'#0ff4')}if(v==2)px(g,3,11,2,1,'#5a4868');
  if(t=='G'){px(g,0,0,T,T,'#2a3a24');px(g,2,2,12,12,'#3a5a2a');[[4,5],[10,4],[7,10],[12,11]].forEach(([a,b])=>{px(g,a,b,2,4,'#5a9a3a');px(g,a-1,b-1,4,2,'#9f6')})}
  if(t=='X'){px(g,1,1,14,14,'#0a2a2a');for(let i=2;i<14;i+=3)px(g,2,i,12,1,'#0ff')}}
 else if(z=='surf'){if(t=='R'){px(g,0,0,T,T,'#4a1424');return}const b=t=='c'?'#4a1630':'#5e1c2e';dither(g,b,shade(b,-.25),shade(b,.15),v,18);
  if(v==1){px(g,4,6,4,2,'#3a0e1c');px(g,4,6,4,1,'#7a3040')}if(v==3){px(g,10,10,2,2,'#b6f');px(g,11,10,1,1,'#fdf')}
  if(t=='V'){px(g,3,3,10,10,'#2a0a14');px(g,5,5,6,6,'#ff6a20');px(g,6,6,4,4,'#ffd060')}
  if(t=='X'){px(g,0,0,T,T,'#3a3a44');px(g,1,1,14,14,'#22222a');for(let i=2;i<14;i+=3)px(g,2,i,12,1,'#fa2')}
  if(t=='M'){px(g,0,0,T,T,'#1a0510');px(g,2,4,12,12,'#000');px(g,2,4,12,2,'#5a2030');px(g,3,0,2,16,'#6a4a2a');px(g,11,0,2,16,'#6a4a2a');px(g,3,1,10,2,'#8a6a3a')}}
 else if(z=='mine'){if(t=='R'){px(g,0,0,T,T,'#14101e');return}dither(g,'#2a2236','#1e1828','#3a3048',v,16);
  if(t=='u'||t=='v'){px(g,3,0,2,T,'#8a6a3a');px(g,11,0,2,T,'#8a6a3a');for(let i=2;i<T;i+=4)px(g,3,i,10,2,'#b08a50');if(t=='v'){px(g,2,0,12,T,'#0008');px(g,3,0,2,T,'#8a6a3a');px(g,11,0,2,T,'#8a6a3a');for(let i=2;i<T;i+=4)px(g,3,i,10,2,'#b08a50')}}}
 else{// interiors
  const wood=z=='cafe'?['#6a3a2a','#5a2e20','#7a4a32']:z=='shop'?['#3a4a5a','#2e3a48','#4a5a6a']:z=='cc'?['#5a4a3a','#4a3a2e','#6a5a48']:['#8a5a3a','#7a4a2e','#9a6a48'];
  if(t=='w'){px(g,0,0,T,T,z=='shop'?'#1a2a3a':z=='cafe'?'#3a1a1a':'#c8b8a0');px(g,0,10,T,6,z=='shop'?'#0a1a2a':z=='cafe'?'#2a0a0a':'#a89878');px(g,0,10,T,1,'#0003');if(v==2&&z!='shop'){px(g,4,2,8,6,'#9ef');px(g,4,2,8,1,'#fff');px(g,7,2,1,6,'#6ab')}return}
  px(g,0,0,T,T,wood[0]);for(let i=0;i<T;i+=4){px(g,0,i,T,1,wood[1]);px(g,(i*5+v*3)%T,i+1,1,3,wood[1])}px(g,v*3%T,2,3,1,wood[2]);
  if(t=='r'){px(g,0,2,T,12,'#a03a3a');px(g,0,4,T,1,'#e8b050');px(g,0,11,T,1,'#e8b050');px(g,(v*4)%12+2,7,2,2,'#e8b050')}
  if(t=='D'){px(g,2,0,12,T,'#3a2a1a');px(g,3,1,10,T,'#ffd06a40')}}
 if(t=='D'&&(z=='farm'||z=='city')){px(g,0,0,T,T,'#2a1a14');px(g,2,0,12,T,'#5a3a24');px(g,3,1,10,14,'#7a5030');px(g,11,8,2,2,'#ffd23a');px(g,3,1,10,1,'#9a6a40')}}
// ---------- characters ----------
function drawChar(g,X,Y,look,dir,frame,o={}){// X,Y = top-left of 16x24 box; feet at Y+24
 const sk=look.skin,hr=look.hair,top=look.top,pn=look.pants,ol='#1a0f1a';const step=[0,1,0,-1][frame&3],bob=(frame&1)?-1:0;
 px(g,X+3,Y+22,10,3,'#0005');
 // legs
 const lL=dir==1||dir==3?step*2:step,rL=-lL;
 ob(g,X+5+(dir==3?lL:0),Y+17,3,5-(lL>0&&dir%2==0?1:0),pn);ob(g,X+9+(dir==1?rL:0),Y+17,3,5-(rL>0&&dir%2==0?1:0),pn);
 px(g,X+5+(dir==3?lL:0),Y+21,3,1,'#2a1a1a');px(g,X+9+(dir==1?rL:0),Y+21,3,1,'#2a1a1a');
 // body
 const by=Y+10+bob;ob(g,X+4,by,8,8,top);px(g,X+4,by,8,1,shade(top,.3));px(g,X+4,by+7,8,1,shade(top,-.35));if(dir==2)px(g,X+7,by+1,2,4,look.acc||shade(top,.4));
 if(o.suit){px(g,X+4,by+5,8,1,'#fa2');if(dir!=2)px(g,dir==1?X+3:dir==3?X+10:X+5,by+1,3,6,'#778')}
 // arms
 const aw=o.swing?0:step;if(dir!=1)ob(g,X+2,by+1+aw,2,6,top);if(dir!=3)ob(g,X+12,by+1-aw,2,6,top);
 if(dir!=1)px(g,X+2,by+6+aw,2,1,sk);if(dir!=3)px(g,X+12,by+6-aw,2,1,sk);
 // head
 const hy=Y+2+bob;ob(g,X+3,hy,10,9,sk);px(g,X+3,hy+8,10,1,shade(sk,-.2));
 if(dir==0){px(g,X+3,hy,10,8,hr);px(g,X+3,hy+7,10,1,shade(hr,-.3))}
 else{// face
  if(dir==2){px(g,X+5,hy+4,2,2,'#fff');px(g,X+9,hy+4,2,2,'#fff');px(g,X+6,hy+4,1,2,'#223');px(g,X+9,hy+4,1,2,'#223');px(g,X+4,hy+6,1,1,'#f99a');px(g,X+11,hy+6,1,1,'#f99a');px(g,X+7,hy+7,2,1,shade(sk,-.35))}
  else{const e=dir==1?X+9:X+5;px(g,e,hy+4,2,2,'#fff');px(g,dir==1?e+1:e,hy+4,1,2,'#223');px(g,dir==1?X+12:X+3,hy+5,1,2,shade(sk,-.15))}
  // hair styles
  const st=look.style;if(st!='bald'){px(g,X+3,hy-1,10,3,hr);px(g,X+3,hy-1,10,1,shade(hr,.3));
   if(st=='bob'){px(g,X+2,hy,2,7,hr);px(g,X+12,hy,2,7,hr)}else if(st=='spiky'){px(g,X+4,hy-3,2,2,hr);px(g,X+8,hy-3,2,2,hr);px(g,X+11,hy-2,2,2,hr)}
   else if(st=='long'){px(g,X+2,hy,2,10,hr);px(g,X+12,hy,2,10,hr)}else if(st=='cap'){px(g,X+2,hy-1,12,3,look.acc);px(g,dir==3?X:X+10,hy+1,6,1,look.acc)}
   if(dir==1)px(g,X+3,hy,3,5,hr);if(dir==3)px(g,X+10,hy,3,5,hr)}else{px(g,X+3,hy,10,1,shade(sk,.25))}
  if(st=='beard'){px(g,X+4,hy+6,8,4,hr);px(g,X+3,hy,10,1,shade(sk,.2))}}
 if(o.suit){g.strokeStyle='#bff9';g.lineWidth=1;g.beginPath();g.arc(X+8,hy+4,7.5,0,6.3);g.stroke();px(g,X+5,hy-2,3,1,'#fff8')}
 if(o.carry){const c=o.carry;ob(g,X+5,Y-6+bob,6,6,c);px(g,X+6,Y-5+bob,2,2,'#fff8')}}
function drawPortrait(g,X,Y,look,s=3){const c=document.createElement('canvas');c.width=16;c.height=14;const q=c.getContext('2d');drawChar(q,0,0,look,2,0);g.imageSmoothingEnabled=false;g.drawImage(c,0,0,16,14,X,Y,16*s,14*s)}
// ---------- robot ----------
function drawRobot(g,X,Y,t){const b=Math.sin(t/8)*1;px(g,X+3,Y+14,10,3,'#0005');ob(g,X+3,Y+3+b,10,9,'#c8ccd8');px(g,X+3,Y+3+b,10,2,'#eef');ob(g,X+5,Y+5+b,6,3,'#123');px(g,X+6,Y+6+b,1,1,t%40<20?'#0ff':'#088');px(g,X+9,Y+6+b,1,1,'#0ff');
 px(g,X+7,Y-1+b,2,4,'#99a');px(g,X+7,Y-2+b,2,1,t%30<15?'#f40':'#a20');ob(g,X+4,Y+12,3,2,'#556');ob(g,X+9,Y+12,3,2,'#556')}
// ---------- crops ----------
function drawCrop(g,X,Y,c,st,wilt){const C=CROPS[c],L=wilt?'#8a6a3a':'#5bbf3a',D=wilt?'#6a4a2a':'#3a8a2a',F=wilt?shade(C.c,-.5):C.c;
 if(st<.25){px(g,X+7,Y+9,2,4,D);px(g,X+5,Y+8,3,2,L);px(g,X+8,Y+7,3,2,L);return}
 if(st<.6){px(g,X+7,Y+5,2,9,D);px(g,X+3,Y+6,4,3,L);px(g,X+9,Y+4,4,3,L);px(g,X+4,Y+10,3,2,L);return}
 if(st<1){px(g,X+7,Y+2,2,12,D);px(g,X+2,Y+4,5,3,L);px(g,X+9,Y+2,5,3,L);px(g,X+3,Y+9,4,3,L);px(g,X+9,Y+8,4,3,L);if(C.shape=='flower'||C.shape=='berry')px(g,X+7,Y+1,2,2,shade(C.c,.3));return}
 switch(C.shape){case 'root':px(g,X+3,Y+2,10,6,L);px(g,X+5,Y,6,3,D);ob(g,X+4,Y+9,8,5,F);px(g,X+5,Y+10,3,1,shade(F,.4));break;
  case 'leaf':ob(g,X+2,Y+5,12,9,F);px(g,X+4,Y+3,8,4,shade(F,.25));px(g,X+7,Y+5,2,8,C.c2);break;
  case 'grain':for(let i=0;i<4;i++){px(g,X+2+i*3,Y+3,1,11,D);ob(g,X+1+i*3,Y+1,3,5,F)}break;
  case 'berry':px(g,X+2,Y+3,12,10,L);[[3,4],[9,3],[6,8],[10,9],[4,10]].forEach(([a,b])=>{ob(g,X+a,Y+b,3,3,F);px(g,X+a,Y+b,1,1,'#fff')});break;
  case 'vine':px(g,X+7,Y,2,14,D);px(g,X+3,Y+2,10,6,L);[[3,6],[9,4],[6,10]].forEach(([a,b])=>{ob(g,X+a,Y+b,4,4,F);px(g,X+a,Y+b,2,1,shade(F,.4))});break;
  case 'melon':px(g,X+1,Y+3,6,4,L);ob(g,X+3,Y+6,11,8,F);for(let i=4;i<14;i+=3)px(g,X+i,Y+6,1,8,C.c2);px(g,X+4,Y+7,3,2,'#fff8');break;
  case 'flower':px(g,X+7,Y+5,2,9,D);px(g,X+3,Y+9,4,2,L);[[7,0],[3,4],[11,4],[7,7]].forEach(([a,b])=>ob(g,X+a-1,Y+b,4,4,F));px(g,X+7,Y+4,2,2,'#fff');break;
  case 'cactus':ob(g,X+6,Y+2,4,12,F);ob(g,X+2,Y+5,3,5,F);ob(g,X+11,Y+4,3,5,F);px(g,X+7,Y+3,1,10,shade(F,.3));px(g,X+7,Y,2,2,'#ff6ad8');break}}
// ---------- item icons ----------
function drawIcon(g,id,X,Y){const it=ITEMS[id],c=it.c;
 if(id=='hoe'){px(g,X+3,Y+4,2,10,'#8a5a3a');ob(g,X+3,Y+2,8,3,c)}else if(id=='can'){ob(g,X+3,Y+6,8,7,c);px(g,X+11,Y+5,3,2,c);ob(g,X+4,Y+3,5,2,'#48a')}
 else if(id=='rod'){g.strokeStyle='#ddd';g.beginPath();g.moveTo(X+13,Y+2);g.lineTo(X+13,Y+12);g.stroke();px(g,X+2,Y+12,3,3,'#555');for(let i=0;i<11;i++)px(g,X+3+i,Y+12-i,1,2,'#c8964a');px(g,X+12,Y+12,3,2,'#f44')}
 else if(id=='lance'){for(let i=0;i<12;i++)px(g,X+2+i,Y+13-i,2,2,i>8?'#6ff':'#889');px(g,X+12,Y+1,3,3,'#fff')}else if(id=='hammer'){px(g,X+7,Y+5,2,10,'#8a5a3a');ob(g,X+2,Y+1,12,6,'#fa4');px(g,X+3,Y+2,10,1,'#fff8');px(g,X+7,Y+3,2,2,'#40f')}
 else if(id=='egg'){ob(g,X+5,Y+4,6,9,'#f4ead8');px(g,X+6,Y+5,2,3,'#fff')}else if(id=='milk'){ob(g,X+5,Y+3,6,11,'#f8f0ff');px(g,X+5,Y+3,6,2,'#c44');px(g,X+6,Y+7,4,4,'#fcd')}
 else if(id=='pick'){px(g,X+7,Y+3,2,11,'#8a5a3a');ob(g,X+2,Y+2,12,2,c);px(g,X+1,Y+4,2,2,c);px(g,X+13,Y+4,2,2,c)}else if(id=='blade'){ob(g,X+7,Y+1,3,9,c);px(g,X+8,Y+2,1,7,'#fff');ob(g,X+5,Y+11,7,2,'#666');px(g,X+7,Y+13,3,2,'#333')}
 else if(it.seed){ob(g,X+3,Y+2,10,12,'#e8dcc0');px(g,X+3,Y+2,10,3,'#c8bca0');ob(g,X+6,Y+7,4,4,c);px(g,X+5,Y+12,6,1,'#a89878')}
 else if(it.crop){drawCrop(g,X,Y+1,id,1,0)}
 else if(['iron','crys','cob','pla','frz'].includes(id)){ob(g,X+3,Y+5,10,8,shade(c,-.3));px(g,X+4,Y+4,4,6,c);px(g,X+8,Y+3,4,7,c);px(g,X+5,Y+5,1,3,'#fff8')}
 else if(id=='spr'||id=='qspr'){ob(g,X+5,Y+8,6,6,'#667');ob(g,X+3,Y+5,10,3,c);px(g,X+7,Y+2,2,3,'#9cf');if(id=='qspr')px(g,X+2,Y+4,12,1,'#ffd23a')}
 else if(id=='pendant'){g.strokeStyle='#fd6';g.beginPath();g.arc(X+8,Y+5,4,0,3.2,true);g.stroke();ob(g,X+6,Y+8,4,5,c);px(g,X+7,Y+9,1,2,'#fff')}
 else if(id=='core'){ob(g,X+4,Y+3,8,10,'#4ad8ff');px(g,X+6,Y+5,4,6,'#fff');px(g,X+7,Y+1,2,14,'#bff8')}
 else{ob(g,X+3,Y+4,10,9,c);px(g,X+4,Y+5,3,2,'#fff6');px(g,X+3,Y+12,10,1,shade(c,-.4))}}
