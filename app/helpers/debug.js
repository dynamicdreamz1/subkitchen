import Ember from 'ember';

export function debug(params) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (params) {
    console.log("params");
    console.log("====================");
    console.log(params);
  }
}

export default Ember.Helper.helper(debug);
