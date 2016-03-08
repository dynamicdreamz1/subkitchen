import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  cart: Ember.inject.service('shopping-cart'),
  cartCount: Ember.computed('cart.order.data.items.@each.quantity', function(){
    let sum = 0;
    let items = this.get('cart.order.data.items')
    if (items){
      items.forEach(function(item){
        sum += Number(item.quantity);
      });
    }
    return sum;
  }),
  identification: null,
  password: null,

  didInsertElement() {
    this.$().foundation();
  },

  actions: {
    authenticate(){
      var credentials = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:custom', credentials)
      .then(()=>{
        this.$('#loginModal').foundation('close');
        this.get("routing").transitionTo("profile");
      })
      .catch((message) => {
        this.set('errorMessage', message);
      });
    },

    createAccount(){
      this.$('#loginModal').foundation('close');
      this.get("routing").transitionTo("register");
      return false;
    },

    showLogin(){
      this.set('errorMessage', null);
      this.set('password', null);
      this.$('#passwordReminderModal').foundation('close');
      this.$('#loginModal').foundation('open');
    },

    showPasswordReminder(){
      this.set('errorMessage', null);
      this.set('mailSent', null);
      this.$('#loginModal').foundation('close');
      this.$('#passwordReminderModal').foundation('open');
      return false;
    },

    remindPassword(){
        Ember.$.ajax({
          method: "POST",
          url: config.host + config.apiEndpoint + '/sessions/forgot_password',
          data: { email: this.get('identification') }
        }).then(() => {
          this.set('errorMessage', null);
          this.set('mailSent', true);
          console.log('success');
        }, () => {
          this.set('errorMessage', true);
          this.set('mailSent', null);
        });
    },

    invalidateSession() {
      this.get('session').invalidate();
    },

    showCart(){
      this.get('cart').open();
    }
  }
});
