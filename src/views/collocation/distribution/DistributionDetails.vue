<style lang="less" scoped>
  .distribution-details{background: #fff;
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
  <div class="distribution-details item-margin item-cont">
    <h4>配货信息</h4>
    <el-row :gutter="20">
      <el-form ref="allotGoodsInfo" :model="allotGoodsInfo" :rules="rules" size="small">
        <el-col :span="6">
          <ul class="text-info">
            <li>门店名称：{{ allotGoodsInfo.storeName }}</li>
            <li>配货人：{{ allotGoodsInfo.allotMan }}</li>
            <li>出库仓库：{{ allotGoodsInfo.warehouseName }}</li>
            <li v-if="!isEdit">收货人：{{ allotGoodsInfo.receiveMan }}</li>
            <el-form-item label="收货人：" prop="receiveMan" v-if="isEdit">
              <el-input v-model="allotGoodsInfo.receiveMan" placeholder="请输入内容" class="input-w"></el-input>
            </el-form-item>
          </ul>
        </el-col>
        <el-col :span="6">
          <ul class="text-info">
            <li>单据状态：{{ statusToName(allotGoodsInfo.allotStatus) }}</li>
            <li>配货件数：{{ allotGoodsInfo.goodsNum }}</li>
            <li v-if="!isEdit">物流公司：{{ allotGoodsInfo.logisticsCompany }}</li>
            <el-form-item label="选择物流：" v-if="isEdit">
              <el-select v-model="allotGoodsInfo.logisticsCompany" placeholder="请选择" class="input-w" filterable ref="logistics">
                <el-option v-for="item in logisticsList" :key="item.id" :label="item.company" :value="item.company"></el-option>
              </el-select>
            </el-form-item>
            <li v-if="!isEdit">收货人电话：{{ allotGoodsInfo.phone }}</li>
            <el-form-item label="收货人：" prop="phone" v-if="isEdit">
              <el-input v-model="allotGoodsInfo.phone" placeholder="请输入内容" class="input-w"></el-input>
            </el-form-item>
          </ul>
        </el-col>
        <el-col :span="6">
          <ul class="text-info">
            <li>门店类型：{{ "STO001" | codeToName(allotGoodsInfo.storeType) }}</li>
            <li>配货总金额：¥ {{ allotGoodsInfo.totalPrice }} 元</li>
            <li class="text-length">物流单号：
              <div class="text-info">
                <el-tooltip
                    effect="dark"
                    :content="allotGoodsInfo.logisticsNum"
                    placement="top"
                >
                  <span> {{ allotGoodsInfo.logisticsNum ? allotGoodsInfo.logisticsNum : '--' }}</span>
                </el-tooltip>
              </div>
            </li>
            <li v-if="!isEdit">收货地址：{{ allotGoodsInfo.provinceName }} {{ allotGoodsInfo.cityName }} {{ allotGoodsInfo.areaName }} {{ allotGoodsInfo.addressInfo }}</li>
          </ul>
        </el-col>
        <el-col :span="6">
          <ul class="text-info">
            <li>配货机构：{{ allotGoodsInfo.organizationName }}</li>
            <li>创建时间：{{ allotGoodsInfo.createTime | timestampToTime }}</li>
            <li>发货时间：{{ allotGoodsInfo.allotTime | timestampToTime }}</li>
            <li>收货时间：{{ allotGoodsInfo.receiveTime | timestampToTime }}</li>
          </ul>
        </el-col>
        <el-col :span="24" v-if="isEdit">
          <el-form-item label="所在地区：" prop="divisionId">
            <division v-model="allotGoodsInfo.divisionId" @set-division="setDivision" width-class="input-w"></division>
          </el-form-item>
          <el-form-item label="" prop="addressInfo" label-width="92px">
            <el-input v-model="allotGoodsInfo.addressInfo" placeholder="请输入详细地址" class="input-w-2"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <h4 class="goods-info">配货商品信息</h4>
    <page-table :form-data="productFormData" :get-data="getAllotProductInfoList" :table-data="tableData">
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
        <el-table-column label="配货单价">
          <template slot-scope="scope">
            ￥ {{ scope.row.purchasePrice }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="配货数量"></el-table-column>
        <el-table-column label="配货金额">
          <template slot-scope="scope">
            ￥ {{ (scope.row.quantity * scope.row.purchasePrice).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="realityQuantity" label="仓库实发数量"></el-table-column>
        <el-table-column prop="receiveQuantity" label="门店收货数量"></el-table-column>
      </el-table>
    </page-table>
    <div class="btns" v-if="isEdit">
      <el-button type="primary" @click="editAllotSub" size="small">确定</el-button>
      <el-button @click="editAllotCancel" size="small">取消</el-button>
    </div>
  </div>
</template>
<script>
  import PageTable from "@/views/collocation/components/PageTable";
  import ImagePopover from "@/views/collocation/components/ImagePopover";
  import division from "@/components/division";
  import {isvalidPhone} from '@/utils/validate'

  let validPhone=(rule, value,callback)=>{
    if(!value){
      callback(new Error('请输入手机号码'));
    }else if (!isvalidPhone(value) && value){
      callback(new Error('请输入正确的11位手机号码'));
    }else {
      callback();
    }
  };
  export default {
    name: 'distribution_details',
    // 数据
    data() {
      return {
        // 路由参数
        _id: '',
        _type: '',
        // 请求参数
        productFormData: {
          orderSn: null,
          pageIndex: 1,
          pageSize: 10
        },
        // 单据状态
        billType: this.$common.getBillType('allot'),
        // 配货单信息
        allotGoodsInfo: {},
        // 表格数据
        tableData: {},
        // 物流列表
        logisticsList: [],
        isEdit: false,
        // 验证
        rules: {
          receiveMan: [
            { required: true, message: '请输入收货人', trigger: 'change' }
          ],
          phone: [
            { required: true, trigger: "change", validator: validPhone}
          ],
          divisionId: [
            { required: true, message: '所在地区必须选到区县', trigger: 'change' }
          ],
          addressInfo: [
            { required: true, message: '请输入收货地址', trigger: "change"}
          ]
        }
      }
    },
    // 组件
    components: {
      PageTable,
      division,
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
        this.getAllotGoods();
        this.getAllotProductInfoList();
      },
      // 获取省市信息
      setDivision(division){
        this.allotGoodsInfo.provinceName =  division.province;
        this.allotGoodsInfo.provinceCode =  division.provinceCode;
        this.allotGoodsInfo.cityName =  division.municipality;
        this.allotGoodsInfo.cityCode =  division.municipalityCode;
        this.allotGoodsInfo.areaName =  division.area;
        this.allotGoodsInfo.areaCode =  division.areaCode;
        this.allotGoodsInfo.divisionId =  division.divisionId;
      },
      //获取上页面参数
      getQueryParams() {
        this._type = this.$route.query.type;
        this._id = this.$route.query.id;
        this.productFormData.orderSn =  this.$route.query.allotNum;
        let itemStatus = this._type;
        switch (itemStatus.toString()) {
          case "edit": //修改
            this.isEdit = true;
            this.getLogisticsList();
            break;
          case "see": //查看
            this.isEdit = false;
            break;
        }
      },
      // 获取详情
      getAllotGoods(){
        this.request(this.api.order.allotGoods_get, {id: this._id}).then(data => {
          this.allotGoodsInfo = data;
        });
      },
      // 获取商品详情
      getAllotProductInfoList(){
        this.request(this.api.order.allotProductInfo_list, this.productFormData).then(data => {
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
      },
      //获取物流数据
      getLogisticsList() {
        this.request(this.api.order.expressCompany_list, {}).then(data => {
          this.logisticsList = data.data;
        });
      },
      // 确认提交
      editAllotSub(){
        this.$refs.allotGoodsInfo.validate((valid) => {
          if (valid) {
            this.request(this.api.order.allotGoods_save, this.allotGoodsInfo).then(data => {
              this.$notify.success({ title: '成功',message: '编辑成功'});
              this.$router.push({
                path: '/collocation/distribution/distribution_list'
              });
            });
          } else {
            return false;
          }
        });

      },
      // 取消
      editAllotCancel(){
        // 回退到主页面;
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/distribution/distribution_list'
        });
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
