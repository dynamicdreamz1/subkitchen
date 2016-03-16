import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  cart: Ember.inject.service('shopping-cart'),
  payment: null,
  address: null,
  user: null,
  errors: {},

  order: Ember.computed(['address', 'user'], function(){
    let address = this.get('address');
    let fullname = [address.get('firstName'), address.get('lastName')].
      reject(function(i){
        return !i.length;
      }).compact().join(' ');

      console.log('user', this.get('user.data.email'));
    let order = new Ember.Object({
      payment_type: 'paypal',
      email: this.get('user').get('data.email'),
      full_name: fullname,
      address: address.get('address'),
      city: address.get('city'),
      country: address.get('country'),
      region: address.get('region'),
      zip: address.get('zip')
    });

    return order;
  }),

  hasItems: Ember.computed('payment.order.items', function(){
    let order = this.get('payment.order');
    return order && order.items && order.items.length;
  }),

  hasData: Ember.computed(['hasItems', 'payment.deleted_items'], function(){
    let deleted_items = this.get('payment.deleted_items');
    return this.get('hasItems') || (deleted_items && deleted_items.length);
  }),

  init() {
    this._super(...arguments);
    this.get('cart').reload();
  },

  actions: {
    order(){
      let paymentEndpoint = config.host + config.apiEndpoint + '/orders/' + this.get('cart.order.data.uuid') + '/payment';
      let params = this.get('order').getProperties('email', 'full_name', 'address', 'city', 'zip', 'region', 'country', 'payment_type', 'stripe_token', 'return_path');

      console.log(params);

      Ember.$.ajax({
        url: paymentEndpoint,
        type: 'POST',
        data: params,
        dataType: 'json'
      })
      .then((result)=>{
        console.log(result);
        if (result.url){
          window.top.location.href = result.url;
        }
      }, (error)=>{
        console.log(error);
      });
    }
  }
});
