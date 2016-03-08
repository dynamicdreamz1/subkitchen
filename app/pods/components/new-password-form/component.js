import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),

  user: new Ember.Object(),
  token: null,

  actions: {
    setPassword(){
      let user = this.get('user');
      let params = user.getProperties('password', 'password_confirmation');
      params.token = this.get('token');

      return Ember.$.ajax({
        method: "POST",
        url: config.host + config.apiEndpoint + '/sessions/set_new_password',
        data: params
      }).then((result) => {

        this.set('errors', {});
        this.get('session').authenticate('authenticator:custom', {
          identification: result.email,
          password: params.password
        })
        .then(()=>{
          this.get("routing").transitionTo("index");
        })
        .catch(() => {
          this.set('errors.base', ['changed password but could not sign in automatically']);
        });

      }, (error) => {
        this.set('errors', error.responseJSON.errors);
      });
    }
  }
});
