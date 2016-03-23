import Ember from 'ember';

export default Ember.Component.extend({
  array: [],

  display: Ember.computed('array', function(){
    let array = this.get('array');
    if (typeof(array) === 'string'){
      return array; }
    if (array.length === 1) {
      return array[0]; }
    return array.slice(0, array.length - 1).join(', ') + " and " + array.slice(-1);
  })
});
