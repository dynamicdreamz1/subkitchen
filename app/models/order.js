import DS from 'ember-data';


export default DS.Model.extend({
  uuid:        DS.attr('string'),
  createdAt:   DS.attr('date'),
  orderStatus: DS.attr('string'),
  totalCost:   DS.attr('string'),
  pdf:         DS.attr('string')
});
