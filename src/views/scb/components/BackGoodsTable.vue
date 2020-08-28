<style lang="less" scoped>
  .goods-table{
    .pagination{margin-top: 20px;}
  }
  .goods-table .txt-red /deep/ .el-input__inner{color: red;}
</style>
<template>
  <div class="goods-table">
    <el-table :data="showTableData" style="width: 100%">
      <el-table-column prop="productCode" label="商品款号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="goodsCode" label="商品货号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="goodsName" label="名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <image-popover :img-src="scope.row.image"></image-popover>
        </template>
      </el-table-column>
      <el-table-column prop="color" label="颜色"></el-table-column>
      <el-table-column prop="size" label="尺码"></el-table-column>
      <el-table-column prop="brandName" label="品牌" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="priceTag" label="吊牌价"></el-table-column>
      <el-table-column prop="quantity" label="未结算货量"></el-table-column>
      <el-table-column label="数量" width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.planBackQuantity"  @input.native="handleInput($event, scope)" @change="handleChange(scope)" :min="0"  label="选择的数量" size="mini" :class="{'txt-red' : scope.row.quantity < scope.row.planBackQuantity}"></el-input-number>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" v-if="isDel && tableData.length > 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length" :page-size="formData.pageSize" :current-page="formData.pageIndex">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import ImagePopover from "@/views/collocation/components/ImagePopover";
  import { numberPrice } from "@/utils/validate";
  export default {
    name: '',
    props: {
      // 是否为0是删除
      isDel: {
        type: Boolean,
        default: false
      },
      // 表格数据
      tableData: {
        type: Array
      }
    },
    // 数据
    data() {
      return {
        showTableData: [],
        formData: {
          pageIndex: 1,
          pageSize: 10
        }
      }
    },
    // 组件
    components: {
      ImagePopover
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getShowTableData();
      })
    },
    // 方法
    methods: {
      // 获取显示数据
      getShowTableData(){
        if(this.isDel){
          if(this.tableData.length <= 10){
            this.showTableData = this.tableData
          }
          if(this.tableData.length > 10){
            this.showTableData = this.tableData.slice((this.formData.pageIndex - 1) * this.formData.pageSize, this.formData.pageIndex * this.formData.pageSize )
          }
        }else {
          this.showTableData = this.tableData
        }
      },
      // 数量点击改变
      handleChange(scope){
        // 重新计算总价
        if(this.isDel){
          this.$nextTick(()=>{
            this.$parent.checkedTotalPrice();
          });
          if(scope.row.planBackQuantity == 0){
            this.$confirm('返货量为0时，将删除该商品', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              showClose:false
            }).then(() => {
              this.tableData.splice(scope.$index + (this.formData.pageIndex - 1) * this.formData.pageSize, 1);
              if(this.showTableData.length === 1 && this.formData.pageIndex > 1){
                this.formData.pageIndex = this.formData.pageIndex -1;
              }
              this.getShowTableData();
              this.$nextTick(()=>{
                this.$parent.checkedTotalPrice();
              })
            }).catch(() => {
              scope.row.planBackQuantity = 1;
              this.$nextTick(()=>{
                this.$parent.checkedTotalPrice();
              })
            });
          }
        }
      },
      // 数量输入改变
      handleInput($event, scope){
        this.$nextTick(()=>{
          let val = $event.target.value;
          scope.row.planBackQuantity = val.replace(/[^\d.]/g,'');
          this.handleChange(scope)
        })
      },
      // 单价改变
      purchasePriceChange($event, row){
        let val = $event.target.value;
        if(!val) {
          $event.target.value = 0;
          row.backUnitPrice = $event.target.value;
          return
        }
        numberPrice($event);
        row.backUnitPrice = $event.target.value;
        this.$nextTick(()=>{
          this.$parent.checkedTotalPrice();
        })
      },
      // 表格更改条数
      handleSizeChange(val){
        this.formData.pageSize = val;
        this.formData.pageIndex = 1;
        this.getShowTableData();
      },
      // 表格更改页数
      handleCurrentChange(val){
        this.formData.pageIndex=val;
        this.getShowTableData();
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
