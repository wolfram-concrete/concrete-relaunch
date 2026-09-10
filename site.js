
(function(){
  // Statement: scroll-gescrubbtes Wort-Clip-Rise (GSAP ScrollTrigger)
  var st=document.querySelector("[data-str]");
  if(st&&window.gsap&&window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    var inners=[];
    [].slice.call(st.children).forEach(function(line){
      var color=getComputedStyle(line).color;
      var words=line.textContent.trim().split(/\s+/);
      line.textContent="";
      words.forEach(function(w,i){
        var m=document.createElement("span");m.className="w";
        var inner=document.createElement("i");inner.textContent=w;
        m.appendChild(inner);line.appendChild(m);
        if(i<words.length-1)line.appendChild(document.createTextNode(" "));
        inners.push(inner);
      });
    });
    if(matchMedia("(prefers-reduced-motion:reduce)").matches){
      gsap.set(inners,{yPercent:0});
    }else{
      var wrap=st.closest(".pause-wrap"), stage=st.closest(".pause");
      gsap.set(inners,{yPercent:115});
      var tl=gsap.timeline({scrollTrigger:{trigger:wrap,start:"top top",end:"bottom bottom",pin:stage,scrub:0.8}});
      tl.to(inners,{yPercent:0,ease:"power3.out",duration:1,stagger:0.35});
      tl.to({},{duration:1.5});
    }
  }
  var menuButton=document.querySelector("[data-menu-toggle]"),mobileMenu=document.querySelector("[data-mobile-menu]");
  function setMobileMenu(open){if(!menuButton||!mobileMenu)return;menuButton.setAttribute("aria-expanded",String(open));menuButton.setAttribute("aria-label",open?"Menü schließen":"Menü öffnen");var hd=document.querySelector(".site-header");if(hd){hd.classList.toggle("menu-open",open);if(open)hd.classList.add("show");}mobileMenu.classList.toggle("is-open",open);document.body.classList.toggle("menu-open",open);}
  if(menuButton&&mobileMenu)menuButton.addEventListener("click",function(){setMobileMenu(menuButton.getAttribute("aria-expanded")!=="true");});
  var navItems=[].slice.call(document.querySelectorAll("[data-nav-item]")).map(function(item){return{item:item,toggle:item.querySelector("[data-nav-toggle]"),panel:item.querySelector("[data-mega]")};});
  function closeNav(except){navItems.forEach(function(n){if(!n.toggle||!n.panel||n.panel===except)return;n.toggle.setAttribute("aria-expanded","false");n.panel.classList.remove("is-open");});syncMega();}
  function syncMega(){var h=document.querySelector(".site-header");if(!h)return;var open=navItems.some(function(n){return n.panel&&n.panel.classList.contains("is-open")});h.classList.toggle("mega-open",open);}
  navItems.forEach(function(n){
    if(!n.toggle||!n.panel)return;
    n.toggle.addEventListener("click",function(){var open=n.toggle.getAttribute("aria-expanded")==="true";closeNav(n.panel);n.toggle.setAttribute("aria-expanded",String(!open));n.panel.classList.toggle("is-open",!open);syncMega();});
    n.item.addEventListener("focusout",function(e){if(!n.item.contains(e.relatedTarget)){n.toggle.setAttribute("aria-expanded","false");n.panel.classList.remove("is-open");}});
  });
  document.addEventListener("keydown",function(e){
    if(e.key!=="Escape")return;
    var open=navItems.filter(function(n){return n.toggle&&n.toggle.getAttribute("aria-expanded")==="true";})[0];
    if(open){open.toggle.setAttribute("aria-expanded","false");open.panel.classList.remove("is-open");open.toggle.focus();return;}
    if(menuButton&&menuButton.getAttribute("aria-expanded")==="true"){setMobileMenu(false);menuButton.focus();}
  });
  document.addEventListener("click",function(e){if(!e.target.closest("[data-nav-item]"))closeNav();});
  // __hoverNav: Mega-Menü öffnet beim Hover auf den Navigationspunkt
  if(matchMedia("(hover:hover) and (pointer:fine)").matches){
    navItems.forEach(function(n){
      if(!n.toggle||!n.panel)return;
      var closeTimer=null;
      function openIt(){clearTimeout(closeTimer);closeNav(n.panel);n.toggle.setAttribute("aria-expanded","true");n.panel.classList.add("is-open");syncMega();}
      function closeIt(){clearTimeout(closeTimer);closeTimer=setTimeout(function(){n.toggle.setAttribute("aria-expanded","false");n.panel.classList.remove("is-open");syncMega();},180);}
      n.item.addEventListener("mouseenter",openIt);
      n.item.addEventListener("mouseleave",closeIt);
    });
  }
  // Mobiles Akkordeon: weiche Hoehenanimation statt harten Umschaltens,
  // die Unterpunkte laufen leicht versetzt nach
  document.querySelectorAll("[data-mnav-toggle]").forEach(function(t){
    var panel=document.getElementById(t.getAttribute("aria-controls"));if(!panel)return;
    var kids=[].slice.call(panel.children),busy=false;
    kids.forEach(function(k,i){k.style.transitionDelay=(i*45)+"ms";});
    function endOpen(){panel.style.height="auto";panel.classList.remove("is-animating");busy=false;}
    function endClose(){panel.hidden=true;panel.style.height="";panel.classList.remove("is-animating","is-open");busy=false;}
    panel.addEventListener("transitionend",function(e){
      if(e.target!==panel||e.propertyName!=="height")return;
      if(panel.classList.contains("is-open"))endOpen();else endClose();
    });
    t.addEventListener("click",function(){
      if(busy)return;busy=true;
      var open=t.getAttribute("aria-expanded")==="true";
      t.setAttribute("aria-expanded",String(!open));
      panel.classList.add("is-animating");
      if(open){
        panel.style.height=panel.scrollHeight+"px";
        panel.classList.remove("is-open");
        requestAnimationFrame(function(){requestAnimationFrame(function(){panel.style.height="0px";});});
        setTimeout(function(){if(busy)endClose();},700);
      }else{
        panel.hidden=false;panel.style.height="0px";
        requestAnimationFrame(function(){requestAnimationFrame(function(){
          panel.classList.add("is-open");panel.style.height=panel.scrollHeight+"px";});});
        setTimeout(function(){if(busy)endOpen();},700);
      }
    });
  });


  // Gestapelte Karten (Situationen, Kompetenzen) brauchen auf dem Handy die gleiche
  // Hoehe: sonst loest die hoechste Karte frueher vom Klebepunkt und schaut oben heraus.
  (function(){
    var stacks=[].slice.call(document.querySelectorAll(".scenario-list,.section--carrier .competence-grid,.eg-steps"));
    if(!stacks.length)return;
    var mq=matchMedia("(max-width:900px)"),t;
    function apply(){
      stacks.forEach(function(list){
        var items=[].slice.call(list.children).filter(function(el){return el.matches(".scenario-link,.competence,.eg-step");});
        if(!items.length)return;
        items.forEach(function(el){el.style.minHeight="";});
        if(!mq.matches)return;
        var max=0;items.forEach(function(el){max=Math.max(max,el.offsetHeight);});
        items.forEach(function(el){el.style.minHeight=max+"px";});
      });
    }
    function later(){clearTimeout(t);t=setTimeout(apply,120);}
    apply();
    addEventListener("resize",later);
    addEventListener("load",later);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(later);
  })();
  // Hero-Intro: Wort (Arame) → Reel: je Frame anderes Bild + andere Schrift → ruhiges Schlussbild
  var hero=document.querySelector("[data-hero]");
  if(hero){
    document.body.classList.add("intro");
    var imgs=[].slice.call(hero.querySelectorAll(".hero__reel img"));
    var finalImg=hero.querySelector(".hero__reel .final");
    var word=hero.querySelector(".hero__word span");
    var seq=imgs.filter(function(i){return i!==finalImg});
    function finish(){document.body.classList.remove("intro");seq.forEach(function(i){i.classList.remove("on");i.style.zIndex="";});word.className="";finalImg.classList.add("on");hero.classList.remove("reel");hero.classList.add("done");if(finalImg.tagName==="VIDEO"&&!matchMedia("(prefers-reduced-motion:reduce)").matches){finalImg.play().catch(function(){});}}
    if(matchMedia("(prefers-reduced-motion:reduce)").matches){finish();}
    else{
      var arame=(document.fonts&&document.fonts.load)?document.fonts.load('700 100px Arame').catch(function(){}):Promise.resolve();
      arame.then(function(){hero.classList.add("word")});
      // Bilder + Schriften VOR dem Reel fertig laden — kein Ruckeln
      var ready=Promise.race([Promise.all(imgs.map(function(i){return i.decode?i.decode().catch(function(){}):Promise.resolve()})),new Promise(function(r){setTimeout(r,2500)})]);
      var fontsReady=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();
      var minWord=new Promise(function(r){setTimeout(r,1400)});
      Promise.all([ready,fontsReady,minWord]).then(function(){
        hero.classList.add("reel");
        var n=0,frameMs=210,last=0;
        function step(ts){
          if(!last)last=ts;
          if(ts-last>=frameMs){
            last=ts;
            if(n>=seq.length){finish();return;}
            var cur=seq[n];
            cur.style.zIndex=String(10+n);      // neuer Frame legt sich OBEN drauf
            cur.classList.add("on");             // alter bleibt sichtbar darunter — kein Schwarzblitz
            word.className=cur.getAttribute("data-font")||("f"+(n%13));
            if(n>1){seq[n-2].classList.remove("on");seq[n-2].style.zIndex="";}
            n++;
          }
          requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }
  // __masonrysplit: Großformate (.span) aus dem Spaltenraster herauslösen — das Masonry wird
  // an dieser Stelle geteilt; jedes Segment balanciert sich selbst, keine großen Lücken.
  document.querySelectorAll(".case-masonry").forEach(function(m){
    var guard=0;
    while(m.querySelector(".span") && guard++<10){
      var sp=m.querySelector(".span");
      var rest=[],n=sp.nextSibling;
      while(n){var nx=n.nextSibling;if(n.nodeType===1)rest.push(n);n=nx;}
      sp.classList.remove("span");sp.classList.add("case-wide");
      m.parentNode.insertBefore(sp,m.nextSibling);
      if(rest.length){
        var m2=document.createElement("div");m2.className=m.className;
        rest.forEach(function(r){m2.appendChild(r);});
        m.parentNode.insertBefore(m2,sp.nextSibling);
        m=m2;
      }else break;
    }
  });
  // Lazy-Deadlock lösen: Masonry-Bilder haben ohne Maße 0-Höhe und schneiden den
  // Viewport nie — daher hier immer eager laden.
  document.querySelectorAll(".case-masonry img,img.case-wide").forEach(function(im){
    im.loading="eager";im.decoding="async";
  });

  // Wort-Masken: Headline-Wörter einzeln umhüllen, damit sie hinter einer Kante hochfahren können
  document.querySelectorAll(".mask-words").forEach(function(el){
    if(el.getAttribute("data-split"))return;
    var words=el.textContent.trim().split(/\s+/);el.textContent="";
    words.forEach(function(w,i){var o=document.createElement("span");o.className="w";var s=document.createElement("span");s.textContent=w;s.style.transitionDelay=(i*70)+"ms";o.appendChild(s);el.appendChild(o);if(i<words.length-1)el.appendChild(document.createTextNode(" "));});
    el.setAttribute("data-split","1");
  });
  // Filter-Chips: nacheinander
  document.querySelectorAll(".fbar.rv .fchip").forEach(function(c,i){c.style.transitionDelay=(i*35)+"ms";});
  // Scroll-Reveals
  (function(){
    if(matchMedia("(prefers-reduced-motion:reduce)").matches){document.querySelectorAll(".rv,.rv-media,.rv-block-l,.rv-block-r,.rv-lines,.mask-words").forEach(function(e){e.classList.add("in")});return;}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{rootMargin:"0px 0px -12% 0px",threshold:.05});
    var all=[].slice.call(document.querySelectorAll(".rv,.rv-media,.rv-block-l,.rv-block-r,.rv-lines,.mask-words"));
    all.forEach(function(e){io.observe(e)});
    // __rvFallback: IO kann in eingebetteten Kontexten stallen — sichtbare Elemente per Scroll-Check nachziehen
    var pend=all.slice(),tick=false;
    function sweep(){
      pend=pend.filter(function(e){
        if(e.classList.contains("in"))return false;
        var r=e.getBoundingClientRect();
        if(r.top<innerHeight*0.92){e.classList.add("in");return false;}
        return true;
      });
      tick=false;
    }
    function onS(){if(!tick){tick=true;requestAnimationFrame(sweep);}}
    addEventListener("scroll",onS,{passive:true});
    addEventListener("resize",onS,{passive:true});
    setTimeout(sweep,150);setTimeout(sweep,800);
    // Kompetenz-Listen: Zeilen einzeln hochtreppen
    document.querySelectorAll(".competence").forEach(function(c,ci){
      c.querySelectorAll("li").forEach(function(li,i){li.style.transitionDelay=(ci*120+140+i*70)+"ms";});
    });
    // Case-Wand: Kacheln leicht versetzt
    document.querySelectorAll(".case-wall__grid .case-tile").forEach(function(t,i){t.style.transitionDelay=(i%6*60)+"ms";});
  })();
  // Parallax (Beton-Fragmente + Pause-Textur)
  (function(){
    if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
    // __imgplx: Galerie-/Containerbilder in Overflow-Wrapper packen und leicht mitscrollen lassen
    document.querySelectorAll(".case-masonry img,img.case-wide,.case-imgs img,.proof-gallery img,.bimgs .med--photo img,.crefs .med img,.inquiry__media img,.pgrid .ptile__media img").forEach(function(im,i){
      if(im.closest(".img-plx"))return;
      var w=document.createElement("div");w.className="img-plx"+(im.classList.contains("span")?" span":"");w.setAttribute("data-plx",(i%2?4:-4));
      im.parentNode.insertBefore(w,im);w.appendChild(im);
    });
    var els=[].slice.call(document.querySelectorAll("[data-plx]"));
    var tex=document.querySelector(".pause__tex");if(tex){tex.setAttribute("data-plx","8");tex.classList.add("plx");els.push(tex);}
    if(!els.length)return;
    var t=false;
    function run(){
      var vh=innerHeight;
      els.forEach(function(el){
        var r=el.getBoundingClientRect();
        var c=(r.top+r.height/2-vh/2)/vh; // -0.5..0.5
        var py=c*parseFloat(el.getAttribute("data-plx"))*10;
        // Bildcontainer: Verschiebung auf den Spielraum der Skalierung (1.14 -> 7 % je Seite) begrenzen, sonst blitzt der Rand
        if(el.classList.contains("img-plx")){var im=el.querySelector("img");var ih=im?im.getBoundingClientRect().height:0;var lim=Math.max(0,(ih-r.height)/2-1);if(py>lim)py=lim;if(py<-lim)py=-lim;}
        el.style.setProperty("--py",py.toFixed(1));
      });
      t=false;
    }
    addEventListener("scroll",function(){if(!t){t=true;requestAnimationFrame(run);}},{passive:true});
    run();
  })();
  // Weiterlesen in Rezensionen (delegiert, gilt auch fuer geklonte Karten)
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("[data-readmore]");if(!b)return;
    var f=b.closest(".review"),open=f.classList.toggle("open");
    b.textContent=open?"Ausblenden":"Weiterlesen";b.setAttribute("aria-expanded",String(open));
  });
  // Rezensions-Karussell: laeuft von selbst, wird bei Hover/Fokus/Drag langsam und bleibt stehen, Pfeile springen kartenweise
  (function(){
    var t=document.querySelector("[data-revtrack]");if(!t)return;
    var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
    var cards=Array.prototype.slice.call(t.querySelectorAll(".review"));if(cards.length<2)return;
    function step(){var c=t.querySelector(".review");return c?c.getBoundingClientRect().width+parseFloat(getComputedStyle(t).gap||0):320;}
    // Endlos: Karten einmal klonen, beim Erreichen der Haelfte zurueckspringen
    var loopW=0;
    if(!reduce){cards.forEach(function(c){var d=c.cloneNode(true);d.setAttribute("aria-hidden","true");d.querySelectorAll("a,button").forEach(function(x){x.setAttribute("tabindex","-1")});t.appendChild(d);});}
    function measure(){loopW=0;cards.forEach(function(c){loopW+=c.getBoundingClientRect().width});loopW+=cards.length*parseFloat(getComputedStyle(t).gap||0);}
    measure();addEventListener("resize",measure);
    var speed=0.55,factor=1,target=1,hold=0,last=0,paused=false;
    function wrap(){if(!loopW)return;if(t.scrollLeft>=loopW)t.scrollLeft-=loopW;else if(t.scrollLeft<0)t.scrollLeft+=loopW;}
    function frame(ts){
      var dt=last?Math.min(48,ts-last):16;last=ts;
      factor+=(target-factor)*Math.min(1,dt/420);
      if(!paused&&factor>0.005){t.scrollLeft+=speed*factor*(dt/16.7);wrap();}
      requestAnimationFrame(frame);
    }
    function slow(){target=0}function go(){target=1}
    t.addEventListener("pointerenter",slow);t.addEventListener("pointerleave",function(){if(!t.matches(":focus-within"))go()});
    t.addEventListener("focusin",slow);t.addEventListener("focusout",function(){if(!t.matches(":hover"))go()});
    var p=document.querySelector("[data-rev-prev]"),n=document.querySelector("[data-rev-next]");
    function nudge(dir){target=0;factor=0;t.scrollBy({left:dir*step(),behavior:"smooth"});clearTimeout(hold);hold=setTimeout(function(){if(!t.matches(":hover,:focus-within"))go()},2600);}
    if(p)p.addEventListener("click",function(){nudge(-1)});
    if(n)n.addEventListener("click",function(){nudge(1)});
    var down=false,sx=0,sl=0;
    t.addEventListener("pointerdown",function(e){down=true;paused=true;sx=e.clientX;sl=t.scrollLeft;t.classList.add("dragging");t.setPointerCapture(e.pointerId);});
    t.addEventListener("pointermove",function(e){if(down){t.scrollLeft=sl-(e.clientX-sx);wrap();}});
    ["pointerup","pointercancel"].forEach(function(ev){t.addEventListener(ev,function(){down=false;paused=false;t.classList.remove("dragging");});});
    t.addEventListener("scroll",function(){if(!down)wrap()},{passive:true});
    if(!reduce)requestAnimationFrame(frame);
  })();
  // Aktives Video schließen, sobald es aus dem Viewport scrollt (kein unsichtbarer Ton)
  (function(){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting&&e.target===window.__activeTeaserEl&&window.__closeActiveTeaser)window.__closeActiveTeaser();
      });
    },{threshold:.15});
    document.querySelectorAll("[data-vteaser]").forEach(function(t){io.observe(t)});
  })();
  // Harte Regel: nur das geöffnete Video darf Ton haben
  setInterval(function(){
    document.querySelectorAll("video").forEach(function(v){
      var t=v.closest("[data-vteaser]");
      if(!(t&&t.classList.contains("open"))&&!v.muted)v.muted=true;
    });
  },800);
  // Navi: nicht sticky — erscheint nur beim Scrollen nach oben, auf Blur-Träger
  (function(){
    var h=document.querySelector(".site-header");if(!h)return;
    var lastY=window.scrollY,tick=false;
    // hell/dunkel unter dem Header dynamisch bestimmen (Element hinter der Navi)
    function bgIsLight(){
      var probeY=Math.min(innerHeight-4,(h.offsetHeight||88)+6);
      var els=document.elementsFromPoint(Math.floor(innerWidth/2),probeY);
      for(var i=0;i<els.length;i++){
        var el=els[i];
        if(h.contains(el)||el.closest&&el.closest(".site-header,.mobile-nav,.mega-menu"))continue;
        if(el.closest&&el.closest("[data-light]"))return true; // helles Hero-Motiv: Navigation in Ink
        var node=el;
        while(node&&node!==document.documentElement){
          if(node.tagName==="IMG"||node.tagName==="VIDEO"||node.tagName==="CANVAS")return false; // Foto/Video: hell nicht garantiert → Paper-Navi
          var cs=getComputedStyle(node);
          if(cs.backgroundImage&&cs.backgroundImage!=="none")return false;
          var m=cs.backgroundColor.match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, ]+([\d.]+))?\)/);
          if(m&&(m[4]===undefined||parseFloat(m[4])>=.5)){
            return (0.299*m[1]+0.587*m[2]+0.114*m[3])/255>0.6;
          }
          node=node.parentElement;
        }
        break;
      }
      return true; // Fallback: Papier-Grund
    }
    function apply(){
      var y=window.scrollY;
      var hd=document.querySelector(".site-header");
      if(hd&&hd.classList.contains("mega-open")){hd.classList.add("show");hd.classList.remove("attop","carrier","inv");lastY=y;tick=false;return;}
      var up=y<lastY-2, down=y>lastY+2;
      if(y<=8){h.classList.add("show","attop");h.classList.remove("carrier");}
      else if(up){h.classList.add("show","carrier");h.classList.remove("attop");}
      else if(down){h.classList.remove("show");}
      if(h.classList.contains("show")){h.classList.toggle("inv",!h.classList.contains("carrier")&&bgIsLight());}
      lastY=y;tick=false;
    }
    apply();
    addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(apply);}},{passive:true});
    // Kontrast-Regel: Navi muss auf hellem Grund immer auf Ink stehen, auch ohne Scroll
    // (nach Laden, Schriften, Resize, Bildern und nach dem Schließen des Mega-Menüs)
    function syncInv(){if(h.classList.contains("mega-open"))return;if(h.classList.contains("show"))h.classList.toggle("inv",!h.classList.contains("carrier")&&bgIsLight());}
    addEventListener("load",syncInv);addEventListener("resize",syncInv);addEventListener("pageshow",syncInv);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(syncInv);
    setTimeout(syncInv,120);setTimeout(syncInv,600);setInterval(syncInv,900);
  })();
  // Case-Galerien: weiches Durchfaden mit Drift
  document.querySelectorAll("[data-gallery]").forEach(function(g){
    var imgs=[].slice.call(g.querySelectorAll("img"));if(imgs.length<2)return;
    var i=0;
    setInterval(function(){
      var prev=imgs[i];i=(i+1)%imgs.length;var next=imgs[i];
      prev.classList.remove("on");prev.classList.add("out");
      next.classList.remove("out");next.classList.add("on");
      setTimeout(function(){prev.classList.remove("out")},1500);
    },3800);
  });
  // Video-Teaser: Thumb spielt stumm; Klick vergrößert + Ton — nur EIN aktives Video sitewide
  window.__closeActiveTeaser=null;
  document.querySelectorAll("[data-vteaser]").forEach(function(t){
    var src=t.getAttribute("data-src"), thumb=t.querySelector(".vteaser__thumb");
    function mountPreview(){
      if(!src||!thumb||thumb.querySelector("video")||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
      var im=thumb.querySelector("img"),pv=document.createElement("video");
      pv.src=src;pv.defaultMuted=true;pv.muted=true;pv.setAttribute("muted","");pv.loop=true;pv.autoplay=true;pv.playsInline=true;pv.preload="metadata";
      if(im){pv.poster=im.currentSrc||im.src;im.replaceWith(pv);}
    }
    if(src&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
      if("IntersectionObserver" in window){
        var previewIo=new IntersectionObserver(function(entries){
          if(entries.some(function(entry){return entry.isIntersecting;})){mountPreview();previewIo.disconnect();}
        },{rootMargin:"320px 0px"});
        previewIo.observe(t);
      }else mountPreview();
    }
    t.addEventListener("click",function(){
      if(t.classList.contains("open"))return;
      t.classList.add("open");
      if(!src)return;
      setTimeout(function(){
        var v=thumb.querySelector("video");
        if(!v){v=document.createElement("video");v.src=src;v.defaultMuted=true;v.muted=true;v.setAttribute("muted","");v.playsInline=true;var im2=thumb.querySelector("img");if(im2)im2.replaceWith(v);}
        v.controls=true;v.muted=false;v.loop=false;v.currentTime=0;
        if(window.__closeActiveTeaser)window.__closeActiveTeaser();
        v.play().catch(function(){});
        window.__activeTeaserEl=t;
        var b=thumb.querySelector(".vteaser__badge");if(b)b.remove();
        if(!thumb.querySelector(".vteaser__close")){
          var x=document.createElement("span");x.className="vteaser__close";x.setAttribute("role","button");x.setAttribute("tabindex","0");x.setAttribute("aria-label","Video schließen");x.textContent="×";
          function closeTeaser(ev){
            if(ev)ev.stopPropagation();
            v.pause();v.controls=false;v.muted=true;v.loop=true;v.play().catch(function(){});
            x.remove();t.classList.remove("open");
            if(window.__closeActiveTeaser===closeTeaser){window.__closeActiveTeaser=null;window.__activeTeaserEl=null;}
          }
          window.__closeActiveTeaser=closeTeaser;
          x.addEventListener("click",closeTeaser);
          x.addEventListener("keydown",function(ev){if(ev.key==="Enter"||ev.key===" ")closeTeaser(ev);});
          thumb.appendChild(x);
        }
      },700);
    });
  });
  // Eigene Video-Player: Klick startet (kein Fremd-Player); ohne Quelle bleibt das Standbild
  document.querySelectorAll("[data-video]").forEach(function(p){
    p.addEventListener("click",function(){
      var src=p.getAttribute("data-src");if(!src)return;
      var v=document.createElement("video");v.src=src;v.controls=true;v.autoplay=true;v.playsInline=true;v.defaultMuted=true;v.muted=true;v.setAttribute("muted","");v.addEventListener("click",function(){v.muted=false;},{once:true});
      p.replaceWith(v);
    });
  });
  // Desktop: Footer-Spalten aus der Tabfolge nehmen (Prototyp-Regel)
  function footerMode(){var d=matchMedia("(min-width:761px)").matches;document.querySelectorAll(".footer-col").forEach(function(c){c.open=d;var s=c.querySelector("summary");if(s)s.tabIndex=d?-1:0;});}
  footerMode();matchMedia("(min-width:761px)").addEventListener("change",footerMode);
})();

// __muteGuard: nichts darf ungefragt Ton spielen
(function(){
  function sweep(){document.querySelectorAll("video").forEach(function(v){var t=v.closest(".vteaser,.player");var open=t&&t.classList.contains("open");if(!open&&(!v.muted||v.volume>0&&!v.muted)){v.muted=true;}});}
  addEventListener("load",sweep);
  document.addEventListener("visibilitychange",sweep);
  sweep();
})();

  // Pin-Positionen nach spaetem Layout (Fonts, Logoband-Bilder) neu messen
  (function(){
    if(!window.ScrollTrigger)return;
    var t=null; function rf(){clearTimeout(t);t=setTimeout(function(){ScrollTrigger.refresh();},80);}
    window.addEventListener("load",rf);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(rf);
    var imgs=document.querySelectorAll(".logo-band img"); var left=imgs.length;
    imgs.forEach(function(i){ if(i.complete){if(--left===0)rf();} else i.addEventListener("load",function(){if(--left===0)rf();},{once:true}); });
    if(window.ResizeObserver){var lastH=0;new ResizeObserver(function(){var h=document.documentElement.scrollHeight;if(Math.abs(h-lastH)>2){lastH=h;rf();}}).observe(document.body);}
  })();

  // Projekte-Karussell auf Case-Seiten: langsamer Eigenlauf, Ziehen mit Schwung, Endlosschleife
  document.querySelectorAll("[data-marquee]").forEach(function(m){
    var track=m.querySelector(".case-marquee__track"),row=m.querySelector(".case-marquee__row");if(!track||!row)return;
    var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
    var x=0,v=0,auto=reduce?0:0.35,target=1,factor=1,down=false,sx=0,sxx=0,lastX=0,lastT=0,moved=0,last=0,loop=0;
    function gap(){return parseFloat(getComputedStyle(track).gap)||0}
    function measure(){loop=row.getBoundingClientRect().width+gap()}
    measure();addEventListener("resize",measure);
    function wrap(){if(!loop)return;while(x<=-loop)x+=loop;while(x>0)x-=loop;}
    function frame(ts){var dt=last?Math.min(48,ts-last):16;last=ts;
      if(!down){factor+=(target-factor)*Math.min(1,dt/500);
        if(Math.abs(v)>0.02){x+=v*dt;v*=Math.pow(0.94,dt/16.7);}else{v=0;}
        x-=auto*factor*(dt/16.7);}
      wrap();track.style.transform="translate3d("+x.toFixed(2)+"px,0,0)";requestAnimationFrame(frame);}
    m.addEventListener("pointerenter",function(){target=0.15});m.addEventListener("pointerleave",function(){if(!down)target=1});
    m.addEventListener("pointerdown",function(e){down=true;v=0;sx=e.clientX;sxx=x;lastX=e.clientX;lastT=performance.now();moved=0;m.classList.add("dragging");m.setPointerCapture(e.pointerId);});
    m.addEventListener("pointermove",function(e){if(!down)return;var now=performance.now();var dx=e.clientX-lastX;var dt=Math.max(1,now-lastT);v=v*0.6+(dx/dt)*0.4;lastX=e.clientX;lastT=now;x=sxx+(e.clientX-sx);moved=Math.max(moved,Math.abs(e.clientX-sx));wrap();});
    function up(e){if(!down)return;down=false;m.classList.remove("dragging");if(performance.now()-lastT>80)v=0;target=m.matches(":hover")?0.15:1;}
    ["pointerup","pointercancel"].forEach(function(ev){m.addEventListener(ev,up)});
    m.addEventListener("click",function(e){if(moved>6){e.preventDefault();e.stopPropagation();}},true);
    // Trackpad: horizontales Wischen verschiebt das Band, vertikales Scrollen bleibt unberührt
    m.addEventListener("wheel",function(e){if(Math.abs(e.deltaX)<=Math.abs(e.deltaY))return;e.preventDefault();v=0;x-=e.deltaX;target=0.15;wrap();},{passive:false});
    requestAnimationFrame(frame);
  });

  // Justified-Galerie: Zeilen werden per JS so umbrochen, dass alle Zeilen möglichst
  // gleich hoch sind (Zielhöhe --h, kein Anschnitt). Nur die letzte Zeile darf höher
  // werden, damit rechts keine Lücke bleibt; würde sie dabei mehr als 1,75× so hoch,
  // bleibt sie auf Zielhöhe und der Platzhalter füllt den Rest.
  document.querySelectorAll("[data-mosaic]").forEach(function(g){
    var fill=g.querySelector(".fill");
    var probe=document.createElement("i");probe.setAttribute("aria-hidden","true");probe.style.cssText="position:absolute;visibility:hidden;height:var(--h);width:0;flex:none;margin:0;padding:0";g.appendChild(probe);
    function ar(el){var v=parseFloat(el.style.getPropertyValue("--ar"));return v>0?v:1.5;}
    function layout(){
      var items=[].filter.call(g.children,function(c){return c!==fill&&c!==probe&&c.tagName!=="I"});if(items.length<2)return;
      var W=g.clientWidth,gap=parseFloat(getComputedStyle(g).gap)||0,H=probe.offsetHeight||300;if(!W)return;
      g.classList.add("is-packed");
      // Umbruch per dynamischer Programmierung: minimale Summe der quadrierten Abweichungen
      // aller Zeilen von der Zielhöhe; die letzte Zeile zählt nicht, sie darf abweichen
      var n=items.length,ars=items.map(ar),best=new Array(n+1).fill(Infinity),prev=new Array(n+1).fill(-1);best[0]=0;
      // Auf schmalen Screens hoechstens zwei Bilder pro Zeile, sonst werden sie zu klein
      var maxPer=W<560?2:99;
      function h(count,sumAr){return (W-gap*(count-1))/sumAr;}
      for(var i=0;i<n;i++){if(best[i]===Infinity)continue;var sumAr=0;
        for(var j=i;j<n;j++){sumAr+=ars[j];var count=j-i+1,rh=h(count,sumAr);
          if(count>maxPer)break;
          if(rh<H*0.6&&count>1)break;
          var cost=j===n-1?0:(rh-H)*(rh-H)*(rh>H*1.6?4:1);
          if(best[i]+cost<best[j+1]){best[j+1]=best[i]+cost;prev[j+1]=i;}}}
      var breaks=[],k=n;while(k>0){breaks.unshift([prev[k],k]);k=prev[k];}
      var rows=breaks.map(function(b){var els=items.slice(b[0],b[1]);return [els,els.reduce(function(a,el){return a+ar(el)},0)];});
      var lastOpen=true;
      rows.forEach(function(r,idx){
        var els=r[0],sumAr=r[1],rowH=h(els.length,sumAr),isLast=idx===rows.length-1&&lastOpen;
        if(isLast){
          var natural=Math.min(rowH,H);
          if(rowH>H*1.75){rowH=natural;if(fill)fill.style.display="";}
          else{if(fill)fill.style.display="none";}
        }else if(fill&&idx===rows.length-1){fill.style.display="none";}
        var used=0;
        els.forEach(function(el,k){
          var w=k===els.length-1&&!(isLast&&rowH<h(els.length,sumAr))?W-gap*(els.length-1)-used:Math.floor(ar(el)*rowH);
          used+=w;el.style.width=w+"px";
        });
      });
    }
    layout();
    var t;addEventListener("resize",function(){clearTimeout(t);t=setTimeout(layout,80);});
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layout);
  });
