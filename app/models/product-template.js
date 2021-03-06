import DS from 'ember-data';

export default DS.Model.extend({
  name:               DS.attr('string'),
  price:              DS.attr('number'),
  product_type:       DS.attr('string'),
  profit:             DS.attr('number'),
  size:               DS.attr(),
  size_chart:         DS.attr('string'),
  templateImage:      DS.attr('string'),
  templateImageLarge: DS.attr('string'),
  templateMaskLarge:  DS.attr('string'),

  formattedProductType: function() {
    return this.get('product_type').replace('_', ' ').toUpperCase();
  }.property('product_type'),

  productTypeAsArray: function() {
    return [this.get('product_type')];
  }.property('product_type')

});
