/* global fabric, $, Hammer */
import Ember from 'ember';

export default Ember.Component.extend({
  resize: Ember.inject.service(),
  selectedTemplate: null,
  product: null,
  scale: 1,
  rotationAngle: 0,
  showRotationWheel: false,

  actions: {
    showRotationWheel(){
      this.set('showRotationWheel', true);
      this.get('rotateAngleIndicator').call(this);
    },

    hideRotationWheel(){
      this.set('showRotationWheel', false);
    },

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

    rotate(event){
      let target = $(event.target);

      if (!$(target).hasClass('rotation-wrapper')){
        target = target.parents('.rotation-wrapper');
      }

      let offsetY = event.pageY - target.offset().top - (target.height() / 2);
      let offsetX = event.pageX - target.offset().left - (target.width() / 2);

      var p1 = { x: 0, y: 0 };
      var p2 = { x: offsetX, y: -offsetY };

      var angleDeg = Math.floor(180 + 180 / Math.PI * Math.atan2(-(p2.x - p1.x), -(p2.y - p1.y)));
      if (angleDeg === 360){
        angleDeg = 0; }

      this.set('rotationAngle', angleDeg);

      let canvasActions = this.get('canvasActions');
      canvasActions.rotate.call(this, angleDeg);
    }
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
    let canvasOptions =
      { backgroundColor: '#fff',
        controlsAboveOverlay: true };

    let canvas = new fabric.Canvas('js-custom-product', canvasOptions);

    return canvas;
  }),

  observeScale: function () {
    let scalePercent = this.get('scale') * 100 / 2;
    if (scalePercent > 100){
      scalePercent = 100;
    }
    this.$('.size-indicator').css({bottom: scalePercent + '%'});
  }.observes('scale'),

  observeAngle: function () {
    this.get('rotateAngleIndicator').call(this);
  }.observes('rotationAngle'),

  observeSelectedTemplate: function () {
    let canvasActions = this.get('canvasActions');
    canvasActions.init.call(this);
  }.observes('selectedTemplate'),

  observeImage: function () {
    if (this.get('product.image') && this.get('product.image').length){
      this.set('scale', 1);
      this.set('rotationAngle', 0);
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

  didRender(){
    this.$('.size').on('mousedown', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      this.set('moveZoomSlider', true);
    });

    this.$('.size').on('mouseup', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      this.set('moveZoomSlider', false);
    });

    this.$('.size').on('mouseleave', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      this.set('moveZoomSlider', false);
    });

    this.$('.size').on('mousemove', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      let target = $(e.target);
      if (this.get('moveZoomSlider') && target.hasClass('size') ){
        let clickPos = target.height() - e.offsetY;
        let scale = clickPos * 2 / target.height();
        this.set('scale', scale);
        let canvasActions = this.get('canvasActions');
        canvasActions.scale.call(this, this.get('scale'));
      }
    });

    let mc = new Hammer.Manager(this.$('.size')[0], {});
    mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }) );

    mc.on("pan", (e)=>{
      if (this.get('product.image')){
        console.log('pan', e);
        let target = $(e.target);
        if (target.hasClass('size') ){
          let offsetY = this.$('.size-indicator').position().top + (e.deltaY / 20);
          let clickPos = target.height() - offsetY;
          if (clickPos < 0 ){ clickPos = 0; }
          if (clickPos > target.height()){ clickPos = target.height(); }
          let scale = clickPos * 2 / target.height();
          this.set('scale', scale);
          let canvasActions = this.get('canvasActions');
          canvasActions.scale.call(this, this.get('scale'));
        }
      }
    });
  },

  willDestroyElement(){
    this.$('.size').off('mousedown');
    this.$('.size').off('mouseup');
    this.$('.size').off('mousemove');
  },

  rotateAngleIndicator(){
    setTimeout(()=>{
      let indicator = this.$('.rotation-outline');
      indicator.animate({deg: this.get('rotationAngle')}, {
        duration: 500,
        step: function(now){
          indicator.css({
            transform: 'rotate(' + now + 'deg)'
          });
        }
      });
    }, 500);
  },


  canvasActions: {
    init(){
      let canvasActions = this.get('canvasActions');
      canvasActions.customizeCanvas.call(this);
      canvasActions.bindEvents.call(this);
      canvasActions.setSize.call(this);
      canvasActions.setBackground.call(this);
      canvasActions.setMask.call(this);
    },

    customizeCanvas(){
      let canvas = this.get('canvas');

      canvas.hoverCursor = 'pointer';
    },

    bindEvents(){
      let canvas = this.get('canvas');

      canvas.on('object:scaling', ()=>{
        var obj = canvas.getActiveObject();
        this.set('scale', obj.getScaleX());
      });

      canvas.on('object:rotating', ()=>{
        var obj = canvas.getActiveObject();
        this.set('rotationAngle', Math.floor(obj.getAngle()));
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
        object.scale(value).center().setCoords();
      });
      canvas.renderAll();
    },

    rotate(angle){
      let canvas = this.get('canvas');
      let currentObjects = canvas.getObjects() || [];
      currentObjects.forEach(function(object){
        object.setAngle(angle).setCoords();
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
