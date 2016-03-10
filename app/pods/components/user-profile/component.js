import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),

  user: Ember.computed('session', function(){
    return this.get('session').get('data.user');
  }),
  errors: {},
  typingDelays: {},

  observeEmail: function () {
    this.saveAttribute('email', this.get('user.email'));
  }.observes('user.email'),

  observeName: function () {
    this.saveAttribute('name', this.get('user.name'));
  }.observes('user.name'),

  observeHandle: function () {
    this.saveAttribute('handle', this.get('user.handle'));
  }.observes('user.handle'),

  observeProfileImage: function () {
    if (this.get('user.profile_image') && this.get('user.profile_image').length){
      this.$('#uploadButton').addClass('loading');
      let formData = new FormData(this.$('#formAvatarUpload')[0]);
      this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
        var headers = {};
        headers[headerName] = headerValue;
        Ember.$.ajax({
          headers: headers,
          method: "POST",
          url: config.host + config.apiEndpoint + '/account/profile_image',
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          dataType : 'json',
        }).then((result) => {
          this.set('errors', {});
          this.get('session').set('data.user', result);
          this.set('user', result);
          this.$('#uploadButton').removeClass('loading');
        }, (error) => {
          this.$('#uploadButton').removeClass('loading');
          if (error.responseJSON){
            this.set('errors', error.responseJSON.errors);
          } else {
            this.set('errors', {base: ['Connection error. Please try again later.']});
          }
        });
      });
    }
  }.observes('user.profile_image'),

  actions: {
    becomeCook(){
      this.get("routing").transitionTo("become-cook");
    }
  },


  saveAttribute: function(name, value){
    if (this.typingDelays[name]){
      clearTimeout(this.typingDelays[name]);
    }
    this.typingDelays[name] = setTimeout(()=>{
      this.$('#user-'+name).addClass('loading');
      var params = {};
      params[name] = value;
      this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
        var headers = {};
        headers[headerName] = headerValue;
        Ember.$.ajax({
          headers: headers,
          method: "PUT",
          url: config.host + config.apiEndpoint + '/account/' + name,
          data: params
        }).then((result) => {
          this.set('errors', {});
          this.get('session').set('data.user', result);
          this.$('#user-'+name).removeClass('loading');
          this.typingDelays[name] = null;
        }, (error) => {
          if (error.responseJSON){
            this.set('errors', error.responseJSON.errors);
          } else {
            this.set('errors', {base: ['Connection error. Please try again later.']});
          }
          this.$('#user-'+name).removeClass('loading');
          this.typingDelays[name] = null;
        });
      });
    }, 500);
  }
});
