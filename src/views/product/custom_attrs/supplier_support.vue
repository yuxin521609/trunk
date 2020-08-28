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
              v-for="item in this.$common.getValidOptions()"
              :key="item.status_id"
              :label="item.status_name"
              :value="item.status_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 商品分类 -->
        <el-form-item prop="cateIdentifier" label="分类选择：">
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
        <el-form-item prop="manufacturerId" label="制造商名称：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.manufacturerId">
            <el-option
              v-for="item in manufacturerOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
          <el-button size="small" type="primary" @click="openAddSupport">新增制造商支持</el-button>
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
          <el-table-column align="center" width="50">
            <template slot-scope="scope">
              <i
                @click="childrenIsShow(scope.row)"
                v-if="scope.row.isShow"
                :class="scope.row.isType == 1 ?'el-icon-circle-plus-outline i-cursor' : 'el-icon-remove-outline i-cursor'"
              ></i>
            </template>
          </el-table-column>
          <el-table-column prop="manufacturerName" align="center" label="制造商名称" min-width="100"></el-table-column>
          <el-table-column prop="_fullCateName" align="center" label="支持品类" min-width="100"></el-table-column>
          <el-table-column prop="materialCount" align="center" label="相关原料" min-width="100"></el-table-column>
          <el-table-column prop="craftCount" align="center" label="相关工艺" min-width="100"></el-table-column>
          <el-table-column prop="measurementCount" align="center" label="成衣测量项" min-width="100"></el-table-column>
          <el-table-column prop="valid" align="center" label="使用状态" min-width="120">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.valid"
                v-if="!scope.row.isShow"
                active-color="#13ce66"
                @change="switchValid(scope.row)"
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
              <el-button
                @click="openShowDetails(scope.row.id)"
                v-if="!scope.row.isShow"
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                @click="openEditDetails(scope.row.id)"
                v-if="!scope.row.isShow"
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
/** 制造商支持管理 */
export default {
  name:'supplier_support',
  data() {
    return {
      filtersData: {
        manufacturerId: "",
        cateIdentifier: "",
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        valid: null, //有效状态
        searchWords: "" //搜索关键字
      },
      tableListData: [],
      total: null,
      classData: [],
      classList: [],
      cateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      manufacturerOptions: []
    };
  },
  created() {
    this.getTableList();
    this.getClassData();
    this.getManufacturerData();
  },
   activated () {
      this.getTableList();
    },
  methods: {
    getClassData() {
      //分类类型（1：标准分类，2：定制分类，3：原料分类或者称为属性分类）
      this.$common.getClassSelect(this, 1).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
    },
    cascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      this.filtersData.cateIdentifier = obj.identifier;
    },
    //制造商
    getManufacturerData() {
      this.request(this.api.product.manufacturer_list, {}).then(data => {
        this.manufacturerOptions = data.data;
      });
    },
    //获取列表
    getTableList() {
      this.request(
        this.api.product.manufacturerProductionInformation_list,
        this.filtersData
      ).then(data => {
        let _data = data.data,
          _dataLen = _data.length;
        for (let i = 0; i < _dataLen; i++) {
          _data[i].isShow = true;
          _data[i].isType = 1;
          _data[i]._cid = "";
        }
        this.tableListData = _data;
        this.total = data.totalCount;
      });
    },
    //新增支持  跳转页面
    openAddSupport() {
      this.$router.push({
        path: "/product/custom_attrs/add_support",
        name: "add_support",
        query: {
          type: "add"
        }
      });
    },
    //查看支持
    openShowDetails(params) {
      this.$router.push({
        path: "/product/custom_attrs/show_support_details'",
        name: "show_support_details",
        query: {
          id: params,
          _type: "show"
        }
      });
    },
    //修改支持
    openEditDetails(params) {
      this.$router.push({
        path: "/product/custom_attrs/edit_support_details",
        name: "edit_support_details",
        query: {
          id: params,
          _type: "edit"
        }
      });
    },
    //点击获取子元素插入数组
    childrenIsShow(row) {
      let _id = row.manufacturerId; //当前数据ID
      let _type = row.isType; //状态 1 关闭 0 打开
      if (_type == "1") {
        //当前为关闭状态 需请求接口获取子元素
        row.isType = 0;
        this.getChildData(row, _id);
      } else {
        //当前为打开状态 需删除子元素
        row.isType = 1;
        this.removeChildData(row);
      }
    },
    //获取子集
    getChildData(row, _id) {
      let _index = this.tableListData.findIndex(
        item => item.manufacturerId == _id
      );
      if (!row._chilren) {
        this.request(
          this.api.product.manufacturerProductionInformation_listForCateCount,
          { manufacturerId: _id,id:row.id, cateId:row.cateId}
        ).then(res => {
          let _data = res;
          let _dataLen = _data.length;
          for (let i = 0; i < _dataLen; i++) {
            _data[i]._fullCateName = _data[i].fullCateName;
            _data[i]._subset = true;
          }
          row._chilren = _data;
          //根据下标插入进去 获取ID 在数组中的下标
          this.tableListData.splice(_index + 1, 0, ..._data);
          //获取子集id存入 元素属性
          let arr = [];
          for (let { id } of _data) {
            arr.push(id);
          }
          row._cid = arr.join();
        });
      } else {
        this.tableListData.splice(_index + 1, 0, ...row._chilren);
      }
    },
    //删除子集
    removeChildData(row) {
      let cid = row._cid;
      let cidArr = cid.split(",");
      let _table = this.tableListData,
        tableLen = _table.length;
      for (let i = 0; i < cidArr.length; i++) {
        for (let j = 0; j < this.tableListData.length; j++) {
          if (
            cidArr[i] == this.tableListData[j].id &&
            this.tableListData[j]._subset
          ) {
            this.tableListData.splice(j, 1);
          }
        }
      }
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
      this.request(
        this.api.product.manufacturerProductionInformation_save,
        params
      ).then(data => {
        this.$message.success("保存成功");
      });
    }
  }
};
</script>
<style lang="less" scoped>
</style>
