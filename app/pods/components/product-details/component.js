/* global $*/
import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  cart: Ember.inject.service('shopping-cart'),
  like: Ember.inject.service('product-like'),
  routing: Ember.inject.service('-routing'),
  session: Ember.inject.service('session'),
  size: 'MD',
  quantity: 1,
  commentContent: '',

  didInsertElement() {
    this.$().foundation();
    this.$('.easyzoom').easyZoom();
  },

  willDestroyElement(){
    // this.$('.easyzoom').data('easyZoom').teardown();
  },

  actions: {
    openSizingInfo(content){
      if(content === "size_chart"){
        $('#sizingInfoModal').foundation('open');
      }else{
        $('#imageModal').foundation('open');
      }
    },
    sizingInfoImageClick(id){
      $('#'+ id).foundation('close');
    },
    imageClick(id){
      $('#'+ id).foundation('close');
    },

    addComment(){
      let comment = this.get('store')
        .createRecord('comment', {
          product: this.get('product'),
          content: this.get('commentContent')
        });

      comment.save().then((result)=>{
        this.set('commentContent', '');
        this.set('product.comments_count', this.get('product.comments_count') +1 );
        this.get('comments').unshiftObject(result._internalModel);
      });
    },

    loadMoreComments(){
      this.$('.loadMoreComments').addClass('loading-white');
      let newPage = this.get('comments.meta.current_page') + 1;
      this.get('store')
        .query('comment', { product_id: this.get('product.id') , page: newPage, per_page: 5})
        .then((results)=>{
          let comments = this.get('comments');
          comments.pushObjects(results.content);
          comments.set('meta.current_page', results.get('meta.current_page'));
          this.$('.loadMoreComments').removeClass('loading-white');
          if (results.content.length === 0){ // last page
            this.$('.loadMoreComments').hide();
          }
        });
    },

    addToCart(){
      this.get('cart')
        .add(this.get('product.id'), this.get('size'), this.get('product.variants.0.id'), this.get('quantity'));
      let button = this.$('.addToCart');
      button.text('added');
      $('html,body').animate({
          scrollTop: $(".menu-item-my-kitchen__wrapper").offset().top},
        'slow');
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        this.get('cart').open();
      }
     // AddToCart
     // Track when items are added to a shopping cart (ex. click/landing page on Add to Cart button)
	fbq('track', 'AddToCart');
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
      this.get('like').toggleLike(this.get('product.id'))
      .then((result) => {
        if (result) {
          this.set('product.likes_count', result.likes_count);
          this.get('product').reload();
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
