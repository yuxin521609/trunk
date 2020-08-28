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
    <h4>返货信息</h4>
    <ul class="text-info">
      <li>退返单号：{{ backGoodsInfo.backNum }}</li>
      <li>单据状态：{{ backTypeStatus[backGoodsInfo.backStatus] }}</li>
      <li>返货数量：{{ backGoodsInfo.productNum }}</li>
      <li>退返货值：{{ backGoodsInfo.totalPrice }}</li>

      <li>返货方：{{ backGoodsInfo.storeName || '--' }}</li>
      <li>创建时间：{{ backGoodsInfo.createTime | timestampToTime }}</li>
      <li>实返数量：{{ backGoodsInfo.realityBackQty }}</li>
      <li>实返时间：{{ backGoodsInfo.returnTime | timestampToTime  }}</li>

      <li>收货仓库：{{ backGoodsInfo.warehouseName }}</li>
      <li>收货人： {{ backGoodsInfo.receiveMan }} </li>
      <li>收货人电话：{{ backGoodsInfo.phone  }}</li>
      <li>收货地址：{{ backGoodsInfo.provinceName }} {{ backGoodsInfo.cityName }} {{ backGoodsInfo.areaName }} {{ backGoodsInfo.addressInfo }}</li>

      <li>物流公司：{{ backGoodsInfo.logisticsCompany || '--' }}</li>
      <li>物流单号：{{ backGoodsInfo.logisticsNum || '--' }}</li>
      <li>实收数量：{{ backGoodsInfo.realityProductNum || '--' }}</li>
      <li>收货时间：{{ backGoodsInfo.receiveTime | timestampToTime  }}</li>
    </ul>
    <h4 class="goods-info">返货商品信息</h4>
    <page-table :form-data="productFormData" :get-data="getReturnProductInfoList" :table-data="tableData">
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
            ￥ {{ scope.row.retailPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="planBackQuantity" label="应返数量"></el-table-column>
        <el-table-column prop="realityBackQty" label="实返数量"></el-table-column>
        <el-table-column prop="receiveQuantity" label="实收数量"></el-table-column>
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
        backTypeStatus:{
          0:'待发货',
          1:'待返货',
          2:'待收货',
          3:'已完成',
          4:'作废',
          5:'已发货',
          6:'已返货',
          7:'未到货',
          8:'部分到货',
          9:'全部到货',
          13:'待编辑',
          14:'强制完成'
        },
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
          data.data.forEach((item, index) => {
            item.realityBackQty = item.realityBackQty == null ? '--' : item.realityBackQty;
          })
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
