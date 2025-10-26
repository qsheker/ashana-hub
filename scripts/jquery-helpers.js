// scripts/jquery-helpers.js
// jQuery-based enhancements: ready log, notifications, copy-to-clipboard, lazy-loading

$(document).ready(function(){
  console.log('jQuery is ready!');

  // Notification helper
  function showNotification(message, timeout = 2800) {
    const n = $('<div class="notification" role="status"></div>').text(message);
    $('body').append(n);
    requestAnimationFrame(() => n.addClass('show'));
    setTimeout(() => n.removeClass('show'), timeout);
    setTimeout(() => n.remove(), timeout + 400);
  }

  // Attach simple notification to discount click
  $(document).on('click', '.discount-card', function(){
    showNotification('Item clicked — preview shown');
  });

  // Copy-to-clipboard button injection and handling
  function addCopyButtons() {
    // For member contact and meal names
    $('.member-fav, .meal-name').each(function(){
      const $this = $(this);
      if ($this.next('.copy-btn').length) return; // already added
      const btn = $('<button class="copy-btn" title="Copy">📋</button>');
      $this.after(btn);
      btn.on('click', async function(){
        const text = $this.text().trim();
        try {
          await navigator.clipboard.writeText(text);
          // visual feedback
          btn.text('✔');
          btn.attr('aria-label','Copied');
          showTooltip(btn, 'Copied to clipboard!');
          setTimeout(()=>btn.text('📋'), 1500);
        } catch (err) {
          showNotification('Copy failed');
        }
      });
    });
  }

  function showTooltip($el, text){
    const tip = $(`<div class="copy-tip">${text}</div>`);
    $('body').append(tip);
    const off = $el.offset();
    tip.css({ top: off.top - 36, left: off.left });
    tip.fadeIn(120).delay(900).fadeOut(200, ()=>tip.remove());
  }

  // Lazy loading: set real src when image in viewport
  function lazyLoad() {
    $('.lazy').each(function(){
      const $img = $(this);
      if ($img.attr('src') && $img.attr('src') !== 'images/restor.jpg' && $img.attr('data-src') == null) return;
      const top = $img.offset().top;
      const scroll = $(window).scrollTop();
      const winH = $(window).height();
      if (top < (scroll + winH + 120)) {
        const real = $img.attr('data-src');
        if (real) {
          $img.attr('src', real);
          $img.removeAttr('data-src');
          $img.removeClass('lazy');
        }
      }
    });
  }

  // Run once and on scroll/resize
  lazyLoad();
  $(window).on('scroll resize', lazyLoad);

  // Scroll progress bar updater (supports #scroll-progress or .scroll-progress .bar)
  function updateProgressBar() {
    const winH = $(window).height();
    const docH = $(document).height();
    const scrollTop = $(window).scrollTop();
    const pct = Math.max(0, Math.min(100, (scrollTop / (docH - winH)) * 100));

    const $idBar = $('#scroll-progress');
    if ($idBar.length) {
      $idBar.css('width', pct + '%');
      return;
    }
    const $bar = $('.scroll-progress .bar');
    if ($bar.length) $bar.css('width', pct + '%');
  }

  // Run on load + scroll
  // Ensure there's a progress bar on pages that don't have one
  if ($('#scroll-progress').length === 0 && $('.scroll-progress').length === 0) {
    $('body').prepend('<div class="scroll-progress" aria-hidden="true"><div class="bar"></div></div>');
  }
  updateProgressBar();
  $(window).on('scroll resize', updateProgressBar);

  // Animated counters: detect .count-up elements entering viewport and animate them
  const countUpEls = document.querySelectorAll('.count-up');
  if (countUpEls && countUpEls.length) {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const $el = $(el);
        const target = parseInt($el.attr('data-target')) || 0;
        const duration = parseInt($el.attr('data-duration')) || 1400;
        const start = performance.now();

        function step(now) {
          const t = Math.min(1, (now - start) / duration);
          const eased = t; // linear, could swap for easeOut
          const current = Math.floor(eased * target);
          $el.text(current.toLocaleString());
          if (t < 1) requestAnimationFrame(step);
          else {
            $el.text(target.toLocaleString());
            obs.unobserve(el);
          }
        }

        requestAnimationFrame(step);
      });
    }, { threshold: 0.3 });

    countUpEls.forEach(el => countObserver.observe(el));
  }

  // Generic submit button spinner behavior for forms
  $(document).on('submit', 'form', function(e){
    const $form = $(this);
    // find the primary submit button
    const $btn = $form.find('[type=submit]').first();
    if (!$btn || $btn.length === 0) return;
    if ($btn.data('no-spinner')) return; // opt-out

    const originalHtml = $btn.html();
    $btn.prop('disabled', true);
    $btn.html('<span class="spinner"></span> Please wait...');

    // restore after short delay; app-specific handlers may call restore early
    setTimeout(() => {
      $btn.prop('disabled', false);
      $btn.html(originalHtml);
    }, 1600);
  });

  // add copy buttons after dynamic content is likely rendered
  setTimeout(addCopyButtons, 600);

  // also show a toast when popup subscribe completes (app.js triggers overlay close)
  $(document).on('submit', '#popupForm', function(e){
    // popup handling in app.js will validate; show notification optimistically
    setTimeout(()=> showNotification('Subscribed!'), 300);
  });

  // show notification on 'copy' event as an alternative
  $(document).on('copy', function(){ showNotification('Copied to clipboard!'); });
});
