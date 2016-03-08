import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
  authorize: function(data, block) {
    block('Auth-Token', data.token);
  }
});
