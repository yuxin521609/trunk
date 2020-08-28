<!--
 * @Description:升级管理 
 * @Author: elephant
 * @Date: 2019-08-13 18:05:00
 * @LastEditTime: 2019-11-19 14:02:33
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
        <el-form-item prop="type" label="操作系统">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.type">
            <el-option
              v-for="item in typeListData"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
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
          <el-button size="small" type="primary" @click="openAddDetails">新建升级方案</el-button>
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
          <el-table-column prop="createTime" align="center" label="升级时间" min-width="100">
            <template slot-scope="scope">
              <p>{{scope.row.createTime | timestampToTime}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="version" align="center" label="版本号" width="100"></el-table-column>
          <el-table-column prop="type" align="center" label="系统" min-width="100"></el-table-column>
          <el-table-column prop="upgradeScope" align="center" label="升级范围" width="100">
            <template slot-scope="scope">
              <p>{{scope.row.upgradeScope | upgradeScopeName}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="description" align="center" label="升级备注" min-width="100"></el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button @click="openEditDetails(scope.row.id)" type="text" size="small">编辑</el-button>
              <el-button @click="removeItem(scope.row)" type="text" size="small">删除</el-button>
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
export default {
  name:'upgrade_list',
  data() {
    return {
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10 //每页数量
      },
      typeListData: [{ name: "Android" }, { name: "iOS" }],
      tableListData: [],
      total: null //总条目数
    };
  },
  created() {
    this.getTableList();
  },
    activated () {
      this.getTableList();
    },
  filters: {
    upgradeScopeName: function(value) {
      return "全部";
    }
  },
  methods: {
    //获取列表
    getTableList() {
      this.request(
        this.api.version.applicationVersionControl_list,
        this.filtersData
      ).then(data => {
        let _data = data.data;
        this.tableListData = _data;
        this.total = data.totalCount;
      });
    },
    //新增频道  跳转页面
    openAddDetails() {
      this.$router.push({
        path: "/applicationVersion/version/add_upgrade",
        query: {
          type: "add"
        }
      });
    },
    //修改频道
    openEditDetails(params) {
      this.$router.push({
        path: "/applicationVersion/version/edit_upgrade",
        query: {
          id: params,
          type: "edit"
        }
      });
    },
    //删除
    removeItem(item) {
      this.$confirm("此操作将删除该版本, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.request(
            this.api.version.applicationVersionControl_logicDelete,
            item
          ).then(data => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.handleSearch();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
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
    }
  }
};
</script>
<style lang="less" scoped>
</style>
