import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  products: Ember.computed(function(){
    return this.get('store').query('product', { author_id: this.get('user.id'), per_page: 4 });
  })
});
