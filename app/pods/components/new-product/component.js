/* global $ */
import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  didRender(){
    this._super(...arguments);
    if (!this.get('session').get('isAuthenticated')){
      $('#loginModal').foundation('open');
    }
  }
});
