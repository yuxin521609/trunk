<template>
  <div class="poster">
    <!-- 点击添加 -->
    <el-button type="primary" @click="addFoledr">添加海报</el-button>
    <!-- 海报列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="image" label="海报图" width="180">
        <template slot-scope="scopes">
          <img class="img" :src="scopes.row.image" alt />
        </template>
      </el-table-column>

      <el-table-column prop="sort" label="序号" width="180"></el-table-column>
      <el-table-column prop="createTime" label="时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="deletePosters(scope.row.id)" type="text" size="small">删除</el-button>
          <el-button @click="compilePosters(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :page-size="pageSize" :total="total" @current-change="handleCurrentChange"></el-pagination>
    <!-- 点击海报组件 -->
    <add1Poster :dialogVisible="dialogVisible" :editSeries="editSeries" />
  </div>
</template>

<script>
import add1Poster from "./add1Poster";
export default {
  components: {
    add1Poster,
  },
  data() {
    return {
      tableData: [],
      dialogVisible:false,
      editSeries:{},
      //分页
      total: 0,
      pageIndex: 1,
      pageSize: 3,
    };
  },
  created() {
    this.list();
  },
  methods: {
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
    deletePosters(id) {
      this.request(
        { url: "market-service/market/delete", method: "DELETE" },
        {
          ids: id,
        }
      ).then((s) => {
        this.list();
      });
    },
    // 点击添加
    addFoledr() {
      // debugger
      this.dialogVisible = true;
    },
    // 点击编辑
    compilePosters(row){
      this.dialogVisible = true;
      this.editSeries = row;
    }
  },
};
</script>

<style lang="less">
.poster {
  margin: 0 10px;
  background-color: #ffffff;
  height: 500px;
  .el-button {
    margin: 30px;
  }
  .img {
    width: 40px;
    height: 40px;
  }
}
</style>>

