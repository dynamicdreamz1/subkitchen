import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement: function () {
    this.$().tagsInput({
      defaultText: this.get('defaultText'),
      width:'100%',
      height: '2.8rem',
      onAddTag: this.get('onAddTag'),
      onRemoveTag: this.get('onRemoveTag'),
      values: this.get('values')
    });
    this.$().importTags(this.get('values').filter((tag) => {
      return !this.get('themes').includes(tag);
    }).join());
  }
});
