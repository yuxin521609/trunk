//订单管理
export default [{
    path: '/fmis',
    name: 'fmis',
    component: resolve => require(["@/views/index"], resolve),
    children: [
        //门店对账
        {
            path: '/fmis/store/billwait/statement',
            name: 'statement',
            component: resolve => require(["@/views/fmis/store/billwait/statement.vue"], resolve),
            meta: {
                title: '对账'
            }
        },
         //账单明细
        {
            path: '/fmis/store/billyet/bill_yet_check',
            name: 'bill_yet_check',
            component: resolve => require(["@/views/fmis/store/billyet/bill_yet_check.vue"], resolve),
            meta: {
                title: '账单明细'
            }
        },
        //网销收款对账下的账单明细
        {
            path: '/fmis/other/ditchReceipt/ditch_receipt_check',
            name: 'ditch_receipt_check',
            component: resolve => require(["@/views/fmis/other/ditchReceipt/ditch_receipt_check.vue"], resolve),
            meta: {
                title: '网销交易明细'
            }
        },
    ]
}]
