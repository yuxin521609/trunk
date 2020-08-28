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
        <el-form-item prop="valid" label="使用状态：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.valid">
            <el-option
              v-for="item in this.$common.getValidOptions()"
              :key="item.status_id"
              :label="item.status_name"
              :value="item.status_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop label="已选分类："></el-form-item>
        <el-form-item prop="brandId" label="创建时间：">
          <el-col :span="11">
            <el-date-picker
              class="input-w"
              v-model="filtersData.name"
              type="date"
              placeholder="请选择区间下限"
            ></el-date-picker>
          </el-col>
          <el-col :span="1">&nbsp;&nbsp;</el-col>
          <el-col :span="11">
            <el-date-picker
              class="input-w"
              v-model="filtersData.name"
              type="date"
              placeholder="请选择区间上限"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item prop="stockGE" label="点击次数：">
          <el-col :span="11">
            <el-input class="input-w" placeholder="请输入区间下限" v-model="filtersData.stockGE"></el-input>
          </el-col>
          <el-col :span="1">&nbsp;&nbsp;</el-col>
          <el-col :span="11">
            <el-input class="input-w" placeholder="请输入区间上限" v-model="filtersData.stockLE"></el-input>
          </el-col>
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
        <el-button size="small" type="primary" @click="openAddCommodity">新增模板</el-button>
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
          <el-table-column prop="code" align="center" label="模板编码" min-width="100"></el-table-column>
          <el-table-column prop="code" align="center" label="模板名称" min-width="100"> </el-table-column>
          <el-table-column prop="subCode" align="center" label="模板图片" min-width="100">
            <template slot-scope="scope">
              <img class="table-img-wh"  :src="scope.row.image" >
            </template>
          </el-table-column>
          <el-table-column prop="color" align="center" label="已选分类" min-width="100">
            <template slot-scope="scope">
              <p v-html="scope.row.p"></p>
            </template>
          </el-table-column>
          <el-table-column prop="brandName" align="center" label="点击次数" min-width="80"></el-table-column>
          <el-table-column prop="valid" align="center" label="使用状态" min-width="110">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.valid"
                v-if="scope.row.isShow"
                active-color="#13ce66"
                @change="switchValid(scope.row)"
                inactive-color="#9d9d9d"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="color" align="center" label="创建人" min-width="100"></el-table-column>
          <el-table-column prop="brandName" align="center" label="创建时间" min-width="80"></el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <!-- <el-button
                @click="openShowDetails(scope.row)"
                v-if="scope.row.isShow"
                type="text"
                size="small"
              >查看</el-button> -->
              <el-button
                @click="openEditDetails(scope.row)"
                v-if="scope.row.isShow"
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      filtersData: {
        brandId: "", //品牌ID
        cateIdentifier: "", // 分类标识码
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        stockGE: null, //最小库存
        stockLE: null, //最大库存
        searchWords: "", //检索关键字
        designCompanyId: "", //设计商Id
        // ownerId: "", //平台租户（所属机构）ID ,
        valid: null //有效状态
      },
      classData: [],
      classList: [],
      cateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      //商品有效状态
      product: [
        {
          status_id: true,
          status_name: "上架"
        },
        {
          status_id: false,
          status_name: "下架"
        }
      ],
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
  computed: {},
  methods: {
    cascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      this.filtersData.cateIdentifier = obj.identifier;
    },
    //获取列表
    getTableList() {
      //   this.request(this.api.product., this.filtersData).then(data => {
      //     console.log(data);
      //     let _data=data.data,_dataLen=_data.length;
      //     this.tableListData=_data;
      //     this.total=data.totalCount;
      // });
    },
    //设计商
    getDesignCompanyOptions() {
      this.request(this.api.product.designCompany_list, {}).then(data => {
        //  console.log(data);
        this.designCompanyOptions = data.data;
      });
    }, //品牌
    getBrandOptions() {
      this.request(this.api.product.productBrand_list, {}).then(data => {
        //console.log(data.data);
        let _data = data.data;
        this.brandOptions = _data;
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
      this.cateArr = [];
      this.filtersData.stockLE = "";
    },
    //滑块开关
    switchValid(params) {
      // this.request(this.api.product., params);
    },
    //新增
    openAddCommodity() {
      this.$router.push({
        path: "/collocation/template/add_template",
        name: "collocation_add_template",
        query: {
          _type: "add"
        }
      });
    },
    //查看
    openShowDetails(params) {
      this.$router.push({
        path: "/",
        name: "",
        query: {
          productId: params.id,
          cateId: params.cateId,
          _type: "show"
        }
      });
    },
    //修改
    openEditDetails(params) {
      this.$router.push({
        path: "/",
        name: "",
        query: {
          productId: params.id,
          cateId: params.cateId,
          _type: "edit"
        }
      });
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

<style scoped lang="less">
</style>
