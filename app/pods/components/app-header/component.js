import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  identification: null,
  password: null,

  didInsertElement() {
    this.$().foundation();
  },

  actions: {
    authenticate(){
      console.log(this.get('identification'), this.get('password'))
      var credentials = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:custom', credentials)
      .then(()=>{
        this.$('#loginModal').foundation('close')
      })
      .catch((message) => {
        this.set('errorMessage', message);
      });
    },

    createAccount(){
      this.$('#loginModal').foundation('close');
      this.get("routing").transitionTo("register");
      return false
    },

    showLogin(){
      this.set('errorMessage', null)
      this.set('password', null)
      this.$('#loginModal').foundation('open')
    },

    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
