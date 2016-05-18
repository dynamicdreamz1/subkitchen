import Ember from 'ember';
import config from 'subkitchen-front/config/environment';


export default Ember.Service.extend({
  createProduct(callback){
    if ( this.get('product.image') ){
      this.$('.js-publish').addClass('loading-white');

      // get image
      let canvas = this.get('canvas');
      canvas.deactivateAll().renderAll();
      let multiplier = Math.floor(2048 / canvas.getWidth());
      let dataURL =  canvas.toDataURL({
        format: 'png',
        multiplier: multiplier
      });
      let file = this.get('dataUrlToBlob').convert(dataURL);
      this.set('product.preview', file);

      // get tags
      let tags = this.get('product.tags');
      let themes = this.get('selectedThemes').toArray();
      tags = [...new Set([...tags, ...themes])];
      tags = tags.reject(function(tag){
        return tag === '';
      });
      this.set('product.tags', tags);

      let publishedValue = this.get('isPublished');

      let formData = new FormData(this.$('#formImageUpload')[0]);

      formData.append('name', this.get('product.name'));
      formData.append('description', 'Custom Design');
      formData.append('preview', this.get('product.preview'));
      formData.append('product_template_id', this.get('selectedTemplate.id'));
      formData.append('published', publishedValue);

      formData.append('image', this.get('product.image'));

      tags.forEach(function(tag){
        formData.append('tags[]', tag);
      });

      this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
        var headers = {};
        headers[headerName] = headerValue;

        Ember.$.ajax({
          headers: headers,
          method: "POST",
          url: config.host + config.apiEndpoint + '/products',
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          dataType : 'json'
        }).then((response) => {
          callback(response);
        }, (error) => {
          this.set('errors', error.responseJSON.errors);
        });
      });

    }
  },
});
