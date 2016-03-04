import Ember from 'ember';

export default Ember.Component.extend({
  cart: Ember.inject.service('shopping-cart'),
  size: 'MD',
  sizes: ['SM', 'MD', 'LG', 'XL', '2X', '3X'],

  actions: {
    addToCart(){
      this.get('cart').add(this.get('id'), this.get('size'), 1);
      let button = this.$('.addToCart')
      button.text('added');
      setTimeout(function(){
        button.text('add to cart');
      }, 3000)
    }
  }
});
