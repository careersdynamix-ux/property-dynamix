/**
 * ============================================================
 *  app.js — Dynamic Rendering Engine
 *  Reads SITE_CONFIG (config.js) and builds the entire UI.
 *  Zero hard-coded content — everything comes from config.
 * ============================================================
 */

/* ──────────────────────────────────────────────────────────
   UTILITY HELPERS
────────────────────────────────────────────────────────── */

/** Safe DOM selector */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/** Build a WhatsApp URL with pre-filled message */
function waLink(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Format a property's WhatsApp message */
function propertyWaMsg(prop) {
  const C = SITE_CONFIG.brand;
  return `Hi ${C.companyName}! I'm interested in:\n\n🏠 *${prop.title}*\n📍 ${prop.location}\n💰 ${prop.priceDisplay}\n📐 ${prop.areaSqFt} sq.ft. | ${prop.configuration}\n🆔 Property ID: ${prop.id}\n\nPlease share more details and arrange a site visit. Thank you!`;
}

/** Show toast notification */
function showToast(msg, duration = 3000) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/** Get status badge class */
function statusClass(status) {
  if (status === 'Ready to Move')       return 'status-ready';
  if (status === 'Under Construction')  return 'status-under';
  return 'status-launch';
}

/** Render star rating */
function stars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

/** Escape HTML */
function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ──────────────────────────────────────────────────────────
   STATE
────────────────────────────────────────────────────────── */
const STATE = {
  activeCategory: 'All',
  activeLocation: 'All',
  activeBudget:   'All',
  searchQuery:    '',
  wishlist:       new Set(JSON.parse(localStorage.getItem('pr_wishlist') || '[]')),
  currentProperty: null,
  currentGalleryIndex: 0,
  currentGalleryMode: 'photos', // 'photos' | 'floorplan'
};

function saveWishlist() {
  localStorage.setItem('pr_wishlist', JSON.stringify([...STATE.wishlist]));
}

/* ──────────────────────────────────────────────────────────
   1. DOCUMENT TITLE & META
────────────────────────────────────────────────────────── */
function initMeta() {
  const B = SITE_CONFIG.brand;
  document.title = `${B.companyName} — ${B.tagline}`;
  const metaDesc = $('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content',
    `${B.companyName}: ${B.tagline}. RERA: ${B.reraNumber}. Premium properties in Bangalore.`
  );
}

/* ──────────────────────────────────────────────────────────
   2. HEADER
────────────────────────────────────────────────────────── */
function buildHeader() {
  const B = SITE_CONFIG.brand;
  const wa = SITE_CONFIG.brand.whatsappNumber;

  /* Logo */
  const logoEl = $('#header-logo');
  if (B.logoUrl) {
    logoEl.innerHTML = `<img src="${esc(B.logoUrl)}" alt="${esc(B.companyName)} logo" class="logo-img" />`;
  } else {
    logoEl.innerHTML = `
      <div class="logo-text">
        <span class="logo-name">${esc(B.companyName)}</span>
        <span class="logo-tagline">${esc(B.tagline)}</span>
      </div>`;
  }

  /* Desktop Nav */
  const navLinks = [
    ['#properties', 'Properties'],
    ['#floor-stack','Building'],
    ['#testimonials','Reviews'],
    ['#neighborhood','Location'],
    ['#contact',    'Contact'],
  ];

  // Hide sections that are disabled
  const es = SITE_CONFIG.enableSections;
  const visibleLinks = navLinks.filter(([href]) => {
    if (href === '#floor-stack'  && !es.showFloorStack)      return false;
    if (href === '#testimonials' && !es.showTestimonials)    return false;
    if (href === '#neighborhood' && !es.showNeighborhood)    return false;
    if (href === '#contact'      && !es.showContactForm)     return false;
    return true;
  });

  $('#desktop-nav').innerHTML = visibleLinks.map(([href, label]) =>
    `<a href="${href}">${label}</a>`
  ).join('') + `<span class="rera-badge-header">RERA ✓</span>`;

  /* Header actions */
  $('#header-actions').innerHTML = `
    <a href="tel:${esc(B.phone)}" class="header-phone" aria-label="Call us">
      📞 ${esc(B.phone)}
    </a>
    <a href="${waLink(wa, `Hi ${B.companyName}! I'd like to book a site visit. Please share available slots.`)}"
       class="btn btn-primary btn-sm" target="_blank" rel="noopener" aria-label="Schedule site visit">
      🗓️ Book Site Visit
    </a>`;

  /* Mobile Nav */
  $('#mobile-nav').innerHTML = visibleLinks.map(([href, label]) =>
    `<a href="${href}">${label}</a>`
  ).join('') + `
    <a href="tel:${esc(B.phone)}">📞 ${esc(B.phone)}</a>
    <a href="${waLink(wa, `Hi ${B.companyName}! I'd like to book a site visit.`)}" target="_blank">💬 WhatsApp Us</a>`;

  /* Mobile Action Bar */
  $('#mobile-action-bar').innerHTML = `
    <a href="tel:${esc(B.phone)}" class="btn btn-white">📞 Call Now</a>
    <a href="${waLink(wa, `Hi ${B.companyName}! I'd like to book a site visit.`)}"
       class="btn btn-wa" target="_blank" rel="noopener">💬 WhatsApp</a>
    <a href="#properties" class="btn btn-primary">🏡 Properties</a>`;

  /* Floating WhatsApp */
  $('#float-whatsapp').href = waLink(wa, `Hi ${B.companyName}! I'm interested in your properties. Please share details.`);

  /* Contact details */
  const contactItems = [
    { icon: '📞', label: 'Call Us',          val: `<a href="tel:${esc(B.phone)}">${esc(B.phone)}</a>` },
    { icon: '💬', label: 'WhatsApp',         val: `<a href="${waLink(wa,'Hi!')}" target="_blank" rel="noopener">${esc(B.phone)}</a>` },
    { icon: '✉️', label: 'Email',            val: `<a href="mailto:${esc(B.email)}">${esc(B.email)}</a>` },
    { icon: '📍', label: 'Office Address',   val: esc(B.officeAddress) },
    { icon: '🏛️', label: 'RERA Number',     val: esc(B.reraNumber) },
  ];
  $('#contact-details').innerHTML = contactItems.map(i => `
    <div class="contact-detail-item">
      <div class="contact-detail-icon">${i.icon}</div>
      <div>
        <div class="contact-detail-label">${i.label}</div>
        <div class="contact-detail-val">${i.val}</div>
      </div>
    </div>`).join('');

  /* Hamburger toggle */
  const hamBtn  = $('#hamburger-btn');
  const mobileN = $('#mobile-nav');
  hamBtn.addEventListener('click', () => {
    const open = mobileN.classList.toggle('open');
    hamBtn.classList.toggle('open', open);
    hamBtn.setAttribute('aria-expanded', String(open));
  });

  /* Close mobile nav on link click */
  $$('a', mobileN).forEach(a => a.addEventListener('click', () => {
    mobileN.classList.remove('open');
    hamBtn.classList.remove('open');
    hamBtn.setAttribute('aria-expanded', 'false');
  }));

  /* Scroll effects */
  window.addEventListener('scroll', () => {
    const header = $('#site-header');
    header.classList.toggle('scrolled', window.scrollY > 60);

    // Scroll progress bar
    const docH   = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = docH > 0 ? (window.scrollY / docH * 100) : 0;
    $('#scroll-progress').style.width = pct + '%';

    // Active nav link
    const sections = ['properties','floor-stack','testimonials','neighborhood','contact'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      $$(`a[href="#${id}"]`).forEach(a => {
        a.classList.toggle('active', rect.top <= 90 && rect.bottom >= 90);
      });
    });
  }, { passive: true });
}

/* ──────────────────────────────────────────────────────────
   3. HERO
────────────────────────────────────────────────────────── */
function buildHero() {
  const H  = SITE_CONFIG.hero;
  const B  = SITE_CONFIG.brand;
  const wa = B.whatsappNumber;

  /* Background */
  $('#hero-bg').style.backgroundImage = `url('${H.backgroundImage}')`;

  /* Content */
  $('#hero-content').innerHTML = `
    <div class="badge">${H.badge}</div>
    <h1 class="hero-title">${H.title}</h1>
    <p class="hero-subtitle">${H.subtitle}</p>
    <div class="hero-ctas">
      <a href="#properties" class="btn btn-primary">🏡 ${esc(H.ctaPrimary)}</a>
      <a href="${waLink(wa, `Hi ${B.companyName}! I'd like to book a site visit. Please share available slots.`)}"
         class="btn btn-ghost" target="_blank" rel="noopener">
        🗓️ ${esc(H.ctaSecondary)}
      </a>
    </div>`;

  /* Stats bar */
  $('#hero-stats-container').innerHTML = H.stats.map(s => `
    <div class="stat-item">
      <div class="stat-icon">${s.icon}</div>
      <div class="stat-info">
        <div class="stat-value">${esc(s.value)}</div>
        <div class="stat-label">${esc(s.label)}</div>
      </div>
    </div>`).join('');
}

/* ──────────────────────────────────────────────────────────
   4. PROPERTY FILTER SYSTEM
────────────────────────────────────────────────────────── */
function buildFilters() {
  const props = SITE_CONFIG.properties;

  /* Collect unique locations */
  const locations = ['All', ...new Set(props.map(p => p.location))];

  /* Category tabs */
  const categories = ['All', 'Buy', 'Rent', 'Commercial'];
  $('#category-tabs').innerHTML = categories.map(cat => `
    <button
      class="tab-btn ${cat === 'All' ? 'active' : ''}"
      data-cat="${esc(cat)}"
      role="tab"
      aria-selected="${cat === 'All'}"
    >${cat === 'All' ? '🏘️ All' : cat === 'Buy' ? '🏠 Buy' : cat === 'Rent' ? '🔑 Rent' : '💼 Commercial'} ${cat}</button>
  `).join('');

  /* Filter bar */
  $('#filter-bar').innerHTML = `
    <div class="filter-group">
      <label for="filter-location">📍 Location</label>
      <select id="filter-location">
        ${locations.map(l => `<option value="${esc(l)}">${esc(l)}</option>`).join('')}
      </select>
    </div>
    <div class="filter-group">
      <label for="filter-budget">💰 Budget</label>
      <select id="filter-budget">
        <option value="All">All Budgets</option>
        <option value="0-50">Under ₹50 Lakhs</option>
        <option value="50-100">₹50L – ₹1 Crore</option>
        <option value="100-200">₹1 – ₹2 Crore</option>
        <option value="200+">₹2 Crore+</option>
        <option value="rent-low">Rent under ₹30k/mo</option>
        <option value="rent-high">Rent ₹30k+/mo</option>
      </select>
    </div>
    <div class="filter-group">
      <label for="filter-search">🔍 Search</label>
      <input type="text" id="filter-search" placeholder="e.g. 3 BHK, Whitefield, Villa…" />
    </div>
    <button class="btn btn-outline" id="filter-reset-btn" title="Reset all filters">↺ Reset</button>`;

  /* Event Listeners */
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      STATE.activeCategory = btn.dataset.cat;
      renderProperties();
    });
  });

  $('#filter-location').addEventListener('change', e => {
    STATE.activeLocation = e.target.value;
    renderProperties();
  });

  $('#filter-budget').addEventListener('change', e => {
    STATE.activeBudget = e.target.value;
    renderProperties();
  });

  $('#filter-search').addEventListener('input', e => {
    STATE.searchQuery = e.target.value.toLowerCase().trim();
    renderProperties();
  });

  $('#filter-reset-btn').addEventListener('click', () => {
    STATE.activeCategory = 'All';
    STATE.activeLocation = 'All';
    STATE.activeBudget   = 'All';
    STATE.searchQuery    = '';
    $$('.tab-btn').forEach(b => { b.classList.toggle('active', b.dataset.cat === 'All'); b.setAttribute('aria-selected', b.dataset.cat === 'All' ? 'true' : 'false'); });
    $('#filter-location').value = 'All';
    $('#filter-budget').value   = 'All';
    $('#filter-search').value   = '';
    renderProperties();
    showToast('Filters cleared');
  });
}

function filterProperties() {
  const { activeCategory, activeLocation, activeBudget, searchQuery } = STATE;

  return SITE_CONFIG.properties.filter(p => {
    /* Category */
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;

    /* Location */
    if (activeLocation !== 'All' && p.location !== activeLocation) return false;

    /* Budget */
    const isRent = p.category === 'Rent';
    const isComm = p.category === 'Commercial';
    const price  = p.priceNumeric;

    if (activeBudget !== 'All') {
      if (activeBudget === '0-50'      && (isRent || isComm || price >= 50))  return false;
      if (activeBudget === '50-100'    && (isRent || isComm || price < 50 || price >= 100)) return false;
      if (activeBudget === '100-200'   && (isRent || isComm || price < 100 || price >= 200)) return false;
      if (activeBudget === '200+'      && (isRent || isComm || price < 200))  return false;
      if (activeBudget === 'rent-low'  && (!isRent || price >= 30000))        return false;
      if (activeBudget === 'rent-high' && (!isRent || price < 30000))         return false;
    }

    /* Search */
    if (searchQuery) {
      const hay = [p.title, p.location, p.configuration, p.propertyType, p.status, p.priceDisplay]
        .join(' ').toLowerCase();
      if (!hay.includes(searchQuery)) return false;
    }

    return true;
  });
}

/* ──────────────────────────────────────────────────────────
   5. PROPERTY CARDS RENDERING
────────────────────────────────────────────────────────── */
function renderProperties() {
  const filtered = filterProperties();
  const grid     = $('#properties-grid');
  const wa       = SITE_CONFIG.brand.whatsappNumber;

  /* Update count */
  $('#results-count').textContent = filtered.length;

  /* Active filter label */
  const filters = [];
  if (STATE.activeCategory !== 'All') filters.push(STATE.activeCategory);
  if (STATE.activeLocation  !== 'All') filters.push(STATE.activeLocation);
  if (STATE.activeBudget    !== 'All') filters.push(STATE.activeBudget);
  if (STATE.searchQuery)               filters.push(`"${STATE.searchQuery}"`);
  $('#active-filters-label').textContent = filters.length ? `Filtered: ${filters.join(' · ')}` : '';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results fade-in-up visible">
        <div class="no-results-icon">🔍</div>
        <h3 style="color:var(--primary-color);font-family:var(--font-heading);margin-bottom:8px;">No Properties Found</h3>
        <p style="color:var(--text-mid);">Try adjusting your filters or search term.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((prop, i) => {
    const inWishlist = STATE.wishlist.has(prop.id);
    const statusCls  = statusClass(prop.status);
    const delay      = `stagger-${Math.min(i % 4 + 1, 4)}`;
    return `
    <article class="property-card fade-in-up ${delay}" data-id="${esc(prop.id)}" role="listitem" tabindex="0" aria-label="${esc(prop.title)}">
      <div class="card-img-wrap">
        <img
          src="${esc(prop.images[0])}"
          alt="${esc(prop.title)}"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=60'"
        />
        <span class="card-status-badge ${statusCls}">${esc(prop.status)}</span>
        ${prop.reraId !== 'N/A' ? `<span class="card-rera">RERA ✓</span>` : ''}
        <button
          class="card-wishlist ${inWishlist ? 'active' : ''}"
          data-id="${esc(prop.id)}"
          aria-label="${inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}"
          title="Wishlist"
        >${inWishlist ? '❤️' : '🤍'}</button>
      </div>

      <div class="card-body">
        <div class="card-type-loc">
          <span class="card-type">${esc(prop.propertyType)}</span>
          <span class="card-loc">📍 ${esc(prop.location)}</span>
        </div>
        <h3 class="card-title">${esc(prop.title)}</h3>
        <div class="card-specs">
          <span class="card-spec">📐 <span>${esc(String(prop.areaSqFt))} sq.ft.</span></span>
          <span class="card-spec">🛏️ <span>${esc(prop.configuration)}</span></span>
          <span class="card-spec">🆔 <span>${esc(prop.id)}</span></span>
        </div>
        <div class="card-price">${esc(prop.priceDisplay)}</div>
        <div class="card-actions">
          <button class="btn btn-outline view-details-btn" data-id="${esc(prop.id)}">View Details</button>
          <a href="${waLink(wa, propertyWaMsg(prop))}"
             class="btn btn-wa" target="_blank" rel="noopener" aria-label="WhatsApp inquiry">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </article>`;
  }).join('');

  /* Trigger animations */
  requestAnimationFrame(() => {
    $$('.property-card.fade-in-up').forEach(el => {
      el.classList.add('visible');
    });
  });

  /* Attach events */
  $$('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openModal(btn.dataset.id);
    });
  });

  $$('.property-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openModal(card.dataset.id);
    });
  });

  $$('.card-wishlist').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (STATE.wishlist.has(id)) {
        STATE.wishlist.delete(id);
        btn.textContent = '🤍';
        btn.classList.remove('active');
        btn.setAttribute('aria-label','Add to wishlist');
        showToast('Removed from wishlist');
      } else {
        STATE.wishlist.add(id);
        btn.textContent = '❤️';
        btn.classList.add('active');
        btn.setAttribute('aria-label','Remove from wishlist');
        showToast('Added to wishlist ❤️');
      }
      saveWishlist();
    });
  });
}

/* ──────────────────────────────────────────────────────────
   6. PROPERTY DETAIL MODAL
────────────────────────────────────────────────────────── */
function openModal(propId) {
  const prop = SITE_CONFIG.properties.find(p => p.id === propId);
  if (!prop) return;
  STATE.currentProperty     = prop;
  STATE.currentGalleryIndex = 0;
  STATE.currentGalleryMode  = 'photos';

  buildModalContent(prop);

  const overlay = $('#property-modal');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#modal-box').focus?.(), 100);
}

function closeModal() {
  $('#property-modal').classList.remove('open');
  document.body.style.overflow = '';
  STATE.currentProperty = null;
}

function buildModalContent(prop) {
  const C  = SITE_CONFIG;
  const wa = C.brand.whatsappNumber;
  const es = C.enableSections;

  /* ── Gallery ── */
  updateGalleryImage(prop, 0, 'photos');

  // Thumbnails
  $('#gallery-thumbs').innerHTML = prop.images.map((img, i) => `
    <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" role="button" tabindex="0" aria-label="Photo ${i+1}">
      <img src="${esc(img)}" alt="Property photo ${i+1}" loading="lazy" />
    </div>`).join('');

  $$('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      STATE.currentGalleryMode  = 'photos';
      STATE.currentGalleryIndex = parseInt(thumb.dataset.idx);
      updateGalleryImage(prop, STATE.currentGalleryIndex, 'photos');
      $$('.gallery-thumb').forEach(t => t.classList.toggle('active', t === thumb));
      $$('.gal-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'photos'));
    });
  });

  /* Gallery tabs */
  $$('.gal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.gal-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      STATE.currentGalleryMode = tab.dataset.tab;
      updateGalleryImage(prop, STATE.currentGalleryIndex, tab.dataset.tab);
    });
  });

  /* ── Main content ── */
  const isBuy  = prop.category === 'Buy';
  const isRent = prop.category === 'Rent';
  const isComm = prop.category === 'Commercial';

  $('#modal-main').innerHTML = `
    <!-- Title & Price -->
    <div class="modal-title">${esc(prop.title)}</div>
    <div class="modal-loc">📍 ${esc(prop.location)}</div>
    <div class="modal-price">${esc(prop.priceDisplay)}</div>

    <!-- Specs Grid -->
    <div class="specs-grid">
      <div class="spec-item"><div class="spec-label">Area</div><div class="spec-val">${esc(String(prop.areaSqFt))} sq.ft.</div></div>
      <div class="spec-item"><div class="spec-label">Configuration</div><div class="spec-val">${esc(prop.configuration)}</div></div>
      <div class="spec-item"><div class="spec-label">Status</div><div class="spec-val">${esc(prop.status)}</div></div>
      <div class="spec-item"><div class="spec-label">Category</div><div class="spec-val">${esc(prop.category)} — ${esc(prop.propertyType)}</div></div>
      <div class="spec-item"><div class="spec-label">Property ID</div><div class="spec-val">${esc(prop.id)}</div></div>
      <div class="spec-item"><div class="spec-label">RERA ID</div><div class="spec-val">${esc(prop.reraId)}</div></div>
    </div>

    <!-- Amenities -->
    <div class="modal-section-title">Amenities</div>
    <div class="amenities-list">
      ${prop.amenities.map(a => `<span class="amenity-tag">✓ ${esc(a)}</span>`).join('')}
    </div>

    <!-- Highlights -->
    <div class="modal-section-title">Key Highlights</div>
    <div class="highlights-list">
      ${prop.highlights.map(h => `<div class="highlight-item">${esc(h)}</div>`).join('')}
    </div>

    <!-- Location Intelligence -->
    ${es.showLocationIntelligence ? `
    <div class="location-intel">
      <div class="modal-section-title">📍 Location Intelligence</div>
      <div class="landmark-list">
        ${prop.nearbyLandmarks.map(lm => `
          <div class="landmark-item">
            <span class="landmark-name">${esc(lm.name)}</span>
            <span class="landmark-dist">📍 ${esc(lm.distance)}</span>
            <span class="landmark-time">🕐 ${esc(lm.time)}</span>
          </div>`).join('')}
      </div>
    </div>` : ''}

    <!-- WhatsApp Inquiry -->
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
      <a href="${waLink(wa, propertyWaMsg(prop))}"
         class="btn btn-wa" target="_blank" rel="noopener">
        💬 WhatsApp Inquiry
      </a>
      <a href="tel:${esc(C.brand.phone)}" class="btn btn-outline">
        📞 Call Now
      </a>
    </div>`;

  /* ── Sidebar ── */
  let sidebarHTML = '';

  /* EMI Calculator — Buy properties */
  if (es.showCalculators && isBuy) {
    const loanAmt = Math.round(prop.priceNumeric * 0.8);
    sidebarHTML += `
      <div class="calculator-box">
        <div class="calc-title">🏦 Home Loan EMI Calculator</div>

        <div class="calc-field">
          <label for="emi-loan">Loan Amount (₹ Lakhs)</label>
          <input type="number" id="emi-loan" value="${loanAmt}" min="1" max="1000" step="0.5" />
        </div>
        <div class="calc-field">
          <label for="emi-rate">Interest Rate (% p.a.)</label>
          <input type="number" id="emi-rate" value="8.5" min="1" max="20" step="0.05" />
        </div>
        <div class="calc-field">
          <label for="emi-tenure">Loan Tenure (Years)</label>
          <input type="number" id="emi-tenure" value="20" min="1" max="30" step="1" />
        </div>

        <div class="calc-result">
          <div class="calc-result-label">Monthly EMI</div>
          <div class="calc-result-value" id="emi-result">₹—</div>
        </div>

        <div style="margin-top:10px;font-size:0.75rem;color:var(--text-light);line-height:1.5;">
          *Indicative only. Actual EMI depends on bank terms.
        </div>
      </div>`;
  }

  /* Rental Yield Calculator — Rent/Commercial */
  if (es.showCalculators && (isRent || isComm)) {
    sidebarHTML += `
      <div class="calculator-box">
        <div class="calc-title">📈 Rental Yield Estimator</div>

        <div class="calc-field">
          <label for="yield-price">Property Value (₹ Lakhs)</label>
          <input type="number" id="yield-price" value="${isBuy ? prop.priceNumeric : 60}" min="1" step="1" />
        </div>
        <div class="calc-field">
          <label for="yield-rent">Monthly Rent (₹)</label>
          <input type="number" id="yield-rent" value="${prop.priceNumeric}" min="1000" step="500" />
        </div>

        <div class="calc-result">
          <div class="calc-result-label">Annual Rental Yield</div>
          <div class="calc-result-value" id="yield-result">—%</div>
        </div>
      </div>`;
  }

  /* Site Visit Form */
  sidebarHTML += `
    <div class="visit-form-box">
      <div class="calc-title">🗓️ Schedule a Site Visit</div>

      <form id="site-visit-form" novalidate>
        <div class="form-field">
          <label for="sv-name">Your Name *</label>
          <input type="text" id="sv-name" placeholder="Ravi Kumar" required />
        </div>
        <div class="form-field">
          <label for="sv-phone">Phone Number *</label>
          <input type="tel" id="sv-phone" placeholder="+91 98765 43210" required />
        </div>
        <div class="form-field">
          <label for="sv-date">Preferred Date</label>
          <input type="date" id="sv-date" min="${new Date().toISOString().slice(0,10)}" />
        </div>
        <div class="form-field">
          <label for="sv-time">Preferred Time</label>
          <input type="time" id="sv-time" value="10:00" />
        </div>
        <div class="form-field">
          <label for="sv-mode">Visit Mode</label>
          <select id="sv-mode">
            <option value="In-Person">🏠 In-Person Visit</option>
            <option value="Video Call">💻 Video Call Tour</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">📱 Book via WhatsApp</button>
      </form>
    </div>`;

  $('#modal-sidebar').innerHTML = sidebarHTML;

  /* Init Calculators */
  if (es.showCalculators && isBuy) {
    const calcEMI = () => {
      const P = parseFloat($('#emi-loan').value)   * 100000;
      const r = parseFloat($('#emi-rate').value)   / 1200;
      const n = parseInt($('#emi-tenure').value)   * 12;
      if (!P || !r || !n) { $('#emi-result').textContent = '₹—'; return; }
      const emi = (P * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
      $('#emi-result').textContent = '₹' + Math.round(emi).toLocaleString('en-IN');
    };
    ['emi-loan','emi-rate','emi-tenure'].forEach(id => {
      const el = $(`#${id}`);
      if (el) el.addEventListener('input', calcEMI);
    });
    calcEMI();
  }

  if (es.showCalculators && (isRent || isComm)) {
    const calcYield = () => {
      const price = parseFloat($('#yield-price').value) * 100000;
      const rent  = parseFloat($('#yield-rent').value)  * 12;
      if (!price || !rent) { $('#yield-result').textContent = '—%'; return; }
      const pct = (rent / price * 100).toFixed(2);
      $('#yield-result').textContent = pct + '%';
    };
    ['yield-price','yield-rent'].forEach(id => {
      const el = $(`#${id}`);
      if (el) el.addEventListener('input', calcYield);
    });
    calcYield();
  }

  /* Site Visit Form submit */
  const svForm = $('#site-visit-form');
  if (svForm) {
    svForm.addEventListener('submit', e => {
      e.preventDefault();
      const name  = $('#sv-name').value.trim();
      const phone = $('#sv-phone').value.trim();
      const date  = $('#sv-date').value;
      const time  = $('#sv-time').value;
      const mode  = $('#sv-mode').value;

      if (!name || !phone) {
        showToast('⚠️ Please fill Name & Phone');
        return;
      }

      const msg = `Hi ${C.brand.companyName}! I'd like to schedule a site visit.\n\n` +
        `🏠 *Property:* ${prop.title} (${prop.id})\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        (date ? `📅 *Date:* ${date}\n` : '') +
        (time ? `🕐 *Time:* ${time}\n` : '') +
        `🎯 *Mode:* ${mode}\n\n` +
        `Please confirm the appointment. Thank you!`;

      window.open(waLink(wa, msg), '_blank', 'noopener,noreferrer');
      showToast('✅ Opening WhatsApp…');
    });
  }
}

function updateGalleryImage(prop, idx, mode) {
  const img = $('#gallery-main-img');
  if (mode === 'floorplan') {
    img.src = prop.floorPlanUrl;
    img.alt = 'Floor plan';
  } else {
    img.src = prop.images[idx] || prop.images[0];
    img.alt = `${prop.title} — Photo ${idx + 1}`;
  }
}

function initModal() {
  /* Close on button */
  $('#modal-close-btn').addEventListener('click', closeModal);

  /* Close on overlay click */
  $('#property-modal').addEventListener('click', e => {
    if (e.target === $('#property-modal')) closeModal();
  });

  /* Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && $('#property-modal').classList.contains('open')) {
      closeModal();
    }
    // Arrow keys for gallery navigation
    if ($('#property-modal').classList.contains('open') && STATE.currentProperty) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const imgs = STATE.currentProperty.images;
        const len  = imgs.length;
        if (e.key === 'ArrowRight') STATE.currentGalleryIndex = (STATE.currentGalleryIndex + 1) % len;
        else                        STATE.currentGalleryIndex = (STATE.currentGalleryIndex - 1 + len) % len;
        updateGalleryImage(STATE.currentProperty, STATE.currentGalleryIndex, 'photos');
        STATE.currentGalleryMode = 'photos';
        $$('.gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === STATE.currentGalleryIndex));
        $$('.gal-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'photos'));
      }
    }
  });
}

/* ──────────────────────────────────────────────────────────
   7. FLOOR STACK EXPLORER
────────────────────────────────────────────────────────── */
function buildFloorStack() {
  if (!SITE_CONFIG.enableSections.showFloorStack) {
    const sec = document.getElementById('floor-stack');
    if (sec) sec.style.display = 'none';
    return;
  }

  const floors = SITE_CONFIG.floorStack;
  const visual = $('#floor-stack-visual');

  visual.innerHTML = floors.map((f, i) => `
    <div class="floor-level ${i === 0 ? 'active' : ''}"
         data-idx="${i}"
         role="listitem"
         tabindex="0"
         aria-label="${esc(f.label)}">
      <span class="floor-icon">${f.icon}</span>
      <div class="floor-info">
        <div class="floor-label">${esc(f.level)}</div>
        <div class="floor-name">${esc(f.label)}</div>
      </div>
    </div>`).join('');

  function activateFloor(idx) {
    const f = floors[idx];
    $$('.floor-level').forEach(el => el.classList.toggle('active', parseInt(el.dataset.idx) === idx));
    $('#fdt-icon').textContent   = f.icon;
    $('#fdt-level').textContent  = f.level;
    $('#fdt-name').textContent   = f.label;
    $('#fdt-desc').textContent   = f.description;
  }

  // Show first floor by default
  activateFloor(0);

  $$('.floor-level').forEach(el => {
    el.addEventListener('click', () => activateFloor(parseInt(el.dataset.idx)));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') activateFloor(parseInt(el.dataset.idx));
    });
  });
}

/* ──────────────────────────────────────────────────────────
   8. TESTIMONIALS
────────────────────────────────────────────────────────── */
function buildTestimonials() {
  if (!SITE_CONFIG.enableSections.showTestimonials) {
    const sec = document.getElementById('testimonials');
    if (sec) sec.style.display = 'none';
    return;
  }

  $('#testimonials-grid').innerHTML = SITE_CONFIG.testimonials.map((t, i) => `
    <div class="testimonial-card fade-in-up stagger-${i % 4 + 1}">
      <div class="test-stars">${stars(t.rating)}</div>
      <p class="test-text">${esc(t.text)}</p>
      <div class="test-author">
        <img class="test-avatar" src="${esc(t.photo)}" alt="${esc(t.name)}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=60'" />
        <div>
          <div class="test-name">${esc(t.name)}</div>
          <div class="test-loc">📍 ${esc(t.location)}</div>
        </div>
      </div>
    </div>`).join('');
}

/* ──────────────────────────────────────────────────────────
   9. NEIGHBORHOOD HIGHLIGHTS
────────────────────────────────────────────────────────── */
function buildNeighborhood() {
  if (!SITE_CONFIG.enableSections.showNeighborhood) {
    const sec = document.getElementById('neighborhood');
    if (sec) sec.style.display = 'none';
    return;
  }

  $('#neighborhood-grid').innerHTML = SITE_CONFIG.neighborhoodHighlights.map((nbh, i) => `
    <div class="neighborhood-card fade-in-up stagger-${i % 4 + 1}">
      <div class="nbh-icon">${nbh.icon}</div>
      <div class="nbh-category">${esc(nbh.category)}</div>
      <div class="nbh-items">
        ${nbh.items.map(item => `<div class="nbh-item">${esc(item)}</div>`).join('')}
      </div>
    </div>`).join('');
}

/* ──────────────────────────────────────────────────────────
   10. VIDEO TOUR
────────────────────────────────────────────────────────── */
function buildVideoTour() {
  if (!SITE_CONFIG.enableSections.showVideoTour) {
    const sec = document.getElementById('video-tour');
    if (sec) sec.style.display = 'none';
    return;
  }
  const vt = SITE_CONFIG.videoTour;
  $('#video-heading').textContent   = vt.heading;
  $('#video-subheading').textContent = vt.subheading;
  $('#video-iframe').src            = vt.embedUrl;
}

/* ──────────────────────────────────────────────────────────
   11. FOOTER
────────────────────────────────────────────────────────── */
function buildFooter() {
  const B  = SITE_CONFIG.brand;
  const wa = B.whatsappNumber;

  $('#footer-grid').innerHTML = `
    <!-- Brand Column -->
    <div class="footer-brand">
      <div class="footer-logo-name">${esc(B.companyName)}</div>
      <div class="footer-tagline">${esc(B.tagline)}</div>
      <p class="footer-desc">
        A RERA-approved real estate developer committed to delivering quality homes, transparent processes,
        and lifelong relationships with our clients.
      </p>
      <div class="footer-socials">
        <a href="${esc(B.socialLinks.facebook)}"  class="social-btn" target="_blank" rel="noopener" aria-label="Facebook">f</a>
        <a href="${esc(B.socialLinks.instagram)}" class="social-btn" target="_blank" rel="noopener" aria-label="Instagram">📸</a>
        <a href="${esc(B.socialLinks.youtube)}"   class="social-btn" target="_blank" rel="noopener" aria-label="YouTube">▶</a>
        <a href="${esc(B.socialLinks.linkedin)}"  class="social-btn" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="footer-col">
      <h4>Quick Links</h4>
      <div class="footer-links">
        <a href="#hero">Home</a>
        <a href="#properties">Properties</a>
        <a href="#floor-stack">Building Explorer</a>
        <a href="#testimonials">Reviews</a>
        <a href="#neighborhood">Location</a>
        <a href="#contact">Contact</a>
      </div>
    </div>

    <!-- Property Types -->
    <div class="footer-col">
      <h4>Properties</h4>
      <div class="footer-links">
        <a href="#properties">Buy Apartments</a>
        <a href="#properties">Premium Villas</a>
        <a href="#properties">Rental Homes</a>
        <a href="#properties">Office Spaces</a>
        <a href="#properties">Retail Shops</a>
        <a href="#properties">PG / Co-living</a>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="footer-col">
      <h4>Contact</h4>
      <div class="footer-links">
        <a href="tel:${esc(B.phone)}">📞 ${esc(B.phone)}</a>
        <a href="${waLink(wa,'Hi!')}" target="_blank" rel="noopener">💬 WhatsApp</a>
        <a href="mailto:${esc(B.email)}">✉️ ${esc(B.email)}</a>
        <a href="#contact">📍 ${esc(B.officeAddress)}</a>
      </div>
    </div>`;

  $('#footer-bottom').innerHTML = `
    <span>${esc(B.footerText)}</span>
    <span class="footer-rera">RERA: ${esc(B.reraNumber)}</span>`;
}

/* ──────────────────────────────────────────────────────────
   12. CONTACT FORM
────────────────────────────────────────────────────────── */
function initContactForm() {
  if (!SITE_CONFIG.enableSections.showContactForm) {
    const sec = document.getElementById('contact');
    if (sec) sec.style.display = 'none';
    return;
  }

  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name     = $('#cf-name').value.trim();
    const phone    = $('#cf-phone').value.trim();
    const email    = $('#cf-email').value.trim();
    const interest = $('#cf-interest').value;
    const budget   = $('#cf-budget').value;
    const message  = $('#cf-message').value.trim();
    const B        = SITE_CONFIG.brand;
    const wa       = B.whatsappNumber;

    if (!name || !phone) {
      showToast('⚠️ Name and Phone are required');
      return;
    }

    const msg = `Hi ${B.companyName}! I'd like a free property consultation.\n\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      (email    ? `✉️ *Email:* ${email}\n` : '') +
      (interest ? `🏠 *Looking For:* ${interest}\n` : '') +
      (budget   ? `💰 *Budget:* ${budget}\n` : '') +
      (message  ? `\n💬 *Message:* ${message}\n` : '') +
      `\nPlease contact me at your earliest convenience. Thank you!`;

    window.open(waLink(wa, msg), '_blank', 'noopener,noreferrer');
    showToast('✅ Opening WhatsApp…');
    form.reset();
  });
}

/* ──────────────────────────────────────────────────────────
   13. INTERSECTION OBSERVER (Scroll Animations)
────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all
    $$('.fade-in-up').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  // Observe existing static fade-in-up elements
  $$('.fade-in-up:not(.property-card)').forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────────────────────
   14. SECTION VISIBILITY TOGGLES
────────────────────────────────────────────────────────── */
function applySectionToggles() {
  const es = SITE_CONFIG.enableSections;
  const toggles = [
    ['#properties',   es.showPropertyGrid],
    ['#floor-stack',  es.showFloorStack],
    ['#testimonials', es.showTestimonials],
    ['#neighborhood', es.showNeighborhood],
    ['#video-tour',   es.showVideoTour],
    ['#contact',      es.showContactForm],
  ];
  toggles.forEach(([sel, show]) => {
    const el = document.querySelector(sel);
    if (el && !show) el.style.display = 'none';
  });
}

/* ──────────────────────────────────────────────────────────
   15. BOOT
────────────────────────────────────────────────────────── */
function boot() {
  /* 1. Meta tags */
  initMeta();

  /* 2. Apply section toggles immediately */
  applySectionToggles();

  /* 3. Build all sections */
  buildHeader();
  buildHero();
  buildFilters();
  renderProperties();
  buildFloorStack();
  buildTestimonials();
  buildNeighborhood();
  buildVideoTour();
  buildFooter();

  /* 4. Init modal & contact form */
  initModal();
  initContactForm();

  /* 5. Scroll animations */
  initScrollAnimations();

  console.log(
    `%c${SITE_CONFIG.brand.companyName} %c— Website loaded successfully ✓`,
    'color:#1a3c5e;font-weight:bold;font-size:14px;',
    'color:#c8923a;font-weight:600;font-size:14px;'
  );
}

/* Run when DOM is ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
