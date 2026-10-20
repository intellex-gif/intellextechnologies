document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('nav-open');menu.setAttribute('aria-expanded',String(open));});
const form=document.getElementById('contactForm');
if(form)form.addEventListener('submit',e=>{e.preventDefault();const destination='YOUR_EMAIL_HERE';const status=form.querySelector('.form-status');if(destination==='YOUR_EMAIL_HERE'){status.textContent='Before publishing, add your business email in assets/main.js.';return;}const d=new FormData(form);const subject=encodeURIComponent('Intellex website enquiry — '+d.get('service'));const body=encodeURIComponent('Name: '+d.get('name')+'\\nEmail: '+d.get('email')+'\\nBusiness: '+(d.get('company')||'Not provided')+'\\nService: '+d.get('service')+'\\n\\nProject details:\\n'+d.get('message'));window.location.href='mailto:'+destination+'?subject='+subject+'&body='+body;});
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hdr=document.querySelector('.site-header'),prog=document.getElementById('prog');
  function onScroll(){
    var y=window.scrollY,h=document.documentElement.scrollHeight-innerHeight;
    if(hdr)hdr.classList.toggle('scrolled',y>8);
    if(prog&&!reduce)prog.style.transform='scaleX('+(h>0?y/h:0)+')';
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  var els=document.querySelectorAll('[data-reveal]');
  if(!('IntersectionObserver' in window)||reduce){els.forEach(function(e){e.classList.add('in')});}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(e){io.observe(e)});
  }
  // hero parallax
  var art=document.querySelector('.hero-art');
  if(art&&!reduce&&matchMedia('(hover:hover)').matches){
    var lyr=art.querySelectorAll('.lyr');
    art.addEventListener('mousemove',function(ev){
      var r=art.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width-.5,y=(ev.clientY-r.top)/r.height-.5;
      lyr.forEach(function(l){var d=+l.dataset.d;l.style.transform='translate('+(-x*d)+'px,'+(-y*d)+'px)';});
    });
    art.addEventListener('mouseleave',function(){lyr.forEach(function(l){l.style.transform=''})});
  }
  // services scroll-spy
  var links=document.querySelectorAll('.svc-nav a');
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('on')});map[e.target.id].classList.add('on');}})},{rootMargin:'-30% 0px -60% 0px'});
    document.querySelectorAll('.svc-item').forEach(function(s){spy.observe(s)});
  }
})();
