import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['page', 'perPage'],

  page: 1,
  perPage: 28,

  actions: {
    pageClicked(page) {
      this.set('page', page);
    }
  }
});
