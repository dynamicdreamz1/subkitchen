/* global $ */
import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return Ember.RSVP.hash({
      trending: this.store.query('product', $.extend({page: 1, per_page: 4}, params))
    });
  }
});
