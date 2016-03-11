import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  address: DS.attr('string'),
  city: DS.attr('string'),
  zip: DS.attr('string'),
  region: DS.attr('string'),
  country: DS.attr('string'),
  phone: DS.attr('string')
});
