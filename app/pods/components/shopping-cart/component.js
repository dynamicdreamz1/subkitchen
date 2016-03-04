import Ember from 'ember';

export default Ember.Component.extend({
  cart: Ember.inject.service('shopping-cart'),

  didInsertElement() {
    this.$().foundation();
  },

  actions: {
    close(){
      this.get('cart').close();
    }
  }
});
