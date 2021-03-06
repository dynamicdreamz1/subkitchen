import DS from 'ember-data';

export default DS.Model.extend({
  uuid:            DS.attr('string'),
  createdAt:       DS.attr('date'),
  status:          DS.attr('string'),
  totalCost:       DS.attr('string'),
  pdf:             DS.attr('string'),
  purchased:       DS.attr('string'),
  purchased_at:    DS.attr('string'),
  paypal_url:      DS.attr('string'),
  subtotal:        DS.attr('string'),
  shippingCost:    DS.attr('string'),
  tax:             DS.attr('string'),
  taxCost:         DS.attr('string'),
  discount:        DS.attr('string'),
  invoice_id:      DS.attr('string'),
  items:           DS.attr(),
  shippingAddress: DS.attr(),
  deletedItems:    DS.attr()
});
