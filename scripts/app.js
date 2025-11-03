$(function(){

  const KEY = 'theme'; 
  const $root = $(':root');
  const saved = localStorage.getItem(KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = (saved==='light'||saved==='dark') ? saved : (prefersDark ? 'dark' : 'light');
  $root.attr('data-theme', initial);
  $('#themeToggle').attr('aria-pressed', String(initial==='dark'));

  function toggleTheme(){
    const now = $root.attr('data-theme')==='dark' ? 'light' : 'dark';
    $root.attr('data-theme', now);
    localStorage.setItem(KEY, now);
    $('#themeToggle,#themeToggleSide').attr('aria-pressed', String(now==='dark'));
  }
  $('#themeToggle, #themeToggleSide').on('click', toggleTheme);

  function updateClock(){
    const el = document.getElementById('clock');
    if(!el) return;
    el.textContent = new Date().toLocaleString();
  }
  updateClock(); setInterval(updateClock, 1000);

  const colors = ['#ffffff', '#f8f9fa', '#eaf2ff', '#fff3f7', '#f2fff7'];
  let idx = 0;
  $('#changeBgBtn').on('click', function(){
    idx = (idx + 1) % colors.length;
    $('body').css('background-color', colors[idx]);
  });

  const $overlay = $('#popupOverlay');
  $('#openPopupBtn').on('click', ()=> $overlay.addClass('show').attr('aria-hidden','false'));
  $('#closePopupBtn').on('click', ()=> $overlay.removeClass('show').attr('aria-hidden','true'));
  $overlay.on('click', function(e){ if(e.target===this){ $overlay.removeClass('show').attr('aria-hidden','true'); }});
  $('#popupForm').on('submit', function(e){
    e.preventDefault();
    const $email = $('#popupEmail');
    const valid = /\S+@\S+\.\S+/.test($email.val());
    $email.toggleClass('is-invalid', !valid);
    if(valid){ alert('Subscribed!'); $overlay.removeClass('show').attr('aria-hidden','true'); this.reset(); }
  });

  $('#settingsForm').on('submit', function(e){
    e.preventDefault();
    const $u=$('#username'), $p=$('#phone'), $a=$('#address'),
          $e=$('#email'), $pw=$('#password'), $c=$('#confirm');
    let ok = true;
    [$u,$p,$a,$e,$pw,$c].forEach($el=>{
      if(!$el.val().trim()){ $el.addClass('is-invalid'); ok=false; } else { $el.removeClass('is-invalid'); }
    });
    if(!/\S+@\S+\.\S+/.test($e.val())){ $e.addClass('is-invalid'); ok=false; }
    if($pw.val().length<8){ $pw.addClass('is-invalid'); ok=false; }
    if($pw.val()!==$c.val()){ $c.addClass('is-invalid'); ok=false; }
    if(!ok) return;

    const $spin=$('#spinner'), $btn=$('#saveBtn');
    $spin.prop('hidden', false); $btn.prop('disabled', true);
    setTimeout(()=>{ $spin.prop('hidden', true); $btn.prop('disabled', false); alert('Profile saved successfully!'); e.target.reset(); }, 2000);
  });

  $('#faq').on('click', '.faq-q', function(){
    $(this).closest('.faq-item').toggleClass('open');
  });

  function clearHighlights($scope){
    $scope.find('mark.highlight').each(function(){
      const txt = $(this).text();
      $(this).replaceWith(txt);
    });
  }
  $('#searchInput').on('input', function(){
    const q = $(this).val().trim().toLowerCase();
    const $items = $('#faq .faq-item');

    $items.each(function(){
      const $q = $(this).find('.faq-q'), $a = $(this).find('.faq-a');
      const text = ($q.text() + ' ' + $a.text()).toLowerCase();
      $(this).toggle(text.indexOf(q)!==-1 || q==='');
    });

    clearHighlights($('#faq'));
    if(q){
      const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')})`, 'gi');
      $('#faq .faq-q, #faq .faq-a').each(function(){
        const html = $(this).html();
        $(this).html(html.replace(re, '<mark class="highlight">$1</mark>'));
      });
    }
  });

  $(window).on('scroll', function(){
    const s = $(this).scrollTop(), h = $(document).height() - $(this).height();
    $('#progress-bar').css('width', (h>0 ? (s/h)*100 : 0) + '%');
  });

  (function animateCounter(){
    const $c = $('#userCount'); const start=0, end=1000, duration=2000;
    $({n:start}).animate({n:end},{
      duration, easing:'linear',
      step:function(){ $c.text(Math.floor(this.n)); },
      complete:function(){ $c.text(end); }
    });
  })();

});
