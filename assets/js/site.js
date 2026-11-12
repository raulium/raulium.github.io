/*
 * harnasch.com: the rail and the desire path.
 *
 * A fixed SVG (.rail, in _includes/rail.html) holds two paths:
 *   .rail-track  thin grey line
 *   .rail-line   the orange line
 *
 * Home page: the grey line is a right angle. Its horizontal arm starts just under
 * the landing words and runs to the left margin, then the line drops down the side.
 * The orange line cuts the corner (the desire path), joins the rail, and grows down
 * it as you scroll. Both the arm and the curve belong to the landing zone and scroll
 * away with it; only the vertical part stays fixed. The orange reaches the bottom of
 * the window just as the top of the index comes into view.
 *
 * Other pages: the grey rail runs the full height, and the orange fills it as you read.
 *
 * Also reveals the orange "New" markers for anything filed in the last 7 days.
 */
(function () {
  'use strict';

  var svg = document.querySelector('.rail');
  var track = svg && svg.querySelector('.rail-track');
  var line = svg && svg.querySelector('.rail-line');
  var isHome = document.body.classList.contains('is-home');
  var hero = document.querySelector('.hero');
  var words = document.querySelector('.hero-words');
  var index = document.getElementById('index');
  var queued = false;

  function f(n) { return n.toFixed(1); }
  function clamp(n) { return Math.min(1, Math.max(0, n)); }
  function smooth(t) { return t * t * (3 - 2 * t); }

  function draw() {
    queued = false;
    if (!svg) return;
    var W = window.innerWidth;
    var H = window.innerHeight;
    var y = window.scrollY || window.pageYOffset || 0;
    var R = W < 700 ? 18 : 36;

    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

    if (isHome && hero && words) {
      var heroRect = hero.getBoundingClientRect();
      var hH = heroRect.height;
      var top = heroRect.top;
      var wRect = words.getBoundingClientRect();
      var ax = wRect.right;
      var ay = wRect.bottom + 24;

      var idxTop = index ? index.getBoundingClientRect().top + y : document.documentElement.scrollHeight;
      var q = smooth(clamp(y / Math.max(1, idxTop - H)));
      var ey = H * 0.86 + (H - H * 0.86) * q;
      var gb = Math.min(H, ey + H * 0.06);

      track.setAttribute('d', 'M' + f(ax) + ' ' + f(ay) + ' L' + R + ' ' + f(ay) + ' L' + R + ' ' + f(gb));
      line.setAttribute('d',
        'M' + f(ax) + ' ' + f(ay) +
        ' C' + f(ax - (ax - R) * 0.43) + ' ' + f(ay + hH * 0.04) +
        ' ' + f(R + W * 0.10) + ' ' + f(top + hH * 0.50) +
        ' ' + R + ' ' + f(top + hH * 0.70) +
        ' L' + R + ' ' + f(Math.max(ey, top + hH * 0.70)));
    } else {
      var max = Math.max(1, document.documentElement.scrollHeight - H);
      var p = clamp(y / max);
      track.setAttribute('d', 'M' + R + ' 0 L' + R + ' ' + H);
      line.setAttribute('d', 'M' + R + ' 0 L' + R + ' ' + f(Math.max(2, H * p)));
    }
  }

  function queue() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(draw);
  }

  function markNew() {
    var week = 7 * 24 * 60 * 60 * 1000;
    var now = Date.now();
    var marks = document.querySelectorAll('[data-new-date]');
    for (var i = 0; i < marks.length; i++) {
      var d = Date.parse(marks[i].getAttribute('data-new-date') + 'T00:00:00');
      if (!isNaN(d) && now - d >= 0 && now - d < week) marks[i].hidden = false;
    }
  }

  markNew();
  draw();
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  window.addEventListener('load', queue);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
})();
