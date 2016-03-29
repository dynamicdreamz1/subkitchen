import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
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
      let newValue = this.get('quantity') - 1;
      if (newValue < 1){
        newValue = 1; }
      this.set('quantity', newValue);
    },

    increaseQuantity(){
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
    },

    loadMoreComments(){
      let newPage = this.get('comments.meta.current_page') + 1;
      this.get('store')
      .query('comment', {product_id: this.get('model.id'), page: newPage})
      .then((results)=>{
        let comments = this.get('comments');
        comments.pushObjects(results.content);
        comments.set('meta.current_page', results.get('meta.current_page'));
      });
    }
  }

});
