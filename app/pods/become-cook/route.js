/* global $ */
import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  userLoggingIn: false,

  sessionAuthenticated() {
    this.set('userLoggingIn', true);
  },

  actions: {
    willTransition(transition){
      if(transition.targetName === 'profile.info' && this.get('userLoggingIn')) {
        transition.abort();
        this.set('userLoggingIn', false);
        if ($('#loginModal').length){
          $('#loginModal').foundation('close');
        }
      }
    }
  }
});
