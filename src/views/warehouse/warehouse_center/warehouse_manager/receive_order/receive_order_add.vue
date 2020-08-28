<template>
  <div class="detail_div">
    <div class="middle-msg">
      <div class="middle-title-div">
        <label>基础信息</label>
        <el-button type="primary" @click="submitOrderBtnClickEvent" size="small">提交订单</el-button>
      </div>
      <el-form
        :inline="true"
        :model="shop_user"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="入库类型：" prop="type">
              <el-select :disabled = "true" v-model="shop_user.type" style="width:185px;" placeholder="请选择">
                <el-option
                  v-for="item in warehouseTypeData"
                  :key="item.id"
                  :label="item.description"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预计到货日期：" prop="expectedTime">
              <el-date-picker v-model="shop_user.expectedTime" type="date" placeholder="选择日期" style="width: 185px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="承运商：" prop="logisticsCode">
              <el-select
                v-model="shop_user.logisticsCode"
                style="width:185px;"
                @change="logisticsChangeEvent"
                placeholder='承运商名称'
              >
                <el-option
                  v-for="item in logisticsData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="原始订单号：" prop="orderSn">
              <el-input v-model="shop_user.orderSn" placeholder="原始订单号"></el-input>
            </el-form-item>
             <el-form-item label="供应商名称：" prop="supply">
              <el-input v-model="shop_user.supply" placeholder="供应商名称" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="承运商单号：" prop="logisticsSn">
              <el-input v-model="shop_user.logisticsSn" placeholder="承运商单号" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="仓库：" prop="warehouseName" placeholder="请选择">
              <el-select
                v-model="shop_user.warehouseName"
                style="width:185px;"
                @change="warehouseChangeEvent"
              >
                <el-option
                  v-for="item in warehouseData"
                  :key="item.id"
                  :label="item.warehouseName"
                  :value="item.warehouseName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系人：" prop="contact">
              <el-input v-model="shop_user.contact" placeholder="供应商联系人" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="司机：" prop="driver">
              <el-input v-model="shop_user.driver" placeholder="司机姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="货主：" prop="goodsOwner" placeholder="请选择">
              <el-select
                v-model="shop_user.goodsOwner"
                style="width:185px;"
                @change="goodsOwnerChangeEvent"
              >
                <el-option
                  v-for="item in goodsOwnerData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系方式：" prop="telephone">
              <el-input v-model="shop_user.telephone" placeholder="联系方式" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="手机号码：" prop="driverMobile">
              <el-input v-model="shop_user.driverMobile" placeholder="司机手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table_div">
      <div class="title-div">
        <label>商品明细</label>
        <el-button type="primary" @click="addShopBtnClickEvent" size="small">添加商品</el-button>
        <!-- <el-button plain @click="exportExcelShopData" size="small">导入商品</el-button> -->
      </div>
      <el-table
        :data="shop_user.configurationOrderItemList"
        stripe
        style="width: 100%;padding-left:15px;"
        header-row-class-name="item-table-header"
        max-height="400"
      >
        <el-table-column prop="code" label="商品编码" width="180"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="colorName" label="颜色"></el-table-column>
        <el-table-column prop="sizeName" label="尺码"></el-table-column>
        <el-table-column prop="brandName" label="品牌"></el-table-column>
        <el-table-column prop="cateName" label="品类"></el-table-column>
        <!-- <el-table-column prop="availableQuantity" label="可用数量" width="180"></el-table-column> -->
        <el-table-column prop="orderQuantity" label="预计到货数量">
          <template slot-scope="scope">
            <el-input-number v-model.number="scope.row.orderQuantity" size="mini" :min="0" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="deleteBtnClick(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加商品" :visible.sync="dialogTableVisible" @close="hideAddShopDialog" width="700px">
      <div class="dialog-div">
        <el-form ref="formData" :model="signData" :inline="true">
          <el-form-item label="商品编码：" prop="productGoodsCode">
            <el-input v-model="signData.productGoodsCode" placeholder="可模糊查询" style="width:130px;"></el-input>
          </el-form-item>
          <el-form-item label="品牌：" prop="brandName">
            <el-input v-model="signData.brandName" placeholder="可模糊查询" style="width:130px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchFormData" type="primary" plain size="small">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="sureBtnClickEvent" size="small" :disabled='multipleSelectionData.length==0'>确认</el-button>
        <el-table
          v-loading="addShopLoading"
          element-loading-text="拼命加载中..."
          :data="gridData"
          style="margin-bottom:15px;"
          header-row-class-name="item-table-header"
          max-height="400"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column property="code" label="商品编码" width="150"></el-table-column>
          <el-table-column property="name" label="商品名称" width="200"></el-table-column>
          <el-table-column property="colorName" label="颜色"></el-table-column>
          <el-table-column property="sizeName" label="尺寸"></el-table-column>
          <el-table-column property="brandName" label="品牌"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="dialogTableHandleSizeChange"
          @current-change="dialogTableHandleCurrentChange"
          :current-page.sync="dialogTableData.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="dialogTableData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dialogtotalCount"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import division from "@/components/division";
import { isvalidPhone } from "@/utils/phonevalide";
import { validatePositiveValNumber } from '@/utils/validate';
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
  data() {
    return {
      addShopLoading:false,
      // 正整数验证
      validatePositiveValNumber,
      //标识是否显示新增商品
      dialogTableVisible: false,
      dialogTableData: {
        pageIndex: 1,
        pageSize: 1
      },
      dialogtotalCount: 1,
      //添加商品里的嵌套表格数据
      gridData: [],
      signData: {
        //商品编码
        productGoodsCode:'',
        //品牌
        brandName:'',
        //货主Id
        ownerId: "",
        //仓库编码
        warehouseCode: '',
        pageIndex: 1,
        pageSize: 10
      },
      shop_user: {
        //入库类型
        type: "",
        //预计到货日期
        expectedTime:'',
        //承运商
        logistics: "",
        //承运商编码
        logisticsCode: "",
        //承运单号
        logisticsSn: "",
        //原始订单号
        orderSn: "",
        //供应商名称
        supply:'',
        //联系人
        contact:'',
        //司机
        driver:'',
        //货主
        goodsOwner: "",
        //货主Id
        ownerId: "",
        //货主编码
        ownerCode: "",
        //联系方式
        telephone: "",
        //手机号码
        driverMobile:'',
        //仓库名称
        warehouseName: "",
        //仓库编码
        warehouseCode: "",
        //表格数据
        configurationOrderItemList: []
      },
      //规则
      rules: {
        warehouseName: [
          { required: true, message: "入库仓库不能为空", trigger: "change" }
        ],
        type: [
          { required: true, message: "入库类型不能为空", trigger: "change" }
        ],
        goodsOwner: [
          { required: true, message: "货主不能为空", trigger: "change" }
        ]
      },
      //承运商数据
      logisticsData: [],
      //出库类型数据
      warehouseTypeData: [],
      //出库仓库数据
      warehouseData: [],
      //货主数据
      goodsOwnerData: [],
      //记录总的商品数
      totalPage: 0,
      //记录选中得数据
      multipleSelectionData:[],
    };
  },
  watch: {
    "shop_user.goodsOwner": function(newValue, oldValue) {
      this.tmpGoodsOwner = oldValue;
    }
  },
  //过滤器
  filters: {
    //过滤订单状态
    filterBusinessStatus(val) {
      switch (val) {
        case "13":
          return "待处理";
          break;
        case "14":
          return "已处理";
          break;
        case "15":
          return "已作废";
          break;
      }
    }
  },
  mounted() {
    //得到出库类型数据
    this.getWarehouseData();
    //得到承运商数据
    this.getLogisticData();
    //得到出库仓库数据
    this.geSendWarehouseData();
    //得到货主数据
    this.getGoodsOwnerData();
  },
  methods: {
    //得到承运商数据
    getLogisticData() {
      this.request(this.api.warehouse.warehouseBase_logistics_list, {
        isValid: true
      }).then(res => {
        console.log(res);
        this.logisticsData = res.data;
      });
    },
    //承运商change事件
    logisticsChangeEvent(val) {
      console.log(val);
      var logistics = this.logisticsData.find(
        item => item.logisticsCode == val
      );
      this.shop_user.logistics = logistics.name;
    },
    //得到出库类型数据
    getWarehouseData() {
      //得到出库类型数据 code==04
      this.request(
        this.api.warehouse.warehouseBase_configurationDictionaryByCode,
        { code: "CONFIGURABLE05" }
      ).then(res => {
        console.log(res);
        this.warehouseTypeData = res;
          this.shop_user.type="05003"

      });
    },
    //得到发货仓库数据
    geSendWarehouseData() {
      this.request(this.api.warehouse.warehouseBase_warehouse_list, {
        isValid: true
      }).then(res => {
        console.log(res);
        this.warehouseData = res.data;
      });
    },
    //入库仓库change事件
    warehouseChangeEvent(val) {
      this.shop_user.warehouseCode = this.warehouseData.find(
        item => item.warehouseName == val
      ).warehouseCode;
    },
    //得到货主数据
    getGoodsOwnerData() {
      this.request(this.api.warehouse.warehouseBase_goodsOwner_list, {
        valid: true
      }).then(res => {
        console.log(res);
        this.goodsOwnerData = res.data;
      });
    },
    //货主change事件
    goodsOwnerChangeEvent(val) {
      var configurationOrderItemList=this.shop_user.configurationOrderItemList
      if (configurationOrderItemList.length > 0) {
        this.$confirm("切换货主后，已选商品会清除，确认切换货主吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
           this.shop_user.configurationOrderItemList=[]
           this.getOwnerIdAndCode(val);
          })
          .catch(action => {
            this.shop_user.goodsOwner = this.tmpGoodsOwner;
            this.getOwnerIdAndCode(this.shop_user.goodsOwner);
          });
      } else {
        this.getOwnerIdAndCode(val);
      }
    },
    //得到货主的Id和Code
    getOwnerIdAndCode(val){
      var goodsOwner = this.goodsOwnerData.find(
        item => item.name == val
      )
      this.shop_user.goodsOwner=goodsOwner.code;
      this.shop_user.ownerCode=goodsOwner.code;
      this.shop_user.ownerId = goodsOwner.id;
    },
    //添加商品按钮得点击事件
    addShopBtnClickEvent() {
      if (!this.shop_user.goodsOwner) {
        this.$message.error("请选择货主");
        return;
      }
      this.gridData=[]
      //得到商品数据
      this.getProductGoodsData();
    },
    //得到商品列表数据
    getProductGoodsData(){
      this.addShopLoading=true;
      this.signData.ownerId=this.shop_user.ownerCode
      // this.signData.warehouseCode=this.shop_user.warehouseCode
      this.dialogTableVisible = true;
      this.request(this.api.product.productGoods_listProductGoods4Wms,this.signData,true).then(res => {
        this.addShopLoading=false;
        console.log(res);
        this.gridData=res.data;
        this.dialogtotalCount=res.totalCount;
      });
    },
    //导入商品按钮的点击事件
    exportExcelShopData() {
      console.log("exportExcelShopData-----");
    },
    //删除Btn点击事件
    deleteBtnClick(id) {
      var index=this.shop_user.configurationOrderItemList.findIndex(item=>item.id==id)
      this.shop_user.configurationOrderItemList.splice(index,1);
    },
    //提交订单Btn得点击事件
    submitOrderBtnClickEvent(){ 
      if(this.shop_user.configurationOrderItemList.length==0){
        this.$message.error("提交商品不能为空,请添加商品");
        return;
      }else{
        var flag=this.shop_user.configurationOrderItemList.every(item =>item.orderQuantity==0)
        if(flag){
          this.$message.error("提交商品订货数量不能全部为0");  
          return;
        }
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.shop_user.configurationOrderItemList=this.shop_user.configurationOrderItemList.filter(item =>item.orderQuantity>0)
          this.shop_user.configurationOrderItemList.forEach(item =>{
            item.goodsCode=item.code,
            item.goodsOwner=item.ownerId,
            item.color=item.colorName,
            item.size=item.sizeName,
            item.brand=item.brandName
          })
          this.request(this.api.warehouse.warehouseBase_receiveOrder_insert,this.shop_user).then(res=>{
            console.log(res);
            this.$message({
              message: '保存成功',
              type: 'success',
              duration:1500
            });
            setTimeout(() => {
              this.$router.go(-1);
            }, 1500);
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //表单搜索-dialog
    searchFormData() {
      this.signData.pageIndex=1;
      this.getProductGoodsData();
    },
    //确认Btn的按钮点击事件-dialog
    sureBtnClickEvent() {
      if(this.multipleSelectionData){
        this.multipleSelectionData.forEach(item=>{
          this.$set(item,'orderQuantity',0)
        })
        let arr= this.$common.deepCopy(this.multipleSelectionData);
        this.shop_user.configurationOrderItemList=[...this.shop_user.configurationOrderItemList,...arr];
      }
      this.hideAddShopDialog();
      //去除重复对象
      this.shop_user.configurationOrderItemList=this.deteleItemListObject(this.shop_user.configurationOrderItemList)
    },
    //去除数组中的重复对象
    deteleItemListObject(arr) {
      var hash = {};
      const newArr = arr.reduce((item, next) => {
        hash[next.id] ? "" : (hash[next.id] = true && item.push(next));
        return item;
      }, []);
      return newArr;
    },
    //表格选择项改变时触发-dialog
    selectionChange(val) {
      this.multipleSelectionData = val;
    },
    //添加商品的dialog的隐藏事件
    hideAddShopDialog() {
      this.$refs.formData.resetFields();
      this.dialogTableVisible = false;
      this.multipleSelectionData =[]
    },
    //每页条数改变时-dialogTable
    dialogTableHandleSizeChange(page) {
      this.signData.pageSize = page;
      this.getProductGoodsData();
    },
    //当前页改变时-dialogTable
    dialogTableHandleCurrentChange(page) {
      this.signData.pageIndex = page;
      this.getProductGoodsData();
    }
  }
};
</script>

<style lang="less" scoped>
.detail_div {
  margin: 10px;
  .middle-msg {
    background-color: #fff;
    margin: 10px 0;
    padding: 10px 20px;
    font-size: 13px;
    .middle-title-div {
      border-bottom: 1px solid #dcdfe6;
      padding-bottom: 10px;
      margin-bottom: 20px;
      label {
        color: #222;
        margin-right: 10px;
      }
    }
    span {
      display: inline-block;
      margin-bottom: 15px;
      color: #2c3e50;
      padding-left: 20px;
    }
  }
  .table_div {
    padding: 0 15px;
    margin: 10px 0;
    background-color: #fff;
    .title-div {
      padding-top: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ccc;
      label {
        color: #222;
        font-size: 13px;
        margin-right: 10px;
      }
    }
  }
}
.dialog-div {
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 10px;
  padding-left: 20px;
  height: 53px;
}
.pagination {
  text-align: right;
  background-color: #fff;
}
</style>

