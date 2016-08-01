import Ember from 'ember';

export default Ember.Component.extend({
  productCreatorEventBus: Ember.inject.service('product-creator-event-bus'),

  selectedTemplate: null,
  size: 'MD',
  quantity: 1,
  themes: [],
  child: null,
  progress: null,

  observeSize: function () {
    this.set('productCreatorEventBus.size', this.get('size'));
  }.observes('size'),

  observeQuantity: function () {
    this.set('productCreatorEventBus.quantity', this.get('quantity'));
  }.observes('quantity'),

  init(){
    this._super(...arguments);
    if(this.get('selectedTemplateId')) {
      this.set('selectedTemplate', this.get('productTemplates').findBy('id', this.get('selectedTemplateId')));
    } else {
      this.set('selectedTemplate', this.get('productTemplates.firstObject'));
    }

    this.set('productCreatorEventBus.size', this.get('size'));
    this.set('productCreatorEventBus.quantity', this.get('quantity'));
  },

  actions: {
    selectTemplate(template){
      this.set('selectedTemplate', template);
    },

    addToCart(){
      // trigger action on canvas
      this.set('productCreatorEventBus.addToCart', true);
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
