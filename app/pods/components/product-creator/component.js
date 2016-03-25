import Ember from 'ember';

export default Ember.Component.extend({
  selectedTemplate: null,
  size: 'MD',
  quantity: 1,

  init(){
    this._super(...arguments);
    this.set('selectedTemplate', this.get('productTemplates.firstObject'));
  },

  didInsertElement() {
    this.$().foundation();
  },

  actions: {
    selectTemplate(template){
      this.set('selectedTemplate', template);
    },

    addToCart(){
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

  }

});
