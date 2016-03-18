import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  intl: Ember.inject.service(),

  setupController: function(controller, model) {
    // Call _super for default behavior
    this._super(controller, model);
    this.get('intl').setLocale('en-us');
  },

  beforeModel() {
    return this.get('intl').setLocale('en-us');
  }
});
