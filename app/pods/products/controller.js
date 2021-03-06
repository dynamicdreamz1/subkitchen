/* global $ */
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['page', 'per_page', 'product_type', 'tags', 'price_range', 'sorted_by', 'search_query', 'featured'],

  page: 1,
  per_page: 60,
  priceRanges: ['0, 60', '60, 100'],
  product_type: [],
  tags: [],
  price_range: [],
  sorted_by: 'created_at_desc',
  featured: false,

  productTypes: function(){
    return this.get('model.templates').mapBy('product_type');
  }.property('model.templates'),

  actions: {
    pageClicked(page) {
      this.set('page', page);
      setTimeout(function () {
        $('html, body').animate({
          scrollTop: $("#products").offset().top
        }, 500);
      }, 1000);
    },

    featuredProduct(featured_value){
      this.set('featured', featured_value);
    },

    updateSortBy(sortBy){
      this.set('sort_by', sortBy);
    },

    changePerPage(perPage) {
      this.set('per_page', perPage);
    },

    updatePriceRange(newSelection, value, operation) {
      if(operation === 'removed'){
        this.set('price_range', []);
      }
      if(newSelection.length > 1){
        newSelection.shift();
      }
      this.set('price_range', newSelection);
    },

    refine() {
      $('.refine-content').toggleClass('refine-active');
      $('.filters-container').toggleClass('collapse');
      // this.set('sorted_by', 'created_at_desc');
      // this.set('price_range', []);
      // this.set('tags', []);
      // this.set('product_type', []);
    }
  }
});

$(document).on('click', '.toggle-button', function() {
  $('#toggle_checkbox').click();
});
