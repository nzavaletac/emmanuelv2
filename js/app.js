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
    { id:1, cat:'obras-civiles',  title:'Centro Logístico Lurín',        tag:'Obras Civiles', area:'12,500 m²', loc:'Lurín, Lima',      imgs:['img/centrologistico.jpg','img/banner1.jpg','img/banner2.webp','img/banner3.jpg','img/banner4.jpg'], client:'Ransa',            clientLogo:'img/lgp.png',              year:'2024', duration:'8 meses',  desc:'Construcción integral de nave logística con losa industrial de alta resistencia, sistemas contraincendios y oficinas administrativas. Ejecución con tolerancias milimétricas y entrega anticipada.' },
    { id:2, cat:'demoliciones',   title:'Demolición Edificio San Isidro', tag:'Demoliciones',  area:'8,000 m²',  loc:'San Isidro, Lima', imgs:['img/demolicion.jpg','img/banner2.webp','img/banner3.jpg','img/banner4.jpg','img/banner1.jpg'], client:'Pacífico Seguros', clientLogo:'img/menorca.png',          year:'2024', duration:'4 meses',  desc:'Demolición controlada de edificio de 8 pisos en zona urbana de alta densidad. Gestión de residuos certificada y cero incidentes de seguridad durante toda la ejecución.' },
    { id:3, cat:'pavimentacion',  title:'Pavimentación Av. Industrial',   tag:'Pavimentación', area:'3.2 km',    loc:'Lima Norte',       imgs:['img/pavimentacion.jpg','img/banner3.jpg','img/banner4.jpg','img/banner1.jpg','img/banner2.webp'], client:'Municipalidad',    clientLogo:'img/alegra.png',           year:'2023', duration:'6 meses',  desc:'Pavimentación de avenida industrial de 3.2 km con asfalto de alta resistencia, señalización horizontal y drenaje pluvial. Obra ejecutada sin corte de tráfico.' },
    { id:4, cat:'acabados',       title:'Residencial Los Olivos',         tag:'Acabados',      area:'120 dptos', loc:'Los Olivos',       imgs:['img/residencial.jpg','img/banner4.jpg','img/banner1.jpg','img/banner2.webp','img/banner3.jpg'], client:'Grupo Inmobil',    clientLogo:'img/los portales.png',     year:'2023', duration:'10 meses', desc:'Acabados arquitectónicos completos para 120 departamentos: pisos, pintura, carpintería metálica y vidriería. Entrega a tiempo con índice de satisfacción del 98%.' },
    { id:5, cat:'obras-civiles',  title:'Planta Industrial Callao',       tag:'Obras Civiles', area:'15,000 m²', loc:'Callao',           imgs:['img/planta.jpg','img/banner1.jpg','img/banner2.webp','img/banner3.jpg','img/banner4.jpg'], client:'Gloria S.A.',      clientLogo:'img/marverde.png',         year:'2023', duration:'12 meses', desc:'Construcción de planta industrial con cimentaciones especiales, estructura metálica, losa de alta resistencia y sistemas MEP completos.' },
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
    if (p.clientLogo) {
      $('#pm-client-logo').attr({ src: p.clientLogo, alt: p.client });
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
    const filtered = filter === 'all' ? window.projects : window.projects.filter(p => p.cat === filter);
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
