function getUserUnits() {
  return localStorage.getItem('skyMoodUnits') || 'metric';
}
function getUserLang() {
  return localStorage.getItem('skyMoodLang') || 'en';
}

// Material icon mapping for weather
const weatherMaterialIcons = {
  "Thunderstorm": "thunderstorm",
  "Drizzle": "rainy",
  "Rain": "rainy_heavy",
  "Snow": "ac_unit",
  "Clear": "wb_sunny",
  "Clouds": "cloud",
  "Mist": "foggy",
  "Smoke": "smog",
  "Haze": "haze",
  "Dust": "duststorm",
  "Fog": "foggy",
  "Sand": "duststorm",
  "Ash": "volcano",
  "Squall": "air", // wind
  "Tornado": "tornado"
};

// You may add/adjust per OpenWeatherMap types

const WEATHER_API_KEY = "a4dec6b4af3c5257fdfca056b949c223";

// Animated GIF fallback for weather visuals
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

// Set a background gradient according to environment and time
function updateDynamicGradient(weatherMain, sunrise, sunset) {
  const now = new Date();
  const hour = now.getHours();

  if (!weatherMain) {
    document.body.style.background = "var(--day-gradient)";
    return;
  }
  // Precedence: Rain, Drizzle, Thunderstorm
  if (["Rain", "Drizzle", "Thunderstorm"].includes(weatherMain)) {
    document.body.style.background = "var(--cloudy-gradient)";
    return;
  }

  const sunriseHour = new Date(sunrise * 1000).getHours();
  const sunsetHour = new Date(sunset * 1000).getHours();

  if (hour >= sunriseHour - 1 && hour < sunriseHour + 2) {
    document.body.style.background = "var(--sunrise-gradient)";
  } else if (hour >= sunriseHour + 2 && hour < sunsetHour - 2) {
    document.body.style.background = "var(--day-gradient)";
  } else if (hour >= sunsetHour - 2 && hour < sunsetHour + 2) {
    document.body.style.background = "var(--evening-gradient)";
  } else {
    document.body.style.background = "var(--night-gradient)";
  }
}

function updateWeatherOverview(data, units = getUserUnits()) {
  const weather = data.weather[0];
  const main = data.main;
  // Icon
  const icon = weatherMaterialIcons[weather.main] || "wb_sunny";
  document.getElementById("weatherIcon").innerHTML = `<span class="material-symbols-outlined" style="font-size:2.7em;">${icon}</span>`;
  // Temp
  document.getElementById("tempValue").innerHTML = Math.round(main.temp) + (units == 'metric' ? "°" : "°");
  document.getElementById("condition").innerText = weather.description ? weather.description.charAt(0).toUpperCase() + weather.description.slice(1) : "";
  document.getElementById("location").innerText = `${data.name}, ${data.sys.country}`;
  document.getElementById("humidity").innerText = main.humidity;
  document.getElementById("wind").innerText = Math.round(data.wind.speed * (units === "metric" ? 3.6 : 2.237));
  document.getElementById("pressure").innerText = main.pressure;
  // Weather visual
  const gifUrl = getWeatherGif(weather.main);
  document.getElementById("weatherVisual").innerHTML = `<img src="${gifUrl}" alt="${weather.main} animation" loading="lazy"/>`;

  // Sunrise/Sunset times
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById("sunriseTime").innerText = sunrise;
  document.getElementById("sunsetTime").innerText = sunset;

  // Dynamically update gradient
  updateDynamicGradient(weather.main, data.sys.sunrise, data.sys.sunset);
}

let lastCity = null;

async function showWeatherByCity(city) {
  try {
    const units = getUserUnits();
    const lang = getUserLang();
    const data = await fetchWeather(city, units, lang);
    updateWeatherOverview(data, units);
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
    lastCity = data.name || "";
  } catch {
    alert("Could not fetch location weather.");
  }
}

// Unit toggle buttons update
function updateUnitButtons() {
  const units = getUserUnits();
  document.getElementById("cBtn").classList.toggle("active", units === "metric");
  document.getElementById("fBtn").classList.toggle("active", units === "imperial");
}

document.addEventListener("DOMContentLoaded", () => {
  updateUnitButtons();

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
    updateUnitButtons();
    if (lastCity) showWeatherByCity(lastCity);
    e.preventDefault();
  });
  document.getElementById("fBtn").addEventListener("click", e => {
    localStorage.setItem('skyMoodUnits', 'imperial');
    updateUnitButtons();
    if (lastCity) showWeatherByCity(lastCity);
    e.preventDefault();
  });
});
