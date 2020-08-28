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
        <el-form-item label="货主名称：" prop="name">
          <el-input v-model='signData.name' placeholder="模糊查询"></el-input>
        </el-form-item>
        <el-form-item label="货主代码：" prop="code" label-width="90px">
          <el-input v-model='signData.code' placeholder="请输入"></el-input>      
        </el-form-item>
        <el-form-item style="margin-left:20px;">
          <el-button type="primary" @click="onSearchContent" size="small">搜索</el-button>
          <el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- table -->
    <div class="table">
      <el-button
        type="primary"
        @click="addBtnClickEvent"
        size="small"
      >新增</el-button>
      <el-button
        @click="startBtnClickEvent"
        style="margin-bottom:20px;"
        size="small"
        type="primary"
        :disabled="multipleSelectionData.length==0"
      >启用</el-button>
      <el-button
        type="primary"
        @click="stopBtnClickEvent"
        size="small"
        :disabled="multipleSelectionData.length==0"
      >停用</el-button>
      <!-- table订单 -->
      <template>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          header-row-class-name="item-table-header"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="货主名称" prop="name"></el-table-column>
          <el-table-column prop="code" label="货主代码">
            <template slot-scope="scope">
              <span>{{scope.row.code ? scope.row.code:'--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="valid" label="状态">
            <template slot-scope="scope">
              <span>{{scope.row.valid | filtersValid}}</span>
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
          <el-table-column prop="address" label="地址">
            <template slot-scope="scope">
              <span>{{scope.row.address ? scope.row.address:'--'}}</span>
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
    <el-dialog :title="title" :visible.sync="showOwnerFrom" width="550px" @closed="hideOwnerFormDialog">
      <el-form :model="showOwnerFromData" ref="ownerFrom" :rules="rules" label-width="110px">
        <el-form-item label="货主编码：" prop="code">
          <el-input
            v-model="showOwnerFromData.code"
            style="width:356px;"
            placeholder="请输入"
            :disabled="isEditor"
          ></el-input>
        </el-form-item>
        <el-form-item label="货主名称：" prop="name">
          <el-input
            v-model="showOwnerFromData.name"
            style="width:356px;"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="contact">
          <el-input v-model="showOwnerFromData.contact" style="width:356px;" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="telephone">
          <el-input v-model="showOwnerFromData.telephone" v-enter-number style="width:356px;" placeholder="请输入" maxlength='11'></el-input>
        </el-form-item>
        <el-form-item label="联系地址：" prop="divisionId">
          <div style="width:460px;">
            <division @set-division="setDivision" ref="division" v-model="showOwnerFromData.divisionId"></division>
          </div>
          <el-input v-model="showOwnerFromData.address" style="width:356px;" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="启停状态：" prop="valid">
          <el-switch v-model="showOwnerFromData.valid" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelClickEvent">取 消</el-button>
        <el-button type="primary" @click="sureAddFromOfCycle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import division from "@/components/division";
import { isvalidPhone } from "@/utils/phonevalide";
import { watch } from 'fs';
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};
export default {
  components: {
    division
  },
  filters: {
    //过滤状态
    filtersValid(val){
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
  data() {
    return {
      signData: {
        //货主名称
        name: "",
        //货主编码
        code:'',
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      //货主表格数据
      tableData: [],
      //总的条数
      totlePage: 1,
      //存储需要导出表格的数据
      multipleSelectionData: [],
      //标识是否显示货主-dialog
      showOwnerFrom:false,
      //标识是新增还是修改
      isEditor:false,
      title:'新增货主',
      //标识dialog的数据源
      showOwnerFromData:{
        id:'',
        code:'',
        name:'',
        contact:'',
        telephone:'',
        divisionId:'',
        address:'',
        valid:false,
        province:'',
        provinceCode:'',
        city:'',
        cityCode:'',
        area:'',
        areaCode:''
      },
      rules: {
        name: [
          { required: true, message: "货主名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "货主编码不能为空", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    title(val){
      if(val=='修改货主'){
        this.isEditor=true;
      }else{
        this.isEditor=false;
      }
    }
  },
  created() {
    //得到货主管理表格数据
    this.getOwnerManagerTableData();
  },
  methods: {
    //得到货主管理表格数据
    getOwnerManagerTableData() {
      this.request(this.api.warehouse.warehouseBase_goodsOwner_list, this.signData).then(
        res => {
          console.log(res)
          //获取总的页数
          this.totlePage = res.totalCount;
          this.tableData = res.data;
        }
      );
    },
    //搜索
    onSearchContent() {
      //刷新数据
      this.getOwnerManagerTableData();
    },
    //重置表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //新增Btn的点击事件
    addBtnClickEvent(){
      console.log("addBtnClickEvent---")
      this.showOwnerFrom=true;
    },
    //省市区
    setDivision(var1) {
      this.showOwnerFromData.province = var1.province;
      this.showOwnerFromData.provinceCode = var1.provinceCode;
      this.showOwnerFromData.city = var1.municipality;
      this.showOwnerFromData.cityCode = var1.municipalityCode;
      this.showOwnerFromData.area = var1.area;
      this.showOwnerFromData.areaCode = var1.areaCode;
      this.showOwnerFromData.divisionId = var1.divisionId;
    },
    //选中checkBox的状态
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelectionData=val;
    },
    //启用Btn的点击事件
    startBtnClickEvent() {
      console.log("startBtnClickEvent------");
      this.$confirm("确认启用吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var primaries=[]
        this.multipleSelectionData.forEach(item=>{
          primaries.push(item.id)
        })
        this.request(this.api.warehouse.warehouseBase_goodsOwner_updateValid,{
          symbol:true, 
          primaries:primaries
        }).then(res => {
          //刷新数据
          this.getOwnerManagerTableData();
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
        this.request(this.api.warehouse.warehouseBase_goodsOwner_updateValid,{
          symbol:false, 
          primaries:primaries
        }).then(res => {
          //刷新数据
          this.getOwnerManagerTableData();
        })
      }).catch(action => {});
    },
    //修改按钮
    editBtnClick(row) {
      //请求接口数据 TODO---
      this.request(this.api.warehouse.warehouseBase_goodsOwner_getByPrimary,{id:row.id}).then(res =>{
        console.log(res)
        this.title='修改货主'
        this.showOwnerFrom=true; 
        this.$nextTick(() => {
          // this.showOwnerFromData={
          //   id:res.id,
          //   code:res.code,
          //   name:res.name,
          //   contact:res.contact,
          //   telephone:res.telephone,
          //   divisionId:res.divisionId,
          //   address:res.address,
          //   valid:res.valid,
          //   provinceName:res.provinceName,
          //   provinceCode:res.provinceCode,
          //   cityName:res.cityName,
          //   cityCode:res.cityCode,
          //   areaName:res.areaName,
          //   areaCode:res.areaCode
          // }
          this.showOwnerFromData=res
        })
      })
    },
    //el-dialog的隐藏事件
    hideOwnerFormDialog() {
      this.showOwnerFrom = false;
      this.$refs.ownerFrom.resetFields();
      this.$refs.division.init();
      this.showOwnerFromData.address = '';
      this.showOwnerFromData.id = '';
      this.title='新增货主'
    },
    //取消
    cancelClickEvent() {
      this.hideOwnerFormDialog();
    },
    //确认新增货主
    sureAddFromOfCycle() {
      this.$refs.ownerFrom.validate((valid) => {
        if (valid) {
            this.request(this.api.warehouse.warehouseBase_goodsOwner_save,this.showOwnerFromData).then(res => {
              //隐藏当前的新增dialog
              this.hideOwnerFormDialog();
              console.log(res)
              //刷新数据
              this.getOwnerManagerTableData();
            })
          } else {
              console.log('error submit!!');
              return false;
        }
      });
    },
    //每页条数改变时
    handleSizeChange(page) {
      console.log(page);
      this.signData.pageSize = page;
      this.getOwnerManagerTableData();
    },
    // 当前页改变时
    handleCurrentChange(page) {
      console.log(page);
      this.signData.pageIndex = page;
      this.getOwnerManagerTableData();
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

