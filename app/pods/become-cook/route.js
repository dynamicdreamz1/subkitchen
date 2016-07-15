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

  afterModel(model) {
    let unauthorized = !model.uuid && !this.get('session.isAuthenticated');
    if (this.get('currentUser.content.artist') || unauthorized) {
      this.transitionTo('profile');
    }
  }
});
