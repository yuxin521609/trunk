/*
 * @Description:接口列表
 * @Author: your name
 * @Date: 2019-07-19 10:45:36
 * @LastEditTime: 2019-08-22 15:46:19
 * @LastEditors: Please set LastEditors
 */
export const service = "system-service";
export const operationService = "operation-service";
export const userService = "user-service";

/**
 * { url: SYSTEM + "/xxxxxxx", , form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */

/**
 * 获取全局编码并缓存
 */
export const ALL_CODESET_POST = { url: operationService + "/codeSet/refreshAndGetAll", }

/**
 * 获取菜单
 */
export const application_List = { url: service + "/application/list" }
export const application_save = { url: service + "/application/save", form: true  }
export const menu_getListMap = { url: service + "/menu/getListMap", method: "get" }
export const menu_getMaxMenuCode = { url: service + "/menu/getMaxMenuCode", method: "get" }
export const menu_save = { url: service + "/menu/save"}
export const auth_save = { url: userService + "/auth/save"}
/**
 * 获取授权给我的菜单
 */
export const AUTH_MENU_LIST = { url: service + "/menu/getListMapByAuth", form: true }
export const menu_getRouteByUser = { url: service + "/menu/getRouteByUser", form: true }
/**
 * 工作台获取当前用户可操作列表
 */
export const APPLICATION_GETLISTBYAUTH = { url: service + "/application/getListByAuth",  }


export const messageTemplate_list = { url: service + "/messageTemplate/list", }
export const messageTemplate_save = { url: service + "/messageTemplate/save", }
export const messageTemplate_get = { url: service + "/messageTemplate/get", method: "get" }
export const messageTemplate_delete = { url: service + "/messageTemplate/logicDelete", }
export const messageTo_list = { url: service + "/messageTo/list", }
export const getProvinceList = { url: service + "/division/getProvinceList"}
export const getMunicipalityList = { url: service + "/division/getMunicipalityList",form: true}
export const getAreaList = { url: service + "/division/getAreaList",form: true}
export const Role_Auth_Tree = { url: service + "/menu/getRoleAuthTree", method: "get" }
export const division_all = { url: service + "/division/getAll"}
// 获取账号权限树
export const user_Auth_Tree = { url: service + "/menu/getUserAuthTree", method: "get" }
/**
 * 获取仓库配置列表
 */
export const warehouse_list = { url: service + "/warehouse/list", }
/**
 * 新增或编辑仓库配置
 */
export const warehouse_save = { url: service + "/warehouse/save", }
/**
 * 获取单个仓库配置
 */
export const warehouse_get = { url: service + "/warehouse/get", method: "get" }
/**
 * 删除仓库配置
 */
export const warehouse_getByCode = { url: service + "/warehouse/getByCode",method: "get"}
/**
 * 删除仓库配置
 */
export const warehouse_delete = { url: service + "/warehouse/logicDelete", }
/**
 * 操作日志部分
 */
export const operationLog_list = { url: service + "/operationLog/list", }

/**
 * 预警类型配置
 */
export const warningType_list = { url: service + "/warningType/list", }
export const warningType_save = { url: service + "/warningType/save", }
export const warningType_get = { url: service + "/warningType/get", method: "get" }
export const warningType_delete = { url: service + "/warningType/logicDelete",tip:"true"}

// 获取所有的省市区数据
export const division_get_info = { url: service + "/division/getInfo", method: "get"}


/**
 * 货主配置
 *
 */
// 列表数据
export const goodsOwner_list = { url: service + "/goodsOwner/list", }
// 删除
export const goodsOwner_logicDelete = { url: service + "/goodsOwner/logicDelete", }
// 新增
export const goodsOwner_save = { url: service + "/goodsOwner/save", }
// 详情
export const goodsOwner_get = { url: service + "/goodsOwner/get", method: "get" }
// 修改有效
export const goodsOwner_updateValid = { url: service + "/goodsOwner/updateValid" }
// 根据机构获取货主
export const goodsOwner_getByOrgId = { url: service + "/goodsOwner/getByOrgId"}

/**
 * @description: 作为同步库存使用 根据token获取用户数据
 * @param {type}
 * @return:
 */

//根据用户ID获取所有仓库列表
export const warehouse_getListByUser = { url: service + "/warehouse/getListByUser", method: "get" }
//根据员工直属机构取得货主
export const goodsOwner_getByUserId = { url: service + "/goodsOwner/getByUserId", method: "get" }
//end

