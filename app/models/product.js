import DS from 'ember-data';

export default DS.Model.extend({
  name:                DS.attr('string'),
  description:         DS.attr('string'),
  shipping:            DS.attr('string'),
  author_id:           DS.attr('number'),
  image_url:           DS.attr('string'),
  price:               DS.attr('number'),
  likes_count:         DS.attr('number'),
  comments_count:      DS.attr('number'),
  template_variant_id: DS.attr('number'),
  preview_url:         DS.attr('string'), // image from backend
  image:               DS.attr(),         // we send it
  preview:             DS.attr(),         // we send it
  published:           DS.attr('boolean'),
  sizes:               DS.attr(),
  tags:                DS.attr(),
  variants:            DS.attr(),
  product_type:        DS.attr('string'),
  product_template_id: DS.attr('number'),

  promoters:           DS.hasMany('promoter'),
  author:              DS.belongsTo('user'),
  comments:            DS.hasMany('comment'),

  formattedTags: function() {
    let tags = this.get('tags');
    if(tags) {
      return tags.map((tag) => {
        return '#' + tag.toUpperCase();
      }).sort().join(', ');
    }
  }.property('tags'),

  publishStatus: function() {
    if(this.get('published')) {
      return 'published';
    }
    return 'unpublished';
  }.property('published'),

  formattedProductType: function() {
    return this.get('product_type').replace('_', ' ');
  }.property('product_type')
});
