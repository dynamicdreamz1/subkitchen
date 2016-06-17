import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  cart: Ember.inject.service('shopping-cart'),
  ajax: Ember.inject.service(),

  model(){
    let country = Ember.$.ajax({ url: "http://freegeoip.net/json/" }).then((response) => {
      return response.country_name;
    });

    let paymentEndpoint = config.host + config.apiEndpoint + '/orders/' + this.get('cart.order.data.uuid') + '/payment';
    let models = {
      payment: this.get('ajax').request(paymentEndpoint),
      address: new Ember.Object(),
      country: country,
      templates: this.store.query('productTemplate', {})
    };

    if (this.get('session').get('isAuthenticated')){
      models['address'] = this.store.findRecord('address', 'current');
    }

    return Ember.RSVP.hash(models);
  },

  actions: {
    error(error) {
      if (error) {
        return this.transitionTo('profile');
      }
    }
  }
});
