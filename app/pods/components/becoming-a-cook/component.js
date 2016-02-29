import Ember from 'ember';

export default Ember.Component.extend({
  user: new Ember.Object,
  errors: {},

  private: Ember.computed('user.ownBusiness', function(){
    return !this.get('user.ownBusiness')
  }),

  actions: {
    becomeCook(){
      console.log('becomeCook')
    }
  }
});
