/* ─── CMS Content Renderer ──────────────────────────────────── */
(function applyContent() {
  if (typeof window.SITE_CONTENT === 'undefined') return;
  var C = window.SITE_CONTENT;

  function setText(id, val) {
    var el = document.getElementById(id);
    if (el && val !== undefined) el.textContent = val;
  }
  function setHTML(id, val) {
    var el = document.getElementById(id);
    if (el && val !== undefined) el.innerHTML = val;
  }
  function setSrc(id, val) {
    var el = document.getElementById(id);
    if (el && val) el.src = val;
  }
  function setHref(id, val) {
    var el = document.getElementById(id);
    if (el && val) el.href = val;
  }

  // Meta
  if (C.meta) {
    document.title = C.meta.title || document.title;
    var md = document.getElementById('cms-meta-desc');
    if (md) md.content = C.meta.description || md.content;
  }

  // Hero
  if (C.hero) {
    setText('cms-hero-title', C.hero.title);
    setText('cms-hero-subtitle', C.hero.subtitle);
    if (C.hero.image1) setSrc('cms-hero-img1', C.hero.image1.src);
    if (C.hero.image2) setSrc('cms-hero-img2', C.hero.image2.src);
  }

  // About
  if (C.about) {
    var a = C.about;
    if (a.intro) {
      setHTML('cms-about-intro-heading', a.intro.heading);
      setText('cms-about-intro-body', a.intro.body);
      if (a.intro.image) setSrc('cms-about-intro-img', a.intro.image.src);
    }
    if (a.characteristics) {
      setHTML('cms-about-char-heading', a.characteristics.heading);
      setText('cms-about-char-body1', a.characteristics.body1);
      setText('cms-about-char-body2', a.characteristics.body2);
      if (a.characteristics.smallImage) setSrc('cms-about-char-small', a.characteristics.smallImage.src);
      if (a.characteristics.mainImage)  setSrc('cms-about-char-main', a.characteristics.mainImage.src);
    }
    if (a.banner) {
      if (a.banner.image) setSrc('cms-banner-img', a.banner.image.src);
      setHTML('cms-banner-text', a.banner.text);
    }
    if (a.modern) {
      setHTML('cms-about-modern-heading', a.modern.heading);
      setText('cms-about-modern-body1', a.modern.body1);
      setText('cms-about-modern-body2', a.modern.body2);
      if (a.modern.image) setSrc('cms-about-modern-img', a.modern.image.src);
    }
    if (a.world) {
      setHTML('cms-about-world-heading', a.world.heading);
      setText('cms-about-world-body', a.world.body);
      if (a.world.image) setSrc('cms-about-world-img', a.world.image.src);
    }
    if (a.map) {
      setHTML('cms-about-map-heading', a.map.heading);
      setText('cms-about-map-body1', a.map.body1);
      setText('cms-about-map-body2', a.map.body2);
      if (a.map.image) setSrc('cms-about-map-img', a.map.image.src);
    }
    if (a.education) {
      setHTML('cms-about-edu-heading', a.education.heading);
      setText('cms-about-edu-body1', a.education.body1);
      setText('cms-about-edu-body2', a.education.body2);
      if (a.education.image1) setSrc('cms-about-edu-img1', a.education.image1.src);
      if (a.education.image2) setSrc('cms-about-edu-img2', a.education.image2.src);
    }
  }

  // Gallery — re-render from data
  if (C.gallery && C.gallery.length) {
    var gg = document.getElementById('cms-gallery-grid');
    if (gg) {
      gg.innerHTML = C.gallery.map(function(item, i) {
        return '<div class="gallery-item fade-in ' + (item.span || '') + '">' +
          '<img src="' + item.src + '" alt="' + item.alt + '" loading="lazy">' +
          '<div class="gallery-overlay"><span>' + item.caption + '</span></div>' +
        '</div>';
      }).join('');
    }
  }

  // Events — re-render from data
  if (C.events && C.events.length) {
    var el = document.getElementById('cms-events-list');
    if (el) {
      el.innerHTML = C.events.map(function(ev, i) {
        return '<div class="event-item fade-in">' +
          '<div class="event-date-block">' +
            '<span class="event-month">' + ev.month + '</span>' +
            '<span class="event-day">' + ev.day + '</span>' +
          '</div>' +
          '<div class="event-details">' +
            '<h3 class="event-title">' + ev.title + '</h3>' +
            '<p class="event-meta"><span class="event-venue">' + ev.venue + '</span> &mdash; ' + ev.city + '</p>' +
          '</div>' +
          '<a href="' + ev.ticketUrl + '" target="_blank" rel="noopener noreferrer" class="event-btn" id="event-btn-' + (i+1) + '">Tickets &amp; Info</a>' +
        '</div>';
      }).join('');
    }
  }

  // Blog — re-render from data
  if (C.blog && C.blog.length) {
    var bg = document.getElementById('cms-blog-grid');
    if (bg) {
      bg.innerHTML = C.blog.map(function(post, i) {
        return '<article class="blog-card fade-in" id="blog-card-' + (i+1) + '">' +
          '<div class="blog-img-wrap">' +
            '<img src="' + post.image.src + '" alt="' + post.image.alt + '" loading="lazy">' +
            '<span class="blog-tag">' + post.tag + '</span>' +
          '</div>' +
          '<div class="blog-body">' +
            '<p class="blog-date">' + post.date + '</p>' +
            '<h3>' + post.title + '</h3>' +
            '<p>' + post.body + '</p>' +
            '<a href="#contact" class="blog-read-more">Read More <span aria-hidden="true">\u2192</span></a>' +
          '</div>' +
        '</article>';
      }).join('');
    }
  }

  // Contact
  if (C.contact) {
    var ct = C.contact;
    setText('cms-contact-label', ct.sectionLabel);
    setText('cms-contact-heading', ct.heading);
    setText('cms-contact-subheading', ct.subheading);
    setText('cms-contact-intro', ct.intro);
    setText('cms-contact-linq-intro', ct.linqIntro);
    setText('cms-contact-linq-text', ct.linqText);
    setHref('cms-contact-linq-url', ct.linqUrl);
    if (ct.photo) setSrc('cms-contact-photo', ct.photo.src);
  }

  // Footer
  if (C.footer) {
    setText('cms-footer-thankyou', C.footer.thankYou);
    setText('cms-footer-subtext', C.footer.subtext);
    setText('cms-footer-credits', C.footer.credits);
    setText('cms-footer-booking-text', C.footer.bookingLinkText);
    setHref('cms-footer-booking-url', C.footer.bookingUrl);
  }

  // Theme CSS variables
  if (C.theme) {
    var r = document.documentElement.style;
    if (C.theme.gold)      r.setProperty('--gold',      C.theme.gold);
    if (C.theme.goldMuted) r.setProperty('--gold-muted', C.theme.goldMuted);
    if (C.theme.bg)        r.setProperty('--bg-color',   C.theme.bg);
    if (C.theme.bg2)       r.setProperty('--bg-2',       C.theme.bg2);
    if (C.theme.text)      r.setProperty('--text-color', C.theme.text);
    if (C.theme.textMuted) r.setProperty('--text-muted', C.theme.textMuted);
  }
}());

/* ─── Main Site JS ──────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {

    // ─── Intersection Observer (fade-in) ───────────────────────────
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.12 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ─── Sticky Nav – background on scroll ─────────────────────────
    const nav = document.getElementById('site-nav');

    function updateNav() {
        if (window.scrollY > 40) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    // ─── Active nav link on scroll ─────────────────────────────────
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks  = document.querySelectorAll('.nav-link[data-section]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.dataset.section === entry.target.id
                    );
                });
            }
        });
    }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    sections.forEach(s => sectionObserver.observe(s));

    // ─── Smooth scroll for all anchor links ────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const navH = nav ? nav.offsetHeight : 72;
            const top  = target.getBoundingClientRect().top + window.scrollY - navH;
            window.scrollTo({ top, behavior: 'smooth' });

            // close mobile menu if open
            navLinks_el.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // ─── Mobile hamburger menu ──────────────────────────────────────
    const toggleBtn  = document.getElementById('nav-toggle');
    const navLinks_el = document.getElementById('nav-links');

    toggleBtn.addEventListener('click', () => {
        const isOpen = navLinks_el.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // ─── Contact form – demo submit ────────────────────────────────
    const form    = document.getElementById('booking-form');
    const success = document.getElementById('form-success');
    const submitBtn = document.getElementById('form-submit-btn');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            // Basic validation
            const required = form.querySelectorAll('[required]');
            let valid = true;
            required.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#c0392b';
                    valid = false;
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!valid) return;

            // Simulate send
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'Sending…';

            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = 'Send Inquiry';
                success.removeAttribute('hidden');
                success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 1200);
        });

        // Clear red border on input
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => { field.style.borderColor = ''; });
        });
    }

});

