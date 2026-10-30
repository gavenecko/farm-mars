// Round 16: anime / JRPG pixel portraits. 64x56 procedural pixel art, cel-shaded, nearest-neighbour only.
(function(){
const W=64,H=56,OUT='#1a0f1a',LASH='#2a1226';
const EYE={ava:'#1fc8c0',kai:'#b04ae8',ruiz:'#3a9a6a',mo:'#8a6a3a',zara:'#ffa02a',theo:'#3a80ff',vega:'#e0a820',pip:'#3ab04a',you:'#3a9a8a',kid:'#d0702a'};
function hx(c){c=String(c).replace('#','');if(c.length==3)c=c.split('').map(q=>q+q).join('');return[0,2,4].map(i=>parseInt(c.slice(i,i+2),16)||0)}
function mix(a,b,t){const A=hx(a),B=hx(b);return'#'+A.map((v,i)=>Math.max(0,Math.min(255,Math.round(v+(B[i]-v)*t))).toString(16).padStart(2,'0')).join('')}
const lum=c=>{const[r,g,b]=hx(c);return(r*.3+g*.59+b*.11)/255};
const sd=(c,t)=>mix(c,'#2a0e3a',t), li=(c,t)=>mix(c,'#fff6e8',t);
function ip(p,x,y){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const[xi,yi]=p[i],[xj,yj]=p[j];if((yi>y)!=(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c}
function poly(p,dy=0){p=p.map(([x,y])=>[x,y+dy]);let x0=99,x1=-9,y0=99,y1=-9;for(const[a,b]of p){x0=Math.min(x0,a);x1=Math.max(x1,a);y0=Math.min(y0,b);y1=Math.max(y1,b)}const o=[];
 for(let y=Math.max(0,Math.floor(y0));y<=Math.min(H-1,Math.ceil(y1));y++)for(let x=Math.max(0,Math.floor(x0));x<=Math.min(W-1,Math.ceil(x1));x++)if(ip(p,x+.5,y+.5))o.push(y*W+x);return o}
function ell(cx,cy,rx,ry,ymax=99,ymin=-99){const o=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(y>ymax||y<ymin)continue;const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1)o.push(y*W+x)}return o}
const mir=p=>p.map(([x,y])=>[64-x,y]);
const clump=(x0,x1,by,tx,ty)=>{const w=x1-x0,m=by+(ty-by)*.42;return[[x0,by],[x1,by],[x1-w*.12,m],[tx+(tx>32?.6:-.6)*0,ty],[x0+w*.22,m+1]]};
function both(list,p){list.push(poly(p.p||p,p.dy||0));list.push(poly(mir(p.p||p),p.dy||0))}
function hairOf(st,who,y0){const dy=y0-13,B=[],F=[];let ring=y0+1;const P=(p)=>poly(p,dy),E=(...a)=>ell(a[0],a[1]+dy,a[2],a[3],a[4]!=null?a[4]+dy:99,a[5]!=null?a[5]+dy:-99);
 const bangs=(L,by=14)=>L.forEach(([a,b,tx,ty])=>F.push(P(clump(a,b,by,tx,ty))));
 if(st=='spiky'){B.push(E(32,22,16,14));F.push(E(32,22,16,14,17));
  [[[16,19],[22,12],[7,10]],[[20,13],[29,9],[17,1]],[[27,10],[36,10],[33,-1]],[[34,10],[42,13],[47,1]],[[40,13],[47,18],[57,8]],[[45,18],[48,26],[58,21]],[[16,18],[16,27],[6,21]]].forEach(t=>F.push(P(t)));
  bangs([[16,24,18,29],[21,29,25,25],[26,33,29,30],[31,38,36,26],[35,42,40,30],[40,48,46,26]]);
  F.push(P([[15,17],[21,17],[21,28],[17,36],[15,28]]),P(mir([[15,17],[21,17],[21,28],[17,36],[15,28]])));ring=y0+2}
 else if(st=='long'){B.push(E(32,22,16,14),P([[14,18],[50,18],[53,34],[55,56],[9,56],[11,34]]));F.push(E(32,22,16,14,17));
  bangs([[16,25,19,29],[21,31,27,26],[28,33,30,22],[31,36,34,22],[33,43,37,26],[39,48,45,29]]);
  const sl=[[15,15],[22,16],[23,30],[22,44],[20,52],[14,55],[15,40],[14,26]];F.push(P(sl),P(mir(sl)))}
 else if(st=='cap'){B.push(E(32,22,16,14),P([[15,18],[49,18],[50,36],[14,36]]));
  bangs([[17,25,20,27],[23,31,27,25],[29,36,33,28],[34,41,38,25],[39,47,44,27]],19);
  const sl=[[15,19],[21,19],[21,30],[18,37],[15,30]];F.push(P(sl),P(mir(sl)));ring=null}
 else if(st=='bald'){B.push(E(32,20,15,10,24));F.push(E(32,17,15,8,14));F.push(P([[22,13],[40,9],[46,15],[37,13],[28,17]]));
  const sl=[[17,14],[21,15],[20,22],[18,29],[17,24]];F.push(P(sl),P(mir(sl)));ring=y0+1}
 else if(st=='beard'){B.push(E(32,22,16,14));F.push(E(32,22,16,14,17));
  bangs([[17,25,19,23],[23,32,27,22],[30,39,35,23],[37,47,44,22]],15);
  
  const sl=[[15,16],[20,16],[20,29],[16,31],[13,24]];F.push(P(sl),P(mir(sl)))}
 else {// bob (default)
  const short=who=='theo';B.push(E(32,22,16,14));B.push(P(short?[[15,18],[49,18],[50,36],[46,40],[42,37],[22,37],[18,40],[14,36]]:[[15,18],[49,18],[51,30],[52,44],[48,42],[44,46],[40,43],[24,43],[20,46],[16,42],[12,44],[13,30]]));
  F.push(E(32,22,16,14,17));
  bangs([[16,25,19,28],[21,30,26,25],[27,35,30,29],[31,38,36,26],[35,43,40,29],[40,48,45,25]]);
  const sl=short?[[15,15],[22,16],[23,28],[20,36],[17,39],[15,30]]:[[15,15],[22,16],[23,28],[21,38],[19,42],[13,45],[15,36],[14,26]];F.push(P(sl),P(mir(sl)))}
 return{B,F,ring}}
const PC4=new Map();
function bust3(look,mood,blink,talk,who){who=who||FM13.whoOf(look);const sp=typeof G!='undefined'&&G&&G.spouse==who;mood=mood||'';blink=!!blink;talk=!!talk;
 const key=JSON.stringify(look)+mood+blink+talk+who+sp;let cv=PC4.get(key);if(cv)return cv;
 const C=new Array(W*H).fill(null),L=new Uint8Array(W*H);
 const S=(x,y,col,l=7)=>{if(x<0||y<0||x>=W||y>=H)return;C[y*W+x]=col;L[y*W+x]=l};
 const sk=look.skin,hr=look.hair||'#5a3a2a',tp=look.top||'#4a4a6a',ac=look.acc||li(tp,.5),st=look.style;
 const skd=sd(sk,.22),skl=li(sk,.25),skO=sd(sk,.62);
 const age=(who=='pip'||who=='kid')?'kid':(who=='mo'||who=='ruiz'||who=='vega')?'old':'adult';
 const Gm=age=='kid'?{y0:14,jaw:34,chin:46,hw:14,p:.9,ey:28,eh:10,ew:8,my:42}:age=='old'?{y0:13,jaw:34,chin:47,hw:13,p:1.2,ey:28,eh:7,ew:8,my:43}:{y0:13,jaw:33,chin:46,hw:13,p:1.25,ey:27,eh:10,ew:8,my:41};
 if(st=='bald')Gm.y0=10;const{y0,jaw,chin,hw,ey,eh,ew}=Gm;let my=Gm.my;const ny=ey+eh+(age=='old'?2:1);
 const ic=EYE[who]||EYE.kid,icd=sd(ic,.5),icl=li(ic,.4);
 function comp(list,base,back,ring,lab,sepY){const M=new Int16Array(W*H);list.forEach((px,k)=>{for(const p of px)M[p]=k+1});
  const dark=lum(base)<.25,hl=dark?mix(base,'#a8b8ff',.5):li(base,.55),b=back?sd(base,.28):base,d=sd(base,back?.5:.3),dd=sd(base,.6);
  const inn=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&M[y*W+x]>0;
  for(let p=0;p<W*H;p++){if(!M[p])continue;const x=p%W,y=(p/W)|0;let col=b;
   if(!inn(x+1,y+2)||!inn(x+2,y+1))col=d;
   if(!back){if((!inn(x,y-1)||!inn(x-1,y))&&(ring==null||y<ring+5)&&x<44)col=hl;
    if(ring!=null){const ry=ring+Math.floor((x-31.5)**2/48);if((y==ry||y==ry+1)&&((x*5+y*3)%11)>2&&col==b)col=hl}
    if(x<W-1&&y>sepY&&M[p+1]&&M[p+1]!=M[p]&&M[p+1]>M[p])col=d;if(x>0&&y>sepY+3&&M[p-1]&&M[p-1]<M[p]&&col==b&&y<sepY+8)col=hl}
   S(x,y,col,lab)}
  return M}
 // back hair
 const hs=hairOf(st,who,y0);comp(hs.B,hr,true,null,1,99);
 // body
 const sh=age=='kid'?[[10,56],[14,51],[23,48],[41,48],[50,51],[54,56]]:[[4,56],[9,50],[20,46],[44,46],[55,50],[60,56]];
 const BM=new Uint8Array(W*H);for(const p of poly(sh))BM[p]=1;const bin=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&BM[y*W+x];
 const top=who=='ruiz'?'#f2f2f6':tp;
 for(let p=0;p<W*H;p++)if(BM[p]){const x=p%W,y=(p/W)|0;let col=top;if(!bin(x+4,y)||!bin(x+2,y+0)&&x>32)col=sd(top,.3);if(!bin(x,y-1)&&x<34)col=li(top,.3);S(x,y,col,2)}
 for(let y=chin-8;y<=51;y++)for(let x=28;x<=35;x++)S(x,y,x>=34?sd(sk,.35):skd,6);
 for(const p of poly([[26.5,46],[37.5,46],[32,52]])){const x=p%W,y=(p/W)|0;S(x,y,x>=34?sd(sk,.35):skd,6)}
 // face
 const hwAt=y=>{if(y<y0||y>chin)return 0;if(y<y0+3)return hw-[3,1,0][y-y0];if(y<=jaw)return hw;const t=(y-jaw)/(chin-jaw);return Math.max(2,Math.round(2+(hw-2)*Math.pow(1-t,Gm.p)))};
 const FM=(x,y)=>{const h=hwAt(y);return h>0&&x>=32-h&&x<=31+h};
 for(let y=y0;y<=chin;y++){const h=hwAt(y);for(let x=32-h;x<=31+h;x++){let col=sk;if(!FM(x+3,y))col=skd;if(y>jaw&&!FM(x,y+2))col=skd;if(!FM(x-2,y)&&x<26&&y<jaw)col=skl;S(x,y,col,3)}}
 for(let y=ey+2;y<=ey+8;y++){const ex=32-hw-1;S(ex,y,y==ey+2||y==ey+8?skd:sk,3);S(ex-1,y>ey+3&&y<ey+7?y:-1,skd,3);S(63-ex,y,sd(sk,.3),3);S(64-ex,y>ey+3&&y<ey+7?y:-1,sd(sk,.4),3)}
 // blush
 const bc=mix(sk,'#ff3a6a',.42),bc2=mix(sk,'#ff3a6a',.7);const heavy=mood=='love',med=mood=='happy';
 for(const R of[0,1]){const X=x=>R?63-x:x;
  if(heavy){for(let x=19;x<=26;x++)for(let y=ny-1;y<=ny+1;y++)S(X(x),y,bc,3);for(let k=0;k<4;k++){S(X(19+2*k),ny+1,bc2,7);S(X(20+2*k),ny,bc2,7);S(X(21+2*k),ny-1,bc2,7)}}
  else for(let k=0;k<3;k++){S(X(21+2*k),ny+(med?0:1),med?bc2:bc,7);S(X(22+2*k),ny+(med?-1:0),med?bc2:bc,7)}}
 if(heavy)for(let x=29;x<=34;x++)S(x,ny-1,bc,7);
 if(who=='pip')for(const R of[0,1]){const X=x=>R?63-x:x;[[22,ny-2],[25,ny-1],[23,ny],[26,ny+1]].forEach(([x,y])=>S(X(x),y,sd(sk,.4),7))}
 // nose
 S(32,ny,sd(sk,.3),7);S(31,ny-1,skl,7);
 // eyes
 const fem=['ava','zara','pip','kid'].includes(who);
 function eye(R){const X=x=>R?63-x:x,P=(x,y,c)=>S(X(x),y,c,7);const e0=28-ew+1,e1=28,t=ey,n=eh-3,f=x=>(x-e0)/(e1-e0);
  const hx0=R?e1-2:e0+1,cc=R?e0+4:e0+3;
  const closedA=()=>{P(e0,t+eh-4,LASH);for(let x=e0+1;x<=e1-1;x++)P(x,t+eh-3,LASH);P(e1,t+eh-4,LASH);P(e0-1,t+eh-5,LASH)};
  const caret=()=>{for(let x=e0+2;x<=e1-2;x++){P(x,t+eh-7,LASH);P(x,t+eh-6,LASH)}P(e0+1,t+eh-6,LASH);P(e1-1,t+eh-6,LASH);P(e0+1,t+eh-5,LASH);P(e1-1,t+eh-5,LASH);P(e0,t+eh-4,LASH);P(e1,t+eh-4,LASH);P(e0,t+eh-3,LASH);P(e1,t+eh-3,LASH)};
  const tears=()=>{for(let k=0;k<8;k++){P(e0+1,t+eh+k-1,k%3==0?'#ffffff':'#7ac8ff');if(k>0&&k<7)P(e0+2,t+eh+k-1,'#4aa0f0')}for(let x=e0+1;x<=e1-1;x++)P(x,t+eh-1,'#9ad8ff')};
  if((mood=='happy'||mood=='love')&&blink){caret();return}
  if(blink){closedA();if(mood=='sad')tears();return}
  for(let x=e0+1;x<=e1-1;x++)P(x,t,LASH);for(let x=e0;x<=e1;x++)P(x,t+1,LASH);P(e0-1,t+1,LASH);if(fem){P(e0-1,t+2,LASH);P(e0-2,t+1,LASH)}
  for(let r=0;r<n;r++){const y=t+2+r;for(let x=e0;x<=e1;x++){let c;if(x==e0||x==e1)c=r==0?'#c8b8d0':'#fffaf4';else c=r<Math.max(1,n*.35)?icd:r<n*.7?ic:icl;if(r==n-1&&(x==e0+1||x==e1-1))c='#fffaf4';P(x,y,c)}}
  const look=mood=='think'?-1:0,ph=Math.max(2,Math.round(n*.45));for(let y=t+3+look;y<t+3+look+ph;y++){P(e0+3,y,'#140818');P(e0+4,y,'#140818')}
  const W2='#ffffff';P(hx0,t+2,W2);P(hx0+1,t+2,W2);P(hx0,t+3,W2);P(hx0+1,t+3,W2);P(R?e0+1:e1-1,t+eh-3,li(icl,.6));
  for(let x=e0+2;x<=e1-1;x++)P(x,t+eh-1,who=='zara'?'#3af0ff':sd(sk,.45));
  if(mood=='happy'){P(hx0,t+4,W2);const y=t+eh-4;P(cc,y,W2);P(cc-1,y,li(icl,.7));P(cc+1,y,li(icl,.7));P(cc,y-1,li(icl,.7));P(cc,y+1,li(icl,.7))}
  if(mood=='love'){for(let x=e0-1;x<=e1;x++){P(x,t,sk);P(x,t+1,sk)}for(let x=e0+1;x<=e1-1;x++)P(x,t+1,LASH);for(let x=e0;x<=e1;x++)P(x,t+2,LASH);P(e0-1,t+2,LASH);
   const y=t+4,hc='#ff4a9a';[[cc-1,y],[cc+1,y],[cc-1,y+1],[cc,y+1],[cc+1,y+1],[cc,y+2]].forEach(([x,yy])=>P(x,yy,hc));P(hx0,t+3,W2)}
  if(mood=='angry'){for(let x=e0-1;x<=e1;x++){const ly=t+1+Math.round(Math.max(0,f(x))*2.4);for(let y=t-1;y<ly;y++)P(x,y,sk);P(x,ly,LASH);if(x>e0&&x<e1)P(x,ly+1,LASH)}P(e0+4,t+4,ic);P(e0+4,t+5,ic)}
  if(mood=='sad'){for(let x=e0-1;x<=e1;x++){const ly=t+Math.round((1-Math.max(0,f(x)))*1.6);for(let y=t-1;y<ly;y++)P(x,y,sk);if(ly>t)P(x,ly,LASH)}P(hx0,t+5,W2);tears()}
 }
 eye(0);eye(1);
 // mouth
 const ml=sd(sk,.6),red='#c8404a',M=(x,y,c=ml)=>S(x,y,c,7);
 function mouth(){if(mood=='angry'){for(let x=29;x<=34;x++){M(x,my);M(x,my+(talk?3:2))}M(29,my+1);M(34,my+1);for(let x=30;x<=33;x++){M(x,my+1,'#fff');if(talk){M(x,my+2,red);M(29,my+2);M(34,my+2)}}return}
  if(talk){for(let x=30;x<=33;x++)M(x,my);M(30,my+1);M(33,my+1);M(31,my+1,red);M(32,my+1,red);M(31,my+2);M(32,my+2);return}
  if(mood=='happy'){for(let x=29;x<=34;x++)M(x,my);M(30,my+1);M(33,my+1);M(31,my+1,red);M(32,my+1,red);M(31,my+2);M(32,my+2);return}
  if(mood=='sad'){M(31,my);M(32,my);M(30,my+1);M(33,my+1);return}
  if(mood=='love'){M(29,my);M(34,my);M(30,my+1);M(31,my+1);M(32,my+1);M(33,my+1);return}
  if(mood=='think'){M(32,my);M(33,my);M(34,my-1);return}
  M(31,my);M(32,my);M(30,my,sd(sk,.35));M(33,my,sd(sk,.35))}
 if(who!='mo')mouth();
 // front hair + cast shadow + edge lines
 const FMk=comp(hs.F,hr,false,hs.ring,4,y0+3);
 for(let p=0;p<W*H;p++)if(FMk[p]){const x=p%W,y=(p/W)|0;for(const k of[1,2]){const q=p+k*W;if(y+k<H&&!FMk[q]&&L[q]==3)C[q]=skd}}
 for(let p=0;p<W*H;p++)if(FMk[p]){const x=p%W,y=(p/W)|0;const ad=[[0,1],[1,0],[-1,0]].some(([a,b])=>{const xx=x+a,yy=y+b;return xx>=0&&xx<W&&yy<H&&(L[yy*W+xx]==3||L[yy*W+xx]==7)&&!FMk[yy*W+xx]});if(ad)C[p]=sd(hr,.62)}
 // brows (anime: drawn over hair)
 const bcol=lum(hr)>.55?sd(hr,.45):sd(hr,.55);
 for(const R of[0,1]){const X=x=>R?63-x:x,e0=28-ew+1,b0=e0+1,b1=27,by=ey-3;for(let x=b0;x<=b1;x++){const f=(x-b0)/(b1-b0);let dy=mood=='angry'?Math.round(f*2.5)-1:mood=='sad'?1-Math.round(f*2):(f<.25?1:0)-(mood=='happy'||mood=='love'?1:0);S(X(x),by+dy,bcol,7);if(who=='mo'){S(X(x),by+dy-1,'#f4f4f4',7);S(X(x),by+dy,'#c8c8c8',7)}}}
 // per-character extras
 const A=(pts,c,lab=5)=>{const px=poly(pts);for(const p of px){const x=p%W,y=(p/W)|0;S(x,y,c,lab)}return px};
 if(st=='cap'){const cap=who=='vega'?tp:tp;const cpx=[ell(32,y0+7,hw+4,11,y0+6)];const cp2=poly([[12,y0+5],[52,y0+5],[54,y0+8.5],[10,y0+8.5]]);comp([cpx[0],cp2],cap,false,null,5,99);
  for(let x=11;x<=53;x++)S(x,y0+8,sd(cap,.55),5);const sx=32,sy=y0;const sc=who=='vega'?'#ffd23a':ac;['..X..','.XXX.','XXXXX','.XXX.','.X.X.'].forEach((r,b)=>[...r].forEach((ch,a)=>ch=='X'&&S(sx-2+a,sy-1+b,a==2&&b==2?'#fff6c0':sc,5)))}
 if(who=='mo'){for(let x=14;x<=50;x++){S(x,16,'#3a3030',5);S(x,17,'#2a2020',5)}A([[28,12],[36,12],[37,19],[27,19]],'#ffd040');A([[29,13],[35,13],[35,17],[29,17]],'#fff6a0');S(30,14,'#fff',5);
  const beard=poly([[17,33],[22,38],[28,40],[36,40],[42,38],[47,33],[48,42],[44,48],[40,52],[36,51],[33,56],[30,51],[26,52],[22,48],[16,42]]),must=poly([[25,40],[31,38.5],[33,38.5],[39,40],[41,43],[36,41.5],[32,41],[28,41.5],[23,43]]);
  comp([beard,must],hr,false,30,4,99);const mo=my;if(talk){for(let x=30;x<=33;x++)S(x,mo,ml,7);S(31,mo+1,red,7);S(32,mo+1,red,7)}else{for(let x=30;x<=33;x++)S(x,mo,ml,7)}
  if(mood=='happy'||mood=='love'){S(29,mo-1,ml,7);S(34,mo-1,ml,7)}if(mood=='angry'){for(let x=30;x<=33;x++)S(x,mo+1,'#fff',7)}}
 if(who=='ava'){for(let x=14;x<=50;x++)S(x,y0+4,'#3a2a30',5),S(x,y0+5,'#2a1a24',5);for(const cx0 of[25,39]){const r=ell(cx0,y0+5,4.2,3.6);for(const p of r){const x=p%W,y=(p/W)|0;const dd=Math.hypot(x+.5-cx0,(y+.5-(y0+5))*1.15);S(x,y,dd>3?(x<cx0?li(ac,.3):sd(ac,.25)):(y<y0+5?'#a8f8ff':'#3ac8e0'),5)}S(cx0-2,y0+3,'#fff',5);S(cx0-1,y0+4,'#fff',5)}}
 if(who=='theo'){const fc='#20203a';for(const R of[0,1]){const X=x=>R?63-x:x,e0=28-ew+1;for(let x=e0-1;x<=29;x++){S(X(x),ey-1,fc,5);S(X(x),ey+eh,fc,5)}for(let y=ey-1;y<=ey+eh;y++){S(X(e0-1),y,fc,5);S(X(29),y,fc,5)}S(X(27),ey+1,'#e8ffff',5);S(X(26),ey+2,'#e8ffff',5)}for(let x=30;x<=33;x++)S(x,ey+2,fc,5)}
 if(who=='zara')for(const R of[0,1]){const X=x=>R?63-x:x;S(X(19),ey+eh+1,'#ff3ad0',7);S(X(20),ey+eh+2,'#ff3ad0',7);S(X(19),ey+eh+3,'#ff3ad0',7);S(X(18),ey+2,'#3af0ff',7);S(X(17),ey+1,'#3af0ff',7)}
 if(who=='kai'){A([[22,50],[42,50],[43,56],[21,56]],'#f4eef0',2);for(let y=46;y<=50;y++){S(24,y,'#e0d8dc',2);S(40,y,'#e0d8dc',2)}for(let x=22;x<=42;x++)S(x,50,'#c8c0c8',2);S(32-hw-1,ey+9,'#fff',5);S(32-hw-1,ey+10,'#9af',5)}
 if(who=='ruiz'){A([[28,47],[36,47],[34.5,56],[29.5,56]],ac,2);A([[31,48],[33,48],[33.5,54],[32,56],[30.5,54]],sd(ac,.4),2);
  for(const R of[0,1]){const X=x=>R?63-x:x;for(let y=46;y<=56;y++)S(X(27-Math.floor((y-46)/3)),y,'#b8c0cc',2)}
  [[25,46],[24,47],[24,48],[23,49],[23,50],[23,51],[23,52]].forEach(([x,y])=>S(x,y,'#6a7a8a',5));[[38,46],[39,47],[39,48],[40,49],[40,50],[40,51],[41,52]].forEach(([x,y])=>S(x,y,'#6a7a8a',5));A([[39,52],[43,52],[43,55],[39,55]],'#c8d4e0')}
 if(who=='vega'){A([[11,50],[15,47],[52,56],[45,56]],ac,2);for(const p of poly([[11,50],[15,47],[52,56],[45,56]])){const x=p%W,y=(p/W)|0;if(y>=55||x>46)S(x,y,sd(ac,.3),2)}}
 if(who=='pip'){A([[23,46],[41,46],[42,50],[22,50]],ac,2);A([[36,49],[41,49],[43,55],[39,54]],sd(ac,.25),2)}
 if(sp){[[1,0],[3,0],[0,1],[1,1],[2,1],[3,1],[4,1],[1,2],[2,2],[3,2],[2,3]].forEach(([a,b])=>S(16+a,50+b,'#ff5aa8',5));S(17,51,'#ffd0e8',5)}
 // mood FX
 if(mood=='think'){const hand=A([[35,47],[43,44],[47,46],[48,51],[45,55],[38,56],[34,52]],sk,8);for(const p of hand){const x=p%W,y=(p/W)|0;if(x>45||y>54)S(x,y,skd,8)}[[40,47],[41,47],[42,47],[43,47],[40,50],[41,50],[42,50],[43,50],[44,50]].forEach(([x,y])=>S(x,y,sd(sk,.45),8));
  [[1,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2],[1,3]].forEach(([a,b])=>S(48+a,16+b,'#8ad8ff',9));S(48,18,'#fff',9)}
 if(mood=='angry')["..X.X..","..X.X..","XX...XX",".......","XX...XX","..X.X..","..X.X.."].forEach((r,b)=>[...r].forEach((ch,a)=>ch=='X'&&S(48+a,7+b,'#ff3a4a',9)));
 if(mood=='love'){[[1,0],[3,0],[0,1],[1,1],[2,1],[3,1],[4,1],[1,2],[2,2],[3,2],[2,3]].forEach(([a,b])=>S(49+a,9+b,'#ff4a9a',9));[[0,0],[2,0],[1,1]].forEach(([a,b])=>S(56+a,6+b,'#ff8ac0',9));S(50,10,'#ffd0e8',9)}
 if(mood=='happy')[[2,0],[2,1],[0,2],[1,2],[2,2],[3,2],[4,2],[2,3],[2,4]].forEach(([a,b])=>S(50+a,7+b,a==2&&b==2?'#fff':'#fff2a0',9));
 if(mood=='sad')[[1,0],[0,1],[1,1],[2,1],[1,2]].forEach(([a,b])=>S(50+a,14+b,'#6aa8e8',9));
 // internal lines
 const Cp=C.slice();for(let p=0;p<W*H;p++){const l=L[p];if(l!=3&&l!=8&&l!=2)continue;const x=p%W,y=(p/W)|0;
  for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+a,yy=y+b;if(xx<0||yy<0||xx>=W||yy>=H)continue;const m=L[yy*W+xx];if(!m)continue;
   if(l==3&&(m==1||m==2||m==6||m==5)){Cp[p]=skO;break}if(l==8&&m!=8&&m!=7){Cp[p]=skO;break}if(l==2&&m==6){Cp[p]=sd(top,.55);break}}}
 // outline
 const O=Cp.slice();for(let p=0;p<W*H;p++){if(Cp[p])continue;const x=p%W,y=(p/W)|0;if([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const xx=x+a,yy=y+b;return xx>=0&&yy>=0&&xx<W&&yy<H&&Cp[yy*W+xx]}))O[p]=OUT}
 cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');for(let p=0;p<W*H;p++)if(O[p]){g.fillStyle=O[p];g.fillRect(p%W,(p/W)|0,1,1)}
 if(PC4.size>600)PC4.clear();PC4.set(key,cv);return cv}
bust2=bust3;FM13.bust2=bust3;
drawPortrait=function(g,X,Y,look,s=3,mood='',blink=false,talk=false){if(!look||!look.skin)return;const c=bust3(look,mood,blink,talk);g.imageSmoothingEnabled=false;const bw=16*s,bh=14*s;
 if(s>=3)g.drawImage(c,0,0,64,56,Math.round(X+(bw-64)/2),Math.round(Y+(bh-56)),64,56);
 else{const w=Math.round(bw),h=Math.round(bh);g.drawImage(c,Math.round(32-w/2),Math.max(0,Math.min(56-h,Math.round(30-h/2))),w,h,Math.round(X),Math.round(Y),w,h)}};
window.FM14={bust3,EYE,PC4};
})();
