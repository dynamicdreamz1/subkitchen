import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.fetchTemplates();
  },

  fetchTemplates() {
    this.get('store').query('productTemplate', {}).then((result) => {
      this.set('data', result);
    });
  }
});
