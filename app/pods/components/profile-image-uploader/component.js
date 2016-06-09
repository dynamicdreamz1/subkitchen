import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  flashMessages: Ember.inject.service(),

  errors: {},

  observeProfileImage: function () {
    const flashMessages = this.get('flashMessages');
    if (this.get('currentUser.content.profileImage') && this.get('currentUser.content.profileImage').length){
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
          dataType : 'json'
        }).then((result) => {
          flashMessages.success('Profile image updated');
          this.set('errors', {});
          this.set('currentUser.content.imageUrl', result.user.image_url);
          this.set('currentUser.content.profileImage', null);
          this.$('#uploadButton').removeClass('loading');
        }, (error) => {
          this.set('currentUser.content.profileImage', null);
          if (error.responseJSON){
            this.set('errors', error.responseJSON.errors);
          } else {
            this.set('errors', {base: ['Connection error. Please try again later.']});
          }
          this.$('#uploadButton').removeClass('loading');
        });
      });
    }
  }.observes('currentUser.content.profileImage'),
});
