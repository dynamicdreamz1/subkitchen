/* global $ */
import EmberUploader from 'ember-uploader';
import Ember from 'ember';
import config from 'subkitchen-front/config/environment';


export default EmberUploader.FileField.extend({
  store: Ember.inject.service(),

  filesDidChange(files) {
    const uploader = EmberUploader.S3Uploader.create({
      signingUrl: config.host + config.apiEndpoint + '/s3_direct'
    });

    uploader.on('didUpload', response => {
      let uploadedUrl = $(response).find('Location')[0].textContent;
      uploadedUrl = decodeURIComponent(uploadedUrl);
      this.get('store').findRecord('user', 'current').then((user) => {
        let attribute = this.get('attribute');
        user.set(attribute, uploadedUrl);
        user.save();
      });
    });

    if (!Ember.isEmpty(files)) {
      uploader.upload(files[0], {});
    }
  }
});
