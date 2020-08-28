<template>
  <div>
    <div class="flex-space-around">
      <div class="flex-fixed-ztree ml-8 mr-8">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree
          :data="ztreeData"
          :props="defaultProps"
          :default-expand-all="true"
          :expand-on-click-node="false"
          :highlight-current="true"
          :render-content="renderContent"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          ref="departmenttree"
        ></el-tree>
      </div>
      <div class="flex-w item-table mr-8">
        <div class="item-margin">
          <div class="item-cont">
            <el-button-group>
              <el-button size="small" type="primary" @click="openAddClass">新增</el-button>
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
              <el-table-column prop="code" align="center" label="部门编号" min-width="100"></el-table-column>
              <el-table-column prop="name" align="center" label="部门名称" min-width="170">
                <template slot-scope="scope">
                  <p>{{scope.row.name | ellipsis }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="parentName" align="center" label="上级机构/部门" min-width="170"></el-table-column>
              <el-table-column prop="departPersonNum" align="center" label="部门下人员数" min-width="120">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.departPersonNum !=0"
                    @click="handleShowPersonNumClick(scope.row.id)"
                    type="text"
                    size="small"
                  >{{scope.row.departPersonNum}}</el-button>
                  <p v-else>--</p>
                </template>
              </el-table-column>
              <el-table-column prop="storeNum" align="center" label="管辖门店" min-width="100">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.storeNum !=0"
                    @click="handleShowStoreNumClick(scope.row.id)"
                    type="text"
                    size="small"
                  >{{scope.row.storeNum}}</el-button>
                  <p v-else>--</p>
                </template>
              </el-table-column>
              <el-table-column prop="departWarehouseNum" align="center" label="管辖库房" min-width="120">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.departWarehouseNum !=0"
                    @click="handleShowWareHouseNumClick(scope.row.id)"
                    type="text"
                    size="small"
                  >{{scope.row.departWarehouseNum}}</el-button>
                  <p v-else>--</p>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" align="center" label="创建时间" min-width="200">
                <template slot-scope="scope">{{scope.row.createTime|timestampToTime}}</template>
              </el-table-column>
              <el-table-column prop="used" align="center" label="启停状态" min-width="100">
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
                  <el-button
                    @click="handleEditDepartmentClick(scope.row.id)"
                    type="text"
                    size="small"
                  >编辑</el-button>
                  <el-button @click="handleDeleteClick(scope.row)" type="text" size="small">删除</el-button>
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
      </div>
    </div>
    <!--table END  -->
    <departPersonNum :itemParam="itemStautsParam" ref="personNumCpt"></departPersonNum>
    <storeNum :itemParam="itemStautsParam" ref="storeNumCpt"></storeNum>
    <departWarehouseNum :itemParam="itemStautsParam" ref="warehouseNumCpt"></departWarehouseNum>
  </div>
</template>
<script>
import departPersonNum from "@/views/OC/mechanism/departPersonNum.vue";
import StoreNumAy from "@/views/OC/mechanism/storeNum.vue";
import departWarehouseNum from "@/views/OC/mechanism/departWarehouseNum.vue";

export default {
  name: 'department_list',
  components: {
    departPersonNum,
    [StoreNumAy.name]: StoreNumAy,
    departWarehouseNum
  },
  data() {
    return {
      filterText: "",
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        used: null, //有效状态
        type: 1,
        ownParentId: "",
        orderBy: "code"
      },
      tableListData: [],
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
      currentPage: 1, // 当前页数
      total: null, //总条目数
      serviceParam: null, //向子组件传参 需设置类型
      ztreeData: [],
      defaultProps: {
        //定义ZTREE
        children: "children",
        label: "label"
      }
    };
  },
  created() {
    this.getDepartTree();
    this.getTableList();
  },
  activated() {
    this.getTableList();
  },
  methods: {
    renderContent(h, { node, data, store }) {
      //let text = data.type == 0 ? "0." + node.label : "1." + node.label;
      let text = node.label;
      if(text.length > 10){
        text = text.substr(0, 10) + '...'
      }
      if (data.used == false) {
        return <span style="color:red">{text}</span>;
      } else {
        return <span>{text}</span>;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getDepartTree() {
      this.request(this.api.user.DEPART_LIST_POST).then(
        data => {
          let _data = data,
            _dataLen = _data.length;
          for (let i = 0; i < _dataLen; i++) {
            _data[i].label = _data[i].name;
            _data[i].children = this.setSubList(_data[i].sublist);
          }
          // let root = [
          //   {
          //     label: "组织机构",
          //     parentd: null,
          //     children: _data
          //   }
          // ];
          // this.ztreeData = root;
          this.ztreeData = _data;
        }
      );
    },
    setSubList(_data) {
      if (_data == null || _data.length == 0) return _data;
      for (let i = 0; i < _data.length; i++) {
        _data[i].label = _data[i].name;
        _data[i].children = this.setSubList(_data[i].sublist);
      }
      return _data;
    },
    //滑块开关
    switchValid(row) {
      let urlCon = this.util.deepCopy(this.api.user.depart_save);
      let params = {
        id: row.id,
        used: row.used
      }
      this.request(urlCon, params).then(data => {
        this.getDepartTree();
      });
    },
    //新增部门
    openAddClass() {
      this.$router.push({
        path: "/OC/mechanism/department_details",
        query: {
          type: "add"
        }
      });
    },
    //编辑部门
    handleEditDepartmentClick(params) {
      this.$router.push({
        path: "/OC/mechanism/department_details",
        query: {
          id: params,
          type: "edit"
        }
      });
    },
    //查看部门下人员
    handleShowPersonNumClick(_id) {
      this.itemStautsParam.type = "show";
      this.itemStautsParam.title = "查看人员";
      this.itemStautsParam.id = _id;
      this.$refs.personNumCpt.getClassData();
    },
    //查看构/部门门店
    handleShowStoreNumClick(_id) {
      this.itemStautsParam.type = "show";
      this.itemStautsParam.title = "查看门店";
      this.itemStautsParam.id = _id;
      this.$refs.storeNumCpt.getClassData();
    },
    //查看构/部门库房
    handleShowWareHouseNumClick(_id) {
      this.itemStautsParam.type = "show";
      this.itemStautsParam.title = "查看库房";
      this.itemStautsParam.id = _id;
      this.$refs.warehouseNumCpt.getClassData();
    },
    //获取列表
    getTableList() {
      // this.request(this.api.user.depart_list, this.filtersData).then(data => {
      //   let _data = data.data;
      //   let _dataLen = _data.length;
      //   for (let i = 0; i < _dataLen; i++) {
      //     _data[i].isShow = true;
      //     _data[i].isType = 1;
      //   }
      //   this.tableListData = _data;
      //   this.total = data.totalCount;
      // });
      this.request(this.api.user.depart_listByAuth, this.filtersData).then(data => {
        let _data = data.data;
        let _dataLen = _data.length;
        for (let i = 0; i < _dataLen; i++) {
          _data[i].isShow = true;
          _data[i].isType = 1;
        }
        this.tableListData = _data;
        this.total = data.totalCount;
      });
    },
    handleNodeClick(a, b, c, d) {
      this.filtersData.ownParentId = a.id;
      this.filtersData.orderBy = "code";
      this.getTableList();
    },
    //删除组织机构
    handleDeleteClick(val) {
      let self = this;
      self
        .$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.request(self.api.user.depart_delete, val).then(data => {
            self.getDepartTree();
            self.getTableList();
            self.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {});
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
  },
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 10) {
        return value.slice(0,10) + '...'
      }
      return value
    }
  },
  watch: {
    filterText(val) {
      this.$refs.departmenttree.filter(val);
    }
  }
};
</script>
<style lang="less" scoped>
h5 {
  color: #222;
  margin-left: -15px;
}
.flex-fixed-ztree .el-input{
  width: 90%;
  margin: 10px;
}
.item-cont{
  padding: 14px;
}
</style>
