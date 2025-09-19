"use strict";

// ===== NAV: hamburguesa =====
const toggle = document.getElementById("navToggle");
const nav = document.getElementById("siteNav");

if (toggle && nav) {
  // Funciones para abrir/cerrar
  function openNav() {
    nav.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close main menu");
    document.body.style.overflow = "hidden"; // evita scroll cuando está abierto
  }
  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open main menu");
    document.body.style.overflow = "";
  }

  // Click en el botón hamburguesa
  toggle.addEventListener("click", () => {
    nav.classList.contains("open") ? closeNav() : openNav();
  });

  // Cerrar al hacer click en cualquier link del menú
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") closeNav();
  });

  // Mantener sincronizado al redimensionar la ventana
  const mq = window.matchMedia("(min-width: 768px)");
  const syncNav = () => {
    if (mq.matches) {
      // Si estamos en desktop, el menú debe quedar cerrado
      closeNav();
    } else {
      // Si volvemos a móvil, no forzamos la apertura
      // pero aseguramos atributos coherentes si venimos de desktop
      if (!nav.classList.contains("open")) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open main menu");
      }
    }
  };
  mq.addEventListener("change", syncNav);
  syncNav(); // ejecutar una vez al cargar
}

// ===== Footer dinámico =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
const lmEl = document.getElementById("lastModified");
if (lmEl) lmEl.textContent = document.lastModified;

// ===== Directory grid/list toggle =====
const directoryEl = document.getElementById("directory");
const btnGrid = document.getElementById("btnGrid");
const btnList = document.getElementById("btnList");

function setView(view) {
  if (!directoryEl) return;
  directoryEl.classList.toggle("grid", view === "grid");
  directoryEl.classList.toggle("list", view === "list");
  if (btnGrid) btnGrid.setAttribute("aria-pressed", view === "grid");
  if (btnList) btnList.setAttribute("aria-pressed", view === "list");
}

if (btnGrid) btnGrid.addEventListener("click", () => setView("grid"));
if (btnList) btnList.addEventListener("click", () => setView("list"));
if (directoryEl) setView("grid"); // default view

// ===== Load and render members =====
const DATA_URL = "./data/members.json";

function buildResponsiveSrc(imagePath) {
  // For now just use the given path (no -216 suffix to avoid 404)
  return { src: imagePath, srcset: "", sizes: "" };
}

async function loadMembers() {
  if (!directoryEl) return;
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const members = await res.json();
    renderMembers(members);
  } catch (err) {
    directoryEl.textContent = "Error loading members.";
    console.error(err);
  }
}

function renderMembers(members) {
  directoryEl.replaceChildren();

  members.forEach((m) => {
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    const { src, srcset, sizes } = buildResponsiveSrc(m.image);
    img.src = src;
    if (srcset) img.srcset = srcset;
    if (sizes) img.sizes = sizes;
    img.alt = `Logo of ${m.name}`;
    img.className = "logo";
    img.width = 216;
    img.height = 216;
    img.loading = "lazy";
    img.decoding = "async";

    const media = document.createElement("div");
    media.className = "media";
    media.appendChild(img);
    card.appendChild(media);

    const name = document.createElement("h2");
    name.textContent = m.name;
    card.appendChild(name);

    const address = document.createElement("p");
    address.textContent = m.address;
    card.appendChild(address);

    const phone = document.createElement("p");
    const phoneLink = document.createElement("a");
    phoneLink.href = `tel:${String(m.phone || "").replace(/\s+/g, "")}`;
    phoneLink.textContent = m.phone;
    phoneLink.style.color = "#000";
    phone.appendChild(phoneLink);
    card.appendChild(phone);

    const website = document.createElement("p");
    const siteLink = document.createElement("a");
    siteLink.href = m.website;
    siteLink.target = "_blank";
    siteLink.rel = "noopener";
    siteLink.textContent = "Visit Website";
    siteLink.style.display = "inline-block";
    siteLink.style.backgroundColor = "#000";
    siteLink.style.color = "#fff";
    siteLink.style.padding = "0.5rem 1rem";
    siteLink.style.borderRadius = "6px";
    siteLink.style.textDecoration = "none";
    siteLink.style.fontWeight = "600";
    website.appendChild(siteLink);
    card.appendChild(website);

    const badge = document.createElement("p");
    let badgeClass = "member";
    let badgeText = "Member";
    if (m.membership === 3) { badgeClass = "gold"; badgeText = "Gold"; }
    else if (m.membership === 2) { badgeClass = "silver"; badgeText = "Silver"; }
    badge.className = `badge ${badgeClass}`;
    badge.textContent = badgeText;
    card.appendChild(badge);

    directoryEl.appendChild(card);
  });
}


// Usa tu mismo archivo de miembros
const SPOTLIGHTS_URL = "./data/members.json";
const spotlightsList = document.getElementById("spotlights-list");

// sample aleatorio sin repetir
function getRandomSample(arr, n = 3) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}
function renderSpotlights(items) {
  if (!spotlightsList) return;
  spotlightsList.replaceChildren();

  items.forEach((m) => {
    const card = document.createElement("article");
    card.className = "spotlight-card";

    // === Image ===
    const img = document.createElement("img");
    img.className = "spotlight-img";
    img.src = m.image;
    img.alt = `${m.name} logo`;
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = () => {
      console.error("Image failed:", m.image);
      img.src = "./images/placeholder.png";
      img.alt = "Image not available";
    };

    // === Info container ===
    const info = document.createElement("div");
    info.className = "spotlight-info";

    // Nombre
    const h3 = document.createElement("h3");
    h3.textContent = m.name;

    // Category + Address
    const summary = document.createElement("p");
    summary.textContent = m.category ? `${m.category} — ${m.address}` : m.address;

    // Teléfono (clickeable)
    const phone = document.createElement("p");
    if (m.phone) {
      const phoneLink = document.createElement("a");
      phoneLink.href = `tel:${String(m.phone).replace(/\s+/g, "")}`;
      phoneLink.textContent = m.phone;
      phoneLink.style.color = "#0077b6"; // color tipo link
      phoneLink.style.fontWeight = "600";
      phone.appendChild(phoneLink);
    }

    // Website (texto link normal, sin botón)
    const site = document.createElement("p");
    if (m.website) {
      const siteLink = document.createElement("a");
      siteLink.href = m.website;
      siteLink.target = "_blank";
      siteLink.rel = "noopener";
      siteLink.textContent = m.website.replace(/^https?:\/\//, ""); // muestra sin https://
      siteLink.style.color = "#0077b6";
      site.appendChild(siteLink);
    }

    // Membership badge
    const badge = document.createElement("span");
    let badgeClass = "member";
    let badgeText = "Member";
    if (m.membership === 3) { badgeClass = "gold";   badgeText = "Gold"; }
    else if (m.membership === 2) { badgeClass = "silver"; badgeText = "Silver"; }
    badge.className = `badge ${badgeClass}`;
    badge.textContent = badgeText;

    // === Armado final ===
    info.append(h3, summary, phone, site, badge);
    card.append(img, info);
    spotlightsList.appendChild(card);
  });

  if (!spotlightsList.children.length) {
    spotlightsList.innerHTML = "<p>No spotlights available.</p>";
  }
}

async function loadSpotlights({ limit = 3, random = true, filterTier = [2, 3] } = {}) {
  if (!spotlightsList) return;
  try {
    const res = await fetch(SPOTLIGHTS_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    let list = Array.isArray(data) ? data.filter(m => filterTier.includes(m.membership)) : [];
    if (!list.length) list = data;
    list = random ? getRandomSample(list, limit) : list.slice(0, limit);

    renderSpotlights(list);
  } catch (err) {
    console.error("Spotlights error:", err);
    spotlightsList.textContent = "Error loading spotlights.";
  }
}

function getRandomSample(arr, n = 3) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}


loadSpotlights({ limit: 3, random: true });

loadMembers();
