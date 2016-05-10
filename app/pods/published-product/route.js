import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model(params){
    return Ember.RSVP.hash({
      product: this.store.findRecord('product', params.product_id)
    });
  }
});
