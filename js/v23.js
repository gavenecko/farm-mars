// ===== v26: crisp hi-DPI rendering, textured tiles, HD anime sprites =====
(function(){
// ---------- textures (generated detail maps, blended with 'overlay') ----------
const TEX={},TN=['regolith','rock','metal','grass','wood'];let texReady=0;
for(const n of TN){const im=new Image();im.onload=()=>{TEX[n]=im;if(++texReady==TN.length){for(const k in TC)delete TC[k];for(const k in BGK)delete BGK[k]}};im.src='assets/tex/'+n+'.webp?v=26b'}
const INZ=z=>!OUTZ(z)&&z!='farm'&&z!='city';
function texFor(z,base){const d=base.getContext('2d').getImageData(0,0,T,T).data;let r=0,g=0,b=0,a=0;for(let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];a+=d[i+3]}const n=d.length/4;r/=n;g/=n;b/=n;a/=n;if(a<200)return null;
 const mx=Math.max(r,g,b),mn=Math.min(r,g,b),sat=mx?(mx-mn)/mx:0;if(b>r+12&&b>g)return null;// water/glass/screens
 if(g>r+6&&g>b)return['grass',.55];if(z=='mine'||z=='ruins'||z=='rift')return['rock',.6];if(z=='city')return['metal',.5];if(sat<.22)return['metal',.45];if(INZ(z)&&r>g&&g>b&&sat<.7)return['wood',.5];return[(z=='farm'||OUTZ(z))?'regolith':'rock',.55]}
const TX=2,TEXON={on:localStorage.fmTex!='0'};window.FM23TEX=TEXON;// tiles are cached at 2x resolution
tileImg=function(zone,t,v){const k=zone+t+v;if(TC[k])return TC[k];const b=document.createElement('canvas');b.width=b.height=T;drawTile(b.getContext('2d'),zone,t,v);
 const c=document.createElement('canvas');c.width=c.height=T*TX;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(b,0,0,T*TX,T*TX);
 const tf=TEXON.on&&texReady==TN.length&&texFor(zone,b);if(tf){const im=TEX[tf[0]],h=hash(t.charCodeAt(0)*13+v*7,v*31+zone.length)%200;g.globalCompositeOperation='overlay';g.globalAlpha=tf[1];g.drawImage(im,h%(256-32),(h*7)%(256-32),32,32,0,0,T*TX,T*TX);
  g.globalCompositeOperation='source-atop';g.globalAlpha=1;const gr=g.createLinearGradient(0,0,0,T*TX);gr.addColorStop(0,'rgba(255,255,255,.05)');gr.addColorStop(1,'rgba(0,0,0,.07)');g.fillStyle=gr;g.fillRect(0,0,T*TX,T*TX);g.globalCompositeOperation='source-over'}
 c._base=b;TC[k]=c;return c};
window.FM23T={TEX,texFor,ready:()=>texReady==TN.length};
// ---------- HD chibi-anime sprites (vector, 4x) ----------
const SC=4,DES={
 ava:{eye:'#3aa04a',hair:'bob',goggles:1,straps:'#6a3a1a',zip:'#8ad0d0'},
 kai:{eye:'#7a4a2a',hair:'spiky',apron:'#f4f0ec'},
 kid:{eye:'#b0701a',hair:'bob',tee:1},
 mo:{eye:'#7a4a2a',hair:'beard',lamp:1,straps:'#5a3a24'},
 nyx:{eye:'#c8a040',hair:'side',streak:'#3a8aff',collar:1},
 pip:{eye:'#3ab04a',hair:'spiky',scarf:'#d02a2a'},
 ruiz:{eye:'#3a9a6a',hair:'slick',coat:'#f2f2f0',tie:'#2a8a5a'},
 theo:{eye:'#7a4a2a',hair:'wavy',glasses:1,vest:1,shirt:'#f4ecd8',straps:'#6a3a1a'},
 vega:{eye:'#d0a020',hair:'short',beret:'#7a1a3a',sash:'#e0b040'},
 you:{eye:'#2aa080',hair:'cap',cap:'#2f6a4a',scarf:'#ff9a2a',straps:'#6a3a1a'},
 zara:{eye:'#1fb8a0',hair:'long',neon:1}};
const HC=new Map();
function hdSprite(look,dir,frame,suit,swing){const w=FM13.whoOf(look),d=DES[w]||DES.kid;const key=w+look.skin+look.hair+look.top+look.pants+look.style+(look.hat||'')+dir+frame+(swing?1:0)+(suit?'S':'');let c=HC.get(key);if(c)return c;
 c=document.createElement('canvas');c.width=18*SC;c.height=27*SC;c._hd=SC;const g=c.getContext('2d');g.scale(SC,SC);g.lineJoin=g.lineCap='round';
 const side=dir==1||dir==3,F=dir==2,B=dir==0;if(dir==3){g.translate(18,0);g.scale(-1,1)}
 const sk=look.skin,hr=look.hair,tp=suit?'#e4e8ee':look.top,pn=suit?'#a4acb8':(look.pants||'#333'),ph=[0,1,0,-1][frame&3],bob=(frame&1)?.6:0;
 const OL=c=>shade(c,-.55),LW=.55;
 const shape=(f,fill,stroke=(typeof fill=='string'?OL(fill):OL(tp)),lw=LW)=>{g.beginPath();f();g.fillStyle=fill;g.fill();if(stroke){g.lineWidth=lw;g.strokeStyle=stroke;g.stroke()}};
 const el=(x,y,rx,ry)=>()=>g.ellipse(x,y,rx,ry,0,0,Math.PI*2);
 const rr=(x,y,w2,h2,r)=>()=>{g.roundRect?g.roundRect(x,y,w2,h2,r):g.rect(x,y,w2,h2)};
 const grad=(c1,x0,x1)=>{const gr=g.createLinearGradient(x0,0,x1,0);gr.addColorStop(0,shade(c1,.18));gr.addColorStop(.55,c1);gr.addColorStop(1,shade(c1,-.25));return gr};
 const hy=6.4+bob,hx=side?9.6:9;// head centre
 // long hair behind body
 if(!suit&&(d.hair=='long')){shape(()=>{g.moveTo(hx-6.6,hy);g.quadraticCurveTo(hx-7.6,hy+10,hx-5,hy+13.5);g.lineTo(hx+5,hy+13.5);g.quadraticCurveTo(hx+7.6,hy+10,hx+6.6,hy)},shade(hr,-.12))}
 // legs
 const shoe=suit?'#5a6070':'#2a1a24',ly=19.2+bob*.3;
 if(side){shape(rr(7.6+ph*.9,ly,2.6,4.6,1.1),shade(pn,-.2));shape(rr(8.2-ph*.9,ly,2.6,4.6,1.1),pn);shape(el(9.6-ph*.9,24.2,2,1.1),shoe);shape(el(9+ph*.9,24.2,2,1.1),shade(shoe,-.2))}
 else{const l=ph>0?.8:0,r2=ph<0?.8:0;shape(rr(6.1,ly,2.7,4.8-l,1.1),pn);shape(rr(9.2,ly,2.7,4.8-r2,1.1),shade(pn,-.15));shape(el(7.3,24.1-l,1.9,1.1),shoe);shape(el(10.7,24.1-r2,1.9,1.1),shoe)}
 // torso
 const by=13.2+bob,bw=side?7:8.4,bx=(side?9.4:9)-bw/2,bh=d.coat?8.4:6.8;
 const arm=(x,y,s,col)=>{shape(rr(x,y,2.3,5.2,1.1),col);shape(el(x+1.15,y+5.4,1.15,1.05),sk)};
 const sw=swing?0:ph;
 if(!side)arm(bx-1.6,by+.6-sw*.7,1,shade(tp,-.05));
 shape(()=>{g.moveTo(bx+.8,by);g.lineTo(bx+bw-.8,by);g.quadraticCurveTo(bx+bw+.3,by+.4,bx+bw+.3,by+2);g.lineTo(bx+bw+.4,by+bh);g.lineTo(bx-.4,by+bh);g.lineTo(bx-.3,by+2);g.quadraticCurveTo(bx-.3,by+.4,bx+.8,by)},grad(tp,bx,bx+bw));
 if(!suit&&!B){const cx2=bx+bw/2,FX=F?cx2:bx+bw*.62;
  if(d.apron){shape(rr(F?cx2-2.8:bx+bw-3.4,by+1.2,F?5.6:3.2,bh+.4,.8),d.apron);if(F){g.strokeStyle=d.apron;g.lineWidth=.6;g.beginPath();g.moveTo(cx2-2.4,by+1.4);g.lineTo(cx2-1.6,by-.2);g.moveTo(cx2+2.4,by+1.4);g.lineTo(cx2+1.6,by-.2);g.stroke()}}
  if(d.straps){g.strokeStyle=d.straps;g.lineWidth=.8;g.beginPath();if(F){g.moveTo(bx+1.6,by);g.lineTo(bx+1.9,by+bh);g.moveTo(bx+bw-1.6,by);g.lineTo(bx+bw-1.9,by+bh)}else{g.moveTo(FX,by);g.lineTo(FX,by+bh)}g.stroke()}
  if(d.zip&&F){g.strokeStyle=d.zip;g.lineWidth=.45;g.beginPath();g.moveTo(cx2,by+.6);g.lineTo(cx2,by+bh-.3);g.stroke()}
  if(d.vest&&F){shape(()=>{g.moveTo(cx2-1.4,by);g.lineTo(cx2+1.4,by);g.lineTo(cx2,by+4)},d.shirt,null)}
  if(d.coat){shape(()=>{g.moveTo(F?cx2-1.5:FX-.6,by);g.lineTo(F?cx2+1.5:FX+1,by);g.lineTo(F?cx2+.9:FX+.8,by+bh);g.lineTo(F?cx2-.9:FX-.4,by+bh)},'#dcd8d0',null);if(F){shape(()=>{g.moveTo(cx2-.6,by+.3);g.lineTo(cx2+.6,by+.3);g.lineTo(cx2+.4,by+4.4);g.lineTo(cx2,by+5);g.lineTo(cx2-.4,by+4.4)},d.tie,null);g.strokeStyle='#5a6a7a';g.lineWidth=.45;g.beginPath();g.arc(cx2,by+1.4,2.6,.4,Math.PI-.4);g.stroke()}}
  if(d.sash){g.strokeStyle=d.sash;g.lineWidth=.9;g.beginPath();g.moveTo(bx+.6,by+.6);g.lineTo(bx+bw-.4,by+bh-.6);g.stroke()}
  if(d.neon){g.lineWidth=.6;g.strokeStyle='#ff3ad0';g.beginPath();g.moveTo(F?cx2-1:FX,by+.3);g.lineTo(F?cx2-1:FX,by+bh);g.stroke();if(F){g.strokeStyle='#3af0ff';g.beginPath();g.moveTo(cx2+1,by+.3);g.lineTo(cx2+1,by+bh);g.stroke()}}
  if(d.collar){shape(rr(F?cx2-2.6:FX-1.4,by-.6,F?5.2:3,1.6,.6),shade(tp,.2));if(F){g.fillStyle=look.acc||'#3af0ff';g.fillRect(cx2-.3,by+1.6,.6,bh-2.2)}}
  if(d.tee&&F){shape(el(cx2,by+2.4,1.3,1.3),'#e04a4a',null)}
  if(d.scarf){shape(()=>{g.moveTo(bx+.2,by-.3);g.lineTo(bx+bw-.2,by-.3);g.lineTo(bx+bw-.6,by+1.5);g.lineTo(bx+.6,by+1.5)},d.scarf);if(F)shape(()=>{g.moveTo(cx2-1.2,by+1.3);g.lineTo(cx2+1.2,by+1.3);g.lineTo(cx2,by+3.6)},shade(d.scarf,-.1))}}
 if(suit){g.fillStyle='#ff9a2a';g.fillRect(bx,by+3,bw,.8);if(F){g.fillStyle='#5adfff';g.fillRect(bx+bw/2-1,by+1,1.2,.8);g.fillStyle='#ff5a5a';g.fillRect(bx+bw/2+.6,by+1,.8,.8)}if(B){shape(rr(bx+1,by+.4,bw-2,bh-1,1),'#7a8494')}}
 if(side)arm(bx+bw/2-1.2+(swing?1.4:-sw*.9),by+.6-(swing?1.6:0),1,shade(tp,-.1));else arm(bx+bw-.7,by+.6+sw*.7,1,shade(tp,-.18));
 // head
 const hd=shade(hr,-.28),hl=shade(hr,.35);
 if(!suit&&d.hair=='bob'&&!B){shape(()=>{g.moveTo(hx-6.9,hy-1);g.quadraticCurveTo(hx-7.6,hy+5,hx-5.6,hy+6.4);g.lineTo(hx+5.6,hy+6.4);g.quadraticCurveTo(hx+7.6,hy+5,hx+6.9,hy-1)},hd)}
 shape(el(hx,hy+.6,side?6.1:6.5,6),sk,shade(sk,-.45));
 if(!B){// face
  const eye=(x,y)=>{shape(el(x,y,1.25,1.75),d.eye,shade(d.eye,-.6),.35);shape(el(x,y+.35,.6,.9),shade(d.eye,-.55),null);g.fillStyle='#fff';g.beginPath();g.arc(x-.42,y-.6,.45,0,7);g.fill();g.fillRect(x+.2,y+.8,.35,.35);g.strokeStyle='#1a0f1a';g.lineWidth=.55;g.beginPath();g.moveTo(x-1.45,y-1.55);g.quadraticCurveTo(x,y-2.25,x+1.45,y-1.4);g.stroke()};
  if(F){eye(hx-2.6,hy+2.1);eye(hx+2.6,hy+2.1);g.fillStyle='#f7a0a888';g.beginPath();g.ellipse(hx-4,hy+4,1.2,.6,0,0,7);g.ellipse(hx+4,hy+4,1.2,.6,0,0,7);g.fill();g.strokeStyle=shade(sk,-.5);g.lineWidth=.4;g.beginPath();g.arc(hx,hy+4.2,.7,.3,Math.PI-.3);g.stroke()}
  else{eye(hx+3,hy+2.1);g.fillStyle='#f7a0a888';g.beginPath();g.ellipse(hx+4.2,hy+4,1,.55,0,0,7);g.fill();g.strokeStyle=shade(sk,-.5);g.lineWidth=.4;g.beginPath();g.moveTo(hx+4.6,hy+4.6);g.lineTo(hx+5.3,hy+4.5);g.stroke();shape(el(hx-1.4,hy+1.8,.9,1.2),shade(sk,-.08))}
  if(d.glasses){g.strokeStyle='#5a3a2a';g.lineWidth=.4;g.beginPath();if(F){g.arc(hx-2.6,hy+2.1,1.9,0,7);g.moveTo(hx+4.5,hy+2.1);g.arc(hx+2.6,hy+2.1,1.9,0,7);g.moveTo(hx-.7,hy+1.8);g.lineTo(hx+.7,hy+1.8)}else{g.arc(hx+3,hy+2.1,1.9,0,7)}g.stroke()}}
 // hair
 const cap=(top,col)=>shape(()=>{g.moveTo(hx-6.9,hy+top);g.bezierCurveTo(hx-7,hy-8.2,hx+7,hy-8.2,hx+6.9,hy+top);g.closePath()},col);
 if(!suit){
  if(d.hair=='beard'){cap(-1.2,hr);if(!B){shape(()=>{g.moveTo(hx-5.6,hy+2.4);g.quadraticCurveTo(hx-5.4,hy+9.6,hx+(side?2.4:0),hy+10.4);g.quadraticCurveTo(hx+5.4,hy+9.6,hx+5.8,hy+2.4);g.quadraticCurveTo(hx+(side?3:0),hy+4.6,hx-5.6,hy+2.4)},hr);g.strokeStyle=shade(sk,-.5);g.lineWidth=.4;g.beginPath();g.moveTo(hx-1+(side?3:0),hy+5.4);g.lineTo(hx+1+(side?3:0),hy+5.4);g.stroke()}}
  else if(d.hair=='slick'){cap(-.8,hr);g.strokeStyle=hl;g.lineWidth=.4;g.beginPath();g.moveTo(hx-4,hy-3.6);g.quadraticCurveTo(hx,hy-6,hx+4,hy-4);g.stroke()}
  else{cap(B?3.5:-.2,hr);
   if(!B){// bangs
    const tips=side?[[-6.4,4.2],[-3.8,2.6],[-1.4,3.4],[1,1.6],[3.6,.4],[5.4,.2]]:[[-6.5,4.6],[-4.3,2.6],[-2,3.4],[0,1.7],[2,3.4],[4.3,2.6],[6.5,4.6]];
    shape(()=>{g.moveTo(hx-6.9,hy);for(let i=0;i<tips.length;i++){const[tx,ty]=tips[i];g.lineTo(hx+tx,hy+ty);if(i<tips.length-1)g.lineTo(hx+(tx+tips[i+1][0])/2,hy-1.6)}g.lineTo(hx+6.9,hy-.4);g.bezierCurveTo(hx+7,hy-8.2,hx-7,hy-8.2,hx-6.9,hy)},hr)}
   if(d.hair=='spiky'){for(const[x,y,a]of[[-4,-5.6,-.6],[0,-6.8,0],[4,-5.6,.6],[6.4,-2.6,1.2],[-6.4,-2.6,-1.2]])shape(()=>{g.moveTo(hx+x-1.6,hy+y+2.2);g.lineTo(hx+x+Math.sin(a)*3.2,hy+y-1.8);g.lineTo(hx+x+1.6,hy+y+2.2)},hr)}
   if(d.hair=='long'&&!B){shape(()=>{g.moveTo(hx-6.9,hy);g.quadraticCurveTo(hx-7.8,hy+7,hx-6,hy+12);g.lineTo(hx-4.6,hy+5);g.closePath()},hr);if(F)shape(()=>{g.moveTo(hx+6.9,hy);g.quadraticCurveTo(hx+7.8,hy+7,hx+6,hy+12);g.lineTo(hx+4.6,hy+5);g.closePath()},hd)}
   if(d.hair=='side'&&!B){shape(()=>{g.moveTo(hx-6.9,hy-1);g.quadraticCurveTo(hx-7.4,hy+5,hx-5.4,hy+7);g.lineTo(hx-3.6,hy+2);g.closePath()},hr);g.strokeStyle=d.streak;g.lineWidth=.9;g.beginPath();g.moveTo(hx+1,hy-5.6);g.quadraticCurveTo(hx-2,hy-1,hx-3.4,hy+3);g.stroke()}
   if(d.hair=='wavy'){g.strokeStyle=hd;g.lineWidth=.35;g.beginPath();g.moveTo(hx-3,hy-5);g.quadraticCurveTo(hx-1,hy-3,hx-2,hy-1);g.moveTo(hx+2,hy-5.4);g.quadraticCurveTo(hx+3.6,hy-3,hx+2.6,hy-1.2);g.stroke()}
   if(B&&d.hair=='bob')shape(()=>{g.moveTo(hx-6.9,hy+2);g.quadraticCurveTo(hx,hy+8.4,hx+6.9,hy+2);g.lineTo(hx+6.9,hy+5.6);g.quadraticCurveTo(hx,hy+8.8,hx-6.9,hy+5.6)},hr)
  }
  // shine
  g.strokeStyle=hl;g.lineWidth=.7;g.beginPath();g.arc(hx-.6,hy-1.6,4.4,Math.PI*1.12,Math.PI*1.42);g.stroke();
  // headwear from design (no cosmetic hat)
  if(!look.hat){
   if(d.cap){cap(-2.2,d.cap);shape(()=>{const s=side?1:0;g.ellipse(hx+(side?4.8:0),hy-1.6,side?3.4:6.8,side?1.1:1.5,0,Math.PI*(s?1.9:0),Math.PI*(s?1.1:1))},shade(d.cap,-.15));if(!B){g.fillStyle='#ffd23a';g.beginPath();const sx=hx+(side?1.4:0),sy=hy-4.4;for(let i=0;i<10;i++){const r3=i%2?.5:1.2,a=-Math.PI/2+i*Math.PI/5;g.lineTo(sx+Math.cos(a)*r3,sy+Math.sin(a)*r3)}g.fill()}}
   if(d.beret){shape(el(hx-.6,hy-4.6,6.6,2.6),d.beret);if(!B){g.fillStyle=d.sash;g.beginPath();g.arc(hx+(side?2:.8),hy-4.8,.9,0,7);g.fill()}}
   if(d.goggles){g.strokeStyle='#5a3a2a';g.lineWidth=.8;g.beginPath();g.moveTo(hx-6.6,hy-2.4);g.quadraticCurveTo(hx,hy-4.6,hx+6.6,hy-2.4);g.stroke();if(!B)for(const ex of side?[3]:[-2.4,2.4]){shape(el(hx+ex,hy-3.6,1.7,1.4),'#4a3020');shape(el(hx+ex,hy-3.6,1.1,.9),'#7ad0ff',null)}}
   if(d.lamp){g.strokeStyle='#3a2a1a';g.lineWidth=.8;g.beginPath();g.moveTo(hx-6.6,hy-2);g.quadraticCurveTo(hx,hy-4.2,hx+6.6,hy-2);g.stroke();if(!B){shape(rr(hx+(side?2:-1.4),hy-4.8,2.8,2,.5),'#c8b070');shape(el(hx+(side?3.4:0),hy-3.8,.7,.7),'#fffbd0',null)}}}
 }
 if(suit){g.fillStyle='rgba(180,240,255,.28)';g.strokeStyle='rgba(220,250,255,.85)';g.lineWidth=.5;g.beginPath();g.ellipse(hx,hy+.4,8,7.6,0,0,7);g.fill();g.stroke();
  // hair visible inside helmet
  cap(-.2,hr);g.fillStyle='rgba(255,255,255,.75)';g.beginPath();g.ellipse(hx-3.6,hy-3.8,1.6,.8,-.6,0,7);g.fill()}
 if(look.hat&&FM21.hatPix){const hatPix=FM21.hatPix;const t=document.createElement('canvas');t.width=18;t.height=27;const q=t.getContext('2d'),fl=dir==3;hatPix((x,y,w2,h2,col)=>{const yy=y-(suit?1:0);if(yy+h2>0)px(q,fl?17-x-w2:x,Math.max(0,yy),w2,h2-(yy<0?-yy:0),col)},look.hat,(frame&1)?1:0,dir);g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=false;g.drawImage(t,0,-1.6*SC,18*SC,27*SC)}
 if(HC.size>900)HC.clear();HC.set(key,c);return c}
{const _cs=charSprite;charSprite=function(look,dir,frame,suit,swing){if(!look||look.small||!window.FM13||!HD.on)return _cs.apply(this,arguments);try{return hdSprite(look,dir,frame,suit,swing)}catch(e){console.error(e);HD.on=false;return _cs.apply(this,arguments)}}}
const HD={on:true};
// draw any sprite canvas into its 18x27 world footprint, smoothly
{const _dc=drawChar;drawChar=function(g,X,Y,look,dir,frame,o={}){if(!look||!look.skin||look.small||!HD.on)return _dc.apply(this,arguments);const f=frame&3;
 px(g,X+3,Y+22,11,3,'#0005');px(g,X+2,Y+23,13,1,'#0003');const s=charSprite(look,dir,f,o.suit,o.swing),sm=g.imageSmoothingEnabled;g.imageSmoothingEnabled=true;g.drawImage(s,X-1,Y-2,18,27);g.imageSmoothingEnabled=sm;
 if(o.carry){const c=o.carry,b=(f&1)?1:0;ob(g,X+5,Y-6+b,6,6,c);px(g,X+6,Y-5+b,2,2,'#fff8')}}}
{const _bg=bgCache;bgCache=function(z,m){const c=_bg(z,m);if(c&&z=='farm'&&!c._dome){c._dome=1;const g=c.getContext('2d');g.save();g.setTransform(c._s||1,0,0,c._s||1,0,0);g.strokeStyle='rgba(255,230,200,.07)';g.lineWidth=1;const X=16*T,Y=11*T;for(let i=1;i<=6;i++){g.beginPath();g.ellipse(X,Y,16*T*i/6,11*T,0,0,6.3);g.stroke()}for(let i=1;i<6;i++){g.beginPath();g.ellipse(X,Y,16*T,11*T*i/6,0,0,6.3);g.stroke()}g.restore()}return c}}
// prewarm the HD sprite cache in small idle batches so walking NPCs never build sprites mid-frame
function prewarm(){const Q=[];const looks=()=>[PLOOK,...NPCS.map(n=>n.look)].filter(l=>l&&l.skin&&!l.small);
 const fill=()=>{for(const L of looks())for(let d=0;d<4;d++)for(let f=0;f<4;f++){Q.push([L,d,f,0,0]);if(L===PLOOK){Q.push([L,d,f,1,0]);Q.push([L,d,f,0,1])}}};fill();
 const step=()=>{const t=performance.now();while(Q.length&&performance.now()-t<4){const a=Q.shift();try{charSprite(...a)}catch(e){}}if(Q.length)setTimeout(step,30);else PW.done=true};setTimeout(step,200)}
const PW={done:false};setTimeout(prewarm,300);
window.FM23={PW,domeBaked:true,hdSprite,DES,HD,HC,K:()=>window.__K||1};
})();
// ---------- render pipeline: world canvas at moderate res + full-device-res text overlay ----------
(function(){const P=CanvasRenderingContext2D.prototype,raw={};for(const n of['fillRect','drawImage','fillText','strokeText','fill','stroke','clearRect','putImageData','strokeRect','getImageData','save','restore','clip','beginPath','rect'])raw[n]=P[n];
 // text overlay canvas
 const tc=document.createElement('canvas');tc.id='txt';tc.style.cssText='position:absolute;pointer-events:none;z-index:1;image-rendering:auto';cv.after(tc);const tx=tc.getContext('2d');let KT=1,KW=1,dirty=false;
 function sizeT(){const dpr=window.devicePixelRatio||1;KT=Math.max(1,S*dpr);if(W*H*KT*KT>4.2e6)KT=Math.sqrt(4.2e6/(W*H));tc.width=Math.round(W*KT);tc.height=Math.round(H*KT);for(const k of['left','top','width','height'])tc.style[k]=cv.style[k];KW=cv.width/W}
 addEventListener('resize',()=>setTimeout(sizeT,0));addEventListener('orientationchange',()=>setTimeout(sizeT,260));sizeT();
 const TXT={on:true};let clips=[],rects=[];
 let TV=0,MC=null,MV=-1;const curM=()=>{if(MV!==TV){MC=cx.getTransform();MV=TV}return MC};
 for(const n of['translate','scale','rotate','setTransform','resetTransform','transform']){const f=P[n];cx[n]=function(...a){TV++;return f.apply(cx,a)}}
 const mtx=()=>{const m=curM(),r=KT/KW;tx.setTransform(m.a*r,m.b*r,m.c*r,m.d*r,m.e*r,m.f*r)};
 let TB=[];// text boxes in device px of the world canvas
 const alphaOf=st=>{if(typeof st!='string')return 1;if(st[0]=='#')return st.length==9?parseInt(st.slice(7),16)/255:1;const m=st.match(/rgba?\(([^)]*)\)/);if(!m)return 1;const p=m[1].split(',');return p.length>3?+p[3]:1};
 // batch full-screen translucent layers (tints/darkness) into one low-res blit
 const bc=document.createElement('canvas');bc.width=W;bc.height=H;const bx=bc.getContext('2d');let pend=false;
 const flush=()=>{if(!pend)return;pend=false;raw.drawImage.call(cx,bc,0,0,W,H);bx.clearRect(0,0,W,H)};
 const full=(x,y,w,h)=>{if(!(x<=0&&y<=0&&x+w>=W&&y+h>=H))return false;const m=cx.getTransform();return!m.b&&!m.c&&Math.abs(m.e)<1e-6&&Math.abs(m.f)<1e-6&&Math.abs(m.a*W-cv.width)<1e-3};
 const ok=()=>cx.globalCompositeOperation=='source-over';
 const cover=(x,y,w,h)=>{if(!TXT.on||!dirty)return;const m=curM();if(m.b||m.c)return;let x0=m.a*x+m.e,y0=m.d*y+m.f,x1=x0+m.a*w,y1=y0+m.d*h;if(x1<x0)[x0,x1]=[x1,x0];if(y1<y0)[y0,y1]=[y1,y0];let hit=false;for(const b of TB)if(b[0]<x1&&b[2]>x0&&b[1]<y1&&b[3]>y0){hit=true;break}if(!hit)return;if(cx.globalAlpha*alphaOf(cx.fillStyle)<.75||!ok())return;mtx();raw.clearRect.call(tx,x,y,w,h)};
 cx.fillRect=function(x,y,w,h){if(w>=W&&h>=H&&ok()&&full(x,y,w,h)){if(typeof cx.fillStyle!='string'||alphaOf(cx.fillStyle)*cx.globalAlpha<.75){bx.globalAlpha=cx.globalAlpha;bx.fillStyle=cx.fillStyle;raw.fillRect.call(bx,0,0,W,H);bx.globalAlpha=1;pend=true;return}}if(pend)flush();if(dirty&&TB.length)cover(x,y,w,h);return raw.fillRect.call(cx,x,y,w,h)};
 cx.drawImage=function(im,...a){if(im===lc&&ok()&&a.length==2&&a[0]==0&&a[1]==0){bx.globalAlpha=cx.globalAlpha;raw.drawImage.call(bx,lc,0,0);bx.globalAlpha=1;pend=true;return}if(pend)flush();return raw.drawImage.call(cx,im,...a)};
 const T2=(n)=>function(s,x,y,...a){flush();if(!TXT.on)return raw[n].call(cx,s,x,y,...a);mtx();tx.font=cx.font;tx.textAlign=cx.textAlign;tx.textBaseline=cx.textBaseline;tx.globalAlpha=cx.globalAlpha;tx[n=='fillText'?'fillStyle':'strokeStyle']=cx[n=='fillText'?'fillStyle':'strokeStyle'];tx.lineWidth=cx.lineWidth;dirty=true;{const m=curM(),fs=parseFloat(cx.font)||8,wd=fs*.62*String(s).length,al=cx.textAlign,lx0=al=='center'?x-wd/2:(al=='right'||al=='end')?x-wd:x,X0=m.a*lx0+m.c*y+m.e,Y0=m.b*x+m.d*(y-fs)+m.f;TB.push([X0-2*m.a,Y0-2*m.a,X0+(wd+4)*Math.abs(m.a),Y0+(fs+5)*Math.abs(m.d)])}return raw[n].call(tx,s,x,y,...a)};
 cx.fillText=T2('fillText');cx.strokeText=T2('strokeText');
 for(const n of['fill','stroke','putImageData','strokeRect'])cx[n]=function(...a){flush();return raw[n].apply(cx,a)};
 cx.clearRect=function(x,y,w,h){flush();if(TXT.on&&dirty){mtx();raw.clearRect.call(tx,x,y,w,h)}return raw.clearRect.call(cx,x,y,w,h)};
 // mirror save/restore + rect clips onto the overlay
 cx.save=function(){raw.save.call(tx);return raw.save.call(cx)};cx.restore=function(){TV++;raw.restore.call(tx);return raw.restore.call(cx)};
 cx.beginPath=function(){rects=[];return raw.beginPath.call(cx)};cx.rect=function(x,y,w,h){rects.push([x,y,w,h,cx.getTransform()]);return raw.rect.call(cx,x,y,w,h)};
 cx.clip=function(...a){if(rects.length){const r=KT/KW;raw.beginPath.call(tx);for(const[x,y,w,h,m]of rects){tx.setTransform(m.a*r,m.b*r,m.c*r,m.d*r,m.e*r,m.f*r);raw.rect.call(tx,x,y,w,h)}raw.clip.call(tx)}return raw.clip.apply(cx,a)};
 // getImageData in world coordinates (sampled from the hi-res backing store)
 cx.getImageData=function(x,y,w,h){flush();const k=KW;if(k==1)return raw.getImageData.call(cx,x,y,w,h);const src=raw.getImageData.call(cx,Math.floor(x*k),Math.floor(y*k),Math.max(1,Math.round(w*k)),Math.max(1,Math.round(h*k))),out=new ImageData(w,h),sw=src.width;for(let j=0;j<h;j++)for(let i=0;i<w;i++){const si=(Math.min(src.height-1,Math.floor((j+.5)*k))*sw+Math.min(sw-1,Math.floor((i+.5)*k)))*4,o=(j*w+i)*4;out.data[o]=src.data[si];out.data[o+1]=src.data[si+1];out.data[o+2]=src.data[si+2];out.data[o+3]=src.data[si+3]}
  // composite overlay text so pixel probes still see it
  return out};
 {const _d=draw;draw=function(){if(tc.width!=Math.round(W*KT)||tc.style.width!=cv.style.width)sizeT();KW=cv.width/W;tx.setTransform(1,0,0,1,0,0);raw.clearRect.call(tx,0,0,tc.width,tc.height);dirty=false;TB=[];TV++;_d.apply(this,arguments);flush()}}
 window.FM23B={TXT,flush,tc,tx,KT:()=>KT,KW:()=>KW,sizeT};})();

// ---------- debug: graphics options + sprite/portrait gallery ----------
(function(){const reT=()=>{for(const k in TC)delete TC[k];for(const k in BGK)delete BGK[k]};
 function gallery(){const ids=['you','ava','kai','zara','theo','nyx','pip','ruiz','mo','vega'],c=document.createElement('canvas');c.width=ids.length*70;c.height=150;const g=c.getContext('2d');g.fillStyle='#1c1024';g.fillRect(0,0,c.width,c.height);
  ids.forEach((id,i)=>{const L=id=='you'?PLOOK:NPCS.find(q=>q.id==id).look,im=window.FM15&&FM15.get(L,'neutral');if(im&&im.complete&&im.naturalWidth)g.drawImage(im,i*70+3,2,64,72);g.drawImage(FM23.hdSprite(L,2,0,0,0),i*70+11,76,48,72);g.fillStyle='#fff';g.font='9px sans-serif';g.fillText(id,i*70+4,148)});c.style.cssText='width:100%;image-rendering:auto';return c}
 const _st=FM17.setTab;FM17.setTab=function(t){_st.apply(this,arguments);if(t!='View')return;const bd=document.querySelector('#dbg .bd');if(!bd)return;
  const h=document.createElement('h3');h.textContent='v26: Graphics';const row=document.createElement('div');row.className='row';
  const add=(l,f)=>{const b=document.createElement('button');b.textContent=l;b.onclick=()=>{f();FM17.setTab('View')};row.appendChild(b)};
  add('HD sprites: '+(FM23.HD.on?'ON':'off'),()=>{FM23.HD.on=!FM23.HD.on});
  add('Crisp text layer: '+(FM23B.TXT.on?'ON':'off'),()=>{FM23B.TXT.on=!FM23B.TXT.on});
  add('Textures: '+(FM23TEX.on?'ON':'off'),()=>{FM23TEX.on=!FM23TEX.on;localStorage.fmTex=FM23TEX.on?'1':'0';reT()});
  for(const k of[1,2,3])add('World res '+k+'x'+((+(localStorage.fmWorldK||2))==k?' ✓':''),()=>{localStorage.fmWorldK=k;window.__KW=k;resize();FM23B.sizeT()});
  bd.appendChild(h);bd.appendChild(row);const gh=document.createElement('h3');gh.textContent='Sprites vs portraits';bd.appendChild(gh);bd.appendChild(gallery())};
 FM23.gallery=gallery;FM23.reTex=reT})();
