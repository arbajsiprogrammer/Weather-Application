// loading env variables
import { API_KEY } from "./env.js";
import { BASE_URL } from "./env.js";
import { FORECAST_BASE_URL } from "./env.js";
// const dotenv = require("dotenv");
// console.log(API_KEY);
// console.log(BASE_URL);

let query = "";
const ele_weather_info = document.getElementById("weather-info");
ele_weather_info.style.display = "none";

const ele_not_found = document.getElementById("not-found");
ele_not_found.style.display = "none";
const ele_search_city = document.getElementById("search-city");

const ele_city_input = document.getElementById("city-input");
const ele_search_btn = document.getElementById("search-btn");

const ele_country_txt = document.getElementById("country-txt");

const ele_curr_date_txt = document.getElementById("current-date-txt");

const ele_weather_summary_img = document.getElementById("weather-summary-img");

const ele_temp_txt = document.getElementById("temp-txt");

const ele_condition_txt = document.getElementById("condition-txt");

const ele_humidity_value_txt = document.getElementById("humidity-value-txt");

const ele_wind_value_txt = document.getElementById("wind-value-txt");
const ele_forecast_items_container = document.getElementById(
  "forecast-items-container",
);
// getData("pune");
// onclick search btn => get ip val , reset it ,remove focus on the ip
ele_search_btn.addEventListener("click", () => {
  query = ele_city_input.value.trim();

  if (query != "") {
    // console.log(ele_city_input.value);
    updateWeatherInformation(query);
  } else {
    alert("Invalid Input");
  }

  ele_city_input.value = "";
  ele_city_input.blur();
});

ele_city_input.addEventListener("keyup", (e) => {
  //   console.log(e);
  if (e.key == "Enter" && e.target.value != "") {
    // console.log(e.target.value);
    query = e.target.value;
    updateWeatherInformation(query);

    ele_city_input.value = "";
    ele_city_input.blur();
  } else if (e.key == "Enter") {
    // console.log(e.target.value);
    alert("Invalid Input");

    ele_city_input.value = "";
    ele_city_input.blur();
  }

  // if (ele_weather_info.style.display == "flex") {
  //   ele_weather_info.style.display = "none";
  //   ele_search_city.style.display = "block";
  // }
});
// resetting when click on search
ele_city_input.addEventListener("click", () => {
  if (
    ele_weather_info.style.display == "flex" ||
    ele_not_found.style.display == "block"
  ) {
    ele_weather_info.style.display = "none";
    ele_search_city.style.display = "block";
    ele_not_found.style.display = "none";
  }
});

async function updateWeatherInformation(query) {
  console.log("query inside updateWeatherInformation...", query);

  const data = await getData(query);
  console.log("inside updateWeatherInformation..", data);

  if (data && data.cod != "200") {
    // ele_weather_info.style.display = "none";
    // ele_search_city.style.display = "none";
    showSection(ele_not_found);
    ele_not_found.style.display = "block";
  } else if (data) {
    // ele_weather_info.style.display = "flex";
    // ele_search_city.style.display = "none";
    // ele_not_found.style.display = "none";
    showSection(ele_weather_info);
    renderData(data);
  }

  // calling forecast Data
  const forecastData = await getData(query, "forecast");
  handleForecastData(forecastData);
  console.log("forecastData inside updateWeatherInformation...", forecastData);
}

async function getData(city, endpoint = "weather") {
  //running  code
  try {
    const response = await fetch(
      `${BASE_URL}/${endpoint}?q=${city}&appid=${API_KEY}&units=metric`,
    );

    const data = await response.json();
    console.log("data inside the getData...", data);
    // debugger;
    return data;

    // console.log(`${BASE_URL}?q=${query}&appid=${API_KEY}`);
    // console.log("data inside the getData...", data);
  } catch (error) {
    console.log(error);
  }
}

function showSection(section) {
  [ele_search_city, ele_weather_info, ele_not_found].forEach(
    (ele) => (ele.style.display = "none"),
  );
  section.style.display = "flex";
}

function renderData(data) {
  ele_country_txt.textContent = data.name;
  ele_temp_txt.textContent = Math.floor(data.main.temp) + " ℃";
  ele_condition_txt.textContent = data.weather[0].main;
  ele_humidity_value_txt.textContent = data.main.humidity + " %";
  ele_wind_value_txt.textContent = data.wind.speed + " M/s";
  ele_weather_summary_img.setAttribute(
    "src",
    `./Images/weather/${getStatus(data.weather[0].id)}`,
  );
  ele_curr_date_txt.textContent = getCurrDate();
}
// ./Images/weather/clouds.svg

function getStatus(id) {
  console.log(id);
  if (id == 800) return "clear.svg";
  else if (id >= 200 && id <= 232) return "thunderstorm.svg";
  else if (id >= 300 && id <= 321) return "drizzle.svg";
  else if (id >= 500 && id <= 531) return "rain.svg";
  else if (id >= 600 && id <= 622) return "snow.svg";
  else if (id >= 701 && id <= 781) return "atmosphere.svg";
  else if (id >= 801 && id <= 804) return "clouds.png";
}

// getting curr date
function getCurrDate() {
  let today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  console.log(today, "inside get curr date");
  return today;
}
// getCurrDate();

function handleForecastData(forecastData) {
  const today = new Date().toISOString().split("T")[0];
  console.log(today);
  //2026-05-05T12:14:13.990Z
  // &&
  // dt_txt: "2026-05-05 15:00:00";
  const data = forecastData.list.filter((forecast) => {
    if (
      !forecast.dt_txt.includes(today) &&
      forecast.dt_txt.includes("12:00:00")
    ) {
      return forecast;
    }
  });
  console.log(data, "data inside handle Forecast ");
  renderForecastData(data);
}

function renderForecastData(data) {
  let html = "";

  data.forEach((forecast, i) => {
    html += `<div class="forcast-item">
            <h5 class="forecast-item-date regular-text">${getForecastDate(forecast.dt_txt)}</h5>
            <img
              src="./Images/weather/${getStatus(forecast.weather[0].id)}"
              class="forcast-item-img"
            />
            <h5 class="forecast-item-cast">${Math.floor(forecast.main.temp) + " ℃"}</h5>
          </div>`;
  });
  ele_forecast_items_container.innerHTML = html;
  html = "";
}

// getting curr date for forecast
function getForecastDate(d) {
  let today = new Date(d).toLocaleDateString("en-GB", {
    // weekday: "short",
    day: "2-digit",
    month: "short",
  });
  console.log(today, "inside getForecastDate date");
  return today;
}
