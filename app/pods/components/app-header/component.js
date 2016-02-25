import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  identification: null,
  password: null,
  errors: {},

  didInsertElement() {
    this.$().foundation();
  },

  actions: {
    authenticate(){
      console.log(this.get('identification'), this.get('password'))
      var credentials = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:custom', credentials).catch((message) => {
        this.set('errorMessage', message);
      });
    },

    createAccount(){
      console.log('createAccount')
    },

    showLogin(){
      console.log(this.session)
      console.log(this.session.isAuthenticated)
      this.set('errorMessage', null)
      this.set('password', null)
      this.$('#loginModal').foundation('open')
    },

    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
