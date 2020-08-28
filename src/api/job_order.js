export const service = "system-service";
export const businessEngine = "business-engine";

/**
 * { url: SYSTEM + "/xxxxxxx", , form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */


/**
 * 获取菜单
 */
export const tableItemGetListMap = { url: service + "/tableItem/getListMap" }
export const getTableSet_List = { url: service + "/tableSet/list"}
export const getWarningType_List = { url: service + "/warningType/list"}// 获取预警类型
export const getMessageTemplate_List = { url: service + "/messageTemplate/list"}// 获取消息模板

export const saveJObOrder = { url: businessEngine + "/jobOrderExtend/create"}// 保存新建工单
export const jobOrderExtend_update = { url: businessEngine + "/jobOrderExtend/update"}// 编辑新建工单

export const workOrderPoolReceive = { url: businessEngine + "/workOrderPool/receive"}// 获取工单
export const getHistoryWorkOrderGetByNum = { url: businessEngine + "/historyWorkOrder/getByNum"}// 根据ID获取工单池详情
export const getWorkOrderLog_list = { url: businessEngine + "/workOrderLog/list"}// 获取工单记录列表
export const addHistoryWorkOrderFollowUp = { url: businessEngine + "/historyWorkOrder/followUp"}// 添加一条跟进记录
export const tableItemListByWorkOrderCode = { url: businessEngine + "/tableItem/listByWorkOrderCode"} // 根据源单编码获取所有子表数据项

// 扩展，时间名称校验
export const jobOrderExtend_validation = { url: businessEngine + "/jobOrderExtend/validation"} // 工单扩展名称验证
export const jobOrderTime_validation = { url: businessEngine + "/jobOrderTime/validation"} // 工单时间名称验证

// 列表，转派，撤销转派
export const usersGet = { url: businessEngine + "/users/get"} // 根据部门ID获取用户数据

export const getWorkOrderPool_List = { url: businessEngine + "/workOrderPool/list"}// 获取-工单池列表
export const getWaitWorkOrder_list = { url: businessEngine + "/waitWorkOrder/list"}// 获取-待处理，处理中工单列表
export const getHistoryWorkOrder_list = { url: businessEngine + "/historyWorkOrder/list"}// 获取-已处理工单列表

export const workOrderPoolAssign = { url: businessEngine + "/workOrderPool/assign"} // 指派-工单池
export const waitWorkOrderAssign = { url: businessEngine + "/waitWorkOrder/assign"} // 指派-待处理工单

export const waitWorkOrderTransfer = { url: businessEngine + "/waitWorkOrder/transfer"} // 转派-处理中工单
export const waitWorkOrderRevokeTransfer = { url: businessEngine + "/waitWorkOrder/revokeTransfer"} // 撤销指派-处理中工单

export const waitWorkOrderRelease = { url: businessEngine + "/waitWorkOrder/release"} // 释放-待处理工单

// 处理工单保存，提交字段
export const waitWorkOrderSubHandle = { url: businessEngine + "/waitWorkOrder/subHandle"} // 提交字段-处理中工单
export const waitWorkOrderSaveHandle = { url: businessEngine + "/waitWorkOrder/saveHandle"} // 保存字段-处理中工单

export const getFindAll_List = { url: businessEngine + "/jobOrderExtend/findAll", method: "get"} // 获取适用工单
export const saveJobOrderTime = { url: businessEngine + "/jobOrderTime/save"} // 保存工单时间管理
export const getJobOrderExtend_List = { url: businessEngine + "/jobOrderExtend/list"} // 查询工单扩展列表
export const jobOrderExtendDelete = { url: businessEngine + "/jobOrderExtend/delete"} // 删除工单扩展
export const jobOrderExtendGet = { url: businessEngine + "/jobOrderExtend/get", method: "get"} // 获取工单类型扩展
export const tableItemListByOrderExtendId = { url: businessEngine + "/tableItem/listByOrderExtendId"} // 根据工单扩展Id获取所有子表数据项

export const getJobOrderTime_List = { url: businessEngine + "/jobOrderTime/list"} // 查询工单时间配置列表
export const jobOrderTimeDelete = { url: businessEngine + "/jobOrderTime/delete"} // 删除工单时间配置
export const jobOrderTimeGet = { url: businessEngine + "/jobOrderTime/get", method: "get"} // 获取某一工单时间配置内容
export const jobOrderTimeUpdate = { url: businessEngine + "/jobOrderTime/update"} // 修改工单时间管理


// 业务引擎
export const model_create = { url: businessEngine + "/model/create", method: "get"} //新增工序









