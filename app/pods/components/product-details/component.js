import Ember from 'ember';

export default Ember.Component.extend({
  cart: Ember.inject.service('shopping-cart'),
  size: 'MD',
  quantity: 1,
  sizes: ['SM', 'MD', 'LG', 'XL', '2X', '3X'],

  didInsertElement() {
    this.$().foundation();
  },

  actions: {
    addToCart(){
      this.get('cart').add(this.get('model.id'), this.get('size'), this.get('quantity'));
      let button = this.$('.addToCart');
      button.text('added');
      setTimeout(function(){
        button.text('add to cart');
      }, 3000);
    },

    decreaseQuantity(){
      console.log('decreaseQuantity');
      let newValue = this.get('quantity') - 1;
      if (newValue < 1){
        newValue = 1; }
      this.set('quantity', newValue);
    },

    increaseQuantity(){
      console.log('increaseQuantity');
      let newValue = this.get('quantity') + 1;
      this.set('quantity', newValue);
    }
  }

});
