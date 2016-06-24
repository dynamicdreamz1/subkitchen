/* global $ */
import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  newsletterReceiverEmail: "",
  errors: '',
  newsletterReceiver: new Ember.Object(),

  didInsertElement() {
    this.$().foundation();
  },

  actions: {

    subscribe() {
      this.set('errors', '');
      let newsletterReceiver = this.get('store').createRecord('newsletter-receiver', {
        email: this.get('newsletterReceiverEmail')
      });
      newsletterReceiver.save().then(() => {
        $('#newsletterModal').foundation('open');
        this.set('newsletterReceiverEmail', "");
      }, (error) => {
        this.set('errors', error.errors[0].detail);
      });
    },

    linkClicked() {
      setTimeout(function () {
        $('html, body').animate({
          scrollTop: $('body').offset().top
        }, 500);
      }, 500);
    }
  }
});
