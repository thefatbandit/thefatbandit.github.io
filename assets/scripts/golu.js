/*
 * Easter egg (home page only): a little plane, flown by a baby hippo in
 * goggles and a scarf, swoops across the top of the screen towing a
 * hand-lettered "We love Golu ♥" banner and dropping hearts and stars.
 * Each flight alternates direction.
 *
 * Secret triggers:
 *   - type  g o l u  anywhere on the page (not while typing in a field)
 *   - tap or click the profile photo 5 times quickly
 *
 * With prefers-reduced-motion the banner fades in and out in place: no
 * flight, no confetti. Styles: the "golu-flyby" block in override.scss.
 */
(function () {
  'use strict';

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var flying = false;
  var flights = 0;
  var TEXT = 'We love Golu';
  var FLIGHT_MS = 11000;

  var SKY = 'fill:var(--sk-sky)';
  var SUN = '#f3d98b', SUN_DK = '#d9b85c', INK = '#1b2440';
  var HIPPO = '#a3899a', HIPPO_DK = '#76606f', SNOUT = '#bf9fae', SCARF = '#f2a7b8';

  // Nose on the left: the default flight goes right-to-left.
  var PLANE =
    '<svg class="golu-flyby__plane" viewBox="0 0 86 58" width="120" height="81" aria-hidden="true">' +
      '<g class="golu-flyby__tilt">' +
        '<path d="M64 30 L78 12 L82 14 L77 34 Z" style="' + SKY + '" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>' +                        // tail fin
        '<ellipse cx="42" cy="39" rx="19" ry="3.5" fill="' + SUN_DK + '"/>' +                     // far wing
        '<path class="golu-flyby__scarf" d="M47 19 C55 15 62 21 70 16 C67 23 57 24 48 22 Z" fill="' + SCARF + '"/>' +
        '<circle cx="36" cy="9" r="2.6" fill="' + HIPPO_DK + '"/>' +                               // ears
        '<circle cx="45" cy="9" r="2.6" fill="' + HIPPO_DK + '"/>' +
        '<ellipse cx="41" cy="16" rx="8.5" ry="7.5" fill="' + HIPPO + '" stroke="' + INK + '" stroke-width="1"/>' +                      // head
        '<ellipse cx="34" cy="19.5" rx="6" ry="4.2" fill="' + SNOUT + '"/>' +                      // snout
        '<circle cx="31.5" cy="19" r="0.9" fill="' + INK + '"/>' +                                 // nostrils
        '<circle cx="34.5" cy="18.6" r="0.9" fill="' + INK + '"/>' +
        '<rect x="35" y="11.2" width="11" height="4.6" rx="2.3" fill="' + INK + '"/>' +           // goggles
        '<circle cx="38" cy="13.5" r="1.4" fill="#ffffff"/>' +
        '<circle cx="43" cy="13.5" r="1.4" fill="#ffffff"/>' +
        '<path d="M10 34 C10 25 24 22 40 22 L70 26 C77 27 79 31 74 34 C66 40 48 42 34 42 C20 42 10 40 10 34 Z" style="' + SKY + '" stroke="' + INK + '" stroke-width="1.4"/>' +
        '<path d="M14 37 C30 40 54 40 72 33" stroke="' + SUN + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="38" cy="35" rx="22" ry="5" fill="' + SUN + '" stroke="' + INK + '" stroke-width="1.2"/>' +   // near wing
        '<line x1="30" y1="42" x2="28" y2="49" stroke="' + INK + '" stroke-width="2"/>' +       // wheel strut
        '<circle cx="28" cy="51" r="3.2" fill="' + INK + '"/>' +
        '<line x1="70" y1="35" x2="72" y2="41" stroke="' + INK + '" stroke-width="1.6"/>' +       // tail wheel strut
        '<circle cx="72" cy="42.5" r="2" fill="' + INK + '"/>' +                                    // tail wheel
        '<circle cx="10" cy="33" r="4.2" fill="' + SUN + '"/>' +                                    // nose cone
        '<rect class="golu-flyby__prop" x="5.5" y="20" width="3" height="28" rx="1.5" fill="' + INK + '" opacity=".75"/>' +
      '</g>' +
    '</svg>';

  var BITS = ['♥', '★', '✦', '♥', '✿'];          // ♥ ★ ✦ ♥ ✿
  var BIT_COLORS = ['#e0607e', 'var(--sk-sky)', '#e0b43c', '#f2a7b8'];

  function letters(text) {
    var out = '';
    for (var i = 0; i < text.length; i++) {
      out += '<span class="golu-flyby__ch" style="--i:' + i + '">' + text[i] + '</span>';
    }
    return out + '<span class="golu-flyby__ch golu-flyby__heart" style="--i:' + (text.length + 1) + '"> ♥</span>';
  }

  function sprinkle(layer, banner) {
    var box = layer.getBoundingClientRect();
    var r = banner.getBoundingClientRect();
    if (r.right < 0 || r.left > window.innerWidth) return;
    var bit = document.createElement('span');
    bit.className = 'golu-flyby__bit';
    bit.setAttribute('aria-hidden', 'true');
    bit.textContent = BITS[Math.floor(Math.random() * BITS.length)];
    bit.style.color = BIT_COLORS[Math.floor(Math.random() * BIT_COLORS.length)];
    bit.style.left = (r.left - box.left + Math.random() * r.width) + 'px';
    bit.style.top = (r.bottom - box.top - 6) + 'px';
    bit.style.setProperty('--dx', (Math.random() * 60 - 30).toFixed(0) + 'px');
    bit.style.setProperty('--rot', (Math.random() * 360 - 180).toFixed(0) + 'deg');
    layer.appendChild(bit);
    setTimeout(function () { bit.remove(); }, 1800);
  }

  function fly() {
    if (flying) return;
    flying = true;
    flights += 1;
    var ltr = flights % 2 === 0;

    var el = document.createElement('div');
    el.className = 'golu-flyby' + (reduce ? ' golu-flyby--still' : '') + (ltr && !reduce ? ' golu-flyby--ltr' : '');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML =
      '<span class="visually-hidden">' + TEXT + '!</span>' +
      '<div class="golu-flyby__craft"><div class="golu-flyby__swoop">' +
        PLANE +
        '<span class="golu-flyby__rope" aria-hidden="true"></span>' +
        '<span class="golu-flyby__banner" aria-hidden="true">' + letters(TEXT) + '</span>' +
      '</div></div>';
    document.body.appendChild(el);

    var timer = null;
    if (!reduce) {
      var banner = el.querySelector('.golu-flyby__banner');
      timer = setInterval(function () { sprinkle(el, banner); }, 130);
    }
    setTimeout(function () {
      if (timer) clearInterval(timer);
      el.remove();
      flying = false;
    }, reduce ? 3400 : FLIGHT_MS + 1900);
  }

  // type "golu"
  var typed = '';
  document.addEventListener('keydown', function (e) {
    var tg = e.target;
    if (tg && (tg.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName))) return;
    if (!e.key || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-4);
    if (typed === 'golu') { typed = ''; fly(); }
  });

  // five quick taps on the profile photo
  var photo = document.querySelector('#home img.rounded-circle');
  if (photo) {
    var taps = [];
    photo.addEventListener('click', function () {
      var now = Date.now();
      taps = taps.filter(function (t) { return now - t < 1600; });
      taps.push(now);
      if (taps.length >= 5) { taps = []; fly(); }
    });
  }
})();
