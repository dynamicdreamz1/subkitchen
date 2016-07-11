/* global $ */
import EmberUploader from 'ember-uploader';
import Ember from 'ember';
import config from 'subkitchen-front/config/environment';


export default EmberUploader.FileField.extend({
  flashMessages: Ember.inject.service(),
  store: Ember.inject.service(),

  filesDidChange(files) {
    const uploader = EmberUploader.S3Uploader.create({
      signingUrl: config.host + config.apiEndpoint + '/s3_direct'
    });

    uploader.on('didUpload', response => {
      let uploadedUrl = $(response).find('Location')[0].textContent;
      let flashMessages = this.get('flashMessages');
      uploadedUrl = decodeURIComponent(uploadedUrl);
      let user = this.get('user');
      let attribute = this.get('attribute');
      let previousUploadedUrl = user.get(attribute);
      user.set(attribute, uploadedUrl);
      user.save().then(() => {
        flashMessages.success("Successfully uploaded image" , { timeout: 10000 });
      }, (error) => {
        user.set(attribute, previousUploadedUrl);
        flashMessages.alert(error.errors[0].detail, { timeout: 10000 });
      });
    });

    if (!Ember.isEmpty(files)) {
      uploader.upload(files[0], {});
    }
  }
});
