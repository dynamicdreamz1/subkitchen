import DS from 'ember-data';

export default DS.Model.extend({
  name:            DS.attr('string'),
  first_name:      DS.attr('string'),
  last_name:       DS.attr('string'),
  followers_count: DS.attr('number'),
  imageUrl:       DS.attr('string'),
  artist:          DS.attr('boolean'),
  handle:          DS.attr('string'),

  product:         DS.belongsTo('product')
});
