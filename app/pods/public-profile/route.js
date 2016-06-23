import Ember from 'ember';
import config from 'subkitchen-front/config/environment';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {
  ajax: Ember.inject.service(),
  queryParams: {
    search_query: { refreshModel: true },
    product_type: { refreshModel: true },
    tags: { refreshModel: true },
    price_range: { refreshModel: true },
    sorted_by: { refreshModel: true },
    per_page: { refreshModel: true }
  },

  model(params){
    params.paramMapping = { perPage: 'per_page' };

    let user = this.store.findRecord('user', params.handle );

    let productsPromise = new Ember.RSVP.Promise((resolve, reject) => {
      user.then((user) => {
        params.author_id = user.id;

        // this.store.query('product', params).then((products) => {
        this.findPaged('product', params).then((products) => {
          resolve(products);
        }, () => {
          reject();
        });
      });
    });

    return Ember.RSVP.hash({
      user: user,
      products: productsPromise,
      themes: this.get('ajax').request(config.host + config.apiEndpoint + '/themes'),
      templates: this.store.query('productTemplate', {})
    });
  }
});
