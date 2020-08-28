<template>
  <div>
    <div class="item-margin">
      <el-form
        class="item-form"
        :model="filtersData"
        label-width="100px"
        size="small"
        ref="filtersForm"
        inline
      >
        <el-form-item prop="valid" label="使用状态：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.valid">
            <el-option
              v-for="item in this,$common.getValidOptions()"
              :key="item.status_id"
              :label="item.status_name"
              :value="item.status_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="createTimeGE" label="创建时间：">
          <el-col :span="11">
            <el-date-picker
              v-model="filtersData.createTimeGE"
              type="date"
              class="input-w"
              placeholder="请选择区间下限"
            ></el-date-picker>
          </el-col>
          <el-col :span="1">&nbsp;&nbsp;</el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="filtersData.createTimeLE"
              type="date"
              class="input-w"
              placeholder="请选择区间上限"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item prop="tagsCountGE" label="包含标签数：">
          <el-col :span="11">
            <el-input class="input-w" placeholder="请输入最小值" v-model="filtersData.tagsCountGE"></el-input>
          </el-col>
          <el-col :span="1">&nbsp;&nbsp;</el-col>
          <el-col :span="11">
            <el-input class="input-w" placeholder="请输入最大值" v-model="filtersData.tagsCountLE"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="searchWords" label="综合搜索：">
          <el-input class="input-w" placeholder="分组名称或者创建人" v-model="filtersData.searchWords"></el-input>
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
        <el-button size="small" type="primary" @click="openAdd">新增分组</el-button>
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
          <el-table-column prop="sort" sortable="custom" align="center" label="排序" min-width="80"></el-table-column>
          <el-table-column prop="name" align="center" label="分组名称" min-width="100"></el-table-column>
          <el-table-column prop="tagsCount" align="center" label="包含标签数" min-width="100"></el-table-column>
          <el-table-column prop="description" align="center" label="分组描述" min-width="100"></el-table-column>
          <el-table-column prop="usingCount" align="center" label="使用次数" min-width="80"></el-table-column>
          <el-table-column prop="valid" align="center" label="使用状态" width="120">
            <template slot-scope="scope">
              <el-switch
                :disabled="scope.row.status == 5"
                v-model="scope.row.valid"
                active-color="#13ce66"
                @change="switchValid(scope.row)"
                inactive-color="#9d9d9d"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" align="center" label="创建人" min-width="120"></el-table-column>
          <el-table-column
            prop="createTime"
            sortable="custom"
            align="center"
            label="创建时间"
            min-width="120"
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
              <el-button @click="handleShowClick(scope.row.id)" type="text" size="small">查看</el-button>
              <el-button
                :disabled="scope.row.status == 5"
                @click="handleEditClick(scope.row.id)"
                type="text"
                size="small"
              >修改</el-button>
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
    <group-dialog @refreshItem="refreshList" ref="groupRef"></group-dialog>
  </div>
</template>
<script>
import GroupDialog from "../components/group_dialog";
export default {
  inject: ["reload"],
  data() {
    return {
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        searchWords: "", //检索关键字
        tagsCountGE: null,
        tagsCountLE: null,
        createTimeGE: null,
        createTimeLE: null,
        valid: null //有效状态
      },
      total: 0,
      //品类Data 以后可能使用VUx 读取看具体需求，当多处调用时存入VUX；
      CategoryOptions: [],
      //品牌
      brandOptions: [],
      //设计商
      designCompanyOptions: [],
      //table列表数据
      tableListData: []
    };
  },
  created() {
    this.getTableList();
  },

  methods: {
    //获取列表
    getTableList() {
      let filter = this.$common.deepCopy(this.filtersData);
      if(filter.createTimeLE != null){
        let date = new Date(filter.createTimeLE);
        let t = (date.getTime() / 1000 + 86399) * 1000;
        filter.createTimeLE = new Date(t);
      }
      this.request(
        this.api.collocation.collocationTagGroup_list,
       filter
      ).then(data => {
        //   console.log(data);
        let _data = data.data,
          _dataLen = _data.length;
        this.tableListData = _data;
        this.total = data.totalCount;
      });
      filter=null;
    },

    //搜索
    handleSearch() {
      let filter = this.filtersData;
      if (filter.tagsCountGE != null && filter.tagsCountLE != null) {
        if (filter.tagsCountGE > filter.tagsCountLE) {
          this.$message.error("包含标签数区间下限不能大于区间上限!");
          return;
        }
      }
      this.filtersData.pageIndex = 1;
      this.getTableList();
    },

    //清空重置
    handleResetFilters(formName) {
      this.$refs[formName].resetFields();
      this.filtersData.createTimeLE = "";
      this.filtersData.tagsCountLE = "";
    },
    //排序
    tableSortChange(obj) {
      //descending 倒序
      //ascending正序
      let _order =
        obj.order != null ? (obj.order == "ascending" ? "asc" : "desc") : null;
      this.filtersData.orderBy = obj.prop;
      this.filtersData.sortBy = _order;
      this.getTableList();
    },
    //滑块开关
    switchValid(params) {
      this.request(this.api.collocation.collocationTagGroup_save, params).then(
        res => {
          this.$message.success("保存成功！");
        }
      );
    },
    //新增标签分组
    openAdd() {
      this.$refs.groupRef.popupInit("add", "新增标签分组");
    },
    // 修改标签分组
    handleEditClick(_id) {
      this.$refs.groupRef.popupInit("edit", "修改标签分组", _id);
    },
    // 查看标签分组
    handleShowClick(_id) {
      this.$refs.groupRef.popupInit("show", "查看标签分组", _id);
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
    GroupDialog
  }
};
</script>

<style scoped lang="less">
</style>
