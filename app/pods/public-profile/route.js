import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return { handle: params.handle };
  }
});
