$(document).ready(function () {

  /* ── FOOTER YEAR ── */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── CONTACT FORM (Formspree) ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const statusEl = document.getElementById('cf-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitLabel = submitBtn.textContent;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      statusEl.textContent = '';
      statusEl.className = '';

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      })
        .then(async (response) => {
          const data = await response.json().catch(() => ({}));
          if (response.ok && data.success !== 'false') {
            statusEl.textContent = '¡Gracias! Tu mensaje fue enviado, te contactaremos pronto.';
            statusEl.className = 'text-success small fw-semibold';
            contactForm.reset();
          } else {
            throw new Error(data.message || 'Ocurrió un error al enviar tu mensaje.');
          }
        })
        .catch((err) => {
          statusEl.textContent = err.message || 'Ocurrió un error. Intenta de nuevo o escríbenos por WhatsApp.';
          statusEl.className = 'text-danger small fw-semibold';
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = submitLabel;
        });
    });
  }

  /* ── HERO SLIDER ── */
  $(".hero-slider").owlCarousel({
    loop: true, nav: true, dots: true,
    smartSpeed: 700, items: 1,
    autoplay: true, autoplayTimeout: 3000,
    autoplayHoverPause: true,
    navText: ["&#8592;", "&#8594;"],
    animateOut: "fadeOut",
  });


  /* ── REVIEWS SLIDER ── */
  $(".reviews-slider").owlCarousel({
    loop: true, nav: false, dots: true,
    smartSpeed: 900, items: 1, margin: 24,
    autoplay: true, autoplayTimeout: 5000,
  });

  /* ── CLIENTS LOGO CAROUSEL ── */
  if ($(".clients-slider").length) {
    $(".clients-slider").owlCarousel({
      loop: true, nav: false, dots: false,
      smartSpeed: 800, autoplay: true,
      autoplayTimeout: 2000, autoplaySpeed: 2000,
      responsive: { 0:{items:2}, 480:{items:3}, 768:{items:4}, 1024:{items:5} },
    });
  }

  /* ── SCROLL ANIMATIONS ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) { el.target.classList.add('visible'); observer.unobserve(el.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up,.fade-left,.fade-right,.scale-in,.stagger-item').forEach(el => observer.observe(el));

  /* ── COUNTER ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = target / 80;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 18);
  }
  const milestoneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
        milestoneObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const milestone = document.getElementById('milestone');
  if (milestone) milestoneObserver.observe(milestone);

  /* ── HERO VIDEO ── */
  let videoIdx = 0;
  const videos = document.querySelectorAll('.hero-video-item');
  const slides = document.querySelectorAll('.hero-slide-content');
  const dots   = document.querySelectorAll('.hero-dot');
  function goSlide(n) {
    videos.forEach((v,i) => { v.classList.toggle('active', i===n); if(i===n){v.play();} else{v.pause();} });
    slides.forEach((s,i) => s.classList.toggle('active', i===n));
    dots.forEach((d,i) => d.classList.toggle('active', i===n));
    videoIdx = n;
  }
  if (videos.length) {
    goSlide(0);
    videos.forEach((v,i) => v.addEventListener('ended', () => goSlide((i+1) % videos.length)));
    document.querySelectorAll('.hero-dot').forEach((d,i) => d.addEventListener('click', () => goSlide(i)));
    document.querySelector('.hero-prev') && document.querySelector('.hero-prev').addEventListener('click', () => goSlide((videoIdx - 1 + videos.length) % videos.length));
    document.querySelector('.hero-next') && document.querySelector('.hero-next').addEventListener('click', () => goSlide((videoIdx + 1) % videos.length));
  }

  /* ── PROJECTS DATA ── */
  window.projects = [
    { id:1, cat:'redes-sanitarias', title:'Redes Sanitarias Fase 3.1 – Valle San Juan', tag:'Redes Sanitarias', area:'506 ml', loc:'Valle San Juan, Chincha', imgs:['img/proyectos/redes-valle-san-juan-3-1/01.jpg','img/proyectos/redes-valle-san-juan-3-1/02.jpg','img/proyectos/redes-valle-san-juan-3-1/03.jpg','img/proyectos/redes-valle-san-juan-3-1/04.jpg','img/proyectos/redes-valle-san-juan-3-1/05.jpg'], client:'Desarrollo Inmobiliario Marverde S.A.C.', clientLogo:'img/marverde.png', year:'2026', duration:'2 meses', desc:'Suministro e instalación de redes de agua potable y alcantarillado, incluyendo conexiones domiciliarias, empalmes a redes existentes y obras complementarias.' },
    { id:2, cat:'deportivo', title:'Zona Deportiva – Proyecto Fundo de Asia', tag:'Recreativo / Deportivo', area:'1,146.25 m²', loc:'Asia, Cañete', imgs:['img/proyectos/zona-deportiva-fundo-asia/01.png','img/proyectos/zona-deportiva-fundo-asia/02.png','img/proyectos/zona-deportiva-fundo-asia/03.png','img/proyectos/zona-deportiva-fundo-asia/04.png'], client:'Go House Inmobiliaria S.A.C.', clientLogo:'img/go house.png.avif', year:'2025', duration:'2 meses', desc:'Ejecución integral de una zona deportiva, iniciando con obras provisionales y la habilitación temporal de servicios auxiliares para el desarrollo seguro de los trabajos. Se realizaron las estructuras de las diferentes canchas mediante excavaciones, conformación de bases y vaciado de losas de concreto conforme a las especificaciones.' },
    { id:3, cat:'obras-civiles', title:'Escalera de Acceso al Reservorio RAP-01 (Adicional N°01)', tag:'Obras Civiles', area:'24 ml', loc:'Ate, Lima', imgs:['img/proyectos/escalera-reservorio-rap-01/01.png','img/proyectos/escalera-reservorio-rap-01/02.png','img/proyectos/escalera-reservorio-rap-01/03.png','img/proyectos/escalera-reservorio-rap-01/04.png','img/proyectos/escalera-reservorio-rap-01/05.png'], client:'La Gloria Propiedades S.A.', clientLogo:'img/lgp.png', year:'2025', duration:'1 mes', desc:'Adicional por nuevo alcance y mayores metrados. Las actividades comprendieron la movilización de equipos, el perfilado y la preparación del terreno, así como el relleno, conformación y compactación de la subrasante. Se incluyó el suministro e instalación de concreto estructural y acero de refuerzo, apoyados con equipos de bombeo especializados.' },
    { id:4, cat:'obras-civiles', title:'Estructura Metálica para Tanque de Agua', tag:'Obras Civiles', area:'1 und', loc:'Carabayllo, Lima', imgs:['img/proyectos/tanque-agua-carabayllo/01.jpg','img/proyectos/tanque-agua-carabayllo/02.png','img/proyectos/tanque-agua-carabayllo/03.png','img/proyectos/tanque-agua-carabayllo/04.png','img/proyectos/tanque-agua-carabayllo/05.png'], client:'Los Portales S.A.', clientLogo:'img/los portales.png', year:'2025', duration:'1 mes', desc:'Trabajos preliminares de trazo, nivelación y excavación, así como el vaciado de dado y piso de concreto armado. Montaje de una estructura metálica de 10 m de altura con arriostramiento, soldadura, escalera de inspección, barandas, pintado y poste para la línea de agua potable.' },
    { id:5, cat:'obras-civiles', title:'Construcción de Pontones – Canal', tag:'Obras Civiles', area:'36.63 m²', loc:'Huampaní, Lima', imgs:['img/proyectos/pontones-canal-huampani/01.png','img/proyectos/pontones-canal-huampani/02.jpg','img/proyectos/pontones-canal-huampani/03.png','img/proyectos/pontones-canal-huampani/04.png','img/proyectos/pontones-canal-huampani/05.png'], client:'Los Portales S.A.', clientLogo:'img/los portales.png', year:'2025', duration:'1 mes', desc:'Movimiento de tierras mediante excavaciones, nivelación y rellenos compactados, asegurando la capacidad portante. La estructura del nuevo pontón se construyó en concreto armado f’c=280 kg/cm², con acero de refuerzo Fy=4200 kg/cm², en cimientos, muros y losa.' },
    { id:6, cat:'redes-sanitarias', title:'Redes Sanitarias Fase 3.2 – Valle San Juan', tag:'Redes Sanitarias', area:'23 ml', loc:'Valle San Juan, Chincha', imgs:['img/proyectos/redes-valle-san-juan-3-2/01.jpg','img/proyectos/redes-valle-san-juan-3-2/02.jpg','img/proyectos/redes-valle-san-juan-3-2/03.jpg','img/proyectos/redes-valle-san-juan-3-2/04.jpg'], client:'Desarrollo Inmobiliario Marverde S.A.C.', clientLogo:'img/marverde.png', year:'2026', duration:'1 mes', desc:'Suministro e instalación de redes de agua potable y alcantarillado, incluyendo la provisión de tuberías PVC-U UF, válvulas, accesorios y conexiones domiciliarias. Los trabajos comprendieron el trazo, nivelación y replanteo, excavación de zanjas, refine, colocación de cama de apoyo, instalación de tuberías, relleno y compactación.' },
    { id:7, cat:'redes-sanitarias', title:'Redes Sanitarias San José E-1', tag:'Redes Sanitarias', area:'1,696.88 ml', loc:'San José, Virú', imgs:['img/proyectos/redes-san-jose-viru/01.jpg','img/proyectos/redes-san-jose-viru/02.jpg','img/proyectos/redes-san-jose-viru/03.jpg','img/proyectos/redes-san-jose-viru/04.jpg','img/proyectos/redes-san-jose-viru/05.jpg'], client:'Desarrollo Inmobiliario Marverde S.A.C.', clientLogo:'img/marverde.png', year:'2025', duration:'1 mes', desc:'Suministro e instalación de redes de agua potable y alcantarillado, incluyendo conexiones domiciliarias, empalmes a redes existentes y obras complementarias.' },
    { id:8, cat:'redes-sanitarias', title:'Redes Sanitarias – Villa Refugio del Sol E-1', tag:'Redes Sanitarias', area:'1,119.99 ml', loc:'Villa Refugio del Sol, Chiclayo', imgs:['img/proyectos/redes-villa-refugio-del-sol/01.png','img/proyectos/redes-villa-refugio-del-sol/02.png','img/proyectos/redes-villa-refugio-del-sol/03.png','img/proyectos/redes-villa-refugio-del-sol/04.png'], client:'Desarrollo Inmobiliario Marverde S.A.C.', clientLogo:'img/marverde.png', year:'2025', duration:'2 meses', desc:'Suministro e instalación de redes de agua potable y alcantarillado, incluyendo conexiones domiciliarias, empalmes a redes existentes y obras complementarias.' },
    { id:9, cat:'obras-civiles', title:'Tótem de Ingreso Canessa', tag:'Obras Civiles', area:'1 und', loc:'Chilca, Cañete', imgs:['img/proyectos/totem-canessa-chilca/01.jpg','img/proyectos/totem-canessa-chilca/02.jpg','img/proyectos/totem-canessa-chilca/03.jpg','img/proyectos/totem-canessa-chilca/04.jpg','img/proyectos/totem-canessa-chilca/05.jpg'], client:'Los Portales S.A.', clientLogo:'img/los portales.png', year:'2025', duration:'1 mes', desc:'Trazado, excavaciones, cimentación con concreto armado y montaje de columnas. Además, se instaló la estructura metálica tipo tótem y se ejecutaron acabados arquitectónicos con tarrajeo y colocación de letras publicitarias.' },
    { id:10, cat:'acabados', title:'Cerramiento de Ventana tras Rack – Juno', tag:'Acabados', area:'15.83 ml', loc:'Chorrillos, Lima', imgs:['img/proyectos/cerramiento-juno-chorrillos/01.jpg','img/proyectos/cerramiento-juno-chorrillos/02.jpg','img/proyectos/cerramiento-juno-chorrillos/03.jpg','img/proyectos/cerramiento-juno-chorrillos/04.jpg'], client:'Metrocolor', clientLogo:'', year:'2026', duration:'1 semana', desc:'Suministro e instalación de drywall con planchas de Gyplac, empastado y pintura final.' },
  ];

  /* ── OPEN PROJECT MODAL ── */
  window.openProjectModal = function(id) {
    const p = window.projects.find(x => x.id === id);
    if (!p) return;
    $('#pm-tag').text(p.tag);
    $('#pm-area').text(p.area);
    $('#pm-title').text(p.title);
    $('#pm-desc').text(p.desc);
    $('#pm-loc').text(p.loc);
    $('#pm-year').text(p.year);
    $('#pm-areav').text(p.area);
    $('#pm-duration').text(p.duration);
    if (p.client) {
      if (p.clientLogo) $('#pm-client-logo').attr({ src: p.clientLogo, alt: p.client }).show();
      else $('#pm-client-logo').hide();
      $('#pm-client-modal-name').text(p.client);
      $('#pm-client-logo-wrap').show();
    } else {
      $('#pm-client-logo-wrap').hide();
    }

    let html = '<div class="pm-slides">';
    p.imgs.forEach((src, i) => {
      html += '<div class="pm-slide'+(i===0?' active':'')+'" style="background-image:url('+src+')"></div>';
    });
    html += '</div>';
    if (p.imgs.length > 1) {
      html += '<button class="pm-carousel-btn pm-prev">&#8592;</button>';
      html += '<button class="pm-carousel-btn pm-next">&#8594;</button>';
      html += '<div class="pm-dots">';
      p.imgs.forEach((_, i) => {
        html += '<button class="pm-dot'+(i===0?' active':'')+'" data-idx="'+i+'"></button>';
      });
      html += '</div>';
      html += '<div class="pm-counter"><span class="pm-cur">1</span> / '+p.imgs.length+'</div>';
    }
    $('#pm-carousel-wrap').html(html);

    $('.pm-btn').off('click.similar').on('click.similar', function(e) {
      e.preventDefault();
      window.closeProjectModal();
      const gridId = $('#portfolio-grid').length ? 'portfolio-grid' : 'all-projects-grid';
      const isMasonry = gridId === 'portfolio-grid';
      renderProjects(p.cat, gridId, isMasonry);
      $('.filter-btn').removeClass('active');
      $('.filter-btn[data-filter="' + p.cat + '"]').addClass('active');
      const target = isMasonry ? $('#portfolio') : $('#' + gridId).closest('section');
      $('html, body').animate({ scrollTop: target.offset().top - 70 }, 400);
    });

    $('#projectModal').css({'display':'flex','opacity':0}).animate({'opacity':1},200);
    $('body').css('overflow','hidden');
    pmStartAutoplay();
  };

  /* ── RENDER PROJECT GRID ── */
  window.renderProjects = function(filter, containerId, masonry) {
    const grid = $('#' + containerId);
    grid.html('');
    let filtered = filter === 'all' ? window.projects : window.projects.filter(p => p.cat === filter);
    if (masonry && filter === 'all') filtered = filtered.slice(0, 5);
    filtered.forEach((p, i) => {
      const clientHtml = p.clientLogo ? '<div class="proj-client-logo"><img src="'+p.clientLogo+'" alt="'+p.client+'"></div>' : '';
      const card = $('<div class="proj-card fade-up" data-id="'+p.id+'" style="transition-delay:'+(i*70)+'ms"><div class="proj-img" style="background-image:url('+p.imgs[0]+')"></div><div class="proj-overlay"><span class="proj-tag">'+p.tag+'</span><h3>'+p.title+'</h3><p><span>'+p.area+'</span><span class="dot"> • </span><span>'+p.loc+'</span></p></div>'+clientHtml+'</div>');
      if (masonry && i === 0) card.addClass('proj-first');
      grid.append(card);
      setTimeout(() => card.addClass('visible'), i * 70 + 50);
    });
    grid.find('.proj-card').on('click', function() { window.openProjectModal($(this).data('id')); });
  };

  renderProjects('all', 'portfolio-grid', true);

  $(document).on('click', '.filter-btn', function() {
    $(this).closest('.filter-btns').find('.filter-btn').removeClass('active');
    $(this).addClass('active');
    const filter = $(this).data('filter');
    const grid = $(this).closest('section,main').find('.proj-grid-wrap').attr('id') || 'portfolio-grid';
    renderProjects(filter, grid, grid === 'portfolio-grid');
  });

  /* ── PROJECT CAROUSEL NAVIGATION ── */
  let pmAutoplay = null;

  function pmGoTo(idx) {
    const wrap = $('#pm-carousel-wrap');
    const slides = wrap.find('.pm-slide');
    const dots = wrap.find('.pm-dot');
    slides.removeClass('active').eq(idx).addClass('active');
    dots.removeClass('active').eq(idx).addClass('active');
    wrap.find('.pm-cur').text(idx + 1);
  }

  function pmNext() {
    const slides = $('#pm-carousel-wrap .pm-slide');
    const cur = slides.index(slides.filter('.active'));
    pmGoTo((cur + 1) % slides.length);
  }

  function pmStartAutoplay() {
    clearInterval(pmAutoplay);
    pmAutoplay = setInterval(pmNext, 3500);
  }

  $(document).on('click', '.pm-next', function() { pmNext(); pmStartAutoplay(); });
  $(document).on('click', '.pm-prev', function() {
    const slides = $('#pm-carousel-wrap .pm-slide');
    const cur = slides.index(slides.filter('.active'));
    pmGoTo((cur - 1 + slides.length) % slides.length);
    pmStartAutoplay();
  });
  $(document).on('click', '.pm-dot', function() {
    pmGoTo(parseInt($(this).data('idx')));
    pmStartAutoplay();
  });

  /* ── CLOSE PROJECT MODAL ── */
  window.closeProjectModal = function() {
    $('#projectModal').fadeOut(180);
    $('body').css('overflow','');
    clearInterval(pmAutoplay);
  };

  $('#pm-close, #projectModal .pm-backdrop').on('click', window.closeProjectModal);
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') window.closeProjectModal();
  });

  /* ── NAVBAR SCROLL ── */
  $(window).on('scroll', function() { $('.navbar').toggleClass('scrolled', $(this).scrollTop() > 60); });

  /* ── CLOSE MOBILE NAV ON LINK ── */
  $('.navbar-nav .nav-link').on('click', function() { $('.navbar-collapse').collapse('hide'); });

});
