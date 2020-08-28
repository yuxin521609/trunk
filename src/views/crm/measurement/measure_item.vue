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
        @keyup.13.native="getTableList"
      >
        <el-form-item prop="type" label="测量类型：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.type">
            <el-option
              v-for="item in typeOptions"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类：">
          <el-cascader-multi
            v-model="filtersData.categoriesIds"
            :value="classCont"
            separator="/"
            value-key="id"
            label-key="name"
            :data="classData"
            :only-last="true"
            :clearable="true"
            :is-two-dimension-value="false"
          ></el-cascader-multi>
        </el-form-item>
        <el-form-item prop="filter" label="综合搜索：">
          <el-input class="input-w" placeholder="模糊查询测量项" v-model="filtersData.filter"></el-input>
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
        <el-button size="small" type="primary" @click="openAdd">新增测量项</el-button>
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
          <el-table-column prop="type" align="center" label="测量类型" min-width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.type | typeName }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="categoriesNames" align="center" label="商品分类" min-width="130"></el-table-column>
          <el-table-column prop="name" align="center" label="测量项" min-width="100"></el-table-column>
          <el-table-column prop="image" align="center" label="图片" min-width="100">
            <template slot-scope="scope">
              <img class="logo-wh" :src="scope.row.image">
            </template>
          </el-table-column>
          <el-table-column prop="description" align="center" label="备注" min-width="100"></el-table-column>
          <el-table-column prop="used" align="center" label="使用状态" min-width="100">
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
            width="150"
          >
            <template slot-scope="scope">
              <el-button @click="openShowDetails(scope.row.id)" type="text" size="small">查看</el-button>
              <el-button @click="openEditDetails(scope.row.id)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-10 mb-20">
          <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersData.pageIndex"
            :page-sizes="[10, 20, 30,40,50]"
            :page-size="filtersData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!--table END  -->
  </div>
</template>
<script>
/**
 * 客户列表
 */
export default {
  name:'measure_item',
  data() {
    return {
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        categoriesIds: [],
        type: null,
        filter: "" //m模糊查询
      },
      classData: [],
      classList: [],
      classCont: [],
      tableListData: [],
      total: null,
      cateOptions: [],
      typeOptions: [
        {
          type: 1,
          name: "净体测量"
        },
        {
          type: 2,
          name: "成衣测量"
        }
      ]
    };
  },
  filters: {
    typeName(val) {
      let _val = Number(val);
      switch (_val) {
        case 1:
          return "净体测量";
          break;
        case 2:
          return "成衣测量";
          break;
        default:
          return "未知";
          break;
      }
    }
  },
  created() {
    this.getTableList();
    this.getClassData();
  },
  activated () {
    this.getTableList();
  },
  methods: {
    getClassData() {
      this.$common.getClassSelect(this, 1).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
    },
    //获取列表
    getTableList() {
      this.request(this.api.user.crm_measurement_list, this.filtersData).then(
        data => {
          let _data = data.data,
            _dataLen = _data.length;
          this.tableListData = _data;
          this.total = data.totalCount;
        }
      );
    },
    openAdd() {
      this.$router.push({
        path: "/crm/measurement/add_measure",
        name: "add_measure",
        query: {
          type: "add"
        }
      });
    },
    //查看基本信息
    openShowDetails(id) {
      this.$router.push({
        path: "/crm/measurement/show_measure",
        name: "show_measure",
        query: {
          id: id,
          type: "show"
        }
      });
    },
    //修改基本信息
    openEditDetails(id) {
      this.$router.push({
        path: "/crm/measurement/edit_measure",
        name: "edit_measure",
        query: {
          id: id,
          type: "edit"
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
      this.filtersData.categoriesIds = [];
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
      this.request(this.api.user.crm_measurement_updateSelective, {
        id: params.id,
        used: params.used
      }).then(data => {});
    }
  }
};
</script>
<style lang="less" scoped>
</style>
