import Ember from 'ember';

export default Ember.Component.extend({
  cart: Ember.inject.service('shopping-cart'),
  like: Ember.inject.service('product-like'),
  size: 'MD',

  actions: {

    addToCart(){
      this.get('cart').add(this.get('product.id'), this.get('size'), this.get('product.variants.0.id'), 1);
      // AddToCart
      // Track when items are added to a shopping cart (ex. click/landing page on Add to Cart button)
      fbq('track', 'AddToCart');
      let button = this.$('.addToCart');
      button.text('added');
      setTimeout(function(){
        button.text('add to cart');
      }, 3000);
    },

    toggleLike(){
      this.get('like').toggleLike(this.get('product.id'))
      .then((result) => {
        if (result) {
          this.set('product.likes_count', result.likes_count);
        }
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
