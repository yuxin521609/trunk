<template>
  <div class="create-store">
    <!-- 指派 -->
    <el-dialog title="选择门店负责人" :visible.sync="dialogTableVisible">
      <el-form
        class="item-form"
        size="small"
        :inline="true"
        :model="filtersData">
        <!-- 模糊查询 -->
        <el-form-item label="综合搜索：">
          <el-input v-model="filtersData.phone" style="width:310px;" clearable  placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" type="primary" plain size="small">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="principal_list">
        <el-table-column  label="人员姓名" align="center">
            <template  slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column  label="联系电话" align="center">
            <template  slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column  label="商家端账号" align="center">
            <template  slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column  label="下属门店数量" align="center">
            <template  slot-scope="scope">{{ scope.row.storeCount }}</template>
        </el-table-column>
        <el-table-column  label="操作" align="center">
            <template  slot-scope="scope"><span class="add_principal" @click="add_principal(scope.row)">{{ isEcho ? '确认修改' : '确认添加' }}</span></template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="选择门店位置" :visible.sync="dialogMap" @close="handleClose">
      <div id="container"></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogMap = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogMap">确 定</el-button>
        </span>
    </el-dialog>
    <!--  -->
    <template>
    <el-form
          :model="save_createStore_obj"
          label-width="120px"
          class="form-label"
          :rules="rules"
          ref="formName"
        >
      <el-tabs v-model="activeName">
        <!-- 1.基本信息 -->
        <el-tab-pane label="基本信息" name="first">
          <section>
            <!-- 门店名称 -->
            <el-form-item label="门店名称：" prop="name">
              <el-input v-model="save_createStore_obj.name" :disabled="isRead" placeholder="请输入门店名称"></el-input>
            </el-form-item>
            <!-- 隶属机构 -->
            <el-form-item label="隶属机构：" prop="organizationId">
              <el-select disabled v-if="isEcho" v-model="save_createStore_obj.organizationName">
              </el-select>
              <organization-select v-else :isDirectly="true" v-model="save_createStore_obj.organizationId" width-class="input-w-2" ref="organizationName"></organization-select>
            </el-form-item>
            <!-- 门店负责人 -->
            <el-form-item label="门店负责人：" prop="principalName">
              <el-input
                class="el-input-short"
                disabled
                v-model="save_createStore_obj.principalName"
                placeholder="请选择门店负责人"
              ></el-input>
              <el-button size="mini" type="primary" class="ml-10" :disabled="isRead" @click="dialogTableVisible = true">点击选择</el-button>
            </el-form-item>
            <!-- 营业时间 -->
            <el-form-item label="营业时间：" required>
              <el-col :span="5.5">
                <el-form-item prop="operationBegin">
                  <business-time :disabled="isRead" :operationbegin="save_createStore_obj.operationBegin" v-model="save_createStore_obj.operationBegin"></business-time>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="operationEnd">
                  <business-time :disabled="isRead" :operationbegin="save_createStore_obj.operationEnd" v-model="save_createStore_obj.operationEnd"></business-time>
                </el-form-item>
              </el-col>
            </el-form-item>
            <!-- 门店类型 -->
            <el-form-item label="门店类型：" prop="type">
              <el-select v-model="save_createStore_obj.type" :disabled="isRead" placeholder="请选择门店类型">
                <el-option :label="item.name" :value="item.code" :key="index" v-for="(item, index) in store_list"></el-option>
              </el-select>
            </el-form-item>
            <!-- 联系人 -->
            <el-form-item label="联系人：" prop="linkman">
              <el-input v-model="save_createStore_obj.linkman" :disabled="isRead" placeholder="请输入联系人"></el-input>
            </el-form-item>
            <!-- 联系电话 -->
            <el-form-item label="联系电话：" prop="phone">
              <el-input maxlength="11" v-model="save_createStore_obj.phone" :disabled="isRead" placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <!-- 门店地址 -->
            <el-form-item label="门店地址：" prop="divisionId">
              <div style="width:700px;">
                <division @set-division="setDivision" :isDisabled="isRead" v-model="save_createStore_obj.divisionId"></division>
              </div>
            </el-form-item>
            <el-form-item prop="addressInfo">
              <div class="add" @click.stop="">
                <input 
                type="text" 
                @input="searchAddress"
                class="address" 
                :class="{'address2':isRead}"
                :disabled="isRead"
                placeholder="请选择"
                v-model="save_createStore_obj.addressInfo"
                ref="addressInput">
                <div class="address-box"  :class="{addOv : searchAddress_list && searchAddress_list.length > 6}" v-if="isAddShow">
                  <div class="li" v-if="searchAddress_list && searchAddress_list.length > 0" v-for="(item, index) in searchAddress_list" @click.stop="checkAddress(item)" :key="index">{{ item.title }}</div>
                  <div class="li"  v-if="searchAddress_list && searchAddress_list.length == 0">暂无数据</div>
                </div>
                <el-button size="mini" :disabled="isRead" @click="fnMap"  type="primary" class="ml-10">地图选点</el-button>
              </div>
            </el-form-item>
            <!-- 经度、纬度 -->
            <div class="display-flex">
              <el-form-item label="经度：" prop="longitude">
                <el-input
                  v-model="save_createStore_obj.longitude"
                  disabled
                  class="el-input-short"
                  placeholder="经度纬度"
                ></el-input>
              </el-form-item>
              <el-form-item label="纬度：" prop="latitude" label-width="65px" class="ml-15">
                <el-input
                  v-model="save_createStore_obj.latitude"
                  disabled
                  class="el-input-short"
                  placeholder="纬度坐标"
                ></el-input>
              </el-form-item>
            </div>
          </section>
        </el-tab-pane>
        <!-- 2.经营信息 -->
        <el-tab-pane label="经营信息" name="second">
          <section>
            <!-- 经营业务类型 -->
            <el-form-item label="经营业务类型：" prop="manageType_list">
              <div class="el-checkbox-group">
                <el-checkbox :label="item.name" :disabled="isRead" v-model="item.checked" v-for="(item, index) in save_createStore_obj.manageType_list" :key="index"></el-checkbox>
              </div>
            </el-form-item>
            <!-- 门店收款方式 -->
            <el-form-item label="门店收款方式：" prop="paymentType_list">
              <div class="el-checkbox-group">
                <el-checkbox :label="item.name" :disabled="isRead" v-model="item.checked" v-for="(item, index) in save_createStore_obj.paymentType_list" :key="index"></el-checkbox>
              </div>
            </el-form-item>
            <!-- 门店货权归属 -->
            <!-- <el-form-item label="门店货权归属：" prop="goodsOwner">
              <el-select v-model="save_createStore_obj.goodsOwner" :disabled="isRead" placeholder="请选择门店是否启用搭配服务">
                <el-option :label="item.name" :value="item.code" :key="index" v-for="(item, index) in goodsowner_list"></el-option>
              </el-select>
            </el-form-item> -->
            <!-- 启用搭配服务 -->
            <el-form-item label="启用搭配服务：" prop="designService">
              <el-select v-model="save_createStore_obj.designService" :disabled="isRead" placeholder="请选择门店是否启用搭配服务">
                <el-option :label="item.name" :value="item.id" :key="index" v-for="(item, index) in designService_list"></el-option>
              </el-select>
            </el-form-item>
            <!-- 经营范围 -->
            <el-form-item label="经营范围：" prop="manageRange_list">
              <div class="el-checkbox-group">
                <el-checkbox :label="item.name" :disabled="isRead" v-model="item.checked" v-for="(item, index) in save_createStore_obj.manageRange_list" :key="index"></el-checkbox>
              </div>
            </el-form-item>
            <!-- 启用价格管理 -->
            <el-form-item label="启用价格管理：" prop="pricingPower">
              <el-select v-model="save_createStore_obj.pricingPower" :disabled="isRead" placeholder="请选择门店是否启用价格管理">
                <el-option :label="item.name" :value="item.id" :key="index" v-for="(item, index) in designService_list"></el-option>
              </el-select>
            </el-form-item>
            <!-- 店铺面积 -->
            <el-form-item label="店铺面积：" prop="storeArea">
              <el-input v-model="save_createStore_obj.storeArea" :disabled="isRead" placeholder="请输入店铺面积"></el-input>
            </el-form-item>
            <!-- 合作面积 -->
            <el-form-item label="合作面积：" prop="cooperationArea">
              <el-input v-model="save_createStore_obj.cooperationArea" :disabled="isRead" placeholder="请输入合作面积"></el-input>
            </el-form-item>
            <!-- 门店标签 -->
            <el-form-item label="门店标签：">
              <div class="el-checkbox-group">
                <el-checkbox :label="item.name" :disabled="isRead" v-model="item.checked" v-for="(item, index) in save_createStore_obj.storeTag_list" :key="index"></el-checkbox>
              </div>
            </el-form-item>
            <!-- 启用门店调拨 -->
            <el-form-item label="启用店间调拨：">
              <div class="el-checkbox-group">
                <el-switch
                  :disabled="isRead"
                  v-model="save_createStore_obj.enableAllocation"
                  active-color="#13ce66"
                  inactive-color="#9d9d9d"
                ></el-switch>
              </div>
            </el-form-item>
            <!-- 小程序展示 -->
            <el-form-item label="小程序展示：">
              <div class="el-checkbox-group">
                <el-switch
                  :disabled="isRead"
                  v-model="save_createStore_obj.enableShowWeChat"
                  active-color="#13ce66"
                  inactive-color="#9d9d9d"
                ></el-switch>
              </div>
            </el-form-item>
            <!-- 门店自收银 -->
            <el-form-item label="门店自收银：">
              <div class="el-checkbox-group">
                <el-switch
                  :disabled="isRead"
                  v-model="save_createStore_obj.enableOwnSettlement"
                  active-color="#13ce66"
                  inactive-color="#9d9d9d"
                ></el-switch>
              </div>
            </el-form-item>
            <!-- 无会员开单 -->
            <el-form-item label="无会员开单：">
              <div class="el-checkbox-group">
                <el-switch
                  :disabled="isRead"
                  v-model="save_createStore_obj.enableNoMemberBilling"
                  active-color="#13ce66"
                  inactive-color="#9d9d9d"
                ></el-switch>
              </div>
            </el-form-item>
            <!-- 订单改价 -->
            <el-form-item label="订单改价：">
              <div class="el-checkbox-group">
                <el-switch
                  :disabled="isRead"
                  v-model="save_createStore_obj.enableOrderPrice"
                  active-color="#13ce66"
                  inactive-color="#9d9d9d"
                ></el-switch>
              </div>
            </el-form-item>
          </section>
        </el-tab-pane>
        <!-- 3.门店图片 -->
        <el-tab-pane label="门店图片" name="third">
          <section>
            <!-- 图片上传 -->
            <el-form-item label="图片上传：" prop="storeImgs_list" res="uploadElement">
              <el-upload-img
              :disabled="isRead"
              v-model="save_createStore_obj.storeImgs_list"
              :EchoDisplayImages="save_createStore_obj.storeImgs_list"
              CatalogName="store"
              :imgApi="imgApi"
              :describe="storeImgs_describe"
              :LssUpimgLimit="isRead ? 1 : 5"
              ></el-upload-img>
            </el-form-item>
            <!-- 图片上传 -->
            <el-form-item label="门店logo：" prop="logoImage_list">
              <el-upload-img
              :disabled="isRead"
              :imgApi="imgApi"
              v-model="save_createStore_obj.logoImage_list"
              :EchoDisplayImages="save_createStore_obj.logoImage_list"
              CatalogName="store"
              :describe="logoImage_describe"
              :LssUpimgLimit="1"
              ></el-upload-img>
            </el-form-item>
          </section>
        </el-tab-pane>
        <!-- 4.附件信息 -->
        <el-tab-pane label="附件信息" name="fourth">
          <section>
            <!-- 文件上传 -->
            <el-form-item label="附件上传：" prop="enclosure_list">
              <el-upload-img
              :disabled="isRead"
              :imgApi="imgApi"
              v-model="save_createStore_obj.enclosure_list"
              :EchoDisplayImages="save_createStore_obj.enclosure_list"
              CatalogName="store"
              :describe="enclosure_describe"
              :LssUpimgLimit="isRead ? 1 : 5"
              ></el-upload-img>
            </el-form-item>
          </section>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </template>
    <div class="save"  v-if="!isRead">
      <el-button type="primary" @click="save_createStore">{{ isEcho ? '确认修改' : '确认创建' }}</el-button>
      <el-button @click="href('store/store/store_info_list')">取消</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import codeSet from '@/components/codeSet'
import {getToken} from '@/utils/auth'
import division from "@/components/division";
import treeDept from "@/components/treeDept";
import treePerson from "@/components/treePerson";
import businessTime from "../components/businessTime";
import ElUploadImg from "@/components/uploadImg/el_upload_img_multi";
import { mapGetters } from 'vuex';
import OrganizationSelect from "@/views/collocation/components/OrganizationSelect";
import * as userTypes from "@/types/userConfig";
import { setTimeout, clearTimeout } from 'timers';
import Vue from 'vue'
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp);
export default {
  data() {
    return {
      isAddShow:false,
      // 上传图片路径
      imgApi:this.api.content.aLiYun_upload,
      businesstime:false,
      // 是否编辑或查看页
      isEcho:this.$route.query.isEcho,
      // 是否只可读
      isRead:this.$route.query.isRead,
      // 当前选中的菜单
      activeName: "first",
      // 门店弹框
      dialogTableVisible:false,
      // 地图
      dialogMap:false,
      // 地图只执行一次
      dialogMapTF:true,
      // 门店负责人列表
      principal_list:[],
      // 搜索地址列表
      searchAddress_list:[],
      // 隶属机构
      organization_list:[{
        id:'01',
        name:'研发部'
      },{
        id:'02',
        name:'商品部'
      },{
        id:'03',
        name:'测试部'
      }],
      // 启用搭配服务列表
      designService_list:[{
        id:1,
        name:'是'
      },{
        id:0,
        name:'否'
      }],
      // 全部字典项
      getAllCode_list:[],
      // 门店类型
      store_list:[],
      // 门店货权归属
      goodsowner_list:[],



      // 上传图片描述
      storeImgs_describe:'请上传门店图片，单张大小不超过2M，数量不超过5张。',
      // 门店logo描述
      logoImage_describe:'请尽量上传1：1比例的图片。',
      // 附件信息描述
      enclosure_describe:'请上传合同及营业执照信息，单张大小不超过2M，数量不超过5张。',
      // 门店图片回显
      storeImgs_EchoDisplayImages:[],
      // 附件信息图片回显
      enclosure_EchoDisplayImages:[],
      // 门店校验
      rules:{
        name: [{ required: true, validator:(rule, value, callback)=>{
          // 检验门店名称
          this.checkStoreName(value, callback);
        }, trigger: 'blur' }],
        organizationId: [{ required: true, message: '请选择隶属机构！', trigger: 'change' }],
        principalName: [{ required: true, message: '请选择门店负责人！', trigger: 'change' }],
        operationBegin: [{ required: true, message: '请选择门店早上开门时间！', trigger: 'change' }],
        operationEnd: [{ required: true, message: '请选择门店晚上闭店时间！', trigger: 'change' }],
        type: [{ required: true, message: '请选择门店类型！', trigger: 'change' }],
        linkman: [{ required: true, message: '请输入联系人！', trigger: 'change' }],
        phone: [{ required: true, validator:(rule, value, callback)=>{
          if(!value) {
            callback(new Error('请输入手机号码！'));
          }else{
            const regPhone = /^1[3-9]\d{9}$/g;
            if(regPhone.test(value)) {
             callback();
            }else{
              callback(new Error('请输入正确手机号码！'));
            }
          }
        }, trigger: 'blur' }],
        divisionId: [{ required: true, message: '请选择行政区域！', trigger: 'change' }],
        addressInfo: [{ required: true, message: '请输入详细地址！', trigger: 'change' }],
        longitude: [{ required: true, message: '请选择经度！', trigger: 'change' }],
        latitude: [{ required: true, message: '请选择纬度！', trigger: 'change' }],
        goodsOwner: [{ required: true, message: '请选择门店货权归属！', trigger: 'change' }],
        designService: [{ required: true, message: '请选择门店是否启用搭配服务！', trigger: 'change' }],
        pricingPower: [{ required: true, message: '请选择门店是否启用价格管理！', trigger: 'change' }],
        manageType_list: [{ required: true, validator: (rule, arr, callback) => {
          const someItem = arr.some((item, index) => {
            return item.checked;
          });
          if(!someItem) {
            callback(new Error('至少要选择一项业务类型！'));
          }else{
            callback();
          };
        }, trigger: 'change' }],
        paymentType_list: [{ required: true, validator: (rule, arr, callback) => {
          const someItem = arr.some((item, index) => {
            return item.checked;
          });
          if(!someItem) {
            callback(new Error('至少要选择一项收款方式！'));
          }else{
            callback();
          };
        }, trigger: 'change' }],
        manageRange_list: [{ required: true, validator: (rule, arr, callback) => {
          const someItem = arr.some((item, index) => {
            return item.checked;
          });
          if(!someItem) {
            callback(new Error('至少要选择一项经营范围！'));
          }else{
            callback();
          };
        }, trigger: 'change' }],
        storeImgs_list: [{ type: 'array', required: true, message: '至少上传一张门店图片！', trigger: 'blur' }],
        logoImage_list: [{ type: 'array', required: true, message: '至少上传一张门店logo！', trigger: 'blur' }],
        // enclosure_list: [{ type: 'array', required: true, message: '至少上传一张附件图片！', trigger: 'blur' }],
      },
      // 新建门店提交对象
      save_createStore_obj: {
        id:null, // 门店 id
        name: "", // 门店名称
        createName: "", // 创建人姓名
        organizationId: "", // 组织机构 id
        organizationName: "", // 组织机构名称
        principalId: "", // 门店负责人 id
        principalName: "", // 门店负责人名字
        operationBegin: "", // 营业早上开门时间
        operationEnd: "", // 营业晚上闭店时间
        type: "", // 门店类型
        linkman: "", // 联系人
        phone: "", // 联系电话
        provinceName: "", // 省份名称
        provinceCode: "", // 省份 code
        divisionId:"",// 区 id
        cityName: "", // 城市名称
        cityCode: "", // 城市 code
        areaName: "", // 区域名称
        areaCode: "", // 区域 code
        addressInfo: "", // 详细地址
        _addressInfo:"", // 详细地址临时备份 
        _longitude: "", // 经度（暂存）
        _latitude: "", // 纬度'（暂存）
        longitude: "", // 经度
        latitude: "", // 纬度'
        goodsOwner: "", // 货权归属
        pricingPower:"",// 启用价格管理
        storeArea: "", // 店铺面积
        cooperationArea: "", // 合作面积
        designService: "", // 是否启用搭配服务
        enableAllocation:false, // 启用门店调拨
        enableShowWeChat:true, // 小程序展示
        enableOwnSettlement:false, // 门店自收银
        enableNoMemberBilling:false, // 无会员开单
        enableOrderPrice:false, // 订单改价
        // 经营类型列表
        manageType_list:[],
        // 门店货款方式列表
        paymentType_list:[],
        // 经营范围列表
        manageRange_list:[],
        // 门店标签列表
        storeTag_list:[],
        // 门店图片
        storeImgs_list:[],
        // 门店logo列表
        logoImage_list:[],
        // 门店logo提交对象
        logoImage:[],
        // 附件信息
        enclosure_list:[],
        // 经营信息（经营业务类型 0、门店收款方式 1、经营范围 2、门店标签 3）
        infos: [],
        // 图片信息（门店图片 0、附件图片 1）
        images: []
      },
      // 门店名称备份
      storeName:'',
      filtersData:{
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        used: null, //有效状态
        phone: "", //搜索关键字
        name:"",
        isStart:"",
        startDate: "",
        endDate: "",
        businessType:"",//
        receiveDept:"",// 接受部门
      }
    };
  },
  created() {
    const that = this;
    // 获取所有字典内容
    this.getAllCode();
    // 获取用户列表
    // this.user_listByPhonet();
    // 获取隶属机构
    document.onkeydown = function(e) {
        var key = window.event.keyCode;
        if (key == 13) {
          that.handleSearch();
        }
    };
    document.addEventListener('click', function(e) {
      that.isAddShow = false;
      e.stopPropagation();
    }, false)
  },
  mounted() {},
  computed: {
    ...mapGetters({
        userInfo: userTypes.GETTER_USERINFO
    }),
    storeImgs_list() {
      return this.save_createStore_obj.storeImgs_list;
    },
    logoImage_list() {
      return this.save_createStore_obj.logoImage_list;
    },
    enclosure_list() {
      return this.save_createStore_obj.enclosure_list;
    },
    areaCode() {
      return this.save_createStore_obj.areaCode;
    },
  },
  watch:{
    /**
     * 监听门店图片
     */
    storeImgs_list(value) {
      if(value && value.length > 0) {
        this.$refs.formName.clearValidate('storeImgs_list');
      }else{
        this.$refs.formName.validateField('storeImgs_list');
      }
    },
    /**
     * 监听门店logo
     */
    logoImage_list(value) {
      if(value && value.length > 0) {
        this.$refs.formName.clearValidate('logoImage_list');
      }else{
        this.$refs.formName.validateField('logoImage_list');
      }
    },
    /**
     * 监听附件图片
     */
    enclosure_list(value) {
      if(value && value.length > 0) {
        this.$refs.formName.clearValidate('enclosure_list');
      }else{
        this.$refs.formName.validateField('enclosure_list');
      }
    },
    /**
     * 监听区域code，用户是否重新选择了地区
     */
    areaCode(value) {
      this.dialogMapTF = true;
    }
  },
  methods: {
    /**
     * 选择详细地址
     */
    checkAddress(checkItem) {
      console.log(checkItem)
      Object.assign(this.save_createStore_obj, {
        longitude:checkItem.location.lng,
        _longitude:checkItem.location.lng,
        latitude:checkItem.location.lat,
        _latitude:checkItem.location.lat,
        addressInfo:checkItem.title
      });
      this.isAddShow = false;
      console.log(checkItem)
    },
    /**
     * 选择详细地址失去焦点时
     */
    checkAddblur(value) {
      
    },
    /**
     * 根据关键词模糊搜索地址
     */
    searchAddress() {
      const that = this,
        region = that.save_createStore_obj.cityName,
        address = this.$refs.addressInput.value;
        if(this._address == address) return;
      // 先清
      if(!address) {
        this.searchAddress_list = [];
      }
      clearTimeout(this.searchAddressTime);
      // 节流
      this.searchAddressTime = setTimeout(() => {
        if(!region){
          this.warn('请选择省市区！');
          return;
        };
        if(!address) return;
        let url = 'https://apis.map.qq.com/ws/place/v1/suggestion';
        this.$jsonp(url,{
            key:'DAXBZ-VIQKS-7QAOO-6LPOB-EMQN7-UAFOU',
            callbackName: 'QQmap',
            output:'jsonp',
            keyword:address,
            region
          })
        .then(res => {
          that.searchAddress_list = res.data;
          that._address = this.$refs.addressInput.value;
          that.isAddShow = true;
        })
        .catch(err => {
            console.log(err)
        })
      });
    },
    /**
     * 根据经纬度反查详细地址
     */
    lngAndLatSearchAddress(lng, lat) {
      const that = this;

      let url = 'https://apis.map.qq.com/ws/geocoder/v1/';
      this.$jsonp(url,{
          key:'DAXBZ-VIQKS-7QAOO-6LPOB-EMQN7-UAFOU',
          callbackName: 'QQmap',
          output:'jsonp',
          location:`${lat},${lng}`
        })
      .then(res => {
        if(res && res.result && res.result.formatted_addresses && res.result.formatted_addresses.recommend) {
          that.save_createStore_obj.addressInfo = res.result.formatted_addresses.recommend;
        }else{
          // 重置地图位置
          Object.assign(that.save_createStore_obj, {
            addressInfo: "", // 详细地址
            _longitude: "", // 经度（暂存）
            _latitude: "", // 纬度'（暂存）
            longitude: "", // 经度
            latitude: "", // 纬度'
          });
          that.warn('查无地址，请重新选择门店位置！');
        };
        // 清空地址搜索项
        that.searchAddress_list = [];
      })
      .catch(err => {
          console.log(err)
      })
    },
    /**
     * 确认门店地图坐标
     */
    handleDialogMap() {
      // 如果select选择的地址与地图选点的位置一致，那么就不需要重新选点
      if(this.save_createStore_obj.longitude == this.save_createStore_obj._longitude && this.save_createStore_obj.addressInfo) {
        this.dialogMap = false;
        return;
      };
      this.save_createStore_obj.longitude = this.save_createStore_obj._longitude;
      this.save_createStore_obj.latitude = this.save_createStore_obj._latitude;
      this.dialogMap = false;
      this.lngAndLatSearchAddress(this.save_createStore_obj.longitude, this.save_createStore_obj.latitude);
    },
    /**
     * 地图选择门店坐标
     */
    fnMap() {
      const that = this;
      //
      if(!this.save_createStore_obj.areaCode) {
        this.warn('请选择省市区！');
        return;
      };

      this.dialogMap = true;

      // 地图只执行一次
      if(this.dialogMapTF) {
        this.TMap('DAXBZ-VIQKS-7QAOO-6LPOB-EMQN7-UAFOU').then(qq => {
          var map = new qq.maps.Map(document.getElementById("container"), {
              // 地图的中心地理坐标。
              center: new qq.maps.LatLng(39.916527, 116.397128),
              // center: center,
              zoom:11
          });
          var citylocation = new qq.maps.CityService({
            complete : function(results){
              map.setCenter(results.detail.latLng);
            }
          });
          // 根据城市名称显示地图区域
          citylocation.searchCityByName(this.save_createStore_obj.cityName);
          var marker = null;
          // 坐标回显
          marker = new qq.maps.Marker({
              position:new qq.maps.LatLng(that.save_createStore_obj.latitude, that.save_createStore_obj.longitude),
              map: map
          });
          // 点击创建门店坐标
          qq.maps.event.addListener(map, 'click', function(event) {
            that.save_createStore_obj._longitude = event.latLng.getLng();
            that.save_createStore_obj._latitude = event.latLng.getLat();
            console.log(that.save_createStore_obj.longitude)
            if(marker) {
              marker.setMap(null);
            };
            marker = new qq.maps.Marker({
                position:new qq.maps.LatLng(event.latLng.getLat(), event.latLng.getLng()),
                map: map
            });
          });
        });
        this.dialogMapTF = false;
      }
    },
    /**
     * 关闭地图时，地图初始化
     */
    handleClose() {
      if (!this.save_createStore_obj.longitude) {
        this.dialogMapTF = true;
      };
    },
    /**
     * 腾讯地图
     * @param { String } key
     */
    TMap(key) {
      return new Promise(function (resolve, reject) {
        window.init = function () {
          resolve(qq);
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://map.qq.com/api/js?v=2.exp&callback=init&key="+key;
        script.onerror = reject;
        document.head.appendChild(script);
      })
    },
    /**
     * 检验门店名称
     * @param { String } value 门店名称
     * @param { Function } callback 校验的回调函数
     *
     */
     async checkStoreName(value, callback) {
      if (!value){
        callback(new Error('请输入门店名称！'));
        return;
      };
      // 如果编辑原来的名字，则不做请求校验
      if(this.storeName != value) {
        let data = await this.request(
          this.api.store.storeBasic_check,
          {name:value}
        );
        if(!data) {
          callback(new Error('已存在相同的门店名称，请重新输入！'));
        }else{
          callback();
        };
      }else{
          callback();
      };

    },
    /**
     * 获取门店信息
     * @param { String } id 门店 id
     *
     */
    getStoreInfo(id) {
      const that = this;
      this.request(
        this.api.store.storeBasic_get,
        {id},
        true
      ).then(res => {
        // delete res.organizationId;
        // 不要直接this.save_createStore_obj = res，这样会把初始化的数据替换掉；
        Object.assign(this.save_createStore_obj, res);
        // 赋值经度位置预选
        this.save_createStore_obj._latitude = this.save_createStore_obj.latitude;
        this.save_createStore_obj._longitude = this.save_createStore_obj.longitude;

        let data = this.save_createStore_obj;
        // 处理门店名称
        this.storeName = JSON.parse(JSON.stringify(data.name));
        // 处理启用门店调拨
        data.enableAllocation = this.save_createStore_obj.enableAllocation ? true : false ;
        // 小程序展示
        data.enableShowWeChat = this.save_createStore_obj.enableShowWeChat ? true : false ;
        // 门店自收银
        data.enableOwnSettlement = this.save_createStore_obj.enableOwnSettlement ? true : false ;
        // 无会员开单
        data.enableNoMemberBilling = this.save_createStore_obj.enableNoMemberBilling ? true : false ;
        // 订单改价
        data.enableOrderPrice  = this.save_createStore_obj.enableOrderPrice  ? true : false ;
        // 处理图片
        data.images.forEach((item, idnex) => {
          switch(item.type) {
            case 0:
              data.storeImgs_list.push({url:item.url});
            break;
            case 1:
              data.enclosure_list.push({url:item.url});
            break;
          }
        });
        // 处理logo
        data.logoImage_list.push({ url:data.logoImage });
        console.log(data.logoImage)
        // 处理经营信息
        let infosMap_arr = [];

        Object.values(data.infosMap).forEach((item, index) => {
          item.forEach((items, indexs) => {
            infosMap_arr.push(items);
          });
        });
        console.log(infosMap_arr);

        infosMap_arr.forEach((item, idnex) => {
          switch(item.type) {
            case 0:
              this.findTime(item, data.manageType_list);
            break;
            case 1:
              this.findTime(item, data.paymentType_list);
            break;
            case 2:
              this.findTime(item, data.manageRange_list);
            break;
            case 3:
              this.findTime(item, data.storeTag_list);
            break;
          }
        });
        console.log(data)
      });
    },
    /**
     * 查找经营信息匹配的项
     * @param { Object } item 当前对比的对象；
     * @param { Array } arr 需要查找的数组；
     */
    findTime(item, arr) {
      var findTime = arr.find((items, indexs) => {
        return item.dataName == items.name;
      });
      if(findTime){
        findTime.checked = true;
      };
    },
    /**
     * 选择字典项
     * @param { Object } item 当前项
     */
    selectCheckbox(item) {
      item.checked = !item.checked;
    },
    /**
     * 获取字典项
     */
    getAllCode() {
      this.request(
        this.api.system.ALL_CODESET_POST,
        {},
        true
      ).then(res => {
        res.forEach((item, index) => {
          switch(item.name) {
            case 'STO001':
              // 门店类型列表
              item.codeItemList.forEach((itemk, indexk) => {
                itemk.checked = false;
              });
              this.store_list = item.codeItemList;
              break;
            case 'COM002':
              // 经营类型列表
              item.codeItemList.forEach((itemk, indexk) => {
                itemk.checked = false;
              });
              this.save_createStore_obj.manageType_list = item.codeItemList;
              break;
            case 'STO002':
              // 门店收款方式
              item.codeItemList.forEach((itemk, indexk) => {
                itemk.checked = false;
              });
              this.save_createStore_obj.paymentType_list = item.codeItemList;
            break;
            case 'STO003':
              // 门店货权归属
              item.codeItemList.forEach((itemk, indexk) => {
                itemk.checked = false;
              });
              this.goodsowner_list = item.codeItemList;
            break;
              case 'STO004':
              // 经营范围列表
              item.codeItemList.forEach((itemk, indexk) => {
                itemk.checked = false;
              });
              this.save_createStore_obj.manageRange_list = item.codeItemList;
            break;
              case 'STO005':
              // 门店标签
              item.codeItemList.forEach((itemk, indexk) => {
                itemk.checked = false;
              });
              this.save_createStore_obj.storeTag_list = item.codeItemList;
            break;
          }
        });
        // 获取门店信息
        if(this.isEcho) {
          this.getStoreInfo(this.$route.query.id);
        };
      });
    },
    /**
     * 获取人员列表
     */
    user_listByPhonet() {
      this.request(
        this.api.store.user_listByPhonet,
        this.filtersData,
        true
      ).then(res => {
        this.principal_list = res != null ? [res] : [];
      });
    },
    /**
     * 搜索
     */
    handleSearch() {
      this.user_listByPhonet();
    },
    /**
     * 选择地区回调
     * @param { Object } obj 选择区域返回的回调函数
     */
    setDivision(obj) {
      console.log(obj)
      this.searchAddress_list = [];

      Object.assign(this.save_createStore_obj, {
        "provinceName": obj.province,// 省份名称
        "provinceCode": obj.provinceCode,// 省份 code
        "divisionId":obj.divisionId,// 区 id
        "cityName": obj.municipality,// 城市名称
        "cityCode": obj.municipalityCode,// 城市 code
        "areaName": obj.area,// 区域名称
        "areaCode": obj.areaCode,// 区域 code
      });
    },
    /**
     * 匹配营业时间段
     * @param { Regular } /^\d+:\d+/g  开头为数字，匹配n个，然后匹配'：'再然后数字n个
     */
    matchTime(strTime) {
      if(!strTime) return;
      var reg = /\d+:\d+/g;
      var regZone = /0800/g;
      var str = strTime && strTime.match(reg)[0];
      var isZone = regZone.test(strTime);

      str = str.split(':');
      // 此处需加8个小时（时区时间）
      if(!isZone) {
        str = this.replenishZero((parseInt(str[0]) + 8)%24) + ':' + str[1];
      }else{
        str = `${str[0]}:${str[1]}`
      };
      return str;
    },
    /**
     * 补零函数
     * @param { Nunber | String } item 数字或数字字符串 如： 1，'1'
     * @return { String } 如：'01'
     */
    replenishZero(item) {
        item = parseInt(item);

        return item < 10 ? `0${item}` : item;
    },
    /**
     * 添加门店负责人
     * @param { Object } item 选中的当前项
     */
    add_principal(item) {
      if(!item) return;
      Object.assign(this.save_createStore_obj, {
        principalId:item.id,
        principalName:item.name
      });
      this.dialogTableVisible = false;
    },
    /**
     * 新建或编辑门店
     */
    save_createStore() {
      let that = this,
        data = JSON.parse(JSON.stringify(this.save_createStore_obj));
      if(this.isEcho) {
        Object.assign(data, {
          id:this.$route.query.id
        })
      };
      // 添加创建人姓名
      data.createName = this.userInfo.name;
      // 添加隶属机构名称
      if(!this.isEcho) {
        data.organizationName = this.$refs.organizationName.organizationList[0].name;
        console.log(this.$refs.organizationName)
      };
      // 处理启用门店调拨
      data.enableAllocation = this.save_createStore_obj.enableAllocation ? 1 : 0 ;
      // 处理启用门店调拨
      data.enableShowWeChat = this.save_createStore_obj.enableShowWeChat ? 1 : 0 ;
      // 处理门店自收银
      data.enableOwnSettlement = this.save_createStore_obj.enableOwnSettlement ? 1 : 0 ;
      // 处理无会员开单
      data.enableNoMemberBilling = this.save_createStore_obj.enableNoMemberBilling ? 1 : 0 ;
      // 订单改价
      data.enableOrderPrice  = this.save_createStore_obj.enableOrderPrice  ? 1 : 0 ;
      // 处理经营信息
      data.infos = [];
      this.pushInfos(this.save_createStore_obj.manageType_list, 0, data);
      this.pushInfos(this.save_createStore_obj.paymentType_list, 1, data);
      this.pushInfos(this.save_createStore_obj.manageRange_list, 2, data);
      this.pushInfos(this.save_createStore_obj.storeTag_list, 3, data);
      // 处理图片
      data.images = [];
      this.pushImages(this.save_createStore_obj.storeImgs_list, 0, data);
      this.pushImages(this.save_createStore_obj.enclosure_list, 1, data);
      // 处理门店logo
      if( data.logoImage_list.length > 0){
        data.logoImage = data.logoImage_list[0].url;
      }
      // 删除无用数据
      delete data.enclosure_list;
      delete data.manageRange_list;
      delete data.manageType_list;
      delete data.paymentType_list;
      delete data.storeImgs_list;
      delete data.storeTag_list;
      delete data.logoImage_list;
      delete data.infosMap;
      console.log(data);
      // return;
      this.$refs.formName.validate((valid) => {
        if (valid) {
          let text = this.isEcho ? '零售门店信息修改后将立即生效，是否确认修改？' : '请确认以上内容填写无误，是否确认创建此门店？';
          let textEcho = this.isEcho ? '编辑成功！' : '新建成功！';

          this.$confirm(text, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 请求
            this.request(
              this.api.store.storeBasic_save,
              data
            ).then(res => {
              this.warn(textEcho);
              this.href('store/store/store_info_list');
            });
          }).catch(() => {
            this.warn('已取消！',{
              type:'info'
            });

          });

        } else {
           this.warn('门店信息未填写完整，请填写完整后重试！','warning');
          return;
        }
      });
    },
    /**
     * 添加经营信息
     * @param { Array } arr 父级数组集合
     * @param { Number } type 经营信息类型
     * @param { Object } data 提交对象集合
     */
    pushInfos(arr, type, data) {
      arr.forEach((item, index) => {
        if(item.checked) {
          data.infos.push({
            "dataName": item.name,
            "dataId": item.codeSetId,
            "type": type
          })
        }
      });
    },
    /**
     * 提示
     * @param { String } message 提示文案
     * @param { String } type 提示类型
     */
    warn(message, type) {
      this.$message({
        message: message,
        type: type || 'success'
      });
    },
    /**
     * 跳转
     * @param { String } routeName 路由跳转名字
     */
    href(routeName) {
      this.$router.push({
        path: `/${routeName}`
      });
    },
    /**
     * 添加门店图片，附件信息
     * @param { Array } arr 父级数组集合
     * @param { Number } type 经营信息类型
     * @param { Object } data 提交对象集合
     */
    pushImages(arr, type, data) {

      arr.forEach((item, index) => {
        console.log(arr)
        data.images.push({
          "type": type,
          "url": item.url
        })
      });
    },
    /**
     * 点击页数
     * @param { Number } pageIndex 当前页
     */
    handleCurrentChange(pageIndex){
        this.filtersData.pageIndex = pageIndex;
        this.user_listByPhonet();
    },
    /**
     * 改变每页展示条目
     * @param { Number } pageSize 每页展示条目
     */
    handleSizeChange(pageSize){
        this.filtersData.pageSize = pageSize;
        this.user_listByPhonet();
    },
  },
  components: {
    codeSet,
    division,
    treeDept,
    ElUploadImg,
    OrganizationSelect,
    businessTime
  }
};
</script>
<style  lang="less" scoped>
.add{
  position: relative;
}
.address{
  width: 370px;
  padding: 0 15px;
  background-color: #FFF;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 32px;
}
.addOv{
  height: 240px;
}
.address::-webkit-input-placeholder {
    color: #C0C4CC;
}
.address2{
    background: #F5F7FA;
    color: #C0C4CC;
  }
.address-box{
  position: absolute;
  bottom:50px;
  overflow-y: scroll;
  left:0px;                            
  background: #fff;
  width: 370px;
  border-radius: 5px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  position: absolute;
  font-size: 12px;
  color: #606266;
  z-index: 9999;
}
.address-box .li{
  text-indent: 30px;
  width: 360px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.address-box .li:hover{
  background: #f5f7fa;
}
.address-box:after{
  // position: absolute;
  // display: block;
  // width: 0;
  // height: 0;
  // border-color: transparent;
  // border-style: solid;
  // bottom: 12px;
  // left: 48px;
  // margin-left: -6px;
  // border-top-width: 0;
  // border-bottom-color: #fff;
  // content: " ";
  // border-width: 6px;
}
#container{
  width: 100%;
  height: 500px;
  border: 1px solid #666;
}
.add_principal{
  color: #2290E8;
  cursor: pointer;
}

.create-store {
  margin: 8px;
  background: #fff;
  position: relative;
  padding: 20px 20px 60px 20px;
  .save {
    position: absolute;
    left: 140px;
  }
  .form-label {
    margin-top: 20px;
    .el-input,
    .el-select {
      width: 370px;
    }
    .el-checkbox-group {
      width: 650px;
    }
    .el-checkbox-group /deep/ .el-checkbox{
      width: 100px;
    }
    .el-input-short {
      width: 180px;
    }
    .video-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 80px;
      height: 80px;
      text-align: center;
      line-height: 80px;
      span {
        font-size: 35px;
        color: #d9d9d9;
      }
    }
    .video-upload-p {
      color: #666;
      font-size: 12px;
    }
    .video-upload:hover {
      border: 1px dashed #409eff;
    }
  }
}
.display-flex {
  display: flex;
}
</style>

