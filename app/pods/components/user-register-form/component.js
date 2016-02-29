import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),

  user: new Ember.Object,
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
        }).then((result) => {
          this.set('errors', {})
          this.get('session').authenticate('authenticator:custom', {
            identification: params.email,
            password: params.password
          })
          .then(()=>{
            this.get("routing").transitionTo("index");
          })
          .catch((message) => {
            this.set('errors.base', ['signed up but could not sign in automatically']);
          });
        }, (error) => {
          this.set('errors', error.responseJSON.errors)
        });
      } else {
        this.set('errors.terms', ['please accept terms and conditions'])
      }
    }
  }
});
