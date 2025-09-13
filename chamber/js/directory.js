"use strict";

// ===== NAV: hamburguesa
const toggle = document.getElementById("navToggle");
const nav = document.getElementById("siteNav");

toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  toggle.setAttribute("aria-label", isOpen ? "Close main menu" : "Open main menu");
});

nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && nav.classList.contains("open")) {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open main menu");
  }
});

// ===== Footer dinámico
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

// ===== Elementos
const directoryEl = document.getElementById("directory");
const btnGrid = document.getElementById("btnGrid");
const btnList = document.getElementById("btnList");

// ===== Toggle de vista
function setView(view) {
  directoryEl.classList.toggle("grid", view === "grid");
  directoryEl.classList.toggle("list", view === "list");
  btnGrid.setAttribute("aria-pressed", view === "grid");
  btnList.setAttribute("aria-pressed", view === "list");
}
btnGrid.addEventListener("click", () => setView("grid"));
btnList.addEventListener("click", () => setView("list"));
setView("grid");

// ===== Datos
const DATA_URL = "./data/members.json";

// ===== Helper: construir src/srcset/sizes para responsive images
function buildResponsiveSrc(imagePath, display = 216) {
  // si viene absoluta o con http(s), devuélvela tal cual
  if (/^https?:\/\//i.test(imagePath)) {
    return { src: imagePath, srcset: "", sizes: "" };
  }

  // separa base y extensión
  const q = imagePath.lastIndexOf(".");
  const base = q >= 0 ? imagePath.slice(0, q) : imagePath;
  const ext  = q >= 0 ? imagePath.slice(q + 1) : "webp";

  // si ya tiene -216 usamos esa, con fallback al original
  if (/-216\./.test(imagePath)) {
    return {
      src: imagePath,
      srcset: `${imagePath} ${display}w`,
      sizes: `${display}px`,
    };
  }

  const small = `${base}-216.${ext}`; // nombre sugerido de thumbnail
  const orig  = imagePath;            // original (500×500)

  return {
    src: small,
    srcset: `${small} ${display}w, ${orig} 500w`,
    sizes: `(max-width:480px) 40vw, (max-width:768px) 25vw, ${display}px`,
  };
}

// ===== Carga y render
async function loadMembers() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const members = await res.json();
    renderMembers(members);
  } catch (err) {
    // fallback visible pero sin romper accesibilidad
    directoryEl.textContent = "Error loading members.";
    console.error(err);
  }
}

function renderMembers(members) {
  // limpia
  while (directoryEl.firstChild) directoryEl.removeChild(directoryEl.firstChild);

  members.forEach((m) => {
    const card = document.createElement("article");
    card.className = "card";

    // --- LOGO (con espacio reservado y responsive) ---
    const img = document.createElement("img");
    const { src, srcset, sizes } = buildResponsiveSrc(m.image, 216);
    img.src = src;
    if (srcset) img.srcset = srcset;
    if (sizes)  img.sizes  = sizes;
    img.alt = `Logo of ${m.name}`;
    img.className = "logo";
    img.width = 216;          // espacio reservado = menos CLS
    img.height = 216;
    img.loading = "lazy";
    img.decoding = "async";

    const media = document.createElement("div"); // wrapper con tamaño fijo en CSS
    media.className = "media";
    media.appendChild(img);
    card.appendChild(media);

    // --- NOMBRE ---
    const name = document.createElement("h2");
    name.textContent = m.name;
    card.appendChild(name);

    // --- DIRECCIÓN ---
    const address = document.createElement("p");
    address.textContent = m.address;
    card.appendChild(address);

    // --- TELÉFONO ---
    const phone = document.createElement("p");
    const phoneLink = document.createElement("a");
    phoneLink.href = `tel:${String(m.phone || "").replace(/\s+/g, "")}`;
    phoneLink.textContent = m.phone;
    phoneLink.style.color = "#000";
    phone.appendChild(phoneLink);
    card.appendChild(phone);

    // --- WEBSITE (como botón) ---
    const website = document.createElement("p");
    const siteLink = document.createElement("a");
    siteLink.href = m.website;
    siteLink.target = "_blank";
    siteLink.rel = "noopener";
    siteLink.textContent = "Visit Website";
    // estilos de botón
    siteLink.style.display = "inline-block";
    siteLink.style.backgroundColor = "#000";
    siteLink.style.color = "#fff";
    siteLink.style.padding = "0.5rem 1rem";
    siteLink.style.borderRadius = "6px";
    siteLink.style.textDecoration = "none";
    siteLink.style.fontWeight = "600";
    website.appendChild(siteLink);
    card.appendChild(website);

    // --- BADGE ---
    const badge = document.createElement("p");
    let badgeClass = "member";
    let badgeText = "Member";
    if (m.membership === 3) { badgeClass = "gold";   badgeText = "Gold"; }
    else if (m.membership === 2) { badgeClass = "silver"; badgeText = "Silver"; }
    badge.className = `badge ${badgeClass}`;
    badge.textContent = badgeText;
    card.appendChild(badge);

    directoryEl.appendChild(card);
  });
}

loadMembers();
