import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  flashMessages: Ember.inject.service(),
  store: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),

  selectedThemes: [],
  isPublished: true,
  joinedTags: '',
  product: null,

  didInsertElement() {
    this.$().foundation();
  },

  observeTags: function () {
    let timeout = this.get('tagsTimeout');
    if (timeout){
      clearTimeout(timeout);
    }

    timeout = setTimeout(()=>{
      let tags = [];
      var re = /\s*,\s*/;
      let t = this.get('joinedTags').split(re);
      t.forEach(function (e) {
        let tag = $.trim(e);
        if (tag && tag.length) {
          tags.push(tag.toLowerCase());
        }
      });
      tags = [...new Set(tags)];
      this.set('joinedTags', tags.join(', ') + ', ');
    }, 2000);

    this.set('tagsTimeout', timeout);
  }.observes('joinedTags'),

  actions: {

    showPublishingPopup(id){
      $('#editModal' + id).foundation('open');
    },

    updateThemeSelection(newSelection, value) {
      if(newSelection.length === 0) {
        newSelection.push(value);
        this.set('selectedThemes', newSelection);
      }
      if(newSelection.length > 4) {
        newSelection.pop();
        this.set('selectedThemes', newSelection);
      }
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

          let re = /\s*,\s*/;
          let tags = this.get('joinedTags').split(re);
          let themes = this.get('selectedThemes').toArray();
          tags = [...new Set([...tags, ...themes])];
          tags = tags.reject(function (tag) {
            return tag === '';
          });

          let publishedValue = this.get('isPublished');

          product.set('tags', tags);
          product.set('name', this.get('productName'));
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

  }
});
