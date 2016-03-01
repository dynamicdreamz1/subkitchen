import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  company: Ember.computed('session', function(){
    return new Ember.Object(this.get('session').get('data.user.company'))
  }),
  errors: {},

  private: Ember.computed('company.has_company', function(){
    return !this.get('company.has_company')
  }),

  actions: {
    becomeCook(){
      var params = this.get('company').getProperties('has_company', 'company_name', 'address', 'city', 'zip', 'region', 'country')
      params['return_path'] = '/profile'
      this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
        var headers = {}
        headers[headerName] = headerValue
        Ember.$.ajax({
          headers: headers,
          method: "POST",
          url: config.host + config.apiEndpoint + '/account/verification',
          data: params
        }).then((result) => {
          this.set('errors', {})
          window.top.location.href = result.url
        }, (error) => {
          if (error.responseJSON){
            this.set('errors', error.responseJSON.errors)
          } else {
            this.set('errors', {base: ['Connection error. Please try again later.']})
          }
        });
      })
    }
  }
});
