export const service = "content-service";

/**
 * { url: service + "/xxxxxxx", method: "post", form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */
// 图片上传
export const picture_content_upload = { url: process.env.VUE_APP_API_ROOT + service + "/basePicture/content/upload"}

export const picture_upload = { url: process.env.VUE_APP_API_ROOT + service + "/basePicture/upload"}
// 视频上传
// 获取签名
export const picture_get = { url: process.env.VUE_APP_API_ROOT + service + "/signature/get", method: "get"}
// 保存视频
export const video_save = { url: process.env.VUE_APP_API_ROOT + service + "/baseVideo/save"}

/**
 * 小程序男装
 **/
// 左侧列表
export const module_tree_list = { url: service + "/operationModule/tree/list" }
// 表格数据
export const manage_list = { url: service + "/operationManage/listWeb"}
// 表格删除
export const manage_delete = { url: service + "/operationManage/delete", method: "get" }
// 表格增加
export const manage_save = { url: service + "/operationManage/save"}
// 表格移动
export const manage_move = { url: service + "/operationManage/move"}
// 表格修改
export const manage_edit = { url: service + "/operationManage/edit"}


/**
 * 小程序女装
 **/
// 表格数据
export const womenOperationManage_listWeb = { url: service + "/womenOperationManage/listWeb" }
// 表格删除
export const womenOperationManage_delete = { url: service + "/womenOperationManage/delete", method: "delete" }
// 表格增加
export const womenOperationManage_save = { url: service + "/womenOperationManage/save"}
// 表格移动
export const womenOperationManage_move = { url: service + "/womenOperationManage/move"}
// 表格修改
export const womenOperationManage_edit = { url: service + "/womenOperationManage/edit"}
// 新增 编辑 内购企业
export const womenOperationManage_saveText = { url: service + "/womenOperationManage/saveText"}

/**
 * 文章发布
 **/
// 发布
export const content_save = { url: service + "/baseContent/save"}
// 详情
export const content_get = { url: service + "/baseContent/get", method: "get"}
// 编辑
export const content_edit = { url: service + "/baseContent/edit"}
// 省级  区域
export const province_list = { url: "system-service/division/getProvinceList"}


/**
 * 内容审核
 **/
// 获取列表数据
export const audit_list = { url: service +  "/contentAudit/list"}
// 通过审核
export const audit_pass = { url: service +  "/contentAudit/pass", method: "get"}
// 驳回
export const audit_reject = { url: service +  "/contentAudit/reject", method: "get"}
// 强制下线
export const audit_offline = { url: service +  "/contentAudit/offline", method: "get"}


/**
 * 内容管理
 **/
// 获取列表数据
export const content_list = { url: service +  "/baseContent/list"}
// 待审核列表
export const not_active_list = { url: service +  "/baseContent/list/notActive"}
// 小程序banner链接内容列表
export const content_pass_list = { url: service +  "/contentPass/list"}
// 下线
export const content_offline = { url: service +  "/baseContent/offline"}
// 置顶
export const content_top = { url: service +  "/baseContent/top"}
// 删除
export const content_delete = { url: service +  "/baseContent/delete"}
// 查看评论
export const comment_list = { url: service +  "/comment/list"}


/**
 * 素材管理
 **/
// 获取素材库图片
export const library_list = { url: service + "/sourceLibrary/list"}
// 删除
export const delete_batch = { url: service +  "/sourceLibrary/delete/batch"}
// 获取详情
export const library_get = { url: service +  "/sourceLibrary/get", method: "get"}
// 保存
export const library_save = { url: service +  "/sourceLibrary/save"}
// 编辑
export const library_edit = { url: service +  "/sourceLibrary/edit"}
// 素材分类
export const source_tree_list = { url: service +  "/sourceCategory/tree/list"}


/**
 * 内容分类
 **/
// 获取分类树列表
export const category_tree_list = { url: service + "/contentCategory/tree/list"}
// 根据父id层级获取
export const content_category_list = { url: service + "/contentCategory/list"}
// 删除
export const content_category_delete = { url: service + "/contentCategory/delete", method: "get"}
// 新增一级分类
export const content_category_add = { url: service + "/contentCategory/add"}
// 新增子类
export const content_category_insert = { url: service + "/contentCategory/insert"}
// 修改
export const content_category_update = { url: service + "/contentCategory/update"}
// 回显父级的内容类型 /contentCategory/query/content/type
export const query_content_type = { url: service + "/contentCategory/query/content/type", method: "get"}

/**
 * 素材分类
 **/
// 获取分类树列表
export const source_category_tree_list = { url: service + "/sourceCategory/tree/list"}
// 根据父id层级获取
export const source_category_list = { url: service + "/sourceCategory/list"}
// 删除
export const source_category_delete = { url: service + "/sourceCategory/delete", method: "get"}
// 新增一级分类
export const source_category_add = { url: service + "/sourceCategory/add"}
// 新增子类
export const source_category_insert = { url: service + "/sourceCategory/insert"}
// 修改
export const source_category_update = { url: service + "/sourceCategory/edit"}
