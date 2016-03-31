/* global fabric, $ */
import Ember from 'ember';

export default Ember.Component.extend({
  resize: Ember.inject.service(),
  selectedTemplate: null,
  size: 'MD',
  quantity: 1,
  product: new Ember.Object(),
  scale: 1,

  init(){
    this._super(...arguments);
    this.set('selectedTemplate', this.get('productTemplates.firstObject'));
  },

  actions: {
    scaleUp(){
      this.set('scale', this.get('scale') + 0.01);
      let canvasActions = this.get('canvasActions');
      canvasActions.scale.call(this, this.get('scale'));
    },

    scaleDown(){
      let scale = this.get('scale');
      scale = scale - 0.01;
      if (scale < 0){ scale = 0; }
      this.set('scale', scale);
      let canvasActions = this.get('canvasActions');
      canvasActions.scale.call(this, scale);
    },

    setScale(e){
      let target = $(e.target);
      if ($(target).hasClass('size-indicator')){
        target = target.parent();
      }
      let offset = e.pageY - target.offset().top;
      let clickPos = target.height() - offset;
      let scale = clickPos * 2 / target.height();
      this.set('scale', scale);
      let canvasActions = this.get('canvasActions');
      canvasActions.scale.call(this, scale);
    },

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
    transparentCorners: false,
    cornerColor: 'rgba(0,0,0,1)',
    borderColor: 'rgba(0,0,0,1)',
    borderOpacityWhenMoving: 1
  },

  canvas: Ember.computed(function(){
    return new fabric.Canvas('js-custom-product');
  }),

  observeScale: function () {
    let scalePercent = this.get('scale') * 100 / 2;
    if (scalePercent > 100){
      scalePercent = 100;
    }
    this.$('.size-indicator').css({bottom: scalePercent + '%'});
  }.observes('scale'),

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

    let canvasActions = this.get('canvasActions');
    canvasActions.init.call(this);

    this.get('resize').on('debouncedDidResize', ()=>{
      canvasActions.init.call(this);
    });

    this.$().foundation();
  },

  canvasActions: {
    init(){
      let canvasActions = this.get('canvasActions');
      canvasActions.customizeCanvas.call(this);
      canvasActions.setSize.call(this);
      canvasActions.setBackground.call(this);
      canvasActions.setMask.call(this);
    },

    customizeCanvas(){
      let canvas = this.get('canvas');
      canvas.hoverCursor = 'pointer';
      canvas.on('object:scaling', ()=>{
        var obj = canvas.getActiveObject();
        this.set('scale', obj.getScaleX());
      });
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

    scale(value){
      let canvas = this.get('canvas');
      let currentObjects = canvas.getObjects() || [];
      currentObjects.forEach(function(object){
        object.centeredScaling = true;
        let centerX = object.getLeft() + object.getWidth() / 2;
        let centerY = object.getTop() + object.getHeight() / 2;
        object.scale(value);
        object.setLeft(centerX - object.getWidth() / 2);
        object.setTop(centerY - object.getHeight() / 2);
      });
      canvas.renderAll();
    },

    removeImage(){
      let canvas = this.get('canvas');

      let currentObjects = canvas.getObjects() || [];
      currentObjects.forEach(function(object){
        canvas.remove(object);
      });
    },

    addImage(imgBase64){
      let canvas = this.get('canvas');
      let width = this.$('.editor').width();

      fabric.Image.fromURL(imgBase64, function(oImg){
        let ratio = oImg.height / oImg.width;
        let imgWidth = width * 0.9;
        oImg.set({width:imgWidth, height:imgWidth * ratio});
        canvas.add(oImg).centerObject(oImg);
        oImg.setCoords();
        canvas.renderAll().setActiveObject(oImg);
      }, this.get('imageOptions'));
    },

    setUploadedImage(imgBase64){
      let canvasActions = this.get('canvasActions');
      canvasActions.removeImage.call(this);
      canvasActions.addImage.call(this, imgBase64);
    }
  }
});
