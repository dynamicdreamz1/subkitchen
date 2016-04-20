/* globals $ */
import Ember from 'ember';
import config from 'subkitchen-front/config/environment';
import { storageFor } from 'ember-local-storage';

export default Ember.Service.extend({
  order: storageFor('order'),
  session: Ember.inject.service('session'),

  init() {
    this._super(...arguments);
    this.fetchOrder();
  },

  reload(){
    this.fetchOrder();
  },

  quantityChanged: Ember.observer('order.data.items.@each.quantity', function() {
    Ember.run.once(this, 'processQuantityChanged');
  }),

  processQuantityChanged(){
    let items = this.get('order.data.items');
    if (items){
      items.forEach((item, index) =>{
        let abs = Math.abs(Number(item.quantity));
        if (abs !== Number(item.quantity)){
          this.set('order.data.items.' + index + '.quantity', Math.abs(Number(item.quantity)));
        }
        this.setQuantity(item);
      });
    }
  },

  quantity(){
    let sum = 0;
    let items = this.get('order.data.items');
    if (items){
      items.forEach(function(item){
        sum += Number(item.quantity);
      });
    }
    return sum;
  },

  //view
  close(){
    $('#shopping-cart').foundation('close');
  },

  open(){
    $('#shopping-cart').foundation('open');
  },

  toggle(){
    $('#shopping-cart').foundation('toggle');
  },

  // behavior
  add(product_id, size, template_variant_id,  quantity) {
    var params = {
      product_id: product_id,
      template_variant_id: template_variant_id,
      size: size,
      quantity: quantity };
      if (this.get('order.data')){
        params['uuid'] = this.get('order.data.uuid'); }

        this.optionalAuthorization((headers)=>{
          this.addItem(params, headers);
        });
  },

  remove(item_id) {
    var params = { id: item_id };
    if (this.get('order.data')){
      params['uuid'] = this.get('order.data.uuid'); }
      return this.removeItem(params);
  },

  // private
  fetchOrder(){
    this.optionalAuthorization(()=>{
      let params = {};
      if (this.get('order.data')){
        params['uuid'] = this.get('order.data.uuid'); }
        Ember.$.ajax({
          method: "GET",
          url: config.host + config.apiEndpoint + '/orders',
          data: params
        }).then((result) => {
          this.set('order.data', result.order);
        }, (error) => {
          this.set('order.data', {});
          if (error.responseJSON){
            this.set('errors', error.responseJSON.errors);
          } else {
            this.set('errors', {base: ['Connection error. Please try again later.']});
          }
        });
    });
  },

  addItem(params, headers){
    Ember.$.ajax({
      headers: headers,
      method: "POST",
      url: config.host + config.apiEndpoint + '/orders/item',
      data: params
    }).then((result) => {
      this.set('order.data', result.order);
      $('#cart-dropdown').foundation('close');
      $('#cart-dropdown').foundation('open');
    }, (error) => {
      if (error.responseJSON){
        this.set('errors', error.responseJSON.errors);
      } else {
        this.set('errors', {base: ['Connection error. Please try again later.']});
      }
    });
  },

  setQuantity(item){
    var params = { id: item.id, quantity: item.quantity };
    if (this.get('order.data')){
      params['uuid'] = this.get('order.data.uuid'); }

    return Ember.$.ajax({
      method: "PUT",
      url: config.host + config.apiEndpoint + '/orders/item/'+params['id'],
      data: params
    }).then((result) => {
      this.set('order.data.total_cost', result.order.total_cost);
      this.set('order.data.subtotal', result.order.subtotal);
      this.set('order.data.tax', result.order.tax);
      this.set('order.data.tax_cost', result.order.tax_cost);
      this.set('order.data.shipping_cost', result.order.shipping_cost);
    }, (error) => {
      if (error.responseJSON){
        this.set('errors', error.responseJSON.errors);
      } else {
        this.set('errors', {base: ['Connection error. Please try again later.']});
      }
    });
  },

  removeItem(params){
    return Ember.$.ajax({
      method: "DELETE",
      url: config.host + config.apiEndpoint + '/orders/item/'+params['id'],
      data: params
    }).then((result) => {
      this.set('order.data', result.order);
    }, (error) => {
      if (error.responseJSON){
        this.set('errors', error.responseJSON.errors);
      } else {
        this.set('errors', {base: ['Connection error. Please try again later.']});
      }
    });
  },

  optionalAuthorization(callback){
    if(this.get('session.isAuthenticated')){
      this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
        var headers = {};
        headers[headerName] = headerValue;
        callback(headers);
      });
    } else {
      callback({});
    }
  }

});
