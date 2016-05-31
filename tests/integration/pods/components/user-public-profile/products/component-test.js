import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-public-profile/products', 'Integration | Component | user public profile/products', {
  integration: true
});

test('it renders', function() {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{user-public-profile/products}}`);

  // assert.equal(this.$().text().trim(), '');
  expect(0);
});
