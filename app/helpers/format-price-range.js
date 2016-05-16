import Ember from 'ember';

export function formatPriceRange(stringRange) {
  let arrayRange = stringRange[0].split(', '),
      sign = '$';
  return `${sign}${arrayRange[0]} - ${sign}${arrayRange[1]}`;
}

export default Ember.Helper.helper(formatPriceRange);
