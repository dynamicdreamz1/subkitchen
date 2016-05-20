import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';
import config from 'subkitchen-front/config/environment';

export default Ember.Route.extend(RouteMixin, {
  ajax: Ember.inject.service(),
  queryParams: {
    product_type: { refreshModel: true },
    tags: { refreshModel: true },
    price_range: { refreshModel: true },
    sorted_by: { refreshModel: true },
    per_page: { refreshModel: true }
  },



  model(params) {
    params.paramMapping = { perPage: 'per_page' };
    return Ember.RSVP.hash({
      products: this.findPaged('product', params),
      themes: this.get('ajax').request(config.host + config.apiEndpoint + '/themes'),
      templates: this.store.query('productTemplate', {})
    });
  }
});
