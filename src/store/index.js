import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@/store/auth'
import layout from '@/store/layout'
import notification from "@/store/notification";
import scheduledTask from "@/store/scheduledTask";
import task from "@/store/task";
// import LDraw from 'leaflet-draw';
// Vue.use(LDraw);
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {

  },
  getters: {

  },
  modules: {
    auth,
    notification,
    layout,
    scheduledTask,
    task
  }
})
