
(function(){
'use strict';

// === Pixel Icon Sprite Drawer ===
window.drawIcon = function(canvas, iconType){
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const P = 4;
  ctx.clearRect(0,0,w,h);
  ctx.imageSmoothingEnabled = false;

  function px(x,y,c){ctx.fillStyle=c;ctx.fillRect(x*P,y*P,P,P)}

  const sprites = {
    home: function(){
      // pixel house
      const wood='#8B5A2B', roof='#C0392B', door='#6B3A1F', win='#87CEEB';
      px(2,4,roof);px(2,3,roof);px(3,3,roof);px(3,4,roof);px(1,4,roof);px(4,3,roof);
      px(2,5,wood);px(2,6,wood);px(3,5,wood);px(3,6,wood);px(1,5,wood);px(1,6,wood);px(4,5,wood);px(4,6,wood);
      px(2,5,door);px(3,5,door);px(2,4,win);
    },
    book: function(){
      // pixel book
      const cover='#8B4513', page='#F5E6C8', mark='#C0392B';
      px(1,1,cover);px(1,2,cover);px(1,3,cover);px(1,4,cover);px(4,1,cover);px(4,2,cover);px(4,3,cover);px(4,4,cover);
      px(2,1,cover);px(3,1,cover);px(2,5,cover);px(3,5,cover);
      px(2,2,page);px(3,2,page);px(2,3,page);px(3,3,page);px(2,4,page);px(3,4,page);
      px(3,1,mark);px(3,0,mark);
    },
    pickaxe: function(){
      // pixel pickaxe
      const handle='#8B5A2B', head='#808080', edge='#C0C0C0';
      px(2,0,edge);px(1,0,head);px(0,1,head);px(0,2,head);px(0,3,head);px(1,3,head);
      px(3,0,head);px(4,1,head);px(4,2,head);px(4,3,head);px(3,3,head);
      px(2,1,handle);px(2,2,handle);px(2,3,handle);px(2,4,handle);px(2,5,handle);
    },
    player: function(){
      // pixel player head
      const skin='#FFD39B', hair='#4A3728', eye='#2D2318', mouth='#C0392B';
      px(1,1,hair);px(2,1,hair);px(3,1,hair);px(4,1,hair);
      px(1,2,skin);px(2,2,hair);px(3,2,hair);px(4,2,skin);
      px(1,3,skin);px(2,3,skin);px(3,3,skin);px(4,3,skin);
      px(1,4,skin);px(2,4,eye);px(3,4,eye);px(4,4,skin);
      px(2,5,skin);px(3,5,mouth);px(4,5,skin);
    },
    paper: function(){
      // pixel paper/scroll
      const paper='#F5E6C8', ink='#3D2B1F', seal='#C0392B';
      px(0,0,paper);px(1,0,paper);px(2,0,paper);px(3,0,paper);
      px(0,1,paper);px(1,1,ink);px(2,1,ink);px(3,1,paper);
      px(0,2,paper);px(1,2,ink);px(2,2,ink);px(3,2,paper);
      px(0,3,paper);px(1,3,paper);px(2,3,paper);px(3,3,paper);
      px(3,0,seal);
    },
    sun: function(){
      const sun='#FFD700', ray='#FFA500';
      px(1,0,ray);px(3,0,ray);px(0,1,ray);px(4,1,ray);
      px(1,1,sun);px(2,1,sun);px(3,1,sun);
      px(1,2,sun);px(2,2,sun);px(3,2,sun);
      px(1,3,sun);px(2,3,sun);px(3,3,sun);
      px(0,2,ray);px(4,2,ray);px(1,4,ray);px(3,4,ray);
    },
    moon: function(){
      const moon='#F5F5DC', sky='#1A1A3E';
      px(1,1,moon);px(2,1,moon);px(1,2,moon);px(2,2,moon);
      px(3,2,sky);px(2,3,moon);px(3,3,moon);px(1,0,sky);
    },
    github: function(){
      const bg='#333', fg='#FFF';
      px(0,0,bg);px(1,0,bg);px(2,0,bg);px(3,0,bg);px(4,0,bg);px(5,0,bg);
      px(0,1,bg);px(1,1,fg);px(2,1,bg);px(3,1,bg);px(4,1,fg);px(5,1,bg);
      px(0,2,bg);px(1,2,bg);px(2,2,fg);px(3,2,fg);px(4,2,bg);px(5,2,bg);
      px(0,3,bg);px(1,3,bg);px(2,3,bg);px(3,3,bg);px(4,3,bg);px(5,3,bg);
    },
    mail: function(){
      const env='#F5E6C8', fold='#D4C4A0', seal='#C0392B';
      px(0,0,env);px(1,0,env);px(2,0,env);px(3,0,env);px(4,0,env);
      px(0,1,env);px(1,1,fold);px(2,1,fold);px(3,1,fold);px(4,1,env);
      px(0,2,env);px(1,2,fold);px(2,2,seal);px(3,2,fold);px(4,2,env);
      px(0,3,env);px(1,3,env);px(2,3,fold);px(3,3,env);px(4,3,env);
      px(0,4,env);px(1,4,env);px(2,4,env);px(3,4,env);px(4,4,env);
    }
  };

  if(sprites[iconType]) sprites[iconType]();
};

// === Draw all nav icons on load ===
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.nav-icon').forEach(c=>drawIcon(c, c.dataset.icon));
});

// === Theme Toggle ===
const themeKey = 'blog-theme';
const html = document.documentElement;
const toggleBtn = document.getElementById('theme-toggle');

function getTheme(){
  const stored = localStorage.getItem(themeKey);
  if(stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme){
  html.setAttribute('data-theme', theme);
  html.style.setProperty('--sky-top', theme==='dark'?'#1A1A3E':'#87CEEB');
  html.style.setProperty('--sky-bot', theme==='dark'?'#2D2D5E':'#C5E8F7');
  html.style.setProperty('--grass', theme==='dark'?'#4A7A30':'#7BC24C');
  html.style.setProperty('--wood', theme==='dark'?'#8B6B3E':'#BC9862');
  html.style.setProperty('--plank-bg', theme==='dark'?'#5A4A32':'#C4A46C');
  html.style.setProperty('--parchment', theme==='dark'?'#D4C8A8':'#F5E6C8');
  html.style.setProperty('--ink', theme==='dark'?'#D4C8A8':'#3D2B1F');
  html.style.setProperty('--ink-light', theme==='dark'?'#A09080':'#5C4A3A');
  if(toggleBtn) toggleBtn.textContent = theme==='dark'?'[X]':'[O]';
}

function setTheme(theme){localStorage.setItem(themeKey,theme);applyTheme(theme)}
function toggleTheme(){setTheme(getTheme()==='dark'?'light':'dark')}

applyTheme(getTheme());
if(toggleBtn) toggleBtn.addEventListener('click', toggleTheme);

if(window.matchMedia){
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e=>{
    if(!localStorage.getItem(themeKey)) applyTheme(e.matches?'dark':'light');
  });
}

// === Nav Highlight ===
const cp = window.location.pathname;
 document.querySelectorAll('.nav-links a').forEach(l=>{
  const h=l.getAttribute('href');
  if(!h)return;
  if(cp.endsWith(h)||(h==='index.html'&&(cp.endsWith('/')||cp.endsWith('/index.html'))))l.classList.add('active');
});

// === Scroll To Top ===
const scrollBtn=document.getElementById('scroll-top-btn');
if(scrollBtn){
  let ticking=false;
  window.addEventListener('scroll',()=>{
    if(!ticking){requestAnimationFrame(()=>{scrollBtn.classList.toggle('visible',window.scrollY>300);ticking=false});ticking=true}
  });
  scrollBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

// === Reading Progress ===
const pb=document.getElementById('reading-progress');
if(pb){
  let pt=false;
  window.addEventListener('scroll',()=>{
    if(!pt){requestAnimationFrame(()=>{const st=window.scrollY;const dh=document.documentElement.scrollHeight-window.innerHeight;pb.style.width=(dh>0?Math.min(st/dh*100,100):0)+'%';pt=false});pt=true}
  });
}

// === Scroll Reveal ===
const ro=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      const el=e.target;
      const idx=Array.from(el.parentNode.children).indexOf(el);
      setTimeout(()=>el.classList.add('visible'),idx*60);
      ro.unobserve(el);
    }
  });
},{threshold:0.12,rootMargin:'0px 0px -30px 0px'});

function observeReveal(){
  document.querySelectorAll('.card, .archive-list li, .about-card .info-row').forEach(el=>{
    if(!el.classList.contains('reveal'))el.classList.add('reveal');
    ro.observe(el);
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observeReveal);else observeReveal();

const cg=document.getElementById('card-grid');
if(cg){new MutationObserver(()=>{if(cg.children.length>0&&!cg.children[0].classList.contains('skeleton-card')){document.querySelectorAll('#card-grid .card').forEach(c=>{if(!c.classList.contains('reveal')){c.classList.add('reveal');ro.observe(c)}})}}).observe(cg,{childList:true})}

})();
