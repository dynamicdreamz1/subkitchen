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
  this.route('new-password', { path: '/new_password/:token' });
  this.route('profile');
});

export default Router;
