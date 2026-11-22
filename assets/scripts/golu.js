/*
 * Easter egg (home page only): a little plane flies across the top of the
 * screen towing a "We love Golu" banner.
 *
 * Secret triggers:
 *   - type  g o l u  anywhere on the page (not while typing in a field)
 *   - tap or click the profile photo 5 times quickly
 *
 * With prefers-reduced-motion the banner fades in and out instead of flying.
 */
(function () {
  'use strict';

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var flying = false;

  var PLANE =
    '<svg class="golu-flyby__plane" viewBox="0 0 48 24" width="48" height="24" aria-hidden="true">' +
      '<g fill="currentColor">' +
        '<path d="M6 12c0-2.2 3-4 9-4h20l6-6h3l-2 8h1c1.1 0 2 .9 2 2s-.9 2-2 2H15c-6 0-9-1.8-9-2z"/>' +
        '<path d="M20 12h10l-6 9h-3z" opacity=".75"/>' +
        '<circle cx="12" cy="11" r="1.4" fill="#fff"/>' +
        '<circle cx="17" cy="11" r="1.4" fill="#fff"/>' +
      '</g>' +
      '<rect class="golu-flyby__prop" x="2" y="5" width="2" height="14" rx="1" fill="currentColor"/>' +
    '</svg>';

  function fly() {
    if (flying) return;
    flying = true;
    var el = document.createElement('div');
    el.className = 'golu-flyby' + (reduce ? ' golu-flyby--still' : '');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML =
      '<div class="golu-flyby__craft">' +
        PLANE +
        '<span class="golu-flyby__rope" aria-hidden="true"></span>' +
        '<span class="golu-flyby__banner">We love Golu <span class="golu-flyby__heart" aria-hidden="true">♥</span></span>' +
      '</div>';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); flying = false; }, reduce ? 3400 : 11400);
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
