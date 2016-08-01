import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('products');
  this.route('product', { path: 'products/:product_id' });
  this.route('signin');
  this.route('register');
  this.route('confirm-email', { path: '/confirm_email/:token' });
  this.route('confirm-email-error');
  this.route('new-password', { path: '/new_password/:token' });
  this.route('profile', function() {
    this.route('info', { path: '/' });
    this.route('designs');
    this.route('artist');
    this.route('orders');
    this.route('order', { path: 'orders/:order_id'});
    this.route('earnings');
  });
  this.route('information', function() {
    this.route('delivery-and-returns');
    this.route('payment');
    this.route('about-artist');
    this.route('artist-terms');
    this.route('custom-clothing');
    this.route('terms-and-conditions');
    this.route('wholesale');
    this.route('privacy-policy');
    this.route('contact');
  });
  this.route('profile-address');
  this.route('become-cook-with-handle', { path: '/become-cook/:handle' });
  this.route('become-cook');
  this.route('cooking');
  this.route('published-product', { path: '/published-product/:product_id' });
  this.route('check-out');
  this.route('public-profile', { path: '/:handle' });
  this.route('artists');
  this.route('beta');
});

export default Router;
