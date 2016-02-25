import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  routing: Ember.inject.service('-routing'),

  user: new Ember.Object,

  actions: {
    register(){
      let params = this.get('user').getProperties('name', 'email', 'password');
      params.password_confirmation = params.password;

      return Ember.$.ajax({
        method: "POST",
        url: config.host + config.apiEndpoint + '/sessions/register',
        data: params
      }).then((result) => {
        console.log('success')
        // this.get("routing").transitionTo("home");
      });
    }
  }
});
