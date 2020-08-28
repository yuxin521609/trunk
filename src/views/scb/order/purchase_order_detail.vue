<style lang="less" scoped>
.image{
  width: 45px;
  height: 45px;
}
.sub-order{
  font-size: 22px;
  color: #409EFf;
  cursor: pointer;
}
.transfer-slip-details {
  background: #fff;
  h4 {
    padding-bottom: 20px;
  }
  .h4 {
    border-bottom: 1px solid #ebeef5;
  }
  .text-info {
    display: flex;
    width: 90%;
    flex-wrap: wrap;
    padding: 15px 10px 0 10px;
    li {
      width: 20%;
      margin-right: 30px;
      height: 55px;
      padding-bottom: 10px;
    }
  }
  .goods-info {
    padding-top: 30px;
  }
  .text-length {
    position: relative;
    .text-info {
      position: absolute;
      left: 0;
      top: 0;
      padding-left: 75px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
<template>
  <div>
    <div class="transfer-slip-details item-margin item-cont">
      <h4 class="h4">采购订单号：{{ transferSlipGoodsInfo.purchaseOrderDTO.purchaseOrderNum }}<el-button class="ml-20" size="mini" type="primary" disabled plain>{{ orderStarusType[transferSlipGoodsInfo.purchaseOrderDTO.purchaseOrderStatus]  }}</el-button></h4>
      <ul class="text-info">
        <li>供货商名称：{{ transferSlipGoodsInfo.purchaseOrderDTO.merchantName }}</li>
        <li>采购总数：{{ transferSlipGoodsInfo.purchaseOrderDTO.productQty }}</li>
        <li>订单来源：{{ purchaseType[transferSlipGoodsInfo.purchaseOrderDTO.purchaseOrderType] }}</li>

        <li>采购商品金额：{{ transferSlipGoodsInfo.purchaseOrderDTO.priceSumAmount }}</li>
        <li>结算类型：{{ tradeWayCodeType[transferSlipGoodsInfo.purchaseOrderDTO.tradeWayCode] }}</li>
        <li>实付金额：{{ transferSlipGoodsInfo.purchaseOrderDTO.purchaseSumAmount }}</li>
        <li>采购人：{{ transferSlipGoodsInfo.purchaseOrderDTO.purchaserName }}</li>

        <li>创建时间：{{ transferSlipGoodsInfo.purchaseOrderDTO._createTime }}</li>
        <li>备注：{{ transferSlipGoodsInfo.purchaseOrderDTO.remark || '--'}}</li>
      </ul>
      <h5 class="ml-10">
        <span class="mr-40" v-for="(item, index) in transferSlipGoodsInfo.receiveOrderInfo" :key="index">关联收货单：<span class="sub-order" @click="subOrder(item)">{{ item.receiveNum }}</span>（{{ statusToName(item.receiveStatus) }}）</span>
      </h5>
      <h4 class="goods-info">采购商品信息</h4>
      <!-- <page-table :form-data="productFormData" :get-data="getStoreAllotGoodsOrder" :table-data="transferSlipGoodsInfo"> -->
      <page-table :form-data="productFormData" :get-data="getPurchaseOrderProduct_listPage" :table-data="tableData">
        <el-table
          :data="tableData.data"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true">
          <el-table-column align="left" :show-overflow-tooltip="true" label="商品款号" min-width="70">
            <template slot-scope="scope">{{ scope.row.productCode || '--' }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="商品货号" min-width="70">
            <template slot-scope="scope">{{ scope.row.goodsCode || '--' }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="商品图片" min-width="70">
            <template slot-scope="scope">
              <img :src="scope.row.image" class="image" />
            </template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="商品名称" min-width="70">
            <template slot-scope="scope">{{ scope.row.goodsName || '--' }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="颜色" min-width="70">
            <template slot-scope="scope">{{ scope.row.color || '--' }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="规格" min-width="70">
            <template slot-scope="scope">{{ scope.row.size || '--' }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="品牌" min-width="70">
            <template slot-scope="scope">{{ scope.row.brandName || '--' }}</template>
          </el-table-column>
          <!-- <el-table-column align="left" :show-overflow-tooltip="true" label="原始款号" min-width="70">
            <template slot-scope="scope">{{ scope.row.price || '--' }}</template>
          </el-table-column> -->
          <el-table-column align="left" :show-overflow-tooltip="true" label="采购申请数量" min-width="70">
            <template slot-scope="scope">{{ scope.row.skuQuantity|| '--' }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="采购单价" min-width="70">
            <template slot-scope="scope">{{ scope.row.price|| '--' }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="采购数量" min-width="70">
            <template slot-scope="scope">{{ scope.row.skuModifyQuantity|| '--' }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="结算单价" min-width="70">
            <template slot-scope="scope">{{ scope.row.modifyPrice|| '--' }}</template>
          </el-table-column>
        </el-table>
      </page-table>
    </div>
  </div>
</template>
<script>
import PageTable from "@/views/collocation/components/PageTable";
import ImagePopover from "@/views/collocation/components/ImagePopover";
export default {
  name: "transfer_slip_details",
  // 组件
  components: {
    PageTable,
    ImagePopover
  },
  // 数据
  data() {
    return {
      orderStarusType:{
        100:'待编辑',
        101:'待审核',
        102:'待发货',
        103:'部分已发货',
        104:'异常完成',
        105:'已完成',
        106:'已作废'
      },
      tradeWayCodeType: {
        1: "现金",
        2: "代销"
      },
      purchaseType:{
        'MERCHANT':'配货',
        'PURCHASER':'自采'
      },
      // 路由参数
      _id: "",
      // 请求参数
      productFormData: {
        pageIndex: 1,
        pageSize: 10
      },
      // 单据状态
      billType: this.$common.getBillType("allot"),
      // 调拨单信息
      transferSlipGoodsInfo: {},
      // 表格数据
      tableData: {},
       activities: [{
          content: '支持使用图标',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        }, {
          content: '支持自定义颜色',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87'
        }, {
          content: '支持自定义尺寸',
          timestamp: '2018-04-03 20:46',
          size: 'large'
        }, {
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46'
        }]
    };
  },
  // 初始化数据
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  // 方法
  methods: {
    /**
     * 跳转到收货单详情
     */
    subOrder(row) {
      this.href('/order/receiveGoods_order_detail', {
        receiveNum:row.receiveNum
      })
    },
    /**
     * 跳转工单详情
     */
    href(routeName, param) {
        let module = this.$route.path.split('/')[1];

        this.$router.push({
          path: '/' + module + routeName,
          query: param
        })
    },
    // 初始化
    init() {
      this.getQueryParams();
      this.getStoreAllotGoodsOrder();
      this.getPurchaseOrderProduct_listPage();
    },
    // 获取上页面参数
    getQueryParams() {
      this._id = this.$route.query.id;
    },
    // 获取详情
    getStoreAllotGoodsOrder() {
      this.request(
        this.api.scb.purchaseOrder_getPurchaseDTOByOrderId,
        {orderId: this._id}
      ).then(data => {
        this.transferSlipGoodsInfo = data;
        data.purchaseOrderDTO._createTime = this.$options.filters.timestampToTime(data.purchaseOrderDTO.createTime);
        data.data = data.purchaseOrderProductDTOS;
      });
    },
    // 获取详情
    getPurchaseOrderProduct_listPage() {
      Object.assign(this.productFormData, {
        purchaseOrderId: this._id
      });
      this.request(
        this.api.scb.purchaseOrderProduct_listPage,
        this.productFormData
      ).then(data => {
        this.tableData = data;
      });
    },
    // 状态转name
    statusToName(val) {
      if (!val && val !== 0) return;
      let item = this.billType.find(item => {
        return item.id === val;
      });
      if (item) {
        return item.name;
      } else {
        return val;
      }
    },
    // 取消
    editAllotCancel() {
      // 回退到主页面;
      let module = "/" + this.$route.path.split("/")[1];
      this.$router.push({
        path: module + "/transfer_slip/transfer_slip_list"
      });
    }
  },
  // 计算属性
  computed: {},
  // 监听数据变化
  watch: {}
};
</script>
