/* global $ */
import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  flashMessages: Ember.inject.service(),

  user: new Ember.Object(),
  errors: {},

  actions: {
    scrollUp() {
      setTimeout(() => {
        $('html, body').animate({
          scrollTop: $('body').offset().top
        }, 500);
      }, 500);
    },

    showLogin(){
      this.$('#passwordReminderModal').foundation('close');
      this.$('#loginModal').foundation('open');
    },

    becomeCook() {
      if(!this.get('session.isAuthenticated')) {
        let user = this.get('user');
        let params = user.getProperties('handle', 'name', 'email', 'password');
        params.password_confirmation = params.password;
        params.uuid = this.get('params.uuid');
        Ember.$.ajax({
          method: "POST",
          url: config.host + config.apiEndpoint + '/account/simple_verification',
          data: params
        }).then(() => {
          this.set('errors', {});
          this.get('session').authenticate('authenticator:custom', {
              identification: params.email,
              password: params.password
            })
            .then(()=> {
              this.get('flashMessages').success("You've successfully created your account");
              this.get("routing").transitionTo("profile");
            })
            .catch(() => {
              this.set('errors.base', ['signed up but could not sign in automatically']);
            });
        }, (error) => {
          if (error.responseJSON) {
            this.set('errors', error.responseJSON.errors);
          } else {
            this.set('errors', {base: ['Connection error. Please try again later.']});
          }
        });
      } else {
        this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
          let uuid = this.get('params.uuid');
          let headers = {};
          headers[headerName] = headerValue;
          Ember.$.ajax({
            headers: headers,
            method: "POST",
            url: config.host + config.apiEndpoint + '/account/simple_verification',
            data: { uuid: uuid }
          }).then((response) => {
            this.set('currentUser.content', response.user);
            this.set('errors', {});
            this.get('routing').transitionTo('profile');
            let msg = '';
            if(uuid) {
              msg = "You've successfully became an artist.";
            } else {
              msg = "You've successfully became an artist. Please wait for the verification";
            }
            this.get('flashMessages').success(msg);
          }, (error) => {
            if (error.responseJSON) {
              this.set('errors', error.responseJSON.errors);
            } else {
              this.set('errors', {base: ['Connection error. Please try again later.']});
            }
          });
        });
      }
    }
  }
});
