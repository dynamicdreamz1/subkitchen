import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    toggleLike(){
      this.get('like').toggleLike(this.get('product.id'))
        .then((result) => {
          this.set('product.likes_count', result.likes_count);
        }, (error) => {
          if (error.responseJSON) {
            this.set('errors', error.responseJSON.errors);
          } else {
            this.set('errors', {base: ['Connection error. Please try again later.']});
          }
        });
    }
  }
});
