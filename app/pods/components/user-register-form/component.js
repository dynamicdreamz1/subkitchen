import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  flashMessages: Ember.inject.service(),

  user: new Ember.Object(),
  errors: {},

  actions: {
    register(){
      let user = this.get('user');
      if(user.get('terms')){
        let params = user.getProperties('name', 'email', 'password');
        params.password_confirmation = params.password;

        return Ember.$.ajax({
          method: "POST",
          url: config.host + config.apiEndpoint + '/sessions/register',
          data: params
        }).then(() => {
          this.set('errors', {});
          this.get('session').authenticate('authenticator:custom', {
            identification: params.email,
            password: params.password
          })
          .then(()=>{
            // CompleteRegistration
            // Track when a registration form is completed (ex. complete subscription, sign up for a service)
            fbq('track', 'CompleteRegistration');
            this.get('flashMessages').success("You've successfully created your account");
            this.get("routing").transitionTo("index");
          })
          .catch(() => {
            this.set('errors.base', ['signed up but could not sign in automatically']);
          });
        }, (error) => {
          this.set('errors', error.responseJSON.errors);
        });
      } else {
        this.set('errors.terms', ['please accept terms and conditions']);
      }
    }
  }
});
