/* global $ */
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['page', 'per_page', 'product_type', 'tags', 'price_range', 'sorted_by'],

  page: 1,
  per_page: 12,
  priceRanges: [[0, 25], [25, 100]],
  product_type: [],
  tags: [],
  price_range: null,
  sorted_by: 'created_at_desc',

  productTypes: function(){
    return this.get('model.templates').mapBy('product_type');
  }.property('model.templates'),

  actions: {
    pageClicked(page) {
      this.set('page', page);
      setTimeout(function(){
        $('html, body').animate({
          scrollTop: $("#products").offset().top
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
