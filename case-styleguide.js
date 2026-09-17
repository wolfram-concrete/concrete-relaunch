(function(){
  'use strict';
  var reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
  var saveData=!!(navigator.connection&&navigator.connection.saveData);
  document.querySelectorAll('[data-styleguide]').forEach(function(root){
    var frames=Array.from(root.querySelectorAll('.case-styleguide__frame'));
    var count=root.querySelector('[data-guide-count]');
    var pause=root.querySelector('[data-guide-pause]');
    var index=0,timer,visible=false,hovered=false,focused=false,userPaused=reduced.matches||saveData;
    var label=root.getAttribute('aria-label');
    function show(next){
      index=(next+frames.length)%frames.length;
      frames.forEach(function(frame,i){frame.classList.toggle('is-active',i===index);frame.setAttribute('aria-hidden',String(i!==index))});
      count.textContent=(index+1)+' / '+frames.length;
    }
    function sync(){
      clearInterval(timer);
      pause.textContent=userPaused?'Start':'Pause';
      pause.setAttribute('aria-pressed',String(userPaused));
      pause.setAttribute('aria-label',label+': Rotation '+(userPaused?'starten':'pausieren'));
      if(visible&&!hovered&&!focused&&!userPaused&&!reduced.matches&&!document.hidden){timer=setInterval(function(){show(index+1)},Number(root.getAttribute('data-delay'))||6000)}
    }
    function manual(step){userPaused=true;show(index+step);sync()}
    root.querySelector('[data-guide-prev]').addEventListener('click',function(){manual(-1)});
    root.querySelector('[data-guide-next]').addEventListener('click',function(){manual(1)});
    pause.addEventListener('click',function(){userPaused=!userPaused;sync()});
    root.addEventListener('mouseenter',function(){hovered=true;sync()});
    root.addEventListener('mouseleave',function(){hovered=false;sync()});
    root.addEventListener('focusin',function(){focused=true;sync()});
    root.addEventListener('focusout',function(event){if(!root.contains(event.relatedTarget)){focused=false;sync()}});
    root.addEventListener('keydown',function(event){if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();manual(event.key==='ArrowLeft'?-1:1)}});
    document.addEventListener('visibilitychange',sync);
    reduced.addEventListener('change',function(){if(reduced.matches)userPaused=true;sync()});
    if('IntersectionObserver' in window){new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;sync()},{threshold:.35}).observe(root)}
    show(0);sync();
  });
})();

(function(){document.querySelectorAll('video[data-start-time]').forEach(function(v){var start=parseFloat(v.dataset.startTime)||0;function seek(){try{v.currentTime=start}catch(e){}}v.addEventListener('loadedmetadata',seek,{once:true});v.addEventListener('play',function(){if(v.currentTime<start-.15)seek()});});})();
