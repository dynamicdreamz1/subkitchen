import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model(){
    return {
      countries: {
       PL: 'Poland',
       US: 'United States',
       GB: 'Great Britain'
      }
    }
  }
});
