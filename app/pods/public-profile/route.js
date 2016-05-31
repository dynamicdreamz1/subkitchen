import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    let user = this.store.queryRecord('user', { handle: params.handle });
    return Ember.RSVP.hash({
      products: this.store.query('product', { author_id: user.id, per_page: 4 }),
      user: user
    });
  }
});
