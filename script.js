/* ─── CMS Content Renderer ──────────────────────────────────── */
(function applyContent() {
  if (typeof window.SITE_CONTENT === "undefined") return;
  var C = window.SITE_CONTENT;

  function injectVideo(parent, url) {
    if (!url || !parent) return;
    var vidId = "";
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      vidId = url.split("v=")[1] || url.split("/").pop();
      if (vidId.includes("&")) vidId = vidId.split("&")[0];
      parent.innerHTML =
        '<iframe width="100%" height="450" src="https://www.youtube.com/embed/' +
        vidId +
        '" frameborder="0" allowfullscreen style="border-radius:var(--radius)"></iframe>';
    } else if (url.includes("vimeo.com")) {
      vidId = url.split("/").pop();
      parent.innerHTML =
        '<iframe src="https://player.vimeo.com/video/' +
        vidId +
        '" width="100%" height="450" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="border-radius:var(--radius)"></iframe>';
    }
  }

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
  function setAttr(id, attr, val) {
    var el = document.getElementById(id);
    if (el && val) el.setAttribute(attr, val);
  }
  /* Apply src + optional display settings from an image object */
  function applyImg(id, imgObj) {
    if (!imgObj) return;
    var el = document.getElementById(id);
    if (!el) return;
    if (imgObj.src) el.src = imgObj.src;
    if (imgObj.objectFit) el.style.objectFit = imgObj.objectFit;
    if (imgObj.objectPosition) el.style.objectPosition = imgObj.objectPosition;
    if (imgObj.displayWidth) {
      var wrap = el.closest(".section-images") || el.parentElement;
      if (wrap) wrap.style.maxWidth = imgObj.displayWidth + "%";
    }
  }

  // Meta
  if (C.meta) {
    document.title = C.meta.title || document.title;
    var md = document.getElementById("cms-meta-desc");
    if (md) md.content = C.meta.description || md.content;

    // SEO Tags
    if (C.seo) {
      if (C.seo.ogTitle) setAttr("og-title", "content", C.seo.ogTitle);
      if (C.seo.ogDescription)
        setAttr("og-desc", "content", C.seo.ogDescription);
      if (C.seo.ogImage) setAttr("og-img", "content", C.seo.ogImage);
    }

    // Custom CSS
    var customCss = document.getElementById("cms-custom-css");
    if (customCss) customCss.innerHTML = C.meta.customCss || "";

    // Google Analytics
    var gaScript = document.getElementById("cms-ga");
    if (gaScript && C.meta.googleAnalyticsId) {
      gaScript.src =
        "https://www.googletagmanager.com/gtag/js?id=" +
        C.meta.googleAnalyticsId;
      var gaInjected = document.getElementById("cms-ga-init");
      if (!gaInjected) {
        var s = document.createElement("script");
        s.id = "cms-ga-init";
        s.innerHTML =
          "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '" +
          C.meta.googleAnalyticsId +
          "');";
        document.head.appendChild(s);
      }
    }
  }

  // Social Links
  if (C.socials) {
    var s = C.socials;
    var navSoc = document.getElementById("cms-nav-socials");
    var footSoc = document.getElementById("cms-footer-socials");
    var html = "";
    if (s.instagram)
      html +=
        '<a href="' +
        s.instagram +
        '" class="social-link" target="_blank" aria-label="Instagram">IG</a>';
    if (s.facebook)
      html +=
        '<a href="' +
        s.facebook +
        '" class="social-link" target="_blank" aria-label="Facebook">FB</a>';
    if (s.youtube)
      html +=
        '<a href="' +
        s.youtube +
        '" class="social-link" target="_blank" aria-label="YouTube">YT</a>';
    if (s.twitter)
      html +=
        '<a href="' +
        s.twitter +
        '" class="social-link" target="_blank" aria-label="Twitter">TW</a>';
    if (navSoc) navSoc.innerHTML = html;
    if (footSoc) footSoc.innerHTML = html;
  }

  // Navigation & Section Visibility
  if (C.navigation) {
    var navLinks = document.getElementById("nav-links");
    var footNav = document.getElementById("footer-nav");
    var navHtml = "";
    var footHtml = "";

    C.navigation.forEach(function (item) {
      var isVisible = true;
      if (item.section && C.sections && C.sections[item.section]) {
        isVisible = C.sections[item.section].visible !== false;
      }

      if (isVisible) {
        var cls = item.isCta ? "nav-link nav-cta" : "nav-link";
        navHtml +=
          '<li><a href="' +
          item.url +
          '" class="' +
          cls +
          '" data-section="' +
          (item.section || "") +
          '">' +
          item.label +
          "</a></li>";
        footHtml +=
          '<a href="' +
          item.url +
          '" data-section="' +
          (item.section || "") +
          '">' +
          item.label +
          "</a>";
      }

      // Hide actual section if hidden
      if (item.section && C.sections && C.sections[item.section]) {
        var secEl = document.getElementById(
          item.section === "about" ? "cms-section-about" : item.section,
        );
        if (secEl) {
          if (C.sections[item.section].visible === false)
            secEl.classList.add("cms-hidden-section");
          else secEl.classList.remove("cms-hidden-section");
        }
      }
    });

    if (navLinks) navLinks.innerHTML = navHtml;
    if (footNav) footNav.innerHTML = footHtml;
  }

  // Hero
  if (C.hero) {
    setText("cms-hero-title", C.hero.title);
    setText("cms-hero-subtitle", C.hero.subtitle);

    var slideContainer = document.getElementById("cms-hero-slides");
    if (slideContainer && C.hero.images) {
      slideContainer.innerHTML = C.hero.images
        .map(function (img, i) {
          return (
            '<div class="hero-slide' +
            (i === 0 ? " active" : "") +
            '" style="background-image: url(\'' +
            img.src +
            "')\"></div>"
          );
        })
        .join("");

      // Auto-carousel
      if (C.hero.images.length > 1) {
        if (window._heroInterval) clearInterval(window._heroInterval);
        var currentSlide = 0;
        window._heroInterval = setInterval(function () {
          var slides = slideContainer.querySelectorAll(".hero-slide");
          if (slides.length === 0) return;
          slides[currentSlide].classList.remove("active");
          currentSlide = (currentSlide + 1) % slides.length;
          slides[currentSlide].classList.add("active");
        }, 5000);
      }
    }
  }

  // About
  if (C.about) {
    var a = C.about;
    if (a.intro) {
      setHTML("cms-about-intro-heading", a.intro.heading);
      setText("cms-about-intro-body", a.intro.body);
      if (a.intro.image) applyImg("cms-about-intro-img", a.intro.image);
    }
    if (a.characteristics) {
      setHTML("cms-about-char-heading", a.characteristics.heading);
      setText("cms-about-char-body1", a.characteristics.body1);
      setText("cms-about-char-body2", a.characteristics.body2);
      if (a.characteristics.smallImage)
        applyImg("cms-about-char-small", a.characteristics.smallImage);
      if (a.characteristics.mainImage)
        applyImg("cms-about-char-main", a.characteristics.mainImage);

      // Video check
      if (a.characteristics.videoUrl) {
        var mn = document.getElementById("cms-about-char-main");
        if (mn) injectVideo(mn.parentElement, a.characteristics.videoUrl);
      }
    }
    if (a.banner) {
      if (a.banner.image) applyImg("cms-banner-img", a.banner.image);
      setHTML("cms-banner-text", a.banner.text);
    }
    if (a.modern) {
      setHTML("cms-about-modern-heading", a.modern.heading);
      setText("cms-about-modern-body1", a.modern.body1);
      setText("cms-about-modern-body2", a.modern.body2);
      if (a.modern.image) applyImg("cms-about-modern-img", a.modern.image);
    }
    if (a.world) {
      setHTML("cms-about-world-heading", a.world.heading);
      setText("cms-about-world-body", a.world.body);
      if (a.world.image) applyImg("cms-about-world-img", a.world.image);
    }
    if (a.map) {
      setHTML("cms-about-map-heading", a.map.heading);
      setText("cms-about-map-body1", a.map.body1);
      setText("cms-about-map-body2", a.map.body2);
      if (a.map.image) applyImg("cms-about-map-img", a.map.image);
    }
    if (a.education) {
      setHTML("cms-about-edu-heading", a.education.heading);
      setText("cms-about-edu-body1", a.education.body1);
      setText("cms-about-edu-body2", a.education.body2);
      if (a.education.image1)
        applyImg("cms-about-edu-img1", a.education.image1);
      if (a.education.image2)
        applyImg("cms-about-edu-img2", a.education.image2);
    }
  }

  // Gallery — re-render from data
  if (C.gallery && C.gallery.length) {
    var gg = document.getElementById("cms-gallery-grid");
    if (gg) {
      gg.innerHTML = C.gallery
        .map(function (item, i) {
          return (
            '<div class="gallery-item fade-in ' +
            (item.span || "") +
            '">' +
            '<img src="' +
            item.src +
            '" alt="' +
            item.alt +
            '" loading="lazy">' +
            '<div class="gallery-overlay"><span>' +
            item.caption +
            "</span></div>" +
            "</div>"
          );
        })
        .join("");
    }
  }

  // Blog rendering
  if (C.blog && C.blog.length) {
    var blogGrid = document.getElementById("cms-blog-grid");
    if (blogGrid) {
      blogGrid.innerHTML = C.blog
        .map(function (post, i) {
          return (
            '<article class="blog-card fade-in" data-post-idx="' +
            i +
            '">' +
            '<div class="blog-img-wrap">' +
            '<img src="' +
            post.image.src +
            '" alt="' +
            post.image.alt +
            '" loading="lazy">' +
            '<span class="blog-tag">' +
            post.tag +
            "</span>" +
            "</div>" +
            '<div class="blog-body">' +
            '<p class="blog-date">' +
            post.date +
            "</p>" +
            "<h3>" +
            post.title +
            "</h3>" +
            "<p>" +
            post.body +
            "</p>" +
            '<button class="blog-read-more">Read More <span>→</span></button>' +
            "</div>" +
            "</article>"
          );
        })
        .join("");

      // Wire up clicks to open blog modal
      blogGrid.querySelectorAll(".blog-card").forEach(function (card) {
        card.onclick = function () {
          openBlogPost(parseInt(card.dataset.postIdx));
        };
      });
    }
  }

  // Press Kit rendering
  if (C.pressKit) {
    setText("cms-epk-bio", C.pressKit.bio);
    var assetList = document.getElementById("cms-epk-assets");
    if (assetList) {
      assetList.innerHTML = (C.pressKit.assets || [])
        .map(function (a) {
          return (
            "<li>" +
            a.label +
            ' <a href="' +
            a.url +
            '" target="_blank" class="gold-text">Download</a></li>'
          );
        })
        .join("");
    }
  }

  // Events — re-render from data
  if (C.events && C.events.length) {
    var el = document.getElementById("cms-events-list");
    if (el) {
      el.innerHTML = C.events
        .map(function (ev, i) {
          return (
            '<div class="event-item fade-in">' +
            '<div class="event-date-block">' +
            '<span class="event-month">' +
            ev.month +
            "</span>" +
            '<span class="event-day">' +
            ev.day +
            "</span>" +
            "</div>" +
            '<div class="event-details">' +
            '<h3 class="event-title">' +
            ev.title +
            "</h3>" +
            '<p class="event-meta"><span class="event-venue">' +
            ev.venue +
            "</span> &mdash; " +
            ev.city +
            "</p>" +
            "</div>" +
            '<a href="' +
            ev.ticketUrl +
            '" target="_blank" rel="noopener noreferrer" class="event-btn" id="event-btn-' +
            (i + 1) +
            '">Tickets &amp; Info</a>' +
            "</div>"
          );
        })
        .join("");
    }
  }

  // Contact
  if (C.contact) {
    var ct = C.contact;
    setText("cms-contact-label", ct.sectionLabel);
    setText("cms-contact-heading", ct.heading);
    setText("cms-contact-subheading", ct.subheading);
    setText("cms-contact-intro", ct.intro);
    setText("cms-contact-linq-intro", ct.linqIntro);
    setText("cms-contact-linq-text", ct.linqText);
    setHref("cms-contact-linq-url", ct.linqUrl);
    if (ct.photo) applyImg("cms-contact-photo", ct.photo);
  }

  // Footer
  if (C.footer) {
    setText("cms-footer-thankyou", C.footer.thankYou);
    setText("cms-footer-subtext", C.footer.subtext);
    setText("cms-footer-credits", C.footer.credits);
    setText("cms-footer-booking-text", C.footer.bookingLinkText);
    setHref("cms-footer-booking-url", C.footer.bookingUrl);
  }

  // Testimonials
  if (C.testimonials) {
    var tList = document.getElementById("cms-testimonials-list");
    if (tList) {
      tList.innerHTML = C.testimonials
        .map(function (t) {
          return (
            '<div class="testimonial-card fade-in">' +
            '<div class="testimonial-stars">' +
            "★".repeat(t.stars) +
            "</div>" +
            '<div class="testimonial-quote">' +
            t.quote +
            "</div>" +
            '<div class="testimonial-name">' +
            t.name +
            "</div>" +
            "</div>"
          );
        })
        .join("");
    }
  }

  // Newsletter
  if (C.newsletter) {
    var h = document.getElementById("cms-newsletter-heading");
    var b = document.getElementById("cms-newsletter-body");
    var btn = document.getElementById("cms-newsletter-btn");
    var container = document.getElementById("cms-newsletter-container");
    if (h) h.textContent = C.newsletter.heading || "";
    if (b) b.textContent = C.newsletter.body || "";
    if (btn) btn.textContent = C.newsletter.buttonText || "";
    if (container && C.newsletter.embedCode) {
      container.innerHTML = C.newsletter.embedCode;
    }
  }

  // Theme CSS variables
  if (C.theme) {
    var r = document.documentElement.style;
    if (C.theme.gold) r.setProperty("--gold", C.theme.gold);
    if (C.theme.goldMuted) r.setProperty("--gold-muted", C.theme.goldMuted);
    if (C.theme.bg) r.setProperty("--bg-color", C.theme.bg);
    if (C.theme.bg2) r.setProperty("--bg-2", C.theme.bg2);
    if (C.theme.text) r.setProperty("--text-color", C.theme.text);
    if (C.theme.textMuted) r.setProperty("--text-muted", C.theme.textMuted);
  }

  /* ── Sprint 5: Routing & Modals ──────────────── */
  function handleHash() {
    var hash = window.location.hash;
    if (hash === "#/press-kit") openEPK();
    else closeAllOverlays();
  }
  window.addEventListener("hashchange", handleHash);
  handleHash();

  function openEPK() {
    var overlay = document.getElementById("press-kit-overlay");
    if (!overlay) return;
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    var isProtected =
      window.SITE_CONTENT.pressKit && window.SITE_CONTENT.pressKit.protected;
    if (!isProtected || window._epkUnlocked) {
      showEPKContent();
    } else {
      showEPKLock();
    }
  }

  function showEPKLock() {
    document.getElementById("epk-lock").classList.remove("hidden");
    document.getElementById("epk-content").classList.add("hidden");
  }

  function showEPKContent() {
    document.getElementById("epk-lock").classList.add("hidden");
    document.getElementById("epk-content").classList.remove("hidden");
  }

  document.getElementById("epk-unlock-btn").onclick = function () {
    var pass = document.getElementById("epk-pass").value;
    if (pass === window.SITE_CONTENT.pressKit.password) {
      window._epkUnlocked = true;
      showEPKContent();
    } else {
      alert("Incorrect password");
    }
  };

  function openBlogPost(idx) {
    var post = window.SITE_CONTENT.blog[idx];
    if (!post) return;
    document.getElementById("cms-full-blog-date").textContent = post.date;
    document.getElementById("cms-full-blog-title").textContent = post.title;
    document.getElementById("cms-full-blog-img").src = post.image.src;
    document.getElementById("cms-full-blog-content").innerHTML =
      post.content || post.body;

    document.getElementById("blog-modal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeAllOverlays() {
    document.querySelectorAll(".sub-page-overlay").forEach(function (o) {
      o.classList.add("hidden");
    });
    document.body.style.overflow = "";
    if (window.location.hash.startsWith("#/")) {
      history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search,
      );
    }
  }

  document.getElementById("close-epk").onclick = closeAllOverlays;
  document.getElementById("close-blog").onclick = closeAllOverlays;

  // Close on backdrop click
  document.querySelectorAll(".sub-page-overlay").forEach(function (o) {
    o.onclick = function (e) {
      if (e.target === o) closeAllOverlays();
    };
  });
})();

/* ─── Main Site JS ──────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  // ─── Intersection Observer (fade-in) ───────────────────────────
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: "0px", threshold: 0.12 },
  );

  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

  // ─── Sticky Nav – background on scroll ─────────────────────────
  const nav = document.getElementById("site-nav");

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  // ─── Active nav link on scroll ─────────────────────────────────
  const sections = document.querySelectorAll("section[id], header[id]");
  const navLinks = document.querySelectorAll(".nav-link[data-section]");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.dataset.section === entry.target.id,
            );
          });
        }
      });
    },
    { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0 },
  );

  sections.forEach((s) => sectionObserver.observe(s));

  // ─── Smooth scroll for all anchor links ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });

      // close mobile menu if open
      navLinks_el.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });

  // ─── Mobile hamburger menu ──────────────────────────────────────
  const toggleBtn = document.getElementById("nav-toggle");
  const navLinks_el = document.getElementById("nav-links");

  toggleBtn.addEventListener("click", () => {
    const isOpen = navLinks_el.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // ─── Contact form – demo submit ────────────────────────────────
  const form = document.getElementById("booking-form");
  const success = document.getElementById("form-success");
  const submitBtn = document.getElementById("form-submit-btn");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic validation
      const required = form.querySelectorAll("[required]");
      let valid = true;
      required.forEach((field) => {
        if (!field.value.trim()) {
          field.style.borderColor = "#c0392b";
          valid = false;
        } else {
          field.style.borderColor = "";
        }
      });

      if (!valid) return;

      // Simulate send or use Formspree
      submitBtn.disabled = true;
      submitBtn.querySelector(".btn-text").textContent = "Sending…";

      var contactEmail =
        (window.SITE_CONTENT &&
          window.SITE_CONTENT.meta &&
          window.SITE_CONTENT.meta.contactEmail) ||
        "";

      if (contactEmail) {
        // Real submission via Formspree
        var formData = new FormData(form);
        var data = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });

        // If it looks like an ID (no @), use /f/ID. If it's an email, use /{email}
        var endpoint = contactEmail.includes("@")
          ? "https://formspree.io/" + encodeURIComponent(contactEmail)
          : "https://formspree.io/f/" + encodeURIComponent(contactEmail);

        fetch(endpoint, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              form.reset();
              success.removeAttribute("hidden");
              success.scrollIntoView({ behavior: "smooth", block: "nearest" });
            } else {
              alert(
                "Oops! There was a problem submitting your form. Please try again later.",
              );
            }
          })
          .catch((error) => {
            alert("Oops! There was a problem submitting your form.");
          })
          .finally(() => {
            submitBtn.disabled = false;
            submitBtn.querySelector(".btn-text").textContent = "Send Inquiry";
          });
      } else {
        // Simulation mode
        setTimeout(() => {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.querySelector(".btn-text").textContent = "Send Inquiry";
          success.removeAttribute("hidden");
          success.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 1200);
      }
    });

    // Clear red border on input
    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        field.style.borderColor = "";
      });
    });
  }

  // ─── Lightbox ──────────────────────────────────────────────────
  initLightbox();
});

/* ─── Lightbox Module ───────────────────────────────────────────── */
function initLightbox() {
  // Build overlay HTML
  const ov = document.createElement("div");
  ov.className = "lb-overlay lb-hidden";
  ov.id = "lb-overlay";
  ov.innerHTML =
    '<button class="lb-close" id="lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-arrow lb-prev" id="lb-prev" aria-label="Previous">&#8592;</button>' +
    '<div class="lb-inner">' +
    '<img id="lb-img" src="" alt="">' +
    '<div id="lb-caption"></div>' +
    '<div id="lb-counter"></div>' +
    "</div>" +
    '<button class="lb-arrow lb-next" id="lb-next" aria-label="Next">&#8594;</button>';
  document.body.appendChild(ov);

  const lbImg = document.getElementById("lb-img");
  const lbCaption = document.getElementById("lb-caption");
  const lbCounter = document.getElementById("lb-counter");
  const lbPrev = document.getElementById("lb-prev");
  const lbNext = document.getElementById("lb-next");

  let group = [],
    idx = 0;

  // Gallery = navigable group; everything else = standalone
  const galleryImgs = Array.from(
    document.querySelectorAll(".gallery-item img"),
  );
  const soloSelectors = [
    ".section-images img",
    ".hero-images img",
    ".blog-img-wrap img",
    ".contact-photo img",
    ".small-images img",
  ];

  function open(images, startIdx) {
    group = images;
    idx = startIdx;
    render();
    ov.classList.remove("lb-hidden");
    requestAnimationFrame(() => ov.classList.add("lb-active"));
    document.body.style.overflow = "hidden";
  }

  function close() {
    ov.classList.remove("lb-active");
    setTimeout(() => ov.classList.add("lb-hidden"), 300);
    document.body.style.overflow = "";
  }

  function render() {
    const img = group[idx];
    lbImg.style.opacity = "0";
    setTimeout(() => {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbImg.style.opacity = "1";
    }, 80);
    // caption: use overlay span text, alt, or dataset
    const capEl = img
      .closest(".gallery-item")
      ?.querySelector(".gallery-overlay span");
    lbCaption.textContent = capEl ? capEl.textContent : img.alt || "";
    lbCounter.textContent =
      group.length > 1 ? idx + 1 + " / " + group.length : "";
    lbPrev.disabled = idx === 0;
    lbNext.disabled = idx === group.length - 1;
    lbPrev.style.display = group.length > 1 ? "flex" : "none";
    lbNext.style.display = group.length > 1 ? "flex" : "none";
  }

  function navigate(dir) {
    idx = Math.max(0, Math.min(group.length - 1, idx + dir));
    render();
  }

  // Attach clicks — gallery (navigable)
  galleryImgs.forEach((img, i) => {
    img.addEventListener("click", () => open(galleryImgs, i));
  });

  // Attach clicks — standalone images
  soloSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((img) => {
      img.addEventListener("click", () => open([img], 0));
    });
  });

  // Close / navigate handlers
  document.getElementById("lb-close").addEventListener("click", close);
  ov.addEventListener("click", (e) => {
    if (e.target === ov) close();
  });
  lbPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(-1);
  });
  lbNext.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(1);
  });

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (ov.classList.contains("lb-hidden")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });

  // Touch swipe
  let touchX = 0;
  ov.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.touches[0].clientX;
    },
    { passive: true },
  );
  ov.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
  });
}
