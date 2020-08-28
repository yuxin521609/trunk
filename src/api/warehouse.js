export const service = "configuration-service";
/*
 * 仓配调度中心 
 */
//根据code得到订单来源或订单状态 code 01 订单状态 02 订单来源 --订单中心
export const warehouseBase_configurationDictionaryByCode ={url: service + "/api/base/configuration/configurationDictionaryByCode",method: "get"};
// 列表数据
export const warehouseBase_list ={url: service + "/api/business/externalOrder/list"};
// 点击当前行进行展开数据的接口
export const warehouseBase_getByParentOrderSn ={url: service + "/api/business/externalOrder/getByParentOrderSn",method: "get"};
// 查看-主单
export const warehouseBase_getByOrderSn ={url: service + "/api/business/externalOrder/getByOrderSn",method: "get"};

//发货单列表
export const warehouseBase_deliveryOrder_list ={url: service + "/api/business/deliveryOrder/list"};
//发货单-新增
export const warehouseBase_deliveryOrder_insert ={url: service + "/api/business/deliveryOrder/insert"};


//发货单-子单-查看
export const warehouseBase_deliveryOrder_getByOrderSn ={url: service + "/api/business/deliveryOrder/getByOrderSn",method: "get"};

//收货单列表 
export const warehouseBase_receiveOrder_list ={url: service + "/api/business/receiveOrder/list"};
//收货查看详情 
export const warehouseBase_receiveOrder_getByOrderSn ={url: service + "/api/business/receiveOrder/getByOrderSn",method: "get"};
//收货单-新增
export const warehouseBase_receiveOrder_insert ={url: service + "/api/business/receiveOrder/insert"};


//仓库管理列表
export const warehouseBase_warehouse_list = {url: service + "/api/base/configuration/warehouse/list"};
//新增保存
export const warehouseBase_warehouse_save = {url: service + "/api/base/configuration/warehouse/save"};
//根据主键ID得到对应的数据
export const warehouseBase_warehouse_getByPrimary = {url: service + "/api/base/configuration/warehouse/getByPrimary",method: "get"};

//仓库管控路由接口
export const warehouseBase_extApplication_list = {url: service + "/api/base/configuration/extApplication/list"};


//货主管理列表 
export const warehouseBase_goodsOwner_list = {url: service + "/api/base/configuration/goodsOwner/list"};
//货主管理新增 
export const warehouseBase_goodsOwner_save = {url: service + "/api/base/configuration/goodsOwner/save"};
//货主管理修改 
export const warehouseBase_goodsOwner_getByPrimary = {url: service + "/api/base/configuration/goodsOwner/getByPrimary", method:"get"};
//货主管理(启用 | 停用)
export const warehouseBase_goodsOwner_updateValid = {url: service + "/api/base/configuration/goodsOwner/updateValid"};

//合作承运商
export const warehouseBase_logistics_list = {url: service + "/api/base/configuration/logistics/list"};
//承运商数据
export const warehouseBase_configuration_configurationDictionaryByCode = {url: service + "/api/base/configuration/configurationDictionaryByCode",method: "get"};
// 新增成运商保存
export const warehouseBase_configuration_save = {url: service + "/api/base/configuration/logistics/save"};
//修改承运商
export const warehouseBase_configuration_getByPrimary = {url: service + "/api/base/configuration/logistics/getByPrimary",method: "get"};
//批量更新(启用 | 停用)
export const warehouseBase_configuration_updateValid = {url: service + "/api/base/configuration/logistics/updateValid"};

//中心库存查询
export const warehouseBase_inventory_list = {url: service + "/api/business/statistics/inventory/list"};

// scb仓库列表
export const warehouse_list = {url: service + "/api/base/configuration/warehouse/list"};


//获取子集
export const warehouseBase_inventory_getProductGoodsInventoryByProductCode = {url: service + "/api/business/statistics/inventory/getProductGoodsInventoryByProductCode"};

//对账管理库存 
//同步库存
export const warehouseBase_inventory_synchronizeInventory = {url: service + "/api/business/statistics/inventory/synchronizeInventory",form: true};

