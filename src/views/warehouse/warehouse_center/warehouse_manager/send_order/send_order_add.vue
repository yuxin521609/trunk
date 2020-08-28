listProductGoods4Wms<template>
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
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-row :gutter="24">
          <el-col :span="5">
            <el-form-item label="出库类型：" prop="type">
              <el-select :disabled = "true" v-model="shop_user.type"  style="width:185px;">
                <el-option
                  v-for="item in warehouseTypeData"
                  :key="item.id"
                  :label="item.description"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收件人：" prop="consignee">
              <el-input v-model="shop_user.consignee" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="承运商名称：" prop="logisticsCode">
              <el-select
                v-model="shop_user.logisticsCode"
                style="width:185px;"
                @change="logisticsChangeEvent"
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
            <el-form-item label="原始订单号：" prop="associationSn">
              <el-input v-model="shop_user.associationSn" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="consigneeTelephone">
              <el-input v-model="shop_user.consigneeTelephone" placeholder="请输入" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="物流单号：" prop="logisticsSn">
              <el-input v-model="shop_user.logisticsSn" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="发货仓库：" prop="warehouse">
              <el-select
                v-model="shop_user.warehouse"
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
              <el-form-item label="货主：" prop="ownerCode">
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
            </el-form-item>
            <el-form-item prop='divisionId' label="收件地址：" inline>
              <division @set-division="setDivision" v-model="shop_user.divisionId"></division>
            </el-form-item>
            <el-form-item label="详细地址：" prop='consigneeAddress'>
              <el-input v-model="shop_user.consigneeAddress" placeholder="请输入"></el-input>
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
        :data="shop_user.businessOrderItemVO.list"
        stripe
        style="width: 100%;padding-left:15px;"
        header-row-class-name="item-table-header"
        max-height="400"
      >
        <el-table-column prop="code" label="商品编码" width="180"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="colorName" label="颜色"></el-table-column>
        <el-table-column prop="sizeName" label="尺码" width="180"></el-table-column>
        <el-table-column prop="brandName" label="品牌" width="180"></el-table-column>
        <el-table-column prop="cateName" label="品类"></el-table-column>
        <el-table-column prop="availableQuantity" label="可用数量" width="180"></el-table-column>
        <el-table-column prop="orderQuantity" label="订货数量">
          <template slot-scope="scope">
            <el-input-number v-model.number="scope.row.orderQuantity" size="mini" :min="0" :max="scope.row.availableQuantity" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="deleteBtnClick(scope.row.id)" type="text" size="small">删除明细</el-button>
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
        //标识校验库存
        effectiveStock:true,
        //仓库编码
        warehouseCode: '',
        pageIndex: 1,
        pageSize: 10
      },
      shop_user: {
        //发货单号
        orderSn: "",
        //关联单号
        associationSn: "",
        //出库类型
        type: "",
        //收货人
        consignee: "",
        //联系电话
        consigneeTelephone: "",
        //发货数量
        deliveryQuantity: "",
        //仓库编码
        warehouseCode: "",
        //仓库名称
        warehouse: "",
        //货主Id
        ownerId: "",
        //货主编码
        ownerCode: "",
        //货主
        goodsOwner: "",
        //承运商编码
        logisticsCode: "",
        //承运商
        logistics: "",
        //承运单号
        logisticsSn: "",
        //地址相关
        divisionId: "",
        consigneeProvince: "",
        provinceCode: "",
        consigneeCity: "",
        cityCode: "",
        consigneeArea: "",
        areaCode: "",
        consigneeAddress: "",
        businessOrderItemVO:{
          //表格数据
          list: []
        }
      },
      //规则
      rules: {
        warehouse: [
          { required: true, message: "发货仓库不能为空", trigger: "change" }
        ],
        consignee: [
          { required: true, message: "收货人不能为空", trigger: "blur" }
        ],
        divisionId:[
          { required: true, message: "收件地址不能为空", trigger: "change" }
        ],
        consigneeAddress:[
          { required: true, message: "详细地址不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "出库类型不能为空", trigger: "change" }
        ],
        consigneeTelephone: [{ required: true, trigger: "blur", validator: validPhone }],
        ownerCode: [
          { required: true, message: "货主不能为空", trigger: "change" }
        ]
      },
      //承运商数据
      logisticsData: [],
      //出库类型数据
      warehouseTypeData: [],
      //出库仓库数据
      warehouseData: [],
      //保存仓库临时
      tmpWarehouse:'',
      tmpGoodsOwner:'',
      //货主数据
      goodsOwnerData: [],
      //记录总的商品数
      totalPage: 0,
      //记录选中得数据
      multipleSelectionData:[],
    };
  },
  watch: {
    "shop_user.warehouse": function(newValue, oldValue) {
      this.tmpWarehouse = oldValue;
    },
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
        item => item.code == val
      );
      this.shop_user.logistics = logistics.name;
    },
    //得到出库类型数据
    getWarehouseData() {
      //得到出库类型数据 code==04
      this.request(
        this.api.warehouse.warehouseBase_configurationDictionaryByCode,
        { code: "CONFIGURABLE04" }
      ).then(res => {
        console.log(res);
        this.warehouseTypeData = res;
        this.shop_user.type="04003"
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
    //发货仓库change事件
    warehouseChangeEvent(val) {
      var list=this.shop_user.businessOrderItemVO.list
      if (list.length > 0) {
        this.$confirm("切换仓库后，已选商品会清除，确认切换仓库吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
           this.shop_user.businessOrderItemVO.list=[]
           this.getWarehouseIdAndCode(val);
          })
          .catch(action => {
            this.shop_user.warehouse = this.tmpWarehouse;
            this.getWarehouseIdAndCode(this.shop_user.warehouse);
          });
      } else {
        this.getWarehouseIdAndCode(val);
      }
    },
    //得到仓库编码
    getWarehouseIdAndCode(val) {
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
      var list=this.shop_user.businessOrderItemVO.list
      if (list.length > 0) {
        this.$confirm("切换货主后，已选商品会清除，确认切换货主吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
           this.shop_user.businessOrderItemVO.list=[]
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
      this.shop_user.ownerCode=goodsOwner.code;
      this.shop_user.ownerId = goodsOwner.id;
    },
    setDivision(var1) {
      this.shop_user.consigneeProvince = var1.province;
      this.shop_user.provinceCode = var1.provinceCode;
      this.shop_user.consigneeCity = var1.municipality;
      this.shop_user.cityCode = var1.municipalityCode;
      this.shop_user.consigneeArea = var1.area;
      this.shop_user.areaCode = var1.areaCode;
      this.shop_user.divisionId = var1.divisionId;
    },
    //添加商品按钮得点击事件
    addShopBtnClickEvent() {
      if (!this.shop_user.warehouseCode) {
        this.$message.error("请选择发货仓库");
        return;
      }
      if (!this.shop_user.ownerCode) {
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
      this.signData.inventoryStatusSet=[1];
        this.signData.warehouseCode=this.shop_user.warehouseCode
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
      var index=this.shop_user.businessOrderItemVO.list.findIndex(item=>item.id==id)
      this.shop_user.businessOrderItemVO.list.splice(index,1);
    },
    //提交订单Btn得点击事件
    submitOrderBtnClickEvent(){ 
      if(this.shop_user.businessOrderItemVO.list.length==0){
        this.$message.error("提交商品不能为空,请添加商品");
        return;
      }else{
        var flag=this.shop_user.businessOrderItemVO.list.every(item =>item.orderQuantity==0)
        if(flag){
          this.$message.error("提交商品订货数量不能全部为0");  
          return;
        }
      }
      this.shop_user.businessOrderItemVO.list.forEach(item =>{
        item.type=item.cateName
      })
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.shop_user.businessOrderItemVO.list=this.shop_user.businessOrderItemVO.list.filter(item =>item.orderQuantity>0)
          this.shop_user.businessOrderItemVO.list.forEach(item =>{
            item.goodsCode=item.code,
            item.color=item.colorName,
            item.size=item.sizeName,
            item.brand=item.brandName
          })
          this.request(this.api.warehouse.warehouseBase_deliveryOrder_insert,this.shop_user).then(res=>{
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
        this.shop_user.businessOrderItemVO.list=[...this.shop_user.businessOrderItemVO.list,...arr];
      }
      this.hideAddShopDialog();
      //去除重复对象
      this.shop_user.businessOrderItemVO.list=this.deteleItemListObject(this.shop_user.businessOrderItemVO.list)
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

