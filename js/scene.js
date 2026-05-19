
/**
 * scene.js — Pixel Art Landscape Engine
 * Minecraft x Terraria x Stardew Valley style
 */
(function(){
'use strict';

const canvas = document.getElementById('scene-canvas');
if(!canvas) return;

const ctx = canvas.getContext('2d');
const PX = 8;

// === State ===
let W, H, scrollY = 0, targetScroll = 0;
let time = 0;
let isNight = false;
let nightAlpha = 0;
let targetNight = 0;

// === Particles ===
let particles = [];

// === Colors ===
const C = {
  skyTop: [135,206,235], skyBot: [197,232,247],
  nSkyTop: [26,26,62], nSkyBot: [45,45,94],
  cloud: [255,255,255], cloudShade: [220,225,235],
  nCloud: [40,40,70],
  mt1: [120,140,100], mt2: [90,110,75], mtSnow: [230,235,240],
  grass: [123,194,76], grassDark: [90,158,50], grassLight: [150,215,100],
  dirt: [150,106,61], dirtDark: [107,74,40],
  stone: [128,128,128], stoneDark: [96,96,96], stoneLight: [150,150,150],
  wood: [139,90,43], woodDark: [101,67,35],
  leaf: [60,150,40], leafDark: [40,110,30], leafLight: [90,180,60],
  water: [60,140,220], waterLight: [100,180,240],
  torch: [255,200,50], torchGlow: [255,150,30],
  gold: [255,215,0], star: [255,255,200],
  firefly: [180,255,100],
};

// === Helpers ===
function lerp(a,b,t){return a+(b-a)*t}
function lerpC(c1,c2,t){return [Math.round(lerp(c1[0],c2[0],t)),Math.round(lerp(c1[1],c2[1],t)),Math.round(lerp(c1[2],c2[2],t))]}
function rgba(c,a){return `rgba(${c[0]},${c[1]},${c[2]},${a})`}
function rgb(c){return `rgb(${c[0]},${c[1]},${c[2]})`}

// === Draw pixel rect ===
function pxRect(x,y,w,h,c){
  ctx.fillStyle = rgb(c);
  ctx.fillRect(Math.floor(x/PX)*PX, Math.floor(y/PX)*PX, Math.ceil(w/PX)*PX, Math.ceil(h/PX)*PX);
}

// === Draw pixel block with 3D shading ===
function pxBlock(x,y,w,h,topC,frontC,sideC){
  // top face
  ctx.fillStyle = rgb(topC);
  ctx.fillRect(x, y, w, PX*2);
  // front face
  ctx.fillStyle = rgb(frontC);
  ctx.fillRect(x, y+PX*2, w, h-PX*2);
}

// === Draw pixel circle ===
function pxCircle(cx,cy,r,c){
  ctx.fillStyle = rgb(c);
  for(let dy=-r;dy<=r;dy+=PX){
    for(let dx=-r;dx<=r;dx+=PX){
      if(dx*dx+dy*dy <= r*r){
        ctx.fillRect(Math.floor((cx+dx)/PX)*PX, Math.floor((cy+dy)/PX)*PX, PX, PX);
      }
    }
  }
}

// === Resize ===
function resize(){
  const wrap = canvas.parentElement;
  W = wrap.clientWidth;
  H = wrap.clientHeight;
  canvas.width = W;
  canvas.height = H;
}

// === Draw Sky ===
function drawSky(){
  const topC = lerpC(C.skyTop, C.nSkyTop, nightAlpha);
  const botC = lerpC(C.skyBot, C.nSkyBot, nightAlpha);
  const grad = ctx.createLinearGradient(0,0,0,H*0.7);
  grad.addColorStop(0, rgb(topC));
  grad.addColorStop(0.5, rgb(botC));
  grad.addColorStop(1, rgb(lerpC(C.grass,C.grassDark,nightAlpha)));
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);
}

// === Clouds ===
function drawClouds(ox){
  const c = lerpC(C.cloud, C.nCloud, nightAlpha);
  const cs = lerpC(C.cloudShade, [50,50,80], nightAlpha);
  const clouds = [
    {x:W*0.1,y:H*0.08,w:14,r:3},{x:W*0.35,y:H*0.04,w:20,r:4},{x:W*0.6,y:H*0.1,w:16,r:3},
    {x:W*0.78,y:H*0.05,w:12,r:2},{x:W*0.9,y:H*0.12,w:18,r:3}
  ];
  clouds.forEach(cl=>{
    const sx = ((cl.x + ox*0.15 + time*2) % (W+200)) - 100;
    const sy = cl.y * H;
    // cloud body
    for(let row=0;row<cl.r;row++){
      const rw = cl.w - Math.abs(row - cl.r/2)*4;
      pxRect(sx + (cl.w*PX - rw*PX)/2, sy + row*PX, rw*PX, PX, row<cl.r/2?c:cs);
    }
    // puff edges
    pxCircle(sx+cl.w*PX/2-PX*4, sy+PX*2, PX*3, c);
    pxCircle(sx+cl.w*PX/2+PX*4, sy+PX*2, PX*3, c);
  });
}

// === Mountains ===
function drawMountains(ox){
  const m1 = lerpC(C.mt1, [60,70,50], nightAlpha);
  const m2 = lerpC(C.mt2, [40,50,35], nightAlpha);
  const mS = lerpC(C.mtSnow, [180,185,195], nightAlpha);
  const groundY = H * 0.7;

  function drawMtn(baseX, w, h, col, snowH){
    const sx = baseX + ox * 0.3;
    const peakY = groundY - h;
    // main shape
    for(let y=0;y<h;y+=PX){
      const halfW = (1 - y/h) * w/2;
      const rowC = y < snowH ? col : m2;
      pxRect(sx - halfW, peakY + y, halfW*2, PX, rowC);
    }
    // snow cap
    if(snowH > 0){
      for(let y=0;y<snowH;y+=PX){
        const halfW = (1 - y/h) * w/2;
        pxRect(sx - halfW, peakY + y, halfW*2, PX, mS);
      }
    }
  }

  drawMtn(W*0.15, 180, H*0.38, m1, H*0.06);
  drawMtn(W*0.42, 220, H*0.45, m1, H*0.09);
  drawMtn(W*0.7, 160, H*0.32, m2, 0);
  drawMtn(W*0.9, 200, H*0.4, m1, H*0.05);
}

// === Trees ===
function drawTrees(ox){
  const groundY = H * 0.7;
  const trees = [
    {x:W*0.08, tH:10, cH:10, cW:8},
    {x:W*0.22, tH:12, cH:12, cW:9},
    {x:W*0.52, tH:8, cH:9, cW:7},
    {x:W*0.65, tH:14, cH:13, cW:10},
    {x:W*0.82, tH:11, cH:11, cW:8},
  ];

  const lf = lerpC(C.leaf, C.leafDark, nightAlpha);
  const lfl = lerpC(C.leafLight, [60,130,40], nightAlpha);
  const lfd = lerpC(C.leafDark, [30,70,20], nightAlpha);

  trees.forEach(t=>{
    const sx = t.x + ox * 0.5;
    const trunkH = t.tH * PX;
    const crownH = t.cH * PX;
    const crownW = t.cW * PX;

    // trunk
    pxRect(sx - PX*1.5, groundY - trunkH - crownH*0.6, PX*3, trunkH + crownH*0.6, C.wood);
    pxRect(sx - PX, groundY - trunkH - crownH*0.6, PX*2, trunkH*0.3, C.woodDark);

    // crown (layered pixel circles + sway)
    const sway = Math.sin(time*0.02 + t.x) * PX;
    const cx = sx + sway;
    const cy = groundY - trunkH - crownH*0.4;

    // shadow layer
    pxCircle(cx+2, cy+4, crownW*0.45, lfd);
    // main layer
    pxCircle(cx, cy, crownW*0.5, lf);
    // highlight spots
    pxCircle(cx-PX*2, cy-PX*2, crownW*0.2, lfl);
    pxCircle(cx+PX*3, cy-PX, crownW*0.15, lfl);
  });
}

// === Grass Ground ===
function drawGround(ox){
  const groundY = H * 0.7;
  const g = lerpC(C.grass, C.grassDark, nightAlpha);
  const gl = lerpC(C.grassLight, [100,180,70], nightAlpha);
  const gd = lerpC(C.grassDark, [50,100,30], nightAlpha);

  // main grass layer
  const grassH = PX * 5;
  pxRect(0, groundY, W, grassH, g);

  // grass blade pattern on top
  ctx.fillStyle = rgb(gl);
  for(let x=0;x<W;x+=PX*3){
    const h = PX*(1 + Math.abs(Math.sin(x*0.05 + time*0.03)) * 2);
    ctx.fillRect(x, groundY - h, PX, h + PX);
  }

  // darker bottom of grass
  pxRect(0, groundY + grassH - PX*2, W, PX*2, gd);

  // Dirt layer
  const d = lerpC(C.dirt, C.dirtDark, nightAlpha);
  pxRect(0, groundY + grassH, W, PX*8, d);

  // Stone layer
  const s = lerpC(C.stone, C.stoneDark, nightAlpha);
  pxRect(0, groundY + grassH + PX*8, W, H, s);

  // Stone texture dots
  const sl = lerpC(C.stoneLight, [120,120,120], nightAlpha);
  ctx.fillStyle = rgba(sl, 0.3);
  for(let x=0;x<W;x+=PX*8){
    for(let y=groundY+PX*14;y<H;y+=PX*6){
      if(Math.random() > 0.6) ctx.fillRect(x+PX, y, PX*2, PX);
    }
  }

  // Grass/dirt border texture
  ctx.fillStyle = rgba(lerpC(C.dirtDark,[60,40,20],nightAlpha), 0.4);
  for(let x=0;x<W;x+=PX*6){
    ctx.fillRect(x, groundY+PX*3, PX*3, PX);
  }
}

// === Particles ===
function initParticles(){
  particles = [];
  for(let i=0;i<25;i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H*0.7,
      vx: (Math.random()-0.5)*0.3,
      vy: 0.2 + Math.random()*0.4,
      life: Math.random(),
      size: PX*(2+Math.floor(Math.random()*4)),
      type: Math.random() < 0.6 ? 'leaf' : 'firefly',
    });
  }
}

function drawParticles(){
  const groundY = H * 0.7;
  particles.forEach(p=>{
    p.x += p.vx + Math.sin(time*0.05 + p.life*10)*0.2;
    p.y += p.vy;
    p.life += 0.003;

    if(p.y > groundY || p.life > 1){
      p.x = Math.random()*W;
      p.y = -20;
      p.life = 0;
    }

    if(p.type === 'leaf'){
      ctx.fillStyle = rgba([120+Math.sin(p.life*10)*30, 180+Math.cos(p.life*10)*20, 50], 0.7);
      ctx.fillRect(Math.floor(p.x/PX)*PX, Math.floor(p.y/PX)*PX, PX, PX);
    } else {
      const glow = 0.3 + Math.sin(time*0.08 + p.life*20)*0.3;
      ctx.fillStyle = rgba(C.firefly, glow * (1-nightAlpha) + nightAlpha*0.8);
      ctx.fillRect(Math.floor(p.x/PX)*PX, Math.floor(p.y/PX)*PX, PX*2, PX*2);
      ctx.fillStyle = rgba(C.firefly, glow*0.3);
      ctx.fillRect(Math.floor((p.x-PX)/PX)*PX, Math.floor((p.y-PX)/PX)*PX, PX*4, PX*4);
    }
  });
}

// === Stars (night) ===
function drawStars(){
  if(nightAlpha < 0.1) return;
  ctx.fillStyle = rgba(C.star, nightAlpha * (0.5 + Math.sin(time*0.03)*0.3));
  // deterministic star positions
  for(let i=0;i<40;i++){
    const sx = ((i*137.5 + 50) % W);
    const sy = ((i*97.3 + 30) % (H*0.5));
    const size = (i%3 === 0) ? PX*2 : PX;
    ctx.fillRect(Math.floor(sx/PX)*PX, Math.floor(sy/PX)*PX, size, size);
  }
}

// === Moon ===
function drawMoon(){
  if(nightAlpha < 0.1) return;
  const mx = W*0.78;
  const my = H*0.1;
  pxCircle(mx, my, PX*6, [255,255,220]);
  pxCircle(mx-PX*2, my-PX, PX*4, [240,240,200]);
  ctx.fillStyle = rgba([255,255,200], nightAlpha*0.2);
  ctx.fillRect(mx-PX*10, my-PX*10, PX*20, PX*20);
}

// === Grass block decorations ===
function drawDecorations(ox){
  const groundY = H * 0.7;
  // small pixel flowers
  const flowerColors = [[255,100,100],[255,255,100],[255,150,200],[200,150,255]];
  for(let i=0;i<8;i++){
    const fx = ((i*173 + 80) % W) + ox*0.6;
    const fy = groundY - PX*3;
    ctx.fillStyle = rgb(C.grass);
    ctx.fillRect(fx, fy, PX, PX*3);
    ctx.fillStyle = rgb(flowerColors[i%4]);
    ctx.fillRect(fx-PX, fy-PX*2, PX*3, PX*2);
  }

  // small rocks
  for(let i=0;i<5;i++){
    const rx = ((i*211 + 40) % W) + ox*0.5;
    const ry = groundY - PX;
    ctx.fillStyle = rgb(C.stoneLight);
    ctx.fillRect(rx, ry, PX*3, PX*2);
    ctx.fillStyle = rgb(C.stone);
    ctx.fillRect(rx+PX, ry, PX, PX);
  }

  // pixel mushrooms
  for(let i=0;i<3;i++){
    const mx = ((i*277 + 120) % W) + ox*0.55;
    const my = groundY - PX*4;
    ctx.fillStyle = rgb([220,200,180]);
    ctx.fillRect(mx+PX, my, PX, PX*4);
    ctx.fillStyle = rgb([200,50,50]);
    ctx.fillRect(mx, my-PX*2, PX*3, PX*2);
    ctx.fillStyle = rgb([255,255,255]);
    ctx.fillRect(mx+PX, my-PX, PX, PX);
  }
}

// === Water pool ===
function drawWater(ox){
  const groundY = H * 0.7;
  const wx = W*0.3 + ox*0.4;
  const wy = groundY + PX*3;
  const ww = PX*20;
  const wh = PX*10;

  ctx.fillStyle = rgba(C.water, 0.7);
  ctx.fillRect(wx, wy, ww, wh);

  // water shimmer
  for(let x=wx;x<wx+ww;x+=PX*2){
    const shimmer = Math.sin(x*0.1 + time*0.08) > 0;
    if(shimmer) ctx.fillStyle = rgba(C.waterLight, 0.4);
    else ctx.fillStyle = rgba(C.water, 0.2);
    ctx.fillRect(x, wy+PX*5, PX*2, PX);
  }
}

// === Main Render ===
function render(){
  ctx.clearRect(0,0,W,H);

  // parallax offset
  const ox = -scrollY;

  drawSky();
  drawStars();
  drawMoon();
  drawClouds(ox);
  drawMountains(ox);
  drawTrees(ox);
  drawGround(ox);
  drawWater(ox);
  drawDecorations(ox);
  drawParticles();
}

// === Loop ===
function loop(ts){
  time = ts*0.06;

  // smooth scroll
  scrollY += (targetScroll - scrollY)*0.1;

  // smooth night transition
  nightAlpha += (targetNight - nightAlpha)*0.05;
  if(Math.abs(targetNight-nightAlpha)<0.001) nightAlpha=targetNight;

  render();
  requestAnimationFrame(loop);
}

// === Init ===
resize();
initParticles();

window.addEventListener('resize', ()=>{
  resize();
  initParticles();
});

window.addEventListener('scroll', ()=>{
  targetScroll = window.scrollY;
});

// Theme change listener
const themeToggle = document.getElementById('theme-toggle');
if(themeToggle){
  const checkTheme = ()=>{
    const html = document.documentElement;
    targetNight = html.getAttribute('data-theme') === 'dark' ? 1 : 0;
  };
  themeToggle.addEventListener('click', ()=> setTimeout(checkTheme, 50));
  // initial check
  checkTheme();
  // also watch for dark mode changes
  if(window.matchMedia){
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkTheme);
  }
}

// Expose for external night mode changes
document.addEventListener('themeChanged', (e)=>{
  targetNight = e.detail === 'dark' ? 1 : 0;
});

requestAnimationFrame(loop);

})();
