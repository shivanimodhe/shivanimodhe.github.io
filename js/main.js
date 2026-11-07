// Shivani Modhe · Portfolio scripts
(function () {
  var root = document.documentElement;

  // ---- Dark / light toggle (remembered per visitor) ----
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.setAttribute('aria-label', root.getAttribute('data-theme') === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme') ||
      (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-anim'); setTimeout(function(){ root.classList.remove('theme-anim'); }, 500);
    themeBtn.classList.remove('spin'); void themeBtn.offsetWidth; themeBtn.classList.add('spin');
    root.setAttribute('data-theme', next);
    themeBtn.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // ---- Progress bar, header shadow, back-to-top ----
  var bar = document.getElementById('progressBar'), toTop = document.getElementById('toTop'), header = document.querySelector('.site-header');
  function onScroll() {
    var max = root.scrollHeight - innerHeight, y = scrollY;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    if (toTop) toTop.classList.toggle('show', y > 900);
    if (header) header.classList.toggle('scrolled', y > 8);
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu ----
  var menuBtn = document.getElementById('menuBtn'), nav = document.getElementById('mainNav');
  var links = nav ? [].slice.call(nav.querySelectorAll('a')) : [];
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // ---- Highlight the section you're reading ----
  if ('IntersectionObserver' in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        if (map[e.target.id]) map[e.target.id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }

  // ---- Small helper for status messages ----
  function say(el, text) {
    if (!el) return;
    el.textContent = text;
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.textContent = ''; }, 3000);
  }

  // ---- Copy email ----
  var copyBtn = document.getElementById('copyBtn'), email = document.getElementById('email'), copyMsg = document.getElementById('copyMsg');
  if (copyBtn && email) copyBtn.addEventListener('click', function () {
    var text = email.textContent.trim();
    function select() {
      var r = document.createRange(); r.selectNodeContents(email);
      var s = getSelection(); s.removeAllRanges(); s.addRange(r);
      say(copyMsg, 'Selected. Press Ctrl/⌘ + C');
    }
    try {
      navigator.clipboard.writeText(text).then(function () { say(copyMsg, 'Copied'); copyBtn.textContent = 'Copied ✓'; setTimeout(function(){ copyBtn.textContent = 'Copy email'; }, 2000); }, select);
    } catch (e) { select(); }
  });

  // ---- Share: phone share sheet, or copy the link on computers ----
  // Shares the live site address (from the canonical link once it's set),
  // otherwise the page's own address.
  function siteUrl() {
    var c = document.querySelector('link[rel="canonical"]');
    var href = c && c.href;
    if (href && !/your-username/i.test(href) && /^https?:/.test(href)) return href;
    return location.href.split('#')[0];
  }
  function copyText(text, done, fail) {
    function fallback() {
      try {
        var t = document.createElement('textarea');
        t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(t);
        ok ? done() : fail();
      } catch (e) { fail(); }
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else fallback();
  }
  var shareBtn = document.getElementById('shareBtn'), shareMsg = document.getElementById('shareMsg');
  if (shareBtn) shareBtn.addEventListener('click', function () {
    var url = siteUrl();
    function copyLink() {
      copyText(url, function () { say(shareMsg, 'Link copied'); }, function () { say(shareMsg, url); });
    }
    if (navigator.share && /^https?:/.test(url)) {
      navigator.share({ url: url }).catch(function (e) { if (!e || e.name !== 'AbortError') copyLink(); });
    } else copyLink();
  });

  // ---- Gentle scroll reveal (skipped for reduced motion) ----
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var items = [].slice.call(document.querySelectorAll(".area, .ld-step, .cert, .about-text, .more"));
    [].slice.call(document.querySelectorAll("main h2, .contact h2")).forEach(function (h) { h.classList.add("rule-in"); items.push(h); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    items.forEach(function (el, i) {
      if (!el.classList.contains('rule-in')) el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      io.observe(el);
    });
  }


  // ---- Premium motion (skipped for reduced motion) ----
  if (!reduce) {
    // Section titles: wrap words so they can rise in
    [].slice.call(document.querySelectorAll('main h2, .contact h2')).forEach(function (h) {
      if (h.querySelector('.w')) return;
      var words = h.textContent.trim().split(/\s+/);
      h.setAttribute('aria-label', h.textContent.trim());
      h.textContent = '';
      words.forEach(function (w, i) {
        var o = document.createElement('span'); o.className = 'w'; o.setAttribute('aria-hidden', 'true');
        var n = document.createElement('span'); n.textContent = w; n.style.setProperty('--i', i);
        o.appendChild(n); h.appendChild(o);
        if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
      });
      h.classList.add('split-h');
    });

    // Ladder: each step rises after the previous one
    [].slice.call(document.querySelectorAll('.ld-step')).forEach(function (el, i) {
      el.style.transitionDelay = (i * 180) + 'ms';
      el.style.setProperty('--d', (i * 180) + 'ms');
    });

    // Ticket: reveal its fields when it scrolls into view
    var ticket = document.querySelector('.ticket');
    if (ticket && 'IntersectionObserver' in window) {
      var to = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { ticket.classList.add('in'); to.disconnect(); } });
      }, { threshold: 0.25 });
      to.observe(ticket);
    }

    // Cursor spotlight on cards (mouse and pen only)
    var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine) {
      [].slice.call(document.querySelectorAll('.area, .ld-card, .cert, .ticket')).forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
      });

      // Portrait: gentle tilt toward the pointer
      var frame = document.querySelector('.portrait .frame');
      if (frame) {
        frame.addEventListener('pointermove', function (e) {
          var r = frame.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          frame.style.setProperty('--ry', (x * 6).toFixed(2) + 'deg');
          frame.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
        });
        frame.addEventListener('pointerleave', function () {
          frame.style.setProperty('--rx', '0deg'); frame.style.setProperty('--ry', '0deg');
        });
      }
    }

    // Portrait: slight parallax while the hero is on screen
    var pf = document.querySelector('.portrait .frame'), ticking2 = false;
    if (pf) addEventListener('scroll', function () {
      if (ticking2) return; ticking2 = true;
      requestAnimationFrame(function () {
        var y = Math.min(scrollY, 900);
        pf.style.setProperty('--py', (y * 0.06).toFixed(1) + 'px');
        ticking2 = false;
      });
    }, { passive: true });
  }

  // ---- Hero headline: wrap each word so it can rise in ----
  if (!reduce) {
    var h1 = document.querySelector('.hero h1');
    if (h1 && !h1.querySelector('.w')) {
      var words = h1.textContent.trim().split(/\s+/);
      h1.setAttribute('aria-label', h1.textContent.trim());
      h1.textContent = '';
      words.forEach(function (w, i) {
        var outer = document.createElement('span'); outer.className = 'w'; outer.setAttribute('aria-hidden', 'true');
        var inner = document.createElement('span'); inner.textContent = w; inner.style.setProperty('--i', i);
        outer.appendChild(inner); h1.appendChild(outer);
        if (i < words.length - 1) h1.appendChild(document.createTextNode(' '));
      });
    }
  }
})();
