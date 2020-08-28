import Vue from 'vue'
import Vuex from 'vuex'
import ClassSelect from './modules/classSelect'
import user from './modules/user'
import codeSet from './modules/codeSet'
import cachedViews from './modules/cachedViews'
import permission from './modules/permission'
import getters from './getters'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    ClassSelect,
    codeSet,
    user,
    cachedViews,
    permission
  },
  getters
})

export default store
