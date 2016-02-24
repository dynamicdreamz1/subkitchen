import Ember from 'ember';

export default Ember.Component.extend({
  size: 'MD',
  sizes: ['SM', 'MD', 'LG', 'XL', '2X', '3X'],

  actions: {
    addToCart(){
      console.log(this.get('size'))
    }
  }
});
