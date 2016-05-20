import Ember from 'ember';


export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  cart: Ember.inject.service('shopping-cart'),
  cartCount: Ember.computed('cart.order.data.items.@each.quantity', function(){
    return this.get('cart').quantity();
  }),

  hasData: Ember.computed('cart.order.data', function(){
    let order = this.get('cart.order.data');
    return order && order.items && order.items.length;
  }),

  didRender() {
    this.$().foundation();
  },

  actions: {

    showLogin(){
      this.$('#passwordReminderModal').foundation('close');
      this.$('#loginModal').foundation('open');
    },

    invalidateSession() {
      this.get('session').invalidate();
    },

    showCart(){
      this.get('cart').open();
    }
  }
});
