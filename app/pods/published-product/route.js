import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  model(params){
    let productPromise = new Ember.RSVP.Promise((resolve, reject) => {
      this.set('product', this.store.findRecord('product', params.product_id)).then((product) => {
        this.set('author', this.store.findRecord('user', 'current')).then(() => {
          if(this.get('author.id') == this.get('product.author_id')) { // jshint ignore:line
            resolve(product);
          }
          reject();
        });
      }, function(){
        reject();
      });
    });

    return Ember.RSVP.hash({
      product: productPromise,
      templates: this.store.query('productTemplate', {})
    });
  }
});
