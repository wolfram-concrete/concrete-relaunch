/* Manual presentation viewer; no autoplay or dependencies. */
(function(){
  'use strict';
  document.querySelectorAll('[data-strategy-slides]').forEach(function(root){
    var track=root.querySelector('.strategy-slides__track');
    var slides=Array.from(track.children);
    var prev=root.querySelector('[data-slide-prev]');
    var next=root.querySelector('[data-slide-next]');
    var count=root.querySelector('[data-slide-count]');
    var dialog=root.querySelector('dialog');
    var enlarged=dialog.querySelector('.strategy-slides__enlarged');
    var image=enlarged.querySelector('img');
    var title=dialog.querySelector('[data-dialog-title]');
    var zoom=dialog.querySelector('[data-slide-zoom]');
    var index=0,timer;
    function render(){
      count.textContent=(index+1)+' / '+slides.length;
      prev.disabled=index===0;next.disabled=index===slides.length-1;
    }
    function update(){
      index=Math.max(0,Math.min(slides.length-1,Math.round(track.scrollLeft/track.clientWidth)));
      render();
    }
    function go(step){
      var destination=Math.max(0,Math.min(slides.length-1,index+step));
      index=destination;render();
      track.scrollTo({left:destination*track.clientWidth,behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
    }
    prev.addEventListener('click',function(){go(-1)});
    next.addEventListener('click',function(){go(1)});
    track.addEventListener('scroll',function(){clearTimeout(timer);timer=setTimeout(update,100)},{passive:true});
    track.addEventListener('keydown',function(event){
      if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();go(event.key==='ArrowRight'?1:-1)}
    });
    function open(button){
      var source=button.querySelector('img');
      image.src=button.getAttribute('data-full-src');image.alt=source.alt;
      title.textContent=button.closest('figure').querySelector('b').textContent;
      enlarged.classList.remove('is-original');zoom.textContent='Originalgröße';zoom.setAttribute('aria-pressed','false');
      dialog.showModal();
    }
    root.querySelectorAll('.strategy-slides__open').forEach(function(button){button.addEventListener('click',function(){open(button)})});
    root.querySelector('[data-slide-enlarge]').addEventListener('click',function(){open(slides[index].querySelector('button'))});
    dialog.querySelector('[data-slide-close]').addEventListener('click',function(){dialog.close()});
    dialog.addEventListener('click',function(event){if(event.target===dialog)dialog.close()});
    zoom.addEventListener('click',function(){var original=enlarged.classList.toggle('is-original');zoom.textContent=original?'Einpassen':'Originalgröße';zoom.setAttribute('aria-pressed',String(original))});
    window.addEventListener('resize',function(){track.scrollTo({left:index*track.clientWidth,behavior:'instant'});update()});
    update();
  });
})();
