import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    becomeCook(){
      this.transitionToRoute("become-cook");
    }
  }
});
