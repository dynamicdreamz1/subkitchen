import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('product-creator', 'Integration | Component | product creator', {
  integration: true
});

test('it renders', function() {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{product-creator}}`);

  // assert.equal(this.$().text().trim(), '');

  expect(0);
});
