import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  cart: Ember.inject.service('shopping-cart'),
  stripe: Ember.inject.service(),
  payment: null,
  address: null,
  user: null,
  card: new Ember.Object(),
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
      let payment_type = this.get('order.payment_type');
      if (payment_type === 'stripe'){
        this.payWithStripe();
      } else {
        this.payWithPaypal();
      }
    }
  },

  payWithPaypal(){
    this.saveOrder();
  },

  payWithStripe(){
    let stripe = this.get('stripe');
    let card = this.get('card').getProperties();

    console.log('card', card);

    stripe.card.createToken(card).then(function(response) {
      // you get access to your newly created token here
      this.set('order.stripe_token', response.id);
      // this.saveOrder();
    })
    .catch(function(response) {
      // if there was an error retrieving the token you could get it here
      console.log(response);

      if (response.error.type === 'card_error') {
        // show the error in the form or something
      }
    });
  },

  getOrderParams(){
    return this.get('order').getProperties('email', 'full_name', 'address', 'city', 'zip', 'region', 'country', 'payment_type', 'stripe_token', 'return_path');
  },

  saveOrder(){
    let paymentEndpoint = config.host + config.apiEndpoint + '/orders/' + this.get('cart.order.data.uuid') + '/payment';
    let params = this.getOrderParams();

    Ember.$.ajax({
      url: paymentEndpoint,
      type: 'POST',
      data: params,
      dataType: 'json'
    })
    .then((result)=>{
      console.log(result);
      if (result.url){
        console.log('yay url', result);
        // window.top.location.href = result.url;
      }
    }, (error)=>{
      if (error.responseJSON){
        this.set('errors', error.responseJSON.errors);
      } else {
        this.set('errors', {base: ['Connection error. Please try again later.']});
      }
    });
  }

});
