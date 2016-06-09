import DS from 'ember-data';

export default DS.Model.extend({
  name:                DS.attr('string'),
  price:               DS.attr('number'),
  likes_count:         DS.attr('number'),
  preview_url:         DS.attr('string'),
  quantity:            DS.attr('string'),
  purchased_at:        DS.attr('date'),
  status:              DS.attr('string'),
  product_id:          DS.attr('number')
});
