// bg.js — ultra-light stars + orbiters (no libs)
const c = document.getElementById('bg');
const ctx = c.getContext('2d', { alpha: false });

let W, H, DPR;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1.5, 2);
  W = c.width = Math.floor(innerWidth * DPR);
  H = c.height = Math.floor(innerHeight * DPR);
  c.style.width = innerWidth + 'px';
  c.style.height = innerHeight + 'px';
}
addEventListener('resize', resize); resize();

// build stars
const N = 220; // stars
const stars = [...Array(N)].map(() => ({
  x: Math.random() * W,
  y: Math.random() * H,
  z: 0.2 + Math.random() * 0.8,      // depth
  r: 0.6 + Math.random() * 1.8,
  tw: Math.random() * Math.PI * 2
}));

// orbiters (planets/glows)
const orbiters = [
  { R: 0.28, r: 6, speed: 0.04, hue: 220 }, // bluish
  { R: 0.48, r: 4, speed: -0.03, hue: 45  }, // amber
  { R: 0.65, r: 3, speed: 0.02, hue: 300 }  // magenta
];
let t0 = performance.now();

function frame(now) {
  const t = (now - t0) / 1000;

  // deep gradient sky
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,   '#080e24');
  g.addColorStop(0.5, '#0b1433');
  g.addColorStop(1,   '#0a1026');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);

  // faint nebula fog
  ctx.globalCompositeOperation = 'lighter';
  const fog = ctx.createRadialGradient(W*0.65, H*0.2, 0, W*0.65, H*0.2, Math.min(W,H)*0.6);
  fog.addColorStop(0, 'rgba(77,107,255,0.08)');
  fog.addColorStop(1, 'rgba(77,107,255,0)');
  ctx.fillStyle = fog;
  ctx.beginPath(); ctx.arc(W*0.65, H*0.2, Math.min(W,H)*0.6, 0, Math.PI*2); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  // stars twinkle + slow drift
  for (const s of stars) {
    s.tw += 0.02;
    const a = 0.5 + Math.sin(s.tw)*0.5;                 // twinkle
    s.x = (s.x + 0.06*s.z + W) % W;                     // parallax drift
    ctx.globalAlpha = 0.35 + 0.65*a*s.z;
    ctx.fillStyle = '#cfe3ff';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * DPR * s.z, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // orbiters around screen center (subtle)
  const cx = W * 0.5, cy = H * 0.45;
  for (let i=0;i<orbiters.length;i++) {
    const o = orbiters[i];
    const ang = t*o.speed + i*2.1;
    const R = Math.min(W,H) * o.R;
    const x = cx + Math.cos(ang) * R;
    const y = cy + Math.sin(ang) * (R*0.55);

    // glow trail
    const gl = ctx.createRadialGradient(x,y,0,x,y,o.r*14*DPR);
    gl.addColorStop(0, `hsla(${o.hue},100%,70%,0.22)`);
    gl.addColorStop(1, `hsla(${o.hue},100%,70%,0)`);
    ctx.fillStyle = gl;
    ctx.beginPath(); ctx.arc(x,y,o.r*14*DPR,0,Math.PI*2); ctx.fill();

    // core
    ctx.fillStyle = `hsl(${o.hue},100%,70%)`;
    ctx.beginPath(); ctx.arc(x,y,o.r*DPR,0,Math.PI*2); ctx.fill();
  }

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
