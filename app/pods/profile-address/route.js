import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.findRecord('address', 'current');
  }
});
