// Native mobile card stack, with enough space to read even on short screens.
(function () {
  var list = document.querySelector('.values-grid, .process-layout .sym--num');
  if (!list) return;
  var cards = Array.from(list.children);
  var media = matchMedia('(max-width:700px) and (prefers-reduced-motion:no-preference)');
  var timer;
  function measure() {
    list.style.removeProperty('--values-stack-height');
    list.style.removeProperty('--values-stack-top');
    if (!media.matches) return;
    var height = Math.max.apply(null, cards.map(function (card) { return card.offsetHeight; }));
    var header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
    list.style.setProperty('--values-stack-height', height + 'px');
    list.style.setProperty('--values-stack-top', Math.min(header, innerHeight - height - 16) + 'px');
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(measure, 120); }
  measure();
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  media.addEventListener('change', schedule);
  if (document.fonts) document.fonts.ready.then(schedule);
})();
