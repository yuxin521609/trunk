<!--
 * @Description: 重新打印
 * @Author: elephant  
 * @Date: 2019-08-20 08:58:12
 * @LastEditTime: 2019-08-20 11:06:36
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <el-dialog
      v-if="printsDialogVisible"
      title="重新打印"
      :visible.sync="printsDialogVisible"
      class="alarmPopup"
      width="1000px"
      append-to-body
    >
      <div class="dialog-search">
        <el-form
          class="item-form"
          :model="filtersData"
          label-width="100px"
          size="small"
          ref="filtersForm"
          inline
        >
          <el-form-item prop="printsOptions" label="选择打印机：">
            <el-select v-model="printsValue" placeholder="请选择">
              <el-option
                v-for="item in printsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          :data="tableListData"
          v-loading="tableLoading"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true"
          height="400"
        >
          <el-table-column prop="productGoodsCode" align="center" label="商品编码" min-width="100"></el-table-column>
          <el-table-column prop="productCode" align="center" label="商品款号" min-width="100"></el-table-column>
          <el-table-column prop="productGoodsSn" align="center" label="SN码" min-width="100"></el-table-column>
          <el-table-column prop="productGoodsName" align="center" label="品名" min-width="100"></el-table-column>
          <el-table-column prop="tagBrandName" align="center" label="品牌" min-width="100"></el-table-column>
          <el-table-column prop="size" align="center" label="尺码" min-width="100"></el-table-column>
          <el-table-column prop="color" align="center" label="颜色" min-width="100"></el-table-column>
        </el-table>
      </div>
      <div class="item-right mt-10">
        <el-button size="small" @click="closeDialog">取消打印</el-button>
        <el-button size="small" @click="submitPrint()" type="primary">确认打印</el-button>
      </div>
    </el-dialog>
    <!-- 打印状态弹窗 -->
    <prints-status-dialog @setParentPrintsStatus="getPrintsStatus" ref="printsStatusRef"></prints-status-dialog>
  </div>
</template>
<script>
//引入LODOP模块
import { getLodop } from "@/utils/LodopFuncs.js";
//引入 打印样式模块
import { printWinform } from "@/utils/print_50_120_shu.js";
// 引入弹出打印状态组件；
import PrintsStatusDialog from "./PrintsStatusDialog.vue";

let LODOP;
export default {
  name: "tp-batch-prints-dialog",
  components: {
    PrintsStatusDialog
  },
  data() {
    return {
      filtersData: {},
      tableListData: [],
      printsOptions: [],
      printsDialogVisible: false,
      printsValue: null,
      //选择后打印的数据
      tableLoading: false
    };
  },
  created() {
    this.init();
  },
  mounted() {
      
  },
  methods: {
    init() {
      this.tableListData = [];
      this.selectPrintData = [];
    },
    //获取打印机
    getLodopData() {
      try {
        LODOP = getLodop();
        let arr = [];
        let iPrinterCount = LODOP.GET_PRINTER_COUNT();
        for (let i = 0; i < iPrinterCount; i++) {
          arr.push({
            label: LODOP.GET_PRINTER_NAME(i),
            value: i
          });
        }
        // console.log(arr);
        this.printsOptions = arr;
      } catch (error) {
        
      }
    },
    popupInit(list) {
      this.getTableList(list);
      this.printsDialogVisible = true;
      this.getLodopData();
    },
    //获取列表
    getTableList(list) {
      this.tableLoading = true;
      this.tableListData=[];
      this.request(this.api.product.productGoodsSn_reprintSns, list, true)
        .then(res => {
          this.tableLoading = false;
          let arr = [];
          for (let i = 0; i < res.length; i++) {
            let productGoodsSns = res[i].productGoodsSns || [];
            for (let k = 0; k < productGoodsSns.length; k++) {
              let dataList = JSON.parse(JSON.stringify(res[i]));
              let obj = new Object();
              obj = dataList;
              obj.productGoodsSn = productGoodsSns[k];
              arr.push(obj);
              dataList = null;
              obj = null;
            }
          }
          this.tableListData = arr;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    //提交打印
    submitPrint() {
      if (this.tableListData.length <= 0) {
        this.$message.error("无可打印的数据！");
        return;
      }
      if (this.printsValue == null) {
        this.$message.error("请选择打印机！");
        return;
      }
      // LODOP.SELECT_PRINTER();//选择打印机
      // LODOP.SET_PRINTER_INDEXA(this.printsValue);
      // LODOP.SET_PRINT_MODE("RESELECT_PRINTER",true);// 允许重选打印机
      LODOP = getLodop();
      // LODOP.PRINT_INITA("0mm", "0mm", "50.00mm", "120.00mm", "合格证");
      // LODOP.SET_PRINTER_INDEX(this.printsValue);
      // console.log(LODOP.SET_PRINTER_INDEX(this.printsValue));
      // LODOP.SET_PRINTER_INDEXA(this.printsValue);
      for (let i = 0; i < this.tableListData.length; i++) {
        printWinform(LODOP, this.tableListData[i],this.printsValue);
      }
      // LODOP.NewPage();
      if (LODOP.CVERSION) {
        CLODOP.On_Return = (TaskID, Value) => {
          if (!!Value) {
            //打印状态
            this.$refs.printsStatusRef.propInit();
          } else {
            alert("放弃打印！");
          }
        };
        return;
      }
    },
    //获取子组件返回的打印成功能
    getPrintsStatus() {
      let snArr = [];
      for (let i = 0; i < this.tableListData.length; i++) {
        snArr.push({ sn: this.tableListData[i].productGoodsSn });
      }
      this.request(this.api.product.productGoodsSn_confirmed, snArr)
        .then(res => {
          this.$message.success("更新打印数据成功");
          this.$refs.printsStatusRef.closeDialog();
          this.closeDialog();
        })
        .catch(err => {
          this.$message.error("更新打印数据失败");
          this.$refs.printsStatusRef.closeDialog();
          this.closeDialog();
        });
    },
    closeDialog() {
      this.printsDialogVisible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.alarmPopup /deep/ .el-dialog__body {
  padding: 0 20px 30px;
}
.alarmPopup /deep/ .el-input-number {
  line-height: 26px;
}
</style>
