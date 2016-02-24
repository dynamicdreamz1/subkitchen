import Ember from 'ember';

export default Ember.Component.extend({
  size: 'MD',
  sizes: ['SM', 'MD', 'LG', 'XL', '2X', '3X'],

  didInsertElement() {
    this.$().foundation();
  },

  actions: {
    addToCart(){
      console.log(this.get('size'))
    }
  }

});
