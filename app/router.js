import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('products');
  this.route('product', { path: '/products/:product_id' });
  this.route('signin');
  this.route('register');
  this.route('confirm-email', { path: '/confirm_email/:token' });
  this.route('confirm-email-error');
  this.route('new-password', { path: '/new_password/:token' });
  this.route('profile');
  this.route('profile-address');
  this.route('become-cook-with-handle', { path: '/become-cook/:handle' });
  this.route('become-cook');
  this.route('cooking');
  this.route('check-out');
  this.route('public-profile', {path: '/:handle'});
});

export default Router;
