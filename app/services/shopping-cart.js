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

  // quantityChanged: Ember.observer('order.data.items.@each.quantity', function() {
  //   this.get('order.data.items').forEach((item, index) =>{
  //     this.set('order.data.items.' + index + '.quantity', Math.abs(Number(item.quantity)))
  //   });
  // }),

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
  add(product_id, size, quantity) {
    console.log('add', product_id, size, quantity);

    var params = {
      product_id: product_id,
      size: size,
      quantity: quantity };
    if (this.get('order.data')){
      params['uuid'] = this.get('order.data.uuid'); }

    this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
      var headers = {};
      headers[headerName] = headerValue;
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
    this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
      let headers = {};
      headers[headerName] = headerValue;
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
  }

});
