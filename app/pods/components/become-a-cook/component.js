import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),

  handle: null,

  shouldSeeMe: Ember.computed('session', function(){
    if (this.get('session').get('isAuthenticated')){
      return !(this.get('session').get('data.user').artist &&
               this.get('session').get('data.user').status === 'verified')
    } else {
      return true;
    }
  }),

  didRender(){
    if (!this.get('session').get('isAuthenticated')){
      this.$('.become-a-cook').addClass('clickable');
    }
  },

  actions: {
    wholeBannerClick(){
      if (!this.get('session').get('isAuthenticated')){
        $('#loginModal').foundation('open');
      }
    },
    join(){
      if (!this.get('session').get('isAuthenticated')){
        $('#loginModal').foundation('open');
      } else {
        this.get('routing').transferTo('become-cook');
      }
    }
  }
});
