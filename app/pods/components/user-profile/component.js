import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  flashMessages: Ember.inject.service(),

  user: null,
  address: null,
  errors: {},
  typingDelays: {},

  showAddress: Ember.computed('address', function(){
    let address = this.get('address');
    return address && (
      address.get('firstName') ||
      address.get('lastName') ||
      address.get('address') ||
      address.get('zip') ||
      address.get('region') ||
      address.get('city') ||
      address.get('country'));
  }),

  actions: {
    becomeCook(){
      this.get("routing").transitionTo("become-cook");
    },

    save(){
      const flashMessages = this.get('flashMessages');

      this.$('#save-button').addClass('loading-white');
      this.get('user').save()
      .then(()=>{
        flashMessages.success('Profile updated');
        this.$('#save-button').removeClass('loading-white');
      }, ()=>{
        flashMessages.alert('Could not update profile. Try again later.');
        this.$('#save-button').removeClass('loading-white');
      });
    }
  },
});
