const apiKey = "4987a0771bd844c6861205751263108"; // weatherapi.com Weather API key
const weatherResultDiv = document.getElementById("weatherResult");

// Consult the weather masters...
async function processWeatherRequest(location) {
  if (!location) location = "Portland";
  // const baseURL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;
  const baseURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5&aqi=no&alerts=no`;
  locationInput.value = location;
  try {
    const weatherResponse = await fetch(baseURL);
    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok) {
      if (weatherData.error.message.includes("No matching location found")) {
        throw new Error(`No matching location found for search "${location}"`);
      }
      throw new Error(`Failed to fetch weather data: ${weatherData.error.message}`);
    }
    if (!weatherData || !weatherData.current) {
      throw new Error("Invalid weather data");
    }

    populateDOM(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Begin DOM manipulation

    weatherResultDiv.innerHTML = `
    <h1>Error</h1>
    <p>${error.message}</p>
    `;
  }
}

// Get SVG for moon phase by phase.
function getMoonPhaseSVG(moonPhase) {
  switch (moonPhase) {
    case "New Moon":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>New Moon</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1h1v-1h1V9h1V4h-1V3H9V2H8V1H3v1H2v1H1v1H0v5h1v1h1v1h1Zm0 0" /></svg>`;
      break;
    case "Waxing Crescent":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>Waxing Crescent</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1h1v-1h1V9h1V4h-1V3H9V2H8V1H3v1H2v1H1v1H0v5h1v1h1v1h1Zm0 0" /></svg>`;
      break;
    case "First Quarter":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>First Quarter</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1H6V2h2V1H3v1H2v1H1v1H0v5h1v1h1v1h1Zm5-1h1v-1H8Zm1-1h1V9H9Zm1-1h1V4h-1ZM8 3h1V2H8Zm1 1h1V3H9Zm0 0" /></svg>`;
      break;
    case "Waxing Gibbous":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>Waxing Gibbous</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1H5v-1H4V9H3V4h1V3h1V2h3V1H3v1H2v1H1v1H0v5h1v1h1v1h1Zm5-1h1v-1H8Zm1-1h1V9H9Zm1-1h1V4h-1ZM8 3h1V2H8Zm1 1h1V3H9Zm0 0" /></svg>`;
      break;
    case "Full Moon":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>Full Moon</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M10 9H9v1h1Zm0 0h1V4h-1Zm-8 2h1v-1H2Zm-1-1h1V9H1ZM0 9h1V4H0Zm3 3h5v-1H3ZM1 4h1V3H1Zm7 7h1v-1H8ZM2 3h1V2H2Zm1-1h5V1H3Zm5 1h1V2H8Zm1 1h1V3H9Zm0 0" /></svg>`;
      break;
    case "Waning Gibbous":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>Waning Gibbous</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1h1v-1h1V9h1V4h-1V3H9V2H8V1H3v1h3v1h1v1h1v5H7v1H6v1H3Zm-1-1h1v-1H2Zm-1-1h1V9H1ZM0 9h1V4H0Zm1-5h1V3H1Zm1-1h1V2H2Zm0 0" /></svg>`;
      break;
    case "Last Quarter":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>Last Quarter</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1h1v-1h1V9h1V4h-1V3H9V2H8V1H3v1h2v9H3Zm-1-1h1v-1H2Zm-1-1h1V9H1ZM0 9h1V4H0Zm1-5h1V3H1Zm1-1h1V2H2Zm0 0" /></svg>`;
      break;
    case "Waning Crescent":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>Waning Crescent</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1h1v-1h1V9h1V4h-1V3H9V2H8V1H3v1h2v1H4v1H3v5h1v1h1v1H3Zm-1-1h1v-1H2Zm-1-1h1V9H1ZM0 9h1V4H0Zm1-5h1V3H1Zm1-1h1V2H2Zm0 0" /></svg>`;
      break;
    default:
      return "";
  }
  day.astro.moon_phase == "New Moon"
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>New Moon</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1h1v-1h1V9h1V4h-1V3H9V2H8V1H3v1H2v1H1v1H0v5h1v1h1v1h1Zm0 0" /></svg>`
    : day.astro.moon_phase == "Waxing Crescent"
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>Waxing Crescent</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1h1v-1h1V9h1V4h-1V3H9V2H8V1H3v1h2v1H4v1H3v5h1v1h1v1H3Zm-1-1h1v-1H2Zm-1-1h1V9H1ZM0 9h1V4H0Zm1-5h1V3H1Zm1-1h1V2H2Zm0 0" /></svg>`
      : day.astro.moon_phase == "First Quarter"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>First Quarter</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1H6V2h2V1H3v1H2v1H1v1H0v5h1v1h1v1h1Zm5-1h1v-1H8Zm1-1h1V9H9Zm1-1h1V4h-1ZM8 3h1V2H8Zm1 1h1V3H9Zm0 0" /></svg>`
        : day.astro.moon_phase == "Waxing Gibbous"
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>Waxing Gibbous</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1H5v-1H4V9H3V4h1V3h1V2h3V1H3v1H2v1H1v1H0v5h1v1h1v1h1Zm5-1h1v-1H8Zm1-1h1V9H9Zm1-1h1V4h-1ZM8 3h1V2H8Zm1 1h1V3H9Zm0 0" /></svg>`
          : day.astro.moon_phase == "Full Moon"
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>Full Moon</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M10 9H9v1h1Zm0 0h1V4h-1Zm-8 2h1v-1H2Zm-1-1h1V9H1ZM0 9h1V4H0Zm3 3h5v-1H3ZM1 4h1V3H1Zm7 7h1v-1H8ZM2 3h1V2H2Zm1-1h5V1H3Zm5 1h1V2H8Zm1 1h1V3H9Zm0 0" /></svg>`
            : day.astro.moon_phase == "Waning Gibbous"
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>Waning Gibbous</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1h1v-1h1V9h1V4h-1V3H9V2H8V1H3v1h3v1h1v1h1v5H7v1H6v1H3Zm-1-1h1v-1H2Zm-1-1h1V9H1ZM0 9h1V4H0Zm1-5h1V3H1Zm1-1h1V2H2Zm0 0" /></svg>`
              : day.astro.moon_phase == "Last Quarter"
                ? `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>Last Quarter</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1h1v-1h1V9h1V4h-1V3H9V2H8V1H3v1h2v9H3Zm-1-1h1v-1H2Zm-1-1h1V9H1ZM0 9h1V4H0Zm1-5h1V3H1Zm1-1h1V2H2Zm0 0" /></svg>`
                : day.astro.moon_phase == "Waning Crescent"
                  ? `<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 12 12"><title>Waning Crescent</title><path d="M0 0h12v12H0z" fill="none" /><path fill="currentColor" d="M3 12h5v-1h1v-1h1V9h1V4h-1V3H9V2H8V1H3v1h2v1H4v1H3v5h1v1h1v1H3Zm-1-1h1v-1H2Zm-1-1h1V9H1ZM0 9h1V4H0Zm1-5h1V3H1Zm1-1h1V2H2Zm0 0" /></svg>`
                  : "";
}

// SHOW THEM!
function populateDOM(weatherData) {
  console.log(weatherData);
  weatherResultDiv.innerHTML = `here!`;

  // Create date object for local time.
  const localTime = new Date(weatherData.location.localtime);

  // Decide wind descriptor depending on speed.
  let windDescriptor = "";
  const windSpeed = weatherData.current.wind_mph;
  if (windSpeed < 1) {
    windDescriptor = "Calm";
  } else if (windSpeed < 7) {
    windDescriptor = "Light Breeze";
  } else if (windSpeed < 12) {
    windDescriptor = "Gentle Breeze";
  } else if (windSpeed < 18) {
    windDescriptor = "Moderate Breeze";
  } else if (windSpeed < 24) {
    windDescriptor = "Fresh Breeze";
  } else if (windSpeed < 31) {
    windDescriptor = "Strong Breeze";
  } else if (windSpeed < 38) {
    windDescriptor = "Near Gale / High Wind";
  } else if (windSpeed < 46) {
    windDescriptor = "Fresh Gale";
  } else if (windSpeed < 54) {
    windDescriptor = "Strong Gale";
  } else if (windSpeed < 64) {
    windDescriptor = "Whole Gale / Storm";
  } else {
    windDescriptor = "Good luck...";
  }

  // UV Descriptor
  let uvDescriptor = "";
  const uvIndex = weatherData.current.uv;
  if (uvIndex < 3) {
    uvDescriptor = "Low";
  } else if (uvIndex < 6) {
    uvDescriptor = "Moderate";
  } else if (uvIndex < 8) {
    uvDescriptor = "High";
  } else if (uvIndex < 11) {
    uvDescriptor = "Very High";
  } else {
    uvDescriptor = "Extreme";
  }

  // 1859 Balloon Voyage Status - Gusts of 8m/s is the limit, this is about 18mph.
  let balloonVoyageStatus = "";
  if (new Date().getDay() === 1) {
    balloonVoyageStatus =
      "The 1859 Balloon Voyage will not fly today because it's Monday (some exceptions)...";
  } else if (weatherData.current.wind_mph < 14) {
    balloonVoyageStatus = "The 1859 Balloon Voyage will probably fly today!";
  } else if (weatherData.current.wind_mph < 18) {
    balloonVoyageStatus = "The 1859 Balloon Voyage might be flying today.";
  } else {
    balloonVoyageStatus = "The 1859 Balloon Voyage most certainly will not fly today.";
  }

  // Forecast
  const forecast = weatherData.forecast.forecastday;

  const forecastHTML = forecast
    .map(
      (day) => `
    <div class="forecast-day" style="text-align: center; margin-bottom: 1ch; font-size: 1em;">
    <h3>${new Date(day.date).toLocaleDateString()}</h3>
      <p>${day.day.condition.text}</p>
      <img src="${day.day.condition.icon}" alt="${day.day.condition.text} icon" width="49px" height="49px" />
      <p>${day.day.maxtemp_f}°F</p><p>${day.day.mintemp_f}°F</p>
      <p style="font-family: monospace; font-size: 1.2em;">UV: ${uvIndex} (${uvDescriptor})</p>
      <hr />
      <div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <title>Rain</title>
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="currentColor" d="M3 16h1v3H3zm2 3h1v3H5zm2-2h1v3H7zm2 2h1v3H9zm4 1h1v3h-1zm-2-3h1v3h-1zm6 3h1v3h-1zm-2-3h1v3h-1zm6 2h1v3h-1zm2-11v5h-1v1h-1v1h-2v1H5v-1H3v-1H2v-1H1V8h1V7h3V4h1V3h1V2h1V1h5v1h1v2h1V3h3v1h1v1h1v2h2v1zm-4 9h1v3h-1z" />
          </svg>
          <span>${day.day.daily_chance_of_rain}%</span>
        </div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <title>Snow</title>
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" d="M13 24h-2v-2h2zm-2-2H9v-2H7v2H2v-5h2v3h3v-2h2v-2h2zm4-4h2v2h-2v2h-2v-6h2zm7 4h-5v-2h3v-3h2zM8 15H6v2H4v-2H2v-2h6zm14 0h-2v2h-2v-2h-2v-2h6zm-8-1h-4v-4h4zM2 13H0v-2h2zm22 0h-2v-2h2zM6 9h2v2H2V9h2V7h2zm14 0h2v2h-6V9h2V7h2zm-9-1H9V6H7V4h2V2h2zm4-4h2V2h5v5h-2V4h-3v2h-2v2h-2V2h2zM7 4H4v3H2V2h5zm6-2h-2V0h2z" />
          </svg>

          <span>${day.day.daily_chance_of_snow}%</span>
        </div>
      </div>
      <hr />
      <div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.8ch; font-family: monospace; font-size: 1.3em;">
        <svg xmlns="http://www.w3.org/2000/svg" width="2.4ch" height="2.4ch" viewBox="0 0 24 24">
        <title>Wind</title>
        <path d="M0 0h24v24H0z" fill="none" />
        <path fill="currentColor" d="M2 7h10v2H2zm10-4h2v4h-2zM7 1h5v2H7zM2 11h18v2H2zm18-4h2v4h-2zm-4-2h4v2h-4zM2 17h12v-2H2zm12 2h2v-2h-2zm-5 2h5v-2H9z" />
        </svg>
        <p>Wind</p>
        </div>
        <p>${day.day.maxwind_mph} mph</p>
        <p>${(day.day.maxwind_mph * 0.44704).toPrecision(2)} m/s</p>
      </div>
      <hr />
      <p>Visibility</p>
      <p style="font-size: 1.2em; font-family: monospace;">${day.day.avgvis_miles} mi</p>
      <hr />
      <p>Humidity</p>
      <p style="font-size: 1.2em; font-family: monospace;">${day.day.avghumidity} %</p>
      <hr />
      <div style="display: flex; gap: 0.8ch; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16">
          <title>Sunrise</title>
          <path d="M0 0h16v16H0z" fill="none" />
          <path fill="currentColor" d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707m11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0M11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10m13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
        </svg>

        <p>${day.astro.sunrise}</p>
      </div>
      <div style="display: flex; gap: 0.8ch; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16">
          <title>Sunset</title>
          <path d="M0 0h16v16H0z" fill="none" />
          <path fill="currentColor" d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10m13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
        </svg>
        <p>${day.astro.sunset}</p>
      </div>
      <hr />
      <div style="display: flex; justify-content: center; flex-direction: column;">
      <div style="display: block; justify-content: center;">
        ${getMoonPhaseSVG(day.astro.moon_phase)}
        </div>
        <p>${day.astro.moon_phase}</p>
      </div>
      <hr />
      ${day.hour
        .map(
          (hour) => `
        <div>
          <h3>${new Date(hour.time).toLocaleTimeString(2, { hour: "2-digit", minute: "2-digit" })}</h3>
          <p>${hour.condition.text}</p>
          <img width="55px" style="scale: 1;" src="${hour.condition.icon}" alt="${hour.condition.text} icon" />
          <p>Max Temp: ${hour.temp_f}°F</p>
          <p>Wind: ${hour.wind_mph} mph</p>
          <p>Gusts: ${(hour.gust_mph * 0.44704).toPrecision(2)} m/s | ${hour.gust_mph} mph</p>
          <p>Rain Chance: ${hour.chance_of_rain}%</p>
          <p>Visibility: ${hour.vis_miles} miles</p>
        </div>
        <hr />
      `,
        )
        .join("")}
    </div>
  `,
    )
    .join("");

  // Begin DOM manipulation
  weatherResultDiv.innerHTML = `
  <div style="text-align: center;">
    <h2>${weatherData.location.name}, ${weatherData.location.region}</h2>
    <span>${weatherData.location.country == "United States of America" ? "USA" : weatherData.location.country}</span>
    <span> ${localTime.toLocaleDateString()} · ${localTime.toLocaleTimeString()}</span>
  </div>
  <div class="overview" style="display: flex; gap: 1ch;">
    <div class="card">  
      <div>
        <h2>${weatherData.current.condition.text}</h2>
      </div>
      <div style="display: flex; align-items: center; justify-content: flex-start; flex-wrap: wrap; gap: 1ch;">
        <div class="pixel-corners-thin">
          <img width="62px" style="scale: 1;" src="${weatherData.current.condition.icon}" alt="${weatherData.current.condition.text} icon">
        </div>    
        <div>
          <p style="font-size: 1.5em; font-weight: bold;">${weatherData.current.temp_f}°F</p>
          <p style="font-size: 1em; font-weight: bold;">High ${weatherData.forecast.forecastday[0].day.maxtemp_f}°F / Low ${weatherData.forecast.forecastday[0].day.mintemp_f}°F</p>
          <p>Feels like ${weatherData.current.feelslike_f}°F / ${weatherData.current.feelslike_c}°C</p>
        </div>
      </div>
      <hr />
      <h2>UV index</h2>
      <div style="display: flex; align-items: center; justify-content: flex-start; flex-wrap: wrap; gap: 1ch;">
        <svg xmlns="http://www.w3.org/2000/svg" width="44px" height="44px" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="currentColor" d="M1 11h5v2H1zm3-6H3V4h1V3h1v1h1v1h1v1h1v1H7v1H6V7H5V6H4zm3 12h1v1H7v1H6v1H5v1H4v-1H3v-1h1v-1h1v-1h1v-1h1zm4 1h2v5h-2zm0-17h2v5h-2zm9 18h1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h1v-1h1v1h1v1h1zm-2-8h5v2h-5zm-1-4h-1V6h1V5h1V4h1V3h1v1h1v1h-1v1h-1v1h-1v1h-1zm-1 9h-2v1h-4v-1H8v-2H7v-4h1V8h2V7h4v1h2v2h1v4h-1z" />
        </svg>
        <div>
          <p style="font-size: 1.5em; font-weight: bold;">${weatherData.current.uv}</p>
          <p>UV index is considered ${uvDescriptor}</p>
        </div>
      </div>
      <hr />
      <div style="display: flex; flex-wrap: wrap; justify-content: space-around; font-family: monospace;">
        <div style="display: flex; align-items: center; gap: 0.5ch;">
          <svg xmlns="http://www.w3.org/2000/svg" width="2.3em" height="2.3em" viewBox="0 0 24 24">
          <title>Rain</title>
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="currentColor" d="M3 16h1v3H3zm2 3h1v3H5zm2-2h1v3H7zm2 2h1v3H9zm4 1h1v3h-1zm-2-3h1v3h-1zm6 3h1v3h-1zm-2-3h1v3h-1zm6 2h1v3h-1zm2-11v5h-1v1h-1v1h-2v1H5v-1H3v-1H2v-1H1V8h1V7h3V4h1V3h1V2h1V1h5v1h1v2h1V3h3v1h1v1h1v2h2v1zm-4 9h1v3h-1z" />
          </svg>
          <span style="font-size: 1.5em;">${weatherData.forecast.forecastday[0].day.daily_chance_of_rain}%</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5ch;">
          <svg xmlns="http://www.w3.org/2000/svg" width="2.3em" height="2.3em" viewBox="0 0 24 24">
            <title>Snow</title>
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" d="M13 24h-2v-2h2zm-2-2H9v-2H7v2H2v-5h2v3h3v-2h2v-2h2zm4-4h2v2h-2v2h-2v-6h2zm7 4h-5v-2h3v-3h2zM8 15H6v2H4v-2H2v-2h6zm14 0h-2v2h-2v-2h-2v-2h6zm-8-1h-4v-4h4zM2 13H0v-2h2zm22 0h-2v-2h2zM6 9h2v2H2V9h2V7h2zm14 0h2v2h-6V9h2V7h2zm-9-1H9V6H7V4h2V2h2zm4-4h2V2h5v5h-2V4h-3v2h-2v2h-2V2h2zM7 4H4v3H2V2h5zm6-2h-2V0h2z" />
          </svg>

          <span style="font-size: 1.5em;">${weatherData.forecast.forecastday[0].day.daily_chance_of_snow}%</span>
        </div>
      </div>
    </div>
    <div class="card">
      <div>
        <h2 style="margin-bottom: 0.3ch;">${windDescriptor}</h2>
      </div>
      <div style="display: flex; align-items: center; justify-content: flex-start; flex-wrap: wrap; gap: 1ch;">
        <svg xmlns="http://www.w3.org/2000/svg" width="47px" height="47px" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="currentColor" d="M2 7h10v2H2zm10-4h2v4h-2zM7 1h5v2H7zM2 11h18v2H2zm18-4h2v4h-2zm-4-2h4v2h-4zM2 17h12v-2H2zm12 2h2v-2h-2zm-5 2h5v-2H9z" />
        </svg>   
        <div>
          <p style="font-size: 1.5em; font-weight: bold;">${(weatherData.current.wind_mph * 0.44704).toPrecision(2)} m/s | ${weatherData.current.wind_mph} mph</p>
          <p>Wind direction: ${weatherData.current.wind_dir}</p>
          <p>Gusts: ${weatherData.current.gust_mph} mph</p>
          <p style="font-size: 1.2em; font-weight: bold;">${weatherData.location.region == "Indiana" ? balloonVoyageStatus : ""}</p>
        </div>
        </div>
      <hr />
      <div style="display: flex; align-items: center; justify-content: flex-start; gap: 0.8ch;">
      ${getMoonPhaseSVG(weatherData.forecast.forecastday[0].astro.moon_phase)}
      <h2>${weatherData.forecast.forecastday[0].astro.moon_phase}</h2>
      </div>
    </div>
  </div>

  <div id="cardInfo">
  <div><p class="cardTitle">VISIBILITY</p><p style="font-size: 1.3em;">${weatherData.current.vis_miles} mi</p></div>
  <div><p class="cardTitle">HUMIDITY</p><p style="font-size: 1.3em;">${weatherData.current.humidity}%</p></div>
  <div><p class="cardTitle">PRECIPITATION</p><p style="font-size: 1.3em;">${weatherData.current.precip_in} in</p></div>
  </div>

  <table style="width: 100%;">
    <thead>
      <tr>
        <th>Time</th>
        <th>Temp</th>
        <th>Wind</th>
        <th>Gusts</th>
        <th>Rain</th>
      </tr>
    </thead>
    <tbody>
  ${weatherData.forecast.forecastday[1].hour
    .map(
      (hour) => `
      <tr>
        <td style="text-align: center; white-space: nowrap;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 0.5ch;">
            <h3 style="margin: 0; font-size: 0.9em;">${new Date(hour.time).toLocaleTimeString(2, { hour: "2-digit", minute: "2-digit" })}</h3>
            <img width="30px" src="${hour.condition.icon}" alt="${hour.condition.text} icon" />
          </div>
        </td>
        <td style="text-align: center; font-weight: bold;">${hour.temp_f}°F</td>
        <td style="text-align: center;">${(hour.wind_mph * 0.44704).toPrecision(2)} m/s</td>
        <td style="text-align: center; font-size: 0.9em;">${(hour.gust_mph * 0.44704).toPrecision(2)} m/s</td>
        <td style="text-align: center;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 0.3ch;">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
              <title>Rain</title>
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill="currentColor" d="M3 16h1v3H3zm2 3h1v3H5zm2-2h1v3H7zm2 2h1v3H9zm4 1h1v3h-1zm-2-3h1v3h-1zm6 3h1v3h-1zm-2-3h1v3h-1zm6 2h1v3h-1zm2-11v5h-1v1h-1v1h-2v1H5v-1H3v-1H2v-1H1V8h1V7h3V4h1V3h1V2h1V1h5v1h1v2h1V3h3v1h1v1h1v2h2v1zm-4 9h1v3h-1z" />
            </svg>
            <span style="margin: 0;">${hour.chance_of_rain}%</span>
          </div>
        </td>
      </tr>
      `,
    )
    .join("")}
    </tbody>
  </table>
    <hr />
  <h2 style="text-align: center; margin-bottom: 0.4ch;">Forecast</h2>
  <div id="forecast">${forecastHTML}</div>
  `;
}

// Handle Form Input
const getWeatherBtn = document.getElementById("getWeatherBtn");
const locationInput = document.getElementById("location");
getWeatherBtn.addEventListener("click", () => {
  locationInput.blur();
  const location = locationInput.value;
  processWeatherRequest(location);
});

// Bookmarks (SVG) click handling
document.querySelectorAll("#bookmarks svg, #bookmarks img").forEach((bookmark) => {
  bookmark.addEventListener("click", () => {
    const location = bookmark.id;
    processWeatherRequest(location);
  });
});

// Default request
processWeatherRequest("Fishers, IN");
