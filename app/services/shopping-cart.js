import Ember from 'ember';

export default Ember.Service.extend({
  items: null,

  init() {
    this._super(...arguments);
    this.set('items', []);
  },

  close(){
    $('#shopping-cart').foundation('close');
  },

  open(){
    $('#shopping-cart').foundation('open');
  },

  toggle(){
    $('#shopping-cart').foundation('toggle');
  },

  add(id, size, quantity) {
    console.log('add', id, size, quantity);
    this.get('items').pushObject(id);
  },

  remove(item) {
    this.get('items').removeObject(item);
  },

  empty() {
    this.get('items').setObjects([]);
  }
});
