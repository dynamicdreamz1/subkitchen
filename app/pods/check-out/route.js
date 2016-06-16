import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  cart: Ember.inject.service('shopping-cart'),
  ajax: Ember.inject.service(),

  model(){
    let paymentEndpoint = config.host + config.apiEndpoint + '/orders/' + this.get('cart.order.data.uuid') + '/payment';
    let models = {
      payment: this.get('ajax').request(paymentEndpoint),
      address: new Ember.Object(),
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
