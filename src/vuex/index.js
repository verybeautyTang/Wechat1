import Vue from 'vue'
import VueX from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(VueX)

export default new VueX.Store({
  state,
  actions,
  mutations,
  getters
})
