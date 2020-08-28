<!--
 * @Description: 库存列表
 * @Author: your name
 * @Date: 2019-08-20 08:58:21
 * @LastEditTime: 2019-12-18 19:48:49
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <div class="item-margin">
      <el-form
        class="item-form"
        :model="filtersData"
        label-width="90px"
        size="small"
        ref="filtersForm"
        inline
      >
        <el-form-item prop="cateIdentifier" label="对应分类：">
          <el-cascader
            class="input-w"
            :options="classData"
            v-model="cateArr"
            @change="cascaderGet"
            :show-all-levels="false"
            :props="props"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="brandId" label="品牌：">
          <el-select placeholder="请选择" class="input-w" v-model="filtersData.brandId">
            <el-option v-for="item in brandArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="quantity" label="所属仓库：">
          <el-select placeholder="请选择" class="input-w" v-model="filtersData.warehouseCode">
            <el-option
              v-for="item in warehouseArr"
              :key="item.id"
              :label="item.warehouseName"
              :value="item.warehouseCode"
            ></el-option>
          </el-select>
        </el-form-item>
         
        <el-form-item prop="ownerId" label="货主：">
          <el-select
            class="input-w"
            placeholder="请选择"
            v-model="filtersData.ownerId"
          >
            <el-option
              v-for="(item,index) in ownerOptions"
              :key="index.id"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存筛选：">
          <el-select placeholder="请选择" class="input-w" v-model="filtersData.quantityType">
            <el-option
              v-for="item in quantityTypeArr"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select placeholder="请选择" class="input-w" v-model="filtersData.logicType">
            <el-option
              v-for="item in logicTypeArr"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input class="input-w" placeholder="具体数量" v-model="filtersData.quantity"></el-input>
        </el-form-item>

        <el-form-item prop="searchWords" label="综合搜索：">
          <el-input class="input-w" placeholder="商品款号/商品货号/商品名称" v-model="filtersData.searchWords"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="small" v-no-more-click @click="handleSearch" type="primary" plain>搜索</el-button>
          <el-button size="small" @click="handleResetFilters('filtersForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--table  -->
    <div class="item-margin">
      <div class="item-table">
        <el-table
          :data="tableListData"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true"
        >
          <el-table-column prop="code" align="center" width="50">
            <template slot-scope="scope">
              <i
                @click="childrenIsShow(scope.row)"
                v-if="scope.row.isShow"
                :class="scope.row.isType == 1 ?'el-icon-circle-plus-outline i-cursor' : 'el-icon-remove-outline i-cursor'"
              ></i>
            </template>
          </el-table-column>
          <el-table-column prop="spu" align="center" label="商品款号" width="100"></el-table-column>
          <el-table-column prop="sku" align="center" label="商品货号" width="100"></el-table-column>
          <el-table-column prop="specifications" align="center" label="规格" width="80"></el-table-column>
          <el-table-column prop="image" align="center" label="图片" width="80">
            <template slot-scope="scope">
              <img class="logo-wh" :src="scope.row.image" />
            </template>
          </el-table-column>
          <el-table-column prop="brandName" align="center" label="品牌" min-width="100"></el-table-column>
          <el-table-column prop="fullCateName" align="center" label="商品分类" width="80"></el-table-column>
          <el-table-column prop="name" align="center" label="商品名称" width="100"></el-table-column>
          <el-table-column prop="retailPrice" align="center" label="吊牌价/元" min-width="100"></el-table-column>
          <el-table-column prop="quantity" align="center" label="库存总量" min-width="100"></el-table-column>
          <el-table-column prop="frozenQuantity" align="center" label="冻结库存" min-width="100"></el-table-column>
          <el-table-column prop="availableQuantity" align="center" label="可用库存" min-width="100"></el-table-column>
          <el-table-column prop="warehouseName" align="center" label="所属仓库" min-width="100"></el-table-column>
        </el-table>
        <div class="stock-flex pagination mt-10 mb-20">
          <p>货主：{{statistics.ownerCount}}家&nbsp; 总量库存：{{statistics.stockTotal}}件&nbsp;其中款号数{{statistics.spuCount}}种&nbsp; 货号数{{statistics.skuCount}}个</p>
          <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersData.pageIndex"
            :page-sizes="[10, 20, 30,40,50]"
            :page-size="filtersData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!--table END  -->
  </div>
</template>
<script>
/**
 * 基本管理
 */
export default {
  name:"stock_list",
  data() {
    return {
      filtersData: {
        cateIdentifier: null, //产品分类标识码
        brandId: null,
        ownerId:'',
        warehouseCode: null,
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        valid: null, //有效状态
        keyword: "", //搜索关键字
        quantityType: null,
        logicType: null,
        quantity: null
      },
      cateArr: [],
      brandArr: [],
      warehouseArr: [],
      logicTypeArr: [
        {
          id: 0,
          value: "小于"
        },
        {
          id: 1,
          value: "等于"
        },
        {
          id: 2,
          value: "大于"
        },
        {
          id: 3,
          value: "小于等于"
        },
        {
          id: 4,
          value: "大于等于"
        }
      ],
      quantityTypeArr: [
        {
          id: 0,
          value: "可用数量"
        },
        {
          id: 1,
          value: "冻结数量"
        },
        {
          id: 2,
          value: "总数量"
        }
      ],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      tableListData: [],
      statistics: {},
      total: null,
      classData: [],
      classList: [],
       ownerOptions: [],//货主
    };
  },
  created() {
    this.getTableList();
    this.getWarehouseList();
    this.getBrandList();
    this.getClassData();
       //获取货主
    this.getOwnerOptions();
  },
    activated () {
    this.getTableList();
  },
  methods: {
    getClassData() {
      this.$common.getClassSelect(this, 1).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
    },
    getWarehouseList() {
      this.request(this.api.warehouse.warehouseBase_warehouse_list, {isValid: true}).then(data => {
        this.warehouseArr = data.data;
      });
    },
    getBrandList() {
      this.request(this.api.product.productBrand_list, {}).then(data => {
        this.brandArr = data.data;
      });
    },
    //获取货主
    getOwnerOptions(){
       this.request(this.api.warehouse.warehouseBase_goodsOwner_list, {valid: true,orderBy:'create_time'},true).then(
        res => {
          this.ownerOptions = res.data;
        }
      );
    },
    //获取设计商
    cascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      this.filtersData.cateIdentifier = obj.identifier;
    },
    getTableList() {
      this.request(this.api.product.listProductStock, this.filtersData).then(
        res => {
          let _data = res.stock.data,
            _dataLen = _data.length;
          for (let i = 0; i < _dataLen; i++) {
            _data[i].isShow = true;
            _data[i].isType = 1;
            _data[i]._cid = "";
          }
          this.statistics = res;
          this.tableListData = _data;
          this.total = res.stock.totalCount;
        }
      );
    },
    //搜索
    handleSearch() {
      this.filtersData.pageIndex = 1;
      this.getTableList();
    },
    //清空重置
    handleResetFilters(formName) {
      this.$refs[formName].resetFields();
      this.filtersData.quantityType = null;
      this.cateArr = [];
      this.filtersData.warehouseCode = null;
      this.filtersData.brandId = null;
      this.filtersData.logicType = null;
      // this.getTableList();
    },
    //当前页数修改时发生改变
    handleCurrentChange(val) {
      this.filtersData.pageIndex = val;
      this.getTableList();
    },
    // 每页显示多少条时发生改变
    handleSizeChange(val) {
      this.filtersData.pageSize = val;
      this.getTableList();
    },
    //点击获取子元素插入数组
    childrenIsShow(row) {
      let listData = this.tableListData;
      let _path = this.api.product.listProductGoodsStock;
      let _this = this;
      let _key = "productId";
      let _obj = {
        warehouseCode: this.filtersData.warehouseCode
      };
      this.$common.clickGetChildren(_this, row, listData, _path, _key, _obj);
    }
  }
};
</script>
<style lang="less" scoped>
.stock-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
