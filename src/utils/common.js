/*
 * @Description: 公共方法
 * @Author: elephant
 * @Date: 2019-08-15 10:21:30
 * @LastEditTime: 2019-09-25 14:25:52
 * @LastEditors: your name
 */
import * as api from '@/api/product'
/**
 * @Deprecated  公共使用状态
 * @Author elephant
 * @Date 2019/04/29
 * @Time 17:18
 * @Params null
 * @Return Array
 */
const getValidOptions = () => {
    let arr=[{
        status_id:true,
        status_name:'使用中'
    },{
        status_id:false,
        status_name:'未使用'
    }];
    return  arr
}
const getValidLowerOptions = () => {
    let arr=[{
        status_id:true,
        status_name:'上架'
    },{
        status_id:false,
        status_name:'下架'
    }];
    return  arr
}
const cooperationOptions = () => {
    let arr=[{
        status_id:true,
        status_name:'合作中'
    },{
        status_id:false,
        status_name:'未合作'
    }];
    return  arr
}

const usedOptions = () => {
    return  [{ id: 1, name: "启用" }, { id: 0, name: "停用" }]
}
/**
 * @Deprecated  品牌类型
 * @Author elephant
 * @Date 2019/05/13
 * @Time 17:18
 * @Params null
 * @Return  Array
 */
const getGrandType = () => {
    let arr=[{
        id:0,
        name:'自营'
    },{
        id:1,
        name:'加盟'
    }];
    return  arr
}

/**
 * @Deprecated   分类列表ztree结构树
 * @Author elephant
 * @Date 2019/05/20
 * @Time 11:45
 * @Params _this vue 对象
            _type 分类标识  （1：标准分类或商品分类，2：定制分类，3：原料分类或者称为属性分类）
            _disabledIds //禁用ID数组
 * @Return
 */
const getClassSelect = async (_this,_type = 1,_disabledIds)=>{
    let tree;
    let res = await  _this.request(api.categories_list,{parentId:null,type:_type,valid:true},true)
    let _data=res.data;
    if(!!_disabledIds && _disabledIds.length >0){
        for(let i =0;i<_disabledIds.length;i++){
            for(let j = 0; j<_data.length; j++){
                if(_disabledIds[i] == _data[j].id){
                    _data[j].disabled=true;
                    break;
                }
            }
        }
    }
    function toTree(data,parent_id) {
        var ztree = [];
        var temp;
        for (var i = 0; i < data.length; i++) {
            if (data[i].parentId == parent_id) {
                let  obj = data[i];
                temp = toTree(data, data[i].id);
                if (temp.length > 0) {
                obj.children = temp;
                }
                ztree.push(obj);
            }
        }
        return ztree;
    }
    tree= toTree(_data, null);
    return {'ztree':tree,'list':res.data}
};
/**
 * @Deprecated  table 展开隐藏
 * @Author elephant
 * @Date 2019/05/13
 * @Time 17:18
 * @Params  row 当前数据
 listData table数据
 _path 接口地址
 key 接口KEY
 * @Return
 */
const clickGetChildren = (_this,row,listData,_path,_key,_obj) =>{
    //console.log(_key)
    let _id=row.id; //当前数据ID
    let _type =row.isType; //状态 1 关闭 0 打开
    if(_type == "1"){ //当前为关闭状态 需请求接口获取子元素
        row.isType=0;
        getChildData(_this,row,_id,listData,_path,_key,_obj);
    }else{//当前为打开状态 需删除子元素
        row.isType=1;
        removeChildData(row,listData);
    }
};
//获取子集
function getChildData(_this,row,_id,listData,_path,_key,_obj = {}){
    let _index = listData.findIndex((item) =>(item.id == _id));
    if(!row._chilren){
       // console.log(_key)
        _obj[_key]=_id;
        _this.request(_path,_obj).then(res=>{
            let _data=res.data;
            let _dataLen=_data.length;
            for(let i =0 ; i < _dataLen ; i++){
                _data[i]._chilrenName= _data[i].name;
                _data[i].name=null;
            }
           // console.log(res);
            row._chilren=_data;
            //根据下标插入进去 获取ID 在数组中的下标
            listData.splice(_index + 1,0,..._data);
            //获取子集id存入 元素属性
            let arr = [];
            for(let {id} of _data){
                arr.push(id);
            }
            row._cid = arr.join();
        });
    }else{
        listData.splice(_index + 1,0,...row._chilren);
    }

};
//删除子集
function removeChildData(row,listData){
    let cid=row._cid;
    let cidArr=cid.split(',');
    let _table= listData,tableLen=_table.length;
    for(let i = 0; i < cidArr.length; i++){
        for(let j = 0; j < listData.length; j++){
            if(cidArr[i] == listData[j].id){
                listData.splice(j,1);
            }
        }
    }

}
/**
 * @Deprecated  深度复制数组对象 或对象
 * @Author elephant
 * @Date 2019/06/19
 * @Params params 复制的对象或者数组
 * 此复制 可去除get set 追踪
 * @Return
 */
const deepCopy = (params) => {
    var result = Array.isArray(params) ? 'Array' : 'Object';
    switch (result) {
        case 'Array':
            let copy = [];
            for (let i = 0; i < params.length; i++) {
                copy.push(JSON.parse(JSON.stringify(params[i])));
            }
            return copy;
            break;
        case 'Object':
            return JSON.parse(JSON.stringify(params))
            break;
    }

}
const getBillType = (type) => {
    let types;
    switch (type) {
        case 'allot':
            types = [
                {name: '待发货', id: 0},
                {name: '待返货', id: 1},
                {name: '待收货', id: 2},
                {name: '已完成', id: 3},
                {name: '已作废', id: 4},
                {name: '已发货', id: 5},
                {name: '已返货', id: 6},
                {name: '未到货', id: 7},
                {name: '部分到货', id: 8},
                {name: '全部到货', id: 9},
                {name: '异常发货', id: 11},
                {name: '异常完成', id: 12},
                {name: '待编辑', id: 13},
                {name: '强制完成', id: 14}
            ];
          break;
        case 'storeBack':
            types = [
                {name: '待返货', id: 1},
                {name: '已完成', id: 3},
                {name: '已作废', id: 4},
                {name: '已返货', id: 6}
            ];
            break;
        case 'back':
            types = [
                {name: '待返货', id: 1},
                {name: '已完成', id: 3},
                {name: '已作废', id: 4},
                {name: '已返货', id: 6},
                {name: '异常完成', id: 12}
            ];
            break;
        case 'receive':
            types = [
                {name: '待收货', id: 2},
                {name: '已完成', id: 3},
                {name: '已作废', id: 4},
                {name: '强制完成', id: 14}
            ];
            break;
        case 'transferSlip':
            types = [
                {name: '待发货', id: 0},
                {name: '待收货', id: 2},
                {name: '已完成', id: 3},
                {name: '已作废', id: 4},
                {name: '待编辑', id: 13},
                {name: '强制完成', id: 14}
            ];
            break;
    }
    return types

}
export default {
    getValidOptions, //公共使用状态
    clickGetChildren,
    getGrandType,
    cooperationOptions,
    getClassSelect,
    usedOptions,
    getValidLowerOptions,
    deepCopy,
    getBillType
}
