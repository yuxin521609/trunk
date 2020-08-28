<style lang="less" scoped>
  .back-goods-details{background: #fff;
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
  <div class="back-goods-details item-margin item-cont">
    <h4>返货信息</h4>
    <el-row :gutter="20">
      <el-col :span="6">
        <ul class="text-info">
          <li>返货门店：{{ backGoodsInfo.storeName }}</li>
          <li>发起人：{{ backGoodsInfo.createName }}</li>
          <li>物流公司：{{ backGoodsInfo.logisticsCompany }}</li>
          <li>收货仓库：{{ backGoodsInfo.warehouseName }}</li>
          <li class="text-length">物流单号：
            <div class="text-info">
              <el-tooltip
                  effect="dark"
                  :content="backGoodsInfo.logisticsNum"
                  placement="top"
              >
                <span> {{ backGoodsInfo.logisticsNum ? backGoodsInfo.logisticsNum : '--' }}</span>
              </el-tooltip>
            </div>
          </li>
        </ul>
      </el-col>
      <el-col :span="6">
        <ul class="text-info">
          <li>单据状态：{{ statusToName(backGoodsInfo.backStatus) }}</li>
          <li>返货类型：{{ "STO001" | codeToName(backGoodsInfo.storeType) }}</li>
          <li>收货人：{{ backGoodsInfo.receiveMan }}</li>
          <li>入库人：{{ backGoodsInfo.putInStorage ? backGoodsInfo.putInStorage : '--' }}</li>
        </ul>
      </el-col>
      <el-col :span="6">
        <ul class="text-info">
          <li>应返货件数：{{ backGoodsInfo.productNum }}</li>
          <li>配货总金额：¥ {{ backGoodsInfo.totalPrice }} 元</li>
          <li>收货人电话：{{ backGoodsInfo.phone }}</li>
          <li>收货时间：{{ backGoodsInfo.receiveTime | timestampToTime }}</li>
        </ul>
      </el-col>
      <el-col :span="6">
        <ul class="text-info">
          <li>实收件数：{{ backGoodsInfo.realityProductNum ? backGoodsInfo.realityProductNum : '--' }}</li>
          <li>创建时间：{{ backGoodsInfo.createTime | timestampToTime }}</li>
          <li>收货地址：{{ backGoodsInfo.provinceName }} {{ backGoodsInfo.cityName }} {{ backGoodsInfo.areaName }} {{ backGoodsInfo.addressInfo }}</li>
          <li>返货机构：{{ backGoodsInfo.organizationName }}</li>
        </ul>
      </el-col>
    </el-row>
    <h4 class="goods-info">返货商品信息</h4>
    <page-table :form-data="productFormData" :get-data="getReturnProductInfoList" :table-data="tableData">
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column prop="productCode" label="商品款号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="goodsCode" label="商品货号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <image-popover :img-src="scope.row.image"></image-popover>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="brandName" label="品牌" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="吊牌价">
          <template slot-scope="scope">
            ￥ {{ scope.row.retailPrice }}
          </template>
        </el-table-column>
        <el-table-column label="返货单价">
          <template slot-scope="scope">
            ￥ {{ scope.row.backUnitPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="planBackQuantity" label="应返数量"></el-table-column>
        <el-table-column label="应返金额">
          <template slot-scope="scope">
            ￥ {{ (scope.row.backUnitPrice * scope.row.planBackQuantity).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="receiveQuantity" label="仓库实收数量"></el-table-column>
      </el-table>
    </page-table>
  </div>
</template>
<script>
  import PageTable from "@/views/collocation/components/PageTable";
  import ImagePopover from "@/views/collocation/components/ImagePopover";
  export default {
    name: '',
    // 数据
    data() {
      return {
        // 路由参数
        _id: '',
        _type: '',
        // 请求商品list参数
        productFormData: {
          orderSn: null,
          pageIndex: 1,
          pageSize: 10
        },
        // 单据状态
        billType: this.$common.getBillType('back'),
        // 配货单信息
        backGoodsInfo: {},
        // 表格数据
        tableData: {},
        isEdit: false
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
        this.init();
      })
    },
    // 方法
    methods: {
      // 初始化
      init(){
        this.getQueryParams();
        this.getReturnGoods();
        this.getReturnProductInfoList();
      },
      //获取上页面参数
      getQueryParams() {
        this._type = this.$route.query.type;
        this._id = this.$route.query.id;
        this.productFormData.orderSn =  this.$route.query.backNum;
        let itemStatus = this._type;
        switch (itemStatus.toString()) {
          case "edit": //修改
            this.isEdit = true;
            break;
          case "see": //查看
            this.isEdit = false;
            break;
        }
      },
      // 获取详情
      getReturnGoods(){
        this.request(this.api.order.returnGoods_get, {id: this._id}).then(data => {
          this.backGoodsInfo = data;
        });
      },
      // 获取商品列表
      getReturnProductInfoList(){
        this.request(this.api.order.returnProductInfo_list, this.productFormData).then(data => {
          this.tableData = data;
        });
      },
      // 状态转name
      statusToName(val){
        if(!val && val !== 0) return;
        let item = this.billType.find(item => {
          return item.id === val;
        });
        return item.name;
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
