import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  intl: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),
  session: Ember.inject.service('session'),

  setupController(controller, model) {
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
    }
  },

  invalidationSucceeded() {
    this._deleteCurrentUser();
  },

  sessionAuthenticated() {
    this._populateCurrentUser();
  },

  _populateCurrentUser() {
    return this.store.findRecord('user', 'current').then(
      (user) => {
        this.get('currentUser').set('content', user);
      });
  },

  _deleteCurrentUser() {
    return this.get('currentUser').set('content', null);
  }
});
