import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.fetchIsoCountries();
  },

  fetchIsoCountries() {
    this.get('ajax').request(config.host + config.apiEndpoint + '/iso_countries').then((result) => {
      this.set('data', result);
    });
  }
});
