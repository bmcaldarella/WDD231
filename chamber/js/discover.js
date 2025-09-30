const discover = document.querySelector("#discover");
const DATA_DISCOVER = "./data/discover.json";

function createCard(item) {
  const article = document.createElement("article");
  article.classList.add("card");

  article.innerHTML = `
    <h4>${item.name}</h4>
    <figure>
      <img class="img-card" src="${item.image}" alt="${item.name}" loading="lazy">
    </figure>
    <address class="p-description">${item.address}</address>
    <p class="p-description">${item.description}</p>
    <a href="${item.url}" target="_blank">
      <button class="card-button" type="button">Learn more</button>
    </a>
  `;
  return article;
}

async function loadDiscover() {
  if (!discover) return;

  try {
    const res = await fetch(DATA_DISCOVER);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    discover.innerHTML = ""; 

    data.forEach(item => {
      const card = createCard(item);
      discover.appendChild(card);
    });

  } catch (err) {
    discover.textContent = "Error loading discover places.";
    console.error("Error loading discover.json:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadDiscover);
