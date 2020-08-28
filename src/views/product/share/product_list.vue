<!--
 * @Author: elephant
 * @Date: 2020-01-09 15:50:55
 * @LastEditTime : 2020-01-09 17:10:49
 * @LastEditors  : Please set LastEditors
 * @Description: 商品档案分享
 * @custom_string_obkoro: 看看写点什么
 -->

<template>
  <div>
    <!--table  -->
    <div class="item-margin">
      <div class="item-cont">商品档案分享查看</div>
      <div class="item-cont">共计{{count}}款</div>
      <div class="item-table">
        <el-table
          :data="tableListData"
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :row-class-name="tableRowClassName"
          :highlight-current-row="true"
        >
          <el-table-column prop="productImage" align="center" label="商品图片" min-width="120">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="hover">
                <img class="poporer-img" :src="scope.row.productImage" />
                <img slot="reference" :src="scope.row.productImage" class="table-img-wh" />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="productCode" align="center" label="商品款号" min-width="100"></el-table-column>
          <el-table-column prop="productName" align="center" label="商品名称" min-width="120"></el-table-column>
          <el-table-column prop="colorName" align="center" label="颜色" min-width="100"></el-table-column>
          <el-table-column prop="sizeName" align="center" label="规格" min-width="100"></el-table-column>
          <el-table-column prop="brandName" align="center" label="品牌" min-width="80"></el-table-column>
          <el-table-column prop="associatedCode" align="center" label="原始款号" min-width="120"></el-table-column>
          <el-table-column prop="retailPrice" align="center" label="吊牌价" min-width="100"></el-table-column>
        </el-table>
        <div class="pagination mt-10 mb-20">
          <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersData.pageIndex"
            :page-sizes="[50,100,200,300,400,500]"
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
export default {
  data() {
    let that = this;
    return {
      // total: 0,
      count: 0,
      tableListData: [],
      filtersData: {
        identifier: "",
        pageIndex: 1, //当前页码
        pageSize: 50 //每页数量
        // valid: true //有效状态
      }
    };
  },
  created() {
    this.filtersData.identifier = this.$route.query.identifier;
    //获取列表
    this.getTableList();
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.productIndex % 2 == 0) {
        return "success-row";
      } else {
        return "white-row";
      }
    },
    //获取列表
    getTableList() {
      this.request(
        this.api.product.productItemShare_list,
        this.filtersData
      ).then(data => {
        console.log(data);
        let idx = "";
        let productIndex = 0;
        data.items.data.forEach(item => {
          if (item.productCode != idx) {
            productIndex++;
            idx = item.productCode;
            item.productIndex = productIndex;
          } else {
            item.productIndex = productIndex;
          }
        });
        console.log(data);
        this.tableListData = data.items.data;
        this.count = data.count;
        this.total = data.items.totalCount;
      });
    },
    // 当前页数修改时发生改变
    handleCurrentChange(val) {
      this.filtersData.pageIndex = val;
      this.getTableList();
    },
    // 每页显示多少条时发生改变
    handleSizeChange(val) {
      this.filtersData.pageSize = val;
      this.getTableList();
    }
  }
};
</script>
<style scoped lang="less">
.poporer-img {
  width: auto;
  height: 320px;
}
.el-table .success-row {
  background: orange;
}
.el-table .white-row {
  background: #fff;
}
</style>
