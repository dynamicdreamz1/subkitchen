import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  isoCountries: Ember.inject.service('iso-countries'),
  flashMessages: Ember.inject.service(),


  handle: null, // from component params or null

  company: Ember.computed(['session', 'handle'], function(){
    let user = this.get('currentUser.content');
    let company = new Ember.Object(user.get('company'));
    let handle = this.get('handle') || user.get('handle');
    company.set('handle', handle);
    return company;
  }),

  errors: {},

  private: Ember.computed('company.has_company', function(){
    return !this.get('company.has_company');
  }),

  actions: {
    showLogin(){
      this.$('#passwordReminderModal').foundation('close');
      this.$('#loginModal').foundation('open');
    },

    becomeCook(){
      if (!this.get('company.terms')) {
        return false; }
      var params = this.get('company').getProperties('handle', 'has_company', 'company_name', 'address', 'city', 'zip', 'region', 'country');
      params.return_path = '/profile';
      params.handle = params.handle || '';
      this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
        var headers = {};
        headers[headerName] = headerValue;
        Ember.$.ajax({
          headers: headers,
          method: "POST",
          url: config.host + config.apiEndpoint + '/account/simple_verification',
          data: params
        }).then(() => {
          this.set('errors', {});
          this.get('routing').transitionTo('profile');
          this.get('flashMessages').success("You've successfully became an artist. Please wait for the verification");
        }, (error) => {
          if (error.responseJSON){
            this.set('errors', error.responseJSON.errors);
          } else {
            this.set('errors', {base: ['Connection error. Please try again later.']});
          }
        });
      });
    }
  }
});
