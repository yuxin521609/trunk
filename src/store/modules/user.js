import { getToken, setToken, removeToken } from '@/utils/auth'
import * as types from '@/types/userConfig'
import * as api from '@/api/user'

const user = {
  state: {
    [types.STATE_Token]: getToken(),
    [types.STATE_Info]: {}
  },
  getters: {
    [types.GETTER_USERINFO](state) {
      return state[types.STATE_Info];
    }
  },
  mutations: {
    [types.FN_SET_TOKEN]: (state, token) => {
      setToken(token);
      state[types.STATE_Token] = token
    },
    [types.FN_REMOVE_TOKEN]: (state) => {
      removeToken();
      state[types.STATE_Token] = getToken();
    },
    [types.FN_SET_USERINFO]: (state, data) => {
      state[types.STATE_Info] = data;
    }
  },
  actions: {
    // 登录
    async [types.FN_GET_USERINFO]({ commit, state }) {
      let info = await this._vm.request(api.get_userinfo, {}, true);
      commit(types.FN_SET_USERINFO, info);
    },
    [types.FN_LOGOUT]({ commit }) {
      commit(types.FN_REMOVE_TOKEN);
    }
  }
}

export default user
