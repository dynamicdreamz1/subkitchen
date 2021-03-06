import DS from 'ember-data';

export default DS.Model.extend({
  value:               DS.attr('number'),
  created_at:          DS.attr('date'),
  user:                DS.belongsTo('user')
});
