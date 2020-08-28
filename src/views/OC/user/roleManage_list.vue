<template>
  <div class="role_list_wrapper">
    <div class="item-margin">
      <el-form
        class="item-form"
        :model="filtersData"
        label-width="90px"
        size="small"
        ref="filtersForm"
        inline
      >
        <el-form-item prop="filter" label="模糊查询：">
          <el-input class="input-w" placeholder="角色名称" v-model="filtersData.filter"></el-input>
        </el-form-item>
        <el-form-item label="创建时间：" prop="startDate">
          <el-date-picker v-model="filtersData.startDate" type="date" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item prop="endDate">
          <el-date-picker v-model="filtersData.endDate" type="date" placeholder="结束日期"></el-date-picker>
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
          <el-button size="small" type="primary" @click="openAddClass()">新增</el-button>
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
          <el-table-column type="selection" width="100"></el-table-column>
          <el-table-column prop="code" align="center" label="角色编号" min-width="100"></el-table-column>
          <el-table-column prop="name" align="center" label="角色名称" min-width="100"></el-table-column>
          <el-table-column prop="type" align="center" label="角色类型" min-width="100">
            <template slot-scope="scope">{{"CEN003"|codeToName(scope.row.type)}}</template>
          </el-table-column>
          <el-table-column prop="personNum" align="center" label="关联人员" min-width="100">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.personNum !=0"
                @click="handleShowPersonNumClick(scope.row.id)"
                type="text"
                size="small"
              >{{scope.row.personNum}}</el-button>
              <p v-else>--</p>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间" min-width="100">
            <template slot-scope="scope">{{scope.row.createTime|timestampToTime}}</template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-button @click="openEditDetails(scope.row.id)" type="text" size="small">编辑</el-button>
              <el-button @click="deleteItem(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-10 mb-20">
          <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersData.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="filtersData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!--table END  -->
    <PersonNumAy :itemParam="itemStautsParam" ref="personNumCpt"></PersonNumAy>
  </div>
</template>

<script>
import PersonNumAy from "@/views/OC/user/rolePersons.vue";
/**
 * 基本管理
 */
export default {
  name: 'roleManage_list',
  components: {
    PersonNumAy
  },
  data() {
    return {
      filtersData: {
        cateId: "", //产品分类ID
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        filter: "", //搜索关键字
        startDate: "",
        endDate: ""
      },
      tableListData: [],
      total: 0,
      cateOptions: [],
      itemStautsParam: {
        type: "add",
        title: "新增",
        id: ""
      }
    };
  },
  created() {
    this.getTableList();
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key == 13) {
        self.handleSearch();
      }
    };
  },
  activated() {
    this.getTableList();
  },
  methods: {
    //获取列表
    getTableList() {
      this.request(this.api.user.role_list, this.filtersData).then(data => {
        let _data = data.data;
        this.tableListData = _data;
        this.total = data.totalCount;
      });
    },
    deleteItem(val) {
      let self = this;
      self.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self.request(self.api.user.role_delete, val).then(data => {
            self.getTableList();
            self.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {});
    },
    //查看机构/部门下人员
    handleShowPersonNumClick(_id) {
      this.itemStautsParam.type = "show";
      this.itemStautsParam.title = "查看人员";
      this.itemStautsParam.id = _id;
      this.$refs.personNumCpt.getClassData();
    },
    // //修改基本信息
    openEditDetails(id) {
      this.$router.push({
        path: "/OC/user/roleManage_details",
        query: {
          id: id,
          type: "edit"
        }
      });
    },
    openAddClass() {
      this.$router.push({
        path: "/OC/user/roleManage_details",
        query: {
          type: "add"
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
      this.request(this.api.user.role_save, params).then(data => {});
    }
  }
};
</script>

<style scoped>
.role_list_wrapper {
  margin-top: 8px;
}
</style>
