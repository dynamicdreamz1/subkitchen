import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('becoming-a-cook', 'Integration | Component | becoming a cook', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{becoming-a-cook}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#becoming-a-cook}}
      template block text
    {{/becoming-a-cook}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
