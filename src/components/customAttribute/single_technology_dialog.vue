<template>
  <el-dialog
   v-if="technologyDialogVisible"
    title="选择工艺"
    :visible.sync="technologyDialogVisible"
    class="alarmPopup"
    width="1000px"
    append-to-body
  >
    <div class="dialog-search">
      <el-form
        class="item-form"
        :model="filtersData"
        label-width="90px"
        size="small"
        ref="filtersForm"
        inline
      >
        <el-form-item prop="materialCateIdentifier" label="分类：">
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
          <el-input class="input-w" placeholder="请输入内容" v-model="filtersData.searchWords"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" type="primary" plain>搜索</el-button>
          <el-button @click="handleResetFilters('filtersForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="tableListData"
        stripe
        empty-text="暂无数据"
        header-align="center"
        header-row-class-name="item-table-header"
        :highlight-current-row="true"
        height="400"
      >
        <el-table-column prop="code" align="center" label="标准编码" min-width="100"></el-table-column>
        <el-table-column prop="materialCateName" align="center" label="分类" min-width="100"></el-table-column>
        <el-table-column prop="name" align="center" label="原料名称" min-width="100"></el-table-column>
        <el-table-column prop="image" align="center" label="图片" min-width="120">
          <template slot-scope="scope">
            <img class="table-img-wh" :src="scope.row.image" alt>
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" align="center" label="销售价格" min-width="100"></el-table-column>
        <el-table-column
          fixed="right"
          label-class-name="text-center"
          class-name="text-center"
          align="center"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-checkbox
              @change="tableChangeCheckbox($event,scope.row)"
              v-model="scope.row._checkbox"
            ></el-checkbox>
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
    <div class="item-right">
      <el-button size="small" @click="closeDialog">取消</el-button>
      <el-button size="small" @click="submitForm()" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
/**
 * 原料子组件已选列表并向前端返回
 * // 单品定制接口要换 /manufacturerProductionMaterial/list
 */
let selectedTechnologyList = [];
let parentProductGoodses = [];
let parentProductGoodsesIds=[];
let firstStatus = true;
export default {
  name: "tp-technology-dialog",
  data() {
    return {
      filtersData: {
        type: 1, //原料类型（1：工艺，2：原料）
        pageIndex: 1,
        pageSize: 10,
        searchWords: "",
        cateIdentifier: "",
        valid: true
      },
      technologyDialogVisible: false,
      tableListData: [],
      total: 0,
      classData: [],
      classList: [],
      cateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      logType: ""
    };
  },
  created() {
    console.log(1);
    this.init();

    firstStatus = true;
  },
  mounted() {
    this.getClassData();
  },
  methods: {
    init(){
      this.filtersData = {
        type: 1, //原料类型（1：工艺，2：原料）
        pageIndex: 1,
        pageSize: 10,
        searchWords: "",
        cateIdentifier: "",
        valid: true
      };
      this.tableListData = [];
      this.logType = "";
      this.cateArr = [];
      selectedTechnologyList = [];
      parentProductGoodses = [];
      parentProductGoodsesIds=[];
    },
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
    popupInit(identifier, dialogType, parentList, productGoodses) {
       selectedTechnologyList = [];
 parentProductGoodses = [];
 parentProductGoodsesIds=[];
      this.logType = dialogType;
      selectedTechnologyList = parentList;
      if (this.logType == "edit") {
        parentProductGoodses = [...productGoodses];
      }
      this.selectedArr();
      if (firstStatus) {
        firstStatus = false;
        this.filtersData.cateIdentifier = identifier;
        this.getTableList();
      }
      this.technologyDialogVisible = true;
    },
    getTableList() {
      this.request(
        this.api.product.manufacturerProductionMaterial_list,
        this.filtersData
      ).then(data => {
        let _data = data.data,
          _dataLen = _data.length;
        //全部勾选false
        for (let i = 0; i < _dataLen; i++) {
          _data[i]._checkbox = false;
          _data[i].usageAmount = 1;
          _data[i].id = null;
        }
        //获取数据后 从已有列表中找出已勾选分类
        //循环 改变勾选状态
        let listData = selectedTechnologyList;
        //找到已有的 改成true
        if (listData.length >= 0) {
          for (let k = 0; k < listData.length; k++) {
            for (let j = 0; j < _dataLen; j++) {
              if (listData[k].materialId == _data[j].materialId) {
                _data[j]._checkbox = true;
              }
            }
          }
        }
        this.tableListData = _data;
        this.total = data.totalCount;
      });
    },
    //改变状态  先弃用 父组件传入数据触发
    selectedArr() {
      if (this.tableListData.length <= 0) {
        return;
      }
      for (let i = 0; i < this.tableListData.length; i++) {
        this.tableListData[i]._checkbox = false;
      }
      let listData = selectedTechnologyList;
      for (let k = 0; k < listData.length; k++) {
        for (let j = 0; j < this.tableListData.length; j++) {
          if (listData[k].materialId == this.tableListData[j].materialId) {
            this.tableListData[j]._checkbox = true;
          }
        }
      }
    },
    /**
     * 单选发生改变
     * 当单选发生改变时 把新增的勾选 放入数组中
     *
     */
    tableChangeCheckbox(elem, row) {
      let index = selectedTechnologyList.findIndex(
        item => item.materialId == row.materialId
      );
      if (elem) {
        //新增
        if (index == -1) {
          selectedTechnologyList.push(row);
        }
      } else {
        //删除
        if (this.logType == "edit") {
          let names = [];
          let productGoodses = parentProductGoodses;
          for (let i = 0; i < productGoodses.length; i++) {
            let materials = productGoodses[i].productGoodsMaterials;
            for (let k = 0; k < materials.length; k++) {
              if (materials[k].materialId == row.materialId) {
                names.push(productGoodses[i].name);
                break;
              }
            }
          }
          if (names.length > 0) {
            let strName = names.join("/");
            this.$confirm(`sku${strName}已使用到该项，是否确认删除!`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                parentProductGoodsesIds.push(row.materialId);
                this.removeList(index);
              })
              .catch(() => {
                row._checkbox = true;
              });
          } else {
            this.removeList(index);
          }
        } else {
          this.removeList(index);
        }
      }
    },
    removeList(_index) {
      if (_index != -1) {
        selectedTechnologyList.splice(_index, 1);
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
    },
    /**
     * 修改保存
     * 数据新增 或者删除
     * 向父组件传入数据
     */
    submitForm() {
      this.$emit("setParentTechnologyData", [...selectedTechnologyList],parentProductGoodsesIds);
      this.closeDialog();
    },
    //关闭
    closeDialog() {
      this.technologyDialogVisible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.dialog-search {
  border-bottom: 1px solid #eeeeee;
  .item-form {
    padding: 0;
  }
}
</style>
