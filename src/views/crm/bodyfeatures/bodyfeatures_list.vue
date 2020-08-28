<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-20 08:58:23
 * @LastEditTime: 2019-11-14 15:03:11
 * @LastEditors: your name
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
        <el-form-item prop="id" label="特型部位：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.id">
            <el-option
              v-for="item in bodyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" type="primary" plain size="small">搜索</el-button>
          <el-button @click="handleResetFilters('filtersForm')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--table  -->
    <div class="item-margin">
      <div class="item-cont">
        <el-button-group>
          <el-button size="small" type="primary" @click="openAdd">新增体型特征</el-button>
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
          <el-table-column align="center" min-width="50">
            <template slot-scope="scope">
              <i
                @click="childrenIsShow(scope.row)"
                v-if="scope.row.isShow"
                :class="scope.row.isType == 1 ?'el-icon-circle-plus-outline i-cursor' : 'el-icon-remove-outline i-cursor'"
              ></i>
            </template>
          </el-table-column>
          <el-table-column prop="name" align="center" label="特型部位" min-width="100"></el-table-column>
          <el-table-column prop="_chilrenName" align="center" label="特型内容" min-width="100"></el-table-column>
          <el-table-column prop="used" align="center" label="使用状态" min-width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.used"
                active-color="#13ce66"
                @change="switchValid(scope.row)"
                inactive-color="#9d9d9d"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300">
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
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-10 mb-20">
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
  name:'bodyfeatures_list',
  data() {
    return {
      filtersData: {
        id: "",
        pageIndex: 1, //当前页码
        pageSize: 10 //每页数量
      },
      bodyOptions: [],
      cateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      tableListData: [],
      total: null,
      classData: [],
      classList: []
    };
  },
  created() {
    this.getTableList();
    this.getBodyData();
  },
  activated () {
    this.getTableList();
  },
  methods: {
    //获取列表
    getTableList() {
      this.request(this.api.user.crm_bodyfeatures_list, this.filtersData).then(
        data => {
          let _data = data.data,
            _dataLen = _data.length;
          for (let i = 0; i < _dataLen; i++) {
            _data[i].isShow = true;
            _data[i].isType = 1;
            _data[i]._cid = "";
          }
          this.tableListData = _data;
          this.total = data.totalCount;
        }
      );
    },
    //新增基本信息  跳转页面
    openAdd() {
      this.$router.push({
        path: "/crm/bodyfeatures/add_bodyfeatures",
        name: "add_bodyfeatures",
        query: {
          type: "add"
        }
      });
    },
    //查看基本信息
    openShowDetails(params) {
      this.$router.push({
        path: "/crm/bodyfeatures/show_bodyfeatures",
        name: "show_bodyfeatures",
        query: {
          id: params,
          type: "show"
        }
      });
    },
    //修改基本信息
    openEditDetails(params) {
      this.$router.push({
        path: "/crm/bodyfeatures/edit_bodyfeatures",
        name: "edit_bodyfeatures",
        query: {
          id: params,
          type: "edit"
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
      this.request(this.api.user.crm_bodyfeatures_updateSelective, {
        id: params.id,
        used: params.used
      }).then(data => {
      });
    },
    getBodyData() {
      this.request(this.api.user.crm_bodyfeatures_list, {}).then(data => {
        let _data = data.data;
        console.log(_data);
        this.bodyOptions = _data;
      });
    },
    //点击获取子元素插入数组
    childrenIsShow(row) {
      let listData = this.tableListData;
      let _path = this.api.user.crm_bodyfeaturesItem_list;
      let _this = this;
      let _key = "featuresId";
      this.$common.clickGetChildren(_this, row, listData, _path, _key);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
