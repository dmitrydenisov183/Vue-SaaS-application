import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import * as BaseComponents from '@/components/base'
import '@mdi/font/css/materialdesignicons.css'
// @ts-ignore
import VueDrift from 'vue-drift'

Vue.use(VueDrift, {
  appId: process.env.VUE_APP_BASE_DRIFT_APP_ID
})

Vue.use(Vuetify)

Vue.config.productionTip = false

export const EventBus = new Vue({})

Object.entries(BaseComponents).forEach(([name, component]) => Vue.component(name, component))

new Vue({
  router,
  vuetify: new Vuetify({}),
  render: h => h(App)
}).$mount('#app')
