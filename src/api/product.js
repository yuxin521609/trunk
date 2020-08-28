/*
 * @Description: 商品中心 API
 * @Author: elephant
 * @Date: 2019-07-04 09:47:44
 * @LastEditTime: 2020-03-31 15:39:22
 * @LastEditors: Please set LastEditors
 */
export const service = "product-service";

/**
 * { url: service + "/xxxxxxx", method: "post", form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */
/* 公共接口地址 */
/* 品牌列表接口 */
export const productBrand_list = { url: service + "/productBrand/list" }
export const productBrand_save = { url: service + "/productBrand/save" }
/* 分类列表接口  属性分类 商品分类  定制分类共接口 分类类型 TODO type:（1：标准分类，2：定制分类，3：原料分类或者称为属性分类）  */
export const categories_list = { url: service + "/categories/list" }
export const categories_get = { url: service + "/categories/get", method: "get" }
export const categories_save = { url: service + "/categories/save" }

/*库存信息*/
export const listProductStock = { url: service + "/productGoodsStock/listProductStock" }
/* 库存信息子集 */
export const listProductGoodsStock = { url: service + "/productGoodsStock/listProductGoodsStock" }

/* 规格列表 */
export const productSpecifications_save = { url: service + "/productSpecifications/save" }
export const productSpecifications_list = { url: service + "/productSpecifications/list" }
export const productSpecifications_get = { url: service + "/productSpecifications/get", method: "get" }
/* 规格子集 */
export const productSpecificationsAttribute_list = { url: service + "/productSpecificationsAttribute/list" }
/*基本信息列表 */
export const productInformation_save = { url: service + "/productInformation/save" }
export const productInformation_list = { url: service + "/productInformation/list" }
export const productInformation_get = { url: service + "/productInformation/get", method: "get" }

/*基本信息子集 */
export const productInformationAttribute_list = { url: service + "/productInformationAttribute/list" }
export const product_verificationRepeat = { url: service + "/product/verificationRepeat" }

/* 商品颜色维护 */
export const colorSeries_save = { url: service + "/colorSeries/save" }
export const colorSeries_list = { url: service + "/colorSeries/list" }
export const colorSeries_delete = { url: service + "/colorSeries/delete", method: "delete" }
export const colorSeries_get = { url: service + "/colorSeries/get", method: "get" }

export const color_save = { url: service + "/color/save" }
export const color_list = { url: service + "/color/list" }
export const color_delete = { url: service + "/color/delete", method: "delete" }
export const color_get = { url: service + "/color/get", method: "get" }

/* 佀传超接口 */
/* 全部商品列表 */
export const product_listAvailableQuantityForProduct = { url: service + "/product/listAvailableQuantityForProduct" }
/* table商品列表 */
export const productGoods_listAvailableQuantityForProductGoods = { url: service + "/productGoods/listAvailableQuantityForProductGoods" }
/* 新增品牌接口 */
export const productBrand_listForCate = { url: service + "/productBrand/listForCate" }
/* 仓库路由中心下--发货单添加商品接口 */
export const productGoods_listProductGoods4Wms = { url: service + "/productGoods/listProductGoods4Wms" }

/* elephant接口 */
/* --------商品部分------------------------------------------------------------------- */
export const product_listProduct = { url: service + "/product/listProduct" } //商品列表
export const product_save = { url: service + "/product/save" } //商品保存
export const product_get = { url: service + "/product/get", method: "get" } //商品获取
export const productGoods_listProductGoods = { url: service + "/productGoods/listProductGoods" } //商品子集
// 商品数据包导出
export const productDataPackage_export_csv = { url: service + "/productDataPackage/export/csv" } //

// 分享使用
export const product_list = { url: service + "/product/list" } //商品列表
//执行标准
export const performanceStandard_list = { url: service + "/performanceStandard/list" }
//安全类别
export const safetyGrade_list = { url: service + "/safetyGrade/list" }

/** 商品打印接口 */
// 根据产品（SPU）列表获取货品（SKU）列表信息
export const productGoods_list = { url: service + "/productGoods/list" }
// 生成货品（SKU）流水号
export const productGoodsSn_createSns = { url: service + "/productGoodsSn/createSns" }
// 批量更新流水打印状态
export const productGoodsSn_printed = { url: service + "/productGoodsSn/printed" }
// 批量更新流水确认状态
export const productGoodsSn_confirmed = { url: service + "/productGoodsSn/confirmed" }

// 商品列表导出分享
export const productShare_share = { url: service + "/productShare/share" }
// 分享列表
export const productItemShare_list = { url: service + "/productShare/listItemByIdentifier" }


//SN码打印记录
export const productGoodsSn_list = { url: service + "/productGoodsSn/list" }
//SN码 导出流水号打印记录
export const productGoodsSn_export = { url: service + "/productGoodsSn/export" }
//SN码 重新打印
export const productGoodsSn_reprintSns = { url: service + "/productGoodsSn/reprintSns" }

/* 供应商 */
/**原供应商  新需求 分成设计商和制造商  设计商属于上  制造商属于制造商 */
export const supplier_save = { url: service + "/supplier/save" }
export const supplier_list = { url: service + "/supplier/list" }
export const supplier_get = { url: service + "/supplier/get", method: "get" } //供应商获取
//制造商
export const manufacturer_save = { url: service + "/manufacturer/save" }
export const manufacturer_list = { url: service + "/manufacturer/list" }
export const manufacturer_get = { url: service + "/manufacturer/get", method: "get" }
//设计商
export const designCompany_save = { url: service + "/designCompany/save" }
export const designCompany_list = { url: service + "/designCompany/list" }
export const designCompany_get = { url: service + "/designCompany/get", method: "get" }
//品牌商
export const productBrandOwner_save = { url: service + "/productBrandOwner/save" }
export const productBrandOwner_list = { url: service + "/productBrandOwner/list" }
export const productBrandOwner_get = { url: service + "/productBrandOwner/get", method: "get" }
/**品牌 */
export const productBrand_get = { url: service + "/productBrand/get", method: "get" } //品牌获取
/** 图片删除 逻辑删除 */
export const enterpriseArchivalInformation_logicDelete = { url: service + "/enterpriseArchivalInformation/logicDelete" }


/** -------------商品定制部分------------------------------------------------------------ */
/** 标准原料管理   标准工艺管理 type  原料类型（1：工艺，2：原料） */
export const productionMaterial_save = { url: service + "/productionMaterial/save" }
export const productionMaterial_list = { url: service + "/productionMaterial/list" }
export const productionMaterial_get = { url: service + "/productionMaterial/get", method: "get" }

/** 制造商支持管理  */
export const manufacturerProductionInformation_save = { url: service + "/manufacturerProductionInformation/save" }
export const manufacturerProductionInformation_list = { url: service + "/manufacturerProductionInformation/list" }
export const manufacturerProductionInformation_get = { url: service + "/manufacturerProductionInformation/get", method: "get" }
/**制造商支持子集 */
export const manufacturerProductionInformation_listForCateCount = { url: service + "/manufacturerProductionInformation/listForCateCount" }

/** 定制单品 SPU */
export const customizedProduct_save = { url: service + "/customizedProduct/save" }
export const customizedProduct_updateValid = { url: service + "/customizedProduct/updateValid" }
export const customizedProduct_list = { url: service + "/customizedProduct/list" }
export const customizedProduct_get = { url: service + "/customizedProduct/get", method: "get" }
/** 获取原料互斥 */
export const customizedProductMaterial_listExclusionMaterial = { url: service + "/customizedProductMaterial/listExclusionMaterial" }
/** 定制单品所需的制造商原料信息列表 */
export const manufacturerProductionMaterial_list = { url: service + "/manufacturerProductionMaterial/list" }
/** 定制套装 */
export const customizedSetProductGoods_list = { url: service + "/customizedProductGoods/list" } // 获取sku信息列表
/**  保存定制套装（SBU） */
export const customizedSet_save = { url: service + "/customizedSet/save" }
export const customizedSet_list = { url: service + "/customizedSet/list" }
export const customizedSet_get = { url: service + "/customizedSet/get", method: "get" }
/* elephant接口END */

/** 增值服务配置 */
export const categories_getTree = { url: service + "/categories/getTree" } // 获取下拉品类树结构
export const appreciationServiceConfig_save = { url: service + "/appreciationServiceConfig/save" } // 批量插入增值服务配置
export const appreciationServiceConfig_get = { url: service + "/appreciationServiceConfig/get", method: "get" }// 查询增值服务配置

/** 同步库存 */
export const productGoodsStock_synchronousStock = { url: service + "/productGoodsStock/synchronousStock", method: "get" }
/** 视频频道 */
export const videoChannel_save = { url: service + "/videoChannel/save" }
export const videoChannel_list = { url: service + "/videoChannel/list" }
export const videoChannel_get = { url: service + "/videoChannel/get", method: "get" }
/** 视频管理 */
export const video_save = { url: service + "/video/save" }
export const video_list = { url: service + "/video/list" }
export const video_get = { url: service + "/video/get", method: "get" }
export const video_logicDelete = { url: service + "/video/logicDelete" }
export const video_saveBatch = { url: service + "/video/saveBatch" }
//视频删除 腾讯云
export const video_deleteMedia = { url: service + "/video/deleteMedia", method: "delete" }
