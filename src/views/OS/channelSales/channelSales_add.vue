<template>
  <div>
    <div class="middle">
      <span>基本信息</span>
      <div>
        <el-form
          :inline="true"
          :model="shop_user"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <div class="input-div">
            <div class="left_div">
              <!-- <el-form-item label="商户名称：" prop="storeName">
                            <el-input placeholder='请输入商户名称' v-model="shop_user.storeName"></el-input>
              </el-form-item>-->

              <!-- <el-form-item label="订单来源：" prop="channelCode">
                           <code-set v-model="shop_user.channelCode" code="ORD001" style="width:180px;"/>
              </el-form-item>-->
              <el-form-item label="组织机构：" prop="organization">
                <el-input v-model="shop_user.organization" disabled></el-input>
              </el-form-item>
              <br />
              <el-form-item label="收货人：" prop="receiverName">
                <el-input
                  placeholder="请输入收货人名称"
                  v-model="shop_user.receiverName"
                  @input="receiverNameValueChange"
                ></el-input>
              </el-form-item>
              <br />
              <el-form-item prop="addressId" label="收货地址：">
                <division @set-division="setDivision" v-model="shop_user.addressId"></division>
              </el-form-item>
              <br />
              <el-form-item label="出库仓库：" prop="warehouse">
                <el-select
                  v-model="shop_user.warehouse"
                  @change="getWarehouseCode"
                  placeholder="请选择仓库"
                  :disabled="isDisable"
                >
                  <el-option
                    v-for="item in WarehouseCodeData"
                    :label="item.name"
                    :key="item.id"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <br />
              <el-form-item label="物流公司：">
                <el-select
                  v-model="shop_user.logisticsCompany"
                  @change="selectLogisticsData"
                  placeholder="请选择物流公司"
                >
                  <el-option
                    v-for="item in logisticsListData"
                    :label="item.company"
                    :key="item.id"
                    :value="item.company"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="right_div">
              <el-form-item label="购买商户：" prop="storeName">
                <el-autocomplete
                  :disabled="isDisable"
                  v-model="shop_user.storeName"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  :trigger-on-focus="false"
                  @select="handleSelect"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.storeName }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <br />
              <el-form-item label="联系电话：" prop="receiverMobile">
                <el-input placeholder="请输入联系电话" v-model="shop_user.receiverMobile"></el-input>
              </el-form-item>
              <br />
              <el-form-item label="详细地址：" prop="addressInfo">
                <el-input placeholder="请输入详细地址" v-model="shop_user.addressInfo"></el-input>
              </el-form-item>
              <br />
              <el-form-item label="出货日期：">
                <el-date-picker v-model="shop_user.warehouseTime" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <br />
              <el-form-item label="物流单号：">
                <el-input placeholder="请输入单号" v-model="shop_user.logisticsOrderSn"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>

      <div class="table-view">
        <div class="title-div">
          <span>商品信息</span>
          <span @click="selectShopClickEvent">选择商品</span>
        </div>
        <div class="table-div">
          <el-table
            :data="shop_user.channelSaleOrderGoodsVOList"
            style="width: 100%"
            header-row-class-name="item-table-header"
            max-height="400"
          >
            <el-table-column prop="productCode" label="商品款号" width align="center"></el-table-column>
            <el-table-column prop="code" label="商品货号" width="200" align="center"></el-table-column>
            <el-table-column prop label="商品图片" width>
              <template slot-scope="scope">
                <img :src="scope.row.image" style="width:64px;height:64px;" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width align="center"></el-table-column>
            <el-table-column prop label="商品类型" width align="center">
              <template slot-scope="scope">
                <span>{{scope.row.type!=null?scope.row.type:'成品'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="brandName" label="品牌" width align="center"></el-table-column>
            <el-table-column prop="fullCateName" label="商品品类" width="120" align="center"></el-table-column>
            <el-table-column prop label="商品规格" width align="center">
              <template slot-scope="scope">
                <span>颜色：{{scope.row.color}}</span>
                <br />
                <span>尺寸：{{scope.row.size}}</span>
              </template>
            </el-table-column>
            <el-table-column label="销售单价" width align="center">
              <template slot-scope="scope">
                <div class="tag_div">
                  <span>￥</span>
                  <el-input
                    v-model="scope.row.retailPrice"
                    @input="retailPriceValueChangeEvent"
                    placeholder="0.00"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="num" label="数量" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.num"
                  @change="currentNumberChange"
                  :min="0"
                  :max="scope.row.availableQuantity"
                  v-enter-number
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="money-div">
          <span>商品总金额：￥{{shop_user.amount?shop_user.amount:'0.00'}}</span>
          <div class="money-content">
            <span>优惠金额：</span>
            <input
              type="text"
              class="input-price"
              v-model="shop_user.preferentialRemarks"
              placeholder="填写优惠项"
              @input="preferentialRemarksInputChange"
            />
            <span>￥</span>
            <input
              type="number"
              @input="preferentialAmountInputValueChange"
              class="input-price"
              v-model="shop_user.preferentialAmount"
              :disabled="!shop_user.amount"
              placeholder="0.00"
            />
          </div>
          <span>订单金额：￥{{shop_user.actualAmount?shop_user.actualAmount:''}}</span>
        </div>
      </div>
      <div class="price-msg">
        <span>付款信息</span>
        <el-form :inline="true" :model="shop_user" ref="formInlineFrom" class="demo-form-inline">
          <el-form-item label="实付金额：">
            <el-input
              type="number"
              v-model="shop_user.validAmount"
              @input="validAmountValueChangeEvent"
              placeholder="0.00"
            ></el-input>
          </el-form-item>
          <el-form-item label="支付流水号(支付单据)：">
            <el-input v-model="shop_user.orderTradeNo" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="支付方式：">
            <code-set v-model="shop_user.paymentCode" code="COM003" />
          </el-form-item>
          <el-form-item>
            <div class="block">
              <span class="demonstration">支付时间:</span>
              <el-date-picker v-model="shop_user.paymentTime" type="date" placeholder="选择日期"></el-date-picker>
            </div>
          </el-form-item>
        </el-form>

        <span class="other-msg">其他信息</span>

        <div class="recoment-input">
          <span>推荐人：</span>
          <el-input
            class="contentInput"
            v-model="shop_user.recommend"
            @input="recommendValueChange"
            placeholder="请输入内容"
          ></el-input>
        </div>
        <div class="remarks-textarea">
          <span>订单备注：</span>
          <el-input
            class="textarea"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="shop_user.remarks"
            resize="none"
            @input="remarksValueChange"
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
import division from "@/components/division";
import treeDept from "@/components/treeDept";
import { isvalidPhone } from "@/utils/phonevalide";
import { async } from "q";
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
    codeSet,
    division,
    treeDept
  },
  data() {
    return {
      shop_user: {
        orderType: "0201",
        channelCode: "",
        //组织机构编码
        organizationCode: "",
        //机构名称
        organization: "",
        //机构Id
        organizationId: "",
        //物流公司名称
        logisticsCompany: "",
        //货主名称
        goodsOwner: "",
        //物流公司编码
        logisticsCompanyCode: "",
        //出库仓库-名称
        warehouse: "",
        //出库仓库-编码
        warehouseCode: "",
        //部门Id
        relationDepId: "",
        //购买商户
        storeName: "",
        //商户Id
        storeId: "",
        //物流单号
        logisticsOrderSn: "",
        //出货日期
        warehouseTime: "",
        receiverName: "",
        receiverMobile: "",
        orderTradeNo: "",
        //支付方式
        paymentCode: "",
        //选择日期
        paymentTime: "",
        //商品总金额
        amount: "",
        //优惠项内容
        preferentialRemarks: "",
        //优惠金额
        preferentialAmount: "",
        //订单金额
        actualAmount: "",
        //实付金额
        validAmount: "0.00",
        //订单备注
        remarks: "",
        //推荐人
        agent: "",
        addressId: "",
        provinceName: "",
        provinceCode: "",
        cityName: "",
        cityCode: "",
        areaName: "",
        areaCode: "",
        addressInfo: "",
        //商品数据表
        channelSaleOrderGoodsVOList: []
      },

      rules: {
        orderSources: [
          { required: true, message: "订单来源不能为空", trigger: "change" }
        ],
        storeName: [
          { required: true, message: "商户名称不能为空", trigger: "blur" }
        ],
        receiverName: [
          { required: true, message: "收货人不能为空", trigger: "blur" }
        ],
        receiverMobile: [
          { required: true, trigger: "blur", validator: validPhone }
        ],
        addressId: [
          { required: true, message: "地址不能为空", trigger: "blur" }
        ],
        addressInfo: [
          { required: true, message: "详细地址不能为空", trigger: "blur" }
        ],
        organization: [
          { required: true, message: "组织机构不能为空", trigger: "change" }
        ],
        warehouse: [
          { required: true, message: "出库仓库不能为空", trigger: "blur" }
        ]
      },
      //获取组织机构数据
      organizationListData: [],
      //获取物流数据
      logisticsListData: [],
      //收货仓库--合格的仓库
      WarehouseCodeData: [],
      //商铺名称联想数据
      restaurants: [],
      //标识仓库和商户
      isDisable: true,
      //选中的仓库Id
      warehouseId: "",
      //保存仓库当前的名称
      tmpWarehouse: ""
    };
  },
  watch: {
    "shop_user.preferentialAmount": function(newPrice) {
      //计算金额
      var actualAmount = this.shop_user.amount - newPrice;
      this.shop_user.actualAmount = actualAmount.toFixed(2);
    },
    "shop_user.organization": function(newPrice) {
      if (newPrice == "") {
        this.isDisable = true;
      } else {
        this.isDisable = false;
      }
    },
    "shop_user.warehouse": function(newValue, oldValue) {
      this.tmpWarehouse = oldValue;
    }
  },
  created() {
    let _type = localStorage.getItem("type") || "";
    //得到组织机构数据
    this.getWarehouseListData();
    //获取物流数据
    this.getLogisticsList();
    console.log(_type);
    if (_type == "add") {
      localStorage.removeItem("localTableData");
      localStorage.removeItem("shopMsgData");
      localStorage.removeItem("allShopPrice");
      this.isDisable = true;
      this.shop_user.channelSaleOrderGoodsVOList = [];
    } else {
      var localTableData = localStorage.getItem("localTableData");
      var shopData = localStorage.getItem("shopMsgData");
      this.$nextTick(() => {
        this.isDisable = false;
        this.shop_user = JSON.parse(shopData);
        this.shop_user.channelSaleOrderGoodsVOList = JSON.parse(localTableData);
        if (
          this.shop_user.channelSaleOrderGoodsVOList &&
          this.shop_user.channelSaleOrderGoodsVOList.length > 0
        ) {
          this.shop_user.channelSaleOrderGoodsVOList.forEach(item => {
            item.sellPrice = item.retailPrice;
          });
        }
        //赋值订单总金额
        var amount = localStorage.getItem("allShopPrice");
        this.shop_user.amount = parseFloat(amount).toFixed(2);
        this.shop_user.actualAmount = parseFloat(amount).toFixed(2);

        //得到当前的仓库名称
        this.tmpWarehouse = this.shop_user.warehouse;
        //得到仓库数据
        this.getWarehouseList(this.shop_user.organizationId);
        console.log("259========1");
      });
    }
  },
  methods: {
    //得到组织机构数据
    async getWarehouseListData() {
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      console.log(info);
      //得到部门Id
      this.shop_user.relationDepId = info.departId;

      this.request(this.api.user.userCompany_getUserOrgByUserId, {
        userId: info.userId,
        type: 0
      }).then(data => {
        console.log(data);
        // this.organizationListData=data
        //得到机构
        this.shop_user.organization = data.name;
        //得到机构code
        this.shop_user.organizationCode = data.id;
        //得到机构id
        this.shop_user.organizationId = data.id;
        //获取货主列表
        this.getGoodsOwnerListData(this.shop_user.organizationId);
        //得到仓库数据
        this.getWarehouseList(this.shop_user.organizationId);
      });
    },
    //获取货主列表
    getGoodsOwnerListData(organizationId) {
      this.request(this.api.system.goodsOwner_list, {
        orgId: organizationId
      }).then(data => {
        console.log(data.data);
        this.shop_user.goodsOwner = data.data[0].code;
      });
    },
    //获取物流数据
    getLogisticsList() {
      this.request(this.api.order.expressCompany_list, {}).then(data => {
        console.log(data);
        this.logisticsListData = data.data;
      });
    },
    //得到物流编码
    selectLogisticsData(val) {
      var logisticsCode = this.logisticsListData.find(
        item => item.company == val
      ).code;
      this.shop_user.logisticsCompanyCode = logisticsCode;
    },
    //得到仓库列表
    getWarehouseList(id) {
      //departId--根据组织机构得到相对应的仓库
      this.request(this.api.system.warehouse_list, {
        used: true,
        orgId: id
      }).then(data => {
        this.WarehouseCodeData = data.data;
      });
    },
    //得到仓库编码
    getWarehouseCode(val) {
      if (
        this.shop_user.channelSaleOrderGoodsVOList &&
        this.shop_user.channelSaleOrderGoodsVOList.length > 0
      ) {
        this.$confirm("切换仓库后，已选商品会清除，确认切换仓库吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.shop_user.channelSaleOrderGoodsVOList = [];
            localStorage.removeItem("localTableData");
            this.shop_user.actualAmount = this.shop_user.amount = "";
            localStorage.removeItem("allShopPrice");
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
    //得到仓库编码和Id
    getWarehouseIdAndCode(val) {
      var warehouseId = this.WarehouseCodeData.find(item => item.name == val)
        .id;
      var code = this.WarehouseCodeData.find(item => item.name == val).code;
      this.shop_user.warehouseCode = code;
      this.warehouseId = warehouseId;
    },
    setDivision(var1) {
      this.shop_user.provinceName = var1.province;
      this.shop_user.provinceCode = var1.provinceCode;
      this.shop_user.cityName = var1.municipality;
      this.shop_user.cityCode = var1.municipalityCode;
      this.shop_user.areaName = var1.area;
      this.shop_user.areaCode = var1.areaCode;
      this.shop_user.addressId = var1.divisionId;
    },
    currentNumberChange() {
      var amount = 0;
      this.shop_user.channelSaleOrderGoodsVOList.forEach(item => {
        amount += item.num * item.retailPrice;
      });
      this.shop_user.amount = amount.toFixed(2);
      this.shop_user.actualAmount = amount.toFixed(2);
    },
    //优惠项内容改变
    preferentialRemarksInputChange(val) {
      if (val.target.value.length > 10) {
        this.shop_user.preferentialRemarks = val.target.value.substr(0, 10);
      }
    },
    //优惠金额改变
    preferentialAmountInputValueChange(val) {
      var preferential = val.target.value.match(/^\d*(\.?\d{0,2})/g);
      this.shop_user.preferentialAmount = preferential[0];
    },
    //选择支付方式
    paySelectWay(item) {
      console.log(item);
    },
    //点击选择商品
    selectShopClickEvent() {
      if (this.shop_user.organization && this.shop_user.warehouse) {
        this.$router.push({
          path: "/OS/channelSales/channelSales_shop",
          query: {
            ownerId: "",
            organizationName: this.shop_user.organization,
            warehouseId: this.shop_user.warehouseCode,
            warehouseName: this.shop_user.warehouse
          }
        });
        //存储填写的信息
        localStorage.setItem("shopMsgData", JSON.stringify(this.shop_user));
        localStorage.setItem(
          "localTableData",
          JSON.stringify(this.shop_user.channelSaleOrderGoodsVOList)
        );
      } else {
        this.$message.error("组织机构或者出库仓库为空");
      }
    },
    //确认按钮的点击事件
    primaryBtnClick() {
      // this.shop_user.organization = this.$refs.treeDept.$refs.input.value;
      if (
        this.shop_user.channelSaleOrderGoodsVOList &&
        this.shop_user.channelSaleOrderGoodsVOList.length > 0
      ) {
        var tmpPrice = "";
        this.shop_user.channelSaleOrderGoodsVOList.forEach(item => {
          item.tmpPrice = item.sellPrice;
          item.sellPrice = item.retailPrice;
          item.retailPrice = item.tmpPrice;
        });
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let channelSaleOrderGoodsVOList = this.shop_user.channelSaleOrderGoodsVOList.filter(item => {
            return item.num != 0;
          })
          this.shop_user.channelSaleOrderGoodsVOList=channelSaleOrderGoodsVOList
          this.request(
            this.api.order.channelSaleOrder_save,
            this.shop_user
          ).then(data => {
            console.log("270===========");
            if (data && data.length) {
              let html = "";
              data.forEach(errItem => {
                for (let i = 0; i <  this.shop_user.channelSaleOrderGoodsVOList.length; i++) {
                  if ( this.shop_user.channelSaleOrderGoodsVOList[i].code == errItem.code) {
                    if (errItem.qty == 0) {
                      this.shop_user.channelSaleOrderGoodsVOList.splice(i, 1);
                      html += "<p>" + errItem.code + "：可用库存为0，已删除该商品；</p>";
                    } else {
                      html += "<p>" + errItem.code + "：可用库存不足，已更新为最大值" + errItem.qty + "；</p>";
                      this.shop_user.channelSaleOrderGoodsVOList[i].availableQuantity = errItem.qty;
                      this.shop_user.channelSaleOrderGoodsVOList[i].num = errItem.qty;
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
              this.$refs.ruleForm.resetFields();
              this.shop_user.channelSaleOrderGoodsVOList = [];
              this.$router.push({
                path: "/OS/channelSales/channelSales"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消按钮的点击事件
    plainBtnClick() {
      this.$router.push({
        path: "/OS/channelSales/channelSales"
      });
    },
    //收货人内容输入时的事件
    receiverNameValueChange(val) {
      if (val.length > 10) {
        this.shop_user.receiverName = val.substr(0, 10);
      }
    },
    //得到商户名称的数据
    async querySearch(queryString, cb) {
      if (queryString.length == 0) {
        return;
      }
      //得到商户联想数据
      var restaurants = await this.getShopNameData(queryString);
      this.restaurants = restaurants;
      console.log(restaurants);
      // 调用 callback 返回建议列表的数据
      cb(restaurants);
    },
    handleSelect(item) {
      console.log(item);
      this.shop_user.storeName = item.storeName;
      this.shop_user.storeId = item.id;
    },
    async getShopNameData(key) {
      // symbol 1--网销 2--渠销
      return await this.request(
        this.api.order.orderStore_orderStoreList,
        {
          symbol: 2,
          organizationCode: this.shop_user.organizationCode,
          searchKey: key
        },
        true
      );
    },
    //销售单价改变事件
    retailPriceValueChangeEvent() {
      var allPrice = 0;
      this.shop_user.preferentialAmount = "0.00";
      this.shop_user.channelSaleOrderGoodsVOList.forEach(item => {
        if (item.retailPrice) {
          allPrice += parseInt(item.retailPrice) * item.num;
        }
      });
      this.shop_user.amount = allPrice.toFixed(2);
      this.shop_user.actualAmount = allPrice.toFixed(2);
      localStorage.setItem("allShopPrice", allPrice);
    },
    //实付金额值改变的事件
    validAmountValueChangeEvent(val) {
      var validAmount = val.match(/^\d*(\.?\d{0,2})/g);
      this.shop_user.validAmount = validAmount[0];
    },
    //推荐人值改变的事件
    recommendValueChange(val) {
      if (val.length > 10) {
        this.shop_user.recommend = val.substr(0, 10);
      }
    },
    //订单备注值改变的事件
    remarksValueChange(val) {
      if (val.length > 100) {
        this.shop_user.remarks = val.substr(0, 100);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.input-div {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.tag_div {
  display: flex;
  align-items: center;
}
.recoment-input {
  // background-color: #222;
  padding-left: 12px;
}
.recoment-input .contentInput {
  display: inline-block;
  width: 300px;
}
.remarks-textarea {
  margin-top: 20px;
  position: relative;
}
.remarks-textarea span {
  position: relative;
  top: -24px;
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
.other-msg {
  display: inline-block;
  margin-top: 20px;
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
</style>
