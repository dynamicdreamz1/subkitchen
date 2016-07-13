import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  cart: Ember.inject.service('shopping-cart'),
  stripe: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),
  isoCountries: Ember.inject.service('iso-countries'),
  payment: null,
  address: null,
  card: new Ember.Object({
    number: '',
    exp_month: '',
    exp_year: '',
    cvc: ''
  }),
  errors: {},
  couponCode: null,

  isCouponApplied: function() {
    return this.get('cart.order.data.discount') != 0; // jshint ignore:line
  }.property('cart.order.data.discount') ,

  order: Ember.computed(['address', 'currentUser.content.email'], function(){
    let address = this.get('address');
    let fullname = [address.get('firstName'), address.get('lastName')].
      reject(function(i){
        return !(i && i.length);
      }).compact().join(' ');

    let country = address.get('country') || 'United States of America';
    let order = new Ember.Object({
      payment_type: 'paypal',
      return_path: '/profile',
      email: this.get('currentUser.content.email'),
      full_name: fullname,
      address: address.get('address'),
      city: address.get('city'),
      country: country,
      region: address.get('region'),
      zip: address.get('zip')
    });

    return order;
  }),

  observeCart: Ember.observer('cart.order.data.items.@each', function () {
    this.set("payment.order", this.get('cart').get('order.data'));
  }),

  hasItems: Ember.computed('payment.order.items.@each.quantity', function(){
    let order = this.get('payment.order');
    let quantity = this.get('cart').quantity();
    return order && order.items && order.items.length && quantity > 0;
  }),

  hasData: Ember.computed(['hasItems', 'payment.deleted_items.@each'], function(){
    let deleted_items = this.get('payment.deleted_items');
    return this.get('hasItems') || (deleted_items && deleted_items.length);
  }),

  init() {
    this._super(...arguments);
    this.get('cart').reload();
  },

  actions: {
    applyCoupon() {
      this.set('errors', {});
      Ember.$.ajax({
          url: config.host + config.apiEndpoint + '/coupon',
          type: 'POST',
          data:  { order_uuid: this.get('cart.order.data.uuid'), coupon_code: this.get('couponCode') },
          dataType: 'json'
        })
        .then(() => {
          this.get('cart').reload();
          this.set('couponCode', '');
        }, (error) => {
          this.set('errors', error.responseJSON.errors);
        });
    },

    removeCoupon() {
      this.set('errors', {});
      Ember.$.ajax({
          url: config.host + config.apiEndpoint + '/coupon',
          type: 'DELETE',
          data:  { order_uuid: this.get('cart.order.data.uuid') },
          dataType: 'json'
        })
        .then(() => {
          this.get('cart').reload();
        }, (error) => {
          this.set('errors', error.responseJSON.errors);
        });
    },

    order(){
      this.showSpinner();
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
    let card = this.get('card').getProperties('number', 'exp_month', 'exp_year', 'cvc');

    stripe.card.createToken(card).then((response)=>{
      this.set('order.stripe_token', response.id);
      this.saveOrder();
    })
    .catch((response) => {
      this.hideSpinner();
      if (response.error.type === 'card_error') {
        let errors = {card: {}};
        errors.card[response.error.param] = [response.error.message];
        this.set('errors', errors);
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
      this.get('cart').reload();
      if (result.url){
        window.top.location.href = result.url;
      } else {
        this.get("routing").transitionTo("profile");
      }
    }, (error)=>{
      this.hideSpinner();
      if (error.responseJSON){
        this.set('errors', error.responseJSON.errors);
      } else {
        this.set('errors', {base: ['Connection error. Please try again later.']});
      }
    });
  },

  showSpinner(){
    this.$('.place-order').addClass('loading-white');
  },

  hideSpinner(){
    this.$('.place-order').removeClass('loading-white');
  }

});
