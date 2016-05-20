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
    let product = this.set('product', this.get('store').createRecord('product', {
      name: '',
      tags: []
    }));
    if(params.product_id) {
      product = new Ember.RSVP.Promise((resolve, reject) => {
        this.set('product', this.store.findRecord('product', params.product_id)).then(() => {
          this.set('author', this.store.findRecord('user', 'current')).then(() => {
            if (this.get('author.id') == this.get('product.author_id')) { // jshint ignore:line
              let oReq = new XMLHttpRequest();
              oReq.open("GET", this.get('product.image_url'), true);
              oReq.responseType = "blob";
              oReq.onload = ()=>{
                let blob = oReq.response;
                this.set('product.image', blob);
                resolve(this.get('product'));
              };
              oReq.onerror = ()=>{
                reject();
              };
              oReq.send();
            } else {
              reject();
            }
          });
        }, function () {
          reject();
        });
      });
    }

    return Ember.RSVP.hash({
      templates: this.store.query('productTemplate', {}),
      themes: this.get('ajax').request(config.host + config.apiEndpoint + '/themes'),
      product: product,
      selectedTemplateId: params.selected_template_id
    });
  }
});
