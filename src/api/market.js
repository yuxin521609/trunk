export const service = "retail-store-service";
export const marketService = "market-service";
export const operationService = "operation-service";

/**
 * { url: SYSTEM + "/xxxxxxx", , form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */
/**
 * 营销中台
 */
// 海报列表
export const market_list = { url: marketService + "/market/list"}
// 海报详情
export const market_get = { url: marketService + "/market/get", method:"get"}
//获取二维码
export const market_createQRCode = { url: marketService + "/market/createQRCode"}
//保存营销管理实例
export const market_save = { url: marketService + "/market/save"}
//编辑营销管理实例
export const market_updateValid = { url: marketService + "/market/updateValid"}
//删除营销管理实例
export const market_delete = { url: marketService + "/market/delete", method:"delete"}
// 图片上传
export const picture_upload = { url: marketService + "/picture/upload"}

// 获取季节
export const codeItem_list = { url: operationService + "/codeItem/list"}

/**
 * 折扣管理
 */
// 折扣列表
export const marketingMiddleground_discountList = { url: marketService + "/marketingMiddleground/discountList"}

// 新建预约折扣方案
export const marketingMiddleground_createDiscountSetting = { url: marketService + "/marketingMiddleground/createDiscountSetting"}
// 新建阶梯折扣方案
export const marketingMiddleground_createDiscountParameter = { url: marketService + "/marketingMiddleground/createDiscountParameter"}
// 新建单品折扣方案
export const marketingMiddleground_createSingleProductDiscount = { url: marketService + "/marketingMiddleground/createSingleProductDiscount"}

// 更新预约折扣方案
export const marketingMiddleground_updateDiscountSetting = { url: marketService + "/marketingMiddleground/updateDiscountSetting"}
// 更新阶梯折扣方案
export const marketingMiddleground_updateDiscountParameterS = { url: marketService + "/marketingMiddleground/updateDiscountParameterS"}
// 更新单品折扣方案
export const marketingMiddleground_updateSingleProductDiscount = { url: marketService + "/marketingMiddleground/updateSingleProductDiscount"}

// 删除预约折扣方案
export const marketingMiddleground_deleteDiscountSetting = { url: marketService + "/marketingMiddleground/deleteDiscountSetting", method: "delete"}
// 删除阶梯折扣方案
export const marketingMiddleground_deleteDiscountParameterS = { url: marketService + "/marketingMiddleground/deleteDiscountParameterS", method: "delete"}
// 删除单品折扣方案
export const marketingMiddleground_deleteSingleProductDiscount = { url: marketService + "/marketingMiddleground/deleteSingleProductDiscount", method: "delete"}

// 查询预约折扣方案
export const marketingMiddleground_queryDiscountSetting = { url: marketService + "/marketingMiddleground/queryDiscountSetting", method :"get"}
// 查询阶梯折扣方案
export const marketingMiddleground_queryDiscountParameter = { url: marketService + "/marketingMiddleground/queryDiscountParameter", method :"get"}
// 查询单品折扣方案
export const marketingMiddleground_querySingleProductDiscount = { url: marketService + "/marketingMiddleground/querySingleProductDiscount", method :"get"}

// 新建折扣方案检验
export const marketingMiddleground_confirmDiscountByStoreId = { url: marketService + "/marketingMiddleground/confirmDiscountByStoreId", form: true }



// 获取单品折扣已选商品列表
export const marketingMiddleground_listSingleProduct = { url: marketService + "/marketingMiddleground/listSingleProduct"}
// 获取单品折扣全部商品列表
export const marketingMiddleground_listProduct = { url: marketService + "/marketingMiddleground/listProduct"}
// 单品全部添加
export const marketingMiddleground_addPageSingleProduct = { url: marketService + "/marketingMiddleground/addPageSingleProduct"}
// 单品添加
export const marketingMiddleground_addStatelessSingleProduct = { url: marketService + "/marketingMiddleground/addStatelessSingleProduct", form:true}
// 单品从列表内剔除
export const marketingMiddleground_removeInSingleProduct = { url: marketService + "/marketingMiddleground/removeInSingleProduct",  method: "delete"}
// 单品切换到当前折扣
export const marketingMiddleground_addOtherInSingleProduct = { url: marketService + "/marketingMiddleground/addOtherInSingleProduct", form:true}

 
/**
 * @description: 优惠券接口
 * @author:elephat
 * @Date: 2019-10-15 17:19:40
 */
// 优惠券
export const coupon_save = { url: marketService + "/coupon/save"}
export const coupon_list = { url: marketService + "/coupon/list"}
export const coupon_get = { url: marketService + "/coupon/get" , method:"get"}
//获取卡券统计
export const coupon_statistical = { url: marketService + "/coupon/statistical" , method:"get"}



/**
 * 门店装修
 */
// 获取单品折扣已选商品列表
export const storeFitment_listBasicState = { url: marketService + "/storeFitment/listBasicState"}
// 根据门店ID和类型获取门店装修和图片列表实例
export const storeFitment_getByStoreIdAndType = { url: marketService + "/storeFitment/getByStoreIdAndType"}
// 保存门店装修实例
export const storeFitment_save = { url: marketService + "/storeFitment/save"}
// 获取门店列表接口（无权限限制）
export const storeBasic_list4Feign = { url: service + "/storeBasic/list4Feign"}
