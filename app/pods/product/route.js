import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),

  model(params){
    let userPromise = new Ember.RSVP.Promise((resolve, reject) => {
      if(this.get('session.isAuthenticated')) {
        this.get('store').findRecord('user', 'current').then((user) => {
          resolve(user);
        }, () => {
          reject();
        });
      }
    });

    return Ember.RSVP.hash({
      product: this.store.findRecord('product', params.product_id, {reload: true}),
      user: userPromise
    });
  }
});
