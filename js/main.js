  var PROJECTS = [
    { tag:"Destacado · Proyecto interno", dev:false, title:"Automatización de reporting logístico", desc:"Pipeline desatendido que descarga datos de un sistema externo de gestión de almacén, los reprocesa contra plantillas Excel con tablas dinámicas y gráficos, y distribuye informes diarios y semanales por correo. Incluye detección y aviso automático de fallos.", tech:["PHP","Selenium / WebDriver","PowerShell","Excel (COM)"], note:"Proyecto interno — sin demo pública por confidencialidad" },
    { tag:"Proyecto interno", dev:false, title:"Control de acceso de flota por matrícula", desc:"Recibe lecturas de matrícula por OCR desde cámaras de acceso, las contrasta contra la base de vehículos de la empresa y clasifica el estado documental de cada uno en niveles de alerta.", tech:["OCR","SQLite","PHP"] },
    { tag:"Proyecto interno", dev:false, title:"Extracción de documentos sin IA de pago", desc:"Motor de reconocimiento de documentos basado en OCR y parsers específicos por formato, sin depender de ningún servicio de IA de pago.", tech:["Tesseract OCR","PHP","Parsers / Regex"] },
    { tag:"Proyecto interno", dev:false, title:"Motor de correspondencia GPS para logística", desc:"Algoritmo que cruza rutas registradas contra datos GPS reales de la flota para atribuir correctamente los kilómetros recorridos.", tech:["TypeScript","Node.js","APIs GPS"] },
    { tag:"Proyecto interno", dev:false, title:"Descarga automática multi-portal", desc:"Descarga desatendida de documentos desde varios portales externos con comportamientos muy distintos entre sí. Diseñado para ser resiliente: detecta lo ya descargado y evita duplicados.", tech:["PHP","Selenium / WebDriver"] },
    { tag:"Proyecto interno", dev:false, title:"Auditoría de flota con informes dinámicos", desc:"Cruza datos de una base interna con varias APIs externas de telemetría para generar un informe único de estado de flota, con resumen en lenguaje natural del problema real de cada caso.", tech:["PHP","REST APIs","Excel (COM)"] },
    { tag:"Proyecto interno", dev:false, title:"Importador de certificados de seguro", desc:"Extrae automáticamente los datos clave de los certificados de seguro (matrícula, aseguradora, vigencia) directamente desde el PDF y los registra en base de datos.", tech:["PHP","Parsing de PDF","MySQL"] },
    { tag:"Proyecto interno", dev:false, title:"Importador de recibos de seguro", desc:"Mismo enfoque aplicado a los recibos de seguro: lectura automática del PDF y registro directo en el sistema.", tech:["PHP","Parsing de PDF","MySQL"] },
    { tag:"En desarrollo", dev:true, title:"Importador de repostajes y peajes", desc:"Procesa e inserta en la base de datos los datos de repostajes y peajes, conciliándolos contra los costes reales. En desarrollo la inserción mensual automática.", tech:["PHP","MySQL"] },
    { tag:"Académico · DAW", dev:false, academic:true, title:"SAVIA", desc:"Plataforma full-stack de gestión personal: dashboard de gastos, huchas de ahorro compartidas y seguimiento de vehículos. Stack MEAN completo.", tech:["Angular","Node.js","Express","MongoDB"], live:"https://savia-eight.vercel.app/dashboard", codeUrl:"https://github.com/mario241204/SAVIA" },
    { tag:"Académico · DAW", dev:false, academic:true, title:"Arcade DAW", desc:"Salón de juegos con los proyectos de JavaScript del curso: Buscaminas, Simon, Pacman Navideño, Poke Ruleta y un explorador de Rick & Morty.", tech:["JavaScript","HTML","CSS"], live:"https://arcade-daw.vercel.app/", codeUrl:"https://github.com/mario241204/arcade-daw" },
    { tag:"Académico · DAW", dev:false, academic:true, title:"Duki Fanpage", desc:"Servidor Node.js con el módulo nativo http, sin frameworks: sistema de rutas propio servido desde cero.", tech:["Node.js","HTTP nativo"], live:"https://duki-fanpage-alpha.vercel.app/", codeUrl:"https://github.com/mario241204/duki_fanpage" }
  ];

  (function () {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isDesktop = function(){ return window.matchMedia('(min-width: 821px)').matches; };

    /* ---------- Motor de diapositivas (filmstrip vertical) ---------- */
    var filmstrip = document.getElementById('filmstrip');
    var slides = Array.from(document.querySelectorAll('.slide'));
    var total = slides.length;
    var index = 0;

    var progress = document.getElementById('progress');
    var names = ['inicio','sobre-mi','ia','stack','formacion','proyectos','contacto'];
    names.forEach(function(name, i){
      var b = document.createElement('button');
      b.className = 'progress__item';
      b.innerHTML = '<span class="lbl">' + name + '</span>';
      b.addEventListener('click', function(){ goTo(i); });
      progress.appendChild(b);
    });
    var progressItems = Array.from(progress.querySelectorAll('.progress__item'));

    function render(){
      if (!isDesktop()) { filmstrip.style.transform = 'none'; return; }
      filmstrip.style.transform = 'translateY(' + (-index * 100) + 'vh)';
      slides.forEach(function(s, i){ s.classList.toggle('is-current', i === index); });
      progressItems.forEach(function(p, i){ p.classList.toggle('is-active', i === index); });
      document.querySelectorAll('#navLinks button, .nav__cta').forEach(function(btn){
        var go = parseInt(btn.dataset.go, 10);
        btn.classList.toggle('is-active', go === index);
      });
      revealCurrent();
    }

    function goTo(i){
      index = Math.max(0, Math.min(total - 1, i));
      render();
    }

    function revealCurrent(){
      var els = slides[index].querySelectorAll('.reveal');
      els.forEach(function(el, i){
        setTimeout(function(){ el.classList.add('is-in'); }, reduced ? 0 : i * 55);
      });
    }

    /* Rueda: acumula hasta un umbral, cooldown corto (no ligado a --dur) */
    var wheelBuf = 0, wheelCooldown = false;
    window.addEventListener('wheel', function(e){
      if (!isDesktop()) return;
      wheelBuf += e.deltaY;
      if (wheelCooldown) return;
      if (wheelBuf > 45) { goTo(index + 1); wheelBuf = 0; }
      else if (wheelBuf < -45) { goTo(index - 1); wheelBuf = 0; }
      else return;
      wheelCooldown = true;
      setTimeout(function(){ wheelCooldown = false; }, 140);
    }, { passive: true });

    window.addEventListener('keydown', function(e){
      if (!isDesktop()) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(index + 1); }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(index - 1); }
    });

    var touchY = null;
    window.addEventListener('touchstart', function(e){ touchY = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchend', function(e){
      if (!isDesktop() || touchY === null) return;
      var dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 55) goTo(index + (dy > 0 ? 1 : -1));
      touchY = null;
    }, { passive: true });

    document.querySelectorAll('[data-go]').forEach(function(el){
      el.addEventListener('click', function(){ goTo(parseInt(el.dataset.go, 10)); });
    });

    window.addEventListener('resize', render);
    render();

    /* ---------- Carrusel de proyectos ---------- */
    var menu = document.getElementById('projMenu');
    var card = document.getElementById('projCard');
    var cur = 0, switching = false;

    var html = '<div class="proj-menu__divider">Profesionales</div>';
    PROJECTS.forEach(function(p, i){
      if (p.academic && !(PROJECTS[i-1] && PROJECTS[i-1].academic)) {
        html += '<div class="proj-menu__divider">Académicos (DAW)</div>';
      }
      html += '<button class="proj-menu__item" data-i="' + i + '"><span class="proj-menu__dot"></span><span>' + p.title + '</span></button>';
    });
    menu.innerHTML = html;
    var items = Array.from(menu.querySelectorAll('.proj-menu__item'));

    function renderCard(p){
      var tagClass = 'proj-tag' + (p.dev ? ' dev' : '');
      var tag = '<span class="' + tagClass + '">' + p.tag + '</span>';
      var tech = '<div class="proj-tech">' + p.tech.map(function(t){ return '<span>' + t + '</span>'; }).join('') + '</div>';
      var links = '';
      if (p.live) {
        links = '<div class="proj-tech" style="gap:.6rem;"><a class="btn btn--ghost" style="padding:.5rem 1rem;font-size:.78rem;" href="' + p.live + '" target="_blank" rel="noopener">Ver en vivo ↗</a><a class="btn btn--ghost" style="padding:.5rem 1rem;font-size:.78rem;" href="' + p.codeUrl + '" target="_blank" rel="noopener">Código</a></div>';
      } else if (p.note) {
        links = '<span class="proj-note">' + p.note + '</span>';
      }
      card.innerHTML = '<div class="proj-card__bar"><span class="chrome-dots"><span></span><span></span><span></span></span><span class="path">proyectos/' + p.title.toLowerCase().replace(/[^a-z0-9]+/g,'_') + '.md</span></div><div class="proj-card__body">' + tag + '<h3>' + p.title + '</h3><p>' + p.desc + '</p>' + tech + links + '</div>';
    }

    function show(i){
      if (switching || i === cur || i < 0 || i >= PROJECTS.length) return;
      switching = true; cur = i;
      items.forEach(function(el, idx){ el.classList.toggle('is-active', idx === i); });
      card.classList.add('is-fading');
      setTimeout(function(){
        renderCard(PROJECTS[i]);
        card.classList.remove('is-fading');
        switching = false;
      }, reduced ? 0 : 200);
    }
    items.forEach(function(el){ el.addEventListener('click', function(){ show(parseInt(el.dataset.i, 10)); }); });

    var menuWheelLock = false;
    menu.addEventListener('wheel', function(e){
      e.preventDefault();
      if (menuWheelLock) return;
      menuWheelLock = true;
      setTimeout(function(){ menuWheelLock = false; }, 180);
      if (e.deltaY > 0) show(cur + 1); else if (e.deltaY < 0) show(cur - 1);
    }, { passive: false });

    renderCard(PROJECTS[0]);
    items[0].classList.add('is-active');
  })();
