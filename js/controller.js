export default class Controller {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.view.bindUpdateForecastLocation(
      this.updateForecastLocation.bind(this)
    );
    this.model.initErrorMessage = this.updateErrorMessage.bind(this);
    this.updateForecastLocation(
      this.model.startLocation[
        Math.floor(Math.random() * this.model.startLocation.length)
      ]
    );
  }

  async updateForecastLocation(location) {
    if (await this.model.setLocationForecast(location) !== false){
      this.view.renderForecast(this.model.locationForecast);
    }
  }

  updateErrorMessage(message) {
    this.view.renderErrorMessage(message);
  }
}
