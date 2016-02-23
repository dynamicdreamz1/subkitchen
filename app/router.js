import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home');
  this.route('products');
  this.route('product', { path: '/products/:product_id' });
});

export default Router;
