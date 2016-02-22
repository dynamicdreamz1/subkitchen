import config from 'subkitchen-front/config/environment';
import ActiveModelAdapter from 'active-model-adapter';


export default ActiveModelAdapter.extend({
  host: config.host + '/api/v1'
});
