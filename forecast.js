const WEATHER_API_KEY = "a4dec6b4af3c5257fdfca056b949c223"; // Replace with your actual key
const weatherIcons = {
  "Thunderstorm": "fa-bolt", "Drizzle": "fa-cloud-rain", "Rain": "fa-cloud-showers-heavy",
  "Snow": "fa-snowflake", "Clear": "fa-sun", "Clouds": "fa-cloud", "Atmosphere": "fa-smog",
  "Mist": "fa-smog", "Fog": "fa-smog", "Haze": "fa-smog", "Smoke": "fa-smog", "Dust": "fa-smog"
};

function getWeatherIcon(main) { return weatherIcons[main] || "fa-sun"; }
function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : ""; }
function formatDay(dt) {
  const date = new Date(dt * 1000);
  return date.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});
}

async function fetchGeo(city) {
  // Get lat/lon from city
  const r = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&limit=1`);
  const d = await r.json();
  if (d.length === 0) throw new Error("City not found");
  return {lat: d[0].lat, lon: d[0].lon, name: d[0].name, country: d[0].country};
}
async function fetchForecast(lat, lon) {
  // 7-day forecast
  const r = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${WEATHER_API_KEY}&units=metric`);
  const d = await r.json();
  if (!d.daily) throw new Error("Forecast not found");
  return d.daily.slice(0, 7);
}

function renderForecastCards(days, city) {
  const cardsHTML = days.map((d, idx) => `
    <div class="forecast-card">
      <div class="day">${formatDay(d.dt)}</div>
      <div class="icon"><i class="fa-solid ${getWeatherIcon(d.weather[0].main)}"></i></div>
      <div class="temp">
        ${Math.round(d.temp.max)}°<span>/${Math.round(d.temp.min)}°</span>
      </div>
      <div class="description">${capitalize(d.weather[0].description)}</div>
    </div>`).join('');
  document.getElementById('forecastCards').innerHTML = cardsHTML;
  // Optionally update background
  document.getElementById('dynamicBg').style.background = "linear-gradient(135deg,#bbc 0%,#b8e2f2 100%)";
}

async function loadForecast(city) {
  try {
    const {lat, lon, name, country} = await fetchGeo(city);
    const days = await fetchForecast(lat, lon);
    renderForecastCards(days, city);
  } catch (e) {
    document.getElementById('forecastCards').innerHTML = "<div style='color:#d2222d;padding:1.7rem;'>Forecast not found.<br/>Try another city.</div>";
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  loadForecast("Delhi");
  document.getElementById('forecastCityForm').addEventListener("submit", e=>{
    e.preventDefault();
    const city = document.getElementById("forecastCityInput").value.trim();
    if (city) loadForecast(city);
  });
});
