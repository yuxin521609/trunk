<style lang="less" scoped>
  .back-goods-add-goods{display: flex;
    .upload-goods-btn{display: inline-block;margin-left: 15px;}
    .side{width: 320px;background: #fff;margin-left: 8px;line-height: 24px;
      .tabs{margin-top: 10px;}
      .store-info{
        ul{
          li{margin-bottom: 5px;position: relative;padding-left: 70px;
            img{width: 80px;height: 80px;margin-right: 10px;margin-bottom: 10px;}
            span{width: 70px;text-align: right;display: block;position: absolute;left: 0;top: 0;}
          }
        }
      }
      .goods-info{
        .category{
          ul{
            li{width: 50%;float: left;margin-bottom: 5px;

            }
          }
        }
        .tags{
          ul{
            li{display: flex;
              .label{display: inline-block;width: 80px;}
              div{flex: 1;
                .el-tag{margin-right: 5px;margin-bottom: 5px;}
              }
            }
          }
        }
      }
    }
    .table-list{flex: 1;background: #fff;margin-top: 0;
      .goods-list{
        .type-list{padding-top: 0;padding-bottom: 0;

        }
      }
      .check-goods-list{

      }
    }
    .page-more{border-top: 1px solid #e6e8ed;margin-top: 10px;
      div.btn{
        width: 120px;border: 1px solid #e6e8ed;border-top: 1px solid #fff;margin: -1px auto 0;text-align: center;font-size: 12px;cursor: pointer;line-height: 30px;
      }
    }
    .item-cont{
      .total-price{
        font-size: 17px;
        margin-top: 15px;
      }
      .btns{float: right;}
    }
    .index-goods-table{padding-top: 0;}
  }
</style>
<template>
  <div class="back-goods-add-goods">
    <!-- 选择调出入方信息 -->
    <el-dialog min-width="800px" max-width="1200px" title="选择收货仓库" :visible.sync="dialogIncludeObj.isDialogTableVisible">
      <el-form
        class="item-form"
        :model="dialogIncludeObj.formDataIn"
        label-width="90px"
        size="small"
        ref="formData"
        inline>
      <el-form-item label="仓库类型：" prop="orderStatus">
        <el-select
          placeholder="请选择"
          class="input-w"
          v-model="dialogIncludeObj.formDataIn.warehouseType"
          filterable
          clearable>
          <el-option v-for="(item, index) in warehouseType" :key="index" :label="item" :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库名称：" prop="orderStatus">
        <el-select
          placeholder="请选择"
          class="input-w"
          v-model="dialogIncludeObj.formDataIn.warehouseName"
          filterable
          clearable>
          <el-option v-for="item in searchWarehouseList" :key="item.id" :label="item.warehouseName" :value="item.warehouseName"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item>
          <el-button @click="searchWarehouse" type="primary" plain>搜索</el-button>
          <el-button @click="initWarehouse" plain>重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dialogIncludeObj.tableInDate" max-height="350" class="mt-10">
        <el-table-column label="单选" align="center" min-width="50">
          <template slot-scope="scope">
            <el-radio-group v-model="dialogIncludeObj.checkInItem">
              <el-radio :disabled="scope.row.status == 10" :label="scope.row">&nbsp;</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="仓库名称" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.warehouseName }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="仓库类型" align="center" min-width="90">
          <template slot-scope="scope">{{ warehouseType[scope.row.warehouseType] }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="所在省/直辖市" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.provinceName }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="市/区" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.areaName }}</template>
        </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="详细地址" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="联系人" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.contact }}</template>
        </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="联系电话" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.telephone }}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogIncludeObj.isDialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="inNext">确定</el-button>
      </span>
    </el-dialog>
    <div class="side">
      <div class="item-cont">
        <el-button size="small" type="primary" @click="checkedGoodsShow = true">已选商品</el-button>
        <el-upload class="upload-goods-btn" :action="uploadGoodsUrl" :show-file-list="false" :auto-upload="false" :on-change="uploadGoodsChange">
          <el-button size="small" type="primary" plain>导入商品</el-button>
        </el-upload>
        <el-tabs v-model="activeName" class="tabs" type="card">
          <el-tab-pane label="退返货方" name="store" class="store-info">
            <ul>
              <li><span>客户名称：</span>{{ storeInfo.name }}</li>
              <li><span>所在地区：</span>{{ storeInfo.provinceName }} {{ storeInfo.cityName }} {{ storeInfo.areaName }}</li>
              <li><span>门店类型：</span>{{ "STO001" | codeToName(storeInfo.type) }}</li>
              <li v-if="storeInfo.infosMap && storeInfo.infosMap.length">
                <span>经营类型：</span>
                <i v-for="info in storeInfo.infosMap[0]">{{ "COM002" | codeToName(info.type) }}</i></li>
              <li><span>店铺面积：</span>{{ storeInfo.storeArea }}m²</li>
              <li v-if="storeInfo.images && storeInfo.images.length"><span>门店图片：</span>
                <img :src="image.url" alt="图片" v-for="image in storeInfo.images">
              </li>
              <li><span>收货人：</span>{{ storeInfo.linkman }}</li>
              <li><span>联系电话：</span>{{ storeInfo.phone }}</li>
              <li><span>客户地址：</span>{{ storeInfo.provinceName }} {{ storeInfo.cityName }} {{ storeInfo.areaName }} {{ storeInfo.addressInfo }}</li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="收货仓库" name="goods" class="store-info">
            <ul>
              <li><span>仓库名称：</span>{{ backGoodsInfo.warehouseName }}</li>
              <li><span>仓库类型：</span>{{ warehouseType[backGoodsInfo.warehouseType] }}</li>
              <li><span>负责人：</span>{{ backGoodsInfo.receiveMan }}</li>
              <li><span>联系电话：</span>{{ backGoodsInfo.phone }}</li>
              <li><span>仓库地址：</span>{{ backGoodsInfo.provinceName }} {{ backGoodsInfo.cityName }} {{ backGoodsInfo.areaName }} {{ backGoodsInfo.addressInfo }}</li>
            </ul>
            <el-button class="mt-20" type="primary" @click="dialogIncludeObj.isDialogTableVisible = true">更改收货仓库</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="table-list item-margin">
      <!--商品主列表-->
      <div class="goods-list" v-show="!checkedGoodsShow">
        <div class="">
          <el-form class="item-form" :model="formData" label-width="90px" size="small" ref="searchForm" inline :rules="rules">
            <el-form-item label="商品分类：">
              <el-cascader
                  class="input-w"
                  :options="classData"
                  v-model="cateArr"
                  @change="classChange"
                  :show-all-levels="false"
                  :props="props"
                  change-on-select
                  clearable
              ></el-cascader>
            </el-form-item>
            <el-form-item label="价格筛选：" prop="money">
              <el-input class="input-w" placeholder="请输入区间下限" v-model.number="formData.lowerPriceLimit"></el-input>
              &nbsp;
              <el-input class="input-w" placeholder="请输入区间上限" v-model.number="formData.priceCap"></el-input>
            </el-form-item>
            <el-form-item label="库存量：" prop="count">
              <el-input class="input-w" placeholder="请输入区间下限" v-model.number="formData.lowerInventoryLimit"></el-input>
              &nbsp;
              <el-input class="input-w" placeholder="请输入区间上限" v-model.number="formData.inventoryCap"></el-input>
            </el-form-item>
            <el-form-item label="设计商：" prop="designCompanyCode">
              <el-select class="input-w" placeholder="请选择" v-model="formData.designCompanyCode" clearable filterable>
                <el-option
                    v-for="item in designCompanyOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌：" prop="brandCode">
              <el-select class="input-w" placeholder="请选择" v-model="formData.brandCode" clearable filterable>
                <el-option
                    v-for="item in brandOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="综合搜索：" prop="searchWords">
              <el-input class="input-w" placeholder="款号、货号、名称" v-model="formData.searchWords"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="searchTableData" type="primary" plain>搜索</el-button>
              <el-button @click="initFormData('searchForm')" plain>重置</el-button>
            </el-form-item>
          </el-form>
          <!--<div class="type-list item-cont">
            <check-tags :checked-data="formData.collocationTagIdList"></check-tags>
          </div>-->
        </div>
        <div class="item-cont index-goods-table">
          <page-table :form-data="formData" :get-data="getTableData" :table-data="tableData">
            <el-table :data="tableData.data" style="width: 100%">
              <el-table-column prop="productCode" label="商品款号"></el-table-column>
              <el-table-column prop="goodsName" label="名称" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="商品图片">
                <template slot-scope="scope">
                  <image-popover :img-src="scope.row.image"></image-popover>
                </template>
              </el-table-column>
              <el-table-column prop="brandName" label="品牌" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="designCompanyName" label="设计商"></el-table-column>
              <el-table-column prop="productType" label="品类" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="priceTag" label="吊牌价"></el-table-column>
              <el-table-column prop="quantity" label="库存量"></el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="checkGoods(scope.row)">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </page-table>
        </div>
      </div>
      <!--选中的商品-->
      <div class="check-goods-list" v-if="checkedGoodsShow">
        <back-goods-table :table-data="checkedSKUTableData" key="2" :is-del="true" v-if="checkedGoodsShow"></back-goods-table>
        <div class="item-cont mb-30">
          <div class="total-price">吊牌总价：{{ retailPriceTotal }}</div>
          <div class="total-price">sku种类数：{{ skuNum }}</div>
          <div class="total-price">返货总数：{{ goodsTotal }}</div>
          <div class="total-price">退返货值：{{ checkedSKUTotalPrice }}</div>
          <div class="btns">
            <el-button type="primary" @click="href" size="small" plain>取消</el-button>
            <el-button type="primary" @click="finalSub('13')" size="small" plain>存草稿</el-button>
            <el-button type="primary" @click="checkedGoodsShow = false" size="small" plain>继续返货</el-button>
            <el-button type="primary" @click="finalSub('1')" size="small">确定返货</el-button>
          </div>
        </div>
      </div>
    </div>
    <!--点击商品主列表  弹窗选择商品-->
    <el-dialog title="选择SKU" :visible.sync="SKUDialog" width="80%" :close-on-click-modal="false">
      <back-goods-table :table-data="SKUTableData" key="1" v-if="SKUDialog"></back-goods-table>
      <div class="item-cont clearfix ">
        <div class="btns">
          <el-button type="primary" @click="checkGoodsSub" size="small">确定</el-button>
          <el-button @click="SKUDialog = false" size="small">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // TODO 临时解决上传文件
  import axios from 'axios'
  import { getToken } from "@/utils/auth";

  import PageTable from "@/views/collocation/components/PageTable";
  import CheckTags from "@/views/collocation/components/CheckTags";
  import BackGoodsTable from "../components/BackGoodsTable";
  import ImagePopover from "@/views/collocation/components/ImagePopover";
  export default {
    name: '',
    // 数据
    data() {
      return {
        searchWarehouseList:[],
        isSearchWarehouseList:true,
        id:null,
        backId:null,
        backNum:null,
        backGoodsInfo:{},
        returnProductInfo_list_data:{},
        warehouseType:{
          '07001':'总仓',
          '07002':'分仓',
          '07003':'中转仓'
        },
        // 弹框中包裹的对象
        dialogIncludeObj:{
          // out为调出方，in调入方
          type:'out',
          // 弹出框是否显示
          isDialogTableVisible:false,
          // 调出单检索条件 ---
          formDataOut:{
            orderStatus:null,
            pageIndex:1,
            pageSize:10
          },
          // 调出单
          tableOutDate:{
            data:[],
            totalCount:15
          },
          // 选中调出单某一项
          checkOutItem:{},
          // 调入单检索条件 ---
          formDataIn:{
            warehouseType:null,
            warehouseName:null
          },
          // 调入单
          tableInDate:{
            data:[]
          },
          // 选中调入单某一项
          checkInItem:{}
        },
        // 收货人
        backWarehouse_obj:{
          warehouseCode: null,
          warehouseName: null,
          // 收货人
          receiveMan:null,
          // 电话
          phone: null,
          divisionId: null,
          addressInfo:null,
          provinceName: null,
          provinceCode: null,
          cityName: null,
          cityCode: null,
        },
        // 默认显示门店信息
        activeName: 'store',
        // 门店信息数据
        storeInfo: {},
        // 门店商品相关
        productTypeList: [],
        // 弹窗选择商品
        SKUDialog: false,
        // 是否显示选中的
        checkedGoodsShow: false,
        // 查询商品参数
        formData: {
          // 所属机构或货主
          relationDepId: '',
          // 所属门店
          storeId: '',
          // 商品分类
          productType: '',
          // 价格筛选
          lowerPriceLimit: '',
          priceCap: '',
          // 库存量
          lowerInventoryLimit: '',
          inventoryCap: '',
          // 设计商
          designCompanyCode: '',
          // 品牌
          brandCode: '',
          // 综合搜索
          searchWords: '',
          // 标签
          // collocationTagIdList: [],
          // 当前页码
          pageIndex: 1,
          // 每页数量
          pageSize: 10
        },
        // 导入商品地址
        uploadGoodsUrl: this.api.FN_ALLPATH(this.api.retailStore.storeProduct_importOrderItem),
        // 商品主表格数据
        tableData: {},
        tableDataCheckedRow: {},
        // 弹窗商品数据
        SKUTableData: [],
        // 选择的商品
        checkedSKUTableData: [],
        checkedSKUTotalPrice: 0,
        checkedSKUTotal: 0,
        retailPriceTotal:0,
        skuNum:0,
        // 提交信息
        backGoodsInfo: {},

        /** 商品查询辅助数据*/
        // 验证
        rules: {
          money: [
            { required: false, validator: this.moneyRule, trigger: 'blur'}
          ],
          count: [
            { required: false, validator: this.countRule, trigger: 'blur'}
          ]
        },
        // 分类映射
        props:{
          value: 'id',
          label:'name',
          children: 'children'
        },
        // 分类数据
        classData:[],
        classList:[],
        // 选中的分类
        cateArr:[],
        // 品牌
        brandOptions:[],
        // 设计商
        designCompanyOptions:[]
        /** 商品查询辅助数据--end */
      }
    },
    // 组件
    components: {
      PageTable,
      BackGoodsTable,
      CheckTags,
      ImagePopover
    },
    created(){
      // 获取上页面缓存的门店信息
      let backGoodsInfo = sessionStorage.getItem('BACK_GOODS_INFO');
      if(backGoodsInfo){
        this.backGoodsInfo = JSON.parse(backGoodsInfo);
        this.formData.relationDepId = this.backGoodsInfo.organizationId;
        this.formData.storeId = this.backGoodsInfo.storeId;
        this.init();
      }
      if(this.$route.query.id) {
        this.backId = this.$route.query.id;
        this.backNum =  this.$route.query.backNum;
        this.getReturnGoods();
        this.getReturnProductInfoList();
      }
    },
    // 初始化数据
    mounted() {
      this.$route.meta.title = this.$route.query.id ? '编辑退返货订单' : '新增退返货订单';
    },
    // 方法
    methods: {
      init() {
        this.getStoreInfo();
        this.getTableData();
        this.getDesignCompanyOptions();
        this.getBrandOptions();
        this.getClassData();
        this.getOrganizationIdByUserId();
      },
      // 获取详情
      getReturnGoods(){
        this.request(this.api.order.returnGoods_get, {id: this.backId}).then(res => {
          this.backGoodsInfo = res;
          this.init();
        });
      },
      // 获取商品列表
      getReturnProductInfoList(){
        this.request(this.api.order.returnProductInfo_list, {orderSn:this.backNum}).then(data => {
          this.checkedSKUTableData = data.data;
          this.checkedGoodsShow = true;
          this.checkedSKUTableData.forEach((item, index) => {
            item.realityBackQty = item.realityBackQty == null ? '--' : item.realityBackQty;
            item.priceTag = item.retailPrice;
            item.price = item.backUnitPrice;
            item.quantity = item.planBackQuantity;
          });
          this.checkedTotalPrice();
        });
      },
      searchWarehouse() {
        this.getWarehouseList();
      },
      initWarehouse() {
        Object.assign(this.dialogIncludeObj.formDataIn, {
          warehouseType:null,
          warehouseName:null
        });
      },
      inNext() {
        var inObj = this.dialogIncludeObj.checkInItem;
        if(JSON.stringify(inObj) == '{}') return;
        Object.assign(this.backGoodsInfo,{
          warehouseCode: inObj.warehouseCode,
          warehouseName: inObj.warehouseName,
          // 收货人
          receiveMan:inObj.contact,
          // 电话
          phone: inObj.telephone, 
          divisionId: inObj.divisionId,
          addressInfo:inObj.address,
          provinceName: inObj.provinceName,
          provinceCode: inObj.provinceCode,
          cityName: inObj.cityName,
          cityCode: inObj.cityCode
        });
        this.dialogIncludeObj.isDialogTableVisible = false;
      },
      async getOrganizationIdByUserId(){
        let info = await this.request(this.api.user.get_userinfo, {}, true);
        let url = this.api.user.userCompany_getUserOrgByUserId;
        this.request(url, {userId: info.userId}).then(data => {
          this.id = data.id;
          this.getWarehouseList();
        });
      },
      //获取仓库数据
      getWarehouseList() {
        Object.assign(this.dialogIncludeObj.formDataIn, {
          orgId: this.id, 
          used: true
        });
        this.request(
          this.api.warehouse.warehouse_list,
          this.dialogIncludeObj.formDataIn
        ).then(data => {
          this.dialogIncludeObj.tableInDate = data.data;
          if(this.isSearchWarehouseList) {
            this.searchWarehouseList = JSON.parse(JSON.stringify(data.data));
            this.isSearchWarehouseList = false;
            if(!this.backGoodsInfo.warehouseType) {
              let checkWarehouseType = data.data.find((item, index) => {
                return item.warehouseCode = this.backGoodsInfo.warehouseCode;
              })
              this.backGoodsInfo.warehouseType = checkWarehouseType.warehouseType;
            }
          }
          data.data.forEach((item, index) => {
            item.createTime = this.$options.filters.timestampToTime(item.createTime);
          });
        });
      },
      // 获取门店信息
      getStoreInfo(){
        this.request(this.api.retailStore.storeBasic_get, {id: this.backGoodsInfo.storeId}).then(data => {
          this.storeInfo = data;
          this.backGoodsInfo.storeType = this.storeInfo.type;
        });
      },
      // 获取门店热门销售标签
      getStoreTags(){
        if(this.productTypeList.length > 0) return;
        this.request(this.api.retailStore.storeProduct_listTagByStoreId, {storeId: this.backGoodsInfo.storeId}).then(data => {
          this.productTypeList = data;
        });
      },
      // 点击搜索
      searchTableData(){
        this.formData.pageIndex = 1;
        this.getTableData();
      },
      // 获取商品数据
      getTableData() {
        this.$nextTick(() => {
          setTimeout(()=> {
            this.$refs.searchForm.validate((valid) => {
              if (valid) {
                let params = JSON.parse(JSON.stringify(this.formData));
                /*if(params.collocationTagIdList.length === 0){
                  params.collocationTagIdList = null
                }*/
                if(params.lowerInventoryLimit || params.inventoryCap ){
                  params.validStock = null
                }
                this.request(this.api.scb.movingAveragePrice_selectAllocateProduct, params).then(data => {
                  this.tableData = data;
                });
              } else {
                return false;
              }
            });
          },0)
        })
      },
      // 重置查询条件
      initFormData(formName){
        this.$refs[formName].resetFields();
        this.cateArr = [];
        this.formData.productType = '';
        this.formData.searchWords = '';
        this.formData.lowerPriceLimit = '';
        this.formData.priceCap = '';
        this.formData.lowerInventoryLimit = '';
        this.formData.inventoryCap = '';
      },
      // 获取选择商品
      checkGoods(row){
        this.tableDataCheckedRow = row;
        let params = {
          productCode: row.productCode,
          storeId: row.storeId,
          // relationDepId: row.relationDepId,
          // 页码
          pageIndex: 1,
          // 每页数量
          pageSize: 10000
        };
        this.request(this.api.scb.movingAveragePrice_datalist, params).then(data => {
          if(data.dataList.data && data.dataList.data.length){
            for(let n = 0; n < data.dataList.data.length; n++){
              data.dataList.data[n].planBackQuantity = 0;
              data.dataList.data[n].backUnitPrice = data.dataList.data[n].price;
              if(this.checkedSKUTableData.length > 0){
                for(let i = 0; i < this.checkedSKUTableData.length; i++){
                  if(this.checkedSKUTableData[i].id === data.dataList.data[n].id){
                    data.dataList.data[n].planBackQuantity = this.checkedSKUTableData[i].planBackQuantity;
                  }
                }
              }
            }
          }
          this.SKUTableData = data.dataList.data;
          this.SKUDialog = true;
        });
      },
      // 确认选择商品
      checkGoodsSub(){
        for(let i = 0; i < this.SKUTableData.length; i++){
          let good = this.SKUTableData[i];
          let checkedGood = this.checkedSKUTableData.find(item => {
            return item.id === good.id;
          });
          if(checkedGood){
            if(good.planBackQuantity === 0){
              let index = this.checkedSKUTableData.find(item => {
                return item.id === good.id;
              });
              this.checkedSKUTableData.splice(index, 1)
            }else {
              checkedGood.planBackQuantity = good.planBackQuantity;
            }
          }else if(!checkedGood && good.planBackQuantity > 0){
            this.SKUTableData[i].designCompanyName = this.tableDataCheckedRow.designCompanyName;
            this.SKUTableData[i].designCompanyCode = this.tableDataCheckedRow.designCompanyCode;
            this.checkedSKUTableData.push(this.SKUTableData[i]);
          }
        }
        // 计算总价
        this.checkedTotalPrice();
        this.SKUDialog = false;
      },
      // 计算总价
      checkedTotalPrice(){
        this.retailPriceTotal = 0;
        this.skuNum = this.checkedSKUTableData.length;
        this.goodsTotal = 0;
        this.checkedSKUTotalPrice = 0;
        if(this.checkedSKUTableData.length){
          this.checkedSKUTableData.forEach(item => {
            this.retailPriceTotal += Number(item.priceTag) * Number(item.planBackQuantity);
            this.checkedSKUTotalPrice += Number(item.price) * Number(item.planBackQuantity);
            this.goodsTotal += item.planBackQuantity;
          });
        }
        this.retailPriceTotal = this.retailPriceTotal.toFixed(2)
        this.checkedSKUTotalPrice = this.checkedSKUTotalPrice.toFixed(2)
      },
      // 获取更多标签
      getMoreTags() {},
      // 取消
      href() {
        this.$router.push({
          path: '/scb/order/returnGoods_order'
        });
      },
      // 最终提交
      finalSub(backStatus){
        if(!this.checkedSKUTableData.length){
          return
        }
        this.backGoodsInfo.returnProductList = [];
        this.backGoodsInfo.totalPrice = this.checkedSKUTotalPrice;
        this.backGoodsInfo.backStatus = backStatus;
        let goodsNum = 0;
        this.checkedSKUTableData.forEach(item => {
          let obj = {
            // 货品编码
            goodsCode: item.goodsCode,
            // 货品名称
            goodsName: item.goodsName,
            // 商品(spu)编码
            productCode: item.productCode,
            // 商品类型
            productType: item.productType,
            // 商品图片
            image: item.image,
            // 品牌
            brandName: item.brandName,
            brandCode: item.brandCode,
            // 设计商
            designCompanyName: item.designCompanyName,
            designCompanyCode: item.designCompanyCode,
            // 尺码
            size: item.size,
            // 颜色
            color: item.color,
            // 颜色色系
            colorSeries: item.colorSeries,
            // 吊牌价
            retailPrice: item.priceTag,
            // 返货单价
            backUnitPrice: item.price,
            // 数量
            planBackQuantity: item.planBackQuantity
          };
          this.backGoodsInfo.returnProductList.push(obj);
          goodsNum += item.planBackQuantity;
        });
        this.backGoodsInfo.productNum = goodsNum;
        this.request(this.api.order.returnGoods_keep, this.backGoodsInfo).then(data => {
          this.$notify.success({ title: '成功',message: '新增成功'});
          let module = '/' + this.$route.path.split('/')[1];
          this.$router.push({
            path: module + '/order/returnGoods_order'
          })
        });
      },
      /**
       * 导入商品
       * @param file 上传的文件
       */
      uploadGoodsChange(file){
        // 判断类型
        if (!(/((.xlsx)|(.xls))$/.test(file.name))) {
          this.$message.error('文件格式只能是 xlsx | xls格式!');
          return false
        }
        let formData = new FormData();
        let token = getToken();
        formData.set('file', file.raw );
        formData.set('storeId', this.formData.storeId );
        axios({
          method: "POST",
          url: this.api.FN_ALLPATH(this.api.scb.settleQuery_importExcel),
          headers: {
            "Content-Type": "multipart/form-data",
            accessToken: token
          },
          data: formData
        }).then(res => {
          let data = res.data;
          // 合并导入的数据和已选择的数据
          this.$notify.success({ title: '成功',message: '导入成功'});
          if(data.code && data.code == 200){
            let goodsData = data.data;
            if(goodsData && goodsData.length > 0){
              for(let n = 0; n < goodsData.length; n++){
                let goodsIndex = this.checkedSKUTableData.findIndex(item => {
                  return item.goodsCode === goodsData[n].goodsCode
                });
                if(goodsIndex !== -1){
                  this.checkedSKUTableData[goodsIndex].planBackQuantity = goodsData[n].inputQuantity;
                }else {
                  goodsData[n].allotPrice = goodsData[n].retailPrice;
                  // goodsData[n].planBackQuantity = goodsData[n].inputQuantity;
                  this.$set(goodsData[n], 'planBackQuantity', goodsData[n].inputQuantity);
                  this.checkedSKUTableData.push(goodsData[n])
                }
              }
            }
            this.checkedTotalPrice();
            this.checkedGoodsShow = true;
            this.$nextTick(() => {
              // this.$refs.transferSlipGoodsTable.init();
            })
          }else {
            this.$notify.error({ title: '错误',message: data.message});
          }
        })

      },
      /**
       * 搜索商品参数下拉数据及验证
       */
      // 验证价格区间
      moneyRule(rule, value,callback) {
        const reg = /^[0-9]*$/;
        if(!reg.test(this.formData.lowerPriceLimit) || !reg.test(this.formData.priceCap)){
          callback(new Error('价格区间必须是数字'));
          return
        }
        if(this.formData.lowerPriceLimit && this.formData.priceCap && this.formData.lowerPriceLimit >= this.formData.priceCap){
          callback(new Error('价格区间下限应小于上限'));
        }else {
          callback();
        }
      },
      // 验证数量区间
      countRule(rule, value,callback) {
        const reg = /^[0-9]*$/;
        if(!reg.test(this.formData.lowerInventoryLimit) || !reg.test(this.formData.inventoryCap)){
          callback(new Error('库存量区间必须是数字'));
          return
        }
        if(this.formData.lowerInventoryLimit && this.formData.inventoryCap && this.formData.lowerInventoryLimit >= this.formData.inventoryCap){
          callback(new Error('库存量区间下限应小于上限'));
        }else {
          callback();
        }
      },
      // 获取商品分类数据
      getClassData(){
        //分类类型（1：标准分类，2：定制分类，3：原料分类或者称为属性分类）
        this.$common.getClassSelect(this,1).then(res =>{
          this.classData=res.ztree;
          this.classList=res.list;
        })
      },
      // 商品分类Change
      classChange(e){
        if(e.length === 0){
          this.formData.productType = '';
          return;
        }
        let cateId  = JSON.parse(JSON.stringify(e)).pop();
        let obj = this.classList.find((item)=>(item.id == cateId));
        this.formData.productType = obj.fullCateName;
      },
      // 获取设计商
      getDesignCompanyOptions(){
        this.request(this.api.product.designCompany_list, {}).then(data => {
          this.designCompanyOptions=data.data;
        });
      },
      // 获取品牌
      getBrandOptions(){
        this.request(this.api.product.productBrand_list,{}).then(data => {
          this.brandOptions= data.data;
        });
      }
      /**
       * 搜索商品参数下拉数据--end
       */
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
