import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Route.extend({
  model(params){
    return Ember.$.ajax({
      method: "POST",
      url: config.host + config.apiEndpoint + '/sessions/confirm_email',
      data: { confirm_token: params.token},
      dataType: 'json'
    });

    // return new Ember.RSVP.Promise((resolve, reject) => {
    //   Ember.$.ajax({
    //     method: "POST",
    //     url: config.host + config.apiEndpoint + '/sessions/confirm_email',
    //     data: { confirm_token: params.token},
    //     dataType: 'json'
    //   }).then(function() {
    //     Ember.run(function() {
    //       resolve({});
    //     });
    //   }, function() {
    //     Ember.run(function() {
    //       reject({});
    //     });
    //   });
    // });
  }
});
