export default class View {
  currentForecastDiv = document.querySelector('.current-forecast');
  temperatureP = this.currentForecastDiv.querySelector('.temperature-p');
  locataionP = this.currentForecastDiv.querySelector('.location-p');
  dateP = this.currentForecastDiv.querySelector('.date-p');
  mainWeatherConditionSvg =
    this.currentForecastDiv.querySelector('.weather-state-pic');
  humidityP = this.currentForecastDiv.querySelector('.humidity-p');
  cloudinessP = this.currentForecastDiv.querySelector('.cloudiness-p');
  precipitationP = this.currentForecastDiv.querySelector('.precips-p');
  weatherForm = document.querySelector('.weather-form');
  locataionInput = document.querySelector('.location-input');
  dailyForecastContainer = document.querySelector('.daily-forecast-container');
  dailyForecastList =
    this.dailyForecastContainer.querySelector('.weather-day-list');
  errorMessage = document.createElement('p');

  constructor() {
    this.errorMessage.style.color = "red";
  }

  renderDayForecast(forecast, day) {
    this.weatherForm.reset();
    let forecastDay = forecast.daily[day];
    this.temperatureP.textContent = `Temperature: ${
      day && forecastDay.temperature.current
        ? forecastDay.temperature.current
        : day && forecastDay.temperature.avg
        ? forecastDay.temperature.avg
        : forecast.currentTemperature
    }°C`;
    this.locataionP.textContent = `${forecast.location.name + ', '}${
      forecast.location.state ? forecast.location.state + ', ' : ''
    }${forecast.location.country}`;
    this.dateP.textContent = `${
      day && forecastDay.name.long
        ? forecastDay.name.long
        : forecast.daily[0].name.long
    }${day === undefined || day === 0 ? ', ' + forecast.daily[0].time : ''}`;
    this.humidityP.textContent = `Humidity: ${
      day ? forecastDay.humidity : forecast.daily[0].humidity
    }%`;
    this.cloudinessP.textContent = `Cloudiness: ${
      day ? forecastDay.cloudiness : forecast.daily[0].cloudiness
    }%`;
    this.precipitationP.textContent = `Precipitations: ${
      day ? forecastDay.precitipation : forecast.daily[0].precitipation
    }%`;
    this.mainWeatherConditionSvg.src = day
      ? forecastDay.condition.iconPath
      : forecast.daily[0].condition.iconPath;
  }

  renderDailyForecast(forecast) {
    let dailyForecast = forecast.daily;
    this.dailyForecastList
      .querySelectorAll('*')
      .forEach((element) => element.remove());
    dailyForecast.forEach((day, dayIndex = 0) => {
      let weatherDayLi = document.createElement('li');
      let dayNameP = document.createElement('p');
      let dayInfoDiv = document.createElement('div');
      let weatherStatePic = document.createElement('img');
      let temperatureP = document.createElement('p');
      weatherDayLi.className = 'weather-day';
      dayNameP.className = 'day-name';
      dayInfoDiv.className = 'day-info';
      weatherStatePic.className = 'weather-state-pic';
      temperatureP.className = 'temperature';
      dayNameP.textContent = day.name.short;
      weatherStatePic.src = day.condition.iconPath;
      temperatureP.textContent = `${day.temperature.max}°/${day.temperature.min}°`;
      this.dailyForecastList.append(weatherDayLi);
      weatherDayLi.append(dayNameP, dayInfoDiv);
      dayInfoDiv.append(weatherStatePic, temperatureP);
      let switchForecastDay = function () {
        this.renderDayForecast(forecast, dayIndex);
      };
      weatherDayLi.addEventListener('click', switchForecastDay.bind(this));
    });
  }

  renderForecast(forecast) {
    this.weatherForm.reset();
    this.errorMessage.remove();
    this.renderDayForecast(forecast);
    this.renderDailyForecast(forecast);
  }

  renderErrorMessage(message) {
    this.errorMessage.textContent = message;
    this.weatherForm.append(this.errorMessage);
  }

  bindUpdateForecastLocation(updateForecastLocation) {
    this.weatherForm.addEventListener('submit', () => {
      updateForecastLocation(this.locataionInput.value);
    });
  }
}
