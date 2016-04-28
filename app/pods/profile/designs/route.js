import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  currentUser: Ember.inject.service('current-user'),

  model: function(){
    return Ember.RSVP.hash({
      products: this.store.query('product', { author_id: this.get('currentUser.data.id') })
    });
  }
});
