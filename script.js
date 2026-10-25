/* Portfolio 2027 — heavy JS, all progressive enhancement.
   Nothing here is required for the content to be readable. */
(function(){
  const $=(s,el=document)=>el.querySelector(s);
  const $$=(s,el=document)=>[...el.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const yearEl=$('#year'); if(yearEl) yearEl.textContent=new Date().getFullYear();

  /* ---------- Theme: Dark / Light / Funky are mutually exclusive ----------
     FIX (2026-10-26): Funky mode used to override the colours, so Light/Dark
     looked like they did nothing while Funky was on. Now clicking Light/Dark
     always turns Funky off first, and clicking Funky turns it on alone. */
  const root=document.documentElement;
  const store={
    get(k){ try{ return localStorage.getItem(k); }catch{ return null; } },
    set(k,v){ try{ localStorage.setItem(k,v); }catch{} }
  };
  let funkyBtn=null;
  const setFunky=(on)=>{
    funky=on; root.classList.toggle('funky',on); store.set('funky-mode',on?'1':'0');
    if(funkyBtn) funkyBtn.querySelector('.funky-btn-label').textContent=on?'Quiet mode':'Funky mode';
  };
  let funky=store.get('funky-mode')==='1';
  const savedTheme=store.get('ahnaf-theme')||'dark';
  root.setAttribute('data-theme',savedTheme);
  root.classList.toggle('funky',funky);
  const themeBtn=$('#theme-btn');
  const applyTheme=(t)=>{
    root.setAttribute('data-theme',t); store.set('ahnaf-theme',t);
    if(themeBtn){ themeBtn.textContent=t==='dark'?'☀️ Light mode':'🌙 Dark mode'; themeBtn.setAttribute('aria-label',t==='dark'?'Switch to light mode':'Switch to dark mode'); }
  };
  if(themeBtn){
    applyTheme(savedTheme);
    themeBtn.addEventListener('click',()=>{
      setFunky(false); // Funky off, otherwise its colours would hide Light/Dark
      applyTheme(root.getAttribute('data-theme')==='dark'?'light':'dark');
    });
  }
  const mount=$('[data-funky-mount]');
  if(mount){
    const b=document.createElement('button'); b.type='button'; b.className='funky-btn';
    b.innerHTML='<span class="funky-btn-dot"></span><span class="funky-btn-label"></span>';
    funkyBtn=b;
    b.querySelector('.funky-btn-label').textContent=funky?'Quiet mode':'Funky mode';
    b.addEventListener('click',()=>{
      setFunky(!funky);
      if(funky) burst();
    });
    mount.appendChild(b);
  }
  function sprinkleAt(x,y,n=6){
    if(!funky) return;
    const emojis=['✨','🌈','🕺','💾','📼','🪩','🎸','⚡','🧃','🍭'];
    for(let i=0;i<n;i++){
      const s=document.createElement('span'); s.textContent=emojis[Math.floor(Math.random()*emojis.length)];
      s.className='funky-sprinkle'; s.style.left=x+'px'; s.style.top=y+'px';
      s.style.setProperty('--dx',(Math.random()-.5)*220+'px');
      s.style.setProperty('--dy',-100-Math.random()*180+'px');
      s.style.setProperty('--rot',(Math.random()-.5)*720+'deg');
      document.body.appendChild(s); setTimeout(()=>s.remove(),1100);
    }
  }
  function burst(){ sprinkleAt(innerWidth/2,innerHeight/3,40); }
  addEventListener('click',e=>{ if(e.target.closest('a,button')) return; sprinkleAt(e.clientX,e.clientY); });

  /* ---------- Cursor glow + magnetic buttons (desktop only) ---------- */
  const glow=$('#cursor-glow');
  if(glow && matchMedia('(pointer:fine)').matches && !reduced){
    addEventListener('mousemove',e=>{ glow.style.left=e.clientX+'px'; glow.style.top=e.clientY+'px'; });
    $$('.btn').forEach(btn=>{
      btn.addEventListener('mousemove',e=>{ const r=btn.getBoundingClientRect(); btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.15}px)`; });
      btn.addEventListener('mouseleave',()=>btn.style.transform='');
    });
  }

  /* ---------- Scroll progress + back to top ---------- */
  const prog=$('#progress'), back=$('#backtop');
  const onScroll=()=>{
    const h=document.documentElement; const max=h.scrollHeight-h.clientHeight;
    if(prog) prog.style.width=(max>0?(h.scrollTop/max*100):0)+'%';
    if(back) back.classList.toggle('show',h.scrollTop>600);
  };
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  if(back) back.addEventListener('click',()=>scrollTo({top:0,behavior:reduced?'auto':'smooth'}));

  /* ---------- Reveal on scroll ---------- */
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }),{threshold:.12});
  $$('.reveal').forEach(el=>io.observe(el));

  /* ---------- Animated counters ---------- */
  const cio=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting) return; cio.unobserve(e.target);
    const el=e.target, target=parseInt(el.dataset.count,10);
    if(isNaN(target)||reduced){ el.textContent=el.dataset.label||el.textContent; return; }
    const t0=performance.now();
    const tick=t=>{ const p=Math.min(1,(t-t0)/1200); el.textContent=Math.round(target*(1-Math.pow(1-p,3)))+'+'; if(p<1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }),{threshold:.5});
  $$('[data-count]').forEach(el=>cio.observe(el));

  /* ---------- Live clocks: Dhaka + client timezones ---------- */
  function clock(tz){ try{ return new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',minute:'2-digit'}).format(new Date()); }catch{ return ''; } }
  const tickClocks=()=>{
    const d=$('#clock-dhaka'); if(d) d.textContent=clock('Asia/Dhaka');
    const u=$('#clock-london'); if(u) u.textContent=clock('Europe/London');
    const n=$('#clock-ny'); if(n) n.textContent=clock('America/New_York');
  };
  tickClocks(); setInterval(tickClocks,30000);

  /* ---------- Skills marquee ---------- */
  const skills=["Shopify Liquid","Sections & JSON templates","Metafields","Metaobjects","Shopify Flow","Checkout Extensibility","Hydrogen","Tailwind","React","TypeScript","WordPress","Gutenberg","WCAG 2.1","CRO","Klaviyo"];
  const track=$('#marquee-track');
  if(track){
    [...skills,...skills].forEach(s=>{ const c=document.createElement('button'); c.type='button'; c.className='chip'; c.textContent=s;
      c.addEventListener('click',()=>{ const q=$('#project-search'); if(q){ q.value=s.replace(/[^a-zA-Z ]/g,'').split(' ')[0]; q.dispatchEvent(new Event('input')); document.getElementById('work')?.scrollIntoView({behavior:'smooth'}); } });
      track.appendChild(c); });
  }

  /* ---------- Projects: data, render, filter, search, tilt, modal ---------- */
  /* Local screenshots — saved in images/, no screenshot service.
     If a screenshot file is missing, the card shows a dark placeholder
     instead of a broken image. */
  const projects=[
    {n:"001",name:"Rainbow Symphony",kind:"Shopify",url:"https://rainbowsymphony.com/",img:"images/project-rainbow-symphony.jpg",blurb:"Long-running US retailer for rainbow-symphony optics and diffraction products. Shopify theme work through Coalition Technologies."},
    {n:"002",name:"Giant Sports Cards",kind:"Shopify",url:"https://giantsportscards.com/",img:"images/project-giant-sports-cards.jpg",blurb:"Sports-card e-commerce store with heavy collection filtering and merchandising. Shopify theme and template work."},
    {n:"003",name:"WOR.com",kind:"Web",url:"https://www.wor.com/",img:"images/project-wor.jpg",blurb:"Marketing and content site for the WOR brand — front-end build, accessibility and performance work."},
    {n:"004",name:"Ready Prep Go",kind:"Shopify",url:"https://readyprepgo.ie/",img:"images/project-ready-prep-go.jpg",blurb:"Irish preparedness brand. Full Shopify build from scratch — my first Liquid project, delivered end-to-end."},
    {n:"005",name:"Harlem Print Magic",kind:"Shopify",url:"https://harlemprintmagic.com/",img:"images/project-harlem-print-magic.jpg",blurb:"Harlem-based print and merchandise store. Shopify theme customisation and storefront polish."},
    {n:"006",name:"Getsure Goods",kind:"Shopify",url:"https://getsuregoods.com/",img:"images/project-getsure-goods.jpg",blurb:"Dropshipping store. Custom product template built for a separate client — not a Coalition client project."},
  ];
  const early=[
    {name:"Acme Web",url:"https://acme-web-ahnaf.netlify.app/"},
    {name:"MovieFlix",url:"https://movieflix-ahnaf.netlify.app/"},
    {name:"AhnaSoft",url:"https://timely-squirrel-9d3992.netlify.app/"},
    {name:"Velvet Coffee",url:"https://fastidious-sundae-c8a89b.netlify.app/"},
    {name:"Tailwind Landing",url:"https://darling-sundae-045d0b.netlify.app/"},
    {name:"JS Form Landing",url:"https://funny-frangollo-7fe833.netlify.app/"},
  ];
  const pList=$('#projects');
  let activeFilter='All';
  function renderProjects(){
    if(!pList) return;
    const q=($('#project-search')?.value||'').toLowerCase().trim();
    const list=projects.filter(p=>(activeFilter==='All'||p.kind===activeFilter)&&(p.name.toLowerCase().includes(q)||p.blurb.toLowerCase().includes(q)));
    pList.innerHTML=list.length?list.map(p=>`
      <li class="project reveal in">
        <a class="project-banner" href="${p.url}" target="_blank" rel="noreferrer" aria-label="${p.name} — open live site">
          <img src="${p.img}" alt="Screenshot of ${p.name} live site" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%221280%22 height=%22720%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23222%22/><text x=%2250%25%22 y=%2250%25%22 fill=%22%23aaa%22 font-size=%2232%22 text-anchor=%22middle%22>${p.name}</text></svg>'" />
          <span class="project-visit">Visit live site ↗</span>
        </a>
        <div class="project-body">
          <div class="project-head"><span class="project-n">${p.n}</span><h3>${p.name}</h3><span class="project-kind">${p.kind}</span></div>
          <p>${p.blurb}</p>
        </div>
        <div class="project-actions">
          <button type="button" class="mini-btn" data-view="${p.n}">Quick view</button>
          <a class="mini-btn" href="${p.url}" target="_blank" rel="noreferrer">Live site ↗</a>
        </div>
      </li>`).join(''):`<li class="empty">No projects match that filter yet. Try “All” or clear the search.</li>`;
    // tilt
    $$('.project-banner',pList).forEach(b=>{
      b.addEventListener('mousemove',e=>{ if(reduced) return; const r=b.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; b.style.transform=`perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg) scale(1.02)`; });
      b.addEventListener('mouseleave',()=>b.style.transform='');
    });
    $$('[data-view]',pList).forEach(btn=>btn.addEventListener('click',()=>openModal(projects.find(p=>p.n===btn.dataset.view))));
  }
  $$('.filter-btn').forEach(b=>b.addEventListener('click',()=>{
    $$('.filter-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active');
    activeFilter=b.dataset.filter; renderProjects();
  }));
  const searchEl=$('#project-search');
  if(searchEl) searchEl.addEventListener('input',renderProjects);
  addEventListener('keydown',e=>{ if(e.key==='/'&&document.activeElement!==searchEl&&searchEl){ e.preventDefault(); searchEl.focus(); } if(e.key==='Escape') closeModal(); });
  renderProjects();

  const eList=$('#early-list');
  if(eList) eList.innerHTML=early.map(e=>`<li><a href="${e.url}" target="_blank" rel="noreferrer">${e.name} ↗</a></li>`).join('');

  /* Modal */
  const modal=$('#modal');
  function openModal(p){
    if(!p||!modal) return;
    $('#modal-img').src=p.img; $('#modal-img').alt=`Screenshot of ${p.name}`;
    $('#modal-title').textContent=p.name; $('#modal-kind').textContent=p.kind; $('#modal-blurb').textContent=p.blurb;
    $('#modal-link').href=p.url; modal.classList.add('open'); document.body.style.overflow='hidden';
  }
  function closeModal(){ if(!modal) return; modal.classList.remove('open'); document.body.style.overflow=''; }
  modal?.addEventListener('click',e=>{ if(e.target===modal) closeModal(); });
  $('.modal-close',modal||document)?.addEventListener('click',closeModal);

  /* ---------- FAQ accordion ---------- */
  $$('.faq-item').forEach(item=>{
    const btn=$('button',item);
    btn?.addEventListener('click',()=>{
      const open=item.classList.contains('open');
      $$('.faq-item').forEach(x=>x.classList.remove('open'));
      if(!open) item.classList.add('open');
      btn.setAttribute('aria-expanded',String(!open));
    });
  });

  /* ---------- Copy email + toast ---------- */
  const toast=$('#toast');
  const showToast=msg=>{ if(!toast) return; toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2200); };
  $$('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{
    try{ await navigator.clipboard.writeText(b.dataset.copy); showToast('Email copied — ahnafshikder311@gmail.com'); }
    catch{ showToast('Email: ahnafshikder311@gmail.com'); }
  }));
})();
