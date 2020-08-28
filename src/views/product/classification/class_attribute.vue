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
        <el-form-item prop="parentId" label="父级分类：">
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
        <el-form-item prop="valid" label="有效状态">
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
          <el-button size="small" type="primary" @click="openAddClass">新增分类</el-button>
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
          <el-table-column prop="code" align="center" label="分类编码" width="120"></el-table-column>
          <el-table-column prop="name" align="center" label="分类名称" min-width="100"></el-table-column>
          <el-table-column prop="parentName" align="center" label="父级分类" min-width="100"></el-table-column>
          <el-table-column prop="valid" align="center" label="有效状态" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.valid"
                active-color="#13ce66"
                @change="switchValid(scope.row)"
                inactive-color="#9d9d9d"
              ></el-switch>
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
    <tp-attribute :itemParam="itemStautsParam" @refreshItem="refreshList" ref="classDetailsCpt"></tp-attribute>
  </div>
</template>
<script>
/**
 * 属性分类管理
 */
import AttrDetails from "@/components/classification/attr_details.vue";
export default {
  inject: ["reload"],
  data() {
    return {
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        parentId: null, //父级id
        valid: null, //有效状态
        searchWords: "", //搜索关键字
        type: 3 //分类类型（1：标准分类，2：定制分类，3：原料分类或者称为属性分类）
      },
      tableListData: [],
      cateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      itemStautsParam: {
        type: "add",
        title: "新增属性分类",
        id: ""
      },
      total:0, //总条目数
      classData: [],
      classList: []
    };
  },
  created() {
    this.getTableList();
    this.getClassData();
  },

  methods: {
    getClassData() {
      this.$common.getClassSelect(this,3).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
    },
    cascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      this.filtersData.parentId = obj.id;
    },
    //获取列表
    getTableList() {
      this.request(
        this.api.product.categories_list,
        this.filtersData
      ).then(data => {
        this.tableListData = data.data;
        this.total = data.totalCount;
      });
    },

    //滑块开关
    switchValid(params) {
      this.request(this.api.product.categories_save, params)
      .then(data => {
          this.$message.success("修改成功！");
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
        this.cateArr = [];
    },
    //新增分类
    openAddClass() {
      this.itemStautsParam.type = "add";
    this.itemStautsParam.title = "新增属性分类";
      this.$refs.classDetailsCpt.attributePopupInit();
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
    //子组件传参刷新 父组件
    refreshList() {
     this.reload();
    }
  },
  components: {
    [AttrDetails.name]: AttrDetails
  }
};
</script>
<style lang="less" scoped>
</style>
