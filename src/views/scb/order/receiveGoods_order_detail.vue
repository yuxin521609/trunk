<style lang="less" scoped>
.sub-order{
  font-size: 18px;
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
.image{
  width: 45px;
  height: 45px;
}
</style>
<template>
  <div>
    <div class="transfer-slip-details item-margin item-cont">
      <h4 class="h4">收货信息</h4>
      <ul class="text-info">
        <li>收货单号：{{ getOrderDetails_obj.receiveNum }}</li>
        <li>单据状态：{{ getOrderDetails_obj.receiveStatus }}</li>
        <li>应收件数：{{ getOrderDetails_obj.planNum }}</li>
        <li>关联单号：{{ getOrderDetails_obj.allotNum }}</li>

        <li>收货类型：{{ getOrderDetails_obj.sourceName }}</li>
        <li>出货方：{{ getOrderDetails_obj.allotNum }}</li>
        <li>实收件数：{{ getOrderDetails_obj.realityNum  }}</li>
        <li>实收商品货值：{{ getOrderDetails_obj.amount }}</li>

        <li>物流公司：{{ getOrderDetails_obj.logisticsCompany || '--' }}</li>
        <li>物流单号：{{ getOrderDetails_obj.logisticsNum || '--' }}</li>
        <li>收货人：{{ getOrderDetails_obj.receiveMan }}</li>
        <li>收货时间：{{ getOrderDetails_obj.receiveTime  }}</li>
      </ul>
      <h4 class="goods-info">收货商品信息</h4>
      <page-table :form-data="productFormData" :get-data="getGoodsData" :table-data="getGoodsData_obj.dataList">
        <el-table
          :data="getGoodsData_obj.dataList.data"
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
            <template slot-scope="scope"><img class="image" :src="scope.row.image" alt=""></template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="品牌" min-width="70">
            <template slot-scope="scope">{{ scope.row.brandName || '--' }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="吊牌价" min-width="70">
            <template slot-scope="scope">{{ scope.row.retailPrice || '--' }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="结算单价" min-width="70">
            <template slot-scope="scope">{{ scope.row.purchasePrice|| '--' }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="应收数量" min-width="70">
            <template slot-scope="scope">{{ scope.row.planQuantity|| '--' }}</template>
          </el-table-column>
          <el-table-column align="left" :show-overflow-tooltip="true" label="实收数量" min-width="70">
            <template slot-scope="scope">{{ scope.row.realityQuantity|| '--' }}</template>
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
      orderStarusType: {
        2: "待收货",
        3: "已完成"
      },
      getOrderDetails_obj:{},
      getGoodsData_obj:{},
      orderStarusType:{
        100:'主单待编辑',
        101:'主单待审核',
        102:'主单待发货',
        103:'主单部分已发货',
        104:'主单异常完成',
        105:'主单已完成',
        106:'主单已作废'
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
      this.getOrderDetails();
      this.getGoodsData();
    },
    // 获取详情
    getOrderDetails() {
      this.request(
        this.api.scb.receiveGoods_getByReceiveNum,
        {
          receiveNum:this.$route.query.receiveNum
        }
      ).then(data => {
        this.getOrderDetails_obj = data;
        data.receiveStatus = this.statusToName(data.receiveStatus);
        data.receiveTime = this.$options.filters.timestampToTime(data.receiveTime);
      });
    },
    // 获取详情
    getGoodsData() {
      Object.assign(this.productFormData, {
        orderSn: this.$route.query.receiveNum
      });
      this.request(
        this.api.scb.receiveProductInfo_list,
        this.productFormData
      ).then(data => {
        this.getGoodsData_obj = data;
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
