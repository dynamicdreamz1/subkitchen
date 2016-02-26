import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

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
      this.$('#passwordReminderModal').foundation('close')
      this.$('#loginModal').foundation('open')
    },

    showPasswordReminder(){
      this.set('errorMessage', null)
      this.set('mailSent', null);
      this.$('#loginModal').foundation('close')
      this.$('#passwordReminderModal').foundation('open')
      return false
    },

    remindPassword(){
        Ember.$.ajax({
          method: "POST",
          url: config.host + config.apiEndpoint + '/sessions/forgot_password',
          data: { email: this.get('identification') }
        }).then((result) => {
          this.set('errorMessage', null);
          this.set('mailSent', true);
          console.log('success')
        }, (error) => {
          this.set('errorMessage', true);
          this.set('mailSent', null);
        });
    },

    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
