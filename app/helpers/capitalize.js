import Ember from 'ember';

export function capitalize(params/*, hash*/) {
  if (params && typeof params[0] === 'string'){
    return params[0]
      .replace(/[-_]+/ig, ' ')
      .split(' ')
      .map(function(a){ return a.toLowerCase().capitalize(); })
      .join(' ');
  }
  return '';
}

export default Ember.Helper.helper(capitalize);
