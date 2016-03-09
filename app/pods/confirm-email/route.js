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
  }
});
