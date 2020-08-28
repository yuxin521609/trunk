<template>
  <el-dialog
    :title="itemParam.title"
    :visible.sync="classDialogVisible"
    class="alarmPopup"
    width="800px"
  >
    <div>
      <el-table :data="warehousedata">
        <el-table-column min-width="50" property="name" label="仓库名称"></el-table-column>
        <el-table-column min-width="50" property="type" label="仓库类型"></el-table-column>
        <el-table-column min-width="50" property="leader" label="仓库负责人"></el-table-column>
        <el-table-column prop="used" align="center" label="启停状态" width="80">
          <template slot-scope="scope">
            <el-switch
              disabled="disabled"
              v-model="scope.row.used"
              active-color="#13ce66"
              inactive-color="#9d9d9d"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
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
  </el-dialog>
</template>
<script>
export default {
  name: "departWarehouseNum",
  props: {
    itemParam: {
      type: Object
    }
  },
  data() {
    return {
      classDialogVisible: false,
      filtersData: {
        departId: "",
        pageIndex: 1, //当前页码
        pageSize: 10 //每页数量
      },
      total: 0, //总条目数
      warehousedata: []
    };
  },
  methods: {
    //获取列表数据
    getClassData() {
      var self = this;
      self.filtersData.departId = self.itemParam.id;
      self
        .request(this.api.system.warehouse_list, self.filtersData)
        .then(data => {
          self.warehousedata = data.data;
          self.total = data.totalCount;
        });
      this.classDialogVisible = true;
    },
    //当前页数修改时发生改变
    handleCurrentChange(val) {
      this.filtersData.pageIndex = val;
      this.getClassData();
    },
    // 每页显示多少条时发生改变
    handleSizeChange(val) {
      this.filtersData.pageSize = val;
      this.getClassData();
    }
  }
};
</script>