# First-season economy sim for Farm Mars. Greedy player: replant every free tile with best ROI seed
# that matures before season end, energy-limited (till 2, water 1/tile tier-1 can = ceil(n/2) per swing ~0.5-1),
# plus optional mine trips. Usage: python3 econ_sim.py [start_money] [water_cost]
import sys
CROPS={'pot':(20,3,45),'let':(15,2,30),'wht':(10,3,25)}
def run(grant=0,let_p=15,start=400,sols=7,en=100,water=1.0,till=2,seeds={'pot':6,'let':6,'wht':4},mine=0,label=''):
    CROPS['let']=(let_p,2,30)
    money=start;tiles=[];tilled=0;log=[]
    inv=dict(seeds)
    for d in range(1,sols+1):
        e=en
        if d==2: money+=grant
        # water existing
        e-=water*len(tiles)
        # harvest ready -> ship
        earn=0;keep=[]
        for t in tiles:
            t[1]-=1
            if t[1]<=0: earn+=CROPS[t[0]][2]
            else: keep.append(t)
        free=tilled-len(keep);tiles=keep
        # plant: free starter seeds first then buy
        left=sols-d+1
        while e>=water:
            cand=[c for c in CROPS if CROPS[c][1]<=left]
            if not cand: break
            c=next((c for c in cand if inv.get(c,0)>0),None)
            if c is None:
                c=max(cand,key=lambda c:(CROPS[c][2]-CROPS[c][0])/CROPS[c][1])
                if money<CROPS[c][0]: break
                money-=CROPS[c][0]
            else: inv[c]-=1
            need=water+(0 if free>0 else till)
            if e<need: 
                if c in inv and inv[c]>=0 and money>=0: pass
                break
            e-=need
            if free>0: free-=1
            else: tilled+=1
            tiles.append([c,CROPS[c][1]])
        e_left=e
        mi=mine if e_left>=30 else 0
        money+=mi
        log.append((d,money,len(tiles),int(e_left),earn))
        money+=earn  # shipped overnight
    return money,log
if __name__=='__main__':
    for lab,kw in [('current (400cr start)',{}),('round 11 (500cr, 8 pot/10 let seeds, lettuce 12cr, 150cr grant on sol 2)',{'start':500,'seeds':{'pot':8,'let':10,'wht':4},'grant':150,'let_p':12})]:
        m,log=run(**kw);print('==',lab);[print(' sol %d: cash %5d tiles %3d energyLeft %3d shippedOvernight %4d'%r) for r in log];print(' end-of-season credits',m)
