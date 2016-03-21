import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  promo: null,

  didInsertElement() {
    this.$().foundation();
  },
  actions: {
    letsCook(){
      this.get("routing").transitionTo("cooking");
    }
  }
});
