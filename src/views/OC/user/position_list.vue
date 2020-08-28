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
        <el-form-item prop="filter" label="模糊查询：">
          <el-input class="input-w" placeholder="职位编号/职位名称" v-model="filtersData.filter"></el-input>
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
          <el-button size="small" type="primary" @click="openAddClass" >新增</el-button>
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
          <el-table-column type="selection" min-width="20"></el-table-column>
          <el-table-column prop="code" align="center" label="职位编号" min-width="80"></el-table-column>
          <el-table-column prop="name" align="center" label="职位名称" min-width="80"></el-table-column>
          <el-table-column prop="jobDescribe" align="center" label="职位描述" min-width="80"></el-table-column>
          <el-table-column prop="personNum" align="center" label="关联人员" min-width="80">
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
          <el-table-column prop="createTime" align="center" label="创建时间" min-width="80">
            <template slot-scope="scope">{{scope.row.createTime|timestampToTime}}</template>
          </el-table-column>
          <el-table-column prop="used" align="center" label="启停状态" min-width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.used"
                active-color="#13ce66"
                @change="switchValid(scope.row)"
                inactive-color="#9d9d9d"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="140"
          >
            <template slot-scope="scope">
              <el-button @click="handleEditClick(scope.row.id)" type="text" size="small">编辑</el-button>
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
            :page-sizes="[10,20,30,40,50]"
            :page-size="filtersData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!--table END  -->
    <tp-class-details
      :itemParam="itemStautsParam"
      @refreshItem="refreshList"
      ref="positionDetailsCpt"
    ></tp-class-details>
    <PersonNumAy :itemParam="itemStautsParam" @refreshItem="refreshList" ref="personNumCpt"></PersonNumAy>
  </div>
</template>
<script>
/**
 * 职位管理
 */
import PositionDetailsAy from "@/views/OC/user/position_details.vue";
import PersonNumAy from "@/views/OC/user/positionPersons.vue";

export default {
  name: 'position_list',
  components: {
    [PositionDetailsAy.name]: PositionDetailsAy,
    PersonNumAy
  },
  data() {
    return {
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        used: null, //有效状态
        filter: "", //搜索关键字
        startDate: "",
        endDate: ""
      },
      tableListData: [],
      cateOptions: [
        {
          label: "江苏",
          cities: []
        }
      ],
      itemStautsParam: {
        type: "add",
        title: "新增职位",
        id: ""
      },
      props: {
        value: "id",
        label: "name",
        children: "cities"
      },
      //搜索项职位
      cateParentData: {
        level: 0
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },

      currentPage: 1, // 当前页数
      total: null //总条目数
    };
  },
  created() {
    this.getTableList();
    this.getCateOptions();
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key == 13) {
        self.handleSearch();
      }
    };
  },
  mounted() {},
  activated() {
    this.getTableList();
  },
  methods: {
    //获取列表
    getTableList() {
      this.request(this.api.user.position_list, this.filtersData).then(data => {
        let _data = data.data,
          _dataLen = _data.length;
        for (let i = 0; i < _dataLen; i++) {
          _data[i].isShow = true;
          _data[i].isType = 1;
        }
        this.tableListData = _data;
        this.total = data.totalCount;
      });
    },
    //获取职位
    getCateOptions() {
      this.request(this.api.user.position_list, { parentId: null }).then(
        data => {
          let _data = data.data,
            dataLen = _data.length;
          console.log(_data);
          function toTree(data, parent_id = null || "") {
            var tree = [];
            var temp;
            for (var i = 0; i < data.length; i++) {
              if (data[i].parentId == parent_id) {
                var obj = data[i];
                temp = toTree(data, data[i].id);
                if (temp.length > 0) {
                  obj.children = temp;
                }
                tree.push(obj);
              }
            }
            return tree;
          }

          var tree;
          tree = toTree(_data, 0);
          console.log(tree);
        }
      );
    },
    //改变时获取子职位
    handleItemChange(val) {
      console.log(val);
      let value = val[0];
      this.request(this.api.user.position_list, { parentId: value }).then(
        data => {
          let cities = (data && data && data.data) || [];
          for (let i = 0; i < this.cateOptions.length; i++) {
            console.log(this.cateOptions[i].id == value);
            if (this.cateOptions[i].id == value) {
              this.cateOptions[i].cities = cities; // 视图未更新
              //this.$set(this.cateOptions[i], 'cities', cities) // right
              break;
            }
          }
          console.log(this.cateOptions);
        }
      );
    },
    //滑块开关
    switchValid(params) {
      let self = this;
      let urlCon = this.util.deepCopy(self.api.user.position_save);
      urlCon.tip = false;
      self.request(urlCon, params).then(data => {
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
          self.request(self.api.user.position_delete, val).then(data => {
            self.getTableList();
            self.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {});
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
    //新增职位
    openAddClass() {
      (this.itemStautsParam.type = "add"),
        (this.itemStautsParam.title = "新增职位");
      this.$refs.positionDetailsCpt.positionDetailsPopupInit();
    },
    //查看  //查看 及修改 只带ID过去取消传参
    handleShowClick(_id) {
      this.itemStautsParam.type = "show";
      this.itemStautsParam.title = "查看职位";
      this.itemStautsParam.id = _id;
      this.$refs.positionDetailsCpt.positionDetailsPopupInit();
    },
    //修改职位
    handleEditClick(_id) {
      this.itemStautsParam.type = "edit";
      this.itemStautsParam.title = "修改职位";
      this.itemStautsParam.id = _id;
      this.$refs.positionDetailsCpt.positionDetailsPopupInit();
    },
    //查看机构/部门下人员
    handleShowPersonNumClick(_id) {
      this.itemStautsParam.type = "show";
      this.itemStautsParam.title = "查看人员";
      this.itemStautsParam.id = _id;
      this.$refs.personNumCpt.getClassData();
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
      this.handleResetFilters("filtersForm");
      this.handleSearch();
    }
  }
};
</script>
<style lang="less" scoped>
h5 {
  color: #222;
  margin-left: -15px;
}
.test {
  color: #9d9d9d;
}
</style>
