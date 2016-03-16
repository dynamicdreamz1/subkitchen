import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Route.extend({
  cart: Ember.inject.service('shopping-cart'),
  user: Ember.inject.service('current-user'),
  ajax: Ember.inject.service(),

  model(){
    let paymentEndpoint = config.host + config.apiEndpoint + '/orders/' + this.get('cart.order.data.uuid') + '/payment';

    return Ember.RSVP.hash({
      payment: this.get('ajax').request(paymentEndpoint),
      address: this.store.findRecord('address', 'current'),
      user: this.get('user')
    });
  },

  getPayment(){
  }
});
