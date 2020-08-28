<!--
 * @Description: 品牌管理  与品牌商 不同！！！
 * @Author: elephant
 * @Date: 2019-07-01 15:20:22
 * @LastEditTime: 2020-02-25 14:50:49
 * @LastEditors: Please set LastEditors
 -->
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
        <el-form-item prop="cooperation" label="合作状态">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.cooperation">
            <el-option
              v-for="item in this.$common.cooperationOptions()"
              :key="item.status_id"
              :label="item.status_name"
              :value="item.status_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="searchWords" label="综合搜索：">
          <el-input class="input-w" placeholder="请输入内容" v-model="filtersData.searchWords"></el-input>
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
        <el-button-group>
          <el-button size="small" type="primary" @click="openAddAttrbute">新增品牌</el-button>
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
          <el-table-column prop="code" align="center" label="品牌编码" min-width="100"></el-table-column>
          <el-table-column prop="name" align="center" label="品牌名称" min-width="100"></el-table-column>
          <el-table-column prop="logo" align="center" label="品牌图标" min-width="100">
            <template slot-scope="scope">
              <img class="logo-wh" :src="scope.row.logo" />
            </template>
          </el-table-column>
          <el-table-column prop="type" align="center" label="品牌类型" min-width="100">
            <template slot-scope="scope">
              <p>{{scope.row.type | typeName}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="cooperation" align="center" label="合作状态" min-width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.cooperation"
                active-color="#13ce66"
                @change="switchValid(scope.row)"
                inactive-color="#9d9d9d"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间" min-width="100">
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
 * 基本管理
 */
export default {
  name: "brand_list",
  data() {
    return {
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        cooperation: true, //有效状态
        searchWords: "" //搜索关键字
      },
      tableListData: [],
      total: null,
      cateOptions: []
    };
  },
  filters: {
    typeName: val => {
      switch (val.toString()) {
        case "1":
          return "加盟";
          break;
        case "0":
          return "自营 ";
          break;
        default:
          return "未知 ";
          break;
      }
    }
  },
  created() {
    this.getTableList();
  },
  activated() {
    this.getTableList();
  },
  methods: {
    //获取列表
    getTableList() {
      this.request(this.api.product.productBrand_list, this.filtersData).then(
        data => {
          let _data = data.data,
            _dataLen = _data.length;
          this.tableListData = _data;
          this.total = data.totalCount;
        }
      );
    },
    //新增基本信息  跳转页面
    openAddAttrbute() {
      this.$router.push({
        path: "/product/supplier/add_brand",
        query: {
          type: "add"
        }
      });
    },
    //查看基本信息
    openShowDetails(id) {
      this.$router.push({
        path: "/product/supplier/show_brand",
        query: {
          id: id,
          type: "show"
        }
      });
    },
    //修改基本信息
    openEditDetails(id) {
      this.$router.push({
        path: "/product/supplier/edit_brand",
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
      this.request(this.api.product.productBrand_save, params).then(data => {});
    }
  }
};
</script>
<style lang="less" scoped>
</style>
