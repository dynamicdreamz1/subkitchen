import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {
  queryParams: {
    sorted_by: { refreshModel: true }
  },

  model(params) {
    params.paramMapping = { perPage: 'per_page' };
    return Ember.RSVP.hash({
      artists: this.findPaged('user', params),
      featuredArtists: this.store.query('user', { featured: true, per_page: 16  })
    });
  }
});
