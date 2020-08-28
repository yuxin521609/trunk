<style lang="less" scoped>
  .transfer-slip-details{background: #fff;
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
  <div class="transfer-slip-details item-margin item-cont">
    <h4>调拨信息</h4>
    <el-row :gutter="20">
      <el-col :span="6">
        <ul class="text-info">
          <li>发货门店：{{ transferSlipGoodsInfo.outStoreName }}</li>
          <li>配货人：{{ transferSlipGoodsInfo.allotMan }}</li>
          <li>收货人：{{ transferSlipGoodsInfo.receiveMan }}</li>
          <li>物流公司：{{ transferSlipGoodsInfo.logisticsCompany ? transferSlipGoodsInfo.logisticsCompany : '--' }}</li>
        </ul>
      </el-col>
      <el-col :span="6">
        <ul class="text-info">
          <li>收货门店：{{ transferSlipGoodsInfo.inStoreName }}</li>
          <li>调拨数量：{{ transferSlipGoodsInfo.quantity }}</li>
          <li>收货人电话：{{ transferSlipGoodsInfo.phone }}</li>
          <li class="text-length">物流单号：
            <div class="text-info">
              <el-tooltip
                  effect="dark"
                  :content="transferSlipGoodsInfo.logisticsOrderSn"
                  placement="top"
              >
                <span> {{ transferSlipGoodsInfo.logisticsOrderSn ? transferSlipGoodsInfo.logisticsOrderSn : '--' }}</span>
              </el-tooltip>
            </div>
          </li>
        </ul>
      </el-col>
      <el-col :span="6">
        <ul class="text-info">
          <li>单据状态：{{ statusToName(transferSlipGoodsInfo.orderStatus) }}</li>
          <li>调拨金额：¥ {{ transferSlipGoodsInfo.amount }} 元</li>
          <li>收货地址：{{ transferSlipGoodsInfo.provinceName }} {{ transferSlipGoodsInfo.cityName }} {{ transferSlipGoodsInfo.areaName }} {{ transferSlipGoodsInfo.addressInfo }}</li>

        </ul>
      </el-col>
      <el-col :span="6">
        <ul class="text-info">
          <li>创建时间：{{ transferSlipGoodsInfo.createTime | timestampToTime }}</li>
          <li>收货时间：{{ transferSlipGoodsInfo.receiveTime | timestampToTime }}</li>
          <li>发货时间：{{ transferSlipGoodsInfo.shipmentsTime | timestampToTime }}</li>
        </ul>
      </el-col>
    </el-row>
    <h4 class="goods-info">调拨商品信息</h4>
    <page-table :form-data="productFormData" :get-data="getStoreAllotOrderProductInfoList" :table-data="tableData">
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column prop="productCode" label="商品款号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="goodsCode" label="商品货号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="goodsName" label="名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <image-popover :img-src="scope.row.image"></image-popover>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="吊牌价">
          <template slot-scope="scope">
            ￥ {{ scope.row.retailPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="调拨单价">
          <template slot-scope="scope">
            ￥ {{ scope.row.allotPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="调拨数量"></el-table-column>
        <el-table-column label="调拨金额">
          <template slot-scope="scope">
            ￥ {{ (scope.row.quantity * scope.row.allotPrice).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="门店实发数量">
          <template slot-scope="scope">
            {{ scope.row.shipmentsQty !== null ? scope.row.shipmentsQty : '--' }}
          </template>
        </el-table-column>
        <el-table-column label="门店实收数量">
          <template slot-scope="scope">
            {{ scope.row.receiveQty !== null ? scope.row.receiveQty : '--' }}
          </template>
        </el-table-column>
      </el-table>
    </page-table>
    <div class="btns">
      <el-button @click="editAllotCancel" size="small">取消</el-button>
    </div>
  </div>
</template>
<script>
  import PageTable from "@/views/collocation/components/PageTable";
  import ImagePopover from "@/views/collocation/components/ImagePopover";
  export default {
    name: 'transfer_slip_details',
    // 组件
    components: {
      PageTable,
      ImagePopover
    },
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
        billType: this.$common.getBillType('transferSlip'),
        // 调拨单信息
        transferSlipGoodsInfo: {},
        // 表格数据
        tableData: {}
      }
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.init();
      })
    },
    // 方法
    methods: {
      // 初始化
      init(){
        this.getQueryParams();
        this.getStoreAllotGoodsOrder();
        this.getStoreAllotOrderProductInfoList();
      },
      // 获取上页面参数
      getQueryParams() {
        this._id = this.$route.query.id;
        this.productFormData.orderSn =  this.$route.query.orderSn;
      },
      // 获取详情
      getStoreAllotGoodsOrder(){
        this.request(this.api.order.storeAllotGoodsOrder_get, {id: this._id}).then(data => {
          this.transferSlipGoodsInfo = data;
        });
      },
      // 获取商品详情
      getStoreAllotOrderProductInfoList(){
        this.request(this.api.order.storeAllotOrderProductInfo_list, this.productFormData).then(data => {
          this.tableData = data;
        });
      },
      // 状态转name
      statusToName(val){
        if(!val && val !== 0) return;
        let item = this.billType.find(item => {
          return item.id === val;
        });
        if(item){
          return item.name;
        }else{
          return val;
        }

      },
      // 取消
      editAllotCancel(){
        // 回退到主页面;
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/transfer_slip/transfer_slip_list'
        });
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
