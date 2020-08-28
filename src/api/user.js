export const service = "user-service";
export const operation_service = "operation-service";
/**
 * { url: service + "/xxxxxxx", method: "post", form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */
//密码登录
// export const login = { url: service + "/login/admin/loginByPwd", form: true, auth: false }

export const login_loginByPwd = { url: service + "/userCompany/loginByPwd", form: true }
// //验证码登录
export const login_loginByPhoneAndCode = { url: service + "/userCompany/loginByPhoneAndCode", form: true }
//（验证码登录）发送验证码
export const login_sendCode = { url: service + "/userCompany/loginSendCode", form: true }
// 用户注册
export const get_register = { url: `${operation_service}/userCenter/register` }
// (用户注册 修改密码)发送验证码
export const get_sendPersonCode = { url: `${operation_service}/userCenter/sendPersonCode`, form: true }
// 修改密码
export const get_updatePwdAfterCheckCode = { url: `${operation_service}/userCenter/updatePwdAfterCheckCode` }
// 判断手机号是否注册过
export const get_loginPhonecheck = { url: `${operation_service}/userCenter/loginPhonecheck`, method: 'get' }


// 根据用户Id获取用户直属机构
export const userCompany_getUserOrgByUserId = { url: service + "/userCompany/getUserOrgByUserId", method: "get"}
// 根据用户Id获取用户关联机构部门
export const userCompany_getUserOrgsByUserId = { url: service + "/userCompany/getUserOrgsByUserId", method: "get"}
// 根据用户Id获取用户关联机构部门及直属机构
export const userCompany_getUserAllOrgByUserId = { url: service + "/userCompany/getUserAllOrgByUserId", method: "get"}
// 根据用户Id获取用户关联机构部门及直属机构(新改)
export const userCompany_getUserAllDepartByUserId = { url: service + "/userCompany/getUserAllDepartByUserId", method: "get"}
/**
 * 取得机构人员树
 */
export const DEPART_PERSON_LIST_POST = { url: service + "/depart/getDepartPersonMap" }
/**
 * 取得机构树
 */
export const DEPART_LIST_POST = { url: service + "/depart/getListMap",form: true }
export const DEPART_All_LIST_POST = { url: service + "/depart/getAllListMap",form: true }
export const userCompany_getRoleList = { url: service + "/userCompany/getRoleList",method: "get",form: true }
export const userCompany_resetPwd = { url: service + "/userCompany/resetPwd" }
export const userCompany_list = { url: service + "/userCompany/list" }
export const userCompany_updateSelective = { url: service + "/userCompany/updateSelective", tip: true }
// 修改公司用户表实例
export const userCompany_update = { url: service + "/userCompany/update" }
// 创建公司用户表实例
export const userCompany_create = { url: service + "/userCompany/create" } 
export const userCompany_get = { url: service + "/userCompany/get", method: "get" }
export const userRole_list = { url: service + "/userRole/list" }
export const userRole_saveDatas = { url: service + "/userRole/saveDatas", form: true }
export const userDepart_list = { url: service + "/userDepart/list" }
export const userDepart_saveDatas = { url: service + "/userDepart/saveDatas", form: true }
export const depart_list = { url: service + "/depart/list" }
export const depart_listByAuth = { url: service + "/depart/listByAuth" }
export const depart_get = { url: service + "/depart/get", method: "get" }
// 新增机构
export const depart_create_organization = { url: service + "/depart/createOrganization"}
// 编辑机构
export const depart_update_organization = { url: service + "/depart/updateOrganization"}
// 改变状态
export const depart_save = { url: service + "/depart/save"}


export const depart_delete = { url: service + "/depart/logicDelete" }
export const depart_getUsers = { url: service + "/depart/getUsers" }
export const depart_getWarehouses = { url: service + "/depart/getWarehouses" }
export const depart_getUserDepList = { url: service + "/depart/getUserDepList", method: "get", form: true }
export const position_list = { url: service + "/position/list" }
export const position_save = { url: service + "/position/save", tip: true }
export const position_get = { url: service + "/position/get", method: "get" }
export const position_getUsers = { url: service + "/position/getUsers", form: true }
export const position_delete = { url: service + "/position/logicDelete" }

export const userdepart_list = { url: service + "/userDepart/list" }

/**获取用户基本信息 */
export const get_userinfo = { url: service + "/userCompany/getByToken", method: "get" }

/**角色管理 */
export const role_getUsers = { url: service + "/role/getUsers" }
export const role_get = { url: service + "/role/get", method: "get" }
export const role_list = { url: service + "/role/list" }
export const role_update = { url: service + "/role/update", }
export const role_create = { url: service + "/role/create" }
export const role_delete = { url: service + "/role/logicDelete" }
export const role_save = { url: service + "/role/save", tip: true }


/** CRM */
//用户数据 客户列表 list  客户详情 get
export const crm_userCustomer_list = { url: service + "/userCustomer/list" }
export const crm_userCustomer_update = { url: service + "/userCustomer/update" }
export const crm_userCustomer_get = { url: service + "/userCustomer/get", method:'get'}

//角色姓名下拉接口
export const crm_userRecord_getUserRecordByUserId = { url: service + "/userRecord/getUserRecordByUserId",method:'get' }
//客户详情 净体测量和体型特征 接口
export const crm_userMeasurement_list = { url: service + "/userMeasurement/list" }

//测量项管理 measurement
export const crm_measurement_list = { url: service + "/measurement/list" }
export const crm_measurement_get = { url: service + "/measurement/get" , method:'get'}
export const crm_measurement_updateSelective = { url: service + "/measurement/updateSelective" ,tip:"true"}
export const crm_measurement_create = { url: service + "/measurement/create" }
export const crm_measurement_update = { url: service + "/measurement/update" }
// 体型特征管理
export const crm_bodyfeatures_list = { url: service + "/bodyfeatures/list" }
export const crm_bodyfeatures_get = { url: service + "/bodyfeatures/get", method:'get' }
export const crm_bodyfeaturesItem_list = { url: service + "/bodyfeaturesItem/list"} //子集
export const crm_bodyfeatures_create = { url: service + "/bodyfeatures/create" }
export const crm_bodyfeatures_update = { url: service + "/bodyfeatures/update" }
export const crm_bodyfeatures_updateSelective = { url: service + "/bodyfeatures/updateSelective" ,tip:"true"}


// 获取用户全权限Code码
export const crm_userCompany_authList = { url: service + "/userCompany/getNoPermissionAuthList" , method:'get'}
// 保存用户权限数据
export const crm_userCompany_saveUserAuth = { url: service + "/userCompany/saveUserAuth"}

/**
 * 新增部门新增和编辑
 */
// 部门新增
export const depart_create_depart = { url: service + "/depart/createDepart" }
// 部门编辑
export const depart_update_depart = { url: service + "/depart/updateDepart" }

/**
 * @Date: 2020-02-18 10:16:12
 * @description: 根据手机号判断是否有多货主 获取多货主
 * @author: null
 * @param {type} 
 * @return: 
 */
export const userCompany_loginCheckTenantData = { url: service + "/userCompany/loginCheckTenantData", method:'get' }
