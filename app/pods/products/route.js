import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var page = 1;

    if(params.page){
      page = params.page;
      page = isNaN(page) ? 1 : Math.floor(Math.abs(page));
    }

    var products = this.store.query('product', { page: page, per_page: 28 });
    return products;
  }
});
