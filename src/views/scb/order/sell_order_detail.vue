<style lang="less" scoped>
.sub-order{
  font-size: 18px;
  color: #409EFf;
}
/deep/ .orderColor{
  color: #409EFf;
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
  .image{
    width: 45px;
    height: 45px;
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
      <h4 class="h4">主订单编号：{{ transferSlipGoodsInfo.purchaseOrderDTO.purchaseOrderNum }}<el-button class="ml-20" size="mini" type="primary" disabled plain>{{ orderStarusType[transferSlipGoodsInfo.purchaseOrderDTO.purchaseOrderStatus]  }}</el-button></h4>
      <ul class="text-info">
        <li>收货人：{{ transferSlipGoodsInfo.purchaseOrderDTO.receiveMan }}</li>
        <li>联系电话：{{ transferSlipGoodsInfo.purchaseOrderDTO.phone }}</li>
        <li>订单商品数量：{{ transferSlipGoodsInfo.purchaseOrderDTO.productQty }}</li>
        <li>创建时间：{{ transferSlipGoodsInfo.purchaseOrderDTO.createTime }}</li>
        <li>实发数量：{{ transferSlipGoodsInfo.purchaseOrderDTO.actualSendSumQty }}</li>
        <li>收货地址：{{ transferSlipGoodsInfo.purchaseOrderDTO.provinceName }} {{ transferSlipGoodsInfo.purchaseOrderDTO.cityName }} {{ transferSlipGoodsInfo.purchaseOrderDTO.areaName }} {{ transferSlipGoodsInfo.purchaseOrderDTO.addressInfo }}</li>
        <li>备注：{{ transferSlipGoodsInfo.purchaseOrderDTO.remark || '--' }}</li>
      </ul>
      <!-- <h5 class="ml-10">关联子订单号：<span class="sub-order">{{ 1019121119231022838}}</span>（已完成）</h5> -->
      <h4 class="goods-info">订单商品信息</h4>
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
              <img class="image" :src="scope.row.image" alt="">
            </template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="颜色" min-width="70">
            <template slot-scope="scope">{{ scope.row.color }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="规格" min-width="70">
            <template slot-scope="scope">{{ scope.row.size }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="品牌" min-width="70">
            <template slot-scope="scope">{{ scope.row.brandName }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="吊牌单价" min-width="70">
            <template slot-scope="scope">{{ scope.row.price }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="结算单价" min-width="70">
            <template slot-scope="scope">{{ scope.row.modifyPrice }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="销售数量" min-width="70">
            <template slot-scope="scope">{{ scope.row.skuModifyQuantity }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="实发数量" min-width="70">
            <template slot-scope="scope">{{ scope.row.actualSendQty }}</template>
          </el-table-column>
        </el-table>
      </page-table>
    </div>
    <div class="transfer-slip-details item-margin item-cont" v-if="purchaseOrderLogs && purchaseOrderLogs.length > 0">
      <div>订单进程：</div>
      <div class="block mt-20">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in purchaseOrderLogs"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :color="activity.color"
            :size="activity.size"
            v-html="activity.content">
          </el-timeline-item>
        </el-timeline>
      </div>
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
      purchaseOrderLogs:[],
      orderStarusType:{
        100:'待编辑',
        101:'待审核',
        102:'待发货',
        103:'部分已发货',
        104:'异常完成',
        105:'已完成',
        106:'已作废'
      },
      // 路由参数
      _id: "",
      // 请求参数
      productFormData: {
        pageIndex: 1,
        pageSize: 10
      },
      // 单据状态
      billType: this.$common.getBillType("transferSlip"),
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
        this.api.scb.purchaseOrder_getDTOByOrderId,
        {orderId: this._id}
      ).then(data => {
        this.transferSlipGoodsInfo = data;
        data.purchaseOrderDTO.createTime = this.$options.filters.timestampToTime(data.purchaseOrderDTO.createTime);
        data.data = data.purchaseOrderProductDTOS;
        this.purchaseOrderLogs = data.purchaseOrderLogs;
        data.purchaseOrderLogs.forEach((item, index) => {
          item.createTime = this.$options.filters.timestampToTime(item.createTime);
          item.content = item.content.replace(/\d{10,}/g, (items) => {
            return `<span class="orderColor">${items}</span>`;
          })
          item.content = 
          `<div class="el-timeline-item__tail"></div>
           <div class="el-timeline-item__node el-timeline-item__node--large el-timeline-item__node--primary">
            <i class="el-timeline-item__icon el-icon-more"></i>
            </div>
            <!----><div class="el-timeline-item__wrapper"><!---->
            <div class="el-timeline-item__content">${item.createTime}&nbsp;&nbsp;&nbsp;&nbsp;${item.content}</div>
            <div class="el-timeline-item__timestamp is-bottom"></div>
            </div>`
        });
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
