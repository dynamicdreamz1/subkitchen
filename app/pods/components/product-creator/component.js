/* global fabric */
import Ember from 'ember';

export default Ember.Component.extend({
  resize: Ember.inject.service(),
  selectedTemplate: null,
  size: 'MD',
  quantity: 1,
  product: new Ember.Object(),

  init(){
    this._super(...arguments);
    this.set('selectedTemplate', this.get('productTemplates.firstObject'));
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

  },

  // ==========================================================================
  // ===  CANVAS
  // ==========================================================================

  imageOptions: {
    crossOrigin: 'anonymous',
    lockUniScaling: true,
    centeredScaling: true,
    centeredRotation: true,
    transparentCorners: true,
    borderColor: 'transparent',
    cornerSize: 0
  },

  canvas: Ember.computed(function(){
    return new fabric.Canvas('js-custom-product');
  }),

  observeSelectedTemplate: function () {
    let canvasActions = this.get('canvasActions');
    canvasActions.init.call(this);
  }.observes('selectedTemplate'),

  observeImage: function () {
    if (this.get('product.image') && this.get('product.image').length){
      let file = this.$('#imageFileUpload')[0].files[0];
      let reader = new FileReader();
      let canvasActions = this.get('canvasActions');
      reader.onload = (e)=>{
        canvasActions.setUploadedImage.call(this, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }.observes('product.image'),

  didInsertElement() {
    this._super(...arguments);
    this.$().foundation();

    let canvasActions = this.get('canvasActions');
    canvasActions.init.call(this);

    this.get('resize').on('debouncedDidResize', ()=>{
      canvasActions.init.call(this);
    });
  },

  canvasActions: {
    init(){
      let canvasActions = this.get('canvasActions');
      canvasActions.setSize.call(this);
      canvasActions.setBackground.call(this);
      canvasActions.setMask.call(this);
    },

    setSize(){
      let canvas = this.get('canvas');
      let editor = this.$('.editor');
      canvas.setDimensions({
        width: editor.width(),
        height: editor.width()
      });
    },

    setBackground(){
      let canvas = this.get('canvas');
      canvas.setBackgroundImage(
        this.get('selectedTemplate.templateImageLarge'),
        canvas.renderAll.bind(canvas),
        { width: canvas.width,
          height: canvas.height,
          originX: 'left',
          originY: 'top',
          crossOrigin: 'anonymous' });
    },

    setMask(){
      let canvas = this.get('canvas');
      canvas.setOverlayImage(
        this.get('selectedTemplate.templateMaskLarge'),
        canvas.renderAll.bind(canvas),
        { width: canvas.width,
          height: canvas.height,
          originX: 'left',
          originY: 'top',
          crossOrigin: 'anonymous' });
    },

    setUploadedImage(imgBase64){
      console.log('setUploadedImage', imgBase64);
      let canvas = this.get('canvas');

      let currentObjects = canvas.getObjects() || [];
      console.log(currentObjects);
      currentObjects.forEach(function(object){
        canvas.remove(object);
      });

      fabric.Image.fromURL(imgBase64, function(oImg){
        oImg.scale( 0.8 );
        canvas.add(oImg).centerObject(oImg);
        oImg.setCoords();
        canvas.renderAll().setActiveObject(oImg);
      }, this.get('imageOptions'));
    }
  }
});
