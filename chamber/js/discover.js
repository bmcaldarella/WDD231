const discover = document.querySelector("#discover");
const DATA_DISCOVER = "./data/discover.json";

const IMG_W = 480, IMG_H = 270;

function renderSkeleton(n = 8) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const art = document.createElement("article");
    art.className = "card skeleton";
    art.innerHTML = `
      <h4 class="skel-line" style="width:65%"></h4>
      <figure class="skel-media"></figure>
      <p class="skel-line" style="width:60%"></p>
      <p class="skel-line" style="width:90%"></p>
      <div class="skel-btn"></div>
    `;
    frag.appendChild(art);
  }
  discover.replaceChildren(frag);
}

function createCard(item, i) {
  const fp = i === 0 ? ' fetchpriority="high"' : '';
  const art = document.createElement("article");
  art.className = "card";
  art.innerHTML = `
    <h4>${item.name}</h4>
    <figure>
      <img class="img-card"
           src="${item.image}"
           alt="${item.name}"
           width="${IMG_W}" height="${IMG_H}"
           loading="lazy" decoding="async"${fp}>
    </figure>
    <address class="p-description">${item.address}</address>
    <p class="p-description">${item.description}</p>
    <a class="card-button" href="${item.url}" target="_blank" rel="noopener">
      Learn more <span class="visually-hidden">about ${item.name}</span>
    </a>
  `;
  return art;
}

async function loadDiscover() {
  if (!discover) return;
  renderSkeleton(8);

  try {
    const res = await fetch(DATA_DISCOVER, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()).slice(0, 8);

    const frag = document.createDocumentFragment();
    data.forEach((item, idx) => frag.appendChild(createCard(item, idx)));
    discover.replaceChildren(frag);

    discover.classList.add("layout-a");
  } catch (err) {
    console.error("Error loading discover.json:", err);
    discover.textContent = "Error loading discover places.";
  }
}




document.addEventListener("DOMContentLoaded", loadDiscover);
