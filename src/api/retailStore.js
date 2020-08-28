export const service = "retail-store-service";

/**
 * { url: service + "/xxxxxxx", method: "post", form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */
/**
 * public
 */
// 获取门店列表
export const storeBasic_listSmart ={url: service + "/storeBasic/listSmart"};
// 获取门店详情
export const storeBasic_get ={url: service + "/storeBasic/get", method: "get"};
// 获取门店列表(新增)
export const storeBasic_listByOrganizationId ={url: service + "/storeBasic/listByOrganizationId",method: "get"};


/**
 * 门店其他单据中返货接口
 */
// 获取返货列表
export const backGoods_list ={url: service + "/backGoods/list"};
// 获取返货单详情
export const backGoods_get ={url: service + "/backGoods/get", method: "get"};
// 获取返货单商品详情
export const backProductInfo_list ={url: service + "/backProductInfo/list"};


/**
 * 返货单商品接口
 */
// 门店选择商品主列表
export const storeStock_list ={url: service + "/storeStock/list"};
// 门店选择商品子列表
export const storeProduct_list ={url: service + "/storeProduct/list"};
// 获取热门销售标签
export const storeProduct_listTagByStoreId ={url: service + "/storeProduct/listTagByStoreId"};
/**
 * 门店收货
 */
// 获取收货单列表
export const receiveGoods_list ={url: service + "/receiveGoods/list"};
// 获取收货单详情
export const receiveGoods_get ={url: service + "/receiveGoods/get", method: "get"};
// 获取收货单商品详情
export const receiveProductInfo_get ={url: service + "/receiveProductInfo/list"};


/**
 * 获取退款单接口
 */
// 获取退款单列表
export const storeConsumerRefundMoney_list ={url: service + "/storeConsumerRefundMoney/list"};
// 根据Id获得退款单实例
export const storeConsumerRefundMoney_get ={url: service + "/storeConsumerRefundMoney/get",method: "get"};
// 退款
export const storeConsumerRefundMoney_againRefundMoney ={url: service + "/storeConsumerRefundMoney/againRefundMoney"};
//银行卡-退款·添加备注
export const storeConsumerRefundMoney_updateStoreConsumerRefundMoney ={url: service + "/storeConsumerRefundMoney/updateStoreConsumerRefundMoney"};
//退款单日志
export const storeConsumerRefundMoneyLog_listByRefundMoneyOrderId ={url: service + "/storeConsumerRefundMoneyLog/listByRefundMoneyOrderId"};
// 代销货款-新增-选择门店(直属加关联机构)
export const storeBasic_listSelect ={url: service + "/storeBasic/listSelect"};

/**
 * 门店调拨
 */
// 根据组织机构获取门店列表(发货门店) 及  代销货款-新增-选择门店(直属机构)
export const storeBasic_listBase ={url: service + "/storeBasic/listBase"};
// 导入商品
export const storeProduct_importOrderItem ={url: service + "/storeProduct/importOrderItem"};
// 根据门店id获取商品spu列表
export const storeStock_selectProduct ={url: service + "/storeStock/selectProduct"};
// 根据门店id和SPU获取sku列表
export const storeProduct_selectGoods ={url: service + "/storeProduct/selectGoods"};


/**
 * 门店调出单
 */
// 获取调出单列表
export const storeAllocateOutOrder_list ={url: service + "/storeAllocateOutOrder/list"};
// 根据ID获取调出单实例
export const storeAllocateOutOrder_get ={url: service + "/storeAllocateOutOrder/get", method: "get"};
// 获取调拨单商品详情列表
export const storeAllocateOutOrderProductInfo_list ={url: service + "/storeAllocateOutOrderProductInfo/list"};

/**
 * @description: 卡券调用适用门店列表接口
 * @author: elephant
 * @Date: 2019-10-17 14:46:18
 */
export const storeBasic_list4Feign ={url: service + "/storeBasic/list4Feign"};
