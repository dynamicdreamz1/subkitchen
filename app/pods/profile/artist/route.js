import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from 'subkitchen-front/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  ajax: Ember.inject.service(),
  session: Ember.inject.service(),

  renderTemplate() {
    this.render('components/profile-artist');
    this.render('components/profile-artist-statistics', {
      into: 'profile',
      outlet: 'artist-stats'
    });
  },

  model() {
    let statsPromise = new Ember.RSVP.Promise((resolve, reject) => {
      this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
        var headers = {};
        headers[headerName] = headerValue;
        this.get('ajax').request(config.host + config.apiEndpoint + '/artist_stats', { headers: headers }).then((result) => {
          resolve(result);
        }, () => {
          reject();
        });
      });
    });
    let author_id = this.get('currentUser.content.id');

    return Ember.RSVP.hash({
      stats: statsPromise,
      products: this.store.query('product', { author_id: author_id, sorted_by: 'best_sellers', page: 1, per_page: 5 }),
      order_items: this.store.query('order_item', { author_id: author_id, page: 1, per_page: 5 })
    });
  }
});

