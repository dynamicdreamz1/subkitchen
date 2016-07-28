import Ember from 'ember';

export default Ember.Route.extend({
  flashMessages: Ember.inject.service(),
  session: Ember.inject.service('session'),

  queryParams: {
    uuid: { refreshModel: false }
  },

  model(params) {
    return params;
  },

  afterModel() {
    if (this.get('currentUser.content.artist')) {
      this.transitionTo('profile');
    }
  }
});
