<template>
  <div class="poster">
    <el-button type="primary" @click="addPoster">主要按钮</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="image" label="海报图" width="180">
        <template slot-scope="scope">
          <img class="img" :src="scope.row.image" alt />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="180"></el-table-column>
      <el-table-column prop="createTime" label="时间" width="180"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deletePoster(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="compilePoster(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" :total="total"></el-pagination>
    <add2Poster :dialogVisible="dialogVisible" :echo="echo" />
  </div>
</template>
<script>
import add2Poster from "./add2Poster";
export default {
  name: "XXX",
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      echo: {},
      // 分页
      pageIndex: 1,
      pageSize: 3,
      total: 0,
    };
  },
  components: {
    add2Poster,
  },
  // 加载前获取
  created() {
    this.list();
  },
  methods: {
    // 点击编辑
    compilePoster(rom) {
      this.dialogVisible = true;
      this.echo = rom;
    },

    // 点击添加
    addPoster() {
      this.dialogVisible = true;
    },
    // 分页
    handleCurrentChange(index) {
      this.pageIndex = index;
      this.list();
    },
    // 获取数据
    list() {
      this.request(
        { url: "market-service/market/list", method: "post" },
        {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        }
      ).then((s) => {
        this.tableData = s.data;
        this.total = s.totalCount;
      });
    },
    // 点击删除
    deletePoster(id) {
      this.request(
        { url: "market-service/market/delete", method: "DELETE" },
        {
          ids: id,
        }
      ).then(() => {
        this.list();
      });
    },
  },
};
</script>
<style lang="less">
.poster {
  margin: 0 8px;
  background-color: #ffffff;
  height: 700px;
  .el-button {
    margin: 30px;
  }
  .img {
    width: 45px;
    height: 45px;
  }
}
</style>
