<template>
  <div>
    <div class="table_div">
      <el-table
        ref="multipleTable"
        :data="tableListData"
        tooltip-effect="dark"
        style="width: 100%"
        header-row-class-name="item-table-header"
      >
        <el-table-column label="仓库名称">
          <template slot-scope="scope">{{ scope.row.warehouseName ? scope.row.warehouseName : '--'}}</template>
        </el-table-column>
        <el-table-column prop="warehouseCode" label="仓库编码">
          <template slot-scope="scope">{{ scope.row.warehouseCode?scope.row.warehouseCode:'--' }}</template>
        </el-table-column>
        <el-table-column prop="externalApplication" label="仓库管控路由">
          <template
            slot-scope="scope"
          >{{scope.row.externalApplication? scope.row.externalApplication : '--' }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              @click="syncBtnClick(scope.row)"
              type="text"
              size="small"
              :disabled="scope.row.sync"
            >同步库存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableListData: []
    };
  },
  mounted() {
    this.getTableListData();
  },
  methods: {
    //得到仓库初始数据
    getTableListData() {
      this.request(this.api.warehouse.warehouseBase_warehouse_list, {}).then(
        res => {
          console.log(res);
          res.data.forEach(item => {
            this.$set(item, "sync", false);
          });
          this.tableListData = res.data;
        }
      );
    },
    //同步库存Btn的点击事件
    syncBtnClick(row) {
      console.log("syncBtnClick-----");
      this.request(
        this.api.warehouse.warehouseBase_inventory_synchronizeInventory,
        { warehouseCode: row.warehouseCode }
      ).then(res => {
        this.$message({
          message: "同步成功",
          type: "success"
        });
        row.sync = true;
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>>