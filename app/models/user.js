import DS from 'ember-data';

export default DS.Model.extend({
  name:                   DS.attr('string'),
  lastName:               DS.attr('string'),
  firstName:              DS.attr('string'),
  imageUrl:               DS.attr('string'),
  bannerUrl:              DS.attr('string'),
  email:                  DS.attr('string'),
  artist:                 DS.attr('boolean'),
  handle:                 DS.attr('string'),
  paypal_id:              DS.attr('string'),
  status:                 DS.attr('string'),
  bio:                    DS.attr('string'),
  products_count:         DS.attr('number'),
  likes_count:            DS.attr('number'),
  current_account_state:  DS.attr('number'),
  earnings_overall:       DS.attr('number'),

  products:               DS.hasMany('product'),
  comments:               DS.hasMany('comment'),
  payouts:                DS.hasMany('payout')
});
