import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import moment from 'moment'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import '@/styles/main.css'
import AuthService from "@/services/auth";
import VueSimpleAlert from "vue-simple-alert";
        
Vue.use(VueSimpleAlert);
Vue.config.productionTip = false
moment.locale('ru');

Vue.filter('formatDisplayDateTime', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY hh:mm')
  }
});

Vue.filter('formatDisplayDateTimeRange', function(value) {
  if (value[0] && value[1]) {
    return moment(value[0]).format('DD/MM/YYYY HH:mm') + ' - ' + moment(value[1]).format('DD/MM/YYYY HH:mm')
  }
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


AuthService.restore_authorization();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
