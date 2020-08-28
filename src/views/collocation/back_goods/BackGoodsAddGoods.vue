<style lang="less" scoped>
  .back-goods-add-goods{display: flex;
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
      .total-price{float: left; width: 40%;}
      .btns{float: right;}
    }
    .index-goods-table{padding-top: 0;}
  }
</style>
<template>
  <div class="back-goods-add-goods">
    <div class="side">
      <div class="item-cont">
        <el-button size="small" type="primary" @click="checkedGoodsShow = true">已选商品</el-button>
        <el-tabs v-model="activeName" class="tabs" :before-leave="handleBeforeClick" type="card">
          <el-tab-pane label="门店资料" name="store" class="store-info">
            <ul>
              <li><span>门店名称：</span>{{ storeInfo.name }}</li>
              <li><span>所在地区：</span>{{ storeInfo.provinceName }} {{ storeInfo.cityName }} {{ storeInfo.areaName }}</li>
              <li><span>门店类型：</span>{{ "STO001" | codeToName(storeInfo.type) }}</li>
              <li v-if="storeInfo.infosMap && storeInfo.infosMap.length">
                <span>经营类型：</span>
                <i v-for="info in storeInfo.infosMap[0]">{{ "COM002" | codeToName(info.type) }}</i></li>
              <li><span>店铺面积：</span>{{ storeInfo.storeArea }}m²</li>
              <li v-if="storeInfo.images && storeInfo.images.length"><span>门店图片：</span>
                <img :src="image.url" alt="图片" v-for="image in storeInfo.images">
              </li>
              <li><span>收货人：</span>{{ backGoodsInfo.receiveMan }}</li>
              <li><span>联系电话：</span>{{ backGoodsInfo.phone }}</li>
              <li><span>收货地址：</span>{{ backGoodsInfo.provinceName }} {{ backGoodsInfo.cityName }} {{ backGoodsInfo.areaName }} {{ backGoodsInfo.addressInfo }}</li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="商品相关" name="goods" class="goods-info">
            <div class="category">
              <h5>热销品类</h5>
              <ul class="clearfix">
                <li v-for="(item, index) in productTypeList">{{ ++index }}.{{ item.productType }}</li>
              </ul>
            </div>
<!--            <div class="tags">-->
<!--              <h5>热销标签</h5>-->
<!--              <ul>-->
<!--                <li>-->
<!--                  <span class="label">适合色系：</span>-->
<!--                  <div class="tag">-->
<!--                    <el-tag type="info" size="mini">标签三</el-tag>-->
<!--                    <el-tag type="info" size="mini">标签三</el-tag>-->
<!--                    <el-tag type="info" size="mini">标签三</el-tag>-->
<!--                    <el-tag type="info" size="mini">标签三</el-tag>-->
<!--                    <el-tag type="info" size="mini">标签三</el-tag>-->
<!--                    <el-tag type="info" size="mini">标签三</el-tag>-->
<!--                    <el-tag type="info" size="mini">标签三</el-tag>-->
<!--                    <el-tag type="info" size="mini">标签三</el-tag>-->
<!--                    <el-tag type="info" size="mini">标签三</el-tag>-->
<!--                  </div>-->
<!--                </li>-->
<!--              </ul>-->
<!--              <div class="page-more">-->
<!--                <div @click="getMoreTags" class="btn">-->
<!--                  更多标签<i class="el-icon-arrow-down"></i>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="table-list item-margin">
      <!--商品主列表-->
      <div class="goods-list" v-if="!checkedGoodsShow">
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
            <el-form-item label="综合搜索：" prop="filter">
              <el-input class="input-w" placeholder="款号、名称" v-model="formData.filter"></el-input>
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
              <el-table-column prop="price" label="吊牌价"></el-table-column>
              <el-table-column prop="stockQuantity" label="库存量"></el-table-column>
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
        <div class="item-cont clearfix">
          <div class="total-price">商品总价：{{ checkedSKUTotalPrice }}</div>
          <div class="total-price">商品总数：{{ checkedSKUTotal }}</div>
          <div class="btns">
            <el-button type="primary" @click="finalSub" size="small">完成返货</el-button>
            <el-button type="primary" @click="checkedGoodsShow = false" size="small">继续返货</el-button>
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
  import PageTable from "@/views/collocation/components/PageTable";
  import CheckTags from "@/views/collocation/components/CheckTags";
  import BackGoodsTable from "@/views/collocation/components/BackGoodsTable";
  import ImagePopover from "@/views/collocation/components/ImagePopover";
  export default {
    name: '',
    // 数据
    data() {
      return {
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
          filter: '',
          // 标签
          // collocationTagIdList: [],
          // 当前页码
          pageIndex: 1,
          // 每页数量
          pageSize: 10
        },
        // 商品主表格数据
        tableData: {},
        tableDataCheckedRow: {},
        // 弹窗商品数据
        SKUTableData: [],
        // 选择的商品
        checkedSKUTableData: [],
        checkedSKUTotalPrice: 0,
        checkedSKUTotal: 0,
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
      }else {
        this.$notify.error({ title: '错误',message: '信息丢失'});
        // 回退到选择门店;
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/back_goods/back_goods_add'
        });
      }
    },
    // 初始化数据
    mounted() {
      this.$nextTick(()=> {
        this.getStoreInfo();
        this.getDesignCompanyOptions();
        this.getBrandOptions();
        this.getClassData();
        this.getTableData();
      })
    },
    // 方法
    methods: {
      // 获取门店信息
      getStoreInfo(){
        if(this.backGoodsInfo.storeType) return;
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
                this.request(this.api.retailStore.storeStock_list, params).then(data => {
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
        this.request(this.api.retailStore.storeProduct_list, params).then(data => {
          if(data.data && data.data.length){
            for(let n = 0; n < data.data.length; n++){
              data.data[n].planBackQuantity = 0;
              data.data[n].backUnitPrice = data.data[n].price;
              if(this.checkedSKUTableData.length > 0){
                for(let i = 0; i < this.checkedSKUTableData.length; i++){
                  if(this.checkedSKUTableData[i].id === data.data[n].id){
                    data.data[n].planBackQuantity = this.checkedSKUTableData[i].planBackQuantity;
                  }
                }
              }
            }
          }
          this.SKUTableData = data.data;
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
      // 类型切换
      handleBeforeClick(activeName) {
        if(activeName === 'store'){
          this.getStoreInfo();
        }
        if(activeName === 'goods'){
          this.getStoreTags();
        }
      },
      // 计算总价
      checkedTotalPrice(){
        this.checkedSKUTotal = 0;
        this.checkedSKUTotalPrice = 0;
        if(this.checkedSKUTableData.length){
          this.checkedSKUTableData.forEach(item => {
            this.checkedSKUTotalPrice += Number(item.backUnitPrice) * Number(item.planBackQuantity);
            this.checkedSKUTotal += item.planBackQuantity;
          });
        }
        this.checkedSKUTotalPrice = this.checkedSKUTotalPrice.toFixed(2)
      },
      // 获取更多标签
      getMoreTags() {},
      // 最终提交
      finalSub(){
        if(!this.checkedSKUTableData.length){
          return
        }
        this.backGoodsInfo.returnProductList = [];
        this.backGoodsInfo.totalPrice = this.checkedSKUTotalPrice;
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
            // 吊牌价
            retailPrice: item.price,
            // 返货单价
            backUnitPrice: item.backUnitPrice,
            // 数量
            planBackQuantity: item.planBackQuantity
          };
          this.backGoodsInfo.returnProductList.push(obj);
          goodsNum += item.planBackQuantity;
        });
        this.backGoodsInfo.productNum = goodsNum;
        this.request(this.api.order.returnGoods_save, this.backGoodsInfo).then(data => {
          this.$notify.success({ title: '成功',message: '新增成功'});
          let module = '/' + this.$route.path.split('/')[1];
          this.$router.push({
            path: module + '/back_goods/back_goods_list'
          })
        });
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
