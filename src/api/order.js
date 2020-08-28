export const service = "order-service";
export const foreignService = "foreign-service"

/**
 * { url: service + "/xxxxxxx", method: "post", form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */

export const channelSaleOrder_save = { url: service + "/channelSaleOrder/save" }
export const channelSaleOrder_updateBatch = { url: service + "/channelSaleOrder/updateBatch" }
export const channelSaleOrder_list ={url:service+"/channelSaleOrder/list"}
export const channelSaleOrder_Import ={url:service+"/channelSaleOrder/channelSaleOrderImport"}
export const channelSaleOrder_get ={url:service+"/channelSaleOrder/get",method: "get"}
export const channelSaleOrder_cancel ={url:service+"/channelSaleOrder/cancelChannelSaleOrder",method: "delete"}

//新增获取店铺列表
export const orderStore_orderStoreList ={url:service+"/orderStore/orderStoreList"}

/* 采购订单--相关 */
export const channelPurchaseOrder_list ={url:service+"/channelPurchaseOrder/list"}
export const channelPurchaseOrder_get ={url:service+"/channelPurchaseOrder/get",method:"get"}
export const channelPurchaseOrder_getByOrderSn ={url:service+"/channelPurchaseOrder/getByOrderSn",method:"get"}
export const channelPurchaseOrder_save = { url: service + "/channelPurchaseOrder/save"}
export const channelPurchaseOrder_logicDelete = { url: service + "/channelPurchaseOrder/logicDelete",method: "delete"}
export const channelPurchaseArrivalOrder_goods = { url: service + "/channelPurchaseOrder/goodsByOrderSn", method: "get"}
export const channelPurchaseOrder_updatePurchaseOrderStatus = { url: service + "/channelPurchaseOrder/updatePurchaseOrderStatus", method: "get"}
export const channelPurchaseOrder_importPurchaseOrder = { url: service + "/channelPurchaseOrder/importPurchaseOrder"}


export const channelPurchaseArrivalOrder_list = { url: service + "/channelPurchaseArrivalOrder/list"}
export const channelPurchaseArrivalOrder_orderSnList = { url: service + "/channelPurchaseOrder/orderSnList",method:"get"}
export const channelPurchaseArrivalOrder_insert = { url: service + "/channelPurchaseArrivalOrder/insert"}
export const channelPurchaseArrivalOrder_syncChannelArrivalOrder = { url: service + "/channelPurchaseArrivalOrder/syncChannelArrivalOrder"}
export const channelPurchaseArrivalOrder_get = { url: service + "/channelPurchaseArrivalOrder/getByArrivalSn",method:"get"}
export const channelPurchaseArrivalOrder_obsoleteByArrivalSn = { url: service + "/channelPurchaseArrivalOrder/obsoleteByArrivalSn",method:"delete"}
export const channelPurchaseWarehouseOrder_list = { url: service + "/channelPurchaseWarehouseOrder/list"}
export const channelPurchaseWarehouseOrder_get = { url: service + "/channelPurchaseWarehouseOrder/get",method:'get'}


/* 量体预约订单--相关 */
export const consumerReservationOrder_list = {url:service+"/consumerReservationOrder/list"}
export const consumerReservationOrder_get = {url:service+"/consumerReservationOrder/get", method:"get"}
export const consumerReservationOrder_logicDelete = {url:service+"/consumerReservationOrder/logicDelete", method: "delete"}
/* 预约单取消 */
export const obsoleteReservationOrderBy_logicDelete = {url:service+"/consumerReservationOrder/obsoleteReservationOrderByOrderSn", method: "delete"}
/* 定制订单--相关 */
export const consumerCustomizedOrder_list = {url:service+"/consumerCustomizedOrder/list"}
export const consumerCustomizedOrder_get = {url:service+"/consumerCustomizedOrder/get", method:"get"}
export const consumerCustomizedOrder_logicDelete = {url:service+"/consumerCustomizedOrder/logicDelete", method: "delete"}
/*工单处理项，量体信息 */
export const reservationOrderMeasurement_getDataByReservationOrderId = {url:service+"/reservationOrderMeasurement/getDataByReservationOrderId"}

/*渠道退货单-列表*/
export const channelRefundOrder_list = {url:service+"/channelRefundOrder/list"}
//渠道退货-作废
export const returnGoods_obsoleteByRefundSn ={url: service + "/channelRefundOrder/obsoleteByRefundSn",method:'get'};
/*渠道退货单-新增*/
export const channelRefundOrder_save = {url:service+"/channelRefundOrder/save"}
/*渠道退货单-查看*/
export const channelRefundOrder_getRefundByRefundSn = {url:service+"/channelRefundOrder/getRefundByRefundSn",method:'get'}
// 渠道退货-订单号联想
export const channelSaleOrder_getChannelListForRefundOrder = {url:service+"/channelSaleOrder/getChannelListForRefundOrder"}
/*获取所有快递公司代码 */
export const expressCompany_list = {url:foreignService+"/expressCompany/list"}
//采购退货-列表
export const channelRetundOrder_list = {url:service+"/channelReturnOrder/list"}
//采购退货-作废
export const channelReturnOrder_obsoleteByReturnSn = {url:service+"/channelReturnOrder/obsoleteByReturnSn",method:'delete'}
//采购退货单-新增
export const channelRetundOrder_insert = {url:service+"/channelReturnOrder/insert"}
//采购退货单-查看详情
export const channelRetundOrder_getByReturnSn = {url:service+"/channelReturnOrder/getByReturnSn",method:'get'}
//出入库汇总-入库列表
export const warehouseStorageOrder_list = {url:service+"/warehouseStorageOrder/list"}
//出入库汇总-入库单详情
export const warehouseStorageOrder_getByWarehouseSn = {url:service+"/warehouseStorageOrder/getByWarehouseSn",method:'get'}
//出入库汇总-入库详情商品流水号
export const warehouseStorageOrder_serialNumberListByWarehouseSnAndProductGoodsCode = {url:service+"/warehouseStorageOrder/serialNumberListByWarehouseSnAndProductGoodsCode",method:'get'}
//出入库汇总-出库列表
export const warehouseOutOrder_list = {url:service+"/warehouseOutOrder/list"}
//出入库汇总-出库单详情
export const warehouseOutOrder_getByWarehouseSn = {url:service+"/warehouseOutOrder/getByWarehouseSn",method:'get'}
//出入库汇总-出库详情商品流水号
export const warehouseOutOrder_serialNumberListByWarehouseSnAndProductGoodsCode = {url:service+"/warehouseOutOrder/serialNumberListByWarehouseSnAndProductGoodsCode",method:'get'}

/**
 * 门店返货
 */
// 获取返货列表
export const returnGoods_list ={url: service + "/returnGoods/list"};
// 新增返货
export const returnGoods_save ={url: service + "/returnGoods/save"};
// 作废返货单
export const returnGoods_cancel ={url: service + "/returnGoods/cancel"};
// 获取返货单详情
export const returnGoods_get ={url: service + "/returnGoods/get", method: "get"};
// 获取返货单商品详情
export const returnProductInfo_list ={url: service + "/returnProductInfo/list"};

/**
 * 门店配货
 */
// 获取配货列表
export const allotGoods_list ={url: service + "/allotGoods/list"};
// 新增配货
export const allotGoods_save ={url: service + "/allotGoods/save"};
// 作废配货单
export const allotGoods_cancel ={url: service + "/allotGoods/cancel", method: "get"};
// 获取配货单详情
export const allotGoods_get ={url: service + "/allotGoods/get", method: "get"};
// 获取配货单商品详情
export const allotProductInfo_list ={url: service + "/allotProductInfo/list"};

/**
 * 门店调拨
 */
// 获取调拨单列表
export const storeAllotGoodsOrder_list ={url: service + "/storeAllotGoodsOrder/list"};
// 保存调拨单实例
export const storeAllotGoodsOrder_save ={url: service + "/storeAllotGoodsOrder/save"};
// 获取调拨单详情
export const storeAllotGoodsOrder_get ={url: service + "/storeAllotGoodsOrder/get", method: "get"};
// 作废调拨单
export const storeAllotGoodsOrder_cancel ={url: service + "/storeAllotGoodsOrder/cancel", method: "get"};
// 获取调拨单商品详情
export const storeAllotOrderProductInfo_list ={url: service + "/storeAllotOrderProductInfo/list"};
// 备注
export const storeAllotGoodsOrder_insertRemarks ={url: service + "/storeAllotGoodsOrder/insertRemarks"};
// 强制完成
export const storeAllotGoodsOrder_enforcementFinished ={url: service + "/storeAllotGoodsOrder/enforcementFinished", method: "get"};

// 获取调拨单列表（SCB）
export const storeAllotGoodsOrder_recallList = { url: service + "/storeAllotGoodsOrder/recallList"};
// 调拨单强制完成
export const storeAllotGoodsOrder_forcedEnd = { url: service + "/storeAllotGoodsOrder/forcedEnd"};
// 保存调拨单实例（SCB）
export const storeAllotGoodsOrder_keep ={url: service + "/storeAllotGoodsOrder/keep"};
// 作废调拨单
export const storeAllotGoodsOrder_invalid ={url: service + "/storeAllotGoodsOrder/invalid", method: "get"};
// 保存返货单实例(SCB接口)
export const returnGoods_keep ={url: service + "/returnGoods/keep"};
// 获取退货单列表
export const backGoods_returnsList ={url: service + "/backGoods/returnsList"};
// 退货单作废
export const returnGoods_invalid ={url: service + "/returnGoods/invalid", method: "get"};

// 获取退货单列表 (scb)
export const returnGoods_returnsList ={url: service + "/returnGoods/returnsList"};


