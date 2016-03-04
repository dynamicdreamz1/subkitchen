import Ember from 'ember';

export default Ember.Component.extend({
  route: Ember.inject.service('-routing'),

  actions: {
    goToCooking(){
      this.get('route').transitionTo('cooking');
    }
  }
});
