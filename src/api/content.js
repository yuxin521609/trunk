export const service = "content-service";
// 门店服务
export const retailStoreService = "retail-store-service";


/**
 * { url: service + "/xxxxxxx", method: "post", form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */
// 删除图片
export const basePicture_deleteOssImage = { url: service + "/basePicture/deleteOssImage", method: "get" }
//删除视频

export const picture_upload = { url: service + "/basePicture/upload", }
// 门店长传图片地址
export const aLiYun_upload = { url: retailStoreService + "/aLiYun/upload", }