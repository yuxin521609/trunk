export const service = "retail-store-service";

/**
 * { url: SYSTEM + "/xxxxxxx", , form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */
/**
 * 门店管理
 */
// 创建门店
export const storeBasic_save = { url: service + "/storeBasic/save"}
// 获取门店列表
export const storeBasic_list = { url: service + "/storeBasic/list"}
// 获取门店信息
export const storeBasic_get = { url: service + "/storeBasic/get", method: "get"}
// 校验门店名称
export const storeBasic_check = { url: service + "/storeBasic/check", method: "get"}
// 获取创建门店负责人
export const user_listByPhonet = { url: service + "/user/listByPhone", method: "get"}
// 获取门店人员列表
export const user_listByStoreId = { url: service + "/user/listByStoreId"}

// 获取零售门店人员列表
export const retailStoreUser_list = { url: service + "/retailStoreUser/list"}
// 根据用户Id获取零售门店信息
export const retailStoreUser_getStore = { url: service + "/retailStoreUser/getStore"}

/**
 * 门店库存管理
 */
// 获取门店库存列表（父类）
export const storeProduct_listProduct = { url: service + "/storeProduct/listProduct"}
// 获取门店库存列表（子类）
export const storeProduct_listByDeptId = { url: service + "/storeProduct/listByDeptId"}
// 获取门店出入库日志列表
export const storeStockRecords_list = { url: service + "/storeStockRecords/list"}
// 获取品牌列表
export const storeStock_listBrand = { url: service + "/storeStock/listBrand"}

/**
 * 门店订单管理
 */

// 获取门店销售订单列表
export const storeRetailOrder_list = { url: service + "/storeRetailOrder/pcList"}
// 获取门店销售订单统计
export const storeRetailOrder_pcListStatistics = { url: service + "/storeRetailOrder/pcListStatistics"}
// 获取门店销售订单详情
export const storeRetailOrder_getByStoreIdAndOrderNumGroup = { url: service + "/storeRetailOrder/getByStoreIdAndOrderNumGroup"}
// 导出门店销售订单商品详情
export const storeRetailOrder_export = { url: service + "/storeRetailOrder/export"}

// 获取门店退款订单列表
export const storeConsumerRefund_list = { url: service + "/storeConsumerRefund/list"}
// 获取门店退款订单详情
export const storeConsumerRefund_getByRefundOrderNum = { url: service + "/storeConsumerRefund/getByRefundOrderNum", method: "get"}

// 获取门店盘点订单列表
export const checkStockOrder_getListForOrderCenter = { url: service + "/checkStockOrder/getListForOrderCenter"}
// 获取门店盘点订单详情
export const checkStockOrder_getMainInfoForOrderCenter = { url: service + "/checkStockOrder/getMainInfoForOrderCenter"}
// 获取门店盘点商品详情
export const checkStockResultProduct_getProductInfoForOrderCenter = { url: service + "/checkStockResultProduct/getProductInfoForOrderCenter"}

// 获取门店差异订单列表
export const checkDifferenceOrder_list = { url: service + "/checkDifferenceOrder/list"}
// 获取门店差异订单详情
export const checkDifferenceOrder_getMainInfoForOrderCenter = { url: service + "/checkDifferenceOrder/getMainInfoForOrderCenter"}
// 获取门店差异商品详情
export const checkStockVirtualProduct_getProductInfoForOrderCenter = { url: service + "/checkStockVirtualProduct/getProductInfoForOrderCenter"}
/**
 * 门店数据统计
 */

// 获取门店业绩综合查询
export const storePerformance_list = { url: service + "/storePerformance/list"}
// 获取门店数据经营分析
export const storeDataStatistics_getStoreManageDataAnalysis = { url: service + "/storeDataStatistics/getStoreManageDataAnalysis"}

/**
 * 存货商品结构分析
 */
// 根据商品类型统计分类明细（本月）
export const storeDataStatistics_stockCategoryDetailed = { url: service + "/storeDataStatistics/stockCategoryDetailed"}
// 查询存货商品明细数据统计（本月）
export const storeDataStatistics_stockDetailed = { url: service + "/storeDataStatistics/stockDetailed"}
// 查询存货商品汇总数据统计（本月）
export const storeDataStatistics_stockSummary = { url: service + "/storeDataStatistics/stockSummary"}
// 根据商品颜色获取色系明细（本月）
export const storeDataStatistics_stockColorSeriesDetailed = { url: service + "/storeDataStatistics/stockColorSeriesDetailed"}

// 根据商品类型统计分类明细（非本月）
export const historyStoreProduct_stockCategoryDetailed = { url: service + "/historyStoreProduct/stockCategoryDetailed"}
// 查询存货商品汇总数据统计（非本月）
export const historyStoreProduct_stockSummary = { url: service + "/historyStoreProduct/stockSummary"}
// 查询存货商品明细数据统计（非本月）
export const historyStoreProduct_stockDetailed = { url: service + "/historyStoreProduct/stockDetailed"}
// 根据商品颜色获取色系明细（非本月）
export const historyStoreProduct_stockColorSeriesDetailed = { url: service + "/historyStoreProduct/stockColorSeriesDetailed"}
/**
 * 销售商品结构分析
 */
// 销售商品--根据商品类型统计分类明细
export const storeDataStatistics_saleProductGoodsTypeDetailed = { url: service + "/storeDataStatistics/saleProductGoodsTypeDetailed"}
// 查询销售订单列表（分布图）
export const storeDataStatistics_listSaleProductGoods = { url: service + "/storeDataStatistics/listSaleProductGoods"}
// 查询销售订单列表（汇总图）
export const storeDataStatistics_listSaleProductGoodsSum = { url: service + "/storeDataStatistics/listSaleProductGoodsSum"}
// 根据商品颜色获取色系明细
export const storeDataStatistics_saleProductGoodsColorDetailed = { url: service + "/storeDataStatistics/saleProductGoodsColorDetailed"}

/**
 * scb 订单管理
 */
// 调入、调出门店接口列表，调出传入调入ID（SCB）
export const storeBasic_listStoreBasic = { url: service + "/storeBasic/listStoreBasic"}
// 过滤了SCB价格管理已创建的门店（scb-价格管理）
export const storeBasic_listForScbPriceManagement = { url: service + "/storeBasic/listForScbPriceManagement"}