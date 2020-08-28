<style lang="less" scoped>
  .back-goods-details{background: #fff;
    h4{padding-bottom: 20px;}
    .text-info{
      display: flex;
      width: 90%;
      flex-wrap:wrap;
      padding: 15px 10px 0 10px;
      li{
        width:20%;
        margin-right: 30px;
        height: 55px;
        padding-bottom: 10px;
      }
    }
    .goods-info{padding-top: 30px;}
    .text-length{position: relative;
      .text-info{position: absolute;left: 0;top: 0;padding-left: 75px;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
    }
  }
</style>
<template>
  <div class="back-goods-details item-margin item-cont">
    <h4>发货信息</h4>
    <ul class="text-info">
      <li>调出单号：{{ backGoodsInfo.orderSn }}</li>
      <li>调出方名称：{{ backGoodsInfo.outStoreName }}</li>
      <li>单据状态：{{ backGoodsInfo.orderStatus }}</li>
      <li>调货单号：{{ backGoodsInfo.associationOrderSn }}</li>

      <li>应发总件数：{{ backGoodsInfo.quantity }}</li>
      <li>收货人：{{ backGoodsInfo.receiveMan }}</li>
      <li>收货人电话：{{ backGoodsInfo.phone }}</li>
      <li>收货地址：{{ backGoodsInfo.provinceName }} {{ backGoodsInfo.cityName }} {{ backGoodsInfo.areaName }} {{ backGoodsInfo.addressInfo }}</li>

      <li>发货人：{{ backGoodsInfo.allotMan }}</li>
      <li>物流公司：{{ backGoodsInfo.logisticsCompany }}</li>
      <li>物流单号： {{ backGoodsInfo.logisticsOrderSn }} </li>
      <li>发货时间：{{ backGoodsInfo.shipmentsTime | timestampToTime }}</li>
    </ul>
    <h4 class="goods-info">收货商品信息</h4>
    <page-table :form-data="productFormData" :get-data="getReturnProductInfoList" :table-data="tableData.dataList">
      <el-table :data="tableData.dataList.data" style="width: 100%">
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
        <el-table-column prop="quantity" label="应发数量"></el-table-column>
        <el-table-column prop="shipmentsQty" label="实发数量"></el-table-column>
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
        billType: this.$common.getBillType('allot'),
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
        this.productFormData.orderSn =  this.$route.query.orderSn;
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
        this.request(this.api.scb.allocateOutOrder_get, {id: this._id}).then(data => {
          this.backGoodsInfo = data;
          this.backGoodsInfo.orderStatus = this.statusToName(this.backGoodsInfo.orderStatus);
        });
      },
      // 获取商品列表
      getReturnProductInfoList(){
        this.request(this.api.scb.allocateOutOrderProductInfo_list, this.productFormData).then(data => {
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
