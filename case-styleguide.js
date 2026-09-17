(function(){
  'use strict';
  var reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
  var saveData=!!(navigator.connection&&navigator.connection.saveData);
  document.querySelectorAll('[data-styleguide]').forEach(function(root){
    var frames=Array.from(root.querySelectorAll('.case-styleguide__frame'));
    var index=0,timer,visible=false;
    function show(next,direction){
      var previous=frames[index];
      index=(next+frames.length)%frames.length;
      frames.forEach(function(frame){frame.classList.remove('is-active','is-exit');frame.setAttribute('aria-hidden','true')});
      if(previous&&previous!==frames[index]) previous.classList.add('is-exit');
      frames[index].classList.add('is-active');frames[index].setAttribute('aria-hidden','false');
    }
    function sync(){
      clearInterval(timer);
      if(visible&&!reduced.matches&&!saveData&&!document.hidden&&frames.length>1){
        timer=setInterval(function(){show(index+1,1)},Number(root.getAttribute('data-delay'))||6000);
      }
    }
    document.addEventListener('visibilitychange',sync);
    reduced.addEventListener('change',sync);
    if('IntersectionObserver' in window){new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;sync()},{threshold:.15}).observe(root)} else {visible=true;sync()}
    show(0,1);sync();
  });
})();
(function(){document.querySelectorAll('video[data-start-time]').forEach(function(v){var start=parseFloat(v.dataset.startTime)||0;function seek(){try{v.currentTime=start}catch(e){}}v.addEventListener('loadedmetadata',seek,{once:true});v.addEventListener('play',function(){if(v.currentTime<start-.15)seek()});});})();
