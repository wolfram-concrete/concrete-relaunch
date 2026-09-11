// Editorial mobile order: individuals, company-backed partners, studio, performance marketing.
(function () {
  var list = document.querySelector('.network__list');
  if (!list) return;
  var cards = Array.from(list.children);
  var desktopOrder = cards.slice();
  var mobileNames = [
    'Marleen Zepp', 'Stefan Trocha', 'Julia Rosenberger', 'Kevin Eulenberg',
    'Carolina Santos', 'Thomas Meuter', 'Joana Haars', 'Fabio Nobile',
    'Daniel Fatemi', 'Jan Illmer', 'Diemo Barz',
    'Leo Glomann', 'Eric Schlottke', 'Concadia', 'moodmacher',
    'Studio Golden',
    'Digital Naturals', 'Justaddsugar', 'Searchperts', 'planinja', 'AdSuits'
  ];
  var byName = new Map(cards.map(function (card) {
    return [card.querySelector('h3').textContent.trim(), card];
  }));
  var mobileOrder = mobileNames.map(function (name) { return byName.get(name); });
  if (mobileOrder.some(function (card) { return !card; }) || mobileOrder.length !== cards.length) return;
  var media = matchMedia('(max-width:540px)');
  function apply() {
    (media.matches ? mobileOrder : desktopOrder).forEach(function (card) {
      list.appendChild(card);
    });
  }
  apply();
  media.addEventListener('change', apply);
})();
