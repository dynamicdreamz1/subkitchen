import Ember from 'ember';

export default Ember.Component.extend({
  cart: Ember.inject.service('shopping-cart'),
  like: Ember.inject.service('product-like'),
  size: 'MD',
  sizes: ['SM', 'MD', 'LG', 'XL', '2X', '3X'],

  actions: {

    addToCart(){
      this.get('cart').add(this.get('id'), this.get('size'), 1);
      let button = this.$('.addToCart');
      button.text('added');
      setTimeout(function(){
        button.text('add to cart');
      }, 3000);
    },

    toggleLike(){
      this.get('like').toggleLike(this.get('id'))
      .then((result) => {
        this.set('likes', result.likes);
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
