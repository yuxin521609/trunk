export const service = "scb-service";

/**
 * { url: SYSTEM + "/xxxxxxx", , form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */

/**
 * 商品管理
 */
// 商品中心列表-去添加商品进SCB
export const merchantProduct_productServiceList = { url: service + "/merchantProduct/productServiceList" }
// 添加商品中心商品到商户-默认上架
export const merchantProduct_addProductToMerchant = { url: service + "/merchantProduct/addProductToMerchant" }
// 删除商户商品-通过商户ID和款号
export const merchantProduct_deleteProductFromMerchant = { url: service + "/merchantProduct/deleteProductFromMerchant" }
// 添加本页商品中心商品到商户
export const merchantProduct_addPageProductToMerchant = { url: service + "/merchantProduct/addPageProductToMerchant" }
// 已添加商品（SCB列表）
export const merchantProduct_scbServiceList = { url: service + "/merchantProduct/scbServiceList" }
// 上下架商户SPU商品-商户ID、款号
export const merchantProduct_onSaleOrOffSaleSPU = { url: service + "/merchantProduct/onSaleOrOffSaleSPU" }
// 获取商品详情
export const merchantProduct_productDetail = { url: service + "/merchantProduct/productDetail" }
// 获取商品详情 SKU上下架
export const merchantProduct_onSaleOrOffSaleSKU = { url: service + "/merchantProduct/onSaleOrOffSaleSKU" }
// 商品详情-修改保存
export const merchantProduct_saveProductDetail = { url: service + "/merchantProduct/saveProductDetail" }
// 添加商品到某商户分类下
export const merchantProduct_addPageProductToMerchantCategories = { url: service + "/merchantProduct/addPageProductToMerchantCategories" }
// 转移本页商品至商户某些分类下
export const merchantProduct_transferPageProductToMerchantCategories = { url: service + "/merchantProduct/transferPageProductToMerchantCategories" }
// 批量上下架
export const merchantProduct_batchOnSaleOrOffSaleSPU = { url: service + "/merchantProduct/batchOnSaleOrOffSaleSPU" }
// 批量删除
export const merchantProduct_deleteBatchProductFromMerchant = { url: service + "/merchantProduct/deleteBatchProductFromMerchant" }


/**
 * 价格管理
 */
// 获取采购商价格管理列表
export const purchasingAgentPriceManagement_list = { url: service + "/purchasingAgentPriceManagement/list" }
// 根据ID获取采购商价格管理实例
export const purchasingAgentPriceManagement_getById = { url: service + "/purchasingAgentPriceManagement/getById", method: "get" }
// 更新采购商价格管理实例有效状态
export const purchasingAgentPriceManagement_updateValid = { url: service + "/purchasingAgentPriceManagement/updateValid" }
// 插入或更新指定商品折扣的折扣值
export const purchasingAgentDiscount_save = { url: service + "/purchasingAgentDiscount/save" }
// 获取指定商品折扣列表
export const purchasingAgentDiscount_list = { url: service + "/purchasingAgentDiscount/list" }
// 创建价格管理接口
export const purchasingAgentPriceManagement_save = { url: service + "/purchasingAgentPriceManagement/save" }
// 添加SCB商品到商品折扣下
export const purchasingAgentProduct_scbProductToProductDiscount = { url: service + "/purchasingAgentProduct/scbProductToProductDiscount" }
// 添加SPU商品到此折扣下
export const purchasingAgentDiscount_addSPUToDiscount = { url: service + "/purchasingAgentDiscount/addSPUToDiscount" }
// 删除此折扣下SPU商品
export const purchasingAgentDiscount_deleteSPUFromDiscount = { url: service + "/purchasingAgentDiscount/deleteSPUFromDiscount" }
// 从其他折扣转移到当前折扣下
export const purchasingAgentDiscount_transferSPU = { url: service + "/purchasingAgentDiscount/transferSPU" }
// 已添加折扣商品
export const purchasingAgentProduct_productDiscountProductList = { url: service + "/purchasingAgentProduct/productDiscountProductList" }

// 获取折扣详情
export const purchasingAgentDiscount_get = { url: service + "/purchasingAgentDiscount/get", method: "get" }


/**
 * 分类管理
 */
// 创建分类所用-分类下拉（一二级）
export const categories_categoriesTreeList = { url: service + "/categories/categoriesTreeList" };
// 创建商户商品分类实例
export const categories_create = { url: service + "/categories/create" };
// 更新商户商品分类实例
export const categories_updateSelective = { url: service + "/categories/updateSelective" };
// 获取分类树结构
export const categories_getListDTO = { url: service + "/categories/getListDTO" };
// 删除分类 
export const categories_recursionDelete = { url: service + "/categories/recursionDelete", method: "delete"  };
// 分类树结构拖拽同级排序
export const categories_sort = { url: service + "/categories/sort"};
// 检索商品所用分类下拉
export const categories_getPullDownCategoriesList = { url: service + "/categories/getPullDownCategoriesList"};




 /**
  * 调货单
  */
// 获取返货单已选商品列表（为了获取调入结算单价）
export const settleQuery_findSettle = { url: service + "/settleQuery/findSettle" };
// 获取商品sku
export const movingAveragePrice_selectAllocateProduct = { url: service + "/movingAveragePrice/selectAllocateProduct" };
// 获取调出单列表
export const allocateOutOrder_list = { url: service + "/allocateOutOrder/list" };
// 根据ID获取调出单实例
export const allocateOutOrder_get = { url: service + "/allocateOutOrder/get", method: "get" };
// 根据ID获取调出商品记录明细表实例
export const allocateOutOrderProductInfo_list = { url: service + "/allocateOutOrderProductInfo/list"};
// 导入商品 -- (调货)
export const settleQuery_importOrderItem = { url: service + "/settleQuery/importOrderItem"};
// 导入商品 -- （退返货）
export const settleQuery_importExcel = { url: service + "/settleQuery/importExcel"};
/**
 * 返货单
 */
// 获取返货单列表
export const backGoods_list = { url: service + "/backGoods/list" };
// 根据ID获取返货单实例
export const backGoods_get = { url: service + "/backGoods/get", method: "get" };
// 获取返货商品详情列表
export const backProductInfo_list = { url: service + "/backProductInfo/list" };
// 作废返货单
export const backGoods_invalid = { url: service + "/backGoods/invalid" };


/**
 * 收货单
 */
// 获取收货单列表
export const receiveGoods_list = { url: service + "/receiveGoods/list" };
// 获取收货单（主单-废弃）
export const receiveGoods_get = { url: service + "/receiveGoods/get", method: "get"  };
// 获取收货单（主单）
export const receiveGoods_getByReceiveNum = { url: service + "/receiveGoods/getByReceiveNum", method: "get"  };
// 获取收货单商品（子单）
export const receiveProductInfo_list = { url: service + "/receiveProductInfo/list" };
// 获取收货单商品强制完成
export const receiveGoods_forcedCompletion = { url: service + "/receiveGoods/forcedCompletion" };

/**
 * 销售订单
 */
// 销售订单列表
export const purchaseOrder_list = { url: service + "/purchaseOrder/list" };
// 获取进货单详情DTO
export const purchaseOrder_getModifyDTOByOrderId = { url: service + "/purchaseOrder/getModifyDTOByOrderId", method: "get" };
// 销售订单详情商品列表
export const purchaseOrderProduct_listPage = { url: service + "/purchaseOrderProduct/listPage" };
// 审核通过
export const purchaseOrder_checkToPass = { url: service + "/purchaseOrder/checkToPass" };
// 作废
export const purchaseOrder_cancel = { url: service + "/purchaseOrder/cancel",};
// 强制完成
export const purchaseOrder_forceTermination = { url: service + "/purchaseOrder/forceTermination",};
// 新增配货获取商品列表接口
export const purchaseOrder_allocateCargoProductList = { url: service + "/purchaseOrder/allocateCargoProductList" };
// 新增配货页面-点击SPU商品查询SKU集合的接口
export const purchaseOrder_allocateCargoProductGoodsList = { url: service + "/purchaseOrder/allocateCargoProductGoodsList" };
// 存草稿-待编辑
export const purchaseOrder_saveDraft = { url: service + "/purchaseOrder/saveDraft" };
// 确认配货
export const purchaseOrder_allocateCargo = { url: service + "/purchaseOrder/allocateCargo" };
// 确认配货 -（修改）
export const purchaseOrder_modification = { url: service + "/purchaseOrder/modification" };
// 根据id获取销售订单详情
export const purchaseOrder_getDTOByOrderId = { url: service + "/purchaseOrder/getDTOByOrderId", method: "get" };
// 导入商品数据
export const purchaseOrder_importProductItem = { url: service + "/purchaseOrder/importProductItem" };



/**
 * 库存商品分析
 */
// 商品收发明细（买家）table列表
export const receiveShippingDetails_list = { url: service + "/receiveShippingDetails/list" };
// 商品收发明细（买家）数据统计
export const receiveShippingDetails_findStatisticsByMerchantId = { url: service + "/receiveShippingDetails/findStatisticsByMerchantId" };
// 库存出入明细（卖家）table列表
export const stockRecords_list = { url: service + "/stockRecords/list" };
// 库存出入明细（卖家）数据统计
export const stockRecords_findStatisticsByMerchantId = { url: service + "/stockRecords/findStatisticsByMerchantId" };



/**
 * 采货管理
 */
// 采购订单
export const purchaseOrder_purchaseList = { url: service + "/purchaseOrder/purchaseList" };
// 采购订单详情
export const purchaseOrder_getPurchaseDTOByOrderId = { url: service + "/purchaseOrder/getPurchaseDTOByOrderId", method: "get" };


/**
 * 渠道管理
 */
// 获取渠道核销结算列表
export const channelWriteOffSettle_list = { url: service + "/channelWriteOffSettle/list" };
// 获取渠道核销结算get
export const channelWriteOffSettle_get = { url: service + "/channelWriteOffSettle/get", method: "get" };
// 获取结算单列表
export const channelBill_list = { url: service + "/channelBill/list" };
// 获取未结算单列表
export const movingAveragePrice_datalist = { url: service + "/movingAveragePrice/dataList" };
// 获取渠道收发商品记录列表（查看核销商品）
export const channelSendReceiveRecord_list = { url: service + "/channelSendReceiveRecord/list" };
// 获取渠道收发商品记录列表
export const channelSendReceiveRecord_dataList = { url: service + "/channelSendReceiveRecord/dataList" };
// 确认核销
export const channelWriteOffSettle_writeOff = { url: service + "/channelWriteOffSettle/writeOff" };
// 点击结算
export const channelWriteOffSettle_settlement = { url: service + "/channelWriteOffSettle/settlement" };

// 结算核销sku列表
export const movingAveragePrice_productList = { url: service + "/movingAveragePrice/writeOffList" };
// 渠道结算-查看供货明细
export const movingAveragePrice_writeOffDetailsList = { url: service + "/movingAveragePrice/writeOffDetailsList" };
// 渠道结算-撤销核销
export const channelWriteOffSettle_revoke = { url: service + "/channelWriteOffSettle/revoke" };