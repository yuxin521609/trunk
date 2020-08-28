<!--
 * @Description: 规格列表
 * @Author: elephant
 * @Date: 2019-07-01 15:20:22
 * @LastEditTime: 2020-02-25 14:53:39
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
            :value="cateArr"
            @change="cascaderGet"
            :show-all-levels="false"
            :props="props"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="valid" label="使用状态">
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
          <el-button size="small" type="primary" @click="openAddSpecification">新增规格</el-button>
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
          <el-table-column align="center" width="50">
            <template slot-scope="scope">
              <i
                @click="childrenIsShow(scope.row)"
                v-if="scope.row.isShow"
                :class="scope.row.isType == 1 ?'el-icon-circle-plus-outline i-cursor' : 'el-icon-remove-outline i-cursor'"
              ></i>
            </template>
          </el-table-column>
          <el-table-column prop="code" align="center" label="规格编号" width="100"></el-table-column>
          <el-table-column prop="name" align="center" label="规格名称" width="100"></el-table-column>
          <el-table-column prop="_chilrenName" align="center" label="规格内容" width="100"></el-table-column>
          <el-table-column prop="cateName" align="center" label="对应分类" width="100"></el-table-column>
          <el-table-column prop="description" align="center" label="备注" min-width="100"></el-table-column>
          <el-table-column prop="valid" align="center" label="使用状态" width="120">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.valid"
                v-if="scope.row.isShow"
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
                @click="openShowDetails(scope.row.id)"
                v-if="scope.row.isShow"
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                @click="openEditDetails(scope.row.id)"
                v-if="scope.row.isShow"
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
/**
 * 规格管理
 */
export default {
  name: "specification_list",
  data() {
    return {
      cateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        cateIdentifier: "", //产品分类标识码
        valid: null, //有效状态
        searchWords: "" //搜索关键字
      },
      tableListData: [],
      total: null, //总条目数
      classData: [],
      classList: []
    };
  },
  created() {
    this.getTableList();
    this.getClassData();
  },
  activated() {
    this.getTableList();
  },
  methods: {
    getClassData() {
      this.$common.getClassSelect(this, 1).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
    },
    cascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      this.filtersData.cateIdentifier = obj.identifier;
    },
    //获取列表
    getTableList() {
      this.request(
        this.api.product.productSpecifications_list,
        this.filtersData
      ).then(data => {
        let _data = data.data,
          _dataLen = _data.length;
        for (let i = 0; i < _dataLen; i++) {
          _data[i].isShow = true;
          _data[i].isType = 1;
          _data[i]._cid = "";
        }
        this.tableListData = _data;
        this.total = data.totalCount;
      });
    },

    //滑块开关
    switchValid(params) {
      this.request(
        this.api.product.productSpecifications_save,
        params
      ).then(data => {});
    },
    //新增规格  跳转页面
    openAddSpecification() {
      this.$router.push({
        path: "/product/specification_attrbute/add_specification",
        name: "add_specification",
        query: {
          type: "add"
        }
      });
    },
    //查看规格
    openShowDetails(params) {
      this.$router.push({
        path: "/product/specification_attrbute/show_specification",
        name: "show_specification",
        query: {
          id: params,
          type: "show"
        }
      });
    },
    //修改规格
    openEditDetails(params) {
      this.$router.push({
        path: "/product/specification_attrbute/edit_specification",
        name: "edit_specification",
        query: {
          id: params,
          type: "edit"
        }
      });
    },
    //点击获取子元素插入数组
    childrenIsShow(row) {
      let listData = this.tableListData;
      let _path = this.api.product.productSpecificationsAttribute_list;
      let _this = this;
      let _key = "specificationsId";
      this.$common.clickGetChildren(_this, row, listData, _path, _key);
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
    //当前页数修改时发生改变
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
<style lang="less" scoped>
</style>
