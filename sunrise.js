const WEATHER_KEY = "a4dec6b4af3c5257fdfca056b949c223"; // Your working OpenWeatherMap key

// Look up coordinates for a city name
async function fetchGeo(city) {
  const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&appid=${WEATHER_KEY}&limit=1`);
  const data = await res.json();
  if (!data.length) throw new Error("City not found");
  return { lat: data[0].lat, lon: data[0].lon, name: data[0].name, country: data[0].country };
}

// Get sunrise/sunset times for those coordinates
async function fetchSun(city) {
  const { lat, lon, name, country } = await fetchGeo(city);
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`);
  const data = await res.json();
  if (!data.sys) throw new Error("No sunrise/sunset data");
  return { sunrise: data.sys.sunrise, sunset: data.sys.sunset, name, country };
}

// Render an AR-style timeline
function renderSun(sunrise, sunset, name, country) {
  const now = Date.now() / 1000;
  let pct = ((now - sunrise) / (sunset - sunrise));
  pct = Math.max(0, Math.min(1, pct));
  const leftPct = Math.round(pct * 100);
  const sTime = new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const eTime = new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isDay = now > sunrise && now < sunset;

  document.getElementById('ssArView').innerHTML = `
    <div class="ss-info">
      <i class="fa-solid ${isDay ? "fa-sun" : "fa-moon"}"></i>
      Sunrise & Sunset for <b>${name}, ${country}</b>
    </div>
    <div class="timeline-bar" style="background:${isDay ?
      "linear-gradient(90deg,#fee078 0 40%,#f7922c 80% 100%)" :
      "linear-gradient(90deg,#323752 0 40%,#8390d7 80% 100%)"}">
      <div class="timeline-dot" style="left:${leftPct}%;">
        <i class="fa-solid ${isDay ? 'fa-sun' : 'fa-moon'}"></i>
      </div>
    </div>
    <div class="ss-times">
      <span>🌅 ${sTime}</span>
      <span>🌇 ${eTime}</span>
    </div>
  `;
  document.body.style.background = isDay ? "#ffe7bb" : "#222842";
}

async function loadSun(city) {
  try {
    const { sunrise, sunset, name, country } = await fetchSun(city);
    renderSun(sunrise, sunset, name, country);
  } catch {
    document.getElementById('ssArView').innerHTML = "<div style='color:#d2222d;padding:1.6rem;'>No sunrise/sunset data.<br/>Try another city.</div>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadSun("Delhi");
  document.getElementById('ssCityForm').addEventListener("submit", e => {
    e.preventDefault();
    const city = document.getElementById("ssCityInput").value.trim();
    if (city) loadSun(city);
  });
});
