import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from 'subkitchen-front/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  currentUser: Ember.inject.service('current-user'),
  ajax: Ember.inject.service(),

  model(){
    return Ember.RSVP.hash({
      products: this.store.query('product', { author_id: this.get('currentUser.data.id'), per_page: 5}),
      themes: this.get('ajax').request(config.host + config.apiEndpoint + '/themes'),
      user: this.store.findRecord('user', 'current')
    });
  }
});
