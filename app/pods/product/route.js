import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return Ember.RSVP.hash({
      product: this.store.findRecord('product', params.product_id, {reload: true})
    });
  }
});
