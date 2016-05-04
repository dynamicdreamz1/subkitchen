import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  session: Ember.inject.service('session'),


  model(){
    let userPromise = new Ember.RSVP.Promise((resolve, reject) => {
      if(this.get('session.isAuthenticated')){
        this.store.findRecord('user', 'current').then(function(user){
          resolve(user);
        }, function(){
          reject();
        });
      } else {
        resolve({});
      }
    });

    return Ember.RSVP.hash({
      templates: this.store.query('productTemplate', {}),
      themes: this.get('ajax').request(config.host + config.apiEndpoint + '/themes'),
      user: userPromise
    });
  }
});
