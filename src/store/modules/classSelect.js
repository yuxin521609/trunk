import * as api from '@/api/product'
function getData() {
    var da = localStorage.getItem('classSelect');
    if (da) {
        return JSON.parse(da);
    }
    return da;
}
function setClassZtree(res){
    localStorage.removeItem('classSelect');
    let _data=res.data;
     // console.log(res)
    function toTree(data,parent_id) {
        var tree = [];
        var temp;
        for (var i = 0; i < data.length; i++) {
            if (data[i].parentId == parent_id) {
                var obj = data[i];
                temp = toTree(data, data[i].id);
                if (temp.length > 0) {
                obj.children = temp;
                }
                tree.push(obj);
            }
        }
        return tree;
    }
    
    var tree;
    tree = toTree(_data, null);
    localStorage.setItem('classSelect', JSON.stringify(tree));
    return tree
}
const ClassSelect = {
    state:{
        classData:getData(), //class 数据
    },
    mutations: {
        SET_CLASS : (state,payload) => {
            state.classData = setClassZtree(payload)
        }
    },
    actions: {
        async  GET_CATEGORIES (context,payload){
            await this._vm.request(api.categories_list,{parentId:null},true)
            .then(res=>{
                context.commit('SET_CLASS',res);
            })
        }
    }
}
export default ClassSelect