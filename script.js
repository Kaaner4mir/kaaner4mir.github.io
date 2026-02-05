document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });

    const langToggle = document.getElementById('lang-toggle');
    let currentLang = 'tr';

    function updateGreeting() {
        const hour = new Date().getHours();
        let greetingTr = 'Hoşgeldin!';
        let greetingEn = 'Welcome!';

        if (hour >= 5 && hour < 12) {
            greetingTr = 'Günaydın!';
            greetingEn = 'Good Morning!';
        } else if (hour >= 18 && hour < 22) {
            greetingTr = 'İyi Akşamlar!';
            greetingEn = 'Good Evening!';
        } else if (hour >= 22 || hour < 5) {
            greetingTr = 'İyi Geceler!';
            greetingEn = 'Good Night!';
        }

        const newTitle = currentLang === 'en' ? greetingEn : greetingTr;
        const titleContainer = document.querySelector('.page-title');

        if (titleContainer) {
            titleContainer.innerHTML = '';
            newTitle.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.animationDelay = `${(index + 1) * 0.1}s`;
                titleContainer.appendChild(span);
            });
        }
    }

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'tr' ? 'en' : 'tr';
        langToggle.textContent = currentLang === 'tr' ? 'EN' : 'TR';

        updateGreeting();

        document.querySelectorAll('.modal-content h2').forEach(h2 => {
            if (h2.hasAttribute(`data-${currentLang}`)) {
                h2.textContent = h2.getAttribute(`data-${currentLang}`);
            }
        });

        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) {
            sendBtn.textContent = sendBtn.getAttribute(`data-${currentLang}`);
        }

        document.querySelectorAll('[data-tr-title]').forEach(el => {
            el.setAttribute('title', el.getAttribute(`data-${currentLang}-title`));
        });

        document.querySelectorAll('[data-tip-tr]').forEach(el => {
            el.setAttribute('data-current-tip', el.getAttribute(`data-tip-${currentLang}`));
        });
    });

    updateGreeting();

    const copyMenuBtn = document.getElementById('copy-menu-btn');
    const dropdown = document.querySelector('.dropdown');

    if (copyMenuBtn && dropdown) {
        copyMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        document.querySelectorAll('.dropdown-content a').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const link = item.getAttribute('data-link');
                navigator.clipboard.writeText(link).then(() => {
                    const originalText = item.textContent;
                    item.textContent = currentLang === 'tr' ? 'Kopyalandı! ✅' : 'Copied! ✅';
                    setTimeout(() => { item.textContent = originalText; }, 2000);
                });
            });
        });

        window.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });
    }

    const setupModal = (btnId, modalId, closeClass) => {
        const btn = document.getElementById(btnId);
        const modal = document.getElementById(modalId);
        const closeBtn = modal ? modal.querySelector(closeClass) : null;

        if (btn && modal) {
            btn.addEventListener('click', (e) => {
                if (btnId === 'gmail-open') e.preventDefault();

                if (btnId === 'qr-btn') {
                    const qrContainer = document.getElementById('qr-code-img');
                    const siteUrl = window.location.href;
                    if (qrContainer) {
                        qrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(siteUrl)}" alt="QR Code">`;
                    }
                }

                modal.classList.add('active');
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', () => modal.classList.remove('active'));
            }

            window.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }
    };

    setupModal('qr-btn', 'qr-modal', '.close-modal');
    setupModal('gmail-open', 'contact-modal', '.close-modal');

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            const mailtoLink = `mailto:kaaner4mir@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Kimden: " + name + "\n\n" + message)}`;
            window.location.href = mailtoLink;
            document.getElementById('contact-modal').classList.remove('active');
            contactForm.reset();
        });
    }

    function updateClock() {
        const clockEl = document.getElementById('current-time');
        if (clockEl) {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            clockEl.textContent = `${h}:${m}`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    document.querySelectorAll('[data-tip-tr]').forEach(el => {
        el.setAttribute('data-current-tip', el.getAttribute(`data-tip-${currentLang}`));
    });

    const dot = document.querySelector('.cursor-dot');
    if (dot) {
        window.addEventListener('mousemove', (e) => {
            dot.style.left = `${e.clientX}px`;
            dot.style.top = `${e.clientY}px`;
        });
    }

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.querySelectorAll('.container a').forEach(link => link.blur());
        }
    });
});
