export const service = "collocation-service";

/**
 * { url: service + "/xxxxxxx", method: "post", form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */
/** 匹配标签 */
export const collocationTag_list ={url:service+"/collocationTag/list"}
export const collocationTag_save ={url:service+"/collocationTag/save"}
export const collocationTag_get ={url:service+"/collocationTag/get",method:'get'}
/** 标签分组 */
export const collocationTagGroup_list ={url:service+"/collocationTagGroup/list"}
export const collocationTagGroup_save ={url:service+"/collocationTagGroup/save"}
export const collocationTagGroup_get ={url:service+"/collocationTagGroup/get",method:'get'}
/** 获取分组当前最大排序 */
export const collocationTagGroup_selectMaxSort ={url:service+"/collocationTagGroup/selectMaxSort",method:'get'}

