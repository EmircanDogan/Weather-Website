const apiKey = '2d8ab8f9268d5545f68041027cac5265';
const defaultCities    = ['Istanbul,TR','Ankara,TR','Izmir,TR','Antalya,TR','Bursa,TR','Trabzon,TR'];
const selectableCities = ['London,UK','New York,US','Tokyo,JP','Paris,FR','Sydney,AU','São Paulo,BR'];

const defaultContainer = document.getElementById('default-cities');
const select           = document.getElementById('city-select');
const resultDiv        = document.getElementById('weather-result');

// 1) Default şehir kartları
document.addEventListener('DOMContentLoaded', () => {
  defaultContainer.innerHTML = '';
  defaultCities.forEach(city => {
    const card = document.createElement('div');
    card.className = 'weather-card';
    card.innerHTML = '<p>Loading...</p>';
    defaultContainer.appendChild(card);
    fetchWeather(city, card);
  });

  // 2) Select menüyü doldur
  selectableCities.forEach(city => {
    const opt = document.createElement('option');
    const [name] = city.split(',');
    opt.value       = city;
    opt.textContent = name;
    select.appendChild(opt);
  });
});

// 3) Seçim değişince tek şehir çek
select.addEventListener('change', () => {
  const city = select.value;
  resultDiv.innerHTML = '';
  if (!city) return;
  const card = document.createElement('div');
  card.className = 'weather-card';
  card.innerHTML = '<p>Loading...</p>';
  resultDiv.appendChild(card);
  fetchWeather(city, card);
});
async function fetchWeather(city, cardElement) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    // Cevabı karta bastır
    cardElement.innerHTML = `
  <div class="icon-wrap">
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
         alt="${data.weather[0].description}" />
  </div>
  <h3>${data.name}, ${data.sys.country}</h3>
  <p>🌡️ ${data.main.temp.toFixed(1)}°C (Feels like ${data.main.feels_like.toFixed(1)}°C)</p>
  <p>🔆 ${data.weather[0].description}</p>
  <p>💧 ${data.main.humidity}% humidity</p>
  <p>💨 ${data.wind.speed} m/s wind</p>
    `;
  } catch (err) {
    cardElement.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
}