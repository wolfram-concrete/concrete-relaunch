// Reuse the site's reveal observer and image-parallax loop without changing layout.
(function () {
  var network = document.querySelector('.network');
  if (!network || !('IntersectionObserver' in window) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var parallax = matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)').matches;
  network.querySelectorAll('.network__partner').forEach(function (card, index) {
    var image = card.querySelector('.network__portrait');
    if (!image) return;
    var media = document.createElement('figure');
    media.className = 'network__media' + (parallax ? ' img-plx' : '');
    if (parallax) media.setAttribute('data-plx', index % 2 ? '4' : '-4');
    image.before(media);
    media.appendChild(image);
    card.classList.add('rv');
    card.style.setProperty('--network-delay', (index % 3 * 0.06) + 's');
  });
  network.classList.add('network--motion');
})();
