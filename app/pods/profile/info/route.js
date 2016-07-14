import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  renderTemplate() {
    this.render();
    this.render('components/user-profile-artist-button', {
      into: 'profile',
      outlet: 'artist-stats'
    });
  },

  model: function(){
    return Ember.RSVP.hash({
      address: this.store.findRecord('address', 'current')
    });
  }
});
