<style lang="less" scoped>
  .receive-goods-details{background: #fff;
    h4{padding-bottom: 20px;}
    .text-info{
      li{line-height: 32px;margin-bottom: 18px;}
    }
    .goods-info{padding-top: 30px;}
    .text-length{position: relative;
      .text-info{position: absolute;left: 0;top: 0;padding-left: 75px;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
    }
  }
</style>
<template>
  <div class="receive-goods-details item-margin item-cont">
    <h4>收货信息</h4>
    <el-row :gutter="20">
      <el-col :span="6">
        <ul class="text-info">
          <li>收货门店：{{ receiveGoodsInfo.storeName }}</li>
          <li>配货机构：{{ receiveGoodsInfo.organizationName }}</li>
          <li>物流公司：{{ receiveGoodsInfo.logisticsCompany }}</li>
        </ul>
      </el-col>
      <el-col :span="6">
        <ul class="text-info">
          <li>收货状态：{{ statusToName(receiveGoodsInfo.receiveStatus) }}</li>
          <li>配货人：{{ receiveGoodsInfo.allotMan }}</li>
          <li class="text-length">物流单号：
            <div class="text-info">
              <el-tooltip
                  effect="dark"
                  :content="receiveGoodsInfo.logisticsNum"
                  placement="top"
              >
                <span> {{ receiveGoodsInfo.logisticsNum ? receiveGoodsInfo.logisticsNum : '--' }}</span>
              </el-tooltip>
            </div>
          </li>
        </ul>
      </el-col>
      <el-col :span="6">
        <ul class="text-info">
          <li>应收件数 ：{{ receiveGoodsInfo.planNum }}</li>
          <li>配货时间：{{ receiveGoodsInfo.allotTime | timestampToTime }}</li>
          <li>收货人 ：{{ receiveGoodsInfo.receiveMan }}</li>
        </ul>
      </el-col>
      <el-col :span="6">
        <ul class="text-info">
          <li>配货单号：{{ receiveGoodsInfo.allotNum }}</li>
          <li>发货时间：{{ receiveGoodsInfo.createTime | timestampToTime }}</li>
          <li>收货时间：{{ receiveGoodsInfo.receiveTime | timestampToTime }}</li>
        </ul>
      </el-col>
    </el-row>
    <h4 class="goods-info">收货商品信息</h4>
    <page-table :form-data="productFormData" :get-data="getReceiveProductInfoList" :table-data="tableData">
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column prop="goodsCode" label="商品货号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <image-popover :img-src="scope.row.image"></image-popover>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="retailPrice" label="吊牌价"></el-table-column>
        <el-table-column prop="purchasePrice" label="销售单价"></el-table-column>
        <el-table-column label="配货金额">
          <template slot-scope="scope" v-if="scope.row.purchasePrice && scope.row.planQuantity">
            {{ (scope.row.planQuantity * Number(scope.row.purchasePrice)).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="planQuantity" label="应收数量"></el-table-column>
        <el-table-column prop="realityQuantity" label="实收数量"></el-table-column>
      </el-table>
    </page-table>
  </div>
</template>
<script>
  import PageTable from "@/views/collocation/components/PageTable.vue";
  import ImagePopover from "@/views/collocation/components/ImagePopover";
  export default {
    name: '',
    // 数据
    data() {
      return {
        // 路由参数
        _id: '',
        // 请求参数
        productFormData: {
          orderSn: null,
          pageIndex: 1,
          pageSize: 10
        },
        // 单据状态
        billType: this.$common.getBillType('receive'),
        // 配货单信息
        receiveGoodsInfo: {},
        // 表格数据
        tableData: {},
      }
    },
    // 组件
    components: {
      PageTable,
      ImagePopover
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getQueryParams();
        this.getReceiveGoods();
        this.getReceiveProductInfoList();
      })
    },
    // 方法
    methods: {
      //获取上页面参数
      getQueryParams() {
        this._id = this.$route.query.id;
        this.productFormData.orderSn =  this.$route.query.receiveNum;
      },
      // 获取详情
      getReceiveGoods(){
        this.request(this.api.retailStore.receiveGoods_get, {id: this._id}).then(data => {
          this.receiveGoodsInfo = data;
        });
      },
      // 获取商品详情
      getReceiveProductInfoList(){
        this.request(this.api.retailStore.receiveProductInfo_get, this.productFormData).then(data => {
          this.tableData = data;
        });
      },
      // 状态转name
      statusToName(val){
        if(!val && val !== 0) return;
        let item = this.billType.find(item => {
          return item.id === val;
        })
        return item.name;
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
