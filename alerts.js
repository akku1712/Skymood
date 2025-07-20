const WEATHER_KEY = "a4dec6b4af3c5257fdfca056b949c223";
async function fetchGeo(city) {
  const r = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&appid=${WEATHER_KEY}&limit=1`);
  const d = await r.json();
  if (d.length === 0) throw new Error("City not found");
  return {lat: d[0].lat, lon: d[0].lon, name: d[0].name, country: d[0].country};
}
function formatTime(utc) {
  const date = new Date(utc * 1000);
  return date.toLocaleString();
}
async function fetchAlerts(lat, lon) {
  const r = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`);
  const d = await r.json();
  if (!d.alerts || d.alerts.length === 0) throw new Error("No alerts");
  return d.alerts;
}
function renderAlerts(alerts) {
  document.getElementById('alertsMain').innerHTML = alerts.map(a=>`
    <div class="alert-card">
      <div class="alert-title"><i class="fa-solid fa-bell"></i> ${a.event}</div>
      <div class="alert-desc">${a.description.replace(/\n/g,'<br>')}</div>
      <div class="alert-time">From: ${formatTime(a.start)}<br>To: ${formatTime(a.end)}</div>
    </div>
  `).join('');
}
async function loadAlerts(city) {
  try {
    const {lat, lon} = await fetchGeo(city);
    const alerts = await fetchAlerts(lat, lon);
    renderAlerts(alerts);
  } catch {
    document.getElementById('alertsMain').innerHTML = "<div style='color:#d2222d;padding:1.5rem;'>No extreme alerts for this location.</div>";
  }
}
document.addEventListener("DOMContentLoaded", ()=>{
  loadAlerts("Delhi");
  document.getElementById('alertCityForm').addEventListener("submit", e=>{
    e.preventDefault();
    const city = document.getElementById("alertCityInput").value.trim();
    if (city) loadAlerts(city);
  });
});
