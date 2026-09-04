(function(){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.16,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal,.hero,.hasclip').forEach(function(el){io.observe(el)});
  // split headline words for the stagger reveal
  document.querySelectorAll('[data-split]').forEach(function(h){
    var out='';h.textContent.trim().split(/\s+/).forEach(function(w,i){out+='<span class="wordwrap"><span style="transition-delay:'+(i*55)+'ms">'+w+'</span></span> ';});
    h.innerHTML=out;
  });
  // parallax
  var items=[].slice.call(document.querySelectorAll('.par'));
  if(items.length&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    var vh=innerHeight,tick=false;
    function frame(){
      items.forEach(function(el){
        var r=el.getBoundingClientRect(),sp=parseFloat(el.dataset.speed||'.12');
        var p=(r.top+r.height/2-vh/2)/vh;
        el.style.transform='translate3d(0,'+(-p*sp*100).toFixed(2)+'px,0)'+(el.dataset.scale?' scale('+el.dataset.scale+')':'');
      });tick=false;
    }
    addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});
    addEventListener('resize',function(){vh=innerHeight;frame()});frame();
  }
  // hero image crossfade (direction B)
  var stack=document.querySelector('[data-crossfade]');
  if(stack){var f=stack.children,n=0;setInterval(function(){f[n].classList.remove('on');n=(n+1)%f.length;f[n].classList.add('on');},4200);}
})();
