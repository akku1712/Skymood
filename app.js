/* JavaScript for SkyMood Weather App */

// Utility: Get user's current coordinates async function getCoordinates() { return new Promise((resolve, reject) => { if (!navigator.geolocation) return reject("Geolocation not supported."); navigator.geolocation.getCurrentPosition( (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }), (err) => reject("Location access denied.") ); }); }

// Utility: Fetch weather data from OpenWeatherMap async function getWeather(lat, lon) { const apiKey = "YOUR_OPENWEATHER_API_KEY"; const url = https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric; const response = await fetch(url); return response.json(); }

// Utility: Fetch AQI data async function getAQI(lat, lon) { const apiKey = "YOUR_OPENWEATHER_API_KEY"; const url = https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}; const response = await fetch(url); return response.json(); }

// Display weather on main page async function displayWeather() { try { const { lat, lon } = await getCoordinates(); const data = await getWeather(lat, lon); const location = document.getElementById("location"); const temperature = document.getElementById("temperature"); const description = document.getElementById("description"); location.textContent = ${data.name}, ${data.sys.country}; temperature.textContent = ${Math.round(data.main.temp)}°C; description.textContent = data.weather[0].description; } catch (err) { console.error(err); } }

// Display AQI on AQI page async function displayAQI() { try { const { lat, lon } = await getCoordinates(); const data = await getAQI(lat, lon); const aqiVal = data.list[0].main.aqi; const aqiLevel = ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqiVal - 1]; document.getElementById("aqi-value").textContent = ${aqiVal} - ${aqiLevel}; } catch (err) { console.error(err); } }

// On Load Events window.onload = function () { if (document.body.classList.contains("home")) displayWeather(); if (document.body.classList.contains("aqi")) displayAQI(); };

