import config from 'subkitchen-front/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ActiveModelAdapter from 'active-model-adapter';

export default ActiveModelAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:custom',
  host: config.host + config.apiEndpoint
});
