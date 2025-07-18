export default class Controller {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.view.bindUpdateForecastLocation(
      this.updateForecastLocation.bind(this)
    );
    this.updateForecastLocation(
      this.model.startLocation[
        Math.floor(Math.random() * this.model.startLocation.length)
      ]
    );
  }

  async updateForecastLocation(location) {
    await this.model.setLocationForecast(location);
    console.log(this.model.locationForecast);
    this.view.renderLocationForecast(this.model.locationForecast);
    this.view.renderDailyForecast(this.model.locationForecast);
  }
}
