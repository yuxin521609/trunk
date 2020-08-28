import * as api from '@/api/system'
import * as types from '@/types/codeset'

function getData() {
    var da = localStorage.getItem(types.cache_key_codeset);
    if (da) {
        return JSON.parse(da);
    }
    return da;
}
function setData(data) {
    localStorage.removeItem(types.cache_key_codeset);
    let localVal = {};
    if (data) {
        data.forEach(f => {
            let item = {
                id: f.id,
                // name: f.name,
                nameCn: f.nameCn,
                codeItemList: f.codeItemList.map((m) => {
                    return {
                        parentId:f.id,
                        parentCode:m.parentCode?m.parentCode:null,
                        codeId: m.id,
                        code: m.code,
                        name: m.name,
                        shortName: m.shortName,
                        sort: m.sort,
                        // type: m.type,
                    }
                })
            };
            localVal[f.name] = item;
        });
        localStorage.setItem(types.cache_key_codeset, JSON.stringify(localVal));
    }
    return localVal;
}

const state = {
    [types.STATE_CODES]: getData(),
};

const mutations = {
    [types.FN_SET_DATA](state, data) {
        let val = setData(data);
        state.codes = val;
    }
};

const actions = {
    [types.FN_SET_DATA]({ commit }, data) {
        commit(types.FN_SET_DATA, data);
    },
    async [types.FN_LOAD_DATA]({ commit, dispatch }) {
        let list = await this._vm.request(api.ALL_CODESET_POST, {}, true).catch(err => { console.error("获取重要字典数据失败,为不影响正常使用,请重新登录") });
        commit(types.FN_SET_DATA, list);
    },
    [types.FN_FILTER_DATA]({ state }, key) {
        var curS = state[types.STATE_CODES];
        return curS[key];
    }
};

const getters = {
    [types.GETTER_CODES](state) {
        return state[types.STATE_CODES];
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}