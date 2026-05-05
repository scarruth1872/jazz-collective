/* ═══════════════════════════════════════════════════════
   JAZZ COLLECTIVE — ADMIN PANEL JS
   Default password: jazzcollective2026
═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Helpers ──────────────────────────────────────── */
  var $ = function(id){ return document.getElementById(id); };
  var content; // working copy of site content

  function toast(msg, type) {
    var t = document.createElement('div');
    t.className = 'toast ' + (type||'success');
    t.textContent = msg;
    $('toast-container').appendChild(t);
    setTimeout(function(){ t.remove(); }, 3000);
  }

  function markUnsaved() {
    var b = $('save-badge');
    b.textContent = '● Unsaved';
    b.className = 'save-badge unsaved';
  }
  function markSaved() {
    var b = $('save-badge');
    b.textContent = '✓ All Saved';
    b.className = 'save-badge';
  }

  function save() {
    window.CMS.save(content);
    markSaved();
    toast('Changes saved ✓');
  }

  /* resolve dotted path: getPath(obj,'hero.title') */
  function getPath(obj, path) {
    return path.split('.').reduce(function(o,k){ return o && o[k] !== undefined ? o[k] : ''; }, obj);
  }
  function setPath(obj, path, val) {
    var keys = path.split('.');
    var o = obj;
    for (var i=0;i<keys.length-1;i++) {
      if (!o[keys[i]]) o[keys[i]] = {};
      o = o[keys[i]];
    }
    o[keys[keys.length-1]] = val;
  }

  /* ── Auth ─────────────────────────────────────────── */
  var PW_KEY = 'jc_admin_pw';
  var DEFAULT_PW = 'jazzcollective2026';

  function getStoredPw() { return localStorage.getItem(PW_KEY) || DEFAULT_PW; }

  function checkLogin() {
    return sessionStorage.getItem('jc_admin_auth') === '1';
  }
  function doLogin(pw) {
    if (pw === getStoredPw()) {
      sessionStorage.setItem('jc_admin_auth', '1');
      return true;
    }
    return false;
  }
  function doLogout() {
    sessionStorage.removeItem('jc_admin_auth');
    location.reload();
  }

  /* ── Bootstrap ────────────────────────────────────── */
  function init() {
    if (checkLogin()) {
      showApp();
    } else {
      showLogin();
    }
  }

  function showLogin() {
    $('login-screen').style.display = 'flex';
    $('admin-app').classList.add('hidden');
    $('login-form').addEventListener('submit', function(e){
      e.preventDefault();
      var pw = $('pw-input').value;
      if (doLogin(pw)) {
        showApp();
      } else {
        $('login-error').textContent = 'Incorrect password. Try again.';
      }
    });
  }

  function showApp() {
    $('login-screen').style.display = 'none';
    $('admin-app').classList.remove('hidden');
    content = JSON.parse(JSON.stringify(window.CMS.get())); // deep clone
    buildApp();
  }

  /* ── Tab Navigation ───────────────────────────────── */
  function buildApp() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
        document.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
        btn.classList.add('active');
        var panel = $('tab-' + btn.dataset.tab);
        if (panel) panel.classList.add('active');
      });
    });

    // Header actions
    $('btn-logout').addEventListener('click', doLogout);
    $('btn-publish').addEventListener('click', exportJSON);

    // Wire all simple text/textarea/select fields
    wireFields();
    // Wire image pickers
    wireImagePickers();
    // Wire image size / focal point controls
    wireImageSizeControls();
    // Render dynamic sections
    renderHeroImages();
    renderNavigation();
    renderGallery();
    renderEvents();
    renderBlog();
    renderTestimonials();
    // Theme
    wireTheme();
    // Data tab
    wireData();

    markSaved();
  }

  /* ── Simple Field Binding ─────────────────────────── */
  function wireFields() {
    document.querySelectorAll('[data-path]').forEach(function(el){
      var path = el.dataset.path;
      var val = getPath(content, path);

      if (el.type === 'checkbox') {
        el.checked = !!val;
      } else {
        el.value = val || '';
      }

      el.addEventListener('input', function(){
        var newVal = el.type === 'checkbox' ? el.checked : el.value;
        setPath(content, path, newVal);

        // Live injection for Custom CSS
        if (path === 'meta.customCss') {
          var styleTag = window.parent.document.getElementById('cms-custom-css') || document.getElementById('cms-custom-css');
          if (styleTag) styleTag.innerHTML = newVal;
        }

        markUnsaved();
        debounce(save, 1200)();
      });
    });
  }

  var _debounceTimers = {};
  function debounce(fn, delay) {
    var key = fn.toString().slice(0,20);
    return function() {
      clearTimeout(_debounceTimers[key]);
      _debounceTimers[key] = setTimeout(fn, delay);
    };
  }

  /* ── Image Pickers ────────────────────────────────── */
  function wireImagePickers() {
    document.querySelectorAll('.img-picker').forEach(function(picker){
      var imgPath = picker.dataset.imgPath;
      var preview = picker.querySelector('.img-preview img');
      var urlInput = picker.querySelector('.img-url-input');
      var fileInput = picker.querySelector('.img-file-input');
      var applyBtn = picker.querySelector('.img-apply-btn');

      // Load current value
      var current = getPath(content, imgPath);
      if (current) { preview.src = current; urlInput.value = current; }

      function applyUrl(url) {
        if (!url) return;
        preview.src = url;
        setPath(content, imgPath, url);
        markUnsaved();
        save();
        toast('Image updated ✓');
      }

      applyBtn.addEventListener('click', function(){ applyUrl(urlInput.value.trim()); });
      urlInput.addEventListener('keydown', function(e){ if(e.key==='Enter') applyUrl(urlInput.value.trim()); });

      if (fileInput) {
        fileInput.addEventListener('change', function(){
          var file = fileInput.files[0];
          if (!file) return;
          var reader = new FileReader();
          reader.onload = function(ev){
            applyUrl(ev.target.result);
            urlInput.value = '(uploaded file)';
          };
          reader.readAsDataURL(file);
        });
      }
    });
  }

  /* ── Hero Slides Manager ─────────────────────────── */
  function renderHeroImages() {
    var container = $('hero-manager');
    if (!container) return;
    container.innerHTML = '';
    (content.hero.images || []).forEach(function(item, i){
      var div = document.createElement('div');
      div.className = 'gallery-manage-item';
      div.innerHTML =
        '<img src="'+item.src+'" alt="'+(item.alt||'')+'">' +
        '<div class="gallery-item-controls">' +
          '<div class="gallery-item-actions">' +
            '<button title="Edit" data-hi="'+i+'">✏️</button>' +
            '<button title="Move Left" data-hl="'+i+'">←</button>' +
            '<button title="Move Right" data-hr="'+i+'">→</button>' +
            '<button title="Delete" class="del-btn" data-hx="'+i+'">🗑</button>' +
          '</div>' +
        '</div>';
      container.appendChild(div);
    });

    container.addEventListener('click', function(e){
      var t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.hi !== undefined) openHeroModal(+t.dataset.hi);
      if (t.dataset.hl !== undefined) moveList(content.hero.images, +t.dataset.hl, -1, renderHeroImages);
      if (t.dataset.hr !== undefined) moveList(content.hero.images, +t.dataset.hr, 1, renderHeroImages);
      if (t.dataset.hx !== undefined) { if(confirm('Remove this hero slide?')) { content.hero.images.splice(+t.dataset.hx,1); save(); renderHeroImages(); } }
    });

    $('btn-add-hero').onclick = function(){ openHeroModal(-1); };
  }

  function openHeroModal(idx) {
    var isNew = idx < 0;
    var item = isNew ? { src:'', alt:'' } : Object.assign({}, content.hero.images[idx]);
    openModal(isNew ? 'Add Hero Slide' : 'Edit Hero Slide',
      '<div class="field-group"><label class="field-label">Image URL</label><input class="field-input" id="hi-src" type="text" value="'+escHtml(item.src)+'"></div>'+
      '<div class="field-group" style="margin-top:.75rem"><label class="field-label">Preview</label><div style="background:#000;height:120px;display:flex;align-items:center;justify-content:center;border-radius:6px;overflow:hidden"><img id="hi-preview" src="'+escHtml(item.src)+'" style="max-height:100%;max-width:100%;object-fit:contain"></div></div>'+
      '<label class="img-upload-label" style="margin-top:.5rem;display:inline-flex">📁 Upload File<input type="file" accept="image/*" hidden id="hi-file"></label>'+
      '<div class="field-group" style="margin-top:.75rem"><label class="field-label">Alt Text</label><input class="field-input" id="hi-alt" type="text" value="'+escHtml(item.alt)+'"></div>',
      function(){
        item.src = $('hi-src').value.trim();
        item.alt = $('hi-alt').value.trim();
        if (!item.src) { toast('Image URL required','error'); return false; }
        if (isNew) content.hero.images.push(item);
        else content.hero.images[idx] = item;
        save(); renderHeroImages(); return true;
      }
    );
    setTimeout(function(){
      var src = $('hi-src'), prev = $('hi-preview'), file = $('hi-file');
      if(src) src.addEventListener('input', function(){ if(prev) prev.src = src.value; });
      if(file) file.addEventListener('change', function(){
        var r = new FileReader();
        r.onload = function(ev){ if(src) src.value=ev.target.result; if(prev) prev.src=ev.target.result; };
        r.readAsDataURL(file.files[0]);
      });
    }, 50);
  }

  /* ── Navigation Manager ──────────────────────────── */
  function renderNavigation() {
    var container = $('nav-manager');
    if (!container) return;
    container.innerHTML = '';
    (content.navigation || []).forEach(function(item, i){
      var div = document.createElement('div');
      div.className = 'list-item';
      div.innerHTML =
        '<div class="list-item-info">'+
          '<div class="list-item-title">'+escHtml(item.label)+'</div>'+
          '<div class="list-item-meta">'+escHtml(item.url)+'</div>'+
        '</div>'+
        '<div class="list-actions">'+
          '<button class="btn-edit" data-ni="'+i+'">Edit</button>'+
          '<button class="btn-edit" style="background:rgba(255,255,255,0.05)" data-nu="'+i+'">↑</button>'+
          '<button class="btn-edit" style="background:rgba(255,255,255,0.05)" data-nd="'+i+'">↓</button>'+
          '<button class="btn-delete" data-nx="'+i+'">Delete</button>'+
        '</div>';
      container.appendChild(div);
    });

    container.addEventListener('click', function(e){
      var t = e.target;
      if (t.dataset.ni !== undefined) openNavModal(+t.dataset.ni);
      if (t.dataset.nu !== undefined) moveList(content.navigation, +t.dataset.nu, -1, renderNavigation);
      if (t.dataset.nd !== undefined) moveList(content.navigation, +t.dataset.nd, 1, renderNavigation);
      if (t.dataset.nx !== undefined) { if(confirm('Delete this menu item?')) { content.navigation.splice(+t.dataset.nx,1); save(); renderNavigation(); } }
    });
    $('btn-add-nav').onclick = function(){ openNavModal(-1); };
  }

  function openNavModal(idx) {
    var isNew = idx < 0;
    var item = isNew ? { label:'', url:'', section:'', isCta:false } : Object.assign({}, content.navigation[idx]);
    openModal(isNew ? 'Add Menu Item' : 'Edit Menu Item',
      '<div class="field-row">'+
        '<div class="field-group"><label class="field-label">Label</label><input class="field-input" id="ni-label" type="text" value="'+escHtml(item.label)+'"></div>'+
        '<div class="field-group"><label class="field-label">URL / Anchor</label><input class="field-input" id="ni-url" type="text" value="'+escHtml(item.url)+'"></div>'+
      '</div>'+
      '<div class="field-row" style="margin-top:.75rem">'+
        '<div class="field-group"><label class="field-label">Section ID (for active state)</label><input class="field-input" id="ni-section" type="text" value="'+escHtml(item.section)+'"></div>'+
        '<div class="field-group"><label class="field-label" style="opacity:0">CTA</label><label style="display:flex;align-items:center;gap:.5rem;font-size:.8rem;height:38px"><input type="checkbox" id="ni-cta" '+(item.isCta?'checked':'')+'> Show as CTA Button</label></div>'+
      '</div>',
      function(){
        item.label = $('ni-label').value.trim();
        item.url   = $('ni-url').value.trim();
        item.section = $('ni-section').value.trim();
        item.isCta = $('ni-cta').checked;
        if (!item.label || !item.url) { toast('Label and URL required','error'); return false; }
        if (isNew) content.navigation.push(item);
        else content.navigation[idx] = item;
        save(); renderNavigation(); return true;
      }
    );
  }

  function moveList(list, i, dir, cb) {
    var j = i + dir;
    if (j<0 || j>=list.length) return;
    var tmp = list[i]; list[i] = list[j]; list[j] = tmp;
    save(); cb();
  }

  /* ── Testimonials Manager ─────────────────────────── */
  function renderTestimonials() {
    var container = $('testimonials-manager');
    if (!container) return;
    container.innerHTML = '';
    (content.testimonials || []).forEach(function(item, i){
      var div = document.createElement('div');
      div.className = 'list-item';
      div.innerHTML =
        '<div class="list-item-info">'+
          '<div class="list-item-title">'+escHtml(item.name)+'</div>'+
          '<div class="list-item-meta">'+'★'.repeat(item.stars)+' — "'+escHtml(item.quote)+'"</div>'+
        '</div>'+
        '<div class="list-actions">'+
          '<button class="btn-edit" data-ti="'+i+'">Edit</button>'+
          '<button class="btn-edit" style="background:rgba(255,255,255,0.05)" data-tu="'+i+'">↑</button>'+
          '<button class="btn-edit" style="background:rgba(255,255,255,0.05)" data-td="'+i+'">↓</button>'+
          '<button class="btn-delete" data-tx="'+i+'">Delete</button>'+
        '</div>';
      container.appendChild(div);
    });

    container.addEventListener('click', function(e){
      var t = e.target;
      if (t.dataset.ti !== undefined) openTestimonialModal(+t.dataset.ti);
      if (t.dataset.tu !== undefined) moveList(content.testimonials, +t.dataset.tu, -1, renderTestimonials);
      if (t.dataset.td !== undefined) moveList(content.testimonials, +t.dataset.td, 1, renderTestimonials);
      if (t.dataset.tx !== undefined) { if(confirm('Delete this testimonial?')) { content.testimonials.splice(+t.dataset.tx,1); save(); renderTestimonials(); } }
    });
    $('btn-add-testimonial').onclick = function(){ openTestimonialModal(-1); };
  }

  function openTestimonialModal(idx) {
    var isNew = idx < 0;
    var item = isNew ? { name:'', quote:'', stars:5 } : Object.assign({}, content.testimonials[idx]);
    openModal(isNew ? 'Add Testimonial' : 'Edit Testimonial',
      '<div class="field-row">'+
        '<div class="field-group"><label class="field-label">Name / Attribution</label><input class="field-input" id="ti-name" type="text" value="'+escHtml(item.name)+'"></div>'+
        '<div class="field-group"><label class="field-label">Rating (1-5 Stars)</label><select class="field-select" id="ti-stars">'+
          [1,2,3,4,5].map(function(s){ return '<option value="'+s+'" '+(item.stars===s?'selected':'')+'>'+s+' Stars</option>'; }).join('')+
        '</select></div>'+
      '</div>'+
      '<div class="field-group" style="margin-top:.75rem"><label class="field-label">Quote</label><textarea class="field-textarea" id="ti-quote" rows="3">'+escHtml(item.quote)+'</textarea></div>',
      function(){
        item.name  = $('ti-name').value.trim();
        item.quote = $('ti-quote').value.trim();
        item.stars = parseInt($('ti-stars').value);
        if (!item.name || !item.quote) { toast('Name and Quote required','error'); return false; }
        if (isNew) content.testimonials.push(item);
        else content.testimonials[idx] = item;
        save(); renderTestimonials(); return true;
      }
    );
  }

  /* ── Gallery Manager ──────────────────────────────── */
  function renderGallery() {
    var container = $('gallery-manager');
    if (!container) return;
    container.innerHTML = '';
    (content.gallery || []).forEach(function(item, i){
      var div = document.createElement('div');
      div.className = 'gallery-manage-item';
      div.innerHTML =
        '<img src="'+item.src+'" alt="'+item.caption+'">' +
        '<div class="gallery-item-controls">' +
          '<div class="gallery-item-caption">'+item.caption+'</div>' +
          '<div class="gallery-item-actions">' +
            '<button title="Edit" data-gi="'+i+'">✏️</button>' +
            '<button title="Move Up" data-gu="'+i+'">↑</button>' +
            '<button title="Move Down" data-gd="'+i+'">↓</button>' +
            '<button title="Delete" class="del-btn" data-gx="'+i+'">🗑</button>' +
          '</div>' +
        '</div>';
      container.appendChild(div);
    });

    container.addEventListener('click', function(e){
      var t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.gi !== undefined) openGalleryModal(+t.dataset.gi);
      if (t.dataset.gu !== undefined) moveGallery(+t.dataset.gu, -1);
      if (t.dataset.gd !== undefined) moveGallery(+t.dataset.gd, 1);
      if (t.dataset.gx !== undefined) { if(confirm('Delete this photo?')) { content.gallery.splice(+t.dataset.gx,1); save(); renderGallery(); } }
    });

    $('btn-add-gallery').onclick = function(){ openGalleryModal(-1); };
  }

  function moveGallery(i, dir) {
    var g = content.gallery, j = i + dir;
    if (j<0||j>=g.length) return;
    var tmp=g[i]; g[i]=g[j]; g[j]=tmp;
    save(); renderGallery();
  }

  function openGalleryModal(idx) {
    var isNew = idx < 0;
    var item = isNew ? { src:'', alt:'', caption:'', span:'' } : Object.assign({}, content.gallery[idx]);
    openModal(isNew ? 'Add Gallery Photo' : 'Edit Gallery Photo',
      '<div class="field-group"><label class="field-label">Image URL</label><input class="field-input" id="gi-src" type="text" value="'+escHtml(item.src)+'"></div>'+
      '<div class="field-group" style="margin-top:.75rem"><label class="field-label">Preview</label><div style="background:#000;height:120px;display:flex;align-items:center;justify-content:center;border-radius:6px;overflow:hidden"><img id="gi-preview" src="'+escHtml(item.src)+'" style="max-height:100%;max-width:100%;object-fit:contain"></div></div>'+
      '<label class="img-upload-label" style="margin-top:.5rem;display:inline-flex">📁 Upload File<input type="file" accept="image/*" hidden id="gi-file"></label>'+
      '<div class="field-row" style="margin-top:.75rem">'+
        '<div class="field-group"><label class="field-label">Caption</label><input class="field-input" id="gi-caption" type="text" value="'+escHtml(item.caption)+'"></div>'+
        '<div class="field-group"><label class="field-label">Alt Text</label><input class="field-input" id="gi-alt" type="text" value="'+escHtml(item.alt)+'"></div>'+
      '</div>'+
      '<div class="field-group" style="margin-top:.75rem"><label class="field-label">Span Style</label>'+
        '<select class="field-select" id="gi-span">'+
          '<option value="" '+(item.span===''?'selected':'')+'>Normal</option>'+
          '<option value="g-tall" '+(item.span==='g-tall'?'selected':'')+'>Tall (2 rows)</option>'+
          '<option value="g-wide" '+(item.span==='g-wide'?'selected':'')+'>Wide (2 cols)</option>'+
        '</select></div>',
      function(){
        item.src = $('gi-src').value.trim();
        item.caption = $('gi-caption').value.trim();
        item.alt = $('gi-alt').value.trim();
        item.span = $('gi-span').value;
        if (!item.src) { toast('Image URL required','error'); return false; }
        if (isNew) content.gallery.push(item);
        else content.gallery[idx] = item;
        save(); renderGallery(); return true;
      }
    );
    // wire preview + upload
    setTimeout(function(){
      var src = $('gi-src'), prev = $('gi-preview'), file = $('gi-file');
      if(src) src.addEventListener('input', function(){ if(prev) prev.src = src.value; });
      if(file) file.addEventListener('change', function(){
        var r = new FileReader();
        r.onload = function(ev){ if(src) src.value=ev.target.result; if(prev) prev.src=ev.target.result; };
        r.readAsDataURL(file.files[0]);
      });
    }, 50);
  }

  /* ── Events Manager ───────────────────────────────── */
  function renderEvents() {
    var container = $('events-manager');
    if (!container) return;
    container.innerHTML = '';
    (content.events || []).forEach(function(ev, i){
      var div = document.createElement('div');
      div.className = 'list-item';
      div.innerHTML =
        '<span class="event-badge">'+ev.month+' '+ev.day+'</span>'+
        '<div class="list-item-info">'+
          '<div class="list-item-title">'+escHtml(ev.title)+'</div>'+
          '<div class="list-item-meta">'+escHtml(ev.venue)+' — '+escHtml(ev.city)+'</div>'+
        '</div>'+
        '<div class="list-actions">'+
          '<button class="btn-edit" data-ei="'+i+'">Edit</button>'+
          '<button class="btn-delete" data-ex="'+i+'">Delete</button>'+
        '</div>';
      container.appendChild(div);
    });
    container.addEventListener('click', function(e){
      var t = e.target;
      if (t.dataset.ei !== undefined) openEventModal(+t.dataset.ei);
      if (t.dataset.ex !== undefined) { if(confirm('Delete this event?')) { content.events.splice(+t.dataset.ex,1); save(); renderEvents(); } }
    });
    $('btn-add-event').onclick = function(){ openEventModal(-1); };
  }

  function eventForm(ev) {
    return '<div class="field-row">'+
      '<div class="field-group"><label class="field-label">Month (3-letter)</label><input class="field-input" id="ev-month" type="text" maxlength="3" value="'+escHtml(ev.month||'')+'"></div>'+
      '<div class="field-group"><label class="field-label">Day</label><input class="field-input" id="ev-day" type="text" maxlength="2" value="'+escHtml(ev.day||'')+'"></div>'+
    '</div>'+
    '<div class="field-group" style="margin-top:.75rem"><label class="field-label">Event Title</label><input class="field-input" id="ev-title" type="text" value="'+escHtml(ev.title||'')+'"></div>'+
    '<div class="field-row" style="margin-top:.75rem">'+
      '<div class="field-group"><label class="field-label">Venue</label><input class="field-input" id="ev-venue" type="text" value="'+escHtml(ev.venue||'')+'"></div>'+
      '<div class="field-group"><label class="field-label">City, State</label><input class="field-input" id="ev-city" type="text" value="'+escHtml(ev.city||'')+'"></div>'+
    '</div>'+
    '<div class="field-group" style="margin-top:.75rem"><label class="field-label">Ticket / Info URL</label><input class="field-input" id="ev-url" type="url" value="'+escHtml(ev.ticketUrl||'')+'"></div>';
  }

  function openEventModal(idx) {
    var isNew = idx < 0;
    var ev = isNew ? {} : Object.assign({}, content.events[idx]);
    openModal(isNew ? 'Add Event' : 'Edit Event', eventForm(ev), function(){
      ev.month = ($('ev-month').value||'').toUpperCase().trim();
      ev.day = ($('ev-day').value||'').trim();
      ev.title = ($('ev-title').value||'').trim();
      ev.venue = ($('ev-venue').value||'').trim();
      ev.city  = ($('ev-city').value||'').trim();
      ev.ticketUrl = ($('ev-url').value||'').trim();
      if (!ev.title) { toast('Title required','error'); return false; }
      if (isNew) content.events.push(ev);
      else content.events[idx] = ev;
      save(); renderEvents(); return true;
    });
  }

  /* ── Blog Manager ─────────────────────────────────── */
  function renderBlog() {
    var container = $('blog-manager');
    if (!container) return;
    container.innerHTML = '';
    (content.blog || []).forEach(function(post, i){
      var div = document.createElement('div');
      div.className = 'list-item';
      div.innerHTML =
        '<div class="list-item-info">'+
          '<div class="list-item-title">'+escHtml(post.title)+'</div>'+
          '<div class="list-item-meta">'+escHtml(post.date)+' &nbsp;·&nbsp; '+escHtml(post.tag)+'</div>'+
        '</div>'+
        '<div class="list-actions">'+
          '<button class="btn-edit" data-bi="'+i+'">Edit</button>'+
          '<button class="btn-delete" data-bx="'+i+'">Delete</button>'+
        '</div>';
      container.appendChild(div);
    });
    container.addEventListener('click', function(e){
      var t = e.target;
      if (t.dataset.bi !== undefined) openBlogModal(+t.dataset.bi);
      if (t.dataset.bx !== undefined) { if(confirm('Delete this post?')) { content.blog.splice(+t.dataset.bx,1); save(); renderBlog(); } }
    });
    $('btn-add-blog').onclick = function(){ openBlogModal(-1); };
  }

  function blogForm(p) {
    return '<div class="field-row">'+
      '<div class="field-group"><label class="field-label">Date</label><input class="field-input" id="bl-date" type="text" value="'+escHtml(p.date||'')+'"></div>'+
      '<div class="field-group"><label class="field-label">Tag</label><input class="field-input" id="bl-tag" type="text" value="'+escHtml(p.tag||'')+'"></div>'+
    '</div>'+
    '<div class="field-group" style="margin-top:.75rem"><label class="field-label">Title</label><input class="field-input" id="bl-title" type="text" value="'+escHtml(p.title||'')+'"></div>'+
    '<div class="field-group" style="margin-top:.75rem"><label class="field-label">Body</label><textarea class="field-textarea" id="bl-body" rows="4">'+escHtml(p.body||'')+'</textarea></div>'+
    '<div class="field-group" style="margin-top:.75rem"><label class="field-label">Image URL</label><input class="field-input" id="bl-img" type="text" value="'+escHtml((p.image&&p.image.src)||'')+'"></div>'+
    '<label class="img-upload-label" style="margin-top:.5rem;display:inline-flex">📁 Upload<input type="file" accept="image/*" hidden id="bl-file"></label>';
  }

  function openBlogModal(idx) {
    var isNew = idx < 0;
    var p = isNew ? { image:{} } : JSON.parse(JSON.stringify(content.blog[idx]));
    openModal(isNew ? 'Add Blog Post' : 'Edit Blog Post', blogForm(p), function(){
      p.date  = ($('bl-date').value||'').trim();
      p.tag   = ($('bl-tag').value||'').trim();
      p.title = ($('bl-title').value||'').trim();
      p.body  = ($('bl-body').value||'').trim();
      if (!p.image) p.image = {};
      p.image.src = ($('bl-img').value||'').trim();
      p.image.alt = p.title;
      if (!p.title) { toast('Title required','error'); return false; }
      if (isNew) content.blog.push(p);
      else content.blog[idx] = p;
      save(); renderBlog(); return true;
    });
    setTimeout(function(){
      var imgInput = $('bl-img'), fileInput = $('bl-file');
      if (fileInput) fileInput.addEventListener('change', function(){
        var r = new FileReader();
        r.onload = function(ev){ if(imgInput) imgInput.value = ev.target.result; };
        r.readAsDataURL(fileInput.files[0]);
      });
    }, 50);
  }

  /* ── Theme ────────────────────────────────────────── */
  function wireTheme() {
    document.querySelectorAll('[data-path^="theme."]').forEach(function(el){
      var path = el.dataset.path;
      el.value = getPath(content, path) || '#000000';
    });
    $('btn-apply-theme').onclick = function(){
      document.querySelectorAll('[data-path^="theme."]').forEach(function(el){
        setPath(content, el.dataset.path, el.value);
      });
      markUnsaved(); save(); toast('Theme applied ✓');
    };
    $('btn-reset-theme').onclick = function(){
      var defaults = window.SITE_DEFAULTS.theme;
      Object.keys(defaults).forEach(function(k){
        setPath(content, 'theme.'+k, defaults[k]);
        var el = document.querySelector('[data-path="theme.'+k+'"]');
        if (el) el.value = defaults[k];
      });
      markUnsaved(); save(); toast('Theme reset ✓');
    };
  }

  /* ── Data Tab ─────────────────────────────────────── */
  function wireData() {
    $('btn-export').onclick = exportJSON;
    $('btn-import-paste').onclick = function(){
      try {
        var parsed = JSON.parse($('import-textarea').value);
        content = parsed; save(); toast('Content imported ✓'); wireFields(); renderGallery(); renderEvents(); renderBlog();
      } catch(e) { toast('Invalid JSON','error'); }
    };
    $('import-file').onchange = function(){
      var r = new FileReader();
      r.onload = function(ev){ $('import-textarea').value = ev.target.result; };
      r.readAsText($('import-file').files[0]);
    };
    $('btn-change-pw').onclick = function(){
      var np = $('new-pw').value, cp = $('confirm-pw').value;
      if (!np) { toast('Enter a new password','error'); return; }
      if (np !== cp) { toast('Passwords do not match','error'); return; }
      localStorage.setItem(PW_KEY, np);
      $('new-pw').value=''; $('confirm-pw').value='';
      toast('Password updated ✓');
    };
    $('btn-reset').onclick = function(){
      if (confirm('Reset ALL content to defaults? This cannot be undone.')) {
        window.CMS.reset();
        content = JSON.parse(JSON.stringify(window.SITE_DEFAULTS));
        save(); toast('Content reset to defaults'); wireFields(); renderGallery(); renderEvents(); renderBlog();
      }
    };
  }

  function exportJSON() {
    var blob = new Blob([JSON.stringify(content, null, 2)], { type:'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'content-data.json';
    a.click();
    toast('JSON exported — commit to GitHub to publish ✓');
  }

  /* ── Modal ────────────────────────────────────────── */
  var _onModalSave = null;
  function openModal(title, bodyHTML, onSave) {
    $('modal-title').textContent = title;
    $('modal-body').innerHTML = bodyHTML;
    _onModalSave = onSave;
    $('modal-overlay').classList.remove('hidden');
  }
  function closeModal() { $('modal-overlay').classList.add('hidden'); _onModalSave=null; }
  $('modal-close').onclick = closeModal;
  $('modal-cancel').onclick = closeModal;
  $('modal-overlay').onclick = function(e){ if(e.target===$('modal-overlay')) closeModal(); };
  $('modal-save').onclick = function(){
    if (_onModalSave && _onModalSave() !== false) closeModal();
  };

  /* ── XSS helper ───────────────────────────────────── */
  function escHtml(str) {
    return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Image Size & Focal Point Controls ───────────── */
  var FOCAL_POSITIONS = [
    ['0% 0%','50% 0%','100% 0%'],
    ['0% 50%','50% 50%','100% 50%'],
    ['0% 100%','50% 100%','100% 100%']
  ];

  function wireImageSizeControls() {
    document.querySelectorAll('.img-picker[data-img-path]').forEach(function(picker) {
      var imgPath = picker.dataset.imgPath;
      // parent path: "hero.image1.src" → "hero.image1"
      var parentPath = imgPath.replace(/\.src$/, '');

      var currentPos  = getPath(content, parentPath + '.objectPosition') || '50% 50%';
      var currentFit  = getPath(content, parentPath + '.objectFit')      || 'contain';
      var currentW    = getPath(content, parentPath + '.displayWidth')    || '100';

      // Build focal grid HTML
      var gridHTML = '<div class="focal-grid" data-focal-path="' + parentPath + '">';
      FOCAL_POSITIONS.forEach(function(row) {
        row.forEach(function(pos) {
          var active = pos === currentPos ? ' active' : '';
          gridHTML += '<button type="button" class="focal-btn' + active + '" data-pos="' + pos + '" title="' + pos + '"></button>';
        });
      });
      gridHTML += '</div>';

      // Build panel HTML
      var panel = document.createElement('details');
      panel.className = 'img-size-panel';
      panel.innerHTML =
        '<summary>Image Settings</summary>' +
        '<div class="img-size-controls">' +
          '<div class="size-row">' +
            '<span class="size-label">Width</span>' +
            '<select class="size-select" data-size-path="' + parentPath + '.displayWidth">' +
              ['25','33','50','66','75','100'].map(function(v){
                return '<option value="'+v+'"'+(v===String(currentW)?' selected':'')+'>'+v+'%</option>';
              }).join('') +
            '</select>' +
          '</div>' +
          '<div class="size-row">' +
            '<span class="size-label">Fit</span>' +
            '<select class="size-select" data-size-path="' + parentPath + '.objectFit">' +
              ['contain','cover'].map(function(v){
                return '<option value="'+v+'"'+(v===currentFit?' selected':'')+'>'+v+'</option>';
              }).join('') +
            '</select>' +
          '</div>' +
          '<div class="size-row">' +
            '<span class="size-label">Focal Point</span>' +
            gridHTML +
          '</div>' +
        '</div>';

      picker.appendChild(panel);

      // Wire size selects
      panel.querySelectorAll('.size-select').forEach(function(sel) {
        sel.addEventListener('change', function() {
          setPath(content, sel.dataset.sizePath, sel.value);
          markUnsaved(); save();
          // update the preview image fit/position
          var previewImg = picker.querySelector('.img-preview img');
          if (previewImg) {
            if (sel.dataset.sizePath.endsWith('.objectFit')) previewImg.style.objectFit = sel.value;
            if (sel.dataset.sizePath.endsWith('.objectPosition')) previewImg.style.objectPosition = sel.value;
          }
        });
      });

      // Wire focal grid
      panel.querySelectorAll('.focal-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          panel.querySelectorAll('.focal-btn').forEach(function(b){ b.classList.remove('active'); });
          btn.classList.add('active');
          var pos = btn.dataset.pos;
          setPath(content, parentPath + '.objectPosition', pos);
          markUnsaved(); save();
          var previewImg = picker.querySelector('.img-preview img');
          if (previewImg) previewImg.style.objectPosition = pos;
        });
      });

      // Apply current settings to preview
      var previewImg = picker.querySelector('.img-preview img');
      if (previewImg) {
        previewImg.style.objectFit     = currentFit;
        previewImg.style.objectPosition = currentPos;
      }
    });
  }

  /* ── Start ────────────────────────────────────────── */
  init();
}());
