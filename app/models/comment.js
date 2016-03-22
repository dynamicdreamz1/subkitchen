import DS from 'ember-data';

export default DS.Model.extend({
  content:    DS.attr('string'),
  createdAt:  DS.attr('date'),
  user:       DS.belongsTo('user')
});
