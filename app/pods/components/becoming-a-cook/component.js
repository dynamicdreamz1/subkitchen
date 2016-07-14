/* global $ */
import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  flashMessages: Ember.inject.service(),

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
      this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
        var headers = {};
        headers[headerName] = headerValue;
        Ember.$.ajax({
          headers: headers,
          method: "POST",
          url: config.host + config.apiEndpoint + '/account/simple_verification'
        }).then(() => {
          this.set('errors', {});
          this.get('routing').transitionTo('profile');
          this.get('flashMessages').success("You've successfully became an artist. Please wait for the verification");
        }, (error) => {
          if (error.responseJSON){
            this.set('errors', error.responseJSON.errors);
          } else {
            this.set('errors', {base: ['Connection error. Please try again later.']});
          }
        });
      });
    }
  }
});
