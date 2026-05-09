/* ============================================
   PACKCRAFT — app.js  COMPLETE
   ============================================ */

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
const cart = [];
let bonusPoints   = 12450;
let bonusDiscount = 0;
let map = null, mapMarker = null;

// ─────────────────────────────────────────────
// PAGE ROUTER
// ─────────────────────────────────────────────
const PAGES = ['home','process','backpacks','wallets','tshirts','hoodies',
               'checkout','success','bonus','business'];

function showPage(name) {
  const target = document.getElementById(`page-${name}`);
  if (!target) return;
  PAGES.forEach(p => {
    const el = document.getElementById(`page-${p}`);
    if (el) el.classList.remove('active');
  });
  target.classList.add('active');
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === name);
  });
  window.scrollTo(0, 0);
  if (name === 'checkout') { renderCheckout(); setTimeout(initMap, 250); }
}

// ─────────────────────────────────────────────
// GLOBAL DATA-PAGE DELEGATION
// Skip: upload inputs, resize panel buttons, exchange/tier btns handled separately
// ─────────────────────────────────────────────
document.addEventListener('click', e => {
  // Never hijack file inputs or panel-internal buttons
  if (e.target.closest('.upload-file-input'))  return;
  if (e.target.closest('.resize-action-btn'))  return;
  if (e.target.closest('.img-resize-panel input')) return;
  if (e.target.closest('.exchange-btn'))       return;
  if (e.target.closest('.biz-tier-btn'))       return;
  if (e.target.closest('#biz-submit-btn'))     return;
  if (e.target.closest('#biz-contact-btn'))    return;
  if (e.target.closest('#biz-catalog-btn'))    return;
  if (e.target.closest('#join-challenge-btn')) return;
  if (e.target.closest('.tactical-card .btn-primary')) return;

  const el = e.target.closest('[data-page]');
  if (!el) return;
  showPage(el.dataset.page);
});

// ─────────────────────────────────────────────
// FOOTER / NAV PLAIN LINKS  (prevent scroll jump)
// ─────────────────────────────────────────────
document.querySelectorAll('a[href="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const txt = a.textContent.trim();
    const map = { Backpacks:'backpacks', Wallets:'wallets', 'T-Shirts':'tshirts', Hoodies:'hoodies' };
    if (map[txt]) showPage(map[txt]);
    else showToast(`${txt} — coming soon!`);
  });
});

// ─────────────────────────────────────────────
// CONFIGURATOR — Option cards
// ─────────────────────────────────────────────
document.querySelectorAll('.option-cards').forEach(group => {
  group.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      group.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });
});

// ─────────────────────────────────────────────
// CONFIGURATOR — Color swatches
// ─────────────────────────────────────────────
document.querySelectorAll('.color-selector').forEach(sel => {
  sel.querySelectorAll('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      sel.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      sw.classList.add('selected');
      sw.animate([{transform:'scale(1.3)'},{transform:'scale(1)'}],{duration:200});
    });
  });
});

// ─────────────────────────────────────────────
// CONFIGURATOR — Tag selectors
// ─────────────────────────────────────────────
document.querySelectorAll('.tag-selector').forEach(group => {
  group.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
      group.querySelectorAll('.tag').forEach(t => t.classList.remove('selected'));
      tag.classList.add('selected');
    });
  });
});

// ─────────────────────────────────────────────
// CONFIGURATOR — Size buttons
// ─────────────────────────────────────────────
document.querySelectorAll('.size-selector').forEach(group => {
  group.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
});

// ─────────────────────────────────────────────
// CONFIGURATOR — Preview controls (zoom/rotate/flip)
// ─────────────────────────────────────────────
const previewStates = {};
document.querySelectorAll('.config-preview').forEach((preview, idx) => {
  previewStates[idx] = { zoom:1, rotate:0, flipX:false };
  const img  = preview.querySelector('.product-img');
  const btns = preview.querySelectorAll('.ctrl-btn');
  if (!img || !btns.length) return;
  btns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const st = previewStates[idx];
      if      (i === 0) { st.zoom   = st.zoom === 1 ? 1.22 : 1; }
      else if (i === 1) { st.rotate = (st.rotate + 90) % 360; }
      else              { st.flipX  = !st.flipX; }
      img.style.transition = 'transform .35s ease';
      img.style.transform  = `scale(${st.flipX ? -st.zoom : st.zoom}, ${st.zoom}) rotate(${st.rotate}deg)`;
    });
  });
});

// ─────────────────────────────────────────────
// CONFIGURATOR — Live prices
// ─────────────────────────────────────────────
document.querySelectorAll('#page-backpacks .option-card').forEach((c,i) =>
  c.addEventListener('click', () => {
    const el = document.getElementById('bp-price');
    if (el) el.textContent = ['$495.00','$395.00'][i] ?? '$495.00';
  }));

document.querySelectorAll('#page-wallets .option-card').forEach((c,i) =>
  c.addEventListener('click', () => {
    const el = document.getElementById('wl-price');
    if (el) el.textContent = ['$145.00','$195.00'][i] ?? '$145.00';
  }));

document.querySelectorAll('#page-hoodies .option-card').forEach((c,i) =>
  c.addEventListener('click', () => {
    const v = ['$24.00','$34.00'][i] ?? '$24.00';
    const p = document.getElementById('hd-price'), s = document.getElementById('hd-sub');
    if (p) p.textContent = v;
    if (s) s.textContent = v;
  }));

document.querySelectorAll('#page-tshirts .size-btn').forEach((b,i) =>
  b.addEventListener('click', () => {
    const el = document.getElementById('ts-price');
    if (el) el.textContent = ['$12.00','$14.00','$14.00','$16.00'][i] ?? '$14.00';
  }));

// ─────────────────────────────────────────────
// CONFIGURATOR — Reset Design
// ─────────────────────────────────────────────
document.querySelectorAll('.btn-reset').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.closest('.config-panel');
    if (!panel) return;
    panel.querySelectorAll('.option-cards .option-card').forEach((c,i) => c.classList.toggle('selected', i===0));
    panel.querySelectorAll('.color-selector .color-swatch').forEach((c,i) => c.classList.toggle('selected', i===0));
    panel.querySelectorAll('.size-selector .size-btn').forEach((b,i) => b.classList.toggle('selected', i===1));
    panel.querySelectorAll('.tag-selector .tag').forEach((t,i) => t.classList.toggle('selected', i===0));
    panel.querySelectorAll('.config-input').forEach(inp => inp.value = '');
    const p = document.getElementById('hd-price'), s = document.getElementById('hd-sub');
    if (p) p.textContent = '$24.00';
    if (s) s.textContent = '$24.00';
    const img = btn.closest('.config-layout')?.querySelector('.product-img');
    if (img) img.style.transform = '';
    showToast('Design reset to defaults.');
  });
});

// ─────────────────────────────────────────────
// CART — Add to cart buttons
// ─────────────────────────────────────────────
function addToCart(item) {
  cart.push(item);
  updateCartBadge();
  showToast(`${item.name} added to cart!`);
}

document.getElementById('bp-add')?.addEventListener('click', () => {
  const mat   = document.querySelector('#page-backpacks .option-card.selected strong')?.textContent || 'DYNEEMA';
  const price = parseFloat(document.getElementById('bp-price')?.textContent.replace('$','')) || 495;
  addToCart({ name:'NOCTURNE_01 Backpack', detail:mat, price, emoji:'🎒' });
});

document.getElementById('wl-add')?.addEventListener('click', () => {
  const mat   = document.querySelector('#page-wallets .option-card.selected strong')?.textContent || 'CARBON FIBER';
  const price = parseFloat(document.getElementById('wl-price')?.textContent.replace('$','')) || 145;
  addToCart({ name:'CIPHER_W1 Wallet', detail:mat, price, emoji:'👜' });
});

document.getElementById('ts-add')?.addEventListener('click', () => {
  const size  = document.querySelector('#page-tshirts .size-btn.selected')?.textContent || 'M';
  const price = parseFloat(document.getElementById('ts-price')?.textContent.replace('$','')) || 14;
  addToCart({ name:'NT-01 CHASSIS Tshirt', detail:`SIZE: ${size}`, price, emoji:'👕' });
});

document.getElementById('hd-add')?.addEventListener('click', () => {
  const fab   = document.querySelector('#page-hoodies .option-card.selected strong')?.textContent || 'Premium Fleece';
  const price = parseFloat(document.getElementById('hd-price')?.textContent.replace('$','')) || 24;
  addToCart({ name:'NOCTURNE_H1 Hoodie', detail:fab, price, emoji:'🧥' });
});

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
const toastEl  = document.getElementById('cart-toast');
const toastMsg = document.getElementById('toast-msg');
let toastTimer = null;

function showToast(msg) {
  toastMsg.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
}

document.getElementById('toast-checkout')?.addEventListener('click', () => {
  toastEl.classList.remove('show');
  showPage('checkout');
});

// ─────────────────────────────────────────────
// CART BADGE
// ─────────────────────────────────────────────
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const count = document.getElementById('cart-count');
  if (!badge || !count) return;
  count.textContent    = cart.length;
  badge.style.display  = cart.length > 0 ? 'block' : 'none';
}

// ─────────────────────────────────────────────
// CHECKOUT — Render
// ─────────────────────────────────────────────
function renderCheckout() {
  const itemsEl    = document.getElementById('checkout-items');
  const subtotalEl = document.getElementById('co-subtotal');
  const taxEl      = document.getElementById('co-tax');
  const totalEl    = document.getElementById('co-total');
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div style="text-align:center;padding:2rem 0">
        <div style="font-size:2rem;margin-bottom:.5rem">🛒</div>
        <p style="color:var(--muted);font-size:.8rem;font-family:var(--font-mono);margin-bottom:1rem">Cart is empty.</p>
        <button class="btn-primary" style="font-size:.65rem" data-page="backpacks">SHOP NOW</button>
      </div>`;
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    if (taxEl)      taxEl.textContent      = '$0.00';
    if (totalEl)    totalEl.textContent    = '$0.00';
    return;
  }

  itemsEl.innerHTML = cart.map((item, idx) => `
    <div class="checkout-item">
      <div class="checkout-item-thumb">${item.emoji}</div>
      <div class="checkout-item-info">
        <div class="checkout-item-name">${item.name}</div>
        <div class="checkout-item-qty">${item.detail} · QTY: 1</div>
      </div>
      <div style="display:flex;align-items:center;gap:.4rem">
        <div class="checkout-item-price">$${item.price.toFixed(2)}</div>
        <button class="remove-item-btn" data-idx="${idx}" title="Remove">✕</button>
      </div>
    </div>`).join('');

  itemsEl.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.splice(parseInt(btn.dataset.idx), 1);
      updateCartBadge();
      renderCheckout();
    });
  });

  const subtotal = cart.reduce((s,i) => s + i.price, 0);
  const tax      = subtotal * 0.08;
  const total    = Math.max(0, subtotal + tax - bonusDiscount);
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl)      taxEl.textContent      = `$${tax.toFixed(2)}`;
  if (totalEl)    totalEl.textContent    = `$${total.toFixed(2)}`;

  // Bonus discount row
  let discRow = document.getElementById('co-discount-row');
  if (bonusDiscount > 0) {
    if (!discRow) {
      discRow = document.createElement('div');
      discRow.id = 'co-discount-row';
      discRow.className = 'subtotal-row';
      discRow.innerHTML = `<span style="color:var(--green)">Bonus Discount</span><span style="color:var(--green)" id="co-disc-val"></span>`;
      document.querySelector('.checkout-subtotals')?.appendChild(discRow);
    }
    const dv = document.getElementById('co-disc-val');
    if (dv) dv.textContent = `-$${bonusDiscount.toFixed(2)}`;
  } else if (discRow) {
    discRow.remove();
  }
}

// ─────────────────────────────────────────────
// MAP — Checkout delivery
// ─────────────────────────────────────────────
function initMap() {
  if (map) { map.invalidateSize(); return; }
  const container = document.getElementById('map-container');
  if (!container || !window.L) return;

  map = L.map('map-container').setView([41.2995, 69.2401], 11);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO', maxZoom: 19
  }).addTo(map);

  const greenIcon = L.divIcon({
    html: `<div style="width:16px;height:16px;background:#2dff6e;border-radius:50%;border:2px solid #fff;box-shadow:0 0 8px rgba(45,255,110,.7)"></div>`,
    iconSize:[16,16], iconAnchor:[8,8], className:''
  });

  map.on('click', e => {
    const { lat, lng } = e.latlng;
    if (mapMarker) map.removeLayer(mapMarker);
    mapMarker = L.marker([lat, lng], { icon: greenIcon }).addTo(map);
    const latEl  = document.getElementById('co-latitude');
    const lngEl  = document.getElementById('co-longitude');
    const locEl  = document.getElementById('co-location-text');
    const dispEl = document.getElementById('location-display');
    if (latEl)  latEl.value  = lat.toFixed(6);
    if (lngEl)  lngEl.value  = lng.toFixed(6);
    const txt = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
    if (locEl)  locEl.value  = txt;
    if (dispEl) { dispEl.textContent = `📍 ${txt}`; dispEl.style.color = 'var(--green)'; }
  });

  map.invalidateSize();
}

// ─────────────────────────────────────────────
// CHECKOUT — Send Order button
// ─────────────────────────────────────────────
document.getElementById('pay-btn')?.addEventListener('click', () => {
  if (cart.length === 0) { showToast('Your cart is empty — add items first!'); return; }

  const nameEl  = document.getElementById('co-name');
  const phoneEl = document.getElementById('co-phone');
  const latEl   = document.getElementById('co-latitude');
  let ok = true;

  [nameEl, phoneEl].forEach(inp => {
    if (!inp) return;
    const empty = !inp.value.trim();
    inp.style.borderColor = empty ? 'rgba(255,80,80,.6)' : '';
    if (empty) ok = false;
  });

  if (!latEl?.value) {
    const disp = document.getElementById('location-display');
    if (disp) { disp.style.color = 'rgba(255,80,80,.8)'; disp.textContent = '📍 Please tap the map to select your location'; }
    ok = false;
  }

  if (!ok) { showToast('Please fill all fields and select a location.'); return; }

  const snapshot = [...cart];
  cart.length   = 0;
  bonusDiscount = 0;
  bonusPoints  += 1250;
  updateCartBadge();
  renderSuccess(snapshot);
  showPage('success');
});

// ─────────────────────────────────────────────
// SUCCESS PAGE — Render
// ─────────────────────────────────────────────
function renderSuccess(snapshot) {
  const items      = document.getElementById('success-items');
  const subtotalEl = document.getElementById('su-subtotal');
  const totalEl    = document.getElementById('su-total');
  const orderEl    = document.querySelector('.success-order');
  if (!items) return;

  const displayCart = (snapshot?.length > 0) ? snapshot : [
    { name:'Custom Leather Backpack', detail:'QTY: 1', price:145, emoji:'🎒' },
    { name:'Minimalist Wallet',       detail:'QTY: 1', price:20,  emoji:'👜' }
  ];

  if (orderEl) orderEl.textContent = `ORDER #CYO-${Math.floor(100000 + Math.random()*900000)}`;

  items.innerHTML = displayCart.map(item => `
    <div class="checkout-item">
      <div class="checkout-item-thumb">${item.emoji}</div>
      <div class="checkout-item-info">
        <div class="checkout-item-name">${item.name}</div>
        <div class="checkout-item-qty">${item.detail}</div>
      </div>
      <div class="checkout-item-price">$${item.price.toFixed(2)}</div>
    </div>`).join('');

  const total = displayCart.reduce((s,i) => s + i.price, 0);
  if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;
  if (totalEl)    totalEl.textContent    = `$${total.toFixed(2)}`;
}

// ─────────────────────────────────────────────
// BONUS PAGE
// ─────────────────────────────────────────────
function renderBonusBalance() {
  const el = document.querySelector('.balance-num');
  if (el) el.innerHTML = `${bonusPoints.toLocaleString()} <span class="balance-unit">NP</span>`;
}

// Exchange buttons
document.querySelectorAll('.exchange-btn').forEach((btn, i) => {
  const costs = [100, 200], discounts = [5, 12];
  btn.addEventListener('click', e => {
    e.stopPropagation();
    if (bonusPoints < costs[i]) { showToast(`You need ${costs[i]} NP for this exchange.`); return; }
    bonusPoints   -= costs[i];
    bonusDiscount  = discounts[i];
    renderBonusBalance();
    btn.textContent = '✓'; btn.style.color = 'var(--green)';
    setTimeout(() => { btn.textContent = '⇄'; btn.style.color = ''; }, 2000);
    showToast(`$${discounts[i]} discount applied to your next order! ✓`);
  });
});

// Sync Progress (tactical cycle)
document.querySelectorAll('.tactical-card .btn-primary').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const dots   = document.querySelectorAll('.tdot');
    const filled = document.querySelectorAll('.tdot-filled').length;
    if (filled >= dots.length) {
      dots.forEach(d => d.classList.remove('tdot-filled'));
      bonusPoints += 250;
      renderBonusBalance();
      showToast('Cycle complete! +250 NP awarded 🎉');
    } else {
      dots[filled]?.classList.add('tdot-filled');
      showToast('Progress synced!');
    }
  });
});

// ─────────────────────────────────────────────
// IMAGE UPLOAD + RESIZE SYSTEM
// ─────────────────────────────────────────────
const imgState = {};
['backpack','wallet','tshirt','hoodie'].forEach(p => {
  imgState[p] = { size:55, x:0, y:0 };
});

function applyImgTransform(product) {
  const preview = document.getElementById(`preview-${product}`);
  if (!preview) return;
  const { size, x, y } = imgState[product];
  preview.style.width     = `${size}%`;
  preview.style.height    = 'auto';
  preview.style.top       = `calc(50% + ${y}%)`;
  preview.style.left      = `calc(50% + ${x}%)`;
  preview.style.transform = 'translate(-50%, -50%)';
  const sv = document.getElementById(`rv-size-${product}`);
  const xv = document.getElementById(`rv-x-${product}`);
  const yv = document.getElementById(`rv-y-${product}`);
  if (sv) sv.textContent = `${size}%`;
  if (xv) xv.textContent = x > 0 ? `+${x}` : `${x}`;
  if (yv) yv.textContent = y > 0 ? `+${y}` : `${y}`;
}

function loadImage(file, area, preview, product) {
  const reader = new FileReader();
  reader.onload = e => {
    preview.src = e.target.result;
    area.classList.add('has-image');
    imgState[product] = { size:55, x:0, y:0 };
    ['size','x','y'].forEach(axis => {
      const sl = document.getElementById(`rs-${axis}-${product}`);
      if (sl) sl.value = imgState[product][axis];
    });
    applyImgTransform(product);
  };
  reader.readAsDataURL(file);
}

function clearImage(areaEl, previewEl, fileEl, product) {
  areaEl.classList.remove('has-image');
  previewEl.src = '';
  fileEl.value  = '';
  imgState[product] = { size:55, x:0, y:0 };
}

['backpack','wallet','tshirt','hoodie'].forEach(product => {
  const areaEl    = document.getElementById(`upload-area-${product}`);
  const fileEl    = document.getElementById(`file-${product}`);
  const previewEl = document.getElementById(`preview-${product}`);
  const removeEl  = document.getElementById(`remove-${product}`);
  if (!areaEl || !fileEl || !previewEl || !removeEl) return;

  fileEl.addEventListener('change', () => {
    if (fileEl.files[0]) loadImage(fileEl.files[0], areaEl, previewEl, product);
  });

  areaEl.addEventListener('dragover',  e => { e.preventDefault(); areaEl.classList.add('drag-over'); });
  areaEl.addEventListener('dragleave', ()  => areaEl.classList.remove('drag-over'));
  areaEl.addEventListener('drop', e => {
    e.preventDefault(); areaEl.classList.remove('drag-over');
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith('image/')) loadImage(f, areaEl, previewEl, product);
  });

  removeEl.addEventListener('click', e => {
    e.stopPropagation(); e.preventDefault();
    clearImage(areaEl, previewEl, fileEl, product);
  });

  // Sliders
  ['size','x','y'].forEach(axis => {
    const slider = document.getElementById(`rs-${axis}-${product}`);
    if (!slider) return;
    slider.addEventListener('input', () => {
      imgState[product][axis] = parseInt(slider.value);
      applyImgTransform(product);
    });
  });

  // Panel buttons
  document.getElementById(`rb-change-${product}`)?.addEventListener('click', e => {
    e.stopPropagation(); fileEl.click();
  });
  document.getElementById(`rb-reset-${product}`)?.addEventListener('click', e => {
    e.stopPropagation();
    imgState[product] = { size:55, x:0, y:0 };
    ['size','x','y'].forEach(axis => {
      const sl = document.getElementById(`rs-${axis}-${product}`);
      if (sl) sl.value = imgState[product][axis];
    });
    applyImgTransform(product);
  });
  document.getElementById(`rb-del-${product}`)?.addEventListener('click', e => {
    e.stopPropagation();
    clearImage(areaEl, previewEl, fileEl, product);
  });
});

// ─────────────────────────────────────────────
// HAMBURGER MENU
// ─────────────────────────────────────────────
const menuBtn     = document.querySelector('.nav-menu-btn');
const mobileMenu  = document.getElementById('mobile-menu');
const menuOverlay = document.getElementById('menu-overlay');

function openMenu()  { mobileMenu.classList.add('open');    menuOverlay.classList.add('open');    menuBtn.classList.add('active'); }
function closeMenu() { mobileMenu.classList.remove('open'); menuOverlay.classList.remove('open'); menuBtn.classList.remove('active'); }

menuBtn?.addEventListener('click', () => mobileMenu.classList.contains('open') ? closeMenu() : openMenu());
menuOverlay?.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const page = link.dataset.page;
    closeMenu();
    setTimeout(() => showPage(page), 300);
  });
});

// ─────────────────────────────────────────────
// FOR BUSINESS PAGE
// ─────────────────────────────────────────────

// Hero CTA buttons
document.getElementById('biz-contact-btn')?.addEventListener('click', e => {
  e.stopPropagation();
  document.getElementById('biz-contact-section')?.scrollIntoView({ behavior:'smooth' });
});

document.getElementById('biz-catalog-btn')?.addEventListener('click', e => {
  e.stopPropagation();
  document.querySelector('.biz-catalog')?.scrollIntoView({ behavior:'smooth' });
});

// Pricing tier buttons — each navigates differently
document.querySelectorAll('.biz-tier-btn').forEach((btn, i) => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    if (i === 0) {
      // Starter — go to shop
      showPage('backpacks');
    } else if (i === 1) {
      // Professional — show toast + go to shop
      showToast('Starting Professional onboarding... 🚀');
      setTimeout(() => showPage('backpacks'), 800);
    } else {
      // Enterprise — scroll to contact form
      document.getElementById('biz-contact-section')?.scrollIntoView({ behavior:'smooth' });
    }
  });
});

// Business inquiry form — tag selector
document.getElementById('biz-order-size')?.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', () => {
    document.getElementById('biz-order-size').querySelectorAll('.tag').forEach(t => t.classList.remove('selected'));
    tag.classList.add('selected');
  });
});

// Business inquiry — submit
document.getElementById('biz-submit-btn')?.addEventListener('click', e => {
  e.stopPropagation();
  const company = document.getElementById('biz-company');
  const name    = document.getElementById('biz-name');
  const email   = document.getElementById('biz-email');
  const msg     = document.getElementById('biz-message');
  let ok = true;

  [company, name, email].forEach(el => {
    if (!el) return;
    const empty = !el.value.trim();
    el.style.borderColor = empty ? 'rgba(255,80,80,.6)' : '';
    if (empty) ok = false;
  });

  if (!ok) { showToast('Please fill in all required fields.'); return; }

  const submitBtn = document.getElementById('biz-submit-btn');
  submitBtn.textContent = '✓ INQUIRY SENT!';
  submitBtn.style.background = '#1a9940';
  showToast('Inquiry sent! B2B team will contact you within 24h 🤝');
  [company, name, email, msg].forEach(el => { if (el) el.value = ''; });
  setTimeout(() => {
    submitBtn.textContent = 'SEND INQUIRY';
    submitBtn.style.background = '';
  }, 3000);
});

// ─────────────────────────────────────────────
// NAV LABEL EDITING  (double-click to rename)
// ─────────────────────────────────────────────
document.querySelectorAll('.nav-label').forEach(label => {
  // Add hint tooltip
  const hint = document.createElement('span');
  hint.className = 'nav-label-hint';
  hint.textContent = 'Double-click to rename';
  label.parentElement.style.position = 'relative';
  label.parentElement.appendChild(hint);

  label.addEventListener('dblclick', e => {
    e.preventDefault();
    e.stopPropagation();
    label.contentEditable = 'true';
    label.focus();
    // Select all text
    const range = document.createRange();
    range.selectNodeContents(label);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });

  label.addEventListener('blur', () => {
    label.contentEditable = 'false';
    if (!label.textContent.trim()) label.textContent = 'UNTITLED';
    label.textContent = label.textContent.trim().toUpperCase();
  });

  label.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); label.blur(); }
    if (e.key === 'Escape') { e.preventDefault(); label.contentEditable = 'false'; }
    // Stop navigation keys from bubbling
    e.stopPropagation();
  });

  // Prevent click navigation while editing
  label.addEventListener('click', e => {
    if (label.contentEditable === 'true') e.stopPropagation();
  });
});

// ─────────────────────────────────────────────
// TEXT ON PRODUCT OVERLAY SYSTEM
// ─────────────────────────────────────────────
const textState = {
  backpack: { text:'', font:"'Barlow Condensed', sans-serif", size:28, color:'#2dff6e', bold:false, italic:false, upper:false, pos:'center' },
  wallet:   { text:'', font:"'Barlow Condensed', sans-serif", size:22, color:'#2dff6e', bold:false, italic:false, upper:false, pos:'center' },
  tshirt:   { text:'', font:"'Barlow Condensed', sans-serif", size:32, color:'#2dff6e', bold:false, italic:false, upper:false, pos:'center' },
  hoodie:   { text:'', font:"'Barlow Condensed', sans-serif", size:28, color:'#2dff6e', bold:false, italic:false, upper:false, pos:'center' },
};

function applyTextOverlay(product) {
  const st      = textState[product];
  const overlay = document.getElementById(`text-overlay-${product}`);
  const render  = document.getElementById(`text-render-${product}`);
  if (!overlay || !render) return;

  const displayText = st.upper ? st.text.toUpperCase() : st.text;
  render.textContent = displayText;

  // Position class
  overlay.className = `product-text-overlay pos-${st.pos}`;

  // Styles
  render.style.fontFamily   = st.font;
  render.style.fontSize     = `${st.size}px`;
  render.style.color        = st.color;
  render.style.fontWeight   = st.bold ? '800' : '600';
  render.style.fontStyle    = st.italic ? 'italic' : 'normal';
  render.style.display      = displayText ? 'block' : 'none';
}

['backpack','wallet','tshirt','hoodie'].forEach(product => {
  // Live text input
  const input = document.getElementById(`text-input-${product}`);
  if (input) {
    input.addEventListener('input', () => {
      textState[product].text = input.value;
      applyTextOverlay(product);
    });
  }

  // Font select
  const fontSel = document.getElementById(`text-font-${product}`);
  if (fontSel) {
    fontSel.addEventListener('change', () => {
      textState[product].font = fontSel.value;
      applyTextOverlay(product);
    });
  }

  // Size slider
  const sizeSlider = document.getElementById(`text-size-${product}`);
  const sizeVal    = document.getElementById(`text-size-val-${product}`);
  if (sizeSlider) {
    sizeSlider.addEventListener('input', () => {
      textState[product].size = parseInt(sizeSlider.value);
      if (sizeVal) sizeVal.textContent = `${sizeSlider.value}px`;
      applyTextOverlay(product);
    });
  }

  // Color buttons
  document.querySelectorAll(`.text-tool-wrap[data-target="${product}"] .text-color-btn`).forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      document.querySelectorAll(`.text-tool-wrap[data-target="${product}"] .text-color-btn`)
        .forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      textState[product].color = btn.dataset.color;
      applyTextOverlay(product);
    });
  });

  // Style buttons (Bold / Italic / Uppercase)
  ['bold','italic','upper'].forEach(style => {
    const btn = document.getElementById(`text-${style}-${product}`);
    if (!btn) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      textState[product][style] = !textState[product][style];
      btn.classList.toggle('active', textState[product][style]);
      applyTextOverlay(product);
    });
  });

  // Position buttons
  document.querySelectorAll(`.text-pos-btn[data-product="${product}"]`).forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      document.querySelectorAll(`.text-pos-btn[data-product="${product}"]`)
        .forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      textState[product].pos = btn.dataset.pos;
      applyTextOverlay(product);
    });
  });
});

// ─────────────────────────────────────────────
// BULK ORDER CONFIGURATOR (Business tab only)
// ─────────────────────────────────────────────

const BULK_PRODUCTS = {
  backpack: {
    name: 'Backpacks', emoji: '🎒', moq: 10,
    tiers: [{ min: 10,  max: 99,   price: 320 },
            { min: 100, max: 499,  price: 275 },
            { min: 500, max: Infinity, price: 220 }]
  },
  wallet: {
    name: 'Wallets', emoji: '👜', moq: 25,
    tiers: [{ min: 25,  max: 99,   price: 95 },
            { min: 100, max: 499,  price: 78 },
            { min: 500, max: Infinity, price: 60 }]
  },
  tshirt: {
    name: 'T-Shirts', emoji: '👕', moq: 50,
    tiers: [{ min: 50,  max: 199,  price: 9 },
            { min: 200, max: 999,  price: 7 },
            { min: 1000, max: Infinity, price: 5 }]
  },
  hoodie: {
    name: 'Hoodies', emoji: '🧥', moq: 25,
    tiers: [{ min: 25,  max: 99,   price: 18 },
            { min: 100, max: 499,  price: 15 },
            { min: 500, max: Infinity, price: 12 }]
  }
};

const bulkCart = {}; // { product: { qty, unitPrice, total } }

function getBulkPrice(product, qty) {
  const tiers = BULK_PRODUCTS[product].tiers;
  for (const tier of tiers) {
    if (qty >= tier.min && qty <= tier.max) return tier.price;
  }
  return tiers[tiers.length - 1].price;
}

function formatMoney(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function updateBulkTotal(product) {
  const input  = document.getElementById(`qty-${product}`);
  const totalEl = document.getElementById(`bulk-total-${product}`);
  const priceEl = document.getElementById(`biz-price-${product}`);
  if (!input || !totalEl) return;

  let qty = parseInt(input.value) || BULK_PRODUCTS[product].moq;
  const moq = BULK_PRODUCTS[product].moq;
  if (qty < moq) { qty = moq; input.value = moq; }

  const unitPrice = getBulkPrice(product, qty);
  const total     = qty * unitPrice;

  totalEl.textContent = formatMoney(total);
  if (priceEl) priceEl.innerHTML = `$${unitPrice}<span class="biz-catalog-unit">/unit</span>`;

  // Highlight the active tier badge
  const card = input.closest('.biz-catalog-card');
  if (card) {
    card.querySelectorAll('.bulk-tier').forEach(t => t.classList.remove('bulk-tier-active'));
    const tiers = BULK_PRODUCTS[product].tiers;
    const idx   = tiers.findIndex(t => qty >= t.min && qty <= t.max);
    const badges = card.querySelectorAll('.bulk-tier');
    if (badges[idx]) badges[idx].classList.add('bulk-tier-active');
  }
}

// Wire quantity inputs & +/- buttons
Object.keys(BULK_PRODUCTS).forEach(product => {
  const input   = document.getElementById(`qty-${product}`);
  const minuses = document.querySelectorAll(`.bulk-qty-btn[data-product="${product}"][data-action="minus"]`);
  const pluses  = document.querySelectorAll(`.bulk-qty-btn[data-product="${product}"][data-action="plus"]`);

  if (!input) return;

  const step = product === 'tshirt' ? 50 : product === 'backpack' ? 10 : 25;

  input.addEventListener('input', () => updateBulkTotal(product));
  input.addEventListener('change', () => updateBulkTotal(product));

  minuses.forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    const moq = BULK_PRODUCTS[product].moq;
    input.value = Math.max(moq, (parseInt(input.value) || moq) - step);
    updateBulkTotal(product);
  }));

  pluses.forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    input.value = (parseInt(input.value) || BULK_PRODUCTS[product].moq) + step;
    updateBulkTotal(product);
  }));

  // Init
  updateBulkTotal(product);
});

// Wire bulk swatch selectors (business tab only)
document.querySelectorAll('.bulk-swatches').forEach(group => {
  group.querySelectorAll('.bulk-swatch').forEach(sw => {
    sw.addEventListener('click', e => {
      e.stopPropagation();
      group.querySelectorAll('.bulk-swatch').forEach(s => s.classList.remove('selected'));
      sw.classList.add('selected');
    });
  });
});

// Wire bulk size toggle (multi-select)
document.querySelectorAll('.bulk-size-btns').forEach(group => {
  group.querySelectorAll('.bulk-size-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.classList.toggle('selected');
      // At least one must stay selected
      const anySelected = [...group.querySelectorAll('.bulk-size-btn')].some(b => b.classList.contains('selected'));
      if (!anySelected) btn.classList.add('selected');
    });
  });
});

// ADD TO BULK ORDER buttons
document.querySelectorAll('.bulk-order-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const product = btn.dataset.product;
    if (!product) return;
    const input     = document.getElementById(`qty-${product}`);
    const qty       = parseInt(input?.value) || BULK_PRODUCTS[product].moq;
    const unitPrice = getBulkPrice(product, qty);
    const total     = qty * unitPrice;

    bulkCart[product] = { qty, unitPrice, total };

    // Button feedback
    const orig = btn.textContent;
    btn.textContent = '✓ ADDED!';
    btn.style.background = '#1a9940';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1800);

    renderBulkSummary();
    showToast(`${BULK_PRODUCTS[product].name} × ${qty.toLocaleString()} units added to bulk order!`);
  });
});

function renderBulkSummary() {
  const summaryEl   = document.getElementById('bulk-order-summary');
  const itemsEl     = document.getElementById('bulk-summary-items');
  const grandTotalEl = document.getElementById('bulk-grand-total');
  if (!summaryEl || !itemsEl) return;

  const entries = Object.entries(bulkCart);
  if (entries.length === 0) {
    summaryEl.style.display = 'none';
    return;
  }

  summaryEl.style.display = 'block';
  summaryEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  itemsEl.innerHTML = entries.map(([product, { qty, unitPrice, total }]) => {
    const info = BULK_PRODUCTS[product];
    return `
      <div class="bulk-summary-item">
        <span class="bulk-summary-item-emoji">${info.emoji}</span>
        <div>
          <div class="bulk-summary-item-name">${info.name}</div>
          <div class="bulk-summary-item-meta">$${unitPrice}/unit · ${qty >= 1000 ? (qty/1000).toFixed(1)+'K' : qty} units</div>
        </div>
        <span class="bulk-summary-item-qty">QTY: ${qty.toLocaleString()}</span>
        <span class="bulk-summary-item-price">${formatMoney(total)}</span>
      </div>`;
  }).join('');

  const grandTotal = entries.reduce((s, [, v]) => s + v.total, 0);
  if (grandTotalEl) grandTotalEl.textContent = formatMoney(grandTotal);
}

// Clear all
document.getElementById('bulk-clear-btn')?.addEventListener('click', e => {
  e.stopPropagation();
  Object.keys(bulkCart).forEach(k => delete bulkCart[k]);
  renderBulkSummary();
  showToast('Bulk order cleared.');
});

// Request quote
document.getElementById('bulk-submit-btn')?.addEventListener('click', e => {
  e.stopPropagation();
  if (Object.keys(bulkCart).length === 0) { showToast('Add items to your bulk order first.'); return; }
  // Pre-fill business contact form
  const msgEl = document.getElementById('biz-message');
  if (msgEl) {
    const lines = Object.entries(bulkCart).map(([p, { qty, unitPrice, total }]) =>
      `• ${BULK_PRODUCTS[p].name}: ${qty.toLocaleString()} units @ $${unitPrice}/unit = ${formatMoney(total)}`);
    const grand = Object.values(bulkCart).reduce((s, v) => s + v.total, 0);
    msgEl.value = `Bulk order request:\n${lines.join('\n')}\n\nEstimated total: ${formatMoney(grand)}\n\nPlease contact me with a final quote.`;
  }
  document.getElementById('biz-contact-section')?.scrollIntoView({ behavior: 'smooth' });
  showToast('Order details copied to inquiry form — complete your details below!');
});

// ─────────────────────────────────────────────
// JOIN CHALLENGE (Home page competition section)
// ─────────────────────────────────────────────
document.getElementById('join-challenge-btn')?.addEventListener('click', e => {
  e.stopPropagation();
  const btn = document.getElementById('join-challenge-btn');
  btn.textContent = '✓ JOINED!';
  btn.style.background = '#1a9940';
  bonusPoints += 500;
  renderBonusBalance();
  showToast('You joined the challenge! +500 NP awarded 🏆');
  setTimeout(() => { btn.textContent = 'JOIN CHALLENGE'; btn.style.background = ''; }, 3000);
});

// ─────────────────────────────────────────────
// INJECT STYLES
// ─────────────────────────────────────────────
const injectedStyle = document.createElement('style');
injectedStyle.textContent = `
  .remove-item-btn {
    background: none; border: 1px solid rgba(255,80,80,.3); border-radius: 50%;
    width: 22px; height: 22px; color: rgba(255,80,80,.6); font-size: .65rem;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all .2s; flex-shrink: 0;
  }
  .remove-item-btn:hover { background: rgba(255,80,80,.15); border-color: rgba(255,80,80,.8); color: #ff5555; }
`;
document.head.appendChild(injectedStyle);

// ─────────────────────────────────────────────
// STAGGER ENTRY ANIMATIONS
// ─────────────────────────────────────────────
['module-card','process-card','biz-feature-card','biz-tier-card','biz-catalog-card'].forEach(cls =>
  document.querySelectorAll(`.${cls}`).forEach((el, i) =>
    el.style.animation = `slideUp .5s ${i * 0.07}s ease both`));

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
showPage('home');
renderBonusBalance();
