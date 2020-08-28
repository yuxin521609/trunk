<template>
  <div class="content">
    <label>基本信息</label>
    <div class="form_div">
      <el-form
        :model="signData"
        ref="formData"
        :inline="true"
        :rules="rules"
        class="demo-form-inline"
      >
        <div class="input-div">
          <div>
          <el-form-item label="组织机构：" prop="organization">
            <el-input v-model="signData.organization" disabled></el-input>
          </el-form-item>
          <br />
          <el-form-item label="供应商：" prop="supplier" style="width:350px;padding-left:15px;">
              <el-select
                :class="supplierSelect?'disableSelect':''"
                @change="selectSupplierData"
                v-model="signData.supplier"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionData"
                  :label="item.name"
                  :key="item.id"
                  :value="item.name"
                ></el-option>
              </el-select>
          </el-form-item>
           <br />
          <el-form-item label="退货地址：" prop="addressId">
            <division @set-division="setDivision" v-model="signData.addressId"></division>
          </el-form-item>
           <br />
          <el-form-item label="物流公司：">
            <el-select
              @change="selectLogisticsData"
              v-model="signData.logisticsCompany"
              placeholder="请选择物流公司"
            >
              <el-option
                v-for="item in logisticsListData"
                :label="item.name"
                :key="item.id"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
            <el-form-item label="退货日期：" style="width:350px;padding-left:10px;">
              <el-date-picker v-model="signData.refundTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <br />
            <el-form-item label="出库仓库：" prop="warehouse">
              <el-select
                :class="warehouseSelect?'disableSelect':''"
                @change="selectwarehouseCodeChange"
                v-model="signData.warehouse"
                placeholder="请选择仓库"
              >
                <el-option
                  v-for="item in WarehouseCodeData"
                  :label="item.warehouseName"
                  :key="item.id"
                  :value="item.warehouseName"
                ></el-option>
              </el-select>
            </el-form-item>
            <br />
            <el-form-item label="详细地址：" prop="addressInfo">
              <el-input v-model="signData.addressInfo" placeholder="请输入内容"></el-input>
            </el-form-item>
            <br />
            <el-form-item label="物流单号：" style="width:350px;padding-left:10px;">
              <el-input v-model="signData.logisticsOrderSn" placeholder="请输入内容"></el-input>
            </el-form-item>
        </div>
       </div>
      </el-form>
      <div class="table_msg">
        <div class="title_span">
          <span>商品信息</span>
          <span class="select_shop_title" @click="selectShopClickEvent">选择商品</span>
        </div>
        <div class="table_div">
          <el-table
            :data="signData.channelOrderGoodsVOList"
            stripe
            style="width: 100%"
            header-row-class-name="item-table-header"
            max-height="400"
          >
            <el-table-column prop="productCode" label="商品款号" width="180"></el-table-column>
            <el-table-column prop="code" label="商品货号" width="180"></el-table-column>
            <el-table-column prop="image" label="商品图片">
              <template slot-scope="scope">
               <img :src="scope.row.image" style="width:32px;height:32px;"/>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
            <el-table-column prop="type" label="商品类型" width="180">
              <template slot-scope="scope">
                {{scope.row.type?scope.row.type:'--'}}
              </template>
            </el-table-column>
            <el-table-column prop="brandName" label="品牌">
              <template slot-scope="scope">
                {{scope.row.brandName?scope.row.brandName:'--'}}
              </template>
            </el-table-column>
            <el-table-column prop="fullCateName" label="商品品类" width="180"></el-table-column>
            <el-table-column label="规格属性" width="180">
              <template slot-scope="scope">
                <span>颜色：{{scope.row.color}}</span>
                <br />
                <span>尺寸：{{scope.row.size}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="refundAmount" label="采购退货单价" width="120" align="center">
              <template slot-scope="scope">
                <div class="tag_div">
                  <span>￥</span>
                  <el-input
                    @input="refundAmountChange"
                    min="0"
                    max="9"
                    type="number"
                    v-model="scope.row.refundAmount"
                    placeholder="请输入"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="returnQuantity" label="退货数量" width="180" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.returnQuantity"
                  @change="returnQuantityChange"
                  :min="0"
                  :max="scope.row.availableQuantity"
                  v-enter-number
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="money-div">
          <span>采退金额：￥{{signData.amount?signData.amount:'0.00'}}</span>
          <div class="money-content">
            <span>折损金额：</span>
            <input type="text" class="input-price" placeholder="描述折损" />
            <span>￥</span>
            <input
              type="number"
              min="0"
              max="100"
              @change="priceInputChangeEvent"
              class="input-price"
              v-model="signData.breakageAmount"
              placeholder="0.00"
              :disabled="!signData.amount"
            />
          </div>
          <span>退款应付金额：￥{{signData.returnAmount?signData.returnAmount:'0.00'}}</span>
        </div>
        <div class="remarks-textarea">
          <span>退货备注：</span>
          <el-input
            class="textarea"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="signData.remarks"
            resize="none"
          ></el-input>
        </div>
        <div class="btn-div">
          <el-button type="primary" @click="primaryBtnClick" size="small">确认</el-button>
          <el-button plain @click="plainBtnClick" size="small">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import codeSet from "@/components/codeSet";
import treeDept from "@/components/treeDept";
import division from "@/components/division";
export default {
  components: {
    codeSet,
    treeDept,
    division
  },
  data() {
    return {
      signData: {
        orderType:'0302',
        //供应商
        supplier:'',
        //部门Id
        relationDepId:'',
        //供应商编码
        supplierCode:'',
        //退货备注
        remarks: "",
        //组织机构
        organizationCode: "",
        organization:'',
        //退货日期
        refundTime: "",
        //货主
        goodsOwner:'',
        //收货仓库
        warehouse: "",
        warehouseCode:'',
        //采退金额
        amount:'',
        //折损金额
        breakageAmount: "",
        //应付金额
        returnAmount:'',
        //备注
        remarks:'',
        //地址相关
        addressId: "",
        provinceName: "",
        provinceCode: "",
        cityName: "",
        cityCode: "",
        areaName: "",
        areaCode: "",
        addressInfo: "",
        //物流单号
        logisticsOrderSn: "",
        //物流公司
        logisticsCompany: "",
        logisticsCompanyCode:"",
        //表格数据
        channelOrderGoodsVOList: []
      },
      rules: {
        organization: [
          { required: true, message: "请选择组织机构", trigger: "change" }
        ],
        warehouse: [
          { required: true, message: "请选择收货仓库", trigger: "change" }
        ],
        orderSn: [
          { required: true, message: "请选择或输入订单号", trigger: "change" }
        ],
        logisticsList: [
          { required: true, message: "请选择物流公司", trigger: "change" }
        ],
        addressId: [
          { required: true, message: "地址不能为空", trigger: "blur" }
        ],
        addressInfo: [
          { required: true, message: "详细地址不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "商户姓名不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        logisticsOrderSn: [
          { required: true, message: "物流单号不能为空", trigger: "blur" }
        ],
        supplier:[
          { required: true, message: "供应商不能为空", trigger: "change" }
        ]
      },
      //收货仓库--合格的仓库
      WarehouseCodeData: [],
      //获取物流数据
      logisticsListData: [],
      //标识popover的显示或隐藏
      visible: false,
      //得到供应商数据
      optionData:[],
      //保存仓库当前的名称
      tmpWarehouse: "",
      //标识供应商
      supplierSelect:false,
      //标识仓库
      warehouseSelect:false,

    };
  },
  mounted() {
    let _type = localStorage.getItem("type") || "";
    //得到组织机构数据
    this.getWarehouseListData();
    //得到物流数据
    this.getLogisticsList();
    if (_type == "add") {
      localStorage.removeItem("localTableData");
      localStorage.removeItem("shopMsgData");
      localStorage.removeItem("allShopPrice");
      this.signData.channelOrderGoodsVOList = [];
    } else {
      var localTableData = localStorage.getItem("localTableData");
      var shopData = localStorage.getItem("shopMsgData");
      this.$nextTick(() => {
        this.signData = JSON.parse(shopData);
        this.signData.channelOrderGoodsVOList = JSON.parse(localTableData);
        if(this.signData.channelOrderGoodsVOList && this.signData.channelOrderGoodsVOList.length>0){
          this.signData.channelOrderGoodsVOList.forEach(item=>{
            this.$set(item,'returnQuantity',item.num)
            this.$set(item,'refundAmount',item.purchasePrice)
          })
          console.log( this.signData.channelOrderGoodsVOList);
        }
        //赋值订单总金额
        var amount = localStorage.getItem("allShopPrice");
        this.signData.amount=parseFloat(amount).toFixed(2)
        this.signData.returnAmount = parseFloat(amount).toFixed(2);
        //得到当前的供应商
        this.tmpSupplier=this.signData.supplier
        //得到当前的仓库名称
        this.tmpWarehouse = this.signData.warehouse;
        //得到仓库数据
        this.getWarehouseList(this.signData.organizationCode);
      });
    }
  },
  watch: {
    //监听仓库的变化
    "signData.warehouse": function(newValue, oldValue) {
      this.tmpWarehouse = oldValue;
    },
    //监听供应商的变化
    "signData.supplier": function(newValue, oldValue) {
      this.tmpSupplier = oldValue;
    },
    //监听折损价格的变化
    "signData.breakageAmount":function(newBreakageAmount,oldBreakageAmount){
      var returnAmount = this.signData.amount - newBreakageAmount;
      this.signData.returnAmount = returnAmount.toFixed(2)
    }
  },
  methods: {
    //得到组织机构数据
    async getWarehouseListData() {
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      console.log(info);
      //得到部门Id
      this.signData.relationDepId = info.departId;

      this.request(this.api.user.userCompany_getUserOrgByUserId, {
        userId: info.userId,
        type: 0
      }).then(data => {
        console.log(data);
        //得到机构
        this.signData.organization = data.name;
        //得到机构code
        this.signData.organizationCode = data.id;
        //获取货主列表
        this.getGoodsOwnerListData(this.signData.organizationCode);
        //得到仓库数据
        this.getWarehouseList(this.signData.organizationCode);
        //得到供货商数据
        this.getSupplierListData(this.signData.organizationCode)
      });
    },
    //获取货主列表
    getGoodsOwnerListData(organizationId) {
      this.request(this.api.system.goodsOwner_list, {
        orgId: organizationId
      }).then(data => {
        console.log(data.data);
        // this.signData.goodsOwner = data.data[0].code;
      });
    },
    //得到物流编码
    selectLogisticsData(val) {
      var logisticsCode = this.logisticsListData.find(
        item => item.name == val
      ).code;
      this.signData.logisticsCompanyCode = logisticsCode;
    },
    //得到供货商数据
    getSupplierListData(organizationId) {
      console.log(246);
      this.request(this.api.product.supplier_list, {organizationId:organizationId,cooperation:true}).then(data => {
        console.log(data);
        this.optionData = data.data;
      });
    },
    setDivision(var1) {
      this.signData.provinceName = var1.province;
      this.signData.provinceCode = var1.provinceCode;
      this.signData.cityName = var1.municipality;
      this.signData.cityCode = var1.municipalityCode;
      this.signData.areaName = var1.area;
      this.signData.areaCode = var1.areaCode;
      this.signData.addressId = var1.divisionId;
    },
    //得到仓库列表
    getWarehouseList(orgId) {
      this.request(this.api.warehouse.warehouseBase_warehouse_list, {
        isValid: true
      }).then(res => {
        console.log(res);
        this.WarehouseCodeData = res.data;
      });
    },
    //获取物流数据
    getLogisticsList() {
      console.log('getLogisticsList---')
      this.request(this.api.warehouse.warehouseBase_logistics_list , {isValid:true}).then(res => {
        console.log(res);
        this.logisticsListData = res.data;
      });
    },
    //得到供应商编码
    selectSupplierData(val){
      if(this.signData.channelOrderGoodsVOList && this.signData.channelOrderGoodsVOList.length>0){
        this.$confirm("确认切换吗,切换后需重新选择商品", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=>{
          this.signData.channelOrderGoodsVOList=[]
          localStorage.removeItem("localTableData");
          this.signData.returnAmount = this.signData.amount = '';
          localStorage.removeItem("allShopPrice")
          this.getSupplierCode(val)
        }).catch(actions=>{
          this.signData.supplier=this.tmpSupplier
          this.getSupplierCode(this.signData.supplier);
        })
      }else{
        this.getSupplierCode(val)
      }

    },
    //得到供应商code码
    getSupplierCode(val){
      console.log(val)
      this.supplierSelect=false
      var supplierCode = this.optionData.find(item => item.name == val).code;
      this.signData.supplierCode = supplierCode;
    },
    //收货仓库
    selectwarehouseCodeChange(val) {
      if(this.signData.channelOrderGoodsVOList && this.signData.channelOrderGoodsVOList.length>0){
        this.$confirm("确认切换吗,切换后需重新选择商品", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=>{
          this.signData.channelOrderGoodsVOList=[]
          localStorage.removeItem("localTableData");
          this.signData.returnAmount = this.signData.amount = '';
          localStorage.removeItem("allShopPrice")
          this.getWarehouseIdAndCode(val)
        }).catch(actions=>{
          this.signData.warehouse=this.tmpWarehouse
          this.getWarehouseIdAndCode(this.signData.tmpWarehouse);
        })
      }else{
        this.getWarehouseIdAndCode(val)
      }

    },
    //得到仓库编码和id
    getWarehouseIdAndCode(val) {
      this.warehouseSelect=false
      var code = this.WarehouseCodeData.find(item => item.warehouseName == val).warehouseCode;
      this.signData.warehouseCode = code;
    },
    //选择商品的点击事件
    selectShopClickEvent() {
      if(this.signData.warehouse && this.signData.supplier){
        this.supplierSelect=false
        this.warehouseSelect=false
        this.$router.push({
          path:'/OS/business/purchaseReturn/purchaseReturn_shop',
          query: {
            ownerId:this.signData.goodsOwner,
            organizationName: this.signData.organization,
            warehouseId: this.signData.warehouseCode,
            warehouseName: this.signData.warehouse
          }
        })
        //存储填写的信息
        localStorage.setItem("shopMsgData", JSON.stringify(this.signData));
        localStorage.setItem("localTableData",JSON.stringify(this.signData.channelOrderGoodsVOList));
      }else{
        if(this.signData.warehouse){
          this.warehouseSelect=false
        }else{
          this.warehouseSelect=true
        }
        if(this.signData.supplier){
          this.supplierSelect=false
        }else{
          this.supplierSelect=true
        }
      }
    },
    //监听退货单价的变化
    refundAmountChange(val){
      console.log(val)
      var amount = 0;
      this.signData.channelOrderGoodsVOList.forEach(item => {
        amount += item.refundAmount * item.returnQuantity;
      });
      this.signData.amount=amount.toFixed(2)
      if(this.signData.breakageAmount){
          this.signData.returnAmount =parseFloat(amount-Number(this.signData.breakageAmount)).toFixed(2)
        }else{
          this.signData.returnAmount = parseFloat(amount).toFixed(2);
        }
      // this.signData.returnAmount = amount.toFixed(2)
    },
    //优惠金额
    priceInputChangeEvent(val) {
      console.log(this.signData.breakageAmount);
      var breakageAmount=val.target.value.match(/^\d*(\.?\d{0,2})/g)
      this.signData.breakageAmount=breakageAmount[0]
    },
    //监听退货数量的变化
    returnQuantityChange(val) {
      console.log(val)
      var amount = 0;
      this.signData.channelOrderGoodsVOList.forEach(item => {
        amount += item.refundAmount * item.returnQuantity;
      });
      this.signData.amount=amount.toFixed(2)
       if(this.signData.breakageAmount){
          this.signData.returnAmount =parseFloat(amount-Number(this.signData.breakageAmount)).toFixed(2)
        }else{
          this.signData.returnAmount = parseFloat(amount).toFixed(2);
        }
      // this.signData.returnAmount = amount.toFixed(2)
    },
    //确认btn的点击事件
    primaryBtnClick() {
      var self=this
      this.$refs.formData.validate(valid => {
        if (valid) {
          console.log("dasdasd");
          let channelOrderGoodsVOList = self.signData.channelOrderGoodsVOList.filter(item => {
            return item.returnQuantity != 0;
          });
          if(channelOrderGoodsVOList.length==0){
            this.$message.error('退货商品数量不能全部为0');
            return
          }
          this.signData.channelOrderGoodsVOList=channelOrderGoodsVOList
          this.request(
            this.api.order.channelRetundOrder_insert,
            this.signData
          ).then(data => {
            console.log("270===========");
            //重置
             if (data && data.length) {
              let html = "";
              data.forEach(errItem => {
                for (let i = 0; i <  this.signData.channelOrderGoodsVOList.length; i++) {
                  if ( this.signData.channelOrderGoodsVOList[i].code == errItem.code) {
                    if (errItem.qty == 0) {
                      this.signData.channelOrderGoodsVOList.splice(i, 1);
                      html += "<p>" + errItem.code + "：可用库存为0，已删除该商品；</p>";
                    } else {
                      html += "<p>" + errItem.code + "：可用库存不足，已更新为最大值" + errItem.qty + "；</p>";
                      this.signData.channelOrderGoodsVOList[i].availableQuantity = errItem.qty;
                      // this.signData.channelOrderGoodsVOList[i].num = errItem.qty;
                    }
                    break;
                  }
                }
              });
              this.$notify({
                title: "提示",
                duration: 0,
                dangerouslyUseHTMLString: true,
                message: html
              });
            } else {
              this.$notify.success({ title: "成功", message: "新增成功" });  
              //重置
              localStorage.removeItem("localTableData");
              this.$refs.formData.resetFields();
              this.signData.channelOrderGoodsVOList = [];
              this.$router.go(-1)
            }    
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消btn的点击事件
    plainBtnClick() {
      this.$router.go(-1);
    },
    //每页条数改变时
    handleSizeChange(page) {
      this.signData.pageSize = page;
    },
    //当前页改变时
    handleCurrentChange(page) {
      this.signData.pageIndex = page;
    },
    //选择Btn的点击事件
    selectBtnClick(row) {
      console.log(row);
    },
    //搜索
    gridFormDataSearch() {
      console.log(this.gridTableData.searchKey)
      console.log(this.gridTableData.channelCodes)
    },
    //重置
    gridFormDataResetFilters(gridFormData) {
      this.$refs[gridFormData].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.disableSelect /deep/ .el-input .el-input__inner{
  border: 1px solid red;
}
.input-div {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.content {
  background-color: #fff;
  padding: 20px;
  .form_div {
    margin-top: 20px;
  }
  .order_div {
    position: relative;
    line-height: 15px;
    .select_order_label {
      display: inline-block;
      width: 35px;
      text-align: center;
      position: absolute;
      right: -40px;
      top: 0;
      color: #409eff;
    }
  }
  .tag_div {
    display: flex;
    align-items: center;
  }
  .table_msg {
    margin-top: 10px;
    .select_shop_title {
      margin-left: 40px;
      background-color: #409eff;
      padding: 8px 10px;
      color: #fff;
      border-radius: 5px;
    }
  }
  .table_div {
    margin-top: 30px;
  }
  .money-div {
    background-color: #fff;
    width: 100%;
    text-align: right;
    padding-right: 30px;
    margin-top: 30px;
    .input-price {
      display: inline-block;
      padding: 10px;
      width: 100px;
      border-radius: 5px;
    }
    .money-content {
      margin: 10px 0;
    }
  }
  .remarks-textarea {
    margin-top: 20px;
    .textarea {
      display: inline-block;
      width: 300px;
    }
  }
  .btn-div {
    margin-left: 70px;
    margin-top: 30px;
  }
}
</style>

