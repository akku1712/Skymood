const AQI_API_KEY = ""; // Not required for /feed endpoint with city
const AQI_LEVELS = [
  {max: 50, status: "Good", class: "aqi-good", tip: "Air quality is considered satisfactory, and air pollution poses little or no risk."},
  {max: 100, status: "Moderate", class: "aqi-moderate", tip: "Air quality is acceptable; however, for some pollutants, there may be a moderate health concern for a very small number of sensitive people."},
  {max: 150, status: "Unhealthy for Sensitive Groups", class: "aqi-poor", tip: "Active children and adults, and people with respiratory disease, should limit prolonged outdoor exertion."},
  {max: 200, status: "Unhealthy", class: "aqi-unhealthy", tip: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."},
  {max: 300, status: "Very Unhealthy", class: "aqi-veryunhealthy", tip: "Health warnings of emergency conditions. The entire population is more likely to be affected."},
  {max: 1000, status: "Hazardous", class: "aqi-hazardous", tip: "Serious health effects. Everyone should avoid all outdoor exertion."}
];
function getAqiLevel(aqi) {
  return AQI_LEVELS.find(level => aqi <= level.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
}

async function fetchAqi(city) {
  const url = `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=demo`; // Replace 'demo' by your AQICN token if you have one.
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "ok" || !data.data || typeof data.data.aqi !== "number") throw new Error("AQI not found.");
  return data.data.aqi;
}

function renderAqi(aqi) {
  const level = getAqiLevel(aqi);
  const html = `
    <div class="aqi-card">
      <div class="aqi-index ${level.class}">${aqi}</div>
      <div class="aqi-status">${level.status}</div>
      <div class="aqi-health-tip"><i class="fa-solid fa-shield-heart"></i> ${level.tip}</div>
    </div>
  `;
  document.getElementById('aqiMain').innerHTML = html;
}
async function loadAqi(city) {
  try {
    const aqi = await fetchAqi(city);
    renderAqi(aqi);
  } catch {
    document.getElementById('aqiMain').innerHTML = "<div style='color:#d2222d;padding:1.5rem;'>AQI not found.<br/>Try another city.</div>";
  }
}
document.addEventListener("DOMContentLoaded", ()=>{
  loadAqi("Delhi");
  document.getElementById('aqiCityForm').addEventListener("submit", e=>{
    e.preventDefault();
    const city = document.getElementById("aqiCityInput").value.trim();
    if (city) loadAqi(city);
  });
});
