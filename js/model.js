import {apiKey} from '../env.js';

export default class Model {
  locationForecast;
  startLocation = ["Kyiv", "Paris", "New-York"]

  async setLocationForecast(location) {
    let geoCordinatesResponse = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`
    );
    let geoCordinates = await geoCordinatesResponse.json();
    geoCordinates = geoCordinates[0];
    let weatherResponse = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${geoCordinates.lat}&lon=${geoCordinates.lon}&units=metric&appid=${apiKey}`
    );
    let weatherInfo = await weatherResponse.json();
    this.locationForecast = {
      location: { name: geoCordinates.name, country: geoCordinates.country },
      currentTemperature: Math.round(weatherInfo.current.temp),
      daily: [],
    };
    this.locationForecast.location.state = geoCordinates.state
      ? geoCordinates.state
      : undefined;
    for (let i = 0; i < 7; i++) {
      let weatherDay = weatherInfo.daily[i];
      let date = new Date(weatherDay.dt * 1000);
      let processedDay = {
        name: {
          short: date.toLocaleString('en-GB', { weekday: 'short' }),
          long: date.toLocaleString('en-GB', { weekday: 'long' }),
        },
        humidity: weatherDay.humidity,
        precitipation: weatherDay.pop * 100,
        cloudiness: weatherDay.clouds,
        condition: {
          name: weatherDay.weather[0].main,
          iconPath: `../media/${weatherDay.weather[0].id}.svg`,
        },
      };
      processedDay.temperature = {
        max: weatherDay.temp.max,
        min: weatherDay.temp.min,
        avg:
          (weatherDay.temp.day +
            weatherDay.temp.morn +
            weatherDay.temp.night +
            weatherDay.temp.eve) /
          4,
      };
      for (let prop in processedDay.temperature) {
        processedDay.temperature[prop] = Math.round(
          processedDay.temperature[prop]
        );
      }
      if (i === 0) {
        let hour = new Date(weatherInfo.current.dt * 1000).toLocaleString('en-GB', { hour: '2-digit' });
        processedDay.temperature.current = Math.round(weatherInfo.current.temp);
        processedDay.time = `${hour}:00`;
      }
      this.locationForecast.daily.push(processedDay);
    }
  }
}
