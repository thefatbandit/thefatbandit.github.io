/*
 * ASCII hippo pond (side view): interactive 404 page.
 *
 * A side-on look through the water, like an underwater viewing window, drawn
 * as a grid of character cells. Each frame the hippos are painted in profile
 * onto a tiny offscreen canvas with one pixel per cell, and every covered
 * pixel becomes a tinted tile whose glyph comes from a density ramp. Cells
 * under the waterline are tinted, so a submerged hippo reads as under water.
 *
 *   Tap the water   -> a ripple at the surface (or bubbles under it);
 *                      nearby hippos sink and swim away
 *   Press and hold  -> the nearest hippo rears up, jaws open, and a
 *                      watermelon drops straight in. crunch!
 *   Keyboard (pond focused): Enter = ripple, F = feed
 *
 * Plain canvas 2D, no dependencies. Follows Toha's light/dark theme via
 * html[data-theme] and slows right down under prefers-reduced-motion.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('hippo-pond');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var field = document.createElement('canvas');
  var fctx = field.getContext('2d', { willReadFrequently: true });

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var MOTION = reduceMotion ? 0.3 : 1;
  var LONG_PRESS = 450;
  var MONO = 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';
  var RAMP = " .'`:-=+*%#8@";
  var SAND = ".,:'`.,..";

  // ------------------------------------------------------------ theme tokens
  var THEMES = {
    light: {
      pond: '#eef2f6', grid: 'rgba(15,23,42,0.045)', water: [14, 116, 144], waterBg: 'rgba(14,116,144,0.06)',
      ripple: '14,116,144', sand: 'rgba(146,118,78,', glyphTo: [15, 23, 42], glyphK: 0.55, tileA: 0.42, ink: 'light',
      skin: '#857a8c', skinHi: '#b2a5bc', skinLo: '#5a5064', belly: '#c49aa6', muzzle: '#a8929c',
      baby: { skin: '#a3899a', skinHi: '#c9b0bf', skinLo: '#76606f', belly: '#d9a9b6', muzzle: '#bf9fae' },
      pink: '#e0899f', dark: '#2a2230', fish: '71,105,125', bannerText: '#1e293b'
    },
    dark: {
      pond: '#070b14', grid: 'rgba(148,163,184,0.055)', water: [34, 211, 238], waterBg: 'rgba(34,211,238,0.05)',
      ripple: '34,211,238', sand: 'rgba(196,170,128,', glyphTo: [255, 255, 255], glyphK: 0.45, tileA: 0.5, ink: 'dark',
      skin: '#9b8fae', skinHi: '#cbc1d9', skinLo: '#5d5470', belly: '#d3a9b6', muzzle: '#b79fb0',
      baby: { skin: '#b39aae', skinHi: '#dcc7d6', skinLo: '#6f5a6b', belly: '#e2b3c1', muzzle: '#c9a8bb' },
      pink: '#e78ea6', dark: '#140f18', fish: '156,195,213', bannerText: '#f1f5f9'
    }
  };
  var th = THEMES.light, dark = false;
  function readTheme() {
    dark = document.documentElement.getAttribute('data-theme') === 'dark';
    th = dark ? THEMES.dark : THEMES.light;
    buildGrid();
  }

  // ------------------------------------------------------------ helpers
  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function rot(x, y, a) { var c = Math.cos(a), s = Math.sin(a); return { x: x * c - y * s, y: x * s + y * c }; }
  function oval(c, x, y, rx, ry) { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, Math.PI * 2); }
  function rrect(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function vibrate(ms) { if (navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { /* ignore */ } } }

  // ------------------------------------------------------------ state
  var W = 0, H = 0, DPR = 1, cw = 8, ch = 10, cols = 0, rows = 0, S = 50, fontPx = 8;
  var waterY = 0, floorY = 0, waterRow = 0, floorRow = 0;
  var t = 0, last = 0, gridBg = null;
  var hippos = [], melons = [], ripples = [], bubbles = [], bits = [], words = [], fish = [];
  var press = null, nextDip = rand(8, 14);

  // ------------------------------------------------------------ layout
  function resize() {
    var w = Math.max(280, Math.round(canvas.parentElement.clientWidth));
    var h = w < 560 ? Math.round(w * 1.05) : Math.round(clamp(w * 0.52, 340, 520));
    var oldW = W, oldH = H;
    W = w; H = h; DPR = Math.min(2, window.devicePixelRatio || 1);
    cw = clamp(W / 120, 6, 9);
    ch = cw * 1.3;
    cols = Math.ceil(W / cw); rows = Math.ceil(H / ch);
    fontPx = Math.round(ch * 0.8);
    waterRow = Math.round(rows * 0.3); waterY = waterRow * ch + ch / 2;
    floorRow = Math.round(rows * 0.9); floorY = floorRow * ch;
    S = clamp(Math.min(W / 13, (floorY - waterY) / 3.5), 22, 80);
    field.width = cols; field.height = rows;
    canvas.style.height = H + 'px';
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    if (oldW) {
      hippos.forEach(function (hp) { hp.x *= W / oldW; hp.y *= H / oldH; hp.wx *= W / oldW; });
      melons.forEach(function (m) { m.x *= W / oldW; m.y *= H / oldH; });
      fish.forEach(function (f) { f.x *= W / oldW; f.y *= H / oldH; });
    }
    buildGrid();
    if (!hippos.length) spawn();
  }

  function buildGrid() {
    if (!W) return;
    gridBg = document.createElement('canvas');
    gridBg.width = Math.round(W * DPR); gridBg.height = Math.round(H * DPR);
    var g = gridBg.getContext('2d');
    g.scale(DPR, DPR);
    g.fillStyle = th.pond; g.fillRect(0, 0, W, H);
    g.fillStyle = th.waterBg; g.fillRect(0, waterY, W, H - waterY);
    g.strokeStyle = th.grid; g.lineWidth = 1;
    g.beginPath();
    for (var c = 0; c <= cols; c++) { var x = Math.round(c * cw) + 0.5; g.moveTo(x, 0); g.lineTo(x, H); }
    for (var r = 0; r <= rows; r++) { var y = Math.round(r * ch) + 0.5; g.moveTo(0, y); g.lineTo(W, y); }
    g.stroke();
    // sandy floor written in characters
    g.font = fontPx + 'px ' + MONO; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (var row = floorRow; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var hsh = (col * 73856093) ^ (row * 19349663);
        var depth = (row - floorRow) / Math.max(1, rows - floorRow);
        if ((hsh & 7) > 5 - depth * 4) continue;
        g.fillStyle = th.sand + (0.35 + depth * 0.4).toFixed(2) + ')';
        g.fillText(SAND.charAt(Math.abs(hsh) % SAND.length), col * cw + cw / 2, row * ch + ch / 2);
      }
    }
    if (dark) { // a few stars above the water
      g.fillStyle = 'rgba(226,232,240,0.5)';
      for (var k = 0; k < 18; k++) g.fillText('.', Math.random() * W, Math.random() * waterY * 0.8);
    }
  }

  // ------------------------------------------------------------ hippos
  function ySurface(h) { return waterY + 0.42 * h.s; }
  function yBottom(h) { return floorY - 0.97 * h.s; }
  function yRear(h) { return waterY + 0.6 * h.s; }
  function xMin(h) { return 1.35 * h.s; }
  function xMax(h) { return W - 2.0 * h.s; }

  function makeHippo(x, base, baby, want) {
    var h = {
      x: x, y: 0, vx: 0, vy: 0, base: base, s: S * base, baby: baby, parent: null, dir: Math.random() < 0.5 ? -1 : 1,
      tilt: 0, tiltT: 0, g: 0, gT: 0, walk: rand(0, 6), bob: 0, mode: 'idle', mt: 0, until: 0, flee: 1,
      want: want, nextWant: rand(7, 14), wx: x, nextWander: rand(2, 5), blink: 0, nextBlink: rand(1, 4), target: null
    };
    h.y = want === 'surface' ? ySurface(h) : yBottom(h);
    return h;
  }

  function spawn() {
    var mum = makeHippo(W * 0.58, 1.1, false, 'surface');
    var baby = makeHippo(W * 0.2, 0.56, true, 'surface');
    baby.parent = mum;
    baby.x = Math.max(xMin(baby), mum.x - (2.05 * mum.s + 2.05 * baby.s * 1.2 + cw * 3)); // start clear of mum
    hippos = [mum, baby];
    fish = [];
    for (var i = 0; i < 4; i++) fish.push({ x: rand(W * 0.1, W * 0.9), y: rand(waterY + ch * 3, floorY - ch * 2), vx: rand(-20, 20), vy: 0, tx: 0, ty: 0, retarget: 0, ph: rand(0, 6) });
  }

  function setMode(h, m) { h.mode = m; h.mt = 0; }
  function busy(h) { return h.mode === 'catch' || h.mode === 'chew'; }

  // local hippo units (facing +x, origin = body centre) -> pond pixels
  var HINGE = { x: 0.95, y: -0.02 };
  function headScale(h) { return h.baby ? 1.2 : 1; }
  function l2w(h, ux, uy) {
    var r = rot(ux, uy, h.tilt);
    return { x: h.x + h.dir * r.x * h.s, y: h.y + h.bob + r.y * h.s };
  }
  function mouthPoint(h) {
    var a = 1.05 * h.g, b = 0.3 * h.g, hs = headScale(h), p = rot(0.55, -0.05, (-a + b) / 2);
    return l2w(h, HINGE.x + p.x * hs, HINGE.y + p.y * hs);
  }
  function nosePoint(h) {
    var hs = headScale(h), p = rot(0.9, -0.5, -1.05 * h.g);
    return l2w(h, HINGE.x + p.x * hs, HINGE.y + p.y * hs);
  }

  function updateHippo(h, dt) {
    h.s = S * h.base;
    h.mt += dt;
    if (h.blink > 0) h.blink = Math.max(0, h.blink - dt);
    else if (t > h.nextBlink) { h.blink = 0.15; h.nextBlink = t + rand(2.5, 6); }

    var tx = h.wx, ty = h.want === 'surface' ? ySurface(h) : yBottom(h);
    var speed = h.s * 0.4, hold = false, urgent = false;
    h.gT = 0; h.tiltT = 0;

    if (h.mode === 'startled') {
      ty = yBottom(h); speed = h.s * (h.mt < 1.2 ? 1.3 : 0.5);
      tx = h.flee > 0 ? xMax(h) : xMin(h);
      if (h.mt > 2.6) { h.want = 'surface'; h.nextWant = t + rand(6, 10); setMode(h, 'idle'); }
    } else if (h.mode === 'dip') {
      ty = yBottom(h);
      if (h.mt > h.until) { h.want = 'surface'; setMode(h, 'idle'); }
    } else if (h.mode === 'catch') {
      ty = yRear(h); hold = true; urgent = true; h.tiltT = -0.55; h.gT = 1;
      if (h.mt > 7) setMode(h, 'idle');
    } else if (h.mode === 'chew') {
      ty = ySurface(h); hold = true; h.tiltT = -0.15;
      h.g = 0.28 * Math.abs(Math.sin(h.mt * 11));
      if (h.mt > 1.1) { h.want = 'surface'; h.nextWant = t + rand(5, 9); setMode(h, 'idle'); }
    }

    if (h.mode === 'idle') {
      if (h.parent) {
        var p = h.parent;
        h.want = p.want;
        var gap = cw * 2;
        tx = p.x - p.dir * (1.4 * p.s + 2.1 * h.s + gap);          // just behind her tail
        if (tx < xMin(h) || tx > xMax(h)) tx = p.x + p.dir * (2.1 * p.s + 1.4 * h.s + gap); // or ahead of her nose
        ty = p.want === 'surface' ? ySurface(h) : yBottom(h);
        speed = h.s * 1.1;
      } else {
        if (t > h.nextWant) {
          h.want = h.want === 'surface' ? 'bottom' : 'surface';
          h.nextWant = t + (h.want === 'surface' ? rand(8, 14) : rand(6, 11));
        }
        if (t > h.nextWander || Math.abs(h.wx - h.x) < h.s * 0.3) {
          h.wx = rand(xMin(h), xMax(h));
          h.nextWander = t + rand(5, 10);
        }
      }
      if (h.vy < -h.s * 0.15) h.tiltT = -0.15; else if (h.vy > h.s * 0.15) h.tiltT = 0.1;
    }

    // motion
    var dvx = hold ? 0 : clamp((tx - h.x) * 0.9, -speed, speed);
    h.vx += (dvx - h.vx) * Math.min(1, dt * 1.8);
    var vmaxY = h.s * (urgent ? 3 : 1.3);
    var dvy = clamp((ty - h.y) * (urgent ? 2.6 : 1.3), -vmaxY, vmaxY);
    h.vy += (dvy - h.vy) * Math.min(1, dt * (urgent ? 4 : 2.2));

    hippos.forEach(function (o) {
      if (o === h || o === h.parent || o.parent === h) return;
      var dx = h.x - o.x;
      if (Math.abs(h.y - o.y) < (h.s + o.s) * 0.6 && Math.abs(dx) < (h.s + o.s) * 1.25) h.vx += (dx >= 0 ? 1 : -1) * h.s * dt * 2.5;
    });

    h.x += h.vx * dt * MOTION;
    h.y += h.vy * dt * MOTION;
    h.x = clamp(h.x, xMin(h), xMax(h));
    h.y = clamp(h.y, waterY + 0.3 * h.s, yBottom(h));
    if (!hold && Math.abs(h.vx) > h.s * 0.08) h.dir = h.vx > 0 ? 1 : -1;

    var onFloor = h.y > yBottom(h) - 0.12 * h.s, ws = Math.abs(h.vx) / h.s;
    h.walk += dt * MOTION * (onFloor ? 2 + ws * 5 : 1.5);
    h.bob = onFloor && ws > 0.08 ? -Math.abs(Math.sin(h.walk)) * 0.15 * h.s : Math.sin(t * 1.3 + h.base * 5) * 0.03 * h.s;
    h.tilt += (h.tiltT - h.tilt) * Math.min(1, dt * 3);
    if (h.mode !== 'chew') h.g += (h.gT - h.g) * Math.min(1, dt * 7);

    if (!reduceMotion && onFloor && Math.random() < dt * 0.35) {
      var n = nosePoint(h); bubbles.push({ x: n.x, y: n.y, vy: -rand(30, 60), ph: rand(0, 6) });
    }
  }

  // Keep the two hippos from overlapping: compare their full extents (tail to
  // snout, back to feet, plus a rearing head) and slide the baby, or mum if
  // the baby is pinned against a wall, to the nearer clear side.
  function extent(h) {
    // same reach on both sides, so a hippo turning round doesn't change it
    var reach = 2.05 * h.s * headScale(h);
    var rear = clamp(-h.tilt / 0.55, 0, 1) * 1.1 * h.s;
    return {
      l: h.x - reach, r: h.x + reach,
      t: h.y + h.bob - (0.8 * h.s + rear), b: h.y + h.bob + 1.0 * h.s
    };
  }
  function keepApart(dt) {
    var big = hippos[0], small = hippos[1];
    if (!big || !small) return;
    var A = extent(big), B = extent(small), pad = cw;
    if (A.r + pad <= B.l || B.r + pad <= A.l || A.b <= B.t || B.b <= A.t) return; // clear
    // Overlaps build up a few pixels per frame, so resolving them fully each
    // frame reads as the baby being nudged along, not as a jump.
    // Pick the smallest push on any axis (prefer moving the baby). A baby
    // sinking onto mum is held just above her until it has drifted clear,
    // instead of being shoved a whole body-length sideways.
    var toRight = A.r + pad - B.l, toLeft = B.r + pad - A.l;
    var toUp = B.b - A.t + pad, toDown = A.b - B.t + pad;
    var options = [
      { h: small, dx: toRight, dy: 0 }, { h: small, dx: -toLeft, dy: 0 },
      { h: small, dx: 0, dy: -toUp }, { h: small, dx: 0, dy: toDown },
      { h: big, dx: -toRight, dy: 0 }, { h: big, dx: toLeft, dy: 0 },
      { h: big, dx: 0, dy: toUp }, { h: big, dx: 0, dy: -toDown }
    ].filter(function (o) {
      var nx = o.h.x + o.dx, ny = o.h.y + o.dy;
      return nx >= xMin(o.h) && nx <= xMax(o.h) && ny >= waterY + 0.3 * o.h.s && ny <= yBottom(o.h);
    }).map(function (o) { o.cost = (Math.abs(o.dx) + Math.abs(o.dy)) * (o.h === big ? 1.3 : 1); return o; })
      .sort(function (p, q) { return p.cost - q.cost; });
    if (!options.length) return;
    // Cap each nudge so a squeeze (say mum rising under a baby already at the
    // surface) plays out as both gliding apart over a few frames, not a jump.
    var cap = Math.max(cw, small.s * 0.15);
    var o = options[0], len = Math.abs(o.dx) + Math.abs(o.dy), k = Math.min(1, cap / len);
    o.h.x += o.dx * k; o.h.y += o.dy * k;
    if (o.dx) o.h.vx *= 0.5;
    if (o.dy) o.h.vy = 0;
    if (k < 1) { // share the rest with the other hippo, moving the opposite way
      var other = options.filter(function (q) { return q.h !== o.h && Math.sign(q.dx) === -Math.sign(o.dx) && Math.sign(q.dy) === -Math.sign(o.dy); })[0];
      if (other) {
        var rest = len * (1 - k), ol = Math.abs(other.dx) + Math.abs(other.dy), k2 = Math.min(1, Math.min(cap, rest) / ol);
        other.h.x += other.dx * k2; other.h.y += other.dy * k2;
        if (other.dx) other.h.vx *= 0.5;
        if (other.dy) other.h.vy = 0;
      }
    }
  }

  // Paint one hippo, in profile, into the field canvas (pond pixels).
  function paintHippo(h) {
    var c = fctx, g = clamp(h.g, 0, 1), P = h.baby ? th.baby : th;
    c.save();
    c.translate(h.x, h.y + h.bob);
    c.scale(h.dir * h.s, h.s);
    c.rotate(h.tilt);

    var onFloor = h.y > yBottom(h) - 0.12 * h.s;
    var amp = onFloor ? clamp(Math.abs(h.vx) / h.s, 0, 1) * 0.5 + 0.05 : 0.2, sw = Math.sin(h.walk);

    leg(c, 0.5, 0.28, -sw * amp, P.skinLo);   // far legs
    leg(c, -0.74, 0.28, sw * amp, P.skinLo);
    c.fillStyle = P.skinLo;                   // tail
    c.beginPath(); c.moveTo(-1.02, -0.28); c.quadraticCurveTo(-1.32, -0.1, -1.28, 0.12); c.lineTo(-1.04, -0.04); c.closePath(); c.fill();

    var body = c.createLinearGradient(0, -0.64, 0, 0.64);   // barrel body, lit from above
    body.addColorStop(0, P.skinLo); body.addColorStop(0.3, P.skinHi);
    body.addColorStop(0.65, P.skin); body.addColorStop(1, P.belly);
    c.fillStyle = body; oval(c, 0, 0, 1.12, 0.64); c.fill();

    leg(c, 0.66, 0.3, sw * amp, P.skin);      // near legs
    leg(c, -0.6, 0.3, -sw * amp, P.skin);

    // head, hinged at the jaw
    var hs = headScale(h), a = 1.05 * g, b = 0.3 * g;
    c.save();
    c.translate(HINGE.x, HINGE.y);
    c.scale(hs, hs);
    c.fillStyle = P.skin; oval(c, -0.12, -0.08, 0.42, 0.5); c.fill();   // jowl

    if (g > 0.03) { // mouth cavity between the jaws
      var ut = rot(0.95, 0.02, -a), lt = rot(0.9, -0.02, b);
      c.fillStyle = th.pink;
      c.beginPath(); c.moveTo(-0.05, 0); c.lineTo(ut.x, ut.y); c.lineTo(lt.x, lt.y); c.closePath(); c.fill();
    }

    c.save(); c.rotate(b);                   // lower jaw
    c.fillStyle = P.muzzle; rrect(c, -0.1, -0.02, 0.98, 0.34, 0.15); c.fill();
    if (g > 0.03) {
      c.fillStyle = '#ffffff';               // tusks
      rrect(c, 0.66, -0.12 - 0.42 * g, 0.12, 0.14 + 0.42 * g, 0.05); c.fill();
      rrect(c, 0.84, -0.06 - 0.12 * g, 0.08, 0.08 + 0.12 * g, 0.03); c.fill();
    }
    c.restore();

    c.save(); c.rotate(-a);                  // upper head
    c.fillStyle = P.skinLo;                 // ear
    c.save(); c.translate(-0.22, -0.66); c.rotate(-0.35);
    oval(c, 0, 0, 0.1, 0.15); c.fill(); c.fillStyle = th.pink; oval(c, 0, 0.02, 0.05, 0.09); c.fill();
    c.restore();
    var head = c.createLinearGradient(0, -0.7, 0, 0.05);
    head.addColorStop(0, P.skinHi); head.addColorStop(1, P.skin);
    c.fillStyle = head; oval(c, -0.05, -0.3, 0.45, 0.38); c.fill();                 // cranium
    c.fillStyle = P.muzzle; rrect(c, 0.04, -0.52, 0.98, 0.56, 0.24); c.fill();     // big boxy snout
    c.fillStyle = P.skinHi; oval(c, 0.07, -0.6, 0.17, 0.14); c.fill();             // eye bump
    if (h.blink <= 0) { c.fillStyle = '#ffffff'; oval(c, 0.1, -0.62, 0.1, 0.085); c.fill(); }  // eye
    c.fillStyle = th.dark;
    oval(c, 0.9, -0.5, 0.08, 0.06); c.fill();                                      // nostril
    if (g <= 0.03) { c.fillRect(0.2, -0.02, 0.8, 0.07); }                           // closed mouth line
    c.restore();

    c.restore(); // head
    c.restore(); // hippo
    paintFace(h);
  }

  // The face features are smaller than a character cell, so they are snapped
  // to whole cells: that keeps the eye a crisp 'o', the nostril a dark dot and
  // the tusks white, at any size.
  function cellAt(x, y, color) {
    fctx.fillStyle = color;
    fctx.fillRect(Math.floor(x / cw) * cw, Math.floor(y / ch) * ch, cw, ch);
  }
  function headPoint(h, ux, uy, jaw) {
    var hs = headScale(h), p = rot(ux, uy, jaw);
    return l2w(h, HINGE.x + p.x * hs, HINGE.y + p.y * hs);
  }
  function paintFace(h) {
    var a = 1.05 * h.g, b = 0.3 * h.g;
    var eye = headPoint(h, 0.1, -0.62, -a);
    if (h.blink <= 0) cellAt(eye.x, eye.y, '#ffffff');
    var nose = headPoint(h, 0.9, -0.5, -a);
    cellAt(nose.x, nose.y, th.dark);
    if (h.g > 0.3) {
      var tusk = headPoint(h, 0.72, -0.2 - 0.3 * h.g, b);
      cellAt(tusk.x, tusk.y, '#ffffff');
      if (h.s > S * 0.8) { var tusk2 = headPoint(h, 0.72, -0.05 - 0.15 * h.g, b); cellAt(tusk2.x, tusk2.y, '#ffffff'); }
    } else if (!h.baby || h.s > ch * 3) {
      for (var k = 0; k < 3; k++) { var m = headPoint(h, 0.45 + k * 0.2, 0.02, 0); cellAt(m.x, m.y, th.dark); } // mouth line
    }
  }

  function leg(c, x, y, swing, fill) {
    c.save(); c.translate(x, y); c.rotate(swing);
    c.fillStyle = fill; rrect(c, -0.15, -0.08, 0.3, 0.72, 0.13); c.fill();
    c.restore();
  }

  // ------------------------------------------------------------ melons
  function dropMelon(x, y) {
    if (melons.length >= 2) return;
    var pick = null, bd = Infinity;
    hippos.forEach(function (h) {
      if (busy(h)) return;
      var d = Math.hypot(h.x - x, (h.y - y) * 0.6) * (h.baby ? 1.2 : 1);
      if (d < bd) { bd = d; pick = h; }
    });
    if (!pick) return;
    vibrate(12);
    setMode(pick, 'catch');
    pick.vx = 0;
    melons.push({ x: pick.x, y: -S, vy: 0, r: pick.s * 0.33, state: 'wait', hippo: pick });
  }

  function updateMelon(m, dt) {
    var h = m.hippo;
    if (h.mode !== 'catch') { melons.splice(melons.indexOf(m), 1); return; }
    var mp = mouthPoint(h);
    m.x = mp.x; m.r = h.s * 0.33;
    if (m.state === 'wait') {
      if (Math.abs(h.y - yRear(h)) < 0.3 * h.s && h.g > 0.6) m.state = 'fall';
      return;
    }
    m.vy += 1300 * dt; m.y += m.vy * dt;
    if (m.y >= mp.y) chomp(h, m);
  }

  function paintMelon(m) {
    if (m.state === 'wait') return;
    var c = fctx, r = m.r;
    c.fillStyle = '#4d9a3a'; oval(c, m.x, m.y, r, r * 0.86); c.fill();
    c.strokeStyle = '#1f5f2a'; c.lineWidth = r * 0.22;
    for (var k = -1; k <= 1; k++) { c.beginPath(); c.ellipse(m.x + k * r * 0.45, m.y, r * 0.12, r * 0.75, 0, 0, Math.PI * 2); c.stroke(); }
  }

  function chomp(h, m) {
    melons.splice(melons.indexOf(m), 1);
    var mp = mouthPoint(h);
    for (var i = 0; i < 10; i++) {
      bits.push({ x: mp.x, y: mp.y, vx: rand(-90, 90), vy: -rand(60, 170), life: 0, col: i % 3 ? '#e5484d' : '#4d9a3a' });
    }
    say('crunch!', mp.x, mp.y - h.s * 1.1);
    ring(h.x + h.dir * h.s, waterY, h.s * 2.2, 1.1, 0.8);
    vibrate(18);
    setMode(h, 'chew');
  }

  // ------------------------------------------------------------ fish
  // Little ASCII fish ('><>' / '<><') that wander under the surface, slip
  // behind the hippos, scatter from taps and nibble sinking melon bits.
  function updateFish(f, dt) {
    f.retarget -= dt;
    f.ph += dt * 6;
    var bit = null, bd = 150;
    bits.forEach(function (p) {
      if (p.y < waterY + ch) return;
      var dd = Math.hypot(p.x - f.x, p.y - f.y);
      if (dd < bd) { bd = dd; bit = p; }
    });
    if (bit) { f.tx = bit.x; f.ty = bit.y; if (bd < cw * 1.5) bit.life = 99; }
    else if (f.retarget <= 0) {
      f.tx = rand(cw * 3, W - cw * 3); f.ty = rand(waterY + ch * 2.5, floorY - ch * 1.5); f.retarget = rand(3, 7);
    }
    var sp = bit ? 90 : 32, dx = f.tx - f.x, dy = f.ty - f.y, dd2 = Math.hypot(dx, dy) || 1;
    f.vx += ((dx / dd2) * Math.min(sp, dd2 * 2) - f.vx) * Math.min(1, dt * 2);
    f.vy += ((dy / dd2) * Math.min(sp, dd2 * 2) * 0.6 - f.vy) * Math.min(1, dt * 2);
    f.x = clamp(f.x + f.vx * dt * MOTION, cw * 2, W - cw * 2);
    f.y = clamp(f.y + f.vy * dt * MOTION, waterY + ch * 1.5, floorY - ch);
  }

  function drawFish(f, d) {
    var right = f.vx >= 0, flick = Math.sin(f.ph) > 0.4;
    var body = right ? (flick ? '}<>' : '><>') : (flick ? '<>{' : '<><');
    var row = Math.floor(f.y / ch), c0 = Math.round(f.x / cw) - 1;
    if (row <= waterRow || row >= rows) return;
    for (var j = 0; j < 3; j++) {
      var col = c0 + j;
      if (col < 0 || col >= cols) continue;
      if (d[(row * cols + col) * 4 + 3] >= 26) continue; // tucked behind a hippo
      ctx.fillStyle = 'rgba(' + th.fish + ',0.9)';
      ctx.fillText(body.charAt(j), col * cw + cw / 2, row * ch + ch / 2 + 0.5);
    }
  }

  // ------------------------------------------------------------ banner
  // A small framed sign in the sky, written into the grid: For Fiona.
  var BANNER = [
    ".---------------.",
    "|  For Fiona \u2665  |",
    "'---------------'"
  ];
  function drawBanner(d) {
    var wdt = BANNER[0].length;
    var c0 = Math.round((cols - wdt) / 2), r0 = Math.max(1, Math.round(waterRow * 0.22));
    if (r0 + BANNER.length >= waterRow) r0 = Math.max(0, waterRow - BANNER.length - 1);
    for (var r = 0; r < BANNER.length; r++) {
      var line = BANNER[r], row = r0 + r;
      for (var j = 0; j < line.length; j++) {
        var col = c0 + j, chr = line.charAt(j);
        if (col < 0 || col >= cols) continue;
        if (d[(row * cols + col) * 4 + 3] >= 26) continue; // a rearing hippo passes in front
        var x = col * cw, y = row * ch;
        ctx.fillStyle = th.pond; ctx.fillRect(x, y, cw, ch);
        if (chr === ' ') continue;
        var frame = r !== 1 || chr === '|';
        ctx.fillStyle = chr === '\u2665' ? th.pink : frame ? 'rgba(' + th.ripple + ',0.55)' : th.bannerText;
        ctx.fillText(chr, x + cw / 2, y + ch / 2 + 0.5);
      }
    }
  }

  // ------------------------------------------------------------ effects
  function ring(x, y, max, life, k) { ripples.push({ x: x, y: y, max: max, life: 0, maxLife: life / Math.max(MOTION, 0.6), k: k || 1 }); }
  function say(text, x, y) { words.push({ text: text, x: x, y: Math.max(ch, y), life: 0, max: 1.4 }); }

  function updateEffects(dt) {
    var i;
    for (i = ripples.length - 1; i >= 0; i--) { ripples[i].life += dt; if (ripples[i].life >= ripples[i].maxLife) ripples.splice(i, 1); }
    for (i = bubbles.length - 1; i >= 0; i--) {
      var b = bubbles[i]; b.y += b.vy * dt * MOTION; b.ph += dt * 5; b.x += Math.sin(b.ph) * 6 * dt;
      if (b.y <= waterY) { ring(b.x, waterY, S * 0.5, 0.6, 0.5); bubbles.splice(i, 1); }
    }
    for (i = bits.length - 1; i >= 0; i--) {
      var p = bits[i]; p.life += dt;
      if (p.y < waterY) { p.vy += 520 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
      else { p.vx *= 0.9; p.x += p.vx * dt; p.y += 22 * dt; }   // sinks slowly once in the water
      if (p.life > 3.5 || p.y > floorY) bits.splice(i, 1);
    }
    for (i = words.length - 1; i >= 0; i--) { words[i].life += dt; words[i].y -= 10 * dt; if (words[i].life >= words[i].max) words.splice(i, 1); }
  }

  // ------------------------------------------------------------ rendering
  function render() {
    // 1. paint everything at one pixel per cell
    fctx.setTransform(1, 0, 0, 1, 0, 0);
    fctx.clearRect(0, 0, cols, rows);
    fctx.setTransform(1 / cw, 0, 0, 1 / ch, 0, 0);
    hippos.slice().sort(function (a, b) { return b.base - a.base; }).forEach(paintHippo);
    melons.forEach(paintMelon);
    bits.forEach(function (b) {
      fctx.fillStyle = b.col;
      fctx.fillRect(b.x - cw * 0.6, b.y - ch * 0.6, cw * 1.2, ch * 1.2);
    });
    var d = fctx.getImageData(0, 0, cols, rows).data;


    // 2. the pond, grid and sand
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.drawImage(gridBg, 0, 0, W, H);
    ctx.font = fontPx + 'px ' + MONO;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 3. cells -> tiles + glyphs; under the waterline they take the water tint
    var gt = th.glyphTo, gk = th.glyphK, wt = th.water, lastIdx = RAMP.length - 1;
    for (var row = 0; row < rows; row++) {
      var under = row > waterRow, wk = under ? 0.3 : 0, aMul = under ? 0.8 : 1;
      for (var col = 0; col < cols; col++) {
        var i = (row * cols + col) * 4, a = d[i + 3];
        var x = col * cw, y = row * ch;
        if (a < 26) {
          if (row === waterRow) { // the surface line
            var wv = Math.sin(col * 0.45 - t * 2.2 * MOTION) + Math.sin(col * 0.17 + t * 1.3 * MOTION);
            ctx.fillStyle = 'rgba(' + th.ripple + ',' + (0.45 + 0.2 * wv).toFixed(2) + ')';
            ctx.fillText(wv > 0.6 ? '~' : wv < -0.8 ? '_' : '-', x + cw / 2, y + ch / 2 + 0.5);
          }
          continue;
        }
        var r = d[i], g = d[i + 1], b = d[i + 2], af = (a / 255) * aMul;
        if (r > 232 && g > 232 && b > 232) { // eyes and tusks
          ctx.fillStyle = 'rgba(255,255,255,' + (0.9 * af).toFixed(2) + ')';
          ctx.fillRect(x + 0.5, y + 0.5, cw - 1, ch - 1);
          ctx.fillStyle = 'rgba(15,23,42,' + af.toFixed(2) + ')';
          ctx.fillText('o', x + cw / 2, y + ch / 2 + 0.5);
          continue;
        }
        if (wk) { r = Math.round(r + (wt[0] - r) * wk); g = Math.round(g + (wt[1] - g) * wk); b = Math.round(b + (wt[2] - b) * wk); }
        var lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        var ink = th.ink === 'dark' ? lum : 1 - lum * 0.8;
        var glyph = RAMP.charAt(clamp(Math.round(ink * af * lastIdx + 1), 1, lastIdx));
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (af * th.tileA).toFixed(2) + ')';
        ctx.fillRect(x + 0.5, y + 0.5, cw - 1, ch - 1);
        ctx.fillStyle = 'rgba(' + Math.round(r + (gt[0] - r) * gk) + ',' + Math.round(g + (gt[1] - g) * gk) + ',' + Math.round(b + (gt[2] - b) * gk) + ',' + af.toFixed(2) + ')';
        ctx.fillText(glyph, x + cw / 2, y + ch / 2 + 0.5);
      }
    }

    // 4. banner, fish, then bubbles
    drawBanner(d);
    fish.forEach(function (f) { drawFish(f, d); });
    ctx.fillStyle = 'rgba(' + th.ripple + ',0.85)';
    bubbles.forEach(function (bb) {
      var cx = Math.floor(bb.x / cw) * cw + cw / 2, cy = Math.floor(bb.y / ch) * ch + ch / 2;
      ctx.fillText(bb.y > waterY + S ? 'o' : '°', cx, cy + 0.5);
    });

    // 5. ripples: flattened rings of dots, snapped to the grid
    ripples.forEach(function (rp) {
      var k = rp.life / rp.maxLife, rad = rp.max * (0.15 + 0.85 * (1 - Math.pow(1 - k, 2)));
      var band = cw * 1.4, alpha = (1 - k) * rp.k, flat = rp.y >= waterY - 1 && rp.y <= waterY + 1 ? 0.22 : 1;
      var c0 = Math.max(0, Math.floor((rp.x - rad - band) / cw)), c1 = Math.min(cols - 1, Math.ceil((rp.x + rad + band) / cw));
      var r0 = Math.max(0, Math.floor((rp.y - rad * flat - band) / ch)), r1 = Math.min(rows - 1, Math.ceil((rp.y + rad * flat + band) / ch));
      for (var rr = r0; rr <= r1; rr++) {
        for (var cc = c0; cc <= c1; cc++) {
          var cx = cc * cw + cw / 2, cy = rr * ch + ch / 2;
          var dd = Math.hypot(cx - rp.x, (cy - rp.y) / flat);
          var v = Math.max(1 - Math.abs(dd - rad) / band, (1 - Math.abs(dd - rad * 0.62) / band) * 0.45);
          if (v <= 0) continue;
          ctx.fillStyle = 'rgba(' + th.ripple + ',' + (v * alpha * 0.9).toFixed(2) + ')';
          var sz = v > 0.6 ? 2.5 : 1.8;
          ctx.fillRect(cx - sz / 2, cy - sz / 2, sz, sz);
        }
      }
    });

    // 6. words written into the grid
    words.forEach(function (wd) {
      var k = wd.life / wd.max, al = k < 0.1 ? k / 0.1 : k > 0.7 ? (1 - k) / 0.3 : 1;
      var c0 = clamp(Math.round(wd.x / cw - wd.text.length / 2), 0, cols - wd.text.length), r0 = Math.round(wd.y / ch);
      ctx.globalAlpha = al;
      for (var j = 0; j < wd.text.length; j++) {
        var x = (c0 + j) * cw, y = r0 * ch;
        ctx.fillStyle = th.pond; ctx.fillRect(x, y, cw, ch);
        ctx.fillStyle = 'rgb(' + th.ripple + ')';
        ctx.fillText(wd.text.charAt(j), x + cw / 2, y + ch / 2 + 0.5);
      }
      ctx.globalAlpha = 1;
    });

    // 7. press-and-hold progress: a ring of dots that fills clockwise
    if (press && !press.fired && !press.cancelled) {
      var held = performance.now() - press.t0;
      if (held > 120) {
        var pk = clamp((held - 120) / (LONG_PRESS - 120), 0, 1), n = 16;
        for (var q = 0; q < n; q++) {
          var ang = -Math.PI / 2 + q / n * Math.PI * 2;
          ctx.fillStyle = 'rgba(' + th.ripple + ',' + (q / n < pk ? 0.95 : 0.2) + ')';
          ctx.fillRect(press.x + Math.cos(ang) * 18 - 1.5, press.y + Math.sin(ang) * 18 - 1.5, 3, 3);
        }
      }
    }
  }

  // ------------------------------------------------------------ input
  function toCanvas(e) {
    var r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
  }

  function tap(x, y) {
    if (y < waterY + S * 0.5) {
      ring(x, waterY, S * 3, 1.5, 1); ring(x, waterY, S * 1.5, 1.1, 0.6);
    } else {
      for (var k = 0; k < 6; k++) bubbles.push({ x: x + rand(-8, 8), y: y + rand(-6, 6), vy: -rand(40, 80), ph: rand(0, 6) });
    }
    fish.forEach(function (f) {
      var dx = f.x - x, dy = f.y - y, dd = Math.hypot(dx, dy) || 1;
      if (dd < S * 2.5) { f.vx = (dx / dd) * 160; f.vy = (dy / dd) * 80; f.tx = f.x + (dx / dd) * S * 2; f.ty = f.y + (dy / dd) * S; f.retarget = 1.5; }
    });
    hippos.forEach(function (h) {
      if (busy(h)) return;
      if (Math.abs(h.x - x) < S * 4 && Math.abs(h.y - y) < S * 3) {
        h.flee = h.x >= x ? 1 : -1;
        setMode(h, 'startled');
      }
    });
  }

  canvas.addEventListener('pointerdown', function (e) {
    if (e.button !== undefined && e.button !== 0) return;
    var p = toCanvas(e);
    press = { x: p.x, y: p.y, t0: performance.now(), fired: false, cancelled: false };
  });
  canvas.addEventListener('pointermove', function (e) {
    var p = toCanvas(e);
    if (press && Math.hypot(p.x - press.x, p.y - press.y) > 12) press.cancelled = true;
  });
  canvas.addEventListener('pointerup', function () {
    if (!press) return;
    var p = press; press = null;
    if (p.cancelled || p.fired) return;
    if (performance.now() - p.t0 < LONG_PRESS) tap(p.x, p.y);
  });
  canvas.addEventListener('pointercancel', function () { press = null; });
  canvas.addEventListener('pointerleave', function () { if (press) press.cancelled = true; });
  canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  canvas.addEventListener('keydown', function (e) {
    var k = e.key.toLowerCase();
    if (k === 'enter' || k === ' ') { e.preventDefault(); tap(rand(W * 0.3, W * 0.7), waterY); }
    else if (k === 'f' || k === 'm') { dropMelon(rand(W * 0.2, W * 0.8), waterY); }
  });

  // ------------------------------------------------------------ loop
  function frame(now) {
    var dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    t += dt;

    if (press && !press.fired && !press.cancelled && now - press.t0 >= LONG_PRESS) {
      press.fired = true;
      dropMelon(press.x, press.y);
    }
    if (!reduceMotion && t > nextDip) {
      var free = hippos.filter(function (h) { return h.mode === 'idle' && !h.baby && h.want === 'surface'; });
      if (free.length) { var hd = free[Math.floor(Math.random() * free.length)]; setMode(hd, 'dip'); hd.until = rand(3, 5); }
      nextDip = t + rand(10, 18);
    }

    hippos.forEach(function (h) { updateHippo(h, dt); });
    keepApart(dt);
    melons.slice().forEach(function (m) { updateMelon(m, dt); });
    fish.forEach(function (f) { updateFish(f, dt); });
    updateEffects(dt);
    render();
    requestAnimationFrame(frame);
  }

  // ------------------------------------------------------------ boot
  resize();
  readTheme();
  new MutationObserver(readTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (window.ResizeObserver) new ResizeObserver(function () {
    if (Math.round(canvas.parentElement.clientWidth) !== W) resize();
  }).observe(canvas.parentElement);
  else window.addEventListener('resize', resize);
  requestAnimationFrame(frame);
})();
