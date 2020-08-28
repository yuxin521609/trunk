<template>
  <el-dialog
    v-if="seriesDialogVisible"
    title="选择SKU"
    :visible.sync="seriesDialogVisible"
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
          <el-input class="input-w" disabled  v-model="cateName"></el-input>
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
        <el-table-column align="center" width="50">
          <template slot-scope="scope">
            <i
              @click="childrenIsShow(scope.row)"
              v-if="scope.row.isShow"
              :class="scope.row.isType == 1 ?'el-icon-circle-plus-outline i-cursor' : 'el-icon-remove-outline i-cursor'"
            ></i>
          </template>
        </el-table-column>
        <el-table-column prop="cateName" align="center" label="商品分类" min-width="100"></el-table-column>
        <el-table-column prop="name" align="center" label="名称" min-width="100"></el-table-column>
        <el-table-column prop="image" align="center" label="图片" min-width="100">
            <template slot-scope="scope">
                  <img class="table-img-wh" :src="scope.row.image" alt>
                </template>
        </el-table-column>
        <el-table-column prop="price" align="center" label="价格" min-width="100"></el-table-column>
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
              v-if="!scope.row.isShow"
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
/** 已选数据 */
let selectedSeriesList=[];
export default {
  name: "tp-series-dialog",
  data() {
    return {
      filtersData: {
        pageIndex: 1,
        pageSize: 10,
        cateIdentifier:"",
        searchWords: "",
        valid: true
      },
      seriesDialogVisible: false,
      tableListData: [],
      total: 0,
      logType: "",
      cateName:"",
      parentDataIndex:0,
    };
  },
  created() {
    this.init();

  },
  methods: {
    init(){
      this.filtersData= {
        pageIndex: 1,
        pageSize: 10,
        cateIdentifier:"",
        searchWords: "",
        valid: true
      }
      this.tableListData=[];
      this.parentDataIndex=0;
      this.cateName='';
      this.logType='';
      selectedSeriesList=[];
    },
    popupInit(_item, _index,dialogType) {
      this.parentDataIndex=_index;
      this.logType = dialogType;
      this.filtersData.cateIdentifier =_item.cateIdentifier;
      this.cateName=_item.cateName;
      selectedSeriesList=_item.customizedSetProductGoodses;
      this.getTableList();
      this.seriesDialogVisible = true;
    },
    getTableList() {
      this.request(
        this.api.product.customizedProduct_list,
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
    //改变状态  先弃用 父组件传入数据触发
    selectedArr() {
      if (this.tableListData.length <= 0) {
        return;
      }
      for (let i = 0; i < this.tableListData.length; i++) {
        this.tableListData[i]._checkbox = false;
      }
      let listData = selectedSeriesList;
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
      let index = selectedSeriesList.findIndex(
        item => item.customizedProductGoodsId  == row.customizedProductGoodsId
      );
      if (elem) {
        if(selectedSeriesList.length >= 9){
          this.$message.error('已超过最大选择数量9')
          row._checkbox = false;
          return false
        }
        //新增
        if (index == -1) {
          selectedSeriesList.push(row);
        }
      } else {
        //删除
        this.removeList(index);
      }
    },
    removeList(_index) {
      if (_index != -1) {
        selectedSeriesList.splice(_index, 1);
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
    /**
     * 修改保存
     * 数据新增 或者删除
     * 向父组件传入数据
     */
    submitForm() {
      let selectedSerie= this.$common.deepCopy(selectedSeriesList);
      let setParaentData=[];
      for (let i = 0; i < selectedSerie.length; i++) {
        setParaentData.push({
          customizedProductGoodsId:selectedSerie[i].customizedProductGoodsId,
          customizedProductGoodsName:selectedSerie[i].customizedProductGoodsName,
          customizedProductId:selectedSerie[i].productId,
          customizedProductName:selectedSerie[i].productName,
          cateId:selectedSerie[i].cateId,
          defaultStatus:selectedSerie[i].defaultStatus == true?selectedSerie[i].defaultStatus:false,
          price:selectedSerie[i].price,
          image:selectedSerie[i].image
        })
      }
      this.$emit(
        "setParentSeriesData",
        this.$common.deepCopy(setParaentData),
         this.parentDataIndex
      );
     this.closeDialog();
    },
    //点击获取子元素插入数组
    childrenIsShow(row) {
      let _id = row.id; //当前数据ID
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
        item => item.id == _id
      );
      if (!row._chilren) {
        this.request(
          this.api.product.customizedSetProductGoods_list,
          {productId:row.id,valid: true}
        ).then(res => {
            console.log(res);
          let _data = res.data;
          let _dataLen =_data.length;
                //全部勾选false
          for (let i = 0; i < _dataLen; i++) {
            // _data[i]._subset = true;
            _data[i]._checkbox = false;
            _data[i].customizedProductGoodsId= _data[i].id;
            _data[i].customizedProductGoodsName= _data[i].name;
            _data[i].defaultStatus=false;
            _data[i].id=null;
          }
            //获取数据后 从已有列表中找出已勾选分类
            //循环 改变勾选状态
            let listData = selectedSeriesList;
            //找到已有的 改成true
            if (listData.length >= 0) {
              for (let k = 0; k < listData.length; k++) {
                for (let j = 0; j < _dataLen; j++) {
                  if (listData[k].customizedProductGoodsId == _data[j].customizedProductGoodsId) {
                    _data[j]._checkbox = true;
                  }
                }
              }
            }
          row._chilren = _data;
          //根据下标插入进去 获取ID 在数组中的下标
          this.tableListData.splice(_index + 1, 0, ..._data);
          //获取子集id存入 元素属性
          let arr = [];
          for (let { customizedProductGoodsId } of _data) {
            arr.push(customizedProductGoodsId);
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
          if (cidArr[i] == this.tableListData[j].customizedProductGoodsId) {
            this.tableListData.splice(j, 1);
          }
        }
      }
    },
    //关闭
    closeDialog() {
      this.seriesDialogVisible = false;
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
