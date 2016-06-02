import Ember from 'ember';

export default Ember.Component.extend({
  routing: Ember.inject.service('-routing'),
  isoCountries: Ember.inject.service('iso-countries'),
  address: null,

  actions: {
    saveAddress(){
      let cta = this.$('.cta');
      cta.addClass('loading-white');
      this.get('address')
      .save()
      .then(()=>{
        cta.removeClass('loading-white');
        this.get("routing").transitionTo("profile");
      }, ()=>{
        cta.removeClass('loading-white');
      });
    }
  }
});
