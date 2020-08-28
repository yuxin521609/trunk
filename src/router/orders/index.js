//订单管理
export default[{
    path: '/orders',
    name: 'orders',
    component: resolve => require(["@/views/index"], resolve),
    children:[
        //入库单
        {
            path: '/OS/business/purchase/joinLibraryOrder_check',
            name: 'joinLibraryOrder_check',
            component: resolve => require(["@/views/orders/business/purchase/joinLibraryOrder_check.vue"], resolve),
            meta: {
                title: '查看入库单'
            }
        },
        //到货单
        {
            path: '/OS/business/purchase/arrivalNotice_check',
            name: 'arrivalNotice_check',
            component: resolve => require(["@/views/orders/business/purchase/arrivalNotice_check.vue"], resolve),
            meta: {
                title: '查看到货单'
            }
        },
        {
            path: '/OS/business/purchase/arrivalNotice_add',
            name: 'arrivalNotice_add',
            component: resolve => require(["@/views/orders/business/purchase/arrivalNotice_add.vue"], resolve),
            meta: {
                title: '新增到货单'
            }
        },
        //到货单-查看质检报告
        {
            path: '/OS/business/purchase/arrivalNotice_report',
            name: 'arrivalNotice_check_report',
            component: resolve => require(["@/views/orders/business/purchase/arrivalNotice_report.vue"], resolve),
            meta: {
                title: '质检报告'
            }
        },
        //采购订单
        {
            path: '/OS/business/purchase/purchaseOrder_add',
            name: 'procureOrder_add',
            component: resolve => require(["@/views/orders/business/purchase/purchaseOrder_add.vue"], resolve),
            meta: {
                title: '新增采购订单'
            }
        },
        {
            path: '/OS/business/purchase/purchaseOrder_check',
            name: 'show_procureOrder_check',
            component: resolve => require(["@/views/orders/business/purchase/purchaseOrder_check.vue"], resolve),
            meta: {
                title: '查看采购订单'
            }
        },
        {
            path: '/OS/business/purchase/purchaseOrder_editor',
            name: 'show_procureOrder_editor',
            component: resolve => require(["@/views/orders/business/purchase/purchaseOrder_editor.vue"], resolve),
            meta: {
                title: '修改采购订单'
            }
        },
        {
            path: '/OS/business/purchase/procureOrder_shop',
            name: 'procureOrder_shop',
            component: resolve => require(["@/views/orders/business/purchase/purchaseOrder_shop.vue"], resolve),
            meta: {
                title: '选择商品'
            }
        },
        {
            //采购退货单-新增
            path:'/OS/business/purchaseReturn/purchaseReturn_add',
            name:'purchaseReturn_add',
            component: resolve => require(['@/views/orders/business/purchaseReturn/purchaseReturn_add.vue'],resolve),
            meta:{
                title:'新增采购退货单',
            }
        },
        {
            //采购退货单-选择商品
            path:'/OS/business/purchaseReturn/purchaseReturn_shop',
            name:'purchaseReturn_shop',
            component: resolve => require(['@/views/orders/business/purchaseReturn/purchaseReturn_shop.vue'],resolve),
            meta:{
                title:'选择商品',
            }
        },
        {
            //采购退货单-查看详情
            path:'/OS/business/purchaseReturn/purchaseReturn_check',
            name:'purchaseReturn_check',
            component: resolve => require(['@/views/orders/business/purchaseReturn/purchaseReturn_check.vue'],resolve),
            meta:{
                title:'采购退货单详情',
            }
        },
        {
            //渠道销售-新增
            path:'/OS/channelSales/channelSales_add',
            name:'channelSales_add',
            component:resolve => require(['@/views/OS/channelSales/channelSales_add.vue'],resolve),
            meta:{
                title:'新增'
            }
        },
        {
            //渠道销售-查看详情
            path:'/OS/channelSales/channelSales_check',
            name:'channelSales_check',
            component: resolve => require(['@/views/OS/channelSales/channelSales_check.vue'],resolve),
            meta:{
                title:'订单详情',
            }
        },
        {
            //渠道销售-修改界面
            path:'/OS/channelSales/channelSales_editor',
            name:'show_channelSales_editor',
            component: resolve => require(['@/views/OS/channelSales/channelSales_editor.vue'],resolve),
            meta:{
                title:'修改订单',
            }
        },
        {
            //渠道销售-选择商品
            path:'/OS/channelSales/channelSales_shop',
            name:'channelSales_shop',
            component: resolve => require(['@/views/OS/channelSales/channelSales_shop.vue'],resolve),
            meta:{
                title:'选择商品',
            }
        },
        {
            //渠道退货-新增
            path:'/OS/salesReturn/channelReturn/channelReturn_add',
            name:'channelReturn_add',
            component: resolve => require(['@/views/OS/salesReturn/channelReturn/channelReturn_add.vue'],resolve),
            meta:{
                title:'新增渠道退货单',
            }
        },
        {
            //渠道退货-选择商品
            path:'/OS/salesReturn/channelReturn/channelReturn_shop',
            name:'channelReturn_shop',
            component: resolve => require(['@/views/OS/salesReturn/channelReturn/channelReturn_shop.vue'],resolve),
            meta:{
                title:'选择商品',
            }
        },
        {
            //渠道退货-查看详情
            path:'/OS/salesReturn/channelReturn/channelReturn_check',
            name:'channelReturn_check',
            component: resolve => require(['@/views/OS/salesReturn/channelReturn/channelReturn_check.vue'],resolve),
            meta:{
                title:'渠道退货单详情',
            }
        },
        {
            //渠道退货-修改
            path:'/show_channelReturn_editor',
            name:'show_channelReturn_editor',
            component: resolve => require(['@/views/OS/salesReturn/channelReturn/channelReturn_editor.vue'],resolve),
            meta:{
                title:'修改渠道退货单',
            }
        },
        {
            //渠道网销-新增
            path:'/OS/ditch/ditch_add',
            name:'ditch_add',
            component:resolve => require(['@/views/OS/ditch/ditch_add.vue'],resolve),
            meta:{
                title:'新增'
            }
        },
        {
            //财务系统-对账周期配置(临时放在这里)
            path:'/cycle_list',
            name:'cycle_list',
            component:resolve => require(['@/views/fmis/cycle/cycle.vue'],resolve),
            meta:{
                title:'对账周期设置'
            }
        },
        {
            //渠道网销-查看详情
            path:'/OS/ditch/ditch_check',
            name:'ditch_check',
            component: resolve => require(['@/views/OS/ditch/ditch_check.vue'],resolve),
            meta:{
                title:'订单详情',
            }
        },
        {
            //渠道网销-修改界面
            path:'/OS/ditch/ditch_editor',
            name:'ditch_editor',
            component: resolve => require(['@/views/OS/ditch/ditch_editor.vue'],resolve),
            meta:{
                title:'修改订单',
            }
        },
        {
            //渠道网销-选择商品
            path:'/OS/ditch/select_shop',
            name:'select_shop',
            component: resolve => require(['@/views/OS/ditch/select_shop.vue'],resolve),
            meta:{
                title:'选择商品'
            }
        },
        {
            //网销退货-新增
            path:'/OS/salesReturn/ditchReturn/ditchReturn_add',
            name:'show_ditchReturn_add',
            component: resolve => require(['@/views/OS/salesReturn/ditchReturn/ditchReturn_add.vue'],resolve),
            meta:{
                title:'新增网销退货单',
            }
        },
        {
            //网销退货-选择商品
            path:'/OS/salesReturn/ditchReturn/ditchReturn_shop',
            name:'ditchReturn_shop',
            component: resolve => require(['@/views/OS/salesReturn/ditchReturn/ditchReturn_shop.vue'],resolve),
            meta:{
                title:'选择商品',
            }
        },
        {
            //网销退货-查看详情
            path:'/OS/salesReturn/ditchReturn/ditchReturn_check',
            name:'ditchReturn_check',
            component: resolve => require(['@/views/OS/salesReturn/ditchReturn/ditchReturn_check.vue'],resolve),
            meta:{
                title:'网销退货单详情',
            }
        },
        {
            //网销退货-修改
            path:'/show_ditchReturn_editor',
            name:'show_ditchReturn_editor',
            component: resolve => require(['@/views/OS/salesReturn/ditchReturn/ditchReturn_editor.vue'],resolve),
            meta:{
                title:'修改网销退货单',
            }
        },
        {
            //入库单-详情
            path: '/OS/stockOrder/putOrder/putOrder_check',
            name: 'putOrder_check',
            component: resolve => require(["@/views/OS/stockOrder/putOrder/putOrder_check.vue"], resolve),
            meta: {
                title: '入库单详情'
            }
        },
        {
            //出库单-详情
            path: '/OS/stockOrder/outOrder/outOrder_check',
            name: 'outOrder_check',
            component: resolve => require(["@/views/OS/stockOrder/outOrder/outOrder_check.vue"], resolve),
            meta: {
                title: '出库单详情'
            }
        },
        {
            path: '/OS/store/other_bill/back_goods_details',
            name: 'other_bill_back_goods_details',
            component: resolve => require(["@/views/OS/store/other_bill/BackGoodsDetails.vue"], resolve),
            meta: {
                title: '返货单详情'
            }
        },
        {
            path: '/OS/store/out_goods/out_goods_details',
            name: 'out_goods_out_goods_details',
            component: resolve => require(["@/views/OS/store/out_goods/out_goods_details.vue"], resolve),
            meta: {
                title: '调出单详情'
            }
        }
    ]


}]
