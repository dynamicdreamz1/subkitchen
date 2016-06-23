/* global $ */
import Ember from 'ember';

export default Ember.Component.extend({
  fb: Ember.inject.service('fb'),
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  flashMessages: Ember.inject.service(),

  didRender() {
    return this.get('fb').FBInit();
  },

  actions: {
    authenticate(){
      this.get('fb').login(['public_profile', 'email'])
      .then((response)=>{
        this.authenticate(response.authResponse.accessToken);
      });
    }
  },

  authenticate(access_token){
    this.get('session').authenticate('authenticator:facebook', {access_token: access_token})
    .then(()=>{
      this.get('flashMessages').success("You've successfully signed in");
      this.get("routing").transitionTo('profile');
      if ($('#loginModal').length){
        $('#loginModal').foundation('close');
      }
    })
    .catch((message) => {
      this.set('errorMessage', message);
    });
  }
});
