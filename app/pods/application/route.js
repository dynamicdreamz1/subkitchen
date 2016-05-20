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

  sessionAuthenticated() {
    this.transitionTo('cooking');
  },

  beforeModel() {
    return this.get('intl').setLocale('en-us');
  }
});
