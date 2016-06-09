/* global fabric, $, Hammer */
import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend( {
  cart: Ember.inject.service('shopping-cart'),
  resize: Ember.inject.service(),
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  store: Ember.inject.service(),
  flashMessages: Ember.inject.service(),
  dataUrlToBlob: Ember.inject.service('data-url-to-blob'),
  productCreatorEventBus: Ember.inject.service('product-creator-event-bus'),

  // product: new Ember.Object(),
  selectedTemplate: null,
  scale: 1,
  rotationAngle: 0,
  showRotationWheel: false,
  selectedThemes: [],
  isPublished: true,
  isClicked: false,
  errors: {},
  publishNotice: '',

  validThemes: function() {
    if(!this.get('selectedThemes').length) {
      return !this.get('product.published');
    }
    return true;
  }.property('selectedThemes', 'isPublished'),

  init(){
    this._super(...arguments);
    let themes = this.get('product.tags').filter((tag) => {
      return this.get('themes.themes').includes(tag);
    });
    this.set('selectedThemes', themes);
  },

  observeEventBus: function () {
    if (this.get('productCreatorEventBus.addToCart')){
      this.set('productCreatorEventBus.addToCart', false);
      this.send('addToCart');
    }
  }.observes('productCreatorEventBus.addToCart'),

  actions: {

    updateThemeSelection(newSelection) {
      this.set('errors', {});
      this.set('isClicked', true);
      if(newSelection.length > 4){
        newSelection.pop();
      }
      this.set('selectedThemes', newSelection);
    },

    showPublishingPopup(){
      if(this.get('session.isAuthenticated')) {
        if(this.get('currentUser.content.status') !== 'verified'){
          this.set('isPublished', false);
        }
        if(this.get('currentUser.content.status') === 'pending') {
          this.set('publishNotice', 'Verify your artist account to publish your designs');
        }
        this.set('errors', {});
        $('#publishModal').foundation('open');
      } else {
        $('#passwordReminderModal').foundation('close');
        $('#loginModal').foundation('open');
      }
    },

    createProduct(callback, errorCallback){
      if ( this.get('product.image') ){
        this.$('.js-publish').addClass('loading-white');

        // get image
        let canvas = this.get('canvas');
        canvas.deactivateAll().renderAll();
        let multiplier = Math.floor(2048 / canvas.getWidth());
        let dataURL =  canvas.toDataURLWithMultiplier('png', multiplier);
        let file = this.get('dataUrlToBlob').convert(dataURL);
        this.set('product.preview', file);

        // get tags
        let tags = this.get('product.tags');
        let themes = this.get('selectedThemes').toArray();
        tags = [...new Set([...tags, ...themes])];
        tags = tags.reject(function(tag){
          return tag === '';
        });
        this.set('product.tags', tags);

        let publishedValue = this.get('isPublished');

        let formData = new FormData(this.$('#formImageUpload')[0]);

        formData.append('name', this.get('product.name'));
        formData.append('description', 'Custom Design');
        formData.append('preview', this.get('product.preview'));
        formData.append('product_template_id', this.get('selectedTemplate.id'));
        formData.append('published', publishedValue);

        formData.append('image', this.get('product.image'));

        tags.forEach(function(tag){
          formData.append('tags[]', tag);
        });

        let optionalAuthorization = (callback)=>{
          if(this.get('session.isAuthenticated')){
            this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
              var headers = {};
              headers[headerName] = headerValue;
              callback.call(this, headers);
            });
          } else {
            callback.call(this, {});
          }
        };

        optionalAuthorization((headers)=>{
          Ember.$.ajax({
            headers: headers,
            method: "POST",
            url: config.host + config.apiEndpoint + '/products',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            dataType : 'json'
          }).then((response) => {
            callback(response);
          }, (error) => {
            this.$('.js-publish').removeClass('loading-white');
            this.set('errors', error.responseJSON.errors);
            if (typeof errorCallback === 'function'){
              errorCallback(error);
            }
          });
        });

      } else {
        if (typeof errorCallback === 'function'){
          errorCallback({});
        }
      }
    },

    updateIsPublished(publishedValue){
      this.set('isPublished', publishedValue);
    },

    publish(){
      let callback = (response) => {
        let flashMessages = this.get('flashMessages');
        if(this.get('product.published')) {
          this.get("routing").transitionTo("published-product", [response.product.id]);
        } else {
          this.get("routing").transitionTo("product", [response.product.id]);
        }
        flashMessages.success('Product saved.');
        $('#publishModal').foundation('close');
      };
      this.send('createProduct', callback);
    },

    addToCart(){
      $('.button.addToCart').addClass('loading-white');

      if (!this.get('product.name')){
        this.set('product.name', this.get('selectedTemplate.product_type'));
      }

      let callback = (response) => {
        this.get('cart').add(
          response.product.id,
          this.get('productCreatorEventBus.size'),
          response.product.variants[0].id,
          this.get('productCreatorEventBus.quantity'));

        $('.button.addToCart').removeClass('loading-white');
      };

      let error = function(){
        $('.button.addToCart').removeClass('loading-white');
      };

      this.send('createProduct', callback, error);
    },

    addTag(tag){
      let tagToAdd = tag.toLowerCase();
      this.get('product.tags').push(tagToAdd);
    },

    removeTag(tagToRemove){
      let tags = this.get('product.tags');
      let newTags = tags.filter(function(tag){
        return tag !== tagToRemove;
      });
      this.set('product.tags', newTags);
    },

    showRotationWheel(){
      this.set('showRotationWheel', true);
      setTimeout(()=>{
        this.get('rotateAngleIndicator').call(this);
      }, 0);
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

    startRotating(){
      this.set('moveRotator', true);
    },

    stopRotating(){
      this.set('moveRotator', false);
    },

    rotateNow(event){
      this.get('rotate').call(this, event);
    },

    rotate(event){
      if (this.get('moveRotator')){
        this.get('rotate').call(this, event);
      }
    }
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
    cornerSize: $.browser.mobile ? 40 : 13,
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
    if (this.get('product.rawImage') && this.get('product.rawImage').length){
      this.set('scale', 1);
      this.set('rotationAngle', 0);
      let file = this.$('#imageFileUpload')[0].files[0];
      let reader = new FileReader();
      let canvasActions = this.get('canvasActions');
      reader.onload = (e)=>{
        canvasActions.setUploadedImage.call(this, e.target.result);
        this.set('product.image', this.get('dataUrlToBlob').convert(e.target.result));
      };
      reader.readAsDataURL(file);
    }
  }.observes('product.rawImage'),

  didInsertElement() {
    this._super(...arguments);

    let canvasActions = this.get('canvasActions');
    canvasActions.init.call(this);

    this.get('resize').off('debouncedDidResize').on('debouncedDidResize', ()=>{
      canvasActions.init.call(this);
    });

    if(this.get('product.image')) {
      let a = new FileReader();
      a.onload = (e) => {
        canvasActions.setUploadedImage.call(this, e.target.result);
      };
      a.readAsDataURL(this.get('product.image'));
    }

    this.get('productCreatorEventBus.addToCart');

    this.$().foundation();
  },

  didRender(){
    this.get('bindControlls').call(this);
  },

  bindControlls(){
    let sizeControl = this.$('.size');

    sizeControl.off('mousedown');
    sizeControl.on('mousedown', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      this.get('actions.setScale').call(this, e);
      this.set('moveZoomSlider', true);
    });

    sizeControl.off('mouseup');
    sizeControl.on('mouseup', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      this.set('moveZoomSlider', false);
    });

    sizeControl.off('mouseleave');
    sizeControl.on('mouseleave', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      if (this.get('moveZoomSlider')){
        this.set('moveZoomSlider', false);
      }
    });

    sizeControl.off('mousemove');
    sizeControl.on('mousemove', (e)=>{
      if (this.get('moveZoomSlider')){
        e.preventDefault();
        e.stopPropagation();
        let target = $(e.target);
        if (target.hasClass('size') ){
          let clickPos = target.height() - e.offsetY;
          let scale = clickPos * 2 / target.height();
          this.set('scale', scale);
          let canvasActions = this.get('canvasActions');
          canvasActions.scale.call(this, this.get('scale'));
        }
      }
    });

    let mc = new Hammer.Manager(this.$('.size')[0], {});
    mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }) );

    mc.off("pan");
    mc.on("pan", (e)=>{
      if (this.get('product.image')){
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
    let indicator = this.$('.rotation-outline');
    indicator.animate({deg: this.get('rotationAngle')}, {
      duration: 10,
      step: function(now){
        indicator.css({
          transform: 'rotate(' + now + 'deg)'
        });
      }
    });
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

      canvas.off('object:scaling');
      canvas.on('object:scaling', ()=>{
        var obj = canvas.getActiveObject();
        this.set('scale', obj.getScaleX());
      });

      canvas.off('object:rotating');
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
