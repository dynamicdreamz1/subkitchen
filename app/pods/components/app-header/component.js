/* globals $ */
import Ember from 'ember';


export default Ember.Component.extend({
  classNames: ['appHeader'],
  session: Ember.inject.service('session'),
  routing: Ember.inject.service('-routing'),
  cart: Ember.inject.service('shopping-cart'),
  featuredArtists: Ember.inject.service('featured-artists'),
  templates: Ember.inject.service(),
  queryString: null,
  themes:{"themes":["3d","abstract","animal","black \u0026 white","cats","comic","digital","dogs","food","funny","galaxy","game","geometric","illustration","landscape","love","mixed media","movie \u0026 tv","music","nature","painting","pattern","people","pop culture","photo","scary","scifi","skulls","sports","typography","vector","vintage"]},

  cartCount: Ember.computed('cart.order.data.items.@each.quantity', function(){
    return this.get('cart').quantity();
  }),

  hasData: Ember.computed('cart.order.data', function(){
    let order = this.get('cart.order.data');
    return order && order.items && order.items.length;
  }),

  /*queryStringObserver: function(){
    if (this.get('queryStringObserverTimeout')){
      clearTimeout(this.get('queryStringObserverTimeout'));
    }

    let queryStringObserverTimeout = setTimeout(()=>{
      // Search
      // Track searches on your website (ex. product searches)
      fbq('track', 'Search');
      this.get('routing').transitionTo('products', [], { search_query: this.get('queryString') });
    }, 800);

    this.set('queryStringObserverTimeout', queryStringObserverTimeout);
  }.observes('queryString'),*/

  didRender() {
    this.$().foundation();
    this.get('queryString'); // trigger observer
  },

  actions: {

    search() {
      // Search
      // Track searches on your website (ex. product searches)
      //if(this.get('queryString')) {
        fbq('track', 'Search');
        this.get('routing').transitionTo('products', [], { product_type: "" ,search_query: this.get('queryString') || "" });
      //}
    },

    showLogin(){
      this.$('#passwordReminderModal').foundation('close');
      this.$('#loginModal').foundation('open');
    },

    invalidateSession() {
      this.get('session').invalidate();
    },

    showCart(){
      this.get('cart').open();
    },

    linkClicked() {
      $('#nav-menu').hide();

      Ember.run.later(this, function() {
        $('html, body').animate({
          scrollTop: $('body').offset().top
        }, 500);
      }, 500);
    }
  }
});
