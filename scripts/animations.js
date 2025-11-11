// animations.js - small helpers to apply our CSS helpers site-wide
(function(){
  'use strict';

  // Respect reduced motion preference
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) document.documentElement.classList.add('reduced-motion');

  function addBtnAnimations() {
    // Add .btn-animate to buttons and anchors with .btn class unless opted out with .no-animate
    document.querySelectorAll('button, a.btn').forEach(el => {
      if (el.classList.contains('no-animate')) return;
      el.classList.add('btn-animate');
    });
  }

  function addImgHover() {
    // Add .img-hover to images unless they explicitly disable it
    document.querySelectorAll('img').forEach(img => {
      if (img.classList.contains('no-animate')) return;
      // small heuristic: avoid tiny icons (<24px)
      try {
        const w = img.naturalWidth || img.width || 0;
        if (w && w < 24) return;
      } catch(e){}
      img.classList.add('img-hover');
    });
  }

  function addIconAnimations() {
    // Apply to font-awesome icons and svg icons
    document.querySelectorAll('i.fa, i.fas, i.far, i.fab, svg.icon').forEach(ic => {
      if (ic.classList.contains('no-animate')) return;
      ic.classList.add('icon-animate');
      // on click produce a temporary bounce
      ic.addEventListener('click', (e) => {
        if (prefersReduced) return;
        ic.classList.remove('clicked');
        // trigger reflow to restart animation
        void ic.offsetWidth;
        ic.classList.add('clicked');
        setTimeout(()=> ic.classList.remove('clicked'), 600);
      });
    });
  }

  // Simple typewriter effect for any element with .typing
  function runTypers(){
    const typers = document.querySelectorAll('.typing[data-text]');
    typers.forEach(el => {
      const text = el.dataset.text || el.textContent || '';
      el.textContent = '';
      const speed = parseInt(el.dataset.speed || '60', 10);
      if (prefersReduced) { el.textContent = text; return; }
      let i=0;
      function step(){
        if (i <= text.length) {
          el.textContent = text.slice(0,i);
          i++;
          setTimeout(step, speed + (Math.random()*20));
        }
      }
      setTimeout(step, 300);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    try{
      addBtnAnimations();
      addImgHover();
      addIconAnimations();
      runTypers();
    }catch(e){
      console.warn('animations.js init failed', e);
    }
  });

})();
