import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.fetchFeaturedArtists();
  },

  fetchFeaturedArtists() {
    this.get('store').query('user', { featured: true, per_page: 16  }).then((result) => {
      this.set('data', result);
    });
  }
});
