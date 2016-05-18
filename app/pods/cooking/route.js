import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  session: Ember.inject.service('session'),
  queryParams: {
    product_id: {
      refreshModel: true
    },
    selected_template_id: {
      refreshModel: true
    }
  },

  model(params){
    let userPromise = new Ember.RSVP.Promise((resolve, reject) => {
      if(this.get('session.isAuthenticated')){
        this.store.findRecord('user', 'current').then((user) => {
          resolve(user);
        }, function(){
          reject();
        });
      } else {
        resolve({});
      }
    });
    let productPromise = null;
    if(params.product_id) {
      productPromise = new Ember.RSVP.Promise((resolve, reject) => {
        this.set('product', this.store.findRecord('product', params.product_id)).then((product) => {
          this.set('author', this.store.findRecord('user', 'current')).then(() => {
            if (this.get('author.id') == this.get('product.author_id')) { // jshint ignore:line

              console.debug(this.get('product.image_url'));
              resolve(product)

              Ember.$.ajax({
                url: this.get('product.image_url'),
                type: 'GET'
              })
              //).then((response)=>{
              //  // this.set('product.image', response);
              //  // resolve(this.get('product'));
              //  resolve(product)
              //}, function(){
              //  reject();
              //});
            }
            reject();
          });
        }, function () {
          reject();
        });
      });
    }

    return Ember.RSVP.hash({
      templates: this.store.query('productTemplate', {}),
      themes: this.get('ajax').request(config.host + config.apiEndpoint + '/themes'),
      user: userPromise,
      product: productPromise,
      selectedTemplateId: params.selected_template_id
    });
  }
});
