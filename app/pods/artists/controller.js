/* global $ */
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['page', 'per_page', 'sorted_by'],

  page: 1,
  per_page: 60,
  sorted_by: 'created_at_desc',

  actions: {
    pageClicked(page) {
      this.set('page', page);
      setTimeout(function () {
        $('html, body').animate({
          scrollTop: $("#artists").offset().top
        }, 500);
      }, 1000);
    },

    updateSortBy(sortBy){
      this.set('sort_by', sortBy);
    },

    changePerPage(perPage) {
      this.set('per_page', perPage);
    }
  }
});
