import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return Ember.RSVP.hash({
      templates: this.store.query('productTemplate', {})
    });
  }
});
