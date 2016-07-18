import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  didRender() {
    this.$().foundation();
  },

  actions: {
    loadMorePayouts(){
      this.$('.loadMore').addClass('loading-white');
      let newPage = this.get('model.meta.current_page') + 1;
      this.get('store')
        .query('payout', { page: newPage , per_page: 15 })
        .then((results)=>{
          let payouts = this.get('model');
          payouts.pushObjects(results.content);
          payouts.set('meta.current_page', results.get('meta.current_page'));
          this.$('.loadMore').removeClass('loading-white');
        });
    }
  }
});
