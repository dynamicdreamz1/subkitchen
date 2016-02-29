import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),

  user: Ember.computed('session', function(){
    return this.get('session').get('data.user')
  }),
  errors: {},
  typingDelays: {},

  saveAttribute: function(name, value){
    if (this.typingDelays[name]){
      clearTimeout(this.typingDelays[name])
    }
    this.typingDelays[name] = setTimeout(()=>{
      this.$('#user-'+name).addClass('loading')
      var params = {}
      params[name] = value
      this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
        var headers = {}
        headers[headerName] = headerValue
        Ember.$.ajax({
          headers: headers,
          method: "PUT",
          url: config.host + config.apiEndpoint + '/account/' + name,
          data: params
        }).then((result) => {
          this.set('errors', {})
          this.get('session').set('data.user', result)
          this.$('#user-'+name).removeClass('loading')
          this.typingDelays[name] = null;
        }, (error) => {
          this.set('errors', error.responseJSON.errors)
          this.$('#user-'+name).removeClass('loading')
          this.typingDelays[name] = null;
        });
      })
    }, 500)
  },

  observeEmail: function () {
    this.saveAttribute('email', this.get('user.email'))
  }.observes('user.email'),

  observeName: function () {
    this.saveAttribute('name', this.get('user.name'))
  }.observes('user.name'),

  observeHandle: function () {
    this.saveAttribute('handle', this.get('user.handle'))
  }.observes('user.handle')

});
