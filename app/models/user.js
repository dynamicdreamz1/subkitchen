import DS from 'ember-data';

export default DS.Model.extend({
  name:           DS.attr('string'),
  lastName:       DS.attr('string'),
  firstName:      DS.attr('string'),
  imageUrl:       DS.attr('string'),
  email:          DS.attr('string'),
  artist:         DS.attr('boolean'),
  handle:         DS.attr('string'),
  status:         DS.attr('string'),
  products_count: DS.attr('number'),

  products:  DS.hasMany('products'),
});
