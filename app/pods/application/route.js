import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import config from 'subkitchen-front/config/environment';

export default Ember.Route.extend({

})

// export default Ember.Route.extend(ApplicationRouteMixin, {
//   beforeModel(transition) {
//     this._super(transition);

//     if (this.session.isAuthenticated) {
//       return this._populateCurrentUser();
//     }
//   },

//   actions: {
//     invalidateSession() {
//         this.get('session').invalidate();
//     },
//     sessionAuthenticationSucceeded() {
//       this._populateCurrentUser()
//     },
//     sessionRequiresAuthentication() {
//       $('#loginModal').foundation('open')
//     }
//   },

//   _populateCurrentUser() {
//     return this.store.findRecord('user', this.session.get('secure.user_id')).then(
//       (user) => {
//         this.get('currentUser').set('content', user);
//       }).catch(function() {});
//   }
// });
