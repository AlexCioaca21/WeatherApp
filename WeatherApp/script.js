var input = document.getElementById("city");

var currentTemperature = document.getElementById("temp");
var humidityField = document.getElementById("humidity");
var pressure = document.getElementById("pressure");
var description = document.getElementById("description");
var minCurrentTemperature = document.getElementById("minTemp");
var maxCurrentTemperature = document.getElementById("maxTemp");
var weatherIcon = document.getElementById("image");

var day1 = document.getElementById("day1");

let httpRequest = new XMLHttpRequest();
let httpRequestForIcon = new XMLHttpRequest();
let httpRequestForDays = new XMLHttpRequest();

document.getElementById("weather").addEventListener("click", showWeather);
document
  .getElementById("forecast")
  .addEventListener("click", showForecast);
input.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    showWeather();
    showForecast();
  }
});

function showWeather() {
  resetPage();

  var city = input.value;

  if (city === "") {
    input.classList.add("invalid");
  } else {
    input.classList.remove("invalid");

    httpRequest.addEventListener("load", showWeather2);
    httpRequest.open(
      "GET",
      "https://api.openweathermap.org/data/2.5/weather?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=" +
        city
    );
    httpRequest.send();
  }
}

function showWeather2() {
  if (httpRequest.status === 200) {
    var responseObject = JSON.parse(httpRequest.responseText);

    weatherIcon.innerHTML =
      "<img width='60px' src='" +
      "http://openweathermap.org/img/w/" +
      responseObject.weather[0].icon +
      ".png" +
      "'>";
    currentTemperature.innerHTML = responseObject.main.temp;
    humidityField.innerText = responseObject.main.humidity;
    pressure.innerText = responseObject.main.pressure;
    description.innerText = responseObject.weather[0].description;
    minCurrentTemperature.innerText = responseObject.main.temp_min;
    maxCurrentTemperature.innerText = responseObject.main.temp_max;
    input.value = "";
  }
}

function showForecast() {
  resetPage();

  var city = input.value;

  if (city === "") {
    input.classList.add("invalid");
  } else {
    input.classList.remove("invalid");
    httpRequestForDays.addEventListener("load", displayForecast);
    httpRequestForDays.open(
      "GET",
      "https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=" +
        city
    );
    httpRequestForDays.send();
  }
}

function displayForecast() {
  if (httpRequestForDays.status === 200) {
    var responseObjectForDays = JSON.parse(httpRequestForDays.responseText);

    showOnDays(responseObjectForDays);
    showWeatherOnHours(responseObjectForDays);

    input.value = "";
  }
}

function showOnDays(response) {
  day1.innerText = "Ziua: " + response.list[0].dt_txt.split(" ")[0];

  var currentDay = response.list[0].dt_txt.split(" ")[0];
  var dayNo = 1;

  for (let i = 0; i < response.list.length; i++) {
    if (currentDay != response.list[i].dt_txt.split(" ")[0]) {
      currentDay = response.list[i].dt_txt.split(" ")[0];
      dayNo++;
      document.getElementById("day" + dayNo).innerText =
        "Ziua: " + response.list[i].dt_txt.split(" ")[0];
    }
  }
}

function showWeatherOnHours(response) {
  var currentDay = response.list[0];
  var index = 1;

  for (var i = 0; i < response.list.length; i++) {
    if (
      currentDay.dt_txt.split(" ")[0] === response.list[i].dt_txt.split(" ")[0]
    ) {
      currentDay = response.list[i];
      weatherInfo(currentDay, index);
    } else {
      currentDay = response.list[i];
      index++;
      weatherInfo(currentDay, index);
    }
  }
}

function weatherInfo(day, index) {
  var icon = document.createElement("div");
  icon.innerHTML =
    "<img width='60px' src='" +
    "http://openweathermap.org/img/w/" +
    day.weather[0].icon +
    ".png" +
    "'>";

  var hour = document.createElement("p");
  hour.innerText = "Ora: " + day.dt_txt.split(" ")[1];

  var temperature = document.createElement("p");
  temperature.innerText = "Temperatura: " + day.main.temp;

  var description1 = document.createElement("p");
  description1.innerText = "Descriere: " + day.weather[0].description;

  var weatherBox = document.createElement("div");
  weatherBox.classList.add("boxWithData");
  weatherBox.appendChild(icon);
  weatherBox.appendChild(hour);
  weatherBox.appendChild(temperature);
  weatherBox.appendChild(description1);

  document.getElementById("day" + index).appendChild(weatherBox);
}

function resetPage() {
  var weatherInputs = document.getElementsByClassName("weatherNow");
  var daysDetails = document.getElementsByClassName("dailyForecast");

  for (let i = 0; i < weatherInputs.length; i++) {
    weatherInputs[i].innerHTML = "";
  }
  for (let i = 0; i < daysDetails.length; i++) {
    daysDetails[i].innerHTML = "";
  }
  weatherIcon.innerHTML = "";
}