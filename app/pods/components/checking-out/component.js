import Ember from 'ember';

export default Ember.Component.extend({
  cart: Ember.inject.service('shopping-cart'),

  hasData: Ember.computed('cart.order.data', function(){
    let order = this.get('cart.order.data');
    return order && order.items && order.items.length;
  }),

  actions: {
    order(){
    }
  }
});
