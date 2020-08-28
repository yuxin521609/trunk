//订单管理
export default {
    path: '/warehouse',
    name: 'warehouse',
    component: resolve => require(["@/views/index"], resolve),
    children: [
        //库存对账管理
        {
            path: '/warehouse/stock_center/stock_manager/stock_statement_list',
            name: 'stock_statement_list',
            component: resolve => require(["@/views/warehouse/stock_center/stock_manager/stock_statement_list"], resolve),
            meta: {
                title: '库存同步',
                backBtn:false
            }
        },
        //仓库同步-新添加
        {
            path: '/warehouse/stock_center/stock_manager/warehouse_list',
            name: 'warehouse_list',
            component: resolve => require(["@/views/warehouse/stock_center/stock_manager/warehouse_list"], resolve),
            meta: {
                title: '仓库同步',
                backBtn:false
            }
        },
    ]
}