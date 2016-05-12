import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from 'subkitchen-front/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  currentUser: Ember.inject.service('current-user'),
  ajax: Ember.inject.service(),

  model(){
    let productPromise = new Ember.RSVP.Promise((resolve, reject) => {
      this.store.findRecord('user', 'current').then((user) => {
        this.store.query('product', { author_id: user.id, per_page: 5 }).then((product) => {
          resolve(product);
        }, () => {
          reject();
        });
      });
    });

    return Ember.RSVP.hash({
      products: productPromise,
      themes: this.get('ajax').request(config.host + config.apiEndpoint + '/themes'),
      user: this.store.findRecord('user', 'current')
    });
  }
});

