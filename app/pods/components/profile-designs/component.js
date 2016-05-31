/* global $ */
import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  flashMessages: Ember.inject.service(),
  store: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),
  currentUser: Ember.inject.service('current-user'),

  selectedThemes: [],
  isPublished: null,

  didInsertElement() {
    this.$().foundation();
  },

  validThemes: function() {
    if(!this.get('selectedThemes').length) {
      return !this.get('product.published');
    }
    return true;
  }.property('selectedThemes', 'isPublished'),

  actions: {

    showPublishingPopup(id){
      $('#editModal' + id).foundation('open');
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
      let newPage = this.get('products.meta.current_page') + 1;
      this.get('store')
        .query('product', { author_id: this.get('currentUser.data.id') , page: newPage, per_page: 5})
        .then((results)=>{
          let products = this.get('products');
          products.pushObjects(results.content);
          products.set('meta.current_page', results.get('meta.current_page'));
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
