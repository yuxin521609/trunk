<template>
  <el-dialog
    v-if="materialDialogVisible"
    title="选择原料"
    :visible.sync="materialDialogVisible"
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
 * middleware
 * 注意 禁止传入父组件向子组件传入全部数据
 * 只可以子组件向父组件传入全部数据
 *
 * 此页面多处公用 （供应商支持管理详情、定制单品管理详情）
 * 原料详情数据
 *
 * 因需求变动 注意已下几项
 * 1、因牵扯新增 回显等复杂逻辑，要禁止数据双向驱动，做数据深复制；
 * 2、要保持在确定的时候给父页面传递数据，改变父级数据；
 * 3、当页面弹出时 点击取消不进行数据还原；
 * 4、当父页面数据删除时 改变子数据勾选状态；
 * 5、最好做数据拆分 父传子数据 只穿IDs 数组 ；
 * 6、子传父 根据是新增还是修改 传入不同的数据
 * 7、子向父传递数据时 父数据做循环判别
 * 8、父组件回显时  子组件只拿一次付后台返回传入的数据
 * 其他数据操作 通过抽象函数 处理
 *
 */
/**
 * 父组件list 触发删除操作  父组件传入删除的ID
 * 根据ID 改变状态
 */
/**
 * 父组件回显会发生数据联动
 * 父组件传入 IDs
 * 需有个存父组件ID的数组
 * 跟本地数组合并
 *
 */
/**
 * 原料子组件已选列表并向前端返回
 */
let selectedMaterialList = [];
let parentProductGoodses = [];
let parentProductGoodsesIds = [];
let firstStatus = true;
export default {
  name: "tp-material-dialog",
  //接收最好 是ids
  data() {
    return {
      filtersData: {
        type: 2, //原料类型（1：工艺，2：原料）
        pageIndex: 1,
        pageSize: 10,
        searchWords: "",
        cateIdentifier: "",
        valid: true
      },
      materialDialogVisible: false,
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
    firstStatus = true;
    this.init();
  },
  mounted() {
    this.getClassData();
  },
  methods: {
    init() {
      this.filtersData = {
        type: 2, //原料类型（1：工艺，2：原料）
        pageIndex: 1,
        pageSize: 10,
        searchWords: "",
        cateIdentifier: "",
        valid: true
      };
      this.tableListData = [];
      this.logType = "";
      this.cateArr = [];
      selectedMaterialList = [];
      parentProductGoodses = [];
      parentProductGoodsesIds = [];
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
      selectedMaterialList = [];
      parentProductGoodses = [];
      parentProductGoodsesIds = [];
      this.logType = dialogType;
      selectedMaterialList = parentList;
      if (this.logType == "edit") {
        parentProductGoodses = productGoodses;
      }
      this.selectedArr();
      //第一次进入走接口
      if (firstStatus) {
        firstStatus = false;
        this.filtersData.cateIdentifier = identifier;
        this.getTableList();
      }
      this.materialDialogVisible = true;
    },
    //获取列表
    getTableList() {
      this.request(
        this.api.product.manufacturerProductionMaterial_list,
        this.filtersData
      ).then(data => {
        let _data = data.data,
          _dataLen = _data.length;
        //全部勾选false 把ID值为空
        for (let i = 0; i < _dataLen; i++) {
          _data[i]._checkbox = false;
          _data[i].usageAmount = 1;
          _data[i].id = null;
        }
        //获取数据后 从已有列表中找出已勾选分类
        //循环 改变勾选状态
        let listData = selectedMaterialList;
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
        //列表数据
        this.tableListData = _data;
        this.total = data.totalCount;
      });
    },
    //改变状态
    selectedArr() {
      if (this.tableListData.length <= 0) {
        return;
      }
      for (let i = 0; i < this.tableListData.length; i++) {
        this.tableListData[i]._checkbox = false;
      }
      let listData = selectedMaterialList;
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
      let index = selectedMaterialList.findIndex(
        item => item.materialId == row.materialId
      );
      if (elem) {
        //新增
        if (index == -1) {
          selectedMaterialList.push(row);
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
        selectedMaterialList.splice(_index, 1);
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
      this.$emit(
        "setParentMaterialData",
        [...selectedMaterialList],
        parentProductGoodsesIds
      );
      this.closeDialog();
    },
    //关闭
    closeDialog() {
      this.materialDialogVisible = false;
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
