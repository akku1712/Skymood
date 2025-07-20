// ========== BASIC UTILS ==========

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

// ========== API FUNCTIONS ==========

const WEATHER_API_KEY =a4dec6b4af3c5257fdfca056b949c223 "YOUR_OPENWEATHERMAP_KEY"; // <-- Insert your key here!
const UNSPLASH_KEY = "YOUR_UNSPLASH_KEY"; // <-- Insert your key here!

async function fetchWeather(city, units = 'metric') {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=${units}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("City not found");
  return await res.json();
}

async function fetchWeatherByCoords(lat, lon, units = 'metric') {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=${units}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Location not found");
  return await res.json();
}

async function fetchUnsplashBg(city) {
  let url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(city)}%20sky,weather&orientation=landscape&client_id=${UNSPLASH_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Photo fetch failed");
  const data = await res.json();
  return data.urls.full;
}

function getWeatherGif(main) {
  // Free GIFs fallback (you can swap these for your own AR/animation!)
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

// ========== DOM UPDATE ==========

async function setDynamicBg(city, fallback = "#c9e6ff") {
  try {
    const url = await fetchUnsplashBg(city);
    document.getElementById("dynamicBg").style.backgroundImage = `url('${url}')`;
  } catch {
    document.getElementById("dynamicBg").style.background = fallback;
  }
}

function updateWeatherOverview(data, units = 'metric') {
  const weather = data.weather[0];
  const main = data.main;

  document.getElementById("weatherIcon").innerHTML = `<i class="fa-solid ${getWeatherIcon(weather.main)}"></i>`;
  document.getElementById("tempValue").innerHTML = Math.round(main.temp) + (units == 'metric' ? "°" : "°");
  document.getElementById("condition").innerText = capitalize(weather.description);
  document.getElementById("location").innerText = `${data.name}, ${data.sys.country}`;
  document.getElementById("humidity").innerText = main.humidity;
  document.getElementById("wind").innerText = Math.round(data.wind.speed * (units === "metric" ? 3.6 : 2.237)); // m/s to km/h or mph
  document.getElementById("pressure").innerText = main.pressure;

  // Show weather visual
  const gifUrl = getWeatherGif(weather.main);
  document.getElementById("weatherVisual").innerHTML = `<img src="${gifUrl}" alt="${weather.main} animation" loading="lazy"/>`;
}

// ========== MAIN LOGIC ==========

let currentUnits = 'metric';
let lastCity = null;

async function showWeatherByCity(city) {
  try {
    const data = await fetchWeather(city, currentUnits);
    updateWeatherOverview(data, currentUnits);
    setDynamicBg(city);
    lastCity = city;
  } catch (e) {
    alert("Weather not found.");
  }
}

async function showWeatherByLocation(lat, lon) {
  try {
    const data = await fetchWeatherByCoords(lat, lon, currentUnits);
    updateWeatherOverview(data, currentUnits);
    setDynamicBg(data.name);
    lastCity = data.name;
  } catch {
    alert("Could not fetch location weather.");
  }
}

// ========== EVENTS & STARTUP ==========

document.addEventListener("DOMContentLoaded", () => {
  // Try geolocate then fall back to 'Delhi'
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
      showWeatherByLocation(pos.coords.latitude, pos.coords.longitude);
    }, () => {
      showWeatherByCity("Delhi");
    });
  } else { showWeatherByCity("Delhi"); }

  // City form submit
  document.getElementById("cityForm").addEventListener("submit", e => {
    e.preventDefault();
    const city = document.getElementById("cityInput").value.trim();
    if (city.length > 0)
      showWeatherByCity(city);
  });

  // Unit toggle
  function unitsUpdate(btnC, btnF) {
    document.getElementById("cBtn").classList.toggle("active", btnC);
    document.getElementById("fBtn").classList.toggle("active", btnF);
    if (lastCity) showWeatherByCity(lastCity);
  }
  document.getElementById("cBtn").addEventListener("click", e=>{
    currentUnits = "metric";
    unitsUpdate(true, false); e.preventDefault();
  });
  document.getElementById("fBtn").addEventListener("click", e=>{
    currentUnits = "imperial";
    unitsUpdate(false, true); e.preventDefault();
  });
});
