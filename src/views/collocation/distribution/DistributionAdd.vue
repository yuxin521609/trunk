<style lang="less" scoped>
  .distribution-add{background: #fff;

  }
</style>
<template>
  <div class="distribution-add">
    <div class="form">
      <el-form ref="addFormData" :model="addFormData" label-width="120px" :rules="rules" class="item-form" size="small">
        <el-form-item label="配货机构：" prop="organizationId">
          <organization-select v-model="addFormData.organizationId" width-class="input-w-2" :form-data="addFormData" :call-back="organizationChange" ref="organization" :is-directly="true"></organization-select>
        </el-form-item>
        <el-form-item label="选择物流：" prop="logisticsCode">
          <logistics-select v-model="addFormData.logisticsCode" width-class="input-w-2" ref="logistics"></logistics-select>
        </el-form-item>
        <el-form-item label="选择仓库：" prop="warehouseCode">
          <el-select v-model="addFormData.warehouseCode" placeholder="请选择" class="input-w-2" filterable ref="warehouse">
            <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择门店：" prop="storeId">
          <el-select v-model="addFormData.storeId" placeholder="请选择" class="input-w-2" filterable ref="store" @change="storeChange">
            <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货人：" prop="receiveMan">
          <el-input v-model="addFormData.receiveMan" placeholder="请输入内容" class="input-w-2"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input v-model="addFormData.phone" placeholder="请输入内容" class="input-w-2"></el-input>
        </el-form-item>
        <el-form-item label="所在地区：" prop="divisionId">
          <division v-model="addFormData.divisionId" @set-division="setDivision" width-class="input-w" ref="division"></division>
        </el-form-item>
        <el-form-item label="" prop="addressInfo">
          <el-input v-model="addFormData.addressInfo" placeholder="请输入详细地址" class="input-w-2"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="cancel" size="small">取消配货</el-button>
          <el-button type="primary" @click="confirmSub" size="small">确认商家</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {isvalidPhone} from '@/utils/validate'
import division from "@/components/division";
import LogisticsSelect from "@/views/collocation/components/LogisticsSelect";
import OrganizationSelect from "@/views/collocation/components/OrganizationSelect";
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
  name: 'distribution_add',
  // 数据
  data() {
    return {
      // 参数
      addFormData: {
        // 配货人
        allotMan: '',
        // 货主
        goodsOwner: '',
        // 部门
        relationDepId: '',
        relationDepName: '',
        // 机构
        organizationId: '',
        organizationName: '',
        // 订单类型
        orderType: '0203',
        // 物流
        logisticsCode: '',
        logisticsCompany: '',
        // 仓库
        warehouseCode: '',
        warehouseName: '',
        // 门店
        storeId: '',
        storeName: '',
        storeType: '',
        // 收货人
        receiveMan: '',
        // 电话
        phone: '',
        // 省市区信息
        provinceName: '',
        provinceCode: '',
        cityName: '',
        cityCode: '',
        areaName: '',
        areaCode: '',
        divisionId: '',
        // 地址
        addressInfo: ''
      },
      // 仓库列表
      warehouseList: [],
      // 门店列表
      storeList: [],
      // 验证
      rules: {
        organizationId: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ],
        // logisticsCode: [
        //   { required: true, message: '请选择仓库', trigger: 'change' }
        // ],
        warehouseCode: [
          { required: true, message: '请选择仓库', trigger: 'change' }
        ],
        storeId: [
          { required: true, message: '请选择门店', trigger: 'change' }
        ],
        receiveMan: [
          { required: true, message: '请输入收货人', trigger: 'change' },
          { max: 16, message: '长度最多 16 个字符', trigger: 'change' }
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
    division,
    LogisticsSelect,
    OrganizationSelect
  },
  created(){

  },
  // 初始化数据
  mounted() {
    this.$nextTick(() => {
      // 判断是否有门店缓存
      let storeInfo = sessionStorage.getItem('DISTRIBUTION_INFO');
      if(storeInfo){
        this.addFormData = JSON.parse(storeInfo);
        this.getWarehouseList(this.addFormData.organizationId);
        this.getStoreList(this.addFormData.organizationId);
      }
    })
  },
  // 方法
  methods: {
    // 获取省市信息
    setDivision(division){
      this.addFormData.provinceName =  division.province;
      this.addFormData.provinceCode =  division.provinceCode;
      this.addFormData.cityName =  division.municipality;
      this.addFormData.cityCode =  division.municipalityCode;
      this.addFormData.areaName =  division.area;
      this.addFormData.areaCode =  division.areaCode;
      this.addFormData.divisionId =  division.divisionId;
    },
    // 获取货主
    getGoodsOwner(id){
      this.request(this.api.system.goodsOwner_getByOrgId, {orgId: id, used: true}).then(data=>{
        if(data.code){
          this.addFormData.goodsOwner = data.code;
        }
      });
    },
    // 机构选择后
    organizationChange(val){
      if(val){
        this.getWarehouseList(val);
        this.getStoreList(val);
        this.getGoodsOwner(val)
      }else {
        // 仓库列表
        this.warehouseList = [];
        // 门店列表
        this.storeList = [];
        this.addFormData.warehouseCode = '';
        this.addFormData.storeId = '';
        this.addFormData.receiveMan = '';
        this.addFormData.phone = '';
        this.addFormData.provinceName = '';
        this.addFormData.provinceCode = '';
        this.addFormData.cityName = '';
        this.addFormData.cityCode = '';
        this.addFormData.areaName = '';
        this.addFormData.areaCode = '';
        this.addFormData.divisionId = '';
        this.addFormData.addressInfo = '';
        this.$refs.division.init();
      }
    },
    // 选择门店
    storeChange(val){
      let store = this.storeList.find(item => {
        return item.id === val;
      });
      this.addFormData.receiveMan = store.linkman;
      this.addFormData.phone = store.phone;
      this.addFormData.provinceName = store.provinceName;
      this.addFormData.provinceCode = store.provinceCode;
      this.addFormData.cityName = store.cityName;
      this.addFormData.cityCode = store.cityCode;
      this.addFormData.areaName = store.areaName;
      this.addFormData.areaCode = store.areaCode;
      this.addFormData.divisionId = store.divisionId;
      this.addFormData.addressInfo = store.addressInfo;
    },
    // 取消
    cancel(){
      let module = '/' + this.$route.path.split('/')[1];
      this.$router.push({
        path: module + '/distribution/distribution_list'
      })
    },
    // 确认商家
    confirmSub(){
      if(!this.addFormData.goodsOwner){
        this.$notify.error({ title: '错误',message: '该机构下没有货主无法配货'});
        return
      }
      this.$refs.addFormData.validate((valid) => {
        if (valid) {
          // 获取下拉name
          this.addFormData.organizationName = this.$refs.organization.$refs.organization.selectedLabel;
          this.addFormData.warehouseName = this.$refs.warehouse.selectedLabel;
          this.addFormData.storeName = this.$refs.store.selectedLabel;
          this.addFormData.logisticsCompany = this.$refs.logistics.$refs.logistics.selectedLabel;
          // 缓存信息
          sessionStorage.setItem('DISTRIBUTION_INFO', JSON.stringify(this.addFormData));
          let module = '/' + this.$route.path.split('/')[1]
          this.$router.push({
            path: module + '/distribution/distribution_add_goods'
          })
        } else {
          return false;
        }
      });

    },
    //获取仓库数据
    getWarehouseList(id) {
      this.request(this.api.system.warehouse_list, {orgId: id, used: true}).then(data => {
        this.warehouseList = data.data;
      });
    },
    //获取门店数据
    getStoreList(id) {
      this.request(this.api.retailStore.storeBasic_listSmart, {organizationId: id}).then(data => {
        this.storeList = data;
      });
    }
  },
  // 计算属性
  computed: {

  },
  // 监听数据变化
  watch: {}
}
</script>
