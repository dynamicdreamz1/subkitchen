import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  user: Ember.inject.service('current-user'),
  address: null,

  errors: {},
  typingDelays: {},

  showAddress: Ember.computed('address', function(){
    let address = this.get('address');
    return address && (
      address.get('firstName') ||
      address.get('lastName') ||
      address.get('address') ||
      address.get('zip') ||
      address.get('regiono') ||
      address.get('city') ||
      address.get('country'));
  }),

  observeEmail: Ember.observer('user.data.email', function () {
    this.saveAttribute('email', this.get('user.data.email'));
  }),

  observeName: Ember.observer('user.data.name', function () {
    this.saveAttribute('name', this.get('user.data.name'));
  }),

  observeHandle: Ember.observer('user.data.handle', function () {
    this.saveAttribute('handle', this.get('user.data.handle'));
  }),

  observeProfileImage: function () {
    if (this.get('user.data.profile_image') && this.get('user.data.profile_image').length){
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
          let error = (result.errors || {}).profile_image;
          this.set('errors.profile_image', error);
          if (!error){
            this.set('user.data.image_url', result.image_url);
            this.get('user').set('data.image_url', result.image_url);
          }
          this.set('user.data.profile_image', null);
          this.$('#uploadButton').removeClass('loading');
        }, (error) => {
          this.set('user.data.profile_image', null);
          this.$('#uploadButton').removeClass('loading');
          if (error.responseJSON){
            this.set('errors', error.responseJSON.errors);
          } else {
            this.set('errors', {base: ['Connection error. Please try again later.']});
          }
        });
      });
    }
  }.observes('user.data.profile_image'),

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
          this.get('user.data').set(name, result[name]);
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
  },
});
