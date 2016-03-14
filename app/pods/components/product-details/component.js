import Ember from 'ember';

export default Ember.Component.extend({
  cart: Ember.inject.service('shopping-cart'),
  like: Ember.inject.service('product-like'),
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
    },

    toggleLike(){
      this.get('like').toggleLike(this.get('model.id'))
      .then((result) => {
        this.set('model.likes_count', result.likes_count);
        this.get('model').reload();
      }, (error) => {
        if (error.responseJSON){
          this.set('errors', error.responseJSON.errors);
        } else {
          this.set('errors', {base: ['Connection error. Please try again later.']});
        }
      });
    }
  }

});
