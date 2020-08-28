<template>
  <div>
    <div class="middle">
      <span>基本信息</span>
      <div class="input-div">
        <el-form
          ref="ruleForm"
          :inline="true"
          :model="signData"
          label-width="120px"
          :rules="rules"
          class="demo-ruleForm"
        >
          <div class="data-div">
            <div>
              <el-form-item label="组织机构：" prop="organization">
                <el-input v-model="signData.organization" disabled></el-input>
              </el-form-item>
              <br />
              <el-form-item label="采购单号：" prop="orderSn">
                <el-select
                  :disabled="supplierStatus"
                  @change="selectOrderSnListDataChange"
                  v-model="signData.orderSn"
                  placeholder="请选择单号"
                >
                  <el-option
                    v-for="(item,index) in OrderSnListData"
                    :label="item"
                    :key="index"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <br />
              <el-form-item label="收货类型：" prop="deliveryType">
                <el-select v-model="signData.deliveryType" placeholder="请选择供应商">
                  <el-option value="仓库收货"></el-option>
                  <!-- <el-option value="门店收货"></el-option> -->
                </el-select>
              </el-form-item>
              <br />
              <el-form-item label="物流公司：">
                <el-select
                  v-model="signData.logisticsCompany"
                  @change="selectLogisticsData"
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
              <br />
              <el-form-item label="物流单号：">
                <el-input placeholder="请输入内容" v-model="signData.logisticsOrderSn"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="供应商：" prop="supplier">
                <el-select
                  :disabled="supplierNameStatus"
                  @change="selectSupplierChange"
                  v-model="signData.supplier"
                  placeholder="请选择供应商"
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
              <el-form-item label="到货单号：" prop="arrivalSn">
                <el-input placeholder="请输入内容" v-model="signData.arrivalSn"></el-input>
              </el-form-item>
              <br />
              <el-form-item label="收货仓库：" prop="warehouse" v-if="selectStore">
                <el-select
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
              <el-form-item label="收货门店：" prop="storeName" v-else>
                <el-select
                  @change="selectStoreNameChange"
                  v-model="signData.storeName"
                  placeholder="请选择门店"
                >
                  <el-option
                    v-for="item in storeListData"
                    :label="item.name"
                    :key="item.id"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <br />
              <el-form-item label="预计到货日期：" prop>
                <el-date-picker v-model="signData.expectTime" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>

      <div class="table-view">
        <div class="title-div">
          <span>选择到货商品</span>
          <!-- <span @click="selectShopClickEvent">选择商品</span> -->
        </div>
        <div class="table-div">
          <el-table
            :data="signData.channelPurchaseArrivalOrderGoodsVOList"
            style="width: 100%"
            header-row-class-name="item-table-header"
            max-height="400"
          >
            <el-table-column prop="productCode" label="商品款号" align="center"></el-table-column>
            <el-table-column prop="code" label="商品货号" align="center"></el-table-column>
            <el-table-column prop="image" label="商品图片" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.image" style="width:32px;height:32px;" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="category" label="商品品类" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.category?scope.row.category:'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="specifications" label="规格属性" align="center">
              <template slot-scope="scope">
                <div class="span-btn">
                  <span>颜色：{{scope.row.color}}</span>
                  <span>尺码：{{scope.row.size}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="num" label="采购总量" align="center"></el-table-column>
            <el-table-column prop="actualQuantity" label="实收数量" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.actualQuantity?scope.row.actualQuantity:'0'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="currentQuantity" label="本次到货数量" align="center">
              <template slot-scope="scope">
                <el-input
                  @change="shopNumberChange($event,scope.row)"
                  min="0"
                  max="9"
                  type="number"
                  v-model="scope.row.currentQuantity"
                  placeholder="填写数量"
                  v-enter-number
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span class="quantity-span">累计到货总数：{{shopAllQuantity}}</span>
      </div>
      <div class="price-msg">
        <span class="other-msg">其他信息</span>
        <div class="remarks-textarea">
          <span>采购备注：</span>
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
import { constants } from "crypto";
export default {
  components: {
    codeSet,
    treeDept
  },
  data() {
    return {
      //标识到货总数
      shopAllQuantity:0,
      //采购订单号标识
      supplierStatus: true,
      //供应商标识
      supplierNameStatus: false,
      //标识门店或仓库(默认仓库)
      selectStore:true,
      signData: {
        //标识是仓库(030101)还是门店(030102)
        orderType:"",
        //组织机构
        organization: "",
        organizationCode: "",
        //供应商
        supplier: "",
        //收货类型
        deliveryType: "",
        arrivalSn: "",
        orderSn: "",
        //收货仓库
        warehouseCode: "",
        warehouse: "",
        //门店
        storeName:'',
        storeId:'',
        //货主
        goodsOwner:'',
        expectTime: "",
        //供货商编码
        supplierCode: "",
        contractNum: "",
        //采购备注
        remarks: "",
        //采购单号
        orderSnList: "",
        //物流公司名称
        logisticsCompany: "",
        //物流编码
        logisticsCompanyCode: "",
        //商品数据表
        channelPurchaseArrivalOrderGoodsVOList: []
      },
      rules: {
        supplier: [
          { required: true, message: "供货商不能为空", trigger: "change" }
        ],
        orderSn: [
          { required: true, message: "采购单号不能为空", trigger: "change" }
        ],
        organization: [
          { required: true, message: "组织机构不能为空", trigger: "change" }
        ],
        deliveryType: [
          { required: true, message: "收货类型不能为空", trigger: "change" }
        ],
        arrivalSn: [
          { required: true, message: "到货单号不能为空", trigger: "change" }
        ],
        warehouse: [
          { required: true, message: "仓库不能为空", trigger: "change" }
        ],
        storeName: [
          { required: true, message: "门店不能为空", trigger: "change" }
        ]
      },
      optionData: [],
      //采购单号数据
      OrderSnListData: [],
      //收货仓库--合格的仓库
      WarehouseCodeData: [],
      //获取物流数据
      logisticsListData: [],
      //获取门店列表数据
      storeListData:[],
      //填写的优惠金额
      price: "",
      formInline: {
        user: "",
        region: ""
      }
    };
  },
  created() {
    //得到组织机构数据
    this.getWarehouseListData();
    //获取物流数据
    this.getLogisticsList();
    //得到仓库数据
    this.getWarehouseList();
    if (this.$route.query.orderSn) {
      this.supplierNameStatus = true;
      console.log(this.$route.query.orderSn);
      this.getPurchasDetailListMsg(this.$route.query.orderSn);
      return;
    }
  },
  watch: {
    "signData.deliveryType":function(newValue){
      switch (newValue) {
        case "仓库收货":
          this.signData.orderType="030101",
          this.selectStore=true
          this.signData.storeName=''
          this.signData.warehouse=''
          this.signData.storeId=''
          break;
        case '门店收货':
          this.signData.orderType="030102",
          this.selectStore=false
          this.signData.warehouse=''
          this.signData.storeName=''
          this.signData.warehouseCode=''
          break;
      }
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
        // this.organizationListData=data
        //得到机构
        this.signData.organization = data.name;
        //得到机构code
        this.signData.organizationCode = data.id;
        //得到供货商数据
        this.getSupplierListData(this.signData.organizationCode);
        //获取货主列表
        this.getGoodsOwnerListData(this.signData.organizationCode);
        // //得到仓库数据
        // this.getWarehouseList(this.signData.organizationCode);
        //得到门店列表数据
        this.getStoreBasicListData(this.signData.organizationCode)
      });
    },
    //得到门店列表数据
    getStoreBasicListData(organizationId){
      this.request(this.api.retailStore.storeBasic_listBase,{organizationId:organizationId,type: "01"}).then(res=>{
        console.log(res)
        this.storeListData=res.data
      })
    },
    //获取货主列表
    getGoodsOwnerListData(organizationId) {
      this.request(this.api.system.goodsOwner_list, {
        orgId: organizationId
      }).then(data => {
        console.log(data.data);
        this.signData.goodsOwner = data.data[0].code;
      });
    },
    //得到表格数据
    getPurchasDetailListMsg(orderSn) {
      this.request(this.api.order.channelPurchaseOrder_getByOrderSn, {
        orderSn: orderSn,
        pageIndex:'',
        pageSize:''
      }).then(data => {
        this.signData.supplier = data.supplier;
        this.signData.orderSn = data.orderSn;
        this.signData.supplierCode = data.supplierCode;
        if (data.channelOrderGoodsVOList) {
          data.channelOrderGoodsVOList.data.forEach(item => {
            item.tax = data.tax;
            item.amount = item.num * item.actualAmount;
          });
        }
        this.signData.channelPurchaseArrivalOrderGoodsVOList = data.channelOrderGoodsVOList.data;
      });
    },
    //获取物流数据
    getLogisticsList() {
      //order.expressCompany_list
      this.request(this.api.warehouse.warehouseBase_logistics_list , {isValid:true}).then(res => {
        console.log(res);
        this.logisticsListData = res.data;
      });
    },
    //得到仓库列表
    getWarehouseList(orgId) {
      // this.request(this.api.system.warehouse_list, {
      //   used: true,
      //   orgId: orgId
      // }).then(data => {
      //   console.log(data);
      //   this.WarehouseCodeData = data.data;
      // });
      //新替换仓库接口
      this.request(this.api.warehouse.warehouseBase_warehouse_list, {
        isValid: true
      }).then(res => {
        console.log(res);
        this.WarehouseCodeData = res.data;
      });
    },
    //得到物流编码
    selectLogisticsData(val) {
      var logisticsCode = this.logisticsListData.find(
        item => item.name == val
      ).code;
      this.signData.logisticsCompanyCode = logisticsCode;
    },
    //得到采购单号的数据
    getOrderSnListData(supplierId) {
      this.request(this.api.order.channelPurchaseArrivalOrder_orderSnList, {
        supplierCode: supplierId
      }).then(data => {
        console.log(data);
        this.OrderSnListData = data;
      });
    },
    //得到供货商数据
    getSupplierListData(organizationId) {
      console.log(246);
      this.request(this.api.product.supplier_list, {
        organizationId: organizationId,
        cooperation: true
      }).then(data => {
        console.log(data);
        this.optionData = data.data;
      });
    },
    //采购单号,渲染列表数据
    selectOrderSnListDataChange(val) {
      this.request(this.api.order.channelPurchaseArrivalOrder_goods, {
        orderSn: val
      }).then(data => {
        console.log(data);
        this.shopAllQuantity=0
        this.signData.channelPurchaseArrivalOrderGoodsVOList = data;
      });
    },
    //存储供应商编码
    selectSupplierChange(val) {
      this.signData.orderSn = "";
      console.log(val);
      this.supplierStatus = false;
      let suppliceObj = this.optionData.find(item => item.name == val);
      this.signData.supplierCode = suppliceObj.code;
      this.getOrderSnListData(suppliceObj.code);
    },
    //收货仓库
    selectwarehouseCodeChange(val) {
      let warehouseObj = this.WarehouseCodeData.find(item => item.warehouseName == val);
      this.signData.warehouseCode = warehouseObj.warehouseCode;
    },
    //收货门店
    selectStoreNameChange(val){
      let storeId = this.storeListData.find(item => item.name == val).id;
      this.signData.warehouse=this.signData.storeName
      this.signData.warehouseCode = storeId;
    },
    //价格变化事件
    priceInputChangeEvent() {
      console.log(this.price);
    },
    //选择支付方式
    paySelectWay(item) {
      console.log(item);
    },
    //确认按钮的点击事件
    primaryBtnClick() {
      console.log("primaryBtnClick");
      this.signData.channelPurchaseArrivalOrderGoodsVOList.forEach(item => {
        item.quantity = item.num;
        if (!item.actualQuantity) {
          item.actualQuantity = 0;
        }
      });

      var filterData = this.signData.channelPurchaseArrivalOrderGoodsVOList.filter(item=>{
        return item.currentQuantity && item.currentQuantity!="0"
      })
      if(filterData.length>0){
      }else{
        this.$message.error('到货数量不能全部为0');
        return
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          switch (this.signData.deliveryType) {
            case "仓库收货":
              this.showBoxTipMsg("收货仓库：")
              break;
            case "门店收货":
              this.showBoxTipMsg("收货门店：")
              break;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //弹框提示(仓库或门店)
    showBoxTipMsg(name,fileteData){
      this.$confirm(
        "确认后，"+name+this.signData.warehouse+",将收到采购到货单？",
        "确认到货通知",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.saveWarehouseDataOrStoreData()
      }).catch(action=>{

      })
    },
    //仓库或门店收货接口
    saveWarehouseDataOrStoreData() {
      console.log("saveWarehouseDataOrStoreData")
      this.signData.channelPurchaseArrivalOrderGoodsVOList=this.signData.channelPurchaseArrivalOrderGoodsVOList.filter(item=>{
        return item.currentQuantity && item.currentQuantity!="0"
      })
      // this.signData.channelPurchaseArrivalOrderGoodsVOList.forEach(item => {
      //   item.currentQuantity=item.arrivalQuantity
      // });
      console.log("saveWarehouseData")
      this.request(
        this.api.order.channelPurchaseArrivalOrder_insert,
        this.signData
      ).then(data => {
        this.signData.channelPurchaseArrivalOrderGoodsVOList = [];
        //此处应该时上传成功后，再删除
        localStorage.removeItem("localTableData");
        this.$router.go(-1);
      });
    },
    //取消按钮的点击事件
    plainBtnClick() {
      this.$router.go(-1);
    },
    //当前商品数量发生改变了
    shopNumberChange(count, row) {
      console.log("227===========count");
      // row.actualQuantity = count;
      // console.log(this.signData.channelPurchaseArrivalOrderGoodsVOList);
      this.shopAllQuantity=0
      this.signData.channelPurchaseArrivalOrderGoodsVOList.forEach(item => {
        if(item.currentQuantity){
          this.shopAllQuantity+=parseFloat(item.currentQuantity)
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
/* .treeDept{
 backgroun
} */
.input-div {
  .data-div {
    width: 100%;
    display: flex;
    div:first-child {
      margin-right: 120px;
      // flex: 1;
    }
  }
  .last-data-div {
    width: 100%;
    display: flex;
    div:first-child {
      margin-right: 110px;
      // flex: 1;
    }
  }
  .orderNumber-div {
    display: flex;
    div:first-child {
      margin-right: 104px;
      // flex: 1;
    }
  }
}
.span-btn {
  width: 100px;
  text-align: center;
}
.recoment-input .contentInput {
  display: inline-block;
  width: 300px;
}
.remarks-textarea {
  display: flex;
  align-items: center;
}
.remarks-textarea .textarea {
  display: inline-block;
  width: 300px;
}
.label-style {
  display: inline-block;
  width: 68px;
}
.title {
  background-color: #fff;
  padding: 15px 0 15px 30px;
}
.title > span {
  display: inline-block;
  background-color: #fff;
  margin-left: 3px;
}
.middle {
  background-color: #fff;
  margin: 8px;
  margin-bottom: 0;
  height: 100%;
}
.middle > span {
  display: inline-block;
  margin: 20px 0 30px 30px;
}
.el-form-item__content {
  line-height: 40px;
  /* position: relative; */
  font-size: 14px;
  display: inline-block;
  /* margin-right: 150px; */
  // width: 300px;
  white-space: nowrap;
}
.el-select {
  display: inline-block;
  /* position: relative; */
  width: 130px;
  margin-right: 10px;
}
.table-view {
  /* margin-left: 30px; */
  /* margin-bottom: 20px; */
  padding: 0 30px;
  background-color: #fff;
}
.title-div {
  margin: 20px 0 30px;
}
.title-div span {
  background-color: #409eff;
  padding: 8px 20px;
  color: #fff;
  border-radius: 5px;
}
.title-div span:first-child {
  background-color: #fff;
  color: #222;
  padding: 0 8px;
  margin-right: 40px;
}
.money-div {
  background-color: #fff;
  width: 100%;
  text-align: right;
  padding-right: 30px;
  margin-top: 30px;
}
.input-price {
  display: inline-block;
  padding: 10px;
  width: 100px;
  border-radius: 5px;
}
.money-content {
  margin: 10px 0;
}
.price-msg {
  padding: 30px;
  background-color: #fff;
}
.price-msg > span {
  display: inline-block;
  margin-bottom: 20px;
}
.block {
  display: flex;
}
.block > span {
  display: inline-block;
  margin-right: 10px;
}

.btn-div {
  margin-left: 70px;
  margin-top: 30px;
}
.division-type {
  widows: 100%;
  // background-color: aquamarine;
  display: flex;
  justify-items: center;
}
.quantity-span{
  margin-top: 20px;
  display: inline-block;
  font-weight: 700;
  text-align: right;
  width: 100%;
}
</style>
