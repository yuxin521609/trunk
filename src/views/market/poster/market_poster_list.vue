<template>
  <div class="poster">
    <!-- 添加海报 -->
    <el-button @click="addPoster" type="danger">添加海报</el-button>
    <!-- 海报列表 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="id" label="海报ID" width="200"></el-table-column>
      <el-table-column prop="image" label="海报图" width="200">
        <template slot-scope="scope">
          <img class="img" :src="scope.row.image" alt />
        </template>
      </el-table-column>

      <el-table-column prop="sort" label="排序" width="150"></el-table-column>
      <el-table-column prop="createTime" label="时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="deletePoster(scope.row.id)" type="text" size="small">删除</el-button>
          <el-button @click="compilePoster(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" :total="total"></el-pagination>
    <!-- 弹框组件 -->
    <add3Poster :dialogVisible="dialogVisible" :compileData="compileData" />
  </div>
</template>

<script>
import add3Poster from "./add3Poster";
export default {
  components: {
    add3Poster,
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      compileData: {},
      pageIndex: 1,
      pageSize: 4,
      total: 0,
    };
  },
  created() {
    this.list();
  },
  methods: {
    // 点击编辑
    compilePoster(row) {
      this.dialogVisible = true;
      this.compileData = row;
    },
    // 点击添加
    addPoster() {
      this.dialogVisible = true;
      console.log(1);
    },
    // 分页
    handleCurrentChange(index) {
      this.pageIndex = index;
      this.list();
    },
    // 点击删除
    deletePoster(id) {
      this.request(
        { url: "market-service/market/delete", method: "delete" },
        {
          ids: id,
        }
      ).then(() => {
        this.list();
      });
    },
    // 获取列表数据
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
    width: 50px;
    height: 50px;
  }
}
</style>