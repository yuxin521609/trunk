<style lang="less" scoped>
  .transfer-slip-add{background: #fff;

  }
</style>
<template>
  <div class="transfer-slip-add">
    <div class="form">
      <el-form ref="addFormData" :model="addFormData" label-width="120px" :rules="rules" class="item-form" size="small">
        <el-form-item label="发货门店：" prop="outStoreId">
          <el-select v-model="addFormData.outStoreId" placeholder="请选择" class="input-w-2" filterable ref="outStore" :disabled="outStoreDisabled">
            <el-option v-for="item in outStoreList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货门店：" prop="inStoreId">
          <el-select v-model="addFormData.inStoreId" placeholder="请选择" class="input-w-2" filterable ref="inStore" @change="inStoreChange">
            <el-option v-for="item in inStoreList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
          <el-button @click="cancel" size="small">取消调拨</el-button>
          <el-button type="primary" @click="confirmSub" size="small">确认调拨</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import {isvalidPhone} from '@/utils/validate';
  import division from "@/components/division";
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
    name: 'transfer_slip_add',
    // 组件
    components: {
      division
    },
    // 数据
    data() {
      return {
        // 路由参数
        _id: null,
        _orderSn: null,
        _outStoreId: null,

        // 参数
        addFormData: {
          // 发货人
          allotMan: '',
          // 发货人直属机构
          organizationId: '',
          organizationName: '',
          // 订单类型
          orderType: '0203',
          // 发货门店
          outStoreId: '',
          outStoreName: '',
          // 收货门店
          inStoreId: '',
          inStoreName: '',
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
        // 门店是否禁止选择 （编辑需要）
        outStoreDisabled: false,
        // 发货门店列表
        outStoreList: [],
        // 收货门店列表
        inStoreList: [],
        // 验证
        rules: {
          outStoreId: [
            { required: true, message: '请选择发货门店', trigger: 'change' }
          ],
          inStoreId: [
            { required: true, message: '请选择收货门店', trigger: 'change' }
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
    created(){

    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getQueryParams();
        this.getInStoreList();
        this.getOutStoreList();
        // 判断是否有门店缓存
        let transferSlipAddInfo = sessionStorage.getItem('TRANSFER_SLIP_APP_INFO');
        if(transferSlipAddInfo){
          this.addFormData = JSON.parse(transferSlipAddInfo);
        }
      })
    },
    // 方法
    methods: {
      // 获取上页面参数
      getQueryParams() {
        this._id = this.$route.query.id;
        this._orderSn =  this.$route.query.orderSn;
        this._outStoreId =  this.$route.query.outStoreId;
        if(this._id){
          this.outStoreDisabled = true;
          this.getStoreAllotGoodsOrder(this._id);
        }
      },
      // 获取配货单详情
      getStoreAllotGoodsOrder(id){
        this.request(this.api.order.storeAllotGoodsOrder_get, {id: id}).then(data => {
          this.addFormData = data;
        });
      },
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
      // 选择收获门店
      inStoreChange(val){
        let store = this.inStoreList.find(item => {
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
      // 取消调拨
      cancel(){
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/transfer_slip/transfer_slip_list'
        })
      },
      // 确认调拨
      confirmSub(){
        this.$refs.addFormData.validate((valid) => {
          if (valid) {
            if( this.addFormData.outStoreId === this.addFormData.inStoreId){
              this.$notify.error({ title: '错误',message: '发货门店和收货门店不能相同！'});
              return
            }
            // 获取下拉name
            this.addFormData.outStoreName = this.$refs.outStore.selectedLabel;
            this.addFormData.inStoreName = this.$refs.inStore.selectedLabel;
            // 缓存信息
            sessionStorage.setItem('TRANSFER_SLIP_APP_INFO', JSON.stringify(this.addFormData));
            let query = {};
            if(this._orderSn){
              query = {
                orderSn: this._orderSn,
                outStoreId: this._outStoreId
              }
            }
            let module = '/' + this.$route.path.split('/')[1];
            this.$router.push({
              path: module + '/transfer_slip/transfer_slip_add_goods',
              query: query
            })
          } else {
            return false;
          }
        });

      },
      // 获取发货门店数据
      async getOutStoreList() {
        // 获取userId
        let info = await this.request(this.api.user.get_userinfo, {}, true);
        // 保存用户名称
        this.addFormData.allotMan = info.name;
        // 获取直属机构
        let organization = await this.request(this.api.user.userCompany_getUserOrgByUserId, {userId: info.userId}, true);
        this.addFormData.organizationId =  organization.id;
        this.addFormData.organizationName =  organization.name;
        // enableAllocation: 1  (启用门店调拨 后端需要)
        this.request(this.api.retailStore.storeBasic_listBase, {organizationId: organization.id, enableAllocation: 1}).then(data => {
          this.outStoreList = data.data;
        });
      },
      // 获取收货门店数据
      getInStoreList() {
        this.request(this.api.store.storeBasic_list, {}).then(data => {
          this.inStoreList = data.data;
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
