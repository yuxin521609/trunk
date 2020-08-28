export const service = "financial-service";
/*
 * 财务-对账周期设置 
 */
//新增对账设置-list列表
export const financialConfig_list ={url: service + "/financialConfig/statementCycleConfig/list"};
//新增对账设置-店铺类型
export const financialBase_merchantTypeList ={url: service + "/financialBase/merchantTypeList"};
//新增对账设置-对账周期
export const financialBase_statementCycleTypeList ={url: service + "/financialBase/statementCycleTypeList"};
//新增对账设置-适用门店
export const financialBase_merchantListByType ={url: service + "/financialBase/merchantListByType"};
//新增对账设置-新增保存
export const financialConfig_insert ={url: service + "/financialConfig/statementCycleConfig/insert"};
//对账周期设置-编辑
export const financialConfig_getByPrimary ={url: service + "/financialConfig/statementCycleConfig/getByPrimary", method: "get"};
//对账周期设置-编辑保存
export const financialConfig_updateByPrimary ={url: service + "/financialConfig/statementCycleConfig/updateByPrimary"};
//对账周期设置-启停
export const financialConfig_updateValid ={url: service + "/financialConfig/statementCycleConfig/updateValid",method:'get'};
//对账周期设置-删除
export const financialConfig_logicDelete ={url: service + "/financialConfig/statementCycleConfig/logicDelete", method: "delete"};
// 商家收款设置-保存
export const financialConfig_paymentConfig ={url: service + "/financialConfig/paymentConfig/save"};
// 得到商家收款设置数据
export const financialConfig_getByAssociationId ={url: service + "/financialConfig/paymentConfig/getByAssociationId",method:"get"};
// 得到商家收款文件上传接口
export const financialConfig_uploadCredential ={url: service + "/financialConfig/paymentConfig/uploadCredential"};
// 交易明细-list列表
export const financialData_tdTransactionDetail_list ={url: service + "/financialData/tdTransactionDetail/list"};
// 交易明细-交易类型
export const financialBase_transactionTypeList ={url: service + "/financialBase/transactionTypeList"};
// 门店对账-list列表
export const financialData_tdStatement_list ={url: service + "/financialData/tdStatement/list"};
//门店对账-导出全部数据
export const financialData_tdStatement_exportAll ={url: service + "/financialData/tdStatement/exportAll"};
//门店待对账-确认完成
export const financialData_tdStatement_completeStatementByPrimary ={url: service + "/financialData/tdStatement/completeStatementByPrimary",method: "get"};
//渠道收付款对账-收付款方式
export const financialBase_paymentTypeList ={url: service + "/financialBase/paymentTypeList"};
//渠道对账-状态
export const financialBase_paymentStatusTypeList ={url: service + "/financialBase/paymentStatusTypeList"};
//对账-确认收款
export const financialBase_confirmAccounting ={url: service + "/financialData/tdStatement/confirmAccounting"};
//上传附件 
export const financialData_uploadBatchAttachment ={url: service + "/financialData/tdStatement/uploadBatchAttachment"};

export const tdTransactionAttachment_saveBatch ={url: service + "/tdTransactionAttachment/saveBatch"};
//添加备注
export const financialData_additionMemo ={url: service + "/financialData/tdStatement/additionMemo"};
//对账-下拉框的综合接口(ATTACHMENT_LIST  查看附件,MEMO_LIST 查看财务备注,TRANSACTION_LIST  收款记录)
export const financialData_associationSources ={url: service + "/financialData/tdStatement/associationSources"};
//代销货款对账-新增
export const financialData_insert ={url: service + "/financialData/tdStatement/insert"};
//代销货款对账-取消收款
export const financialData_logicDeleteByPrimary ={url: service + "/financialData/tdStatement/logicDeleteByPrimary",method:'delete'};
//门店待对账-对账
export const financialData_transactionListByStatementId ={url: service + "/financialData/tdStatement/transactionListByStatementId"};
//对账页面-当前行的对账 
export const financialData_reconciliation ={url: service + "/financialData/tdTransactionDetail/reconciliation",method:'get'};
//对账-批量对账
export const financialData_reconciliationBatch ={url: service + "/financialData/tdTransactionDetail/reconciliationBatch"};
//确认完成-前置校验  
export const financialData_confirmTransactionByStatementId ={url: service + "/financialData/tdStatement/confirmTransactionByStatementId",method:"get"};
//门店货款明细-list列表
export const financialData_tdInventoryDetail_list ={url: service + "/financialData/tdInventoryDetail/list"};


/**
 * 资金管理-zm
 */
// 获取渠道押金账户管理列表
export const channelDepositAccount_list = {url: service + "/channelDepositAccount/list"};
// 获取渠道商户列表
export const channelDepositAccount_channelList = {url: service + "/channelDepositAccount/channelList"};
// 账户充值
export const channelDepositAccount_recharge = {url: service + "/channelDepositAccount/recharge"};
// 保存渠道押金账户管理实例
export const channelDepositAccount_save = {url: service + "/channelDepositAccount/save"};


// 确认收款
export const receiptManage_confirmPayment = {url: service + "/receiptManage/confirmPayment"};
// 获取收款管理列表
export const receiptManage_list = {url: service + "/receiptManage/list"};
// 添加备注
export const tdStatementMemo_additionMemo = {url: service + "/tdStatementMemo/additionMemo"};
// 查询备注
export const tdStatementMemo_list = {url: service + "/tdStatementMemo/list"};
// 查询附件
export const tdTransactionAttachment_list = {url: service + "/tdTransactionAttachment/list"};
// 收入明细
export const capitalIncomeRecord_list = {url: service + "/capitalIncomeRecord/list"};
// 押金使用明细
export const channelDepositRecord_list = {url: service + "/channelDepositRecord/list"};

