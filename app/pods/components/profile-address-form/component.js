import Ember from 'ember';

export default Ember.Component.extend({
  address: null,

  actions: {
    saveAddress(){
      let cta = this.$('.cta');
      cta.addClass('loading-white');
      this.get('address')
      .save()
      .then(()=>{
        cta.removeClass('loading-white');
        cta.text('saved');
        setTimeout(function(){
          cta.text('save address');
        }, 3000);
      }, ()=>{
        cta.removeClass('loading-white');
      });
    }
  }
});
