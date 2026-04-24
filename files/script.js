document.addEventListener('DOMContentLoaded', () => {

  // ─── Tema ───
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
  }
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
  });

  // ─── Dil ───
  const langToggle = document.getElementById('lang-toggle');
  let currentLang = localStorage.getItem('lang') || 'tr';
  langToggle.textContent = currentLang === 'tr' ? 'EN' : 'TR';

  function updateGreeting() {
    const hour = new Date().getHours();
    let tr = 'Hoşgeldin!', en = 'Welcome!';
    if (hour >= 5 && hour < 12)  { tr = 'Günaydın!';     en = 'Good Morning!'; }
    else if (hour >= 18 && hour < 22) { tr = 'İyi Akşamlar!'; en = 'Good Evening!'; }
    else if (hour >= 22 || hour < 5)  { tr = 'İyi Geceler!';  en = 'Good Night!'; }

    const title = document.querySelector('.page-title');
    if (!title) return;
    title.innerHTML = '';
    (currentLang === 'en' ? en : tr).split('').forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch;
      s.style.animationDelay = `${(i + 1) * 0.1}s`;
      title.appendChild(s);
    });
  }

  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    localStorage.setItem('lang', currentLang);
    langToggle.textContent = currentLang === 'tr' ? 'EN' : 'TR';
    document.title = currentLang === 'tr' ? 'Kaaner4mir' : 'Kaaner4mir | Digital Card';
    updateGreeting();

    document.querySelectorAll('[data-tr]').forEach(el => {
      el.textContent = el.getAttribute(`data-${currentLang}`);
    });
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) sendBtn.textContent = sendBtn.getAttribute(`data-${currentLang}`);
    document.querySelectorAll('[data-tr-title]').forEach(el => {
      el.setAttribute('title', el.getAttribute(`data-${currentLang}-title`));
    });
    document.querySelectorAll('[data-tip-tr]').forEach(el => {
      el.setAttribute('data-current-tip', el.getAttribute(`data-tip-${currentLang}`));
    });
    document.querySelectorAll('[data-tr].profile-bio, [data-tr].form-note').forEach(el => {
      el.textContent = el.getAttribute(`data-${currentLang}`);
    });
    const spotifyLabel = document.querySelector('.spotify-label');
    if (spotifyLabel) spotifyLabel.textContent = currentLang === 'tr' ? 'Şu an dinliyor' : 'Now playing';
    const badges = document.querySelectorAll('.badge-new');
    badges.forEach(b => b.textContent = currentLang === 'tr' ? 'Yeni' : 'New');
  });

  updateGreeting();
  document.querySelectorAll('[data-tip-tr]').forEach(el => {
    el.setAttribute('data-current-tip', el.getAttribute(`data-tip-${currentLang}`));
  });

  // ─── Dropdown ───
  const copyMenuBtn = document.getElementById('copy-menu-btn');
  const dropdown = document.querySelector('.dropdown');
  if (copyMenuBtn && dropdown) {
    copyMenuBtn.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });
    document.querySelectorAll('.dropdown-content a').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const link = item.getAttribute('data-link');
        const fallback = () => {
          const ta = document.createElement('textarea');
          ta.value = link;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        };
        const copy = navigator.clipboard
          ? navigator.clipboard.writeText(link).catch(fallback)
          : Promise.resolve(fallback());
        copy.then ? copy.then(() => {}) : null;
        const orig = item.textContent;
        item.textContent = currentLang === 'tr' ? 'Kopyalandı! ✅' : 'Copied! ✅';
        setTimeout(() => { item.textContent = orig; }, 2000);
      });
    });
    window.addEventListener('click', () => dropdown.classList.remove('active'));
  }

  // ─── Modal yardımcı ───
  function openModal(modal) {
    modal.classList.add('active');
    const focusable = modal.querySelectorAll('button, input, textarea, [tabindex]');
    if (focusable.length) focusable[0].focus();
  }
  function closeModal(modal) {
    modal.classList.remove('active');
  }

  const setupModal = (btnId, modalId, closeSelector) => {
    const btn   = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    if (!btn || !modal) return;
    const closeBtn = modal.querySelector(closeSelector);

    btn.addEventListener('click', e => {
      if (btnId === 'gmail-open') e.preventDefault();
      if (btnId === 'qr-btn') {
        const qrEl = document.getElementById('qr-code-img');
        if (qrEl && !qrEl.querySelector('img')) {
          const url = window.location.href;
          qrEl.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}" alt="QR Code" loading="lazy">`;
        }
      }
      openModal(modal);
    });
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
    window.addEventListener('click', e => { if (e.target === modal) closeModal(modal); });
    window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(modal); });
  };

  setupModal('qr-btn',    'qr-modal',      '.close-modal');
  setupModal('gmail-open','contact-modal', '#close-contact');

  // ─── Contact Form ───
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name    = document.getElementById('form-name').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;
      const link = `mailto:kaaner4mir@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Kimden: ' + name + '\n\n' + message)}`;
      window.location.href = link;
      closeModal(document.getElementById('contact-modal'));
      contactForm.reset();
    });
  }

  // ─── Saat ───
  function updateClock() {
    const el = document.getElementById('current-time');
    if (!el) return;
    const now = new Date();
    el.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ─── Hava Durumu (OpenWeatherMap) ───
async function fetchWeather() {
  // Samsun koordinatları — API key yok!
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=41.2867&longitude=36.33&current=temperature_2m,weathercode&timezone=Europe%2FIstanbul';
  try {
    const res  = await fetch(url);
    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weathercode;

    // WMO hava kodu → emoji
    const icon = code === 0 ? '☀️'
      : code <= 3  ? '⛅'
      : code <= 48 ? '🌫'
      : code <= 67 ? '🌧'
      : code <= 77 ? '❄️'
      : code <= 82 ? '🌦'
      : '⛈';

    document.getElementById('weather-temp').textContent = `${temp}°C`;
    document.getElementById('weather-icon').textContent = icon;
  } catch(e) { /* sessiz hata */ }
}
  fetchWeather();
  setInterval(fetchWeather, 10 * 60 * 1000); // 10 dk'da bir güncelle

  // ─── Spotify Widget ───
  // Not: Spotify'ın "Now Playing" endpoint'i OAuth gerektirir.
  // Basit çözüm: favori şarkılarını burada manuel döngüyle göster,
  // ya da son.fm / ListenBrainz API kullanabilirsin.
  const tracks = [
    'Favori şarkın burada',
    'Başka bir şarkı',
    'Müzik listeni ekle'
  ];
  let trackIdx = 0;
  const trackEl = document.getElementById('spotify-track');
  if (trackEl) {
    trackEl.textContent = tracks[trackIdx];
    setInterval(() => {
      trackIdx = (trackIdx + 1) % tracks.length;
      trackEl.style.opacity = '0';
      setTimeout(() => {
        trackEl.textContent = tracks[trackIdx];
        trackEl.style.transition = 'opacity 0.5s';
        trackEl.style.opacity = '1';
      }, 300);
    }, 6000);
  }

  // ─── GitHub Aktivite Grafiği ───
  async function fetchGitHub() {
    const username = 'Kaaner4mir';
    const graphEl  = document.getElementById('github-graph');
    const countEl  = document.getElementById('github-commits');
    if (!graphEl) return;
    try {
      const res  = await fetch(`https://api.github.com/users/${username}/events/public`);
      const data = await res.json();
      if (!Array.isArray(data)) return;

      // Son 14 günlük commit sayısını hesapla
      const days = {};
      const now  = Date.now();
      data.forEach(ev => {
        if (ev.type !== 'PushEvent') return;
        const d = new Date(ev.created_at);
        const diff = Math.floor((now - d) / 86400000);
        if (diff < 14) days[diff] = (days[diff] || 0) + (ev.payload.commits?.length || 1);
      });

      const max = Math.max(1, ...Object.values(days));
      let total = 0;
      graphEl.innerHTML = '';
      for (let i = 13; i >= 0; i--) {
        const count = days[i] || 0;
        total += count;
        const bar = document.createElement('div');
        bar.className = 'github-bar' + (count > 0 ? ' active' : '');
        bar.style.height = `${Math.max(3, Math.round((count / max) * 28))}px`;
        bar.title = `${count} commit`;
        graphEl.appendChild(bar);
      }
      if (countEl) countEl.textContent = `${total} commit (14g)`;
    } catch(e) { /* sessiz hata */ }
  }
  fetchGitHub();

  // ─── Scroll Reveal (Intersection Observer) ───
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(el);
  });

  // ─── Özel İmleç ───
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring && window.matchMedia('(hover: hover)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });

    // Ring hafif gecikmeli takip (lerp)
    function animateRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Tıklanabilir elementlerde ring büyür
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  // ─── Arkaplan Parçacık Sistemi ───
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r  = Math.random() * 1.8 + 0.5;
        this.a  = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.a})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    // Parçacıklar arası bağlantı çizgisi
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - dist/100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ─── Profil görseli hata yönetimi ───
  const profileImg = document.getElementById('profile-img');
  const profileFallback = document.getElementById('profile-fallback');
  if (profileImg && profileFallback) {
    profileImg.addEventListener('error', () => {
      profileImg.style.display = 'none';
      profileFallback.style.display = 'flex';
    });
  }

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      document.querySelectorAll('.container a').forEach(link => link.blur());
    }
  });

});
