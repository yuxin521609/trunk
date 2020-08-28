<template>
  <div class="box">
    <!-- 基本信息 -->
    <h4>基本信息</h4>
    <el-form class="mt-20" :label-position="labelPosition" label-width="90px" :model="formLabelAlign">
      <el-form-item label="商品款号：">
        <el-input v-model="productCode" disabled></el-input>
      </el-form-item>
      <el-form-item label="所属分类：" prop="name">
        <el-cascader ref="cascader" v-model="cateIds" :options="categories_getPullDownCategoriesList_data" :props="{ checkStrictly: true, label: 'name', value: 'id', emitPath: false, multiple: true}" clearable></el-cascader>
      </el-form-item>
    </el-form>
    <!-- 吊牌信息 -->
    <h4>吊牌信息</h4>
    <el-form class="mt-20 previewVisible-list"  label-width="90px" :model="formLabelAlign">
      <el-form-item v-for="(item, index) in merchantProduct_productDetail_data.attributes" :key="index" :label="`${item.name}：`" class="mr-20">
        <el-input v-model="item.value" disabled></el-input>
      </el-form-item>
    </el-form>
    <!-- 货号信息 -->
    <h4>货号信息</h4>
    <div class="item-table">
      <el-table
        class="mt-20 table"
        :data="merchantProduct_productDetail_data.merchantProductSKUPCDetailDTOS"
        stripe
        empty-text="暂无数据"
        header-align="center"
        header-row-class-name="item-table-header"
        :highlight-current-row="true">
        <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品货号" min-width="100">
          <template  slot-scope="scope">{{ scope.row.goodsCode || '--' }}</template>
        </el-table-column>
        <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品规格" min-width="100">
          <template  slot-scope="scope">{{ scope.row.color + '/' + scope.row.size || '--' }}</template>
        </el-table-column>
        <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="图片" min-width="100">
          <template  slot-scope="scope"><img class="discountImg" :src="scope.row.image" alt=""></template>
        </el-table-column>
        <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="吊牌价" min-width="100">
          <template  slot-scope="scope">{{ scope.row.price || '--' }}</template>
        </el-table-column>
        <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品折扣" min-width="100">
          <template  slot-scope="scope">
            <el-input v-model="scope.row.productDiscountValue" placeholder="请填写商品折扣"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label-class-name="text-center"
          class-name="text-center"
          align="center"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="merchantProduct_onSaleOrOffSaleSKU(scope.row)">{{ scope.row.onSaleStatus == 'ONSALE' ? '下架' : '上架' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button type="primary" @click="merchantProduct_saveProductDetail" class="mt-30">保存</el-button>
  </div>
</template>
<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
import codeSet from "@/components/codeSet";
import treeDept from "@/components/treeDept";
import { filter } from "minimatch";
import { get } from "http";

let token = getToken();

export default {
  data() {
    return {
      categories_getPullDownCategoriesList_data:[],// 获取分类所用-分类下拉（一二级）
      labelPosition: 'right',
      selectArr:[1, 2, 3],
      goodsData:[],
      formLabelAlign: {
        name: '53424400GM',
        productCode:''
      },
      cateIds:[],
      merchantId:this.$route.query.merchantId,
      productCode:this.$route.query.productCode,
      merchantProduct_productDetail_data:{},// 商品详情info
    }
  },
  created() {
    const that = this;
    this.merchantProduct_productDetail();
    this.categories_getPullDownCategoriesList();// 获取分类所用-分类下拉（一二级）
  },
  methods: {
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
     * 获取商品详情
     */
    merchantProduct_productDetail() {
      const that = this;

      this.request(
        this.api.scb.merchantProduct_productDetail,
        {
          "merchantId": this.merchantId,
          "productCode": this.productCode
        },
        true
      ).then(res => {
        this.merchantProduct_productDetail_data = res;
        this.cateIds = res.cateIds;
      });
    },
    /**
     * 获取商品详情 SKU上下架
     */
    merchantProduct_onSaleOrOffSaleSKU(obj) {
      const that = this;
      const text = obj.onSaleStatus == 'ONSALE' ? '下架后客户无法下单，是否继续？' : '确定上架吗？';
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request(
          this.api.scb.merchantProduct_onSaleOrOffSaleSKU,
          {
            "goodsCode": obj.goodsCode,
            "merchantId": this.merchantId,
            "productCode": this.productCode
          },
          true
        ).then(res => {
          this.merchantProduct_productDetail();// 重新刷新列表
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
     * 获取商品修改
     */
    merchantProduct_saveProductDetail(obj) {
      const that = this;
      const data = {
        "cateIds": this.cateIds,
        "merchantId": "",
        "merchantProductGoodsVOS": [],
        "productCode": this.productCode
      };
      const arr = this.merchantProduct_productDetail_data.merchantProductSKUPCDetailDTOS;
      if(arr && arr.length > 0) {
        arr.forEach(item => {
          if(!item.productDiscountValue) return;
          data.merchantProductGoodsVOS.push({
            "goodsCode": null,
            "id": item.id,
            "onSaleStatus": null,
            "onSaleTime": null,
            "productCodeId": null,
            "productDiscountType": 1,
            "productDiscountValue": parseFloat(item.productDiscountValue)
          })
        });
        var checkItem = arr.every((item, index) => {
          return /(^[1-9](\.\d)?$)|(^[0]\.\d$)/.test(parseFloat(item.productDiscountValue)) || !item.productDiscountValue;
        });
        if(!checkItem) {
          this.warn('请输入正确的折扣数值！','warning');
          return;
        }
      };                                   
      this.request(
        this.api.scb.merchantProduct_saveProductDetail,
        data,
        true
      ).then(res => {
        this.href('/goods/goods_list');
        this.warn('保存成功！');
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
        type: type || "success"
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
    treeDept
  }
};
</script>
<style  lang="less" scoped>
.discountImg{
  width:40px;
  height: 40px;
}
h4{
  border-bottom: 1px solid #ccc;
  height: 40px;
}
.el-form-item{
  width:350px;
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
</style>
