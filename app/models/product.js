import DS from 'ember-data';

export default DS.Model.extend({
  name:        DS.attr('string'),
  description: DS.attr('string'),
  shipping:    DS.attr('string'),
  author:      DS.attr('string'),
  image_url:   DS.attr('string'),
  price:       DS.attr('number'),
  likes:       DS.attr('number')
});
