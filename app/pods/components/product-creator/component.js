import Ember from 'ember';

export default Ember.Component.extend({
  selectedTemplate: null,
  size: 'MD',
  quantity: 1,
  product: new Ember.Object(),

  init(){
    this._super(...arguments);
    this.set('selectedTemplate', this.get('productTemplates.firstObject'));
  },

  didInsertElement() {
    this.$().foundation();
  },

  observeImage: function () {
    if (this.get('product.image') && this.get('product.image').length){
      let file = this.$('#imageFileUpload')[0].files[0];
      let preview = this.$(".upload-preview");
      let reader = new FileReader();
      reader.onload = function(e){
        let image_base64 = e.target.result;
        preview.attr("src", image_base64);
      };
      reader.readAsDataURL(file);
      preview.show();
    }
  }.observes('product.image'),

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
