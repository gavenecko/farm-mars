// Maps: exteriors generated, interiors authored
const T=16;
function hash(x,y){let h=(x*374761393+y*668265263)|0;h=(h^(h>>>13))*1274126177;return (h^(h>>>16))>>>0}
function mk(w,h,f){const m=[];for(let y=0;y<h;y++){m.push([]);for(let x=0;x<w;x++)m[y].push(f(x,y))}return m}
function fromStr(rows){const w=Math.max(...rows.map(r=>r.length));return rows.map(r=>r.padEnd(w,'w').split(''))}
const MAPS={
 farm:mk(32,22,(x,y)=>{if(y==0&&x>=15&&x<=16)return 'X';if(x==31&&y>=10&&y<=11)return 'X';if(x==0||y==0||x==31||y==21)return 'W';
  if(x==5&&y==5)return 'D';if(x>=2&&x<=7&&y>=2&&y<=5)return 'H';if(x==9&&y==5)return 'B';if(x>=25&&x<=26&&y>=2&&y<=3)return 'T';
  if((x==1||x==30)&&y%4==2)return 'L';if(y>=17&&x>=2&&x<=6&&(x+y)%2)return 'q';return 'g'}),
 city:mk(32,22,(x,y)=>{if(x==0&&y>=10&&y<=11)return 'X';if(x==0||y==0||x==31||y==21)return 'W';
  for(const[a,b,d]of[[2,8,5],[11,18,14],[21,28,24]]){if(x==d&&y==5)return 'D';if(x>=a&&x<=b&&y>=1&&y<=5)return 'H'}
  if(x>=3&&x<=9&&y>=16&&y<=19)return 'A';if(x>=22&&x<=28&&y>=16&&y<=19)return (x+y)%3?'G':'g';
  if(x>=15&&x<=16&&y>=10&&y<=11)return 'F';if((x==11||x==20)&&(y==8||y==14))return 'L';if(x>=12&&x<=19&&y==17)return 'S';return 'p'}),
 home:fromStr(["wwwwwwwwwwww","wkkkwoobbwpw","woooooooooow","woootttoooow","woooooooooow","wrrrrrrrrrrw","woooooooooow","wwwwwDwwwwww"]),
 cafe:fromStr(["wwwwwwwwwwwwww","wsssssssssssew","woooooooooooow","wcccccccooooow","woooooooototow","wotoootoooooow","woooooooototow","wwwwwwDwwwwwww"]),
 shop:fromStr(["wwwwwwwwwwww","wssssssssssw","woooooooooow","wccccccoooow","woooooooohow","wohoooooooow","wwwwwDwwwwww"]),
 cc:fromStr(["wwwwwwwwwwwwwwww","wqqqqoooooojjjjw","woooooooooooooow","wooooooopoooooow","wtotoooooooootow","woooooooooooooow","woooooooooooooow","wwwwwwwDwwwwwwww"]),
};
// surface: large, with rocks, craters, obelisks, mine entrance
MAPS.surf=mk(64,44,(x,y)=>{if(y==43&&x>=31&&x<=32)return 'X';if(x==0||y==0||x==63||y==43)return 'R';
 if(x==50&&y==8)return 'M';if(Math.abs(x-50)<=2&&y>=6&&y<=7)return 'R';if((x==48||x==52)&&y==8)return 'R';
 if(Math.abs(x-31.5)<3&&y>36)return 'r';
 const h=hash(x,y)%1000,n=Math.sin(x*.3)+Math.cos(y*.27)+Math.sin((x+y)*.15);
 if(n>2.2)return 'R';if(h<35)return 'R';if(h<40)return 'O';
 for(const[cx_,cy,r]of[[14,12,4],[40,26,5],[20,32,3],[56,34,4]])if(Math.hypot(x-cx_,y-cy)<r)return 'c';
 if(h>990)return 'V';return 'r'});
const SOLID=new Set(['W','H','B','T','F','R','L','A','w','k','b','p','t','s','e','c_','h','q_','j','O','S','q']);
// interior counters are solid but interactable; 'c' is crater on surf (walkable), counter in interiors
function isSolid(zone,t){if(t=='c')return zone!='surf';if(t=='q')return zone=='cc';return SOLID.has(t)}
// door links: [zone,x,y] exterior door tile -> interior
const DOORS={'farm:5,5':['home',5,6],'city:5,5':['cafe',6,6],'city:14,5':['shop',5,5],'city:24,5':['cc',7,6]};
const EXITS={home:['farm',5,6],cafe:['city',5,6],shop:['city',14,6],cc:['city',24,6]};
// mines
function genMine(floor){const boss=floor==5,w=boss?24:36,h=boss?18:26;let seed=floor*9973+7;const r=()=>(seed=(seed*16807)%2147483647)/2147483647;
 const m=mk(w,h,(x,y)=>{if(x==0||y==0||x==w-1||y==h-1)return 'R';if(!boss&&r()<.07&&!(x<6&&y<6))return 'R';return 'm'});
 m[2][2]='u';let lx,ly;do{lx=Math.floor(w/2+r()*(w/2-3));ly=Math.floor(3+r()*(h-6))}while(m[ly][lx]=='R');if(!boss)m[ly][lx]='v';
 const E=[];if(boss){E.push(mkBug('queen',w/2*T,h/2*T,floor));return{m,E,boss,lx:Math.floor(w/2),ly:h-4}}
 const n=20+floor*2;for(let i=0;i<n;i++){const x=1+Math.floor(r()*(w-2)),y=1+Math.floor(r()*(h-2));if(m[y][x]!='m'||(x<5&&y<5))continue;const q=r();
  let t='stone';if(q<.3)t='iron';else if(q<.42)t='crys';else if(q<.55&&floor>=3)t='cob';else if(q<.6&&floor>=7)t='pla';
  E.push({k:'ore',t,x:x*T+8,y:y*T+8,hp:{stone:2,iron:3,crys:4,cob:6,pla:8}[t]})}
 for(let i=0;i<3+floor;i++){const x=6+Math.floor(r()*(w-8)),y=2+Math.floor(r()*(h-4));if(m[y][x]!='m')continue;const q=Math.random();E.push(mkBug(q<.5?'crawler':q<.8||floor<3?'spitter':'hopper',x*T+8,y*T+8,floor))}
 for(let i=0;i<2+floor/3;i++){const x=2+Math.floor(r()*(w-4)),y=2+Math.floor(r()*(h-4));if(m[y][x]=='m')E.push({k:'plant',t:floor>3?'vmoss':'glowcap',x:x*T+8,y:y*T+8})}
 return{m,E,boss}}
function mkBug(t,x,y,lvl=0){const b=BUGS[t];const hp=Math.round(b.hp*(1+lvl*.15));return{k:'bug',t,x,y,hp,max:hp,vx:0,vy:0,cd:0,st:0,tm:0}}
function genSurface(){const E=[],m=MAPS.surf;let n=0;while(n<80){const x=2+Math.floor(Math.random()*60),y=2+Math.floor(Math.random()*40);const t=m[y][x];if(t!='r'&&t!='c'||(Math.abs(x-31.5)<4&&y>36))continue;const q=Math.random();
  if(q<.4){const ty=t=='c'||Math.random()<.2?'crys':'iron';E.push({k:'ore',t:ty,x:x*T+8,y:y*T+8,hp:ty=='crys'?4:3})}
  else if(q<.7)E.push({k:'plant',t:t=='c'?'lily':Math.random()<.6?'glowcap':'lily',x:x*T+8,y:y*T+8});
  else E.push(mkBug(Math.random()<.7?'crawler':'spitter',x*T+8,y*T+8,0));n++}return E}
