import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    let user = this.store.queryRecord('user', { handle: params.handle });

    let productsPromise = new Ember.RSVP.Promise((resolve, reject) => {
      user.then((user) => {
        this.store.query('product', { author_id: user.id, per_page: $.browser.mobile ? 4 : 16}).then((products) => {
          resolve(products);
        }, () => {
          reject();
        });
      });
    });

    return Ember.RSVP.hash({
      user: user,
      products: productsPromise
    });
  }
});
