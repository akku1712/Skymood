// ---- User settings readers ----
function getUserUnits() {
  return localStorage.getItem('skyMoodUnits') || 'metric';
}
function getUserLang() {
  return localStorage.getItem('skyMoodLang') || 'en';
}

// ---- Weather icons ----
const weatherIcons = {
  "Thunderstorm": "fa-bolt",
  "Drizzle": "fa-cloud-rain",
  "Rain": "fa-cloud-showers-heavy",
  "Snow": "fa-snowflake",
  "Clear": "fa-sun",
  "Clouds": "fa-cloud",
  "Atmosphere": "fa-smog",
  "Mist": "fa-smog",
  "Fog": "fa-smog",
  "Haze": "fa-smog",
  "Smoke": "fa-smog",
  "Dust": "fa-smog"
};

function capitalize(s) { if(typeof s !== 'string') return ''; return s[0].toUpperCase() + s.slice(1); }
function getWeatherIcon(main) {
  return weatherIcons[main] || "fa-sun";
}

const WEATHER_API_KEY = "a4dec6b4af3c5257fdfca056b949c223";
const UNSPLASH_KEY = ""; // Optional

// Fetch weather with settings
async function fetchWeather(city, units = null, lang = null) {
  units = units || getUserUnits();
  lang = lang || getUserLang();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=${units}&lang=${lang}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("City not found");
  return await res.json();
}
async function fetchWeatherByCoords(lat, lon, units = null, lang = null) {
  units = units || getUserUnits();
  lang = lang || getUserLang();
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=${units}&lang=${lang}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Location not found");
  return await res.json();
}

// Sample fallback: static gradient if not using Unsplash
async function setDynamicBg(city, fallback = "#c9e6ff") {
  document.getElementById("dynamicBg").style.background = fallback;
}

function getWeatherGif(main) {
  const gmap = {
    "Clear": "https://media.giphy.com/media/l0MYB8Ory7Hqefo9a/giphy.gif",
    "Clouds": "https://media.giphy.com/media/xT0BKqhdlKCxCNsVTq/giphy.gif",
    "Rain": "https://media.giphy.com/media/3orieYZp5YBfx5UAaQ/giphy.gif",
    "Snow": "https://media.giphy.com/media/3o6vXWzHt3TrAiIRw8/giphy.gif",
    "Thunderstorm": "https://media.giphy.com/media/L2z7dnOduqEow/giphy.gif",
    "Mist": "https://media.giphy.com/media/3oKIPwoeGErMmaI43a/giphy.gif",
    "Drizzle": "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif"
  };
  return gmap[main] || gmap["Clear"];
}

function updateWeatherOverview(data, units = getUserUnits()) {
  const weather = data.weather[0];
  const main = data.main;
  document.getElementById("weatherIcon").innerHTML = `<i class="fa-solid ${getWeatherIcon(weather.main)}"></i>`;
  document.getElementById("tempValue").innerHTML = Math.round(main.temp) + (units == 'metric' ? "°" : "°");
  document.getElementById("condition").innerText = capitalize(weather.description);
  document.getElementById("location").innerText = `${data.name}, ${data.sys.country}`;
  document.getElementById("humidity").innerText = main.humidity;
  document.getElementById("wind").innerText = Math.round(data.wind.speed * (units === "metric" ? 3.6 : 2.237));
  document.getElementById("pressure").innerText = main.pressure;
  // Weather visual
  const gifUrl = getWeatherGif(weather.main);
  document.getElementById("weatherVisual").innerHTML = `<img src="${gifUrl}" alt="${weather.main} animation" loading="lazy"/>`;
}

let currentUnits = getUserUnits();
let lastCity = null;

async function showWeatherByCity(city) {
  try {
    const units = getUserUnits();
    const lang = getUserLang();
    const data = await fetchWeather(city, units, lang);
    updateWeatherOverview(data, units);
    setDynamicBg(city);
    lastCity = city;
  } catch (e) {
    alert("Weather not found.");
  }
}

async function showWeatherByLocation(lat, lon) {
  try {
    const units = getUserUnits();
    const lang = getUserLang();
    const data = await fetchWeatherByCoords(lat, lon, units, lang);
    updateWeatherOverview(data, units);
    setDynamicBg(data.name);
    lastCity = data.name;
  } catch {
    alert("Could not fetch location weather.");
  }
}

// Set °C/°F button state on load based on settings
function updateUnitButtons() {
  const units = getUserUnits();
  document.getElementById("cBtn").classList.toggle("active", units === "metric");
  document.getElementById("fBtn").classList.toggle("active", units === "imperial");
}

document.addEventListener("DOMContentLoaded", () => {
  updateUnitButtons();

  // Initial weather fetch
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
      showWeatherByLocation(pos.coords.latitude, pos.coords.longitude);
    }, () => {
      showWeatherByCity("Delhi");
    });
  } else {
    showWeatherByCity("Delhi");
  }

  document.getElementById("cityForm").addEventListener("submit", e => {
    e.preventDefault();
    const city = document.getElementById("cityInput").value.trim();
    if (city.length > 0) showWeatherByCity(city);
  });

  document.getElementById("cBtn").addEventListener("click", e => {
    localStorage.setItem('skyMoodUnits', 'metric');
    currentUnits = 'metric';
    updateUnitButtons();
    if (lastCity) showWeatherByCity(lastCity);
    e.preventDefault();
  });
  document.getElementById("fBtn").addEventListener("click", e => {
    localStorage.setItem('skyMoodUnits', 'imperial');
    currentUnits = 'imperial';
    updateUnitButtons();
    if (lastCity) showWeatherByCity(lastCity);
    e.preventDefault();
  });

});
