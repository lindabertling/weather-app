// require("dotenv").config();

// selectors
const location = document.querySelector(".location");
const weatherWrapper = document.querySelector(".weather-wrapper");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const feelsLike = document.querySelector(".feels-like");
const precipitation = document.querySelector(".precipitation");
const wind = document.querySelector(".wind");
const precipitationForecastWrapper = document.querySelector(
  ".precipitation-forecast-wrapper"
);
const precipitationForecast = document.querySelector(".precipitation-forecast");

navigator.geolocation.getCurrentPosition(positionSuccess, positionFailure);

const getHour = function () {
  const minutes = new Date().getMinutes();
  const hours = new Date().getHours();

  if (minutes < 30) {
    return hours;
  } else if (minutes >= 30) {
    return hours + 1;
  }
};
const hour = getHour();
const { API_KEY } = process.env;

function positionSuccess({ coords }) {
  getLocationName(coords.latitude, coords.longitude).then((res) => {
    location.textContent = res.osmtags.name;
  });
  getWeather(coords.latitude, coords.longitude)
    .then((res) => {
      weatherIcon.textContent = setWeatherIcon(res.weatherIconCode);
      temperature.textContent = res.temperature;
      feelsLike.textContent = res.feelsLike;
      precipitation.textContent = res.precipitation;
      wind.textContent = res.wind;
      precipitationForecast.textContent = res.precipitationForecast;
      weatherWrapper.classList.remove("blurred");
      precipitationForecastWrapper.classList.remove("blurred");
    })
    .catch((e) => console.log("Error: " + e));
}

function positionFailure() {
  alert(
    "An error occured when trying to get your location. Please check your location settings and try again. :)"
  );
}

function getLocationName(latitude, longitude) {
  return fetch(
    `https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => data);
}

function getWeather(latitude, longitude) {
  return axios
    .get(
      "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,windspeed_10m",
      { params: { latitude, longitude } }
    )
    .then(({ data }) => {
      const temperature = data.hourly.temperature_2m[hour];
      const feelsLikeTemp = data.hourly.apparent_temperature[hour];
      const precipitation = data.hourly.precipitation[hour];
      const wind = data.hourly.windspeed_10m[hour];
      const precipitationForecast = data.hourly.precipitation_probability[hour];
      const weatherIconCode = data.hourly.weathercode[hour];
      return {
        temperature: temperature,
        feelsLike: feelsLikeTemp,
        precipitation: precipitation,
        wind: wind,
        precipitationForecast: precipitationForecast,
        weatherIconCode: weatherIconCode,
      };
    });
}

const setWeatherIcon = (weatherIcon) => {
  switch (weatherIcon) {
    case 0:
      return "☀️";
      break;
    case 1:
      return "🌤️";
      break;
    case 2:
      return "⛅️";
      break;
    case 3:
      return "☁️";
      break;
    case 45:
    case 48:
      return "🌫️";
      break;
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return "🌧️";
      break;
    case 56:
    case 57:
    case 66:
    case 67:
    case 85:
    case 86:
      return "❄️🌧️";
      break;
    case 71:
    case 73:
    case 75:
    case 77:
      return "🌧️";
      break;
    case 95:
    case 96:
    case 99:
      return "⛈️";
      break;
  }
};
