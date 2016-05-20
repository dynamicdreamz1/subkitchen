import Ember from 'ember';

export default Ember.Component.extend({
  route: Ember.inject.service('-routing'),

  actions: {
    goToCooking(){
      let template_id = this.get('template.id');
      this.get('route').transitionTo('cooking', [], {selected_template_id: template_id});
    }
  }
});
