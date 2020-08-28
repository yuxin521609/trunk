<template>
   <div>
     <el-dialog  title="选择分类" @closed="closeDialogClass" width="420px" :visible.sync="dialogForm">
      <el-form :model="ruleForm"  label-width="120px">
        <el-form-item label="所属分类：">
          <el-cascader :disabled="isEdit" ref="cascader" v-model="ruleForm.cateIdArr" :options="categories_getPullDownCategoriesList_data" :props="{ checkStrictly: true, label: 'name', value: 'id', emitPath: false, multiple:true}" clearable></el-cascader>
        </el-form-item>
        <div class="addClass">
          <el-button type="primary" class="ml-20 mt-24" v-noMoreClick  @click="saveAddClass">确定添加</el-button>
        </div>
      </el-form>
    </el-dialog>
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
              <el-input placeholder="请输入售价最小值" clearable  v-model.number="goodsFiltersData.retailPriceLowerLimit" class="el-input-width155"></el-input>
              <el-input placeholder="请输入售价最大值" clearable  v-model.number="goodsFiltersData.retailPriceUpperLimit" class="el-input-width155 ml-10"></el-input>
            </el-form-item>
            <el-form-item label="季节：">
              <el-select v-model="goodsFiltersData.seasonalStyleCode" clearable placeholder="请选择">
                <el-option v-for="(item, index) in codeItem_list_get.data" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
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
            <el-button size="small" type="primary" v-noMoreClick class="ml-20 mt-24" @click="addProductClassAll">批量加入到指定分类</el-button>
            <el-button size="small" type="primary" plain class="ml-20 mt-24" :disabled="isAllAddProduct" @click="marketingMiddleground_addPageSingleProduct">批量添加</el-button>
            <el-table
              class="mt-20"
              :data="goodsList.data"  
              stripe
              empty-text="暂无数据"
              header-align="center"
              @selection-change="productCheckChange"
              header-row-class-name="item-table-header"
              :highlight-current-row="true">
              <el-table-column disabled="disabled" :selectable="checkboxT" type="selection" width="45"></el-table-column>
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
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品图片" min-width="100">
                <template  slot-scope="scope"><img class="discountImg" :src="scope.row.image" alt=""></template>
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
                    <el-button type="text" v-noMoreClick v-if="scope.row.currentMerchant === 0 || scope.row.currentMerchant === null" size="small" @click="merchantProduct_addProductToMerchant(scope.row)">添加</el-button>
                    <el-button type="text" v-if="scope.row.currentMerchant === 0 || scope.row.currentMerchant === null" size="small" @click="addProductClassItem(scope.row)">添加到分类</el-button>
                    <el-button type="text" v-if="scope.row.currentMerchant === 1" size="small" @click="merchantProduct_deleteProductFromMerchant(scope.row)">从列表内剔除</el-button>
                  </template>
              </el-table-column>
            </el-table>
            <div class="pagination mt-10 mb-20">
              <!-- 分页 -->
              <el-pagination
                  class="mr-20"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="goodsFiltersData.pageIndex"
                  :page-sizes="[10,20,30,40,50]"
                  :page-size="goodsFiltersData.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="goodsList.totalCount"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-dialog>
      <!--  -->
      <div class="box">
        <el-form
          class="item-form"
          size="small"
          :inline="true"
          :model="goodsFiltersDataCheck">
          <!-- 新增1 -->
          <el-form-item label="所属分类：" prop="name">
            <el-cascader ref="cascader" v-model="goodsFiltersDataCheck.scbCateId" :options="categories_getPullDownCategoriesList_data" :props="{ checkStrictly: true, label: 'name', value: 'id', emitPath: false }" clearable></el-cascader>
          </el-form-item>
          <!-- 新增1 -->
          <el-form-item prop="cateIdentifier" clearable label="品类：">
            <el-cascader
              class="input-w"
              clearable
              :options="classData"
              v-model="cateArrs"
              :value="cateArrs"
              @change="cascaderGets"
              :show-all-levels="false"
              :props="props"
              change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="售价：">
            <el-input placeholder="请输入售价最小值" clearable  v-model="goodsFiltersDataCheck.retailPriceLowerLimit" class="el-input-width155"></el-input>
            <el-input placeholder="请输入售价最大值" clearable  v-model="goodsFiltersDataCheck.retailPriceUpperLimit" class="el-input-width155 ml-10"></el-input>
          </el-form-item>
          <el-form-item label="品牌：">
            <el-select class="input-w" filterable clearable placeholder="请选择" v-model="goodsFiltersDataCheck.brandId">
              <el-option
                v-for="item in brandOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上下架：">
            <el-select v-model="goodsFiltersDataCheck.onSaleStatus" clearable placeholder="请选择">
              <el-option v-for="(item, index) in onSaleStatusList" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存：">
            <el-input placeholder="请输入库存最小值" clearable  v-model="goodsFiltersDataCheck.quantityLowerLimit" class="el-input-width155"></el-input>
            <el-input placeholder="请输入库存最大值" clearable  v-model="goodsFiltersDataCheck.quantityUpperLimit" class="el-input-width155 ml-10"></el-input>
          </el-form-item>
          <el-form-item label="关键词：">
            <el-input placeholder="请输入关键词，如：货号、款号、商品名称" clearable  v-model="goodsFiltersDataCheck.searchWords" class="el-input-width355"></el-input>
          </el-form-item>
          <el-form-item label="季节：">
            <el-select v-model="goodsFiltersDataCheck.seasonalStyleCode" clearable placeholder="请选择">
              <el-option v-for="(item, index) in codeItem_list_get.data" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <!-- 搜索，重置 -->
          <el-form-item>
            <el-button size="small" @click="handleSearchCheck" type="primary" plain>搜索</el-button>
            <el-button size="small" @click="handleResetFiltersCheck">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="box">
        <div class="item-table">
          <el-button size="small" type="primary" class="ml-20 mt-24" @click="dialogTableVisible = true">从商品中心导入商品</el-button>
          <el-button size="small" type="primary" plain class="ml-20 mt-24" v-noMoreClick @click="addScbClassAll">批量添加到分类</el-button>
          <el-button size="small" type="primary" plain class="ml-20 mt-24" v-noMoreClick @click="addScbTransferClassAll">批量转移到分类</el-button>
          <el-button size="small" type="primary" plain class="ml-20 mt-24" v-noMoreClick @click="merchantProduct_batchOnSaleOrOffSaleSPU(0)">批量上架</el-button>
          <el-button size="small" type="primary" plain class="ml-20 mt-24" v-noMoreClick @click="merchantProduct_batchOnSaleOrOffSaleSPU(1)">批量下架</el-button>
          <el-button size="small" type="primary" plain class="ml-20 mt-24" v-noMoreClick @click="merchantProduct_deleteBatchProductFromMerchant">批量剔除</el-button>
          <el-table
            class="mt-20"
            :data="merchantProduct_scbServiceList_data.data"
            stripe
            empty-text="暂无数据"
            header-align="center"
            @selection-change="scbCheckChange" 
            header-row-class-name="item-table-header"
            :highlight-current-row="true">
            <el-table-column disabled="disabled" type="selection" width="45"></el-table-column>
            <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品款号" min-width="100">
              <template  slot-scope="scope">{{ scope.row.code|| '--' }}</template>
            </el-table-column>
            <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="所属分类" min-width="100">
              <template  slot-scope="scope">{{ scope.row._productCateNameList|| '--' }}</template>
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
            <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品图片" min-width="100">
              <template  slot-scope="scope"><img class="discountImg" :src="scope.row.image" alt=""></template>
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
                  <el-button type="text" size="small" @click="hrefDetails(scope.row)">修改</el-button>
                  <el-button type="text" size="small" @click="merchantProduct_onSaleOrOffSaleSPU(scope.row)">{{ scope.row.onSaleStatus == 'ONSALE' ? '下架' : '上架' }}</el-button>
                  <el-button type="text" size="small" @click="merchantProduct_deleteProductFromMerchant(scope.row)">剔除</el-button>
                </template>
            </el-table-column>
          </el-table>
          <div class="pagination mt-20 mb-20">
            <!-- 分页 -->
            <el-pagination
                class="mr-20"
                @size-change="handleSizeChangeCheck"
                @current-change="handleCurrentChangeCheck"
                :current-page="goodsFiltersDataCheck.pageIndex"
                :page-sizes="[10,20,30,40,50]"
                :page-size="goodsFiltersDataCheck.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="merchantProduct_scbServiceList_data.totalCount"
            ></el-pagination>
          </div>
        </div>
      </div>
   </div>
</template>

<script>

export default {
  name:'goods_list',
  data() {
    return {
      // table选择商品
      checkedTableData_product:[],
      type:null,
      // table选择商品
      checkedTableData_scb:[],
      isAllAddProduct:false,
      ruleForm:{
        cateIdArr:[]
      },
      categories_categoriesTreeList_data:[],
      addProductClassItemData:{},
      dialogForm:false,
      onSaleStatusList:{
        'ONSALE':'上架',
        'OFFSALE':'下架'
      },
      categories_getPullDownCategoriesList_data:[],// 创建分类所用-分类下拉（一二级）
      // 季节列表
      codeItem_list_get:[],
      // 快速创建保留门店id
      fastCreateStoreId:null,
      // 快速创建剔除已有门店
      fastCreateTF:true,
      // 是否编辑
      isEdit:this.$route.query.isEdit,
      // 是否快速创建
      isFastCreate:this.$route.query.isFastCreate,
      // 单品商品信息是否存在
      isGoods:false,
      // 折扣id
      discountId:this.$route.query.discountId,
      // 弹框
      dialogTableVisible:false,
      // 全部商品
      goodsList:{},
      // 已添加
      goodsCheckList:{},
      // 检索全部商品
      goodsFiltersData:{
        // 当前页码
        pageIndex: 1,
        // 每页数量
        pageSize: 10,
        // 品类id
        cateIdentifier:null,
        // 品牌id
        brandId:null,
        // 售价最小值
        retailPriceLowerLimit:null, 
        // 售价最大值
        retailPriceUpperLimit:null, 
        // 库存最小值
        quantityLowerLimit:null, 
        // 库存最大值
        quantityUpperLimit:null, 
        // 季节
        seasonalStyleCode:null,
        // 关键词
        searchWords:null 
      },
      // 全部品牌
      brandOptions:[],
      // 检索已选商品
      goodsFiltersDataCheck:{
        // 当前页码
        pageIndex: 1,
        // 每页数量
        pageSize: 10,
        // 分类id
        scbCateId:null,
        // 品类id
        cateIdentifier:null,
        // 售价最小值
        retailPriceLowerLimit:null, 
        // 售价最大值
        retailPriceUpperLimit:null, 
        // 品牌id
        brandId:null,
        // 上下架状态
        onSaleStatus:null,
        // 库存最小值
        quantityLowerLimit:null, 
        // 库存最大值
        quantityUpperLimit:null, 
        // 季节
        seasonalStyleCode:null,
        // 关键词 
        searchWords:null 
      },
      // 单品折扣列表
      itemDiscountData:{
        data:[]
      },
      // 门店列表
      storeList:{},
      classData: [],
      classList: [],
      cateArr: [],
      cateArrs: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      // 检索
      filtersData: {
        pageIndex: 1, // 当前页码
        pageSize: 10, // 每页数量
        "orderBy": "",
      },
      // 商品列表
      merchantProduct_scbServiceList_data:{}
    };
  },
  created() {
    var that = this;
    this.getClassData(); // 获取商品
    this.codeItem_list(); // 获取季节列表
    this.getStoreList(); // 获取门店列表
    this.getBrandOptions(); // 获取品牌
    this.merchantProduct_scbServiceList();// 获取商品列表
    if(this.$route.query.id) {
      Object.assign(this.goodsFiltersDataCheck, {
        scbCateId:this.$route.query.id
      })
    };
    document.onkeydown = function(e) {
         var key = window.event.keyCode;
         if (key == 13) {
            if(that.dialogTableVisible) {
              that.handleSearch();
            }else{
              that.handleSearchCheck();
            }
         }
      };
  },
  activated() {
    this.merchantProduct_scbServiceList();
  },
  mounted() {
    this.$nextTick(()=>{
      this.marketingMiddleground_listProduct();// 查询全部商品
      this.categories_getPullDownCategoriesList();// 获取分类所用-分类下拉（一二级）
    })
  },
  methods: {
    /**
     * 关闭分类弹框
     */
    closeDialogClass() {
      this.ruleForm.cateIdArr = [];
    },
    /**
     * 关闭弹框
     */
    closeDialog() {
      this.goodsFiltersData = {
        // 当前页码
        pageIndex: 1,
        // 每页数量
        pageSize: 10,
        // 品类id
        cateIdentifier:null,
        // 品牌id
        brandId:null,
        // 售价最小值
        retailPriceLowerLimit:null, 
        // 售价最大值
        retailPriceUpperLimit:null, 
        // 库存最小值
        quantityLowerLimit:null, 
        // 库存最大值
        quantityUpperLimit:null, 
        // 季节
        seasonalStyleCode:null,
        // 关键词
        searchWords:null 
      };
    },
    /**
     * 选择全部商品
     */
    scbCheckChange(val){
      this.checkedTableData_scb = val;
    },
    /**
     * 选择全部商品
     */
    productCheckChange(val){
      this.checkedTableData_product = val;
    },
    //复选框
    checkboxT(row,index){
      if(row.currentMerchant === 0 || row.currentMerchant === null){
        return 1;
      }else{
        return 0;
      }
    },
    /**
     * 批量上下架
     */
    merchantProduct_batchOnSaleOrOffSaleSPU(type) {
      var data = {
        "merchantId": "",
        "operationTag": type,
        "productCodeList": []
      };
      if(this.checkedTableData_scb.length == 0) {
        this.warn('请选择商品！','warning');
        return;
      }
      let text = type ? '确定批量下架吗？' : '确定批量上架吗？';

      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        
        this.checkedTableData_scb.forEach((item, index) => {
          data.productCodeList.push(item.code);
        });
        this.request(
          this.api.scb.merchantProduct_batchOnSaleOrOffSaleSPU,
          data,
          true
        ).then(res => {
          let tit = type ? '批量下架成功！' : '批量上架成功！';
          this.warn(tit);
          this.merchantProduct_scbServiceList();
          this.marketingMiddleground_listProduct();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    /**
     * 批量剔除
     */
    merchantProduct_deleteBatchProductFromMerchant() {
      var data = {
        "merchantId": "",
        "productCodeList": []
      };
      if(this.checkedTableData_scb.length == 0) {
        this.warn('请选择商品！','warning');
        return;
      }
      this.$confirm('确定批量剔除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkedTableData_scb.forEach((item, index) => { 
          data.productCodeList.push(item.code);
        });
        this.request(
          this.api.scb.merchantProduct_deleteBatchProductFromMerchant,
          data,
          true
        ).then(res => {
          this.warn('添加剔除成功！');
          this.merchantProduct_scbServiceList();
          this.marketingMiddleground_listProduct();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
      
      
    },
    /**
     * 确定添加分类
     */
    saveAddClass() {
      var data = {};
      var url = this.api.scb.merchantProduct_addPageProductToMerchantCategories;
      if(this.ruleForm.cateIdArr.length == 0) {
        this.warn('请选择分类！','warning');
        return;
      };
      // 批量添加到分类
      if(JSON.stringify(this.addProductClassItemData) === '{}') {
        data = {
          "merchantId": "",
          "cateId": this.ruleForm.cateIdArr,
          "productCodeList": []
        };
        switch(this.type) {
          // 添加全部商品到分类下
          case 'product':
            this.checkedTableData_product.forEach((item, index) => {
              if(item.currentMerchant === 0 || item.currentMerchant === null) {
                data.productCodeList.push(item.code);
              }
            });
          break;
          // 添加全部商品到分类下
          case 'scb':
            this.checkedTableData_scb.forEach((item, index) => {
              if(item.currentMerchant === 0 || item.currentMerchant === null) {
                data.productCodeList.push(item.code);
              }
            });
          break;
          // 添加全部商品到分类下
          case 'scbTransfer':
            this.checkedTableData_scb.forEach((item, index) => {
              if(item.currentMerchant === 0 || item.currentMerchant === null) {
                data.productCodeList.push(item.code);
              }
            });
            url = this.api.scb.merchantProduct_transferPageProductToMerchantCategories;
          break;
        }
      // 单个添加到分类
      }else{
        data = {
          "merchantId": this.addProductClassItemData.id,
          "cateId": this.ruleForm.cateIdArr,
          "productCodeList": [this.addProductClassItemData.code]
        };
      }
      this.request(
        url,
        data,
        true
      ).then(res => {
        this.warn('添加分类成功！');
        this.addProductClassItemData = {};
        this.merchantProduct_scbServiceList();
        this.marketingMiddleground_listProduct();
        this.ruleForm.cateIdArr = [];
        this.dialogForm = false;
      });
    },
    /**
     * 添加到分类-Product（全部）
     */
    addProductClassAll() {
      if(this.checkedTableData_product.length == 0) {
        this.warn('请选择要添加的商品！','warning');
        return;
      }
      this.addProductClassItemData =  {};
      this.dialogForm = true;
      this.type = 'product';
    },
    /**
     * 添加到分类-scb
     */
    addScbClassAll() {
      if(this.checkedTableData_scb.length == 0) {
        this.warn('请选择要添加的商品！','warning');
        return;
      }
      this.dialogForm = true;
      this.type = 'scb';
    },
    /**
     * 转移到分类-scb
     */
    addScbTransferClassAll() {
      if(this.checkedTableData_scb.length == 0) {
        this.warn('请选择要添加的商品！','warning');
        return;
      }
      this.dialogForm = true;
      this.type = 'scbTransfer';
    },
    /**
     * 添加到分类-Product（单个）
     */
    addProductClassItem(row) {
      this.addProductClassItemData =  row;
      this.dialogForm = true;
    },
    /**
     * 获取分类所用-分类下拉（一二级）
     */
    categories_getPullDownCategoriesList() {
      const that = this;

      this.request(
        this.api.scb.categories_getPullDownCategoriesList,
        {
          "merchantId": ""
        },
        true
      ).then(res => {
        that.categories_getPullDownCategoriesList_data = res;
      });
    },
    /**
     * 修改（跳转到商品详情）
     */
    hrefDetails(obj) {
      this.href('scb/goods/goods_details', {
        "merchantId": obj.id,
        "productCode": obj.code
      });
    },
    /**
     * （获取商品列表）
     */
    merchantProduct_scbServiceList() {
      const that = this;
      
      this.request(
        this.api.scb.merchantProduct_scbServiceList,
        this.goodsFiltersDataCheck,
        true
      ).then(res => {
        this.merchantProduct_scbServiceList_data = res;
        res.data.forEach((item, index) => {
          // item.productCateNameList = ['分类1','分类2','分类3','分类4'];
          item._productCateNameList = item.productCateNameList.join('、');  
        });
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
     * 获取品牌
     */
    getBrandOptions() {
      this.request(
        this.api.product.productBrand_list,
        {},
        true
        ).then(data => {
          let _data = data.data;
          this.brandOptions = _data;
      });
    },
    /**
     * 获取分类
     */
    getClassData() {
      //分类类型（1：标准分类，2：定制分类，3：原料分类或者称为属性分类）
      this.$common.getClassSelect(this, 1).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
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
     * 
     */
    cascaderGets(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      this.goodsFiltersDataCheck.cateIdentifier = obj.identifier;
    },
    /**
     * （单品全部添加）
     */
    marketingMiddleground_addPageSingleProduct() {
      const that = this;
      const productCodeList = [];
      let time = null;
      time = setTimeout(() => {
        this.isAllAddProduct = false;    
      }, 5000);
      if(this.checkedTableData_product.length == 0) {
        this.warn('请选择要添加的商品！','warning');
        return;
      }
      this.isAllAddProduct = true;
      this.$confirm('确定批量添加吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.warn('正在添加本页全部商品！');
        this.checkedTableData_product.forEach((item, index) => {
          productCodeList.push(item.code);
        });
        this.request(
          this.api.scb.merchantProduct_addPageProductToMerchant,
          {
            productCodeList
          },
          true
        ).then(res => {
          this.warn('本页全部商品添加成功！');
          that.marketingMiddleground_listProduct();
          this.merchantProduct_scbServiceList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });      
        this.isAllAddProduct = false;    
      });
    },
    /**
     * （添加商品）
     */
    merchantProduct_addProductToMerchant(item) {
      const that = this;
      const discountData = this.discountData;

      this.request(
        this.api.scb.merchantProduct_addProductToMerchant,
        {
          productCode:item.code
        },
        true
      ).then(res => {
        this.warn('商品添加成功！');
        that.marketingMiddleground_listProduct();
        this.merchantProduct_scbServiceList();
      });
    },
    /**
     * （上下架）
     */
    merchantProduct_onSaleOrOffSaleSPU(item) {
      const that = this;
      const text = item.onSaleStatus == 'ONSALE' ? '下架后客户无法下单，是否继续？' : '确定上架吗？';
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request(
          this.api.scb.merchantProduct_onSaleOrOffSaleSPU,
          {
            "merchantId": item.id,
            "productCode": item.code
          },
          true
        ).then(res => {
          this.merchantProduct_scbServiceList();
          this.warn('操作成功！');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    /**
     * （单品从列表内剔除）
     */
    merchantProduct_deleteProductFromMerchant(item) {
      const that = this;
      const discountData = this.discountData;
      this.$confirm('剔除后该商品在商城不可见，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request(
          this.api.scb.merchantProduct_deleteProductFromMerchant,
          {
            productCode:item.code
          },
          true
        ).then(res => {
          this.warn('剔除成功！');
          that.marketingMiddleground_listProduct();
          this.merchantProduct_scbServiceList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    /**
     * （全部商品）
     */
    marketingMiddleground_listProduct() {
      const that = this;
      // const discountData = this.discountData;

      // Object.assign(this.goodsFiltersData, {
      //   storeId:discountData.storeId,
      //   type:discountData.itemDiscountType,
      //   discount:discountData.itemDiscountEd
      // }); 
      this.request(
        this.api.scb.merchantProduct_productServiceList,
        this.goodsFiltersData,
        true
      ).then(res => {
        that.goodsList = res;
        this.isAllAddProduct = false;
      });
    },
    /**
     * 查询门店列表
     */
    getStoreList() {
        const that = this;

        this.request(
        that.api.store.storeBasic_list,
        {
          pricingPower:0
        },
        true
        ).then(res => {
          that.storeList = res;
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
    href(routeName, param) {
      this.$router.push({
        path: `/${routeName}`,
        query:param
      });
    },
    /**
     *  选择每页多少条数（全部）
     *  @param { Number } pageSize 每页条数
     */
    handleSizeChange(pageSize){
        this.isAllAddProduct = false;
        this.goodsFiltersData.pageSize = pageSize;  
        this.marketingMiddleground_listProduct();
    },
     /**
     * 点击页数（全部）
     * @param { Number } pageIndex 当前页
     */
    handleCurrentChange(pageIndex){
        this.isAllAddProduct = false;
        this.goodsFiltersData.pageIndex = pageIndex;
        this.marketingMiddleground_listProduct();
    },
   /**
     * 模糊搜索（全部）
     */
    handleSearch() {
        this.goodsFiltersData.pageIndex = 1;
        this.marketingMiddleground_listProduct();
    },
    /**
     * 搜索重置（全部）
     */
    handleResetFilters() {
      Object.assign(this.goodsFiltersData,{
        // 当前页码
        pageIndex: 1,
        // 每页数量
        pageSize: 10,
        // 品类id
        cateIdentifier:null,
        // 品牌id
        brandId:null,
        // 售价最小值
        retailPriceLowerLimit:null, 
        // 售价最大值
        retailPriceUpperLimit:null, 
        // 库存最小值
        quantityLowerLimit:null, 
        // 库存最大值
        quantityUpperLimit:null, 
        // 季节
        seasonalStyleCode:null,
        // 关键词
        searchWords:null 
      });
      this.cateArr = [];
    },

    /** ---------------
     * 点击页数（已添加）
     * @param { Number } pageIndex 当前页
     */
    handleCurrentChangeCheck(pageIndex){
      this.goodsFiltersDataCheck.pageIndex = pageIndex;
      this.merchantProduct_scbServiceList();
    },
    /**
     *  选择每页多少条数（已添加）
     *  @param { Number } pageSize 每页条数
     */
    handleSizeChangeCheck(pageSize){
      this.goodsFiltersDataCheck.pageSize = pageSize;  
      this.merchantProduct_scbServiceList();
    },
     /**
     * 模糊搜索（已添加）
     */
    handleSearchCheck() {
        this.goodsFiltersDataCheck.pageIndex = 1;
        this.merchantProduct_scbServiceList();
    },
    /**
     * 搜索重置（已添加）
     */
    handleResetFiltersCheck() {
      Object.assign(this.goodsFiltersDataCheck,{
        // 当前页码
        pageIndex: 1,
        // 每页数量
        pageSize: 10,
        // 分类id
        scbCateId:null,
        // 品类id
        cateIdentifier:null,
        // 售价最小值
        retailPriceLowerLimit:null, 
        // 售价最大值
        retailPriceUpperLimit:null, 
        // 品牌id
        brandId:null,
        // 上下架状态
        onSaleStatus:null,
        // 库存最小值
        quantityLowerLimit:null, 
        // 库存最大值
        quantityUpperLimit:null, 
        // 季节
        seasonalStyleCode:null,
        // 关键词 
        searchWords:null 
      });
      this.cateArrs = [];
    },
  },
  components: {}
};
</script>
<style  lang="less" scoped>
  .addClass{
    display: flex;
    justify-content:center;
  }
  .box{
    padding: 20px 20px 20px 20px;
    margin: 8px 8px 0 8px;
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


