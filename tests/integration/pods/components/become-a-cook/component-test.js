import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('become-a-cook', 'Integration | Component | become a cook', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{become-a-cook}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#become-a-cook}}
      template block text
    {{/become-a-cook}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
