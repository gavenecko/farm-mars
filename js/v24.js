// ===== v27: illustrated anime character sprites (generated from portraits) =====
(function(){
const CW=144,CH=216,OW=72,OH=108,IDS=['you','ava','kai','zara','theo','nyx','pip','ruiz','mo','vega','kid','suit'];
const SHEET={},CACHE=new Map();
const ILL={on:localStorage.fmIll!='0',ready:false,n:0,need:IDS.length};
function load(){return;for(const id of IDS){const im=new Image();im.decoding='async';im.onload=()=>{const s=document.createElement('canvas');s.width=OW*4;s.height=OH;const g=s.getContext('2d');g.imageSmoothingEnabled=true;g.drawImage(im,0,0,OW*4,OH);SHEET[id]=s;if(++ILL.n>=ILL.need){ILL.ready=true;prewarm()}};im.onerror=()=>{ILL.need--;if(ILL.n>=ILL.need)ILL.ready=true};im.src='assets/sprites/'+id+'.webp?v=27'/* v28: v25.js loads 4x4 sheets */}}
load();
function whoId(look){if(!look)return null;if(look===PLOOK||(G&&look===G.look))return'you';const w=window.FM13&&FM13.whoOf(look);if(w&&w!='kid'&&SHEET[w]!==undefined)return w;if(w=='you')return'you';
 if(w=='kid'){const h=look.hair||'';const r=parseInt((h[1]||'0')+(h[2]||'0'),16),g=parseInt((h[3]||'0')+(h[4]||'0'),16),b=parseInt((h[5]||'0')+(h[6]||'0'),16);if(r>180&&g<160&&b>100&&r>g+20)return'kid'}
 return null}
function hexRgb(h){h=h.replace('#','');if(h.length==3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function tintJacket(g,w,h,col){if(!col||col[0]!='#')return;let tr,tg,tb;try{[tr,tg,tb]=hexRgb(col)}catch(e){return}
 const d=g.getImageData(0,0,w,h),a=d.data,y0=Math.round(h*.36),y1=Math.round(h*.78);
 const tl=0.299*tr+0.587*tg+0.114*tb||1;
 for(let y=y0;y<y1;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,r=a[i],gv=a[i+1],b=a[i+2];if(a[i+3]<180)continue;
  if(!(gv>r+6&&gv>b-4&&gv>35&&gv<200))continue; // forest / teal jacket, not hair/scarf/pants
  const l=(0.299*r+0.587*gv+0.114*b)/tl,k=Math.max(.25,Math.min(1.85,l));
  a[i]=Math.max(0,Math.min(255,tr*k));a[i+1]=Math.max(0,Math.min(255,tg*k));a[i+2]=Math.max(0,Math.min(255,tb*k))}
 g.putImageData(d,0,0)}
function drawHat(g,look,dir,frame,suit){if(!look||!look.hat||suit||!window.FM21||!FM21.hatPix)return;
 if(window.FM22&&FM22.hatArt){const s=OW/227;g.save();g.translate(0,Math.round(OH*-.02));g.scale(s,s);try{FM22.hatArt(g,look.hat)}catch(e){}g.restore();return}
 const t=document.createElement('canvas');t.width=18;t.height=27;const q=t.getContext('2d'),fl=dir==3;
 FM21.hatPix((x,y,w,h,col)=>{const yy=y-(suit?1:0);if(yy+h>0){q.fillStyle=col;q.fillRect(fl?17-x-w:x,Math.max(0,yy),w,h-(yy<0?-yy:0))}},look.hat,(frame&1)?1:0,dir);
 g.imageSmoothingEnabled=false;g.drawImage(t,0,-2,OW,OH)}
function npcHelm(g,dir){g.save();g.fillStyle='rgba(200,230,245,.28)';g.strokeStyle='rgba(230,250,255,.9)';g.lineWidth=1.4;g.beginPath();g.ellipse(OW/2,OH*.28,OW*.42,OH*.28,0,0,7);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(OW*.38,OH*.14,OW*.12,OH*.06,-.5,0,7);g.fill();g.restore()}
function illSprite(look,dir,frame,suit,swing){const id0=whoId(look);if(!id0)return null;const id=(suit&&id0=='you'&&SHEET.suit)?'suit':id0;const img=SHEET[id];if(!img||!(img.naturalWidth||img.width))return null;
 const d=dir&3,key=id+'|'+d+'|'+(frame&1)+'|'+(suit?1:0)+'|'+(swing?1:0)+'|'+(look.hat||'')+'|'+(suit?'':(look.top||''));
 let c=CACHE.get(key);if(c)return c;
 c=document.createElement('canvas');c.width=OW;c.height=OH;c._ill=1;c._hd=4;const g=c.getContext('2d');g.imageSmoothingEnabled=true;
 const bob=(frame&1)?1:0,sh=OH*(bob?.96:1),lift=bob?2:0;
 g.drawImage(img,d*OW,0,OW,OH,0,lift,OW,sh);
 if(suit&&id!='suit')npcHelm(g,d);
 if(!suit&&id0=='you'&&G&&G.cos&&G.cos.dye_top&&G.cos.dye_top!='teal'&&look.top)tintJacket(g,OW,OH,look.top);
 if(swing){const t2=document.createElement('canvas');t2.width=OW;t2.height=OH;const g2=t2.getContext('2d');g2.drawImage(c,d==3?-1:d==1?1:0,-1);g.clearRect(0,0,OW,OH);g.drawImage(t2,0,0)}
 drawHat(g,look,d,frame,suit);
 if(CACHE.size>800)CACHE.clear();CACHE.set(key,c);return c}
function prewarm(){if(!ILL.on||!ILL.ready)return;const looks=()=>[PLOOK,...NPCS.map(n=>n.look)].filter(l=>l&&l.skin);const Q=[];for(const L of looks())for(let d=0;d<4;d++)for(let f=0;f<2;f++){Q.push([L,d,f,0,0]);if(L===PLOOK)Q.push([L,d,f,1,0])}
 const step=()=>{const t=performance.now();while(Q.length&&performance.now()-t<5){try{illSprite(...Q.shift())}catch(e){Q.shift()}}if(Q.length)setTimeout(step,40)};setTimeout(step,120)}
{const _cs=charSprite;charSprite=function(look,dir,frame,suit,swing){if(0&&ILL.on&&look&&!look.small){try{const c=illSprite(look,dir,frame,suit,swing);if(c)return c}catch(e){console.error(e)}}return _cs.apply(this,arguments)}}
{const _dc=drawChar;drawChar=function(g,X,Y,look,dir,frame,o={}){return _dc.apply(this,arguments);}}
function gallery(){const ids=['you','ava','kai','zara','theo','nyx','pip','ruiz','mo','vega'],c=document.createElement('canvas');c.width=ids.length*90;c.height=230;const g=c.getContext('2d');g.fillStyle='#1c1024';g.fillRect(0,0,c.width,c.height);g.font='9px sans-serif';g.fillStyle='#fff';
 const prev=ILL.on;ids.forEach((id,i)=>{const L=id=='you'?PLOOK:NPCS.find(q=>q.id==id).look,im=window.FM15&&FM15.get(L,'neutral');if(im&&im.complete&&im.naturalWidth)g.drawImage(im,i*90+5,2,80,80);
  ILL.on=false;const v26=window.FM23?FM23.hdSprite(L,2,0,0,0):charSprite(L,2,0,0,0);g.drawImage(v26,i*90+21,88,48,72);
  ILL.on=true;const v27=illSprite(L,2,0,0,0)||v26;g.drawImage(v27,i*90+21,160,48,72);
  g.fillStyle='#aaa';g.fillText(id,i*90+6,86);g.fillStyle='#8cf';g.fillText('v26',i*90+6,158);g.fillStyle='#c8f';g.fillText('v27',i*90+6,228)});
 ILL.on=prev;c.style.cssText='width:100%;image-rendering:auto';return c}
{const _st=FM17.setTab;FM17.setTab=function(t){_st.apply(this,arguments);if(1||t!='View')return;const bd=document.querySelector('#dbg .bd');if(!bd)return;
 const h=document.createElement('h3');h.textContent='v27: Illustrated sprites';const row=document.createElement('div');row.className='row';
 const add=(l,f)=>{const b=document.createElement('button');b.textContent=l;b.onclick=()=>{f();CACHE.clear();if(window.FM23&&FM23.HC)FM23.HC.clear();FM17.setTab('View')};row.appendChild(b)};
 add('Illustrated (v27): '+(ILL.on?'ON':'off'),()=>{ILL.on=!ILL.on;localStorage.fmIll=ILL.on?'1':'0'});
 add('v26 procedural: '+(ILL.on?'off':'ON'),()=>{ILL.on=!ILL.on;localStorage.fmIll=ILL.on?'1':'0'});
 bd.appendChild(h);bd.appendChild(row);const gh=document.createElement('h3');gh.textContent='Portraits · v26 · v27';bd.appendChild(gh);bd.appendChild(gallery())}}
window.FM24={ILL,SHEET,illSprite,whoId,gallery,CACHE,tintJacket,load};
})();
