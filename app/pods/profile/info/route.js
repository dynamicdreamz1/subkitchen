import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(){
    return Ember.RSVP.hash({
      user: this.store.findRecord('user', 'current'),
      address: this.store.findRecord('address', 'current')
    });
  }
});
