/* global $ */
import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  model(params){
    return Ember.RSVP.hash({
      promo: this.get('ajax').request(config.host + config.apiEndpoint + '/config'),
      trending: this.store.query('product', $.extend({page: 1, per_page: 4}, params))
    });
  }
});
