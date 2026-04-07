// === SHARED COMPONENTS ===
// Nav, footer, and common page scripts.
// Each page includes <script src="shared.js"></script> at the end of <body>.

(function () {

    // --- NAV ---
    const pathParts = location.pathname.split('/').filter(Boolean);
    const page = pathParts.pop() || 'index.html';
    const lastDir = pathParts.length > 0 ? pathParts[pathParts.length - 1] : '';
    const inSubdir = lastDir === 'projects' || lastDir === 'writing';

    const navLinks = [
        { href: 'index.html', label: 'Home' },
        { href: 'projects.html', label: 'Projects' },
        { href: 'how-it-works.html', label: 'How It Works' },
        { href: 'pricing.html', label: 'Pricing' },
        { href: 'about.html', label: 'About' },
        { href: 'qa.html', label: 'Q&A' },
        { href: 'writing.html', label: 'Writing' },
    ];

    const navEl = document.getElementById('nav');
    if (navEl) {
        const isHome = (page === 'index.html' || page === '') && !inSubdir;
        const logoHref = isHome ? '#' : 'index.html';

        navEl.innerHTML = `
            <a href="${logoHref}" class="nav-logo"><span class="prefix">/</span>RedSlash</a>
            <button class="nav-hamburger" aria-label="Menu">
                <span></span><span></span><span></span>
            </button>
            <div class="nav-links">
                ${navLinks.map(l => {
                    const isCurrent = l.href === page || (lastDir === 'projects' && l.href === 'projects.html') || (lastDir === 'writing' && l.href === 'writing.html');
                    return `<a href="${l.href}"${isCurrent ? ' class="nav-current"' : ''}>${l.label}</a>`;
                }).join('\n                ')}
                <a href="#contact" class="nav-cta">Get in Touch</a>
            </div>
        `;

        // Hamburger menu
        const hamburger = navEl.querySelector('.nav-hamburger');
        const links = navEl.querySelector('.nav-links');
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('open');
                links.classList.toggle('open');
            });
            links.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => {
                    hamburger.classList.remove('open');
                    links.classList.remove('open');
                });
            });
        }

        // Scroll effect
        window.addEventListener('scroll', () => {
            navEl.classList.toggle('scrolled', window.scrollY > 60);
        });
    }

    // --- FOOTER ---
    const footerEl = document.querySelector('footer');
    if (footerEl && !footerEl.children.length) {
        footerEl.innerHTML = `
            <div class="footer-left">
                <span class="footer-logo"><span class="prefix">/</span>RedSlash</span>
            </div>
            <div class="footer-right">
                <div class="footer-links">
                    <a href="privacy.html">Privacy Policy</a>
                    <a href="terms.html">Terms</a>
                    <a href="company.html">Company Details</a>
                </div>
                <span class="footer-copy">&copy; 2026 Red Slash Studio Limited</span>
            </div>
        `;
    }

    // --- CONTACT SECTION ---
    const contactEl = document.querySelector('.contact[data-heading]');
    if (contactEl && !contactEl.children.length) {
        const heading = contactEl.dataset.heading || 'Get in touch.';
        const sub = contactEl.dataset.sub || 'No pitch. No commitment. Just a conversation about where you are and what could be different.';
        contactEl.innerHTML = `
            <div class="contact-inner">
                <p class="section-label reveal">Get in Touch</p>
                <h2 class="reveal">${heading}</h2>
                <p class="contact-sub reveal">${sub}</p>
                <a href="mailto:hello@redslashstudio.com" class="contact-email reveal">hello@redslashstudio.com</a>
                <p class="contact-or reveal">or</p>
                <form class="contact-form reveal" id="contact-form" action="https://formspree.io/f/mwvwedqe" method="POST">
                    <div class="form-group">
                        <label for="name">Your Name</label>
                        <input type="text" id="name" name="name" placeholder="Tom Richardson">
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="tom@example.com">
                    </div>
                    <div class="form-group">
                        <label for="message">What does your business do?</label>
                        <textarea id="message" name="message" placeholder="Tell me a bit about your business and what you're looking for..."></textarea>
                    </div>
                    <button type="submit" class="form-submit">Send Message <span class="arrow">&rarr;</span></button>
                </form>
            </div>
        `;
    }

    // --- SCROLL REVEAL ---
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });
        reveals.forEach(el => observer.observe(el));
    }

    // --- STAGGERED CARD REVEAL ---
    document.querySelectorAll('.stagger-reveal').forEach(grid => {
        const cards = grid.querySelectorAll('.reveal');
        if (!cards.length) return;
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                    siblings.forEach((card, i) => {
                        setTimeout(() => card.classList.add('visible'), i * 150);
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        staggerObserver.observe(cards[0]);
    });

    // --- FORM SUBMISSION ---
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.form-submit');
            btn.textContent = 'Sending...';
            btn.disabled = true;
            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    btn.textContent = 'Sent \u2713';
                    btn.style.background = 'var(--border)';
                    form.reset();
                } else {
                    btn.textContent = 'Something went wrong \u2014 try emailing instead';
                    btn.style.background = 'var(--border)';
                }
            } catch {
                btn.textContent = 'Something went wrong \u2014 try emailing instead';
                btn.style.background = 'var(--border)';
            }
        });
    }

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
