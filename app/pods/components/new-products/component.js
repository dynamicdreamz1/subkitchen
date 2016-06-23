import Ember from 'ember';

export default Ember.Component.extend({
  templates: Ember.inject.service(),

  didInsertElement() {
    this.$().foundation();
  }
});
