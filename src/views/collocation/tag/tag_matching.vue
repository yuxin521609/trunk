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
        <el-form-item prop="createTimeGE" label="创建时间：">
          <el-col :span="11">
            <el-date-picker
              v-model="filtersData.createTimeGE"
              type="date"
              placeholder="请选择区间下限"
              class="input-w"
            ></el-date-picker>
          </el-col>
          <el-col :span="1">&nbsp;&nbsp;</el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="filtersData.createTimeLE"
              type="date"
              placeholder="请选择区间上限"
              class="input-w"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item prop="tagGroupId" label="所属分组：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.tagGroupId">
            <el-option
              v-for="item in groupOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="searchWords" label="综合搜索：">
          <el-input class="input-w" placeholder="标签名称" v-model="filtersData.searchWords"></el-input>
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
        <el-button size="small" type="primary" @click="openAdd">新增匹配标签</el-button>
      </div>
      <div class="item-table">
        <el-table
          :data="tableListData"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true"
          @sort-change="tableSortChange"
        >
          <el-table-column prop="name" align="center" label="标签名称" min-width="50"></el-table-column>
          <el-table-column prop="tagGroupName" align="center" label="所属分组" min-width="100"></el-table-column>
          <el-table-column prop="description" align="center" label="标签描述" min-width="100"></el-table-column>
          <el-table-column prop="creatorName" align="center" label="创建人" min-width="100"></el-table-column>
          <el-table-column
            prop="createTime"
            sortable="custom"
            align="center"
            label="创建时间"
            min-width="80"
          >
            <template slot-scope="scope">
              <p>{{scope.row.createTime | timestampToTime}}</p>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button  @click="handleShowClick(scope.row.id)" type="text" size="small">查看</el-button>
              <el-button :disabled="scope.row.status == 5" @click="handleEditClick(scope.row.id)" type="text" size="small">修改</el-button>
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
    <!-- 弹框 -->
    <matching-dialog @refreshItem="refreshList" ref="matchingRef"></matching-dialog>
  </div>
</template>
<script>
import MatchingDialog from "../components/matching_dialog";
export default {
  inject: ["reload"],
  data() {
    return {
      filtersData: {
        createTimeGE: null, //时间下限
        createTimeLE: null, //时间上限
        tagGroupId: "", //所属分组
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        searchWords: "" //检索关键字
      },
      total: 0,
      groupOptions: [],
      //table列表数据
      tableListData: []
    };
  },
  created() {
    this.getTableList();
    this.getTagGroupList();
  },
  methods: {
    getTagGroupList() {
      this.request(this.api.collocation.collocationTagGroup_list, {}).then(
        res => {
          this.groupOptions = res.data;
        }
      );
    },
    //获取列表
    getTableList() {
      let filter =this.$common.deepCopy(this.filtersData);
      if(filter.createTimeLE != null){
        let date = new Date(filter.createTimeLE);
        let t=((date.getTime() / 1000) + 86399) * 1000;
        filter.createTimeLE = new Date(t);
      }
      this.request(
        this.api.collocation.collocationTag_list,
       filter
      ).then(data => {
        let _data = data.data,
          _dataLen = _data.length;
        this.tableListData = _data;
        this.total = data.totalCount;
      });
      filter=null;
    },
    //排序
    tableSortChange(obj) {
      let _order = obj.order != null ? (obj.order == "ascending" ? "asc" : "desc") : null;
      this.filtersData.orderBy = obj.prop;
      this.filtersData.sortBy = _order;
      this.getTableList();
    },
    //搜索
    handleSearch() {
     
      this.filtersData.pageIndex = 1;
      this.getTableList();
    },
    //清空重置
    handleResetFilters(formName) {
      this.$refs[formName].resetFields();
      this.filtersData.createTimeLE= "";
      this.filtersData.usingCountLE= "";
    },
    //滑块开关
    switchValid(params) {
      // this.request(this.api.collocation.collocationTag_save, params);
    },
    //新增匹配标签
    openAdd() {
      this.$refs.matchingRef.popupInit("add", "新增匹配标签");
    },
    // 修改匹配标签
    handleEditClick(_id) {
      this.$refs.matchingRef.popupInit("edit", "修改匹配标签", _id);
    },
    // 查看匹配标签
    handleShowClick(_id) {
      this.$refs.matchingRef.popupInit("show", "查看匹配标签", _id);
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
      this.reload();
    }
  },
  components: {
    MatchingDialog
  }
};
</script>

<style scoped lang="less">
</style>
