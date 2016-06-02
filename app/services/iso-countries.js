import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Service.extend({

  init() {
    this._super(...arguments);
    this.fetchIsoCountries();
  },

  fetchIsoCountries() {
    Ember.$.ajax({
      method: "GET",
      url: config.host + config.apiEndpoint + '/iso_countries'
    }).then((result) => {
      this.set('data', result);
    });
  }
});
