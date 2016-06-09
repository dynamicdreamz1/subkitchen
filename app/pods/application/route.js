import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  intl: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),

  setupController(controller, model) {
    // Call _super for default behavior
    this._super(controller, model);
    this.get('intl').setLocale('en-us');
  },

  beforeModel(transition) {
    this._super(transition);
    if (this.get('session.isAuthenticated')) {
      return this._populateCurrentUser();
    }
    return this.get('intl').setLocale('en-us');
  },

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },

    sessionAuthenticationSucceeded() {
      this._populateCurrentUser();
    }
  },

  _populateCurrentUser() {
    return this.store.findRecord('user', 'current').then(
      (user) => {
        this.get('currentUser').set('content', user);
      }).catch(function () {});
  }
});
