import Ember from 'ember';

export default Ember.Component.extend({
  selectedTemplate: null,
  size: 'MD',
  quantity: 1,
  themes: [],

  init(){
    this._super(...arguments);
    if(this.get('selectedTemplateId')) {
      this.set('selectedTemplate', this.get('productTemplates').findBy('id', this.get('selectedTemplateId')));
    } else {
      this.set('selectedTemplate', this.get('productTemplates.firstObject'));
    }
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
    }

  },

  didInsertElement() {
    this._super(...arguments);
    this.$().foundation();
  }
});
