import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  flashMessages: Ember.inject.service(),

  user: null,
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

  observeProfileImage: function () {
    const flashMessages = this.get('flashMessages');
    if (this.get('user.profileImage') && this.get('user.profileImage').length){
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
          flashMessages.success('Profile image updated');
          this.set('errors', {});
          this.set('user.imageUrl', result.user.image_url);
          this.set('user.profileImage', null);
          this.$('#uploadButton').removeClass('loading');
        }, (error) => {
          this.set('user.profileImage', null);
          if (error.responseJSON){
            this.set('errors', error.responseJSON.errors);
          } else {
            this.set('errors', {base: ['Connection error. Please try again later.']});
          }
          this.$('#uploadButton').removeClass('loading');
        });
      });
    }
  }.observes('user.profileImage'),

  actions: {
    becomeCook(){
      this.get("routing").transitionTo("become-cook");
    },

    save(){
      const flashMessages = this.get('flashMessages');

      this.$('#save-button').addClass('loading-white');
      this.get('user').save()
      .then(()=>{
        flashMessages.success('Profile updated');
        this.$('#save-button').removeClass('loading-white');
      }, ()=>{
        flashMessages.alert('Could not update profile. Try again later.');
        this.$('#save-button').removeClass('loading-white');
      });
    }
  },
});
