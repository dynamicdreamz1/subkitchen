import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  actions: {
    loadMore(){
      let newPage = this.get('products.meta.current_page') + 1;
      let perPage = this.get('products.meta.per_page');

      this.get('store')
        .query('product', { author_id: this.get('user.id'), per_page: perPage, page: newPage })
        .then((results)=>{
          let products = this.get('products');
          products.pushObjects(results.content);
          products.set('meta.current_page', results.get('meta.current_page'));
        });
     }
  }
});
