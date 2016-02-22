import Ember from 'ember';

export default Ember.Controller.extend({
  // setup our query params
  queryParams: ['page', 'perPage'],

  totalPagesBinding: 'model.totalPages',
  page: 1,
  perPage: 28,

  actions: {
    pageClicked(page) {
      this.set('page', page);
    }
  }
});
