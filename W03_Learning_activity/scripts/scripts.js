const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

const lat = 49.76667810995982;
const lon = 6.642581422443362;
const API_key ='51a1ea725529b4801b214eb7963468c9';


const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_key}`;

async function apiFetch() {
  try {
    const resp = await fetch(url);
    const text = await resp.text();
    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${text}`);

    const data = JSON.parse(text);
    currentTemp.innerHTML = `<strong>${Math.round(data.main.temp)}°</strong>`;
    const { icon, description } = data.weather[0];
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    weatherIcon.alt = description;
    captionDesc.textContent = description;
  } catch (err) {
    currentTemp.textContent = '—';
    captionDesc.textContent = 'error';
    console.error('Weather error:', err);
  }
}
apiFetch();
