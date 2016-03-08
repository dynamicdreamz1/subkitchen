/* global $ */
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['page', 'perPage'],

  page: 1,
  perPage: 28,

  actions: {
    pageClicked(page) {
      this.set('page', page);
      setTimeout(function(){
        $('html, body').animate({
          scrollTop: $("#products").offset().top
        }, 500);
      }, 1000);
    }
  }
});
