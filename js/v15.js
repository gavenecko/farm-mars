// Round 17: illustrated anime portraits (lazy-loaded WebP, smooth HTML overlay on the dialogue frame) + chibi-anime world sprites.
(function(){
// ---------- portraits ----------
const MO={'':'neutral',neutral:'neutral',happy:'happy',sad:'sad',angry:'angry',love:'love',think:'think'};
const WHO=['ava','kai','zara','theo','ruiz','mo','vega','pip','kid','you'],MOODS=['neutral','happy','sad','angry','love','think'];
const PIMG={},FAIL={},WC=new WeakMap();
const who=l=>{let w=WC.get(l);if(!w){w=FM13.whoOf(l);WC.set(l,w)}return w};
function load(w){if(PIMG[w]||FAIL[w])return;PIMG[w]={};for(const m of MOODS){const im=new Image();im.decoding='async';im.onload=()=>{im._ok=1};im.onerror=()=>{FAIL[w]=1};im.src='assets/portraits/'+w+'_'+m+'.webp?v=18';PIMG[w][m]=im}}
function get(look,mood){if(!look)return null;const w=who(look);if(!WHO.includes(w))return null;load(w);if(FAIL[w])return null;const im=PIMG[w][MO[mood||'']||'neutral'];return im&&im._ok?im:null}
let el=null,img=null,used=false,lastSt='',lastKey='',lastSrc='';
function ensure(){if(el)return;const s=document.createElement('style');s.textContent='@keyframes pbob{0%{transform:none}30%{transform:translateY(-2.5%) scale(1.015,.975)}65%{transform:translateY(.8%) scale(.995,1.01)}100%{transform:none}}#pimg img.bob{animation:pbob .28s ease-out}';document.head.appendChild(s);
 el=document.createElement('div');el.id='pimg';el.style.cssText='position:absolute;overflow:hidden;pointer-events:none;display:none;z-index:2;background:linear-gradient(#fbf4e6,#efe2c8)';
 img=document.createElement('img');img.alt='';img.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:50% 8%;image-rendering:auto;transform-origin:50% 100%';el.appendChild(img);document.body.appendChild(el)}
function place(x,y,w,h,im,key){ensure();const c=document.getElementById('c'),r=c.getBoundingClientRect(),s=r.width/W;
 const st='left:'+(r.left+window.scrollX+x*s).toFixed(1)+'px;top:'+(r.top+window.scrollY+y*s).toFixed(1)+'px;width:'+(w*s).toFixed(1)+'px;height:'+(h*s).toFixed(1)+'px';
 if(st!=lastSt){el.style.left=(r.left+window.scrollX+x*s)+'px';el.style.top=(r.top+window.scrollY+y*s)+'px';el.style.width=(w*s)+'px';el.style.height=(h*s)+'px';lastSt=st}
 if(im.src!=lastSrc){img.src=im.src;lastSrc=im.src}
 if(key!=lastKey){img.classList.remove('bob');void img.offsetWidth;img.classList.add('bob');lastKey=key}
 if(el.style.display!='block')el.style.display='block';used=true}
function hide(){if(el&&el.style.display!='none'){el.style.display='none';lastKey=''}}
{const _d=draw;draw=function(){used=false;_d.apply(this,arguments);if(!used)hide()}}
window.FM15={get,place,hide,PIMG,FAIL,WHO,MOODS,state:()=>({shown:!!el&&el.style.display=='block',src:lastSrc,el})};

// ---------- chibi-anime world sprites (18x27, same footprint) ----------
const EYE={ava:'#3aa04a',kai:'#7a4a2a',zara:'#1fb8a0',theo:'#7a4a2a',ruiz:'#3a9a6a',mo:'#7a4a2a',vega:'#d0a020',pip:'#3ab04a',you:'#2aa080',kid:'#b0701a'};
const _cs=charSprite,CC2=new Map();
charSprite=function(look,dir,frame,suit,swing){if(suit||look.small)return _cs(look,dir,frame,suit,swing);const w=who(look);
 const key=w+look.skin+look.hair+look.top+look.pants+look.style+dir+frame+(swing?1:0);let c=CC2.get(key);if(c)return c;
 c=document.createElement('canvas');c.width=18;c.height=27;const g=c.getContext('2d');
 const sk=look.skin,hr=look.hair,tp=look.top,pn=look.pants||'#333',ac=look.acc||shade(tp,.4),st=look.style;
 const ph=[0,1,0,-1][frame&3],bob=(frame&1)?1:0,side=dir==1||dir==3,fl=dir==3,X=1,Y=2;
 const P=(x,y,ww,hh,col)=>px(g,fl?X+16-x-ww:X+x,Y+y,ww,hh,col);
 const hl=shade(hr,.38),hd=shade(hr,-.3),skd=shade(sk,-.2),tpd=shade(tp,-.3),tpl=shade(tp,.25),ic=EYE[w]||'#6a3a2a';
 // legs + shoes (short chibi legs)
 const shoe='#2a1a24';
 if(side){const a=ph;P(6+a,18,3,4,pn);P(7-a,18,3,4,shade(pn,-.25));P(6+a,21,4,2,shoe);P(7-a,21,4,2,shade(shoe,-.2))}
 else{const l=ph>0?1:0,r=ph<0?1:0;P(5,18,3,4-l,pn);P(8,18,3,4-r,shade(pn,-.2));P(4,21-l,4,2,shoe);P(8,21-r,4,2,shoe)}
 // body
 const by=12+bob,coat=w=='ruiz';
 P(4,by,8,coat?8:6,tp);P(4,by,8,1,tpl);P(11,by+1,1,coat?7:5,tpd);P(4,by+(coat?7:5),8,1,tpd);
 const sw=swing?0:ph;
 if(side){P(7-sw,by+1,3,4,shade(tp,-.1));P(7-sw,by+4,3,2,sk)}else{P(2,by+1-sw,2,4,tp);P(12,by+1+sw,2,4,tpd);P(2,by+4-sw,2,2,sk);P(12,by+4+sw,2,2,skd)}
 if(dir!=0){// outfit details (front/side)
  const F=dir==2;
  if(w=='kai'){if(F){P(5,by+1,6,6,'#f4f0ec');P(5,by+1,1,5,'#d8d0cc');P(6,by,1,1,'#f4f0ec');P(9,by,1,1,'#f4f0ec')}else P(9,by+1,3,5,'#f4f0ec')}
  if(w=='ava'){if(F){P(7,by,1,5,'#8ad0d0');P(5,by,1,6,'#6a3a1a');P(10,by,1,6,'#6a3a1a')}else P(8,by,1,6,'#6a3a1a')}
  if(w=='theo'){if(F){P(7,by,2,5,'#f4ecd8');P(5,by,1,6,'#6a3a1a');P(10,by,1,6,'#6a3a1a')}else P(9,by,1,6,'#6a3a1a')}
  if(w=='zara'){if(F){P(7,by,2,5,'#1a1020');P(6,by,1,6,'#ff3ad0');P(9,by,1,6,'#3af0ff')}else P(10,by+1,1,4,'#ff3ad0')}
  if(w=='ruiz'){if(F){P(7,by,2,7,'#e8e4dc');P(7,by+1,2,4,'#2a8a5a');P(5,by,1,3,'#5a6a7a');P(10,by,1,3,'#5a6a7a')}else P(9,by,1,3,'#5a6a7a')}
  if(w=='mo'){if(F){P(4,by,2,6,'#5a3a24');P(10,by,2,6,'#5a3a24')}else P(8,by,2,6,'#5a3a24')}
  if(w=='vega'){if(F){P(4,by+1,1,1,'#e0b040');P(5,by+2,2,1,'#e0b040');P(7,by+3,2,1,'#e0b040');P(9,by+4,2,1,'#e0b040');P(11,by+5,1,1,'#e0b040')}else P(8,by+2,2,2,'#e0b040')}
  if(w=='pip'){P(4,by,8,2,'#d02a2a');P(F?7:4,by+2,2,1,'#a01a1a')}
  if(w=='you'){P(5,by,6,2,'#ff9a2a');if(F)P(7,by+2,2,1,'#e07a1a');P(F?10:8,by,1,6,'#6a3a1a')}
  if(w=='kid'&&F)P(8,by+2,2,2,'#e04a4a')}
 // head: big chibi head 14x12
 const hy=bob;P(2,hy,12,12,sk);P(1,hy+1,14,10,sk);P(13,hy+2,1,8,skd);P(2,hy+11,12,1,skd);
 const hair=(x,y,ww,hh,c=hr)=>P(x,y,ww,hh,c);
 if(dir==0){hair(1,hy-1,14,11);hair(2,hy-2,12,1);P(3,hy-1,5,1,hl);P(13,hy,2,9,hd);P(1,hy+9,14,1,hd);
  if(st=='long')hair(1,hy+10,14,6),P(1,hy+15,14,1,hd);if(st=='bob')hair(1,hy+10,14,2);if(w=='kai'||w=='pip')hair(3,hy-3,2,1),hair(7,hy-4,2,2),hair(11,hy-3,2,1);
  if(w=='mo')P(1,hy+3,14,1,'#2a2020');if(st=='cap'){const cc=w=='vega'?'#6a1a2a':'#2f6a4a';P(1,hy-2,14,4,cc);P(3,hy-2,6,1,shade(cc,.3))}}
 else{const F=dir==2;
  // eyes: big 2x4 anime eyes with highlight
  const eye=x=>{P(x,hy+5,2,1,'#1a0f1a');P(x,hy+6,2,3,ic);P(x,hy+6,1,1,'#fff');P(x+1,hy+8,1,1,shade(ic,.4));P(x,hy+6,2,0,ic)};
  if(F){eye(4);eye(10);P(3,hy+9,2,1,'#f7a0a8');P(11,hy+9,2,1,'#f7a0a8');P(7,hy+10,2,1,shade(sk,-.45))}
  else{eye(10);P(13,hy+9,1,1,'#f7a0a8');P(12,hy+10,1,1,shade(sk,-.45))}
  // hair top + bangs with pointed tips
  hair(1,hy-1,14,4);hair(2,hy-2,12,1);P(3,hy-2,5,1,hl);P(2,hy-1,2,1,hl);
  if(F){for(const [x,l] of [[1,3],[3,2],[5,3],[7,1],[9,3],[11,2],[13,3]])hair(x,hy+3,2,l);P(1,hy+3,1,4,hd);P(14,hy+3,1,4,hd)}
  else{hair(1,hy+3,6,4);hair(7,hy+3,2,2);hair(9,hy+3,2,1);P(1,hy+3,2,6,hd)}
  if(st=='bob'){hair(0,hy+1,2,10);hair(14,hy+1,2,10,hd);P(0,hy+10,2,1,hd);if(!F)hair(1,hy+3,5,8)}
  else if(st=='long'){hair(0,hy+1,2,15);hair(14,hy+1,2,15,hd);P(0,hy+4,1,6,hl);if(!F)hair(1,hy+3,5,13);P(0,hy+15,2,1,hd)}
  else if(st=='spiky'){hair(2,hy-3,2,2);hair(6,hy-4,2,3);hair(10,hy-3,2,2);hair(13,hy-2,2,2,hd);hair(0,hy,2,3);P(6,hy-4,1,1,hl);hair(14,hy+1,1,5,hd);hair(0,hy+1,1,6)}
  else if(st=='beard'){hair(0,hy,2,6);hair(14,hy,2,6,hd);if(F){hair(3,hy+9,10,3);hair(4,hy+12,8,2);hair(6,hy+14,4,1);P(7,hy+10,2,1,shade(sk,-.45));P(3,hy+4,4,1,'#f4f4f4');P(9,hy+4,4,1,'#f4f4f4')}else{hair(9,hy+9,6,4);hair(10,hy+13,4,1)}
   P(1,hy+2,14,1,'#2a2020');if(F){P(6,hy,4,3,'#ffd040');P(7,hy+1,2,1,'#fff8c0')}else P(12,hy,3,3,'#ffd040')}
  else if(st=='bald'){P(0,hy+1,2,6,hr);P(14,hy+1,2,6,hd)}
  else if(st=='cap'){const cc=w=='vega'?'#6a1a2a':'#2f6a4a';hair(0,hy+2,2,6);hair(14,hy+2,2,6,hd);P(0,hy-3,16,5,cc);P(2,hy-3,7,1,shade(cc,.3));P(0,hy+1,16,1,shade(cc,-.35));
   if(F)P(7,hy-2,2,2,w=='vega'?'#ffd23a':'#e0b040');else{P(12,hy+1,4,1,cc);P(10,hy-2,2,2,'#e0b040')}}
  if(w=='ava'){P(3,hy-1,3,2,'#8a6a3a');P(10,hy-1,3,2,'#8a6a3a');P(4,hy-1,1,1,'#5ad8e8');P(11,hy-1,1,1,'#5ad8e8');P(6,hy,4,1,'#3a2418')}
  if(w=='theo'&&F){const gc='#c8a050';P(3,hy+5,4,1,gc);P(9,hy+5,4,1,gc);P(3,hy+6,1,3,gc);P(6,hy+6,1,3,gc);P(9,hy+6,1,3,gc);P(12,hy+6,1,3,gc);P(7,hy+6,2,1,gc)}
  if(w=='theo'&&!F){P(9,hy+5,4,1,'#c8a050');P(9,hy+6,1,3,'#c8a050')}
  if(w=='zara'&&F){P(3,hy+9,1,1,'#ff3ad0');P(12,hy+8,1,1,'#ff3ad0')}
  if(w=='kai'){P(F?14:6,hy+8,1,1,'#1a1a1a')}
  if(w=='pip'&&F){P(4,hy+10,1,1,shade(sk,-.35));P(11,hy+10,1,1,shade(sk,-.35))}}
 outline(c);if(CC2.size>700)CC2.clear();CC2.set(key,c);return c};
})();
