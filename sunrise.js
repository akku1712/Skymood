const WEATHER_KEY = "a4dec6b4af3c5257fdfca056b949c223";
async function fetchGeo(city) {
  const r = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&appid=${WEATHER_KEY}&limit=1`);
  const d = await r.json();
  if (d.length === 0) throw new Error("City not found");
  return {lat: d[0].lat, lon: d[0].lon, name: d[0].name, country: d[0].country};
}
async function fetchSun(city) {
  const {lat, lon, name, country} = await fetchGeo(city);
  const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`);
  const d = await r.json();
  if (!d.sys) throw new Error("No suntime data.");
  return {sunrise: d.sys.sunrise, sunset: d.sys.sunset, name, country};
}
function renderSun(sunrise, sunset, name, country) {
  // Timeline AR bar: dot animates according to current time
  const now = Date.now()/1000;
  let pct = ((now-sunrise) / (sunset-sunrise));
  pct = Math.max(0, Math.min(1, pct));
  const leftPct = Math.round((pct*100));
  const sTime = new Date(sunrise*1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const eTime = new Date(sunset*1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const ctx = (now<sunrise||now>sunset) ? "night" : "day";
  document.getElementById('ssArView').innerHTML = `
    <div class="ss-info">
      <i class="fa-solid ${ctx==="day"?"fa-sun":"fa-moon"}"></i>
      Sunrise & Sunset for <b>${name}, ${country}</b>
    </div>
    <div class="timeline-bar" style="background:${ctx==="day"?"linear-gradient(90deg,#fee078 0 40%,#f7922c 80% 100%)":"linear-gradient(90deg,#323752 0 40%,#8390d7 80% 100%)"}">
      <div class="timeline-dot" style="left:${leftPct}%;">
        <i class="fa-solid ${ctx==='day'?'fa-sun':'fa-moon'}"></i>
      </div>
    </div>
    <div class="ss-times">
      <span>🌅 ${sTime}</span>
      <span>🌇 ${eTime}</span>
    </div>
  `;
  document.body.style.background = ctx==="day"?"#ffe7bb":"#222842";
}
async function loadSun(city) {
  try {
    const {sunrise, sunset, name, country} = await fetchSun(city);
    renderSun(sunrise, sunset, name, country);
  } catch {
    document.getElementById('ssArView').innerHTML = "<div style='color:#d2222d;padding:1.6rem;'>No sunrise/sunset data.<br/>Try another city.</div>";
  }
}
document.addEventListener("DOMContentLoaded", ()=>{
  loadSun("Delhi");
  document.getElementById('ssCityForm').addEventListener("submit", e=>{
    e.preventDefault();
    const city = document.getElementById("ssCityInput").value.trim();
    if (city) loadSun(city);
  });
});
