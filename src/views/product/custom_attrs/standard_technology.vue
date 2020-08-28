<template>
  <!-- 工艺 -->
  <div>
    <div class="item-margin">
      <el-form inline class="item-form" :model="filtersData" size="small" ref="filtersForm">
        <el-form-item prop="valid" label="使用状态：">
        <el-select  class="input-w" placeholder="请选择" v-model="filtersData.valid">
            <el-option
              v-for="item in this.$common.getValidOptions()"
              :key="item.status_id"
              :label="item.status_name"
              :value="item.status_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="materialCateIdentifier"  label="分类选择：">
          <el-cascader
          class="input-w"
            :options="classData"
             v-model="cateArr"
             :value="cateArr"
             @change="cascaderGet"
             :show-all-levels="false"
             :props="props"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="searchWords" label="综合搜索：">
          <el-input v-model="filtersData.searchWords" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small"  @click="handleSearch"  type="primary" plain>搜索</el-button>
          <el-button size="small" @click="handleResetFilters('filtersForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- table -->
    <div class="item-margin">
      <div class="item-cont">
        <el-button size="small" type="primary" @click="addTechnology">新增工艺</el-button>
      </div>
      <!-- table订单 -->
      <div class="item-table">
        <el-table
         :data="tableListData"
        stripe
        empty-text="暂无数据"
        header-align="center"
        header-row-class-name="item-table-header"
        :highlight-current-row="true"
        >
          <el-table-column label="创建时间" prop="createTime" align="center" min-width="100">
            <template slot-scope="scope">
              <p>{{scope.row.createTime | timestampToTime}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="标准编码" align="center"></el-table-column>
          <el-table-column prop="materialFullCateName" label="属性分类" align="center"></el-table-column>
          <el-table-column prop="name" label="工艺名称" align="center"></el-table-column>
          <el-table-column prop="unitPrice" label="销售价格" align="center"></el-table-column>
          <el-table-column prop="image" label="工艺图片" align="center">
            <template slot-scope="scope">
              <img class="table-img-wh"  :src="scope.row.image" >
            </template>
          </el-table-column>
          <el-table-column prop="valid" label="使用状态" align="center">
            <template slot-scope="scope">
              <el-switch
                @change="switchValid(scope.row)"
                v-model="scope.row.valid"
                active-color="#13ce66"
                inactive-color="#ff4949"
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
              <el-button size="small" @click="openShowDetails(scope.row)" type="text">查看</el-button>
              <el-button size="small" @click="openEditDetails(scope.row)" type="text">编辑</el-button>
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
</template>

<script>
export default {
  name:'standard_technology',
  data() {
    return {
      filtersData: {
        valid: null,
        type: 1, //原料类型（1：工艺，2：原料）
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        searchWords: ""
      },
      //表格数据
      tableListData: [],
      total:0,
       classData: [],
      classList: [],
      cateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      }
    };
  },
  created () {
    this.getTableList();
    this.getClassData();
  },
  activated () {
    this.getTableList();
  },
  methods: {
    getClassData() {
      //分类类型（1：标准分类，2：定制分类，3：原料分类或者称为属性分类）
      this.$common.getClassSelect(this, 3).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
    },
    cascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      this.filtersData.materialCateIdentifier = obj.identifier;
    },
     //获取列表
    getTableList() {
      this.request(
        this.api.product.productionMaterial_list,
        this.filtersData
      ).then(data => {
        let _data = data.data,
          _dataLen = _data.length;
        this.tableListData = _data;
        this.total = data.totalCount;
      });
    },
    //新增基本信息  跳转页面
    addTechnology(){
       this.$router.push({
        path: '/product/custom_attrs/add_technology',
        name: 'add_technology',
        query: {
          _type:'add'
          }
      })
    },
     //查看基本信息
    openShowDetails(params) {
      this.$router.push({
        path: "/product/custom_attrs/show_technology",
        name: "show_technology",
        query: {
          _id: params.id,
          _type: "show"
        }
      });
    },
    //修改基本信息
    openEditDetails(params) {
      this.$router.push({
        path: "/product/custom_attrs/edit_technology",
        name: "edit_technology",
        query: {
          _id: params.id,
          _type: "edit"
        }
      });
    },
    //滑块开关
    switchValid(params) {
      this.request(this.api.product.productionMaterial_save, params);
    },
     //搜索
    handleSearch() {
      this.filtersData.pageIndex = 1;
      this.getTableList();
    },
    //重置表单数据
    handleResetFilters(formName) {
      this.$refs[formName].resetFields();
      this.cateArr = [];
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
  }
};
</script>

<style lang="less" scoped>
.btn {
  width: 100%;
  text-align: right;
  margin-top: 15px;
  margin-right: 20px;
}
.main-top {
  // background-color: aqua;
  color: #222;
  display: inline-block;
  margin-left: -15px;
  width: 300px;
  line-height: 70px;
}
h3 {
  margin-top: 0;
  margin-bottom: 15px;
}
.el-form {
  padding-top: 15px;
}
.middle-from {
  background-color: #fff;
  margin-bottom: 10px;
  padding-left: 70px;
}
.table {
  padding-top: 20px;
  background-color: #fff;
  .add-btn {
    // display: inline-block;
    margin-left: 70px;
  }
}
.upload-demo {
  float: left;
  margin-right: 10px;
}
.circleProgress {
  text-align: center;
}
</style>


