// Shared in-page helper: pathfind by tiles, then drive the player with the touch joystick (real update() physics) into a door.
window.FMWALK=function(){
 function passTile(tx,ty,goal){const t=tileAt(tx,ty);if(t===undefined)return false;if(goal&&tx==goal[0]&&ty==goal[1])return true;if('XDMuv'.includes(t))return false;return feetFree(tx*T+8,ty*T+8)}
 function bfs(s,g){const m=curMap(),w=m[0].length,h=m.length,prev=new Map(),k=(x,y)=>x+','+y,q=[s];prev.set(k(...s),null);
  while(q.length){const[x,y]=q.shift();if(x==g[0]&&y==g[1]){const p=[];let c=k(x,y);while(c){p.unshift(c.split(',').map(Number));c=prev.get(c)}return p}
   for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=w||ny>=h||prev.has(k(nx,ny)))continue;if(!passTile(nx,ny,g))continue;prev.set(k(nx,ny),k(x,y));q.push([nx,ny])}}return null}
 function steer(x,y,maxF){for(let f=0;f<maxF;f++){const dx=x-G.px,dy=y-G.py,d=Math.hypot(dx,dy);if(d<1.2){joy.on=false;return true}joy.on=true;joy.dx=dx/Math.max(d,1);joy.dy=dy/Math.max(d,1);if(d<3){joy.dx*=.6/0.6;}modal=null;const z=G.zone;update();if(G.zone!=z){joy.on=false;return 'zone'}}joy.on=false;return false}
 // walk from current position to door tile [dx,dy] in current zone; returns {ok,why,zone}
 function walkTo(door){const z0=G.zone,s=[Math.floor(G.px/T),Math.floor(G.py/T)],p=bfs(s,door);if(!p)return{ok:false,why:'no tile path'};
  for(let i=1;i<p.length;i++){const[tx,ty]=p[i],last=i==p.length-1;const r=steer(tx*T+8,ty*T+(last?10:8),400);if(r=='zone')return{ok:true,zone:G.zone,steps:i};if(!r)return{ok:false,why:'stuck at '+Math.floor(G.px/T)+','+Math.floor(G.py/T)+' heading '+tx+','+ty+(modal?' modal:'+modal.name:'')}}
  // push into the door
  const d=[door[0]*T+8-G.px,door[1]*T+8-G.py];for(let f=0;f<60;f++){joy.on=true;const n=Math.hypot(...d)||1;joy.dx=d[0]/n||0;joy.dy=d[1]/n||(door[1]*T>G.py?1:-1);update();if(G.zone!=z0){joy.on=false;return{ok:true,zone:G.zone}}}joy.on=false;return{ok:false,why:'door did not trigger'+(modal?' ('+modal.name+': '+(modal.pages[0]||'').slice(0,60)+')':'')}}
 return{bfs,walkTo,passTile}}();
