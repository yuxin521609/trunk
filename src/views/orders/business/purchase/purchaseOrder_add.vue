<template>
  <div>
    <div class="middle">
      <span>基本信息</span>
      <div class="input-div">
        <el-form
          ref="formData"
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
            </div>
            <div>
              <el-form-item label="供应商：" prop="supplier">
                <el-select
                  :disabled='isImport'
                  @change="selectSupplierChange"
                  v-model="signData.supplier"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in signData.optionData"
                    :label="item.name"
                    :key="item.id"
                    :value="item.name"
                  ></el-option>
                </el-select>
                <!-- <code-set v-model="signData.supplier" code="COM003"/> -->
              </el-form-item>
            </div>
            <div>
              <el-form-item label="采购合同号：" prop>
                <el-input placeholder="请输入内容" v-model="signData.contractSn"></el-input>
              </el-form-item>
            </div>
          </div>

          <div class="middle-data-div">
            <div>
              <el-form-item label="交货日期：" prop>
                <el-date-picker v-model="signData.deliveryTime" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>

            <div>
              <el-form-item label="合同签订日期：" prop>
                <el-date-picker v-model="signData.signTime" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>
          </div>

          <div class="last-data-div">
            <div class="el-form-item">
              <el-form-item label="是否按税点采购：" label-width="140px">
                <el-radio v-model="signData.radio" label="1" @change='radioStatusChange'>否</el-radio>
                <el-radio v-model="signData.radio" label="2" @change='radioStatusChange'>是</el-radio>
                <!-- <el-form-item label="税点：" label-width="60px"> -->
                <span style='margin-right:10px;'>税点</span>
                  <el-select
                    @change="taxPointChange"
                    :disabled="signData.radio==1"
                    v-model="signData.tax"
                    placeholder="请选择"
                  >
                    <el-option label="3%" value="3%"></el-option>
                    <el-option label="13%" value="13%"></el-option>
                  </el-select>
                </el-form-item>
              <!-- </el-form-item> -->
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
            :data="signData.channelOrderGoodsVOList"
            style="width: 100%"
            max-height="600px"
            header-row-class-name="item-table-header"
          >
            <el-table-column prop="productCode" label="商品款号" width></el-table-column>
            <el-table-column prop="code" label="商品货号" width align="center"></el-table-column>
            <el-table-column label="商品图片" width align="center">
              <template slot-scope="scope">
                <img :src="scope.row.image" style="width:32px;height:32px;" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width align="center"></el-table-column>
            <el-table-column prop="type" label="商品类型" width align="center">
              <template slot-scope="scope">
                <span>{{scope.row.type}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="brandName" label="品牌" width align="center">
              <template slot-scope="scope">
                <span>{{scope.row.brandName?scope.row.brandName:'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fullCateName" label="商品品类" width align="center"></el-table-column>
            <el-table-column prop="originalCode" label="原始款号" width align="center">
              <template slot-scope="scope">
                <span>{{scope.row.originalCode?scope.row.originalCode:'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="规格属性" width align="center">
              <template slot-scope="scope">
                <span>颜色：{{scope.row.color}}</span>
                <br />
                <span>尺寸：{{scope.row.size}}</span>
              </template>
            </el-table-column>
            <el-table-column label="采购单价" width align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.purchasePrice"
                  placeholder="请输入内容"
                  type="number"
                  @change="purchasePriceChange"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="tax" label="税点" width align="center">
              <template slot-scope="scope">
                <span>{{scope.row.tax?scope.row.tax:'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="采购单价(含税)" width align="center">
              <template  slot-scope="scope">
                <input
                  v-model="scope.row.actualAmount"
                  class="actual-amount-input"
                  type="number"
                  placeholder="请输入内容"
                  @input="actualAmountChange(scope.row)"
                  v-if="scope.row.actualAmount"
                />
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="200" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.num"
                  @change="shopNumberChange($event,scope.row)"
                  :min="0"
                  v-enter-number
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="采购金额" width align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.amount"
                  placeholder="请输入内容"
                  @input="amountChange($event,scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="备注" width align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remarks" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="money-div">
          <span>累计采购总数：{{purchaseAllCount}}</span><br/>
          <span>采购商品总金额：￥{{signData.amount?signData.amount:'0.00'}}</span>
          <div class="money-content">
            <span>其他扣减项金额：</span>
            <input
              type="text"
              v-model="signData.preferentialRemarks"
              class="input-price"
              placeholder="填写优惠项"
            />
            <span>￥</span>
            <input
              type="number"
              min="0"
              max="100"
              @change="priceInputChangeEvent"
              class="input-price"
              v-model="signData.preferentialAmount"
              placeholder="0.00"
            />
          </div>
          <span>采购应付金额：￥{{signData.actualAmount?signData.actualAmount:'0.00'}}</span>
        </div>
      </div>
      <div class="price-msg">
        <span>付款信息</span>
        <el-form :inline="true" :model="signData" ref="formInlineFrom" class="demo-form-inline">
          <el-form-item label="付款方式：">
            <code-set v-model="signData.paymentCode" code="COM003" />
          </el-form-item>
          <el-form-item label="支付流水号(支付单据)：">
            <el-input v-model="signData.orderTradeNo" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="实付金额：">
            <el-input type="number" v-model="signData.validAmount" placeholder="请输入内容" @input="validAmountValueChangeEvent"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="block">
              <span class="demonstration">支付时间:</span>
              <el-date-picker v-model="signData.createTime" type="date" placeholder="选择日期"></el-date-picker>
            </div>
          </el-form-item>
        </el-form>

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
      //标记累加采购总数
      purchaseAllCount:0,
      importExcelData:{},
      //标识导入错误的数据
      invalid:[],
      isImport:false,
      signData: {
        orderType: "0301",
        //组织机构
        organizationCode: "",
        organization: "",
        //selectChange
        //货主
        goodsOwner:'',
        //税点
        tax: "",
        deliveryDate: "",
        //供货商
        supplier: "",
        //供货商编码
        supplierCode: "",
        //采购合同号
        contractSn: "",
        signTime: "",
        //采购备注
        remarks: "",
        //选择日期
        createTime: "",
        //支付方式
        paymentCode: "",
        //商品数据表
        channelOrderGoodsVOList: null,
        optionData: [],
        //实付金额
        validAmount:"0.00",
        //扣减原因
        preferentialRemarks: "",
        //扣减金额
        preferentialAmount: "",
        //采购商品金额
        amount: "",
        //采购付款金额
        actualAmount: "",
        //选项框
        radio: "1"
      },
      rules: {
        tax: [{ required: true, message: "请选择税点", trigger: "change" }],
        supplier: [
          { required: true, message: "供货商不能为空", trigger: "change" }
        ],
        organization: [
          { required: true, message: "组织机构不能为空", trigger: "change" }
        ],
      },

      //填写的优惠金额
      price: "",

      //文本域输入
      textarea: "",

      orderPrice: "",
      shopRetailPrice: ""
    };
  },
  created() {
    //得到组织机构数据
    this.getWarehouseListData();

    let _type = localStorage.getItem("type") || "";
    if(this.$route.params.uploadData){
      this.importExcelData=JSON.parse(this.$route.params.uploadData)
      this.invalid=JSON.parse(this.$route.params.invalid)
      this.isImport=true;
    }else{
      this.isImport=false;
    }
    if (_type == "add") {
      localStorage.removeItem("localTableData");
      localStorage.removeItem("shopMsgData");
      localStorage.removeItem("allShopPrice");
      this.signData.channelOrderGoodsVOList = [];
      if(this.$route.params.uploadData){
        // this.isImport=true;
        if(this.invalid.length>0){
          //展示导入错误的数据
          this.showErrorImportExcelData(this.invalid);
        }
        //说明是导入的数据
        this.getImportExcelData(this.importExcelData);
      }
    } else {
      if (localStorage.getItem("localTableData") == null) {
        return;
      }
      console.log("channelOrderGoodsVOList")
      //存储填写的信息
      var shopData = localStorage.getItem("shopMsgData");
      this.$nextTick(() => {
        this.signData = JSON.parse(shopData);
        var amount = localStorage.getItem("allShopPrice");
        console.log(amount) 
        //赋值订单总金额
        this.signData.amount=parseFloat(amount).toFixed(2)
        this.signData.actualAmount = parseFloat(amount).toFixed(2);
        // this.signData.channelOrderGoodsVOList = JSON.parse(
        //   localStorage.getItem("localTableData")
        // );
        var localTableData = JSON.parse(localStorage.getItem("localTableData"))
        this.signData.channelOrderGoodsVOList=localTableData
        //去除重复的对象
        this.signData.channelOrderGoodsVOList = this.deteleBottonTableDataObject(this.signData.channelOrderGoodsVOList);
        //计算累计采购总数
        this.purchaseAllCount=0
        this.signData.channelOrderGoodsVOList.forEach(item => {
          this.purchaseAllCount +=parseInt(item.num)
        })
        var tax=this.signData.tax
        console.log(this.signData.channelOrderGoodsVOList);
        this.taxPointChange(tax)
        this.setOrderShopDataArr();
      });
    }
  },
  watch: {
    "signData.preferentialAmount": function(newPrice) {
      var actualAmount = this.signData.amount - newPrice;
      this.signData.actualAmount=actualAmount.toFixed(2)
    }
  },
  filters: {
    rowType(type) {
      switch (type) {
        case 1:
          return "成衣";
          break;
        case 2:
          return "样衣";
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
        //获取货主列表
        this.getGoodsOwnerListData(this.signData.organizationCode);
        //得到供货商数据
        this.getSupplierListData(this.signData.organizationCode)
      });
    },
    //去除对象中的重复对象
    deteleBottonTableDataObject(arr) {
      var hash = {};
      const newArr = arr.reduce((item, next) => {
        hash[next.id] ? "" : (hash[next.id] = true && item.push(next));
        return item;
      }, []);
      return newArr;
    },
    showErrorImportExcelData(data) {
      if(!data)return;
      let html = '';
      data.forEach(errItem => {
        html += '<p>'+ errItem + '：该商品不存在</p>';
      });
      this.$notify({
        title: '提示',
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: html
      });
    },
    //得到导入的数据
    getImportExcelData(data){
      if(!data)return
      if(data.tax){
          var tmpTax=data.tax*100
          data.tax=tmpTax+"%"
          this.signData=data
          this.$set(this.signData,'radio','2')
          data.channelOrderGoodsVOList.data.forEach(item => {
            this.$set(item,'tax', data.tax)
          });
        }else{
          this.signData=data
          this.$set(this.signData,'radio','1')
        }
        if(data.channelOrderGoodsVOList.data && data.channelOrderGoodsVOList.data.length>0){
            data.channelOrderGoodsVOList.data.forEach(item=>{
                if(item.actualAmount){
                    item.amount=parseFloat(item.actualAmount*item.num).toFixed(2)
                }else{
                    item.amount=parseFloat(item.purchasePrice*item.num).toFixed(2)
                }
            })
         this.signData.channelOrderGoodsVOList=data.channelOrderGoodsVOList.data
        }
        var amount=0
        //计算累计采购总数
        this.purchaseAllCount=0
        this.signData.channelOrderGoodsVOList.forEach(item => {
          amount+=parseFloat(item.amount)  
          this.purchaseAllCount +=parseFloat(item.num)
        })
        this.signData.amount=parseFloat(amount).toFixed(2)
        this.signData.actualAmount = parseFloat(amount).toFixed(2);
        // this.signData = this.importExcelData
        // this.signData.channelOrderGoodsVOList = this.importExcelData.channelOrderGoodsVOList.data;
    },
    //得到供货商数据
    getSupplierListData(organizationId) {
      console.log(246);
      //cooperation 为true得到有合作的供应商 不传 得到全部的供应商
      this.request(this.api.product.supplier_list, {organizationId:organizationId,cooperation:true}).then(data => {
        console.log(data);
        this.signData.optionData = data.data;
      });
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
    //设置采购金额
    setOrderShopDataArr() {
      let orderData = this.signData.channelOrderGoodsVOList;
      let _that = this;
      if (orderData.length > 0) {
        orderData.forEach(item => {
          _that.$set(
            item,
            "amount",
            (item.purchasePrice * item.num).toFixed(2)
          );
        });
      }
    },
    //实付金额值改变的事件
    validAmountValueChangeEvent(val){
      if(!val)return
      var validAmount=val.match(/^\d*(\.?\d{0,2})/g)
      this.signData.validAmount=validAmount[0]
    },
    //价格变化事件
    priceInputChangeEvent() {
      console.log(this.price);
    },
    //选择支付方式
    paySelectWay(item) {
      console.log(item);
    },
    //点击选择商品
    selectShopClickEvent() {
      console.log("selectShopClickEvent======show_purchaseOrder_shop======236");
        // query:{
        //   organizationName: this.signData.organization,
        //   ownerId:this.signData.goodsOwner,
        // }
      this.$router.push({
        path: "/OS/business/purchase/purchaseOrder_shop"
      });
      //存储填写的信息
      localStorage.setItem("shopMsgData", JSON.stringify(this.signData));
      localStorage.setItem("localTableData",JSON.stringify(this.signData.channelOrderGoodsVOList));
    },
    //确认按钮的点击事件
    primaryBtnClick() {
      var self=this
      this.$refs.formData.validate(valid => {
        if (valid) {
          if (this.signData.channelOrderGoodsVOList && this.signData.channelOrderGoodsVOList.length>0) {
            this.signData.channelOrderGoodsVOList.forEach(item => {
              item.unitPrice = item.purchasePrice;
              item.category=item.fullCateName
            });
          }else{
            this.$message.error('商品数量不能全部为0');
            return
          }
          if(!this.signData.validAmount){
            this.$message.error('请输入实付金额');
            return
          }
          //过滤商品数量
          var filterOrderGoodsVOListData=this.signData.channelOrderGoodsVOList.filter(item=>{
            return item.num && item.num!=0
          })
          if(filterOrderGoodsVOListData.length==0){
            this.$message.error('采购商品数量不能全部为0');
            return
          }
          this.signData.channelCode='04'
          this.signData.channelOrderGoodsVOList=filterOrderGoodsVOListData
          console.log("primaryBtnClick");
          if (this.signData.tax) {
            let subTax = this.signData.tax.slice(0, this.signData.tax.length - 1);
            let taxNum = subTax / 100;
            this.signData.tax = taxNum;
          }
          this.request(
            this.api.order.channelPurchaseOrder_save,
            this.signData
          ).then(data => {
            //此处应该时上传成功后，再删除
            localStorage.removeItem("localTableData");
            this.signData.channelOrderGoodsVOList = [];
            this.$router.go(-1);
          });
        } else {
          return false;
        }
      });
    },
    //存储供应商编码
    selectSupplierChange(val) {
      let suppliceObj = this.signData.optionData.find(item => item.name == val);
      this.signData.supplierCode = suppliceObj.code;
    },
    //取消按钮的点击事件
    plainBtnClick() {
      this.$router.go(-1);
    },
    //数量检测
    shopNumberChange(val, row) {
      if(!val){
        val=0
      }
      if (row.tax && row.tax!='--') {
        row.amount = parseFloat(row.actualAmount * val).toFixed(2);
      } else {
        row.amount = (row.purchasePrice * val).toFixed(2);
      }
      var amount=0
      this.purchaseAllCount=0
      this.signData.channelOrderGoodsVOList.forEach(item => {
        amount+=parseFloat(item.amount)
        this.purchaseAllCount+=parseFloat(item.num)
      })
      this.signData.amount=parseFloat(amount).toFixed(2)
      if(this.signData.preferentialAmount){
          this.signData.actualAmount =parseFloat(amount-Number(this.signData.preferentialAmount)).toFixed(2)
        }else{
          this.signData.actualAmount = parseFloat(amount).toFixed(2);
      }
      // this.signData.actualAmount = parseFloat(amount).toFixed(2);
    },
    //税点改变时
    taxPointChange(val) {
      console.log(val)
      console.log(this.signData.channelOrderGoodsVOList)
      if (!val) {
        return;
      }
      let subVal = val.slice(0, val.length - 1);
      console.log(subVal)
      if (this.signData.channelOrderGoodsVOList.length > 0) {
        this.signData.channelOrderGoodsVOList.forEach(item => {
          // item.tax = val;
          this.$set(item,'tax',val)
          //含税单价
          var actualAmount = parseFloat(item.purchasePrice * (subVal / 100+1)).toFixed(2);
          this.$set(item,'actualAmount',actualAmount)
          //采购金额
          item.amount = parseFloat(item.actualAmount * item.num).toFixed(2);
        });
        var amount=0
        this.signData.channelOrderGoodsVOList.forEach(item => {
          amount+=parseFloat(item.amount)
        })
        this.signData.amount=parseFloat(amount).toFixed(2)
        if(this.signData.preferentialAmount){
          this.signData.actualAmount =parseFloat(amount-Number(this.signData.preferentialAmount)).toFixed(2)
        }else{
          this.signData.actualAmount = parseFloat(amount).toFixed(2);
        }
        // this.signData.actualAmount = parseFloat(amount).toFixed(2);
      }
    },
    //采购单价发生变化
    purchasePriceChange(val) {
      console.log(val);
      if (!this.signData.tax) {
        this.signData.channelOrderGoodsVOList.forEach(item => {
          item.amount = parseFloat(item.purchasePrice * item.num).toFixed(2)
        });
      } else {
          let selectSubStr = (this.signData.tax.slice(0, this.signData.tax.length - 1) / 100).toFixed(2);
          var subStr=parseFloat(selectSubStr)+1
            console.log(subStr)
          this.signData.channelOrderGoodsVOList.forEach(item => {
            item.actualAmount =parseFloat(item.purchasePrice * subStr).toFixed(2);
            console.log(selectSubStr+"==="+item.actualAmount)
            item.amount = parseFloat(item.actualAmount * item.num).toFixed(2)
          });
      }
      var amount=0
      this.signData.channelOrderGoodsVOList.forEach(item => {
        amount+=parseFloat(item.amount)
      })
      this.signData.amount=parseFloat(amount).toFixed(2)
      if(this.signData.preferentialAmount){
          this.signData.actualAmount =parseFloat(amount-Number(this.signData.preferentialAmount)).toFixed(2)
        }else{
          this.signData.actualAmount = parseFloat(amount).toFixed(2);
        }
      // this.signData.actualAmount = parseFloat(amount).toFixed(2);
    },
    //采购金额发生变化了
    amountChange(val, row) {
      console.log(val);
      console.log(row);
      //商品数量不能为0-否则会出现无穷大
      if(row.num==0)return
      if (this.signData.tax) {
        let selectVal = (this.signData.tax.slice(0, this.signData.tax.length - 1) / 100).toFixed(2);
        var subStr=parseFloat(selectVal)+1
        row.actualAmount = (row.amount / row.num).toFixed(2);
        row.purchasePrice = (row.actualAmount / subStr).toFixed(2);
      } else {
        row.purchasePrice = (row.amount / row.num).toFixed(2);
      }
      var amount=0
      this.signData.channelOrderGoodsVOList.forEach(item => {
        if(!item.amount){
          item.amount="0.00"
        }
          amount+=parseFloat(item.amount)
      })
      this.signData.amount=parseFloat(amount).toFixed(2)
      if(this.signData.preferentialAmount){
          this.signData.actualAmount =parseFloat(amount-Number(this.signData.preferentialAmount)).toFixed(2)
        }else{
          this.signData.actualAmount = parseFloat(amount).toFixed(2);
      }
      // this.signData.actualAmount = parseFloat(amount).toFixed(2);
    },
    //含税金额发生改变
    actualAmountChange(val) {
      if (this.signData.tax) {
        let selectVal = parseFloat(this.signData.tax.slice(0,this.signData.tax.length - 1)/100).toFixed(2);
        var subStr=parseFloat(selectVal)+1
        console.log(subStr)
        val.purchasePrice = parseFloat(val.actualAmount /subStr).toFixed(2);
        val.amount = parseFloat(val.actualAmount * val.num).toFixed(2);
      }
      var amount=0
      this.signData.channelOrderGoodsVOList.forEach(item => {
        amount+=parseFloat(item.amount)
      })
      this.signData.amount=parseFloat(amount).toFixed(2)
      if(this.signData.preferentialAmount){
          this.signData.actualAmount =parseFloat(amount-Number(this.signData.preferentialAmount)).toFixed(2)
        }else{
          this.signData.actualAmount = parseFloat(amount).toFixed(2);
        }
      // this.signData.actualAmount = parseFloat(amount).toFixed(2);
    },
    //radio改变时触发
    radioStatusChange(val){
      console.log(val)
     if(val==1){
      //radio==否
       this.signData.tax=""
       var amount=0
      if (this.signData.channelOrderGoodsVOList.length > 0) {
        this.signData.channelOrderGoodsVOList.forEach(item => {
          console.log(item)
          item.tax = '--';
          //含税单价
          item.actualAmount=null
          //采购金额
          item.amount = (item.purchasePrice * item.num).toFixed(2);
        });
      }
      this.signData.channelOrderGoodsVOList.forEach(item => {
        amount+=parseFloat(item.amount)
        console.log(amount)
      })
      this.signData.amount=parseFloat(amount).toFixed(2)
      if(this.signData.preferentialAmount){
          this.signData.actualAmount =parseFloat(amount-Number(this.signData.preferentialAmount)).toFixed(2)
        }else{
          this.signData.actualAmount = parseFloat(amount).toFixed(2);
        }
      // this.signData.actualAmount = parseFloat(amount).toFixed(2);
     }else{
      //radio==是
      this.signData.tax="3%"
      this.taxPointChange(this.signData.tax)
     }
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
  .middle-data-div {
    width: 100%;
    display: flex;
    div:first-child {
      margin-right: 90px;
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
}
.actual-amount-input {
  display: inline-block;
  border: 1px solid #d4d4d4;
  height: 32px;
  width: 100px;
  padding-left: 5px;
  border-radius: 3px;
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
  margin: 8px 0;
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
</style>
