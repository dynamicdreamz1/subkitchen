import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    setValue(value){
      this.set('chosen', value);
    }
  }
});
