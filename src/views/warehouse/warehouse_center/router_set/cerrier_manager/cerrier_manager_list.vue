<template>
  <!-- 渠道订单 -->
  <div class="base">
    <div class="middle-from">
      <el-form
        :inline="true"
        :model="signData"
        size="small"
        ref="ruleForm"
        class="demo-form-inline"
      >
        <el-form-item label="承运商名称：" prop="name">
          <el-select v-model="signData.name" placeholder="请选择">
            <el-option
              v-for="item in logisticsData"
              :key="item.id"
              :label="item.description"
              :value="item.description"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承运商代码：" prop="code" label-width="100px" style="margin:0 20px;">
          <el-select v-model="signData.code" placeholder="请选择">
            <el-option
              v-for="item in logisticsData"
              :key="item.id"
              :label="item.code"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态：" prop="isValid" label-width="90px">
          <el-select v-model="signData.isValid" placeholder="请选择">
            <el-option label="启用" value="true"></el-option>
            <el-option label="停用" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:20px;">
          <el-button type="primary" plain @click="onSearchContent" size="small">搜索</el-button>
          <el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- table -->
    <div class="table">
      <el-button type="primary" @click="addBtnClickEvent" size="small">新增</el-button>
      <el-button @click="startBtnClickEvent" size="small" type="primary" :disabled="multipleSelectionData.length==0">启用</el-button>
      <el-button type="primary" @click="stopBtnClickEvent" size="small" :disabled="multipleSelectionData.length==0">停用</el-button>
      <!-- table订单 -->
      <template>
        <el-table
          ref="multipleTable"
          :data="areaTableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          header-row-class-name="item-table-header"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="物流商名称" prop="name"></el-table-column>
          <el-table-column prop="code" label="物流商代码">
            <template slot-scope="scope">
              <span>{{scope.row.code ? scope.row.code:'--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="contact" label="联系人">
            <template slot-scope="scope">
              <span>{{scope.row.contact ? scope.row.contact:'--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="telephone" label="联系电话">
            <template slot-scope="scope">
              <span>{{scope.row.telephone ? scope.row.telephone:'--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isValid" label="启用状态">
            <template slot-scope="scope">
              <span>{{scope.row.isValid | filterIsValid}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button @click="editBtnClick(scope.row)" type="text">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top:20px;padding-bottom:10px;margin-right:20px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="signData.pageIndex"
            :page-sizes="[10,20,30,40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totlePage"
          ></el-pagination>
        </div>
      </template>
    </div>
    <el-dialog :title="title" :visible.sync="showCycleFrom" width="500px" @closed="hideDialog">
      <el-form :model="cycleFromData" ref="cycleFromData" :rules="rules" label-width="110px">
        <el-form-item label="承运商名称：" prop="name">
          <el-select
            v-model="cycleFromData.name"
            placeholder="请选择"
            @change="changeLogisticsName"
            style="width:300px;"
          >
            <el-option
              v-for="item in logisticsData"
              :key="item.id"
              :label="item.description"
              :value="item.description"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承运商编码：" prop="code">
          <el-input
            v-model="cycleFromData.code"
            style="width:300px;"
            disabled
            placeholder="请输入承运商编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="contact">
          <el-input v-model="cycleFromData.contact" style="width:300px;" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="telephone">
          <el-input
            v-model="cycleFromData.telephone"
            v-enter-number
            style="width:300px;"
            placeholder="请输入内容"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="启停状态：" prop="isValid">
          <el-switch
            v-model="cycleFromData.isValid"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelClickEvent('cycleFromData')">取 消</el-button>
        <el-button type="primary" @click="sureAddFromOfCycle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //是否显示备注信息框
      isShowRemarkMsgBox: false,
      //仓储性质数据
      storageValArr: [],
      //订单来源支持多数据绑定
      orderValArr: [],
      signData: {
        //承运商名称
        name: "",
        //承运商编码
        code: "",
        //开启关闭状态查询
        isValid: "",
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      channelSaleOrderVoList: [],
      //网销订单表格数据
      areaTableData: [],
      //总的条数
      totlePage: 1,
      //存储需要批量更新状态的表格的数据
      multipleSelectionData: [],

      //标题
      title: "新增承运商",
      //标识是否显示el-dialog
      showCycleFrom: false,
      //新增货区数据
      cycleFromData: {
        //标识当前数据的id
        id: "",
        //承运商名称
        name: "",
        //承运商编码
        code: "",
        //联系人
        contact: "",
        //联系电话
        telephone: "",
        //开启状态
        isValid: false
      },
      //承运商数据
      logisticsData: [],
      rules: {
        name: [{ required: true, message: "仓库不能为空", trigger: "blur" }],
        code: [
          { required: true, message: "货区名称不能为空", trigger: "change" }
        ]
      }
    };
  },
  filters: {
    filterIsValid(val) {
      switch (val) {
        case true:
          return "启用";
          break;
        case false:
          return "停用";
          break;
      }
    }
  },
  created() {
    //得到表格数据
    this.getCerrierManagerListTableData();
    //得到承运商数据
    this.getLogisticsData();
  },
  methods: {
    //得到ListData表格数据
    getCerrierManagerListTableData() {
      this.request(
        this.api.warehouse.warehouseBase_logistics_list,
        this.signData
      ).then(res => {
        console.log(res);
        //获取总的页数
        this.areaTableData = res.data;
        this.totlePage = res.totalCount;
      });
    },
    //得到承运商数据
    getLogisticsData() {
      this.request(
        this.api.warehouse
          .warehouseBase_configuration_configurationDictionaryByCode,
        { code: "CONFIGURABLE06" }
      ).then(res => {
        console.log(res);
        this.logisticsData = res;
      });
    },
    //搜索
    onSearchContent() {
      //搜索
      this.getCerrierManagerListTableData();
    },
    //重置
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
    },
    //新增Btn的点击事件
    addBtnClickEvent() {
      this.title = "新增承运商";
      this.showCycleFrom = true;
    },
    //启用Btn的点击事件
    startBtnClickEvent() {
      console.log("startBtnClickEvent---");
      this.$confirm("确认启用吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var primaries=[]
        this.multipleSelectionData.forEach(item=>{
          primaries.push(item.id)
        })
        this.request(this.api.warehouse.warehouseBase_configuration_updateValid,{
          symbol:true, 
          primaries:primaries
        }).then(res => {
          //刷新数据
          this.getCerrierManagerListTableData();
        })
      }).catch(action => {});
    },
    //停用Btn的点击事件
    stopBtnClickEvent() {
      console.log("stopBtnClickEvent---");
      this.$confirm("确认停用吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var primaries=[]
        this.multipleSelectionData.forEach(item=>{
          primaries.push(item.id)
        })
        this.request(this.api.warehouse.warehouseBase_configuration_updateValid,{
          symbol:false, 
          primaries:primaries
        }).then(res => {
          //刷新数据
          this.getCerrierManagerListTableData();
        })
      }).catch(action => {});
    },
    //选中checkBox的状态
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelectionData = val;
    },
    //修改按钮
    editBtnClick(row) {
      this.request(
        this.api.warehouse.warehouseBase_configuration_getByPrimary,
        { id: row.id }
      ).then(res => {
        console.log(res);
        this.showCycleFrom = true;
        this.$nextTick(() => {
          this.title = "修改承运商";
          this.cycleFromData = {
            //当前数据id
            id: res.id,
            //承运商名称
            name: res.name,
            //承运商编码
            code: res.code,
            //联系人
            contact: res.contact,
            //联系电话
            telephone: res.telephone,
            //开启状态
            isValid: res.isValid
          };
        });
      });
    },
    //每页条数改变时
    handleSizeChange(page) {
      console.log(page);
      this.signData.pageSize = page;
      this.getCerrierManagerListTableData();
    },
    // 当前页改变时
    handleCurrentChange(page) {
      console.log(page);
      this.signData.pageIndex = page;
      this.getCerrierManagerListTableData();
    },
    //承运商名称改变
    changeLogisticsName(val) {
      var code = this.logisticsData.find(item => item.description == val).code;
      this.cycleFromData.code = code;
    },
    //el-dialog的隐藏事件
    hideDialog() {
      this.showCycleFrom = false;
      this.$refs["cycleFromData"].resetFields();
      this.cycleFromData.id = "";
    },
    //取消
    cancelClickEvent(cycleFromData) {
      this.hideDialog();
    },
    //确认新增承运商
    sureAddFromOfCycle() {
      console.log("sureAddFromOfCycle--------");
      this.$refs.cycleFromData.validate(valid => {
        if (valid) {
          this.request(
            this.api.warehouse.warehouseBase_configuration_save,
            this.cycleFromData
          ).then(res => {
            console.log("新增成功---");
            //隐藏当前dialog
            this.hideDialog();
            //刷新数据
            this.getCerrierManagerListTableData();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.seachKey-input {
  width: 300px;
}
.btn {
  width: 100%;
  text-align: right;
  margin-top: 15px;
  margin-right: 20px;
}
.date-picker-div {
  margin-right: 10px;
}
.base {
  margin: 8px;
}
.main-top {
  // background-color: aqua;
  color: #222;
  display: inline-block;
  margin-left: -15px;
  width: 300px;
  line-height: 70px;
}
.block {
  margin-top: 20px;
  padding-bottom: 10px;
  margin-right: 20px;
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
  padding-left: 18px;
}
.table {
  margin-top: 8px;
  background-color: #fff;
  padding: 24px;
  // padding-top: 20px;
  // padding-left: 70px;
}
.upload-demo {
  float: left;
  margin-right: 10px;
}
.circleProgress {
  text-align: center;
}
// .addbtn button{
//    padding: 9px 15px;
// }
</style>

