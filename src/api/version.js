export const service = "management-service";//
/**
 * { url: service + "/xxxxxxx", method: "post", form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */
//版本
/** 升级管理 */
export const applicationVersionControl_logicDelete ={url:service+"/applicationVersionControl/logicDelete"}
export const applicationVersionControl_list ={url:service+"/applicationVersionControl/list"}
export const applicationVersionControl_save ={url:service+"/applicationVersionControl/save"}
export const applicationVersionControl_get ={url:service+"/applicationVersionControl/get",method:'get'}
/** 版本管理 */
export const applicationVersion_logicDelete ={url:service+"/applicationVersion/logicDelete"}
export const applicationVersion_list ={url:service+"/applicationVersion/list"}
export const applicationVersion_save ={url:service+"/applicationVersion/save"}
export const applicationVersion_get ={url:service+"/applicationVersion/get",method:'get'}