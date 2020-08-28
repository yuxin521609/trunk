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
        <el-form-item prop="cusCateIdentifier" label="分类选择：">
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
        <el-form-item prop="valid" label="状态：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.valid">
            <el-option
              v-for="item in this.$common.getValidOptions()"
              :key="item.status_id"
              :label="item.status_name"
              :value="item.status_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="searchWords" label="综合搜索：">
          <el-input class="input-w" placeholder="请输入内容" v-model="filtersData.searchWords"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="handleSearch" type="primary" plain>搜索</el-button>
          <el-button size="small" @click="handleResetFilters('filtersForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--table  -->
    <div class="item-margin">
      <div class="item-cont">
        <el-button-group>
          <el-button size="small" type="primary" @click="openAddSupport">新增单品</el-button>
        </el-button-group>
      </div>
      <div class="item-table">
        <el-table
          :data="tableListData"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true"
        >
          <el-table-column prop="cusFullCateName" align="center" label="定制分类" min-width="100"></el-table-column>
          <el-table-column prop="fullCateName" align="center" label="商品分类" min-width="100"></el-table-column>
          <el-table-column prop="name" align="center" label="名称" min-width="100"></el-table-column>
          <el-table-column prop="productGoodsCount" align="center" label="SKU数量" min-width="100"></el-table-column>
          <el-table-column prop="image" align="center" label="图片" min-width="100">
            <template slot-scope="scope">
              <img class="table-img-wh" :src="scope.row.image">
            </template>
          </el-table-column>
          <el-table-column prop="maxPrice" align="center" label="价格" min-width="100"></el-table-column>
          <el-table-column prop="valid" align="center" label="状态" min-width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.valid"
                active-color="#13ce66"
                @change="switchValid(scope.row)"
                inactive-color="#ff4949"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                @click="openShowDetails(scope.row)"
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                @click="openEditDetails(scope.row)"
                type="text"
                size="small"
              >修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-10 mb-20">
          <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersData.pageIndex"
            :page-sizes="[10,20,30,40,50]"
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
/**定制单品 */
export default {
  name:'custom_single',
  data() {
    return {
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        valid: null, //有效状态
        searchWords: "", //搜索关键字
        cusCateIdentifier: ""
      },
      tableListData: [],
      total: null,
      cateOptions: [],
      classData: [],
      classList: [],
      cateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      }
    };
  },
  created() {
    this.getClassData();
    this.getTableList();
  },
     activated () {
      this.getTableList();
    },
  methods: {
    getClassData() {
      //分类类型（1：标准分类，2：定制分类，3：原料分类或者称为属性分类）
      this.$common.getClassSelect(this, 2).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
    },
    cascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      this.filtersData.cusCateIdentifier = obj.identifier;
    },
    //获取列表
    getTableList() {
        this.request(this.api.product.customizedProduct_list, this.filtersData).then(data => {
        let _data = data.data,
        _dataLen = _data.length;
        this.tableListData=_data;
        this.total=data.totalCount;
      });
    },
    //新增单体  跳转页面
    openAddSupport() {
      this.$router.push({
        path: "/product/format/single_select",
      });
    },
     //查看支持
    openShowDetails(params) {
      this.$router.push({
        path: "/product/format/show_single",
        query: {
          _id: params.id,
          _type: "show"
        }
      });
    },
    //修改支持
    openEditDetails(params) {
      this.$router.push({
        path: "/product/format/edit_single",
        query: {
          _id: params.id,
          _type: "edit"
        }
      });
    },
    //搜索
    handleSearch() {
      this.filtersData.pageIndex = 1;
      this.getTableList();
    },
    //清空重置
    handleResetFilters(formName) {
      this.$refs[formName].resetFields();
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
    //滑块开关
    switchValid(params) {
      this.request(this.api.product.customizedProduct_updateValid,{id: params.id,valid:params.valid})
      .then(data => {
        this.$message.success('保存成功');
      });
    }
  }
};
</script>
<style lang="less" scoped>
</style>
