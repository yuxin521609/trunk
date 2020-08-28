
const state = {
  // 所有缓存的页面
  cachedViews: []
};

const getters = {

};

const mutations = {
  CACHED_VIEW_ADD: (state, viewName) => {
    if (state.cachedViews.includes(viewName)) return;
    state.cachedViews.push(viewName)
  },
  CACHED_VIEW_DEL: (state, viewName) => {
    if(state.cachedViews.length){
      for (const item of state.cachedViews) {
        if (item === viewName) {
          const index = state.cachedViews.indexOf(item);
          state.cachedViews.splice(index, 1);
          break
        }
      }
    }
  },
  CACHED_VIEWS_DEL_ALL: state => {
    state.cachedViews = []
  }
};

const actions = {
  // 新增缓存页面
  cachedViewAdd({ commit }, viewName){
    commit('CACHED_VIEW_ADD', viewName)
  },
  // 删除缓存页面
  cachedViewDel({ commit }, viewName) {
    console.log(viewName)
    commit('CACHED_VIEW_DEL', viewName)
  },
  // 删除全部缓存页面
  cachedViewDelAll({ commit }) {
    commit('CACHED_VIEWS_DEL_ALL')
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
