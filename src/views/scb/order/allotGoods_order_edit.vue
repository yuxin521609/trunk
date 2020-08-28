<style lang="less" scoped>
  .transfer-slip-add-goods{display: flex;
    .upload-goods-btn{display: inline-block;margin-left: 15px;}
    .side{width: 320px;background: #fff;margin-left: 8px;line-height: 24px;
      .tabs{margin-top: 10px;}

    }
    .table-list{flex: 1;background: #fff;margin-top: 0;
      .goods-list{
        .type-list{padding-top: 0;padding-bottom: 0;}
      }
      .check-goods-list{

      }
    }
    .page-more{border-top: 1px solid #e6e8ed;margin-top: 10px;
      div.btn{
        width: 120px;border: 1px solid #e6e8ed;border-top: 1px solid #fff;margin: -1px auto 0;text-align: center;font-size: 12px;cursor: pointer;line-height: 30px;
      }
    }
    .index-goods-table{padding-top: 0;}
  }
  .transfer-slip-add-goods /deep/ .el-table__expanded-cell[class*=cell]{padding: 0;}
  .transfer-slip-add-goods .txt-red /deep/ .el-input__inner{color: red;}
</style>
<template>
  <div class="transfer-slip-add-goods">
    <el-dialog width="835px" title="修改收货信息" :visible.sync="dialogTableVisible">
      <el-form ref="addFormData" :model="transferSlipAddInfo" label-width="120px" :rules="rules" class="item-form" size="small">
        <el-form-item label="收货人：" prop="receiveMan">
          <el-input v-model="transferSlipAddInfo.receiveMan" placeholder="请输入内容" class="input-w-2"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input v-model="transferSlipAddInfo.phone" placeholder="请输入内容" class="input-w-2"></el-input>
        </el-form-item>
        <el-form-item label="所在地区：" prop="divisionId">
          <division v-model="transferSlipAddInfo.divisionId" @set-division="setDivision" width-class="input-w" ref="division"></division>
        </el-form-item>
        <el-form-item label="" prop="addressInfo">
          <el-input v-model="transferSlipAddInfo.addressInfo" placeholder="请输入详细地址" class="input-w-2"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="dialogTableVisible = false"  size="small">取消</el-button>
          <el-button type="primary" @click="changeAddress" size="small">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--左侧-->
    <div class="side">
      <div class="item-cont">
        <el-button size="small" type="primary" @click="settleQuery_findSettle">已选商品</el-button>
        <el-upload class="upload-goods-btn" :action="uploadGoodsUrl" :show-file-list="false" :auto-upload="false" :on-change="uploadGoodsChange">
          <el-button size="small" type="primary" plain>导入商品</el-button>
        </el-upload>
        <el-tabs v-model="activeName" class="tabs" :before-leave="handleBeforeClick" type="card">
          <el-tab-pane label="调出方" name="outStoreInfo">
            <store-info :storeType="false" :store-info="outStoreInfo"></store-info>
          </el-tab-pane>
          <el-tab-pane label="调入方" name="inStoreInfo">
            <store-info :storeType="true" :store-info="inStoreInfo"></store-info>
            <el-button type="primary" @click="dialogTableVisible = true">修改收货信息</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--右侧-->
    <div class="table-list item-margin">
      <!--商品主列表-->
      <div class="goods-list" v-if="!checkedGoodsShow">
        <!--商品主列表查询条件-->
        <div>
          <el-form class="item-form" :model="formData" label-width="90px" size="small" ref="searchForm" inline :rules="rules">
            <el-form-item label="商品分类：">
              <el-cascader class="input-w" :options="classData" v-model="cateArr" @change="classChange" :show-all-levels="false" :props="props" change-on-select clearable></el-cascader>
            </el-form-item>
            <el-form-item label="价格筛选：" prop="money">
              <el-input class="input-w" placeholder="请输入区间下限" v-model.number="formData.retailPriceLowerLimit"></el-input>
              &nbsp;
              <el-input class="input-w" placeholder="请输入区间上限" v-model.number="formData.retailPriceUpperLimit"></el-input>
            </el-form-item>
            <el-form-item label="库存量：" prop="count">
              <el-input class="input-w" placeholder="请输入区间下限" v-model.number="formData.quantityLowerLimit"></el-input>
              &nbsp;
              <el-input class="input-w" placeholder="请输入区间上限" v-model.number="formData.quantityUpperLimit"></el-input>
            </el-form-item>
            <el-form-item label="设计商：" prop="designCompanyId">
              <el-select class="input-w" placeholder="请选择" v-model="formData.designCompanyId" clearable filterable>
                <el-option v-for="item in designCompanyOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌：" prop="brandId">
              <el-select class="input-w" placeholder="请选择" v-model="formData.brandId" clearable filterable>
                <el-option v-for="item in brandOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
          <div class="type-list item-cont">
            <check-tags :checked-data="formData.collocationTagIdList"></check-tags>
          </div>
        </div>
        <div class="item-cont index-goods-table">
          <page-table :form-data="formData" :get-data="getTableData" :table-data="tableData">
            <el-table :data="tableData.data" style="width: 100%" @expand-change="tableDataExpandChange">
              <el-table-column type="expand" width="50">
                <template slot-scope="scope">
                  <el-table :data="scope.row._skuList" style="width: 100%" :show-header="false">
                    <el-table-column label="占位" width="50"></el-table-column>
                    <el-table-column prop="goodsCode" label="商品款号" width="200"></el-table-column>
                    <el-table-column prop="goodsName" label="名称" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="商品图片">
                      <template slot-scope="scope">
                        <image-popover :img-src="scope.row.image"></image-popover>
                      </template>
                    </el-table-column>
                    <el-table-column prop="color" label="颜色" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="size" label="规格"></el-table-column>
                    <el-table-column prop="brandName" label="品牌" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="fullCateName" label="品类" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="priceTag" label="吊牌价"></el-table-column>
                    <el-table-column prop="quantity" label="库存量"></el-table-column>
                    <el-table-column label="操作" width="150">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.inputQuantity"  @input.native="goodsQuantityInput($event, scope.row)" @change="goodsQuantityChange(scope.row)" :min="0" label="选择的数量" size="mini" :class="{'txt-red' : scope.row.quantity < scope.row.inputQuantity}"></el-input-number>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column prop="productCode" label="商品款号"  width="200"></el-table-column>
              <el-table-column prop="goodsName" label="名称" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="商品图片">
                <template slot-scope="scope">
                  <image-popover :img-src="scope.row.image"></image-popover>
                </template>
              </el-table-column>
              <el-table-column label="颜色"></el-table-column>
              <el-table-column label="规格"></el-table-column>
              <el-table-column prop="brandName" label="品牌" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="fullCateName" label="品类" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="priceTag" label="吊牌价"></el-table-column>
              <el-table-column prop="quantity" label="库存量"></el-table-column>
              <el-table-column label="操作" width="150">

              </el-table-column>
            </el-table>
          </page-table>
        </div>
      </div>
      <!--选中的商品-->
      <div class="check-goods-list" v-if="checkedGoodsShow">
        <transfer-slip-goods-table :checked-goods-show.sync="checkedGoodsShow" :table-data="checkedSKUTableData" :transfer-slip-add-info="transferSlipAddInfo" ref="transferSlipGoodsTable"></transfer-slip-goods-table>
      </div>
    </div>

  </div>
</template>
<script>
  // TODO 临时解决上传文件
  import axios from 'axios'
  import { getToken } from "@/utils/auth";


  import PageTable from "@/views/collocation/components/PageTable";
  import CheckTags from "@/views/collocation/components/CheckTags";
  import StoreInfo from "../components/allotStoreInfo";
  import TransferSlipGoodsTable from "../components/allotTransferSlipGoodsTable";
  import division from "@/components/division";
  import ImagePopover from "@/views/collocation/components/ImagePopover";
  export default {
    // 组件
    components: {
      PageTable,
      TransferSlipGoodsTable,
      CheckTags,
      StoreInfo,
      ImagePopover,
      division
    },
    // 数据
    data() {
      return {
        dialogTableVisible:false,
        addFormData: {
          // 发货人
          allotMan: '',
          // 发货人直属机构
          organizationId: '',
          organizationName: '',
          // 订单类型
          // orderType: '0203',
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
        // 路由参数
        _orderSn: null,
        _outStoreId: null,

        // 默认显示门店信息 outStoreInfo: 发货门店     inStoreInfo: 收货门店
        activeName: 'outStoreInfo',
        // 发货门店详情
        outStoreInfo: null,
        // 收货门店详情
        inStoreInfo: null,
        // 导入商品地址
        uploadGoodsUrl: this.api.FN_ALLPATH(this.api.retailStore.storeProduct_importOrderItem),
        // 导入是否可点
        uploadGoodsDisabled: false,
        // 导入附带参数
        uploadGoodsParams: {
          storeId: ''
        },
        // 最终保存提交信息
        transferSlipAddInfo: {},
        // 选择的商品列表
        checkedSKUTableData: [],

        // 是否显示选中的
        checkedGoodsShow: false,
        // 查询商品参数
        formData: {
          // 所属门店
          storeId: '',
          // 商品分类
          cateIdentifier: '',
          // 价格筛选
          retailPriceLowerLimit: '',
          retailPriceUpperLimit: '',
          // 库存量
          quantityLowerLimit: '',
          quantityUpperLimit: '',
          // 设计商
          designCompanyId: '',
          // 品牌
          brandId: '',
          // 综合搜索
          searchWords: '',
          // 标签
          collocationTagIdList: [],
          // 当前页码
          pageIndex: 1,
          // 每页数量
          pageSize: 10
        },
        // 商品主表格数据
        tableData: {},

        /**
         * 商品查询辅助数据
         */
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
          label: 'name',
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
        /**
         * 商品查询辅助数据--end
         */
      }
    },
    created(){
      // 获取上页面缓存的门店信息
      let transferSlipAddInfo = sessionStorage.getItem('TRANSFER_SLIP_APP_INFO');
      if(transferSlipAddInfo){
        this.transferSlipAddInfo = JSON.parse(transferSlipAddInfo);
        this.formData.storeId = this.transferSlipAddInfo.outStoreId;
        this.uploadGoodsParams.storeId = this.transferSlipAddInfo.outStoreId;
      }
    },
    // 初始化数据
    mounted() {
      this.$nextTick(()=> {
        this.init();
        this.$route.meta.title = this.$route.query.id ? '编辑调货订单' : '新增调货订单';
      })
    },
    // 方法
    methods: {
      /**
       * 获取返货单已选商品列表（为了获取调入结算单价）
       */
      settleQuery_findSettle(){
        const that = this;
        const data = {
          "infoVOList": this.checkedSKUTableData,
          "sourceMerchantId": this.transferSlipAddInfo.inStoreId,
          "targetMerchantId": this.transferSlipAddInfo.outStoreId
        };
        this.checkedGoodsShow = true;

        if(this.checkedSKUTableData.length == 0) return;
        this.request(
          this.api.scb.settleQuery_findSettle,
          data
        ).then(res => {
          // that.checkedSKUTableData.length =  0;
          that.checkedSKUTableData.forEach((item, index) => {
            let subCheckItem = res.find((items, indexs) => {
              return item.goodsCode == items.goodsCode;
            });
            if(subCheckItem) {
              this.$set(item,'inputQuantity',subCheckItem.inputQuantity);
              this.$set(item,'settlePrice',subCheckItem.settlePrice);
            };
          });
          console.log(that.checkedSKUTableData)
          // res.forEach(item => {
          //   item.allotPrice = item.settlePrice;
          //   item.stock = item.quantity;
          //   that.checkedSKUTableData.push(item);
          // });
          this.$refs.transferSlipGoodsTable.getCheckedAllSKUInfo();
        });
      },
      /**
       * 修改收货地址
       */
      changeAddress() {
        Object.assign(this.inStoreInfo, this.transferSlipAddInfo);
        this.inStoreInfo.linkman = this.transferSlipAddInfo.receiveMan;
        this.dialogTableVisible = false;
      },
      // 获取省市信息
      setDivision(division){
        this.transferSlipAddInfo.provinceName =  division.province;
        this.transferSlipAddInfo.provinceCode =  division.provinceCode;
        this.transferSlipAddInfo.cityName =  division.municipality;
        this.transferSlipAddInfo.cityCode =  division.municipalityCode;
        this.transferSlipAddInfo.areaName =  division.area;
        this.transferSlipAddInfo.areaCode =  division.areaCode;
        this.transferSlipAddInfo.divisionId =  division.divisionId;
      },
      // 初始化
      init(){
        // 获取上页面参数
        this.getQueryParams();
        // 获取发货门店详情
        this.getStoreInfo(this.transferSlipAddInfo.outStoreId, 'outStoreInfo');
        // 获取设计商列表
        this.getDesignCompanyOptions();
        // 获取品牌列表
        this.getBrandOptions();
        // 获取商品分类列表
        this.getClassData();
        // 获取表格数据
        this.getTableData();
      },
      // 获取上页面参数
      getQueryParams() {
        this._orderSn = this.$route.query.orderSn;
        this._outStoreId = this.$route.query.outStoreId;
        if(this._orderSn && this._outStoreId){
          this.getStoreAllotOrderProductInfoList(this._orderSn, this._outStoreId)
        }
      },
      // 获取商品详情
      getStoreAllotOrderProductInfoList(orderSn, outStoreId){
        this.request(this.api.order.storeAllotOrderProductInfo_list, {orderSn ,outStoreId}).then(data => {
          this.checkedGoodsShow = true;
          this.checkedSKUTableData = data.data;
          this.checkedSKUTableData.forEach((item, index) => {
            this.$set(item, 'inputQuantity', item.quantity);
            this.$set(item, 'priceTag', item.retailPrice);
            this.$set(item, 'allotPrice', item.price);
          })
          this.settleQuery_findSettle();
        });
      },
      /**
       * 获取门店详情
       * @param id {String} 门店id
       * @param type {String} outStoreInfo: 发货门店 inStoreInfo: 收货门店
       */
      getStoreInfo(id, type){
        if(!this[type]){
          this.request(this.api.retailStore.storeBasic_get, {id: id}).then(data => {
            this[type] = data;
          });
        }
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
        formData.set('sourceMerchantId', this.transferSlipAddInfo.outStoreId );
        formData.set('targetMerchantId', this.transferSlipAddInfo.inStoreId );
        axios({
          method: "POST",
          url: this.api.FN_ALLPATH(this.api.scb.settleQuery_importOrderItem),
          headers: {
            "Content-Type": "multipart/form-data",
            accessToken: token
          },
          data: formData
        }).then(res => {
          let data = res.data;
          // 合并导入的数据和已选择的数据
          if(data.code && data.code == 200){
            let goodsData = data.data;
            if(goodsData && goodsData.length > 0){
              for(let n = 0; n < goodsData.length; n++){
                let goodsIndex = this.checkedSKUTableData.findIndex(item => {
                  return item.goodsCode === goodsData[n].goodsCode
                });
                if(goodsIndex !== -1){
                  this.checkedSKUTableData[goodsIndex].quantity = goodsData[n].quantity + this.checkedSKUTableData[goodsIndex].quantity;
                  this.checkedSKUTableData[goodsIndex].inputQuantity = goodsData[n].inputQuantity;
                }else {
                  goodsData[n].allotPrice = goodsData[n].retailPrice;
                  this.checkedSKUTableData.push(goodsData[n])
                }
              }
            }
            this.checkedGoodsShow = true;
            this.$nextTick(() => {
              this.$refs.transferSlipGoodsTable.init();
            })
          }else {
            this.$notify.error({ title: '错误',message: data.message});
          }
        })

      },
      /**
       * 左侧门店类型切换
       * @param activeName {String} 选择的门店类型名称
       */
      handleBeforeClick(activeName) {
        this.getStoreInfo(this.transferSlipAddInfo.inStoreId, activeName);
      },
      // 点击搜索
      searchTableData(){
        this.formData.pageIndex = 1;
        this.getTableData();
      },
      /**
       * 重置查询条件
       * @param formName {String} 表单的节点ref的值
       */
      initFormData(formName){
        this.$refs[formName].resetFields();
        this.cateArr = [];
        this.formData.cateIdentifier = '';
        this.formData.retailPriceLowerLimit = '';
        this.formData.retailPriceUpperLimit = '';
        this.formData.quantityLowerLimit = '';
        this.formData.quantityUpperLimit = '';
      },
      // 获取spu商品数据
      getTableData() {
        this.$nextTick(() => {
          setTimeout(()=> {
            this.$refs.searchForm.validate((valid) => {
              if (valid) {
                let params = JSON.parse(JSON.stringify(this.formData));
                if(params.collocationTagIdList.length === 0){
                  params.collocationTagIdList = null
                }
                this.request(this.api.scb.movingAveragePrice_selectAllocateProduct, params).then(data => {
                  if(data.data && data.data.length){
                    data.data.forEach(item => {
                      item._skuList = [];
                    });
                    this.tableData = data;
                  }else {
                    this.tableData = {};
                  }
                });
              } else {
                return false;
              }
            });
          },0)
        })
      },
      /**
       * 点击左侧三角 获取sku商品
       * @param row {Object} 表格行数据
       * @param expandedRows {Array} 表格行数据
       */
      tableDataExpandChange(row, expandedRows){
        if(row._skuList.length) return;
        let params = {
          productCode: row.productCode,
          storeId: this.transferSlipAddInfo.outStoreId
        };
        this.request(this.api.scb.movingAveragePrice_datalist, params).then(data => {
          if(data.dataList.data && data.dataList.data.length){
            data.dataList.data.forEach(item => {
              // 新增提交需要的字段
              item.inputQuantity = item.quantity;
              item.inputQuantity = 0;
              if(this.checkedSKUTableData.length > 0){
                for(let i = 0; i < this.checkedSKUTableData.length; i++){
                  if(this.checkedSKUTableData[i].goodsCode === item.goodsCode){
                    item.inputQuantity = this.checkedSKUTableData[i].inputQuantity;
                  }
                }
              }
            });
            row._skuList = data.dataList.data;
          }
        });
      },
      /**
       * 输入修改商品数量
       * @param $event {Object} event
       * @param row {Object} 表格行数据
       */
      goodsQuantityInput($event, row){
        this.$nextTick(()=>{
          let val = $event.target.value;
          row.planBackQuantity = $event.target.value = val.replace(/[^\d.]/g,'');
          this.goodsQuantityChange(row);
        })
      },
      /**
       * + -修改商品数量
       * @param row {Object} 表格行数据
       */
      goodsQuantityChange(row){
        let index = this.checkedSKUTableData.findIndex(item => {
          return item.goodsCode === row.goodsCode;
        });
        if(index !== -1){
          if(row.quantity == 0){
            this.checkedSKUTableData.splice(index, 1);
          }else{
            this.checkedSKUTableData[index].inputQuantity = row.inputQuantity;
          }
        }else {
          this.checkedSKUTableData.push(row);
        }
      },


      /**
       * 搜索商品参数下拉数据及验证
       */
      // 验证价格区间
      moneyRule(rule, value,callback) {
        const reg = /^[0-9]*$/;
        if(!reg.test(this.formData.retailPriceLowerLimit) || !reg.test(this.formData.retailPriceUpperLimit)){
          callback(new Error('价格区间必须是数字'));
          return
        }
        if(this.formData.retailPriceLowerLimit && this.formData.retailPriceUpperLimit && this.formData.retailPriceLowerLimit >= this.formData.retailPriceUpperLimit){
          callback(new Error('价格区间下限应小于上限'));
        }else {
          callback();
        }
      },
      // 验证数量区间
      countRule(rule, value,callback) {
        const reg = /^[0-9]*$/;
        if(!reg.test(this.formData.quantityLowerLimit) || !reg.test(this.formData.quantityUpperLimit)){
          callback(new Error('库存量区间必须是数字'));
          return
        }
        if(this.formData.quantityLowerLimit && this.formData.quantityUpperLimit && this.formData.quantityLowerLimit >= this.formData.quantityUpperLimit){
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
          this.formData.cateIdentifier = '';
          return;
        }
        let cateId  = JSON.parse(JSON.stringify(e)).pop();
        let obj = this.classList.find((item)=>(item.id == cateId));
        this.formData.cateIdentifier = obj.identifier;
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
