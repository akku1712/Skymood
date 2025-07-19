const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

document.addEventListener("DOMContentLoaded", () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    const cityRes = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`);
    const cityData = await cityRes.json();
    const cityName = cityData[0]?.name || "Your Location";
    document.getElementById("location").textContent = cityName;

    const weatherRes = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely,hourly,daily&appid=${API_KEY}`);
    const data = await weatherRes.json();

    const temp = data.current.temp;
    const description = data.current.weather[0].description;
    const icon = data.current.weather[0].icon;

    document.getElementById("temperature").textContent = `🌡️ Temp: ${temp}°C`;
    document.getElementById("condition").textContent = `🌥️ ${description}`;
    document.getElementById("weather-visuals").innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">`;

    updateSunInfo(data.current.sunrise, data.current.sunset);

    if (data.alerts && data.alerts.length > 0) {
      const alertMsg = data.alerts.map(a => `⚠️ ${a.event}: ${a.description}`).join('\n\n');
      document.getElementById("alerts").textContent = alertMsg;
    } else {
      document.getElementById("alerts").textContent = "✅ No weather alerts right now.";
    }
  });
});

function updateSunInfo(sunrise, sunset) {
  const rise = new Date(sunrise * 1000).toLocaleTimeString();
  const set = new Date(sunset * 1000).toLocaleTimeString();
  document.getElementById("sun-info").textContent = `🌅 Sunrise: ${rise} | 🌇 Sunset: ${set}`;
}