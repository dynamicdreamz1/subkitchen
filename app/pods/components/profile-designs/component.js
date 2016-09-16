/* global $ */
import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  flashMessages: Ember.inject.service(),
  store: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),

  selectedThemes: [],
  isPublished: null,

  didRender() {
    this.$().foundation();
  },

  validThemes: function() {
    if(!this.get('selectedThemes').length) {
      return !this.get('product.published');
    }
    return true;
  }.property('selectedThemes', 'isPublished'),

  actions: {

    showProductDeletingPopup(id) {
      $('#productDeleteModal' + id).foundation('open');
    },

    deleteProduct(product) {
      product.deleteRecord();
      product.save().then(() => {
        let products = this.get('products');
        products.removeObject(product);
      });
      $('#productDeleteModal' + product.id).foundation('close');
    },

    showPublishingPopup(id, index){
      $('#editModal' + id).foundation('open');
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        var top_px = ((index + 4) * (-100));
        $('#editModal' + id).css('top', '');
        $('#editModal' + id).css('vertical-align', 'top!important');
        $('#editModal' + id).css('max-height', '350px');
        setModalMaxHeight(this);
      }
      this.set('product', this.get('store').findRecord('product', id)).then(() => {
        let themes = this.get('product.tags').filter((tag) => {
          return this.get('themes.themes').includes(tag);
        });
        this.set('selectedThemes', themes);
        this.set('isPublished', this.get('product.published'));
      });
    },

    updateThemeSelection(newSelection, value, operation) {
      if(operation === 'removed'){
        let newTags = this.get('product.tags').filter(function(tag){
          return tag !== value;
        });
        this.set('product.tags', newTags);
      }
      if(newSelection.length > 4){
        newSelection.pop();
      }
      this.set('selectedThemes', newSelection);
    },

    updateIsPublished(publishedValue){
      this.set('isPublished', publishedValue);
    },

    publish(product_id){
      this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
        var headers = {};
        headers[headerName] = headerValue;

        this.get('store').findRecord('product', product_id).then((product) => {

          const flashMessages = this.get('flashMessages');
          let tags = this.get('product.tags');
          let themes = this.get('selectedThemes').toArray();
          tags = [...new Set([...tags, ...themes])];
          tags = tags.reject(function (tag) {
            return tag === '';
          });
          let publishedValue = this.get('isPublished');
          product.set('tags', tags);
          product.set('description', 'Custom Design');
          product.set('published', publishedValue);

          product.save().then(() => {
            flashMessages.success('Product saved.');
            this.get("routing").transitionTo('profile.designs');
            $('#editModal' + product_id).foundation('close');
          });
        });
      });
    },

    loadMoreDesigns(){
      this.$('.loadMore').addClass('loading-white');
      let newPage = this.get('products.meta.current_page') + 1;
      this.get('store')
        .query('product', { author_id: this.get('currentUser.content.id') , page: newPage, per_page: 5})
        .then((results)=>{
          let products = this.get('products');
          products.pushObjects(results.content);
          products.set('meta.current_page', results.get('meta.current_page'));
          this.$('.loadMore').removeClass('loading-white');
        });
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
    }
  }
});
