# Farm Mars tests

Headless Chrome (puppeteer-core) tests that play the game on a 915x412 landscape touch phone viewport.

## Run

```
cd tests && npm install        # once (puppeteer-core only, uses system Chrome at /usr/bin/google-chrome; override with CHROME=...)
node tests/run.js              # local: serves the repo on http://localhost:8799 and tests it
node tests/run.js https://gavenecko.github.io/farm-mars/   # live site
```

Exit code 0 = all pass. Screenshots go to `screenshots/` (override with `SHOTS=dir`).

## What is covered

- `run.js` (core): boot + title, credits say "Created by Gavenecko", touch tap on a save slot, new game for every farm layout,
  every door / exit / edge / rescue spawn plus mine floors 1-20 and Rift depths 1-15 are walkable, save/load across 3 slots,
  farm loop (till, plant, water, grow, harvest, ship), shop, NPC talk, mine, combat (swing, charged spin, dodge roll), Bio-Pod,
  mailbox, no console/page errors, and average frame time under 16.7ms at 4x CPU throttle in every major zone.
- `features.js` (round 12+): NPC schedule spots walkable, museum donations/rewards/door, dust storms, Magma Vents floors,
  fishing treasure/perfect catch, storm dialogue and tap-to-talk, plus the feature screenshots.

Add new feature tests to `features.js`. Port 8799 is reserved for this harness.
