import { capitalize } from 'subkitchen-front/helpers/capitalize';
import { module, test } from 'qunit';

module('Unit | Helper | capitalize');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = capitalize(['aaa-bbb_CCC']);
  assert.equal(result, 'Aaa Bbb Ccc');

  result = capitalize([42]);
  assert.equal(result, '');
});
