import Ember from 'ember';
import config from 'subkitchen-front/config/environment';
import { storageFor } from 'ember-local-storage';

export default Ember.Service.extend({
  session: Ember.inject.service('session'),
  uuid: storageFor('uuid'),

  toggleLike(id){
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.optionalAuthorization((headers)=>{
        Ember.$.ajax({
          headers: headers,
          method: "POST",
          url: config.host + config.apiEndpoint + '/products/' + id + '/toggle_like',
          dataType : 'json',
          data: { uuid: this.get('uuid').get('value')}
        })
        .then((result)=>{
          this.get('uuid').set('value', result.uuid);
          resolve(result);
        }, function(error){
          reject(error);
        });
      });
    });
  },

  optionalAuthorization(callback){
    if(this.get('session.isAuthenticated')){
      this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
        var headers = {};
        headers[headerName] = headerValue;
        callback(headers);
      });
    } else {
      callback({});
    }
  }
});
