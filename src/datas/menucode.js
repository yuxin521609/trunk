/*
 * @Description: 后台根据权限返回动态路由
 * @Author: common
 * @Date: 2019-08-07 10:11:20
 * @LastEditTime: 2019-11-06 14:11:32
 * @LastEditors: your name
 */
export let routeList = [
    {
        "id":"8934673f-6a7a-4307-b0e0-f5f8b0f7d75a",
        "name":"机构管理",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_mechanism.png")
    },
    {
        "id":"b887adcd-82f5-4bdb-8546-94d170a5c915",
        "pid":"afd0992a-de57-49e8-acd9-900f681c964c",
        "name":"组织机构",
        "path":"/OC/mechanism/framework_list",
        "auth":true
    },
    {
        "id":"eee88b85-a6a9-44d9-91d0-4fdd4bf68f5d",
        "pid":"afd0992a-de57-49e8-acd9-900f681c964c",
        "name":"部门管理",
        "path":"/OC/mechanism/department_list",
        "auth":true
    },{
        "id":"99ded67a-5086-4a68-987d-4e54cd4757e9",
        "pid":"afd0992a-de57-49e8-acd9-900f681c964c",
        "name": "账号管理",
        "path":"/OC/user/userCompany_list",
        "icon":require("../assets/lss_icon/lss_icon_usercompany.png")
    },
    {
        "id":"9854132c-f466-4e51-b61c-80fba163c766",
        "pid":"afd0992a-de57-49e8-acd9-900f681c964c",
        "name":"职位管理",
        "path":"/OC/user/position_list",
        "icon":require("../assets/lss_icon/lss_icon_position.png")
    },
    {
        "id": "d2d432a3-ad2a-4458-9670-ae6becb796f8",
        "pid":"afd0992a-de57-49e8-acd9-900f681c964c",
        "name": "角色管理",
        "path":"/OC/user/roleManage_list",
        "icon":require("../assets/lss_icon/lss_icon_rolemanage.png")
    },
    {
        "id":"445cb0a5-7407-4135-ae9a-b5de0efa285c",
        "name":"C端业务",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_toc.png")
    },  {
        "id":"f03766c2-3325-4abb-9ed4-8d83fa9b0284",
        "name":"B端业务",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_tob.png")
    },
    {
        "id": "e1210bf6-d93d-4e15-98e3-07217b27885c",
        "pid":"5f163552-1e1c-4b64-8707-558103d6c12a",
        "name": "量体预约单",
        "path":"/OS/customOrder/booking_order_list"
    },
    {
        "id": "f1c50ed9-3651-4885-94c1-52fbad5f3f0e",
        "pid":"5f163552-1e1c-4b64-8707-558103d6c12a",
        "name": "定制订单",
        "path":"/OS/customOrder/custom_order_list"
    },
    {
        "id":"53d6631e-7530-11e9-b142-b82a72d7adc0",
        "pid":"5f163552-1e1c-4b64-8707-558103d6c12a",
        "name": "渠道网销订单",
        "path":"/OS/ditch/ditch"
    },
    {
        "id":"14c98b5b-b089-427c-b09a-73658cf0b7a6",
        "pid":"5f163552-1e1c-4b64-8707-558103d6c12a",
        "name": "渠道网销退货订单",
        "path":"/OS/salesReturn/ditchReturn/ditchReturn_List"
    },
    {
        "id":"b9186cae-2d59-4604-a659-6ea31245980a",
        "pid":"5f163552-1e1c-4b64-8707-558103d6c12a",
        "name": "渠道销售订单",
        "path":"/OS/channelSales/channelSales"
    },
    {
        "id":"094a6a53-0195-4858-8d32-3608623e4fb7",
        "pid":"5f163552-1e1c-4b64-8707-558103d6c12a",
        "name": "渠道销售退货订单",
        "path":"/OS/salesReturn/channelReturn/channelReturn_List"
    },
    {
        "id":"58d3eca1-a469-11e9-a22d-0242ac110002",
        "pid":"58d3ebfa-a469-11e9-a22d-0242ac110002",
        "name": "出库单汇总",
        "path":"/OS/stockOrder/outOrder/outOrder_List"
    },
    {
        "id":"58d3ec78-a469-11e9-a22d-0242ac110002",
        "pid":"58d3ebfa-a469-11e9-a22d-0242ac110002",
        "name": "入库单汇总",
        "path":"/OS/stockOrder/putOrder/putOrder_List"
    },
    {
        "id":"3dc19a0d-a468-11e9-a22d-0242ac110002",
        "pid":"3dc19a8e-a468-11e9-a22d-0242ac110002",
        "name": "预约单",
        "path":"/store/order/appointment_order_list"
    },
    {
        "id":"3dc199d5-a468-11e9-a22d-0242ac110002",
        "pid":"3dc19a8e-a468-11e9-a22d-0242ac110002",
        "name": "销售订单",
        "path":"/store/order/storeSell_order_list"
    },
    {
        "id":"3dc19975-a468-11e9-a22d-0242ac110002",
        "pid":"3dc19a8e-a468-11e9-a22d-0242ac110002",
        "name": "退货订单",
        "path":"/store/order/sendBck_order_list"
    },
    {
        "id":"3dc1992b-a468-11e9-a22d-0242ac110002",
        "pid":"3dc19a8e-a468-11e9-a22d-0242ac110002",
        "name": "盘点单",
        "path":"/store/order/store_check_list"
    },
    {
        "id":"3dc1990f-a468-11e9-a22d-0242ac110002",
        "pid":"3dc19a8e-a468-11e9-a22d-0242ac110002",
        "name": "差异单",
        "path":"/store/inventory/check_record_list"
    },
    {
        "id":"3dc198e7-a468-11e9-a22d-0242ac110002",
        "pid":"3dc19a8e-a468-11e9-a22d-0242ac110002",
        "name": "收货单",
        "path":"/OS/store/receive_goods_list",
        "component":"/collocation/receive_goods/receive_goods_list"

    },
    {
        "id":"3dc1979f-a468-11e9-a22d-0242ac110002",
        "pid":"3dc19a8e-a468-11e9-a22d-0242ac110002",
        "name": "返货单",
        "path":"/OS/store/other_bill/back_goods_list",
        "component":"/OS/store/other_bill/back_goods_list",
    },
    {
        "id":"5afd1304-b75f-11e9-a68e-0242ac110002",
        "pid":"3dc19a8e-a468-11e9-a22d-0242ac110002",
        "name": "退款单",
        "path":"/OS/store/other_bill/refund_list"
    },
    {
        "id":"4804621c-a468-11e9-a22d-0242ac110002",
        "pid":"3dc19a8e-a468-11e9-a22d-0242ac110002",
        "name": "门店配货单",
        "path":"/OS/store/distribution_list",
        "component": "/collocation/distribution/distribution_list"
    },
    {
        "id":"4804623f-a468-11e9-a22d-0242ac110002",
        "pid":"3dc19a8e-a468-11e9-a22d-0242ac110002",
        "name": "门店返货单",
        "path":"/OS/store/back_goods_list",
        "component": "/collocation/back_goods/back_goods_list"
    },
    {
        "id":"eb51edbf-da75-11e9-a898-0242ac110002",
        "pid":"3dc19a8e-a468-11e9-a22d-0242ac110002",
        "name": "门店调出单",
        "path":"/OS/store/out_goods/out_goods_list"
    },
    {
        "id":"eb51ed9f-da75-11e9-a898-0242ac110002",
        "pid":"3dc19a8e-a468-11e9-a22d-0242ac110002",
        "name": "店间调拨单",
        "path":"/OS/store/transfer_slip/transfer_slip_list",
        "component": "/collocation/transfer_slip/transfer_slip_list"
    },
    {
        "id": "71da0e17-395a-4897-8fc1-4ba68d0517c3",
        "pid":"1d8f257a-6d36-4a52-993e-4fe0b123acdb",
        "name": "消息提醒模板",
        "path":"/system/messageTemplate_list"
    },
    {
        "id": "92150c64-b77d-4e72-987c-fd2afa862904",
        "pid":"1d8f257a-6d36-4a52-993e-4fe0b123acdb",
        "name": "预警类型配置",
        "path":"/system/warningType_list"
    },
    {
        "id":"53d663c5-7530-11e9-b142-b82a72d7adc0",
        "pid":"5f163552-1e1c-4b64-8707-558103d6c12a",
        "name": "采购订单",
        "path":"/orders/business/purchase/purchaseOrder_list"
    },
    {
        "id":"a56182a0-b101-4761-87f9-b10cb6c00404",
        "pid":"5f163552-1e1c-4b64-8707-558103d6c12a",
        "name": "采购退货订单",
        "path":"/orders/business/purchaseReturn/purchaseReturn_List"
    },
    {
        "id":"53d663d2-7530-11e9-b142-b82a72d7adc0",
        "pid":"5f163552-1e1c-4b64-8707-558103d6c12a",
        "name": "到货单管理",
        "path":"/orders/business/purchase/arrivalNotice_list"
    },
    {
        "id":"53d663db-7530-11e9-b142-b82a72d7adc0",
        "pid":"5f163552-1e1c-4b64-8707-558103d6c12a",
        "name": "入库单管理",
        "path":"/orders/business/purchase/joinLibraryOrder_list"
    },
    {
        "id":"095d46a8-cc17-43c1-bcb0-9cce9feadbc3",
        "name":"工单管理",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_workorder.png")
    },
    {
        "id":"fb31b53b-29f3-49d1-b0ee-a002127937b7",
        "name":"工单配置管理",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_workorder_configuration.png")
    },
    {
        "id":"faabda33-2156-4ea9-a316-27b96cf8650c",
        "pid":"4749a9bb-42f9-4d25-ad14-b568ccc9de1f",
        "name": "工单池",
        "path":"/workorder/category/workOrder_pond_list"
    },
    {
        "id":"3679164f-997e-4d79-8da9-bfdf9c5c578c",
        "pid":"4749a9bb-42f9-4d25-ad14-b568ccc9de1f",
        "name": "待处理工单",
        "path":"/workorder/category/workOrder_pending_list"
    },
    {
        "id":"ac2b0aa9-2b5f-4241-bcdc-ba595901d4dc",
        "pid":"4749a9bb-42f9-4d25-ad14-b568ccc9de1f",
        "name": "处理中工单",
        "path":"/workorder/category/workOrder_beingProcessed_list"
    },
    {
        "id":"db5319d3-2556-4365-9b63-396df1d5b9e7",
        "pid":"4749a9bb-42f9-4d25-ad14-b568ccc9de1f",
        "name": "已处理工单",
        "path":"/workorder/category/workOrder_processed_list"
    },
    {
        "id":"42794102-9814-4327-b9ea-c3885070c738",
        "pid":"4749a9bb-42f9-4d25-ad14-b568ccc9de1f",
        "name": "工单类型扩展表单",
        "path":"/workorder/config/workOrder_new_list"
    },
    {
        "id":"735832ee-8327-4c2c-919f-3d88d753d89b",
        "pid":"4749a9bb-42f9-4d25-ad14-b568ccc9de1f",
        "name": "工单时间管理",
        "path":"/workorder/config/workOrder_time_list"
    },
    {
        "id":"19bb8098-5142-47af-a982-bc680c298caa",
        "pid":"02939059-69d3-4509-ba27-8b014fbf7141",
        "name": "工序管理",
        "path":"/engine/manage/process_list"
    },
    {
        "id":"34ff32b5-f9ea-4e6f-9eb8-ee4b20e1fc4b",
        "pid":"02939059-69d3-4509-ba27-8b014fbf7141",
        "name": "流程管理",
        "path":"/engine/manage/course_list"
    },
    {
        "id":"34ff32b5-f9ea-4e6f-9eb8-ee4b20e1fc4b",
        "pid":"02939059-69d3-4509-ba27-8b014fbf7141",
        "name": "工序触发条件",
        "path":"/engine/manage/trigger_if_list"
    },
    {
        "id":"50eb068d-b2a5-4bf1-be3b-0c25de722e72",
        "pid":"02939059-69d3-4509-ba27-8b014fbf7141",
        "name": "表单配置",
        "path":"/engine/config/config_list"
    },
    {
        "id":"bc6dafd0-76d1-11e9-b142-b82a72d7adc0",
        "pid":"1d8f257a-6d36-4a52-993e-4fe0b123acdb",
        "name": "仓库配置",
        "path":"/system/wareHouse_list"
    },
    {
        "id":"0e33d6f2-a2e9-11e9-a22d-0242ac110002",
        "pid":"1d8f257a-6d36-4a52-993e-4fe0b123acdb",
        "name": "货主配置",
        "path":"/system/shipper_list"
    },
    {
        "id":"86e85cec-efbe-4d28-a672-bf6fb5d6ea31",
        "pid":"1d8f257a-6d36-4a52-993e-4fe0b123acdb",
        "name": "日志管理",
        "path":"/system/oprationlog"
    },
    {
        "id":"1bb17a0a-5a11-4746-b16b-be77f07ae5f8",
        "name":"商品管理",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_product.png")
    },
    {
        "id":"4a79f624-60d8-11e9-bb2e-b82a72d7adc0",
        "name":"分类管理",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_class.png")
    },
    {
        "id":"e814f1a9-793b-11e9-b142-b82a72d7adc0",
        "name":"库存管理",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_stock.png")
    }, {
        "id":"1ed72005-8777-4e17-ad7e-6a2c12c31695",
        "name":"规格信息管理",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_specification.png")
    }, {
        "id":"4a79f5e8-60d8-11e9-bb2e-b82a72d7adc0",
        "name":"供应商品牌管理",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_brand.png")
    },
    {
        "id":"3d6e6a6f-2d8e-4f25-a8db-7df946d793f3",
        "name":"板式列表",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_custom.png")
    },{
        "id":"e28d0c7a-fb07-449d-830a-b65a0930419f",
        "name":"定制属性管理",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_custom_attrs.png")
    },
    {
        "id":"5e46762a-76ed-4ffe-b311-917225c16315",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "商品列表",
        "path":"/product/commodity/index_list"
    },
    {
        "id":"2c169e39-da78-11e9-a898-0242ac110002",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "SN码打印记录",
        "path":"/product/commodity/sn_prints_list"
    },
    {
        "id":"e814f2c0-793b-11e9-b142-b82a72d7adc0",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "库存管理",
        "path":"/product/basic_info/stock_list"
    },
    {
        "id":"56874b20-ff7e-43d3-9c0a-9569522ea95f",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "规格管理",
        "path":"/product/specification_attrbute/specification_list"
    },
    {
        "id":"4a79f555-60d8-11e9-bb2e-b82a72d7adc0",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "基本信息管理",
        "path":"/product/basic_info/basic_info_list"
    }, {
        "id":"e111d44f-ffb8-11e9-a898-0242ac110002",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "商品颜色维护",
        "path":"/product/basic_info/color_list"
    },{
        "id":"295bb4d3-bd8f-11e9-a68e-0242ac110002",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "频道管理",
        "path":"/product/video/channel_list"
    },
    {
        "id":"295bb4fc-bd8f-11e9-a68e-0242ac110002",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "视频管理",
        "path":"/product/video/video_list"
    },

    {
        "id":"4a79f5ff-60d8-11e9-bb2e-b82a72d7adc0",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "品牌管理",
        "path":"/product/supplier/brand_list"
    },{
        "id":"4a79f610-60d8-11e9-bb2e-b82a72d7adc0",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "供应商管理",
        "path":"/product/supplier/supplier_list"
    },{
        "id":"da3a9736-82cc-11e9-bc97-0242ac110003",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "制造商管理",
        "path":"/product/supplier/manufacturer_list"
    },{
        "id":"da3a978a-82cc-11e9-bc97-0242ac110003",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "设计商管理",
        "path":"/product/supplier/design_company_list"
    },{
        "id":"295bb51f-bd8f-11e9-a68e-0242ac110002",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "品牌商",
        "path":"/product/supplier/brand_merchant_list"
    }, {
        "id":"e88d5b49-316c-4086-a358-2254cd99dcd7",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "商品分类",
        "path":"/product/classification/class_list"
    },{
        "id":"80fdd4ce-377b-4057-9d08-4d171e333ce6",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "定制分类管理",
        "path":"/product/classification/class_custom"
    }, {
        "id":"ffffc5ed-3ca8-4125-aa80-7ec0182ef6e5",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "属性分类管理",
        "path":"/product/classification/class_attribute"
    }, {
        "id":"ab776765-2045-4c0b-819d-497a435c018c",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "定制单品管理",
        "path":"/product/format/custom_single"
    },{
        "id":"ab776766-2045-4c0b-819d-497a435c018c",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "定制套装管理",
        "path":"/product/format/custom_series"
    },
    {
        "id":"9a3ee0bb-793c-11e9-b142-b82a72d7adc0",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "标准原料管理",
        "path":"/product/custom_attrs/standard_material"
    },
    {
        "id":"9a3ee0cc-793c-11e9-b142-b82a72d7adc0",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "标准工艺管理",
        "path":"/product/custom_attrs/standard_technology"
    },
    {
        "id":"9a3ee0a4-793c-11e9-b142-b82a72d7adc0",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "制造商支持管理",
        "path":"/product/custom_attrs/supplier_support"
    },{
        "id":"e6711014-25e2-4b0f-8699-b6c2682b6b67",
        "name":"内容创作",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_creation.png")
    },{
        "id":"abf2aa8d-2973-435c-87d5-0bff9bd03b04",
        "name":"内容素材管理",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_content_management.png")
    },{
        "id":"14aac737-8b4f-4e59-b565-82f85da2296d",
        "name":"运营模块管理",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_operation.png")
    },{
        "id":"34d54c61-d1ae-432d-aa28-66d2a565f6c0",
        "name":"内容风控",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_wind_control.png")
    },{
        "id":"2d9cb122-6895-47c8-af23-e7e888a9f2a6",
        "name":"数据分析",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_data_analysis.png")
    },{
        "id":"6337fb42-7b1e-4926-8585-2f6636aed28f",
        "name":"内容配置",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_conten_configuration.png")
    },{
        "id":"49bd25d3-a8cd-43d8-9624-19b6faad3870",
        "pid":"f9217505-c06f-4763-bd28-fa0dfd814f92",
        "name": "男装小程序模块管理",
        "path":"/content/operate/mini_program"
    },
    {
        "id":"0fbec1ad-aad2-11e9-a22d-0242ac110002",
        "pid":"f9217505-c06f-4763-bd28-fa0dfd814f92",
        "name": "女装小程序模块管理",
        "path":"/content/operate/mini_women"
    },
    {
        "id":"19d9c926-d4f1-4e2a-b954-a15af5e12252",
        "pid":"f9217505-c06f-4763-bd28-fa0dfd814f92",
        "name": "内容发布",
        "path":"/content/create/release"
    },
    {
        "id":"c8f3f6a2-28b8-429d-8ef1-2032e250aef6",
        "pid":"f9217505-c06f-4763-bd28-fa0dfd814f92",
        "name": "内容管理",
        "path":"/content/manage/content_manage"
    },
    {
        "id":"62a05349-563a-4285-807c-365774060eab",
        "pid":"f9217505-c06f-4763-bd28-fa0dfd814f92",
        "name": "素材管理",
        "path":"/content/manage/material_manage"
    },
    {
        "id":"ad8aa081-bb43-41d0-be6c-32cf15dc41f0",
        "pid":"f9217505-c06f-4763-bd28-fa0dfd814f92",
        "name": "内容审核",
        "path":"/content/risk/examine"
    },
    {
        "id":"8fb3d149-cacf-46b0-9d22-ffeae76ac48d",
        "pid":"f9217505-c06f-4763-bd28-fa0dfd814f92",
        "name": "内容分析",
        "path":"/content/analysis/content_analysis"
    },
    {
        "id":"3b47a164-4aeb-484c-96a2-f213d0c52ab4",
        "pid":"f9217505-c06f-4763-bd28-fa0dfd814f92",
        "name": "内容分类",
        "path":"/content/configure/content_class"
    },
    {
        "id":"4b8f39e5-bb6e-4249-b5e1-5bd5df9c8844",
        "pid":"f9217505-c06f-4763-bd28-fa0dfd814f92",
        "name": "素材分类",
        "path":"/content/configure/material_class"
    },
    {
        "id":"9422ab76-cae0-4da8-8681-b2721a222c25",
        "name":"客户管理",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_crm.png")
    },
    {
        "id":"c44061e9-85cd-11e9-bc97-0242ac110003",
        "name":"客户数据配置",
        "path":null,
        "icon":require("../assets/lss_icon/lss_icon_crmdata.png")
    },
    {
        "id":"01a62b4f-3951-4fde-a958-ba14e87fed0b",
        "pid":"ea254aa0-7aef-11e9-b142-b82a72d7adc0",
        "name": "客户列表",
        "path":"/crm/customer/customer_list"
    },
    {
        "id":"866649b1-a1b5-49b5-82e1-7270dc4caca8",
        "pid":"ea254aa0-7aef-11e9-b142-b82a72d7adc0d",
        "name": "测量项管理",
        "path":"/crm/measurement/measure_item"
    },
    {
        "id":"f44414c9-7c74-4ac4-9849-23446c9822a8",
        "pid":"ea254aa0-7aef-11e9-b142-b82a72d7adc0",
        "name": "体型特征管理",
        "path":"/crm/bodyfeatures/bodyfeatures_list"
    },
    {
        "id":"297cd2bb-98ae-11e9-a578-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "零售门店信息列表",
        "path":"/store/store/store_info_list"
    },
    {
        "id":"297e7d4a-98ae-11e9-a578-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "零售门店人员列表",
        "path":"/store/store/store_People_list"
    },
    {
        "id":"298008e9-98ae-11e9-a578-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "商品库存汇总查询",
        "path":"/store/inventory/store_inventory_list"
    },
    {
        "id":"2980e6bd-98ae-11e9-a578-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "盘点差异记录查询",
        "path":"/store/inventory/check_record_list"
    },
    {
        "id":"29815b69-98ae-11e9-a578-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "商品出入库日志查询",
        "path":"/store/inventory/store_log_list"
    },
    {
        "id":"2981ee97-98ae-11e9-a578-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "门店销售订单列表",
        "path":"/store/order/storeSell_order_list"
    },
    {
        "id":"29828c1f-98ae-11e9-a578-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "门店销售退货单列表",
        "path":"/store/order/sendBck_order_list"
    },
    {
        "id":"2983ae06-98ae-11e9-a578-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "门店配货单列表",
        "path":"/store/distribution/distribution_list",
        "component": "/collocation/distribution/distribution_list"
    },
    {
        "id":"2984e66d-98ae-11e9-a578-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "门店收货单列表",
        "path":"/store/receive_goods/receive_goods_list",
        "component":"/collocation/receive_goods/receive_goods_list"
    },
    {
        "id":"2986f574-98ae-11e9-a578-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "门店返货单列表",
        "path":"/store/other_bill/back_goods_list",
        "component": "/OS/store/other_bill/back_goods_list"
    },
    {
        "id":"29877a24-98ae-11e9-a578-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "顾客预约单列表",
        "path":"/store/order/appointment_order_list"
    },
    {
        "id":"298817b6-98ae-11e9-a578-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "门店盘点单列表",
        "path":"/store/order/store_check_list"
    },
    {
      "id":"16b7112f-db6c-11e9-a898-0242ac110002",
      "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
      "name": "门店调拨单列表",
      "path":"/store/transfer_slip/transfer_slip_list",
      "component": "/collocation/transfer_slip/transfer_slip_list"
    },
    {
      "id":"16b711a1-db6c-11e9-a898-0242ac110002",
      "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
      "name": "门店调出单列表",
      "path":"/store/out_goods/out_goods_list",
      "component": "/OS/store/out_goods/out_goods_list"
    },
    {
        "id":"44145028-98af-11e9-a578-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "门店业绩综合查询",
        "path":"/store/data/store_performance_list"
    },
    {
        "id":"656293bb-bf43-11e9-a68e-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "门店会员数据分析",
        "path":"/store/data/store_member_list"
    },
    {
        "id":"65629438-bf43-11e9-a68e-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "存货商品结构分析",
        "path":"/store/data/goods_inventory_list"
    },
    {
        "id":"6562945b-bf43-11e9-a68e-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "销售商品结构分析",
        "path":"/store/data/goods_sell_list"
    },
    {
        "id":"6562947a-bf43-11e9-a68e-0242ac110002",
        "pid":"3b11962c-7af0-11e9-b142-b82a72d7adc0",
        "name": "门店经营数据分析",
        "path":"/store/data/store_run_list"
    },
    {
        "id":"ba233b2b-9c72-11e9-9d22-0242ac110002",
        "pid":"38214800-7939-11e9-b142-b82a72d7adc0",
        "name": "增值服务配置",
        "path":"/product/added_services/config_added_services"
    },{
        "id":"5b7c74a2-a2c2-11e9-a22d-0242ac110002",
        "pid":"5b7c7101-a2c2-11e9-a22d-0242ac110002",
        "name": "匹配标签库",
        "path":"/collocation/tag/tag_matching"
    },{
        "id":"5b7c7614-a2c2-11e9-a22d-0242ac110002",
        "pid":"5b7c7101-a2c2-11e9-a22d-0242ac110002",
        "name": "标签分组",
        "path":"/collocation/tag/tag_group"
    },
    {
        "id":"5b7c7787-a2c2-11e9-a22d-0242ac110002",
        "pid":"5b7c7101-a2c2-11e9-a22d-0242ac110002",
        "name": "门店配货",
        "path":"/collocation/distribution/distribution_list"
    },
    {
        "id":"5b7c7903-a2c2-11e9-a22d-0242ac110002",
        "pid":"5b7c7101-a2c2-11e9-a22d-0242ac110002",
        "name": "门店返货",
        "path":"/collocation/back_goods/back_goods_list"
    },
    {
        "id":"3947cd0b-d2a9-11e9-a898-0242ac110002",
        "pid":"5b7c7101-a2c2-11e9-a22d-0242ac110002",
        "name": "门店调拨",
        "path":"/collocation/transfer_slip/transfer_slip_list"
    },
    {
        "id":"a68036a3-e5d8-425b-8a7f-85beed16a524",
        "pid":"d9d9dbc6-0955-428c-97f8-1be1949f11e8",
        "name": "对账周期设置",
        "path":"/fmis/cycle/cycle"
    },
    {
        "id":"f2214c58-ebc6-11e9-a898-0242ac110002",
        "pid":"d9d9dbc6-0955-428c-97f8-1be1949f11e8",
        "name": "商家收款设置",
        "path":"/fmis/secretkey/secretkey"
    },
    {
        "id":"49480dc6-65e7-49af-a644-eaa8144b5fae",
        "pid":"65e81614-9be3-40d1-9209-871cf112306b",
        "name": "门店待对账",
        "path":"/fmis/store/billwait/bill_wait"
    },
    {
        "id":"f6e253e0-e243-4020-9194-5c4120a6550f",
        "pid":"65e81614-9be3-40d1-9209-871cf112306b",
        "name": "门店已对账",
        "path":"/fmis/store/billyet/bill_yet"
    },
    {
        "id":"48ecddf0-3b38-4050-813b-924a058cf817",
        "pid":"65e81614-9be3-40d1-9209-871cf112306b",
        "name": "渠道收款对账",
        "path":"/fmis/other/channelReceipt/channel_receipt"
    },
    {
        "id":"205659a0-7e5d-42ad-90db-1f7f91d4ffdc",
        "pid":"65e81614-9be3-40d1-9209-871cf112306b",
        "name": "代销贷款对账",
        "path":"/fmis/other/saleLoan/sale_loan"
    },
    {
        "id":"feb00b3c-4302-4f8b-94c8-49a5abd63fc0",
        "pid":"65e81614-9be3-40d1-9209-871cf112306b",
        "name": "网销收款对账",
        "path":"/fmis/other/ditchReceipt/ditch_receipt"
    },
    {
        "id":"bd3d9d17-6c9a-4dc4-9e9c-a40ad7b79931",
        "pid":"65e81614-9be3-40d1-9209-871cf112306b",
        "name": "门店交易明细",
        "path":"/fmis/detail/storeTrad/store_trad"
    },
    {
        "id":"b39bda35-f705-4a6f-b20b-fd71facd66ec",
        "pid":"65e81614-9be3-40d1-9209-871cf112306b",
        "name": "门店贷款明细",
        "path":"/fmis/detail/storeLoan/store_loan"
    },
    {
        "id":"395021e6-54c2-4186-bc66-92202d22a611",
        "pid":"65e81614-9be3-40d1-9209-871cf112306b",
        "name": "渠道交易明细",
        "path":"/fmis/detail/channelTrad/channel_trad"
    },
    {
        "id":"08951f07-6ccf-46aa-94c7-c8f7c4accf2b",
        "pid":"65e81614-9be3-40d1-9209-871cf112306b",
        "name": "网销交易明细",
        "path":"/fmis/detail/ditchTrad/ditch_trad"
    },
    {
        "id":"c47f1f70-d2a9-11e9-a898-0242ac110002",
        "pid":"88d47d37-d2a9-11e9-a898-0242ac110002",
        "name": "海报管理",
        "path":"/market/poster/market_poster_list"
    },
    {
        "id":"c47f1fe2-d2a9-11e9-a898-0242ac110002",
        "pid":"88d47d5d-d2a9-11e9-a898-0242ac110002",
        "name": "折扣管理",
        "path":"/market/discount/discount_manage_list"
    },
    {
      
        "id":"13d76c20-e976-11e9-a898-0242ac110002",
        "pid":"13d76ba9-e976-11e9-a898-0242ac110002",
        "name": "卡券管理",
        "path":"/market/coupon/coupon_list"
    },
    {
        "id":"558087e6-e267-11e9-a898-0242ac110002",
        "pid":"55808785-e267-11e9-a898-0242ac110002",
        "name": "门店装修",
        "path":"/market/decorate/store_decorate_list"
    },
    {
        "id":"297c3035-0783-11ea-a898-0242ac110002",
        "pid":"297c2fae-0783-11ea-a898-0242ac110002",
        "name": "发货单管理",
        "path":"/warehouse/warehouse_center/warehouse_manager/send_order/send_order_list"
    },
    {
        "id":"297c3053-0783-11ea-a898-0242ac110002",
        "pid":"297c2fae-0783-11ea-a898-0242ac110002",
        "name": "收货单管理",
        "path":"/warehouse/warehouse_center/warehouse_manager/receive_order/receive_order_list"
    },
    {
        "id":"297c309d-0783-11ea-a898-0242ac110002",
        "pid":"297c2fae-0783-11ea-a898-0242ac110002",
        "name": "仓库管理",
        "path":"/warehouse/warehouse_center/router_set/warehouse_manager/warehouse_manager_list"
    },
    {
        "id":"297c30c8-0783-11ea-a898-0242ac110002",
        "pid":"297c2fae-0783-11ea-a898-0242ac110002",
        "name": "货主管理",
        "path":"/warehouse/warehouse_center/router_set/owner_manager/owner_manager_list"
    },
    {
        "id":"297c30fb-0783-11ea-a898-0242ac110002",
        "pid":"297c2fae-0783-11ea-a898-0242ac110002",
        "name": "承运商管理",
        "path":"/warehouse/warehouse_center/router_set/cerrier_manager/cerrier_manager_list"
    },
    {
        "id":"2e6f4dc7-f180-11e9-a898-0242ac110002",
        "pid":"2e6f4d65-f180-11e9-a898-0242ac110002",
        "name": "TOB订单管理",
        "path":"/warehouse/order_center/order_manager/tob_order/tob_order_list"
    },
    {
        "id":"2e6f4dd4-f180-11e9-a898-0242ac110002",
        "pid":"2e6f4d65-f180-11e9-a898-0242ac110002",
        "name": "TOC订单管理",
        "path":"/warehouse/order_center/order_manager/toc_order/toc_order_list"
    },
    {
        "id":"2e6f4df5-f180-11e9-a898-0242ac110002",
        "pid":"2e6f4d65-f180-11e9-a898-0242ac110002",
        "name": "拆单策略",
        "path":"/warehouse/order_center/separate_manager/separate_manager_list"
    },
    {
        "id":"2e6f4e22-f180-11e9-a898-0242ac110002",
        "pid":"2e6f4e0a-f180-11e9-a898-0242ac110002",
        "name": "中心库存查询",
        "path":"/warehouse/stock_center/stock_manager/stock_manager_list"
    }
]
