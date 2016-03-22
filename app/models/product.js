import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name:           DS.attr('string'),
  description:    DS.attr('string'),
  shipping:       DS.attr('string'),
  author:         DS.attr('string'),
  image_url:      DS.attr('string'),
  price:          DS.attr('number'),
  likes_count:    DS.attr('number'),
  comments_count: DS.attr('number'),

  promoters:   DS.hasMany('promoter')
});
