import Ember from 'ember';

export default Ember.Component.extend({
  cart: Ember.inject.service('shopping-cart'),
  routes: Ember.inject.service('-routing'),

  hasData: Ember.computed('cart.order.data', function(){
    let order = this.get('cart.order.data');
    return order && order.items && order.items.length;
  }),

  quantity: Ember.computed('cart.order.data.items.@each.quantity', function(){
    return this.get('cart').quantity();
  }),

  didInsertElement() {
    this.$().foundation();
  },

  actions: {
    checkout(){
      // InitiateCheckout
      // Track when people enter the checkout flow (ex. click/landing page on checkout button)
      fbq('track', 'InitiateCheckout');
      this.get('routes').transitionTo('check-out');
    },

    close(){
      this.get('cart').close();
    },

    remove(item_id){
      this.get('cart').remove(item_id)
      .then(()=>{
        this.$('#item-'+item_id).remove();
      });
    }
  }
});
