const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('#figcaption');
const forecastEl  = document.querySelector('#forecast-cards');

const lat = 51.89975708993035;
const lon = -8.474521083341495;
const API_key = '51a1ea725529b4801b214eb7963468c9';

const urlCurrent  = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${API_key}`;
const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${API_key}`;

async function apiFetch() {
  try {
    const resp = await fetch(urlCurrent);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    if (currentTemp) currentTemp.textContent = `${Math.round(data.main.temp)}°`;
    if (weatherIcon) {
      const { icon, description } = data.weather[0];
      weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      weatherIcon.alt = description;
    }
    if (captionDesc) captionDesc.textContent = data.weather[0].description;
  } catch (err) {
    console.error('Weather error:', err);
  }
}

async function fetchForecast() {
  try {
    const resp = await fetch(urlForecast);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    if (!forecastEl) return;

    const daysMap = {};

    data.list.forEach(item => {
      const dt = new Date(item.dt * 1000);
      const dateKey = dt.toISOString().split('T')[0];

      if (!daysMap[dateKey] || Math.abs(dt.getHours() - 12) < Math.abs(new Date(daysMap[dateKey].dt * 1000).getHours() - 12)) {
        daysMap[dateKey] = item;
      }
    });

    const today = new Date().toISOString().split('T')[0];
    const dailyItems = Object.entries(daysMap)
      .filter(([date]) => date !== today)
      .slice(0, 4)
      .map(([, item]) => item);

    forecastEl.innerHTML = dailyItems.map(item => {
      const { icon, description } = item.weather[0];
      const temp = Math.round(item.main.temp);
      const weekday = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
      return `
        <div class="forecast-day">
          <p>${weekday}</p>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
          <p>${temp}°C</p>
        </div>`;
    }).join('');
  } catch (err) {
    console.error('Forecast error:', err);
  }
}

apiFetch();
fetchForecast();
