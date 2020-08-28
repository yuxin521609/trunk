<template>
  <div class="box">
    <el-dialog title="选择商品" :visible.sync="dialogTableVisible">
      <div>
        <el-form
          class="item-form"
          size="small"
          :inline="true"

          :model="goodsFiltersData">
          <!-- 模糊查询 -->
          <el-form-item prop="cateIdentifier" clearable label="品类：">
            <el-cascader
              class="input-w"
              :options="classData"
              v-model="cateArr"
              :value="cateArr"
              @change="cascaderGet"
              :show-all-levels="false"
              :props="props"
              change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="品牌：">
            <el-select class="input-w" filterable clearable placeholder="请选择" v-model="goodsFiltersData.brandId">
              <el-option
                v-for="item in brandOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="售价：">
            <el-input placeholder="请输入售价最小值" clearable  v-model.number="goodsFiltersData.retailPriceGE" class="el-input-width155"></el-input>
            <el-input placeholder="请输入售价最大值" clearable  v-model.number="goodsFiltersData.retailPriceLE" class="el-input-width155 ml-10"></el-input>
          </el-form-item>
          <el-form-item label="季节：">
            <el-select v-model="goodsFiltersData.seasonalStyleCode" clearable placeholder="请选择">
              <el-option v-for="(item, index) in codeItem_list_get.data" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店内库存：">
            <el-input placeholder="请输入库存最小值" clearable  v-model="goodsFiltersData.quantityLowerLimit" class="el-input-width155"></el-input>
            <el-input placeholder="请输入库存最大值" clearable  v-model="goodsFiltersData.quantityUpperLimit" class="el-input-width155 ml-10"></el-input>
          </el-form-item>
          <el-form-item label="关键词：">
            <el-input placeholder="请输入关键词，如：货号、款号、商品名称" clearable  v-model="goodsFiltersData.searchWords" class="el-input-width355"></el-input>
          </el-form-item>
          <!-- 搜索，重置 -->
          <el-form-item>
            <el-button size="small" @click="handleSearch" type="primary" plain>搜索</el-button>
            <el-button size="small" @click="handleResetFilters">重置</el-button>
          </el-form-item>
        </el-form>
      </div>  
      <div>
        <!-- 全部商品 -->
        <div class="item-table">
          <page-table :form-data="filtersData" :get-data="purchasingAgentProduct_scbProductToProductDiscount" :table-data="goodsList">
            <el-table
              class="mt-20"
              :data="goodsList.data"  
              stripe
              empty-text="暂无数据"
              header-align="center"
              header-row-class-name="item-table-header"
              :highlight-current-row="true">
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品款号" min-width="100">
                <template  slot-scope="scope">{{ scope.row.code|| '--' }}</template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="品牌" min-width="100">
                <template  slot-scope="scope">{{ scope.row.brandName || '--' }}</template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="品类" min-width="100">
                <template  slot-scope="scope">{{ scope.row.fullCateName || '--' }}</template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品名称" min-width="100">
                <template  slot-scope="scope">{{ scope.row.name || '--' }}</template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="吊牌价" min-width="100">
                <template  slot-scope="scope">{{ scope.row.retailPrice  }}</template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品图片" min-width="100">
                <template  slot-scope="scope"><img class="discountImg" :src="scope.row.image" alt=""></template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="当前折扣" min-width="100">
                <template  slot-scope="scope">{{ scope.row.currentMerchantDiscountValue || '--' }}</template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column
                  fixed="right"
                  label-class-name="text-center"
                  class-name="text-center"
                  align="center"
                  label="操作"
                  width="180">
                  <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.currentMerchantDiscount === null || scope.row.currentMerchantDiscount === 0" size="small" @click="purchasingAgentDiscount_addSPUToDiscount(scope.row)">添加</el-button>
                    <el-button type="text" v-if="scope.row.currentMerchantDiscount === 2" size="small" @click="purchasingAgentDiscount_transferSPU(scope.row)">移动到当前折扣</el-button>
                    <el-button type="text" v-if="scope.row.currentMerchantDiscount === 1" size="small" @click="purchasingAgentDiscount_deleteSPUFromDiscount(scope.row)">从列表内剔除</el-button>
                  </template>
              </el-table-column>
            </el-table>
         </page-table>
        </div>
      </div>
    </el-dialog>
    <!-- 商户信息 -->
    <h4>商户信息</h4>
    <el-form class="mt-20" :label-position="labelPosition" label-width="90px" :model="formLabelAlign">
      <el-form-item label="商品名：">{{ purchasingAgentPriceManagement_getById_data.merchantName }}</el-form-item>
      <el-form-item label="联系人：">{{ purchasingAgentPriceManagement_getById_data.administrator }}</el-form-item>
      <el-form-item label="联系电话：">{{ purchasingAgentPriceManagement_getById_data.phone }}</el-form-item>
    </el-form>
    <!-- 采购折扣 -->
    <h4>采购折扣</h4>
    <el-input class="mt-20" disabled value="设置后，除指定商品外，该商户结算价格=吊牌价×采购折扣，无输入则按照吊牌价结算。"></el-input>
    <div class="mt-20">采购折扣：{{ purchasingAgentPriceManagement_getById_data.purchaserDiscountValue }}<el-button size="mini" type="success" plain class="ml-20" @click="open(purchasingAgentPriceManagement_getById_data.purchaserDiscountValue)">修改</el-button></div>
    <!-- 货号信息 -->
    <h4 class="mt-20">指定商品折扣</h4>
    <div class="item-table" v-if="discountType">
      <el-button type="primary" @click="purchasingAgentDiscount_save" class="mt-30">新建</el-button>
      <page-table :form-data="filtersData" :get-data="purchasingAgentDiscount_list" :table-data="purchasingAgentDiscount_save_data">
        <el-table
          class="mt-20 table"
          :data="purchasingAgentDiscount_save_data.data"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true">
          <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="折扣" min-width="100">
            <template  slot-scope="scope">{{ scope.row.productDiscountValue }}</template>
          </el-table-column>
          <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品数量" min-width="100">
            <template  slot-scope="scope">{{ scope.row.spuProductQty }}</template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="checkDiscount(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-table>
    </div>
    <div class="item-table" v-else>
      <el-button type="primary" @click="addProduct" class="mt-30">添加</el-button>
      <el-button type="primary" @click="backList" class="mt-30">返回折扣列表</el-button>
      <el-table
        class="mt-20 table"
        :data="goodsData.data"
        stripe
        empty-text="暂无数据"
        header-align="center"
        header-row-class-name="item-table-header"
        :highlight-current-row="true">
        <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品款号" min-width="100">
          <template  slot-scope="scope">{{ scope.row.productCode || '--' }}</template>
        </el-table-column>
        <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="所属分类" min-width="100">
          <template  slot-scope="scope">{{ scope.row._cateNames || '--' }}</template>
        </el-table-column>
        <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="品类" min-width="100">
          <template  slot-scope="scope">{{ scope.row.brandName || '--' }}</template>
        </el-table-column>
       <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品名称" min-width="100">
          <template  slot-scope="scope">{{ scope.row.productName || '--' }}</template>
        </el-table-column>
        <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品图片" min-width="100">
          <template  slot-scope="scope"><img class="discountImg" :src="scope.row.image" alt=""></template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label-class-name="text-center"
          class-name="text-center"
          align="center"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="purchasingAgentDiscount_deleteSPUFromDiscount(scope.row)">剔除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
import codeSet from "@/components/codeSet";
import treeDept from "@/components/treeDept";
import { filter } from "minimatch";
import { get } from "http";
import PageTable from "@/views/collocation/components/PageTable";

let token = getToken();

export default {
  data() {
    return {
      // 检索
      filtersData: {
        pageIndex: 1, // 当前页码
        pageSize: 10, // 每页数量
        "orderBy": "",
      },
      currentMerchantDiscountType:{
        0:'不存在',
        1:'当前折扣值',
        2:'其他折扣值'
      },
      discountType:true,
      dialogTableVisible:false,
      classData: [],
      classList: [],
      cateArr: [],
      cateArrs: [],
      // 季节列表
      codeItem_list_get:[],
      // 全部品牌
      brandOptions:[],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      goodsList:{
        data:[]
      },
      // 商户详情
      purchasingAgentPriceManagement_getById_data:{},
      // 商品折扣列表
      purchasingAgentDiscount_save_data:[],
      // 选中某个折扣
      checkDiscount_item:{},
      // 检索全部商品
      goodsFiltersData:{
        // 当前页码
        pageIndex: 1,
        // 每页数量
        pageSize: 10,
        // 门店id
        storeId:null,
        // 折扣类型
        type:null,
        // 折扣值
        discount:null,
        // 品类id
        cateIdentifier:null,
        // 品牌id
        brandId:null,
        // 售价最小值
        retailPriceGE:null, 
        // 售价最大值
        retailPriceLE:null, 
        // 库存最小值
        quantityLowerLimit:null, 
        // 库存最大值
        quantityUpperLimit:null, 
        // 季节
        seasonalStyleCode:null,
        // 关键词
        searchWords:null 
      },
      id:this.$route.query.id,
      labelPosition: 'right',
      selectArr:[1, 2, 3],
      goodsData:[{
        name:111
      },{
        name:111
      },{
        name:111
      }],
      formLabelAlign: {
        name: '53424400GM',
        region: '',
        type: ''
      }
    }
  },
  created() {
    const that = this;
    this.codeItem_list(); // 获取季节列表
    this.purchasingAgentPriceManagement_getById(); // 获取商户详情
    this.purchasingAgentDiscount_list(); // 获取折扣列表
  },
  methods: {
    /**
     * 返回折扣
     */
    backList() {
      this.discountType = true;
      this.purchasingAgentDiscount_list(); // 获取折扣列表
    },
    /**
     * btn 添加商品
     */
    addProduct() {
      this.dialogTableVisible = true;
      Object.assign(this.filtersData, {
        "purchaseAgentId":this.checkDiscount_item.purchaseAgentId,
        "productDiscountType":"1",
        "productDiscountValue":this.checkDiscount_item.productDiscountValue + ''
      });
      if(this.goodsList.data.length > 0) return;
      this.purchasingAgentProduct_scbProductToProductDiscount(); // 添加SCB商品到商品折扣下
    },
    /**
     * 移动到当前折扣
     */
    purchasingAgentDiscount_transferSPU(item) {
      const that = this;
      const text = `将从”${ item.currentMerchantDiscountValue }折”转移到“${ this.checkDiscount_item.productDiscountValue }折”，是否继续？`;

      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request(
          this.api.scb.purchasingAgentDiscount_transferSPU,
          {
            "priceManagementId": this.id,
            "productCode": item.code,
            "productDiscountId": this.checkDiscount_item.id,
            "oldProductDiscountId":item.currentMerchantDiscountId
          },
          true
        ).then(res => {
          this.warn('移动成功！');
          this.purchasingAgentProduct_scbProductToProductDiscount();// 刷新全部商品
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    /**
     *btn 剔除
     */
    purchasingAgentDiscount_deleteSPUFromDiscount(item) {
      const that = this;

      this.request(
        this.api.scb.purchasingAgentDiscount_deleteSPUFromDiscount,
        {
          "priceManagementId": this.id,
          "productCode": item.code,
          "productDiscountId": this.checkDiscount_item.id
        },
        true
      ).then(res => {
        this.warn('剔除成功！');
        this.purchasingAgentProduct_scbProductToProductDiscount();// 刷新全部商品
        this.purchasingAgentProduct_productDiscountProductList();// 已添加折扣商品
      });
    },
    /**
     * 添加SCB商品到商品折扣下（全部商品）
     */
    purchasingAgentProduct_scbProductToProductDiscount() {
      const that = this;

      this.request(
        this.api.scb.purchasingAgentProduct_scbProductToProductDiscount,
        this.filtersData,
        true
      ).then(res => {
        that.goodsList = res;
      });
    },
    /**
     * 已添加折扣商品
     */
    purchasingAgentProduct_productDiscountProductList(item) {
      const that = this;

      this.request(
        this.api.scb.purchasingAgentProduct_productDiscountProductList,
        {
          "productDiscountId": this.checkDiscount_item.id
        },
        true
      ).then(res => {
        this.goodsData = res;
        res.data.forEach(item => {
          item._cateNames = item.cateNames.join('、');
        });
      });
    },
    /**
     * 添加SPU商品到此折扣下
     */
    purchasingAgentDiscount_addSPUToDiscount(item) {
      const that = this;

      this.request(
        this.api.scb.purchasingAgentDiscount_addSPUToDiscount,
        {
          "priceManagementId": this.id,
          "productCode": item.code,
          "productDiscountId": this.checkDiscount_item.id
        },
        true
      ).then(res => {
        this.warn('添加成功！');
        this.purchasingAgentProduct_scbProductToProductDiscount();// 刷新全部商品
        this.purchasingAgentProduct_productDiscountProductList();// 已添加折扣商品
      });
    },
    /**
     * 获取商户详情
     */
    purchasingAgentPriceManagement_getById(item) {
      const that = this;

      this.request(
        this.api.scb.purchasingAgentPriceManagement_getById,
        {
          id:this.$route.query.id
        },
        true
      ).then(res => {
        that.purchasingAgentPriceManagement_getById_data = res;
      });
    },
    /**
     * 修改折扣
     * @param { String } value 修改的折扣值
     */
    purchasingAgentPriceManagement_updateValid(value) {
      const that = this;

      this.request(
        this.api.scb.purchasingAgentPriceManagement_updateValid,
        {
          id:this.id,
          "purchaserDiscountType": this.purchasingAgentPriceManagement_getById_data.purchaserDiscountType,
          "purchaserDiscountValue": value
        },
        true
      ).then(res => {
        that.purchasingAgentPriceManagement_getById_data = res;
        // 修改完折扣重新刷新列表
        this.purchasingAgentPriceManagement_getById();
      });
    },
    /**
     * （新建折扣）-- 插入或更新指定商品折扣的折扣值
     */
    purchasingAgentDiscount_save() {
      const that = this;
      const data = this.purchasingAgentPriceManagement_getById_data;
      this.$prompt('', '新建折扣', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /(^[1-9](\.\d)?$)|(^[0]\.\d$)/,
        inputErrorMessage: "请输入正确折扣数值！",
        inputPlaceholder:'请输入采购折扣，如5.5折。'
      }).then(({ value }) => {
       this.request(
        this.api.scb.purchasingAgentDiscount_save,
          {
            "priceManagementId": data.id,
            "productDiscountType": 1,
            "productDiscountValue": value,
            "purchaseAgentId": data.purchaseAgentId,
            "purchaseAgentName": data.purchaseAgentName
        },
        true
      ).then(res => {
        this.warn('新建折扣成功！');
        this.purchasingAgentDiscount_list();
      });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });       
      });
    },
    /**
     *  获取折扣列表
     */
    purchasingAgentDiscount_list() {
      const that = this;
      Object.assign(this.filtersData, {
          "priceManagementId": this.id
      });
      this.request(
        this.api.scb.purchasingAgentDiscount_list,
        this.filtersData,
        true
      ).then(res => {
        that.purchasingAgentDiscount_save_data = res;
      });
    },
    /**
     * 修改某条折扣
     */
    checkDiscount(row) {
      this.href('/price/discount_details',{
        id:this.$route.query.id,
        discountId:row.id
      });
    },
    /**
     * （获取季节）
     */
    codeItem_list(item) {
      const that = this;

      this.request(
        this.api.market.codeItem_list,
        {
          codeSetId:'06b11574-ef82-4ae4-a8a9-a25f903083df'
        },
        true
      ).then(res => {
        that.codeItem_list_get = res;
      });
    },
    /**
     * 
     */
    cascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      this.goodsFiltersData.cateIdentifier = obj.identifier;
    },
    /**
     * 提示
     * @param { String } message 提示文案
     * @param { String } type 提示类型
     */
    warn(message, type) {
      this.$message({
        message: message,
        type: type || "success"
      });
    },
    open(inputValue) {
      this.$prompt('', '修改采购折扣', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /(^[1-9](\.\d)?$)|(^[0]\.\d$)/,
        inputValue:inputValue,
        inputErrorMessage: "请输入正确折扣数值！",
        inputPlaceholder:'请输入采购折扣，如5.5折。'
      }).then(({ value }) => {
       this.purchasingAgentPriceManagement_updateValid(value);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });       
      });
    },
    /**
     * 编辑
     * @param { Object } item 当前对象
     * @param { Boolean } isRead 是否可对写
     * @property { Boolean }isEcho 是否是编辑
     * @return { Object } Obj 返回对象
     */
    timeRedact(item) {
      var Obj = {};
      this.href("discount_order_edit", {
        isEdit: true,
        discountId: item.discountId,
        type: item.type
      });
    },
    /**
     * 获取折扣列表
     */
    marketingMiddleground_discountList() {
      this.request(
        this.api.market.marketingMiddleground_discountList,
        this.filtersData
      ).then(res => {
        this.discountData = res;
      });
    },
    /**
     * 路由跳转
     * @param { String } routeName 路由路径
     * @param { Object } param 路由参数
     */
    href(routeName, param) {
      let module = '/' + this.$route.path.split('/')[1];
      this.$router.push({
        path: module + routeName,
        query: param
      });
    },
    /**
     * 模糊搜索
     */
    handleSearch() {
      this.filtersData.pageIndex = 1;
      this.filtersData.storeName = this.filtersData.storeName.replace(
        /(^\s)|(\s$)/g,
        ""
      );
      this.marketingMiddleground_discountList();
    },
    /**
     * 搜索重置
     */
    handleResetFilters() {
      Object.assign(this.filtersData, {
        pageIndex: 1, // 当前页码
        pageSize: 10, // 每页数量
        type: "", // 门店类型
        storeName: "" // 门店名称
      });
    },
    /**
     * 点击页数
     * @param { Number } pageIndex 当前页
     */
    handleCurrentChange(pageIndex) {
      this.filtersData.pageIndex = pageIndex;
      this.marketingMiddleground_discountList();
    },
    /**
     *  选择每页多少条数
     *  @param { Number } pageSize 每页条数
     */
    handleSizeChange(pageSize) {
      this.filtersData.pageSize = pageSize;
      this.marketingMiddleground_discountList();
    }
  },
  components: {
    codeSet,
    treeDept,
    PageTable
  }
};
</script>
<style  lang="less" scoped>
h4{
  border-bottom: 1px solid #ccc;
  height: 40px;
}

.table /deep/ .el-input__inner{
  width: 150px;
}
.el-select{
  display: block;
}
.previewVisible-list {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 50%;
    margin-right: 0;
    text-align: right;
  }
}
.blueness {
  color: #1e90ff;
}
h5 {
  color: #222;
  margin-left: -15px;
}
.test {
  color: #9d9d9d;
}
.box {
  padding: 20px 50px 20px 50px;
  margin: 8px 8px 20px 8px;
  background: #fff;
}
  .el-input-short{
    width: 300px;
  }
  .el-input-mini{
    width: 90px;
  }
  .mlr10px{
    margin: 0 10px;
  }
  .addRadder{
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    width: 400px;
    padding: 15px;
  }
  .mb-10{
    margin-bottom: 10px;
  }
  .mb-100{
    margin-bottom: 100px;
  }
  .ml-10{
    margin-left: 10px;
  }
  .mt-74{
    margin-top: 74px;
  }
  .el-input-width155{
    width:300px;
  }
  .el-input-width355{
    width: 355px;
  }
  .el-input__inners{
    width: 300px;
  }
  .el-dialog__wrapper /deep/ .el-dialog{
    width: 80%;
  }
  .discountImg{
    width: 40px;
    height: 40px;
  }
</style>
