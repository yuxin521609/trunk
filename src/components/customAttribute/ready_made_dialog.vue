<template>
  <el-dialog
  v-if="readymadeDialogVisible"
    title="选择成衣测量项"
    :visible.sync="readymadeDialogVisible"
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
        <el-table-column prop="name" align="center" label="名称" min-width="100"></el-table-column>
        <el-table-column prop="fullCateName" align="center" label="分类" min-width="100"></el-table-column>
        <el-table-column prop="image" align="center" label="图片" min-width="120">
          <template slot-scope="scope">
            <img class="table-img-wh" :src="scope.row.image" alt>
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="text-center"
          class-name="text-center"
          align="center"
          label="操作"
          min-width="100"
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
 * // 成衣
 */
let selectedReadyMadeList=[];

let firstStatus=true;
export default {
  name: "tp-readymade-dialog",
  data() {
    return {
      filtersData: {
        pageIndex: 1,
        pageSize: 10,
        searchWords:'',
        categoriesIds:[],
        valid:true
      },
      readymadeDialogVisible: false,
      tableListData: [],
      total: 0,
      logType:'',
    };
  },
  created () {
    this.init();
    firstStatus=true;
  },
  methods: {
    init(){
      this.filtersData = {
         pageIndex: 1,
        pageSize: 10,
        searchWords:'',
        categoriesIds:[],
        valid:true
      };
      this.tableListData = [];
      this.logType = "";
      selectedReadyMadeList = [];
    },
    getTableList() {
      this.request(this.api.user.crm_measurement_list, this.filtersData).then(
        data => {
          let _data = data.data,
            _dataLen = _data.length;
          //全部勾选false
          for (let i = 0; i < _dataLen; i++) {
            _data[i]._checkbox = false;
            _data[i].measurementId=_data[i].id;
            _data[i].id=null;
          }
             //获取数据后 从已有列表中找出已勾选分类
        //循环 改变勾选状态
        let listData = selectedReadyMadeList;
        //找到已有的 改成true
        if (listData.length >= 0) {
          for (let k = 0; k < listData.length; k++) {
            for (let j = 0; j < _dataLen; j++) {
              if (listData[k].measurementId == _data[j].measurementId) {
                _data[j]._checkbox = true;
              }
            }
          }
        }
          this.tableListData = _data;
          this.total = data.totalCount;
        }
      );
    },
     selectedArr() {
      if ( this.tableListData.length <= 0) {
        return;
      }
      for (let i = 0; i < this.tableListData.length; i++) {
          this.tableListData[i]._checkbox = false;
      }
      let listData = selectedReadyMadeList;
      for (let k = 0; k < listData.length; k++) {
        for (let j = 0; j < this.tableListData.length; j++) {
          if (listData[k].measurementId == this.tableListData[j].measurementId) {
            this.tableListData[j]._checkbox = true;
          }
        }
      }
    },
    popupInit(_cateId,dialogType,parentList) {
        this.logType=dialogType;
        selectedReadyMadeList=parentList;
        this.selectedArr();
      if(firstStatus){
        firstStatus=false;
        this.filtersData.categoriesIds=[_cateId];
        this.getTableList();
      }
      this.readymadeDialogVisible = true;
    },
    //单选发生改变
    tableChangeCheckbox(elem, row) {
      let index = selectedReadyMadeList.findIndex(item => item.measurementId == row.measurementId);
      if (elem) {
        //新增
        if (index == -1) {
          selectedReadyMadeList.push(row);
        }
      } else {
        //删除
        if (index != -1) {
          selectedReadyMadeList.splice(index, 1);
        }
      }
     // console.log(listData);
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
    //新增
    submitForm() {
      this.$emit("setParentReadyMadeData", [...selectedReadyMadeList]);
      this.closeDialog();
    },
    //关闭
    closeDialog() {
      this.readymadeDialogVisible = false;
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
