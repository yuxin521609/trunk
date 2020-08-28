<template>
  <div class="content">
    <label>基本信息</label>
    <div class="form_div">
      <el-form
        :model="signData"
        ref="ruleForm"
        :inline="true"
        :rules="rules"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="组织机构：" prop="organization">
                <el-input v-model="signData.organization" disabled></el-input>
            </el-form-item>
            <el-form-item label="渠道订单号：" prop="orderSn">
              <div class="order_div">
                <!-- <el-input v-model="signData.orderSn"></el-input> -->
                <el-autocomplete
                  v-model="signData.orderSn"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  :trigger-on-focus="false"
                  @select="handleSelect"
                  style="width:215px;"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.orderSn }}</div>
                  </template>
                </el-autocomplete>
                <p

                  class="select_order_label"
                  @click="selectOrderSnClickEvent"
                >选择订单</p>
              </div>
            </el-form-item>
            <el-form-item label="收货仓库：" prop="warehouse">
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
            <el-form-item label="物流公司：" prop="logisticsCompany">
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
          </el-col>
          <el-col :span="6">
            <el-form-item label="网销店铺：" prop="ditchStoreName">
               <el-select :class="storeSelect?'disableSelect':''"
                  v-model="signData.ditchStoreName"
                  @change="storeShopDataChanegEvent"
                  placeholder="请选择店铺"
                >
                  <el-option
                    v-for="item in storeShopData"
                    :label="item.storeName"
                    :key="item.id"
                    :value="item.storeName"
                  ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商户姓名：" prop="storeName">
              <el-input :disabled="storeNameStatus" v-model="signData.storeName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="客户电话：" prop="mobile">
              <el-input v-model="signData.mobile" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="物流单号：" prop="logisticsOrderSn">
              <el-input v-model="signData.logisticsOrderSn" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="table_msg">
        <div class="title_span">
          <span>商品信息</span>
          <span v-show="!storeNameStatus" class="select_shop_title" @click="selectShopClickEvent">选择商品</span>
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
                  <image :scr='scope.row.image' style="width:32px;height:32px;"></image>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
            <el-table-column prop="" label="商品类型" width="180">
              <template slot-scope="scope">
                <span>颜色：{{scope.row.color}}</span>
                <br />
                <span>尺寸：{{scope.row.size}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="brandName" label="品牌"></el-table-column>
            <el-table-column prop="type" label="商品品类" width="180"></el-table-column>
            <el-table-column label="规格属性" width="180">
              <template slot-scope="scope">
                <span>颜色：{{scope.row.color}}</span>
                <br />
                <span>尺寸：{{scope.row.size}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sellPrice" label="销售单价">
              <template slot-scope="scope">
                <span v-show="scope.row.sellPrice!='--'">￥{{scope.row.sellPrice}}</span>
                <span v-show="scope.row.sellPrice=='--'">{{scope.row.sellPrice}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="refundAmount" label="退货单价" width="120" align="center">
              <template slot-scope="scope">
                <div class="tag_div">
                  <span>￥</span>
                  <el-input
                    @input="salesReturnPriceChange"
                    min="0"
                    max="scope.row.sellPrice"
                    type="number"
                    v-model="scope.row.refundAmount"
                    placeholder="请输入"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="num" align="center" label="销售数量"></el-table-column>
            <el-table-column prop="returnQuantity" label="退货数量" width="180" align="center">
              <template slot-scope="scope">
                <el-input-number v-if="shopMsg"
                  v-model="scope.row.returnQuantity"
                  @change="salesReturnShopNumberChange(index)"
                  :min="0"
                  :max="scope.row.num"
                  v-enter-number
                ></el-input-number>
                <el-input-number v-else
                  v-model="scope.row.returnQuantity"
                  @change="salesReturnNoNumShopNumberChange"
                  :min="0"
                  v-enter-number
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="money-div">
          <span>退款金额：￥{{signData.amount?signData.amount:'0.00'}}</span>
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
          <span>退款应付金额：￥{{signData.refundAmount?signData.refundAmount:'0.00'}}</span>
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

    <div>
      <el-dialog title="选择退货单"  :visible.sync="visible">
        <!-- <div style="width:100%;display:flex;border-bottom:1px solid #ccc;padding-bottom:8px;">
          <span style="color:#409eff;flex:auto;">选择退货单</span>
          <i class="el-icon-close" @click="visible=false"></i>
        </div> -->
        <div style="border-bottom:1px solid #ccc;margin-bottom:20px;">
          <el-form
            :model="gridTableData"
            label-width="90px"
            size="small"
            ref="gridTableForm"
            inline
          >
            <el-form-item prop="searchKey" label="模糊查询：">
              <el-input
                class="input-w"
                placeholder="定单号/商户名称/联系电话"
                v-model="gridTableData.searchKey"
              ></el-input>
            </el-form-item>
            <el-form-item prop="channelCodes" label="订单来源：">
              <code-set v-model="gridTableData.channelCodes" code="ORD001" :multiple="true" />
            </el-form-item>
            <el-form-item>
              <el-button @click="gridFormDataSearch" type="primary" plain size="small">搜索</el-button>
              <el-button @click="gridFormDataResetFilters('gridTableForm')" size="small">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="gridTableData.gridData"
          header-row-class-name="item-table-header"
        >
          <el-table-column prop="orderSn" label="订单号"></el-table-column>
          <el-table-column prop="storeName" label="商户姓名"></el-table-column>
          <el-table-column prop="mobile" label="联系电话"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <p
                @click="selectBtnClick(scope.row)"
                type="text"
                size="small"
                style="color:#409eff"
              >选择</p>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top:20px;padding-bottom:10px;margin-right:20px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="gridTableData.pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="gridTableData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="selectDataTotalPage"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import codeSet from "@/components/codeSet";
import treeDept from "@/components/treeDept";
export default {
  components: {
    codeSet,
    treeDept
  },
  data() {
    return {
      signData: {
        //订单类型
        orderType:'0102',
        //退货备注
        remarks: "",
        //总金额
        amount:'',
        //网销店铺名称
        ditchStoreName:'',
        //网销店铺Id
        storeId:'',
        //货主
        goodsOwner:'',
        //折损金额金额
        breakageAmount: "",
        //退款应付金额
        refundAmount:'',
        //组织机构id
        organizationCode: "",
        //组织机构名称
        organization:'',
        //退货日期
        refundTime: "",
        //收货仓库
        warehouse: "",
        //仓库code
        warehouseCode:'',
        //渠道订单号
        orderSn: "",
        //物流公司
        logisticsCompany: "",
        //物流公司编码
        logisticsCompanyCode:'',
        //退货商户
        storeName: "",
        //商户Id
        storeId:'',
        //联系电话
        mobile: "",
        //物流单号
        logisticsOrderSn: "",
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
        logisticsCompany: [
          { required: true, message: "请选择物流公司", trigger: "change" }
        ],
        storeName: [
          { required: true, message: "商户姓名不能为空", trigger: "" }
        ],
        ditchStoreName:[
          { required: true, message: "商户姓名不能为空", trigger: "change" }
        ],
        mobile: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        logisticsOrderSn: [
          { required: true, message: "物流单号不能为空", trigger: "blur" }
        ]
      },
      //收货仓库--合格的仓库
      WarehouseCodeData: [],
      //获取物流数据
      logisticsListData: [],
      //标识popover的显示或隐藏
      visible: false,
      //组织机构数据
      organizationListData:[],
      //选择订单table的数据
      gridTableData: {
        orderType:'0102',
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条,
        pageSize: 10,
        //检索字段
        searchKey: "",
        //订单来源数据
        channelCodes: [],
        //选择订单的数据来源
        gridData: [],
      },
      //退货商户状态
      storeNameStatus:false,
      //订单号联想时数据
      orderSnData:[],
      //店铺数据
      storeShopData:[],
      //标识商铺
      storeSelect:false,
      //标识商品信息来源
      shopMsg:true,
      //选择订单号的总条数
      selectDataTotalPage:0
    };
  },
   watch: {
    //监听订单号
    "signData.orderSn": function(newOrderSn,oldOrderSn) {
       if(!newOrderSn){
        this.storeNameStatus=false
        this.signData.storeName=''
        this.signData.mobile=''
        //清空商品信息
        this.signData.channelOrderGoodsVOList=[]
        //清空联想信息
        this.orderSnData=[]
       }else{
         if(!this.orderSnData){
            return
          }
         this.orderSnData.forEach(item=>{
           if(item.orderSn==newOrderSn){
              this.signData.storeName=item.storeName
              this.signData.mobile=item.mobile
              this.signData.orderSn=item.orderSn
              this.visible=false
              //标识退货商户状态
              this.storeNameStatus=true
              //根据订单号得到商品数据
              this.getShopDataByOrderSn(this.signData.orderSn)
           }
         })
       }
    },
    //监听折损价格的变化
    "signData.breakageAmount":function(newBreakageAmount,oldBreakageAmount){
      var refundAmount = this.signData.amount - newBreakageAmount;
      this.signData.refundAmount=refundAmount.toFixed(2)
    },
  },
  mounted() {
    let _type = localStorage.getItem("type") || "";
    //得到组织机构数据
    this.getWarehouseListData();
    //获取物流数据
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
        this.isDisable = false;
        this.signData = JSON.parse(shopData);
        this.signData.channelOrderGoodsVOList = JSON.parse(localTableData);
        if(this.signData.channelOrderGoodsVOList && this.signData.channelOrderGoodsVOList.length>0){
          this.signData.channelOrderGoodsVOList.forEach(item=>{
            item.sellPrice="--";
            // item.returnQuantity=item.num
            this.shopMsg=false
            //增加临时字段，标识是否有修改
            item.tmpQuantity=item.num
            this.$set(item,'returnQuantity',item.num)
            item.num="--"
            this.$set(item,'refundAmount','0.00')
            // this.$set(item,'returnQuantity',0)
          })
          console.log( this.signData.channelOrderGoodsVOList);
        }
        //赋值订单总金额
        // var amount = 0;
        // amount = localStorage.getItem("allShopPrice");
        // this.signData.amount=parseFloat(amount).toFixed(2);
        // this.signData.refundAmount = parseFloat(amount).toFixed(2);

        //得到当前的仓库名称
        this.tmpWarehouse = this.signData.warehouse;
        //得到仓库数据
        this.getWarehouseList(this.signData.organizationId);
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
        //得到机构id
        this.signData.organizationId = data.id;
        //获取货主列表
        this.getGoodsOwnerListData(this.signData.organizationId);
        //得到店铺数据
        this.getShopNameData(this.signData.organizationCode)
        //得到仓库数据
        this.getWarehouseList(this.signData.organizationId);
      });
    },
    //得到店铺数据
    getShopNameData(organizationId) {
      // symbol 1--网销 2--渠销
      this.request(
        this.api.order.orderStore_orderStoreList,
        {
          symbol: 1,
          organizationCode:organizationId ,
        },
      ).then(data=>{
        console.log(data)
        this.storeShopData=data
      })
    },
     storeShopDataChanegEvent(val){
       console.log(val)
      this.signData.storeName=''
      this.signData.orderSn=''
      this.signData.mobile=''
      var storeId=this.storeShopData.find(item=>item.storeName==val).id
      this.signData.storeId=storeId
      this.storeSelect=false
    },
    //得到物流编码
    selectLogisticsData(val) {
      var logisticsCode = this.logisticsListData.find(
        item => item.name == val
      ).code;
      this.signData.logisticsCompanyCode = logisticsCode;
    },
    //获取货主列表
    getGoodsOwnerListData(organizationId) {
      this.request(this.api.system.goodsOwner_list, {
        orgId: organizationId
      }).then(data => {
        console.log(data.data);
        this.signData. goodsOwner = data.data[0].code;
      });
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
      this.request(this.api.warehouse.warehouseBase_logistics_list, {isValid:true}).then(res => {
        console.log(res);
        this.logisticsListData = res.data;
      });
    },
    //得到渠道订单号的数据
    async querySearch(queryString, cb) {
      console.log(queryString)
      if (queryString.length == 0) {
        return;
      }
      //得到渠道订单号联想数据
      var restaurants = await this.getOrderSnData(queryString);
      this.orderSnData=restaurants.data
      // 调用 callback 返回建议列表的数据
      cb(restaurants.data);
    },
    handleSelect(item) {
      console.log(item);
      this.signData.orderSn = item.orderSn;
      this.signData.storeName=item.storeName
      this.signData.mobile=item.mobile
      //标识退货商户状态
      this.storeNameStatus=true
      //根据订单号得到商品数据
      this.getShopDataByOrderSn(this.signData.orderSn)
    },
    //订单号联想数据
    async getOrderSnData(key) {
      // symbol 1--网销 2--渠销
      return await this.request(
        this.api.order.channelSaleOrder_getChannelListForRefundOrder,
        {
          orderType:'0101',
          searchKey: key
        },
        true
      );
    },
    //收货仓库
    selectwarehouseCodeChange(val) {
      console.log(val);
      var warehouseId = this.WarehouseCodeData.find(item => item.warehouseName == val).id;
      var code = this.WarehouseCodeData.find(item => item.warehouseName == val).warehouseCode;
      this.signData.warehouseCode = code;
    },
    //选择订单号的点击事件
    selectOrderSnClickEvent() {
      if(!this.signData.storeId){
        this.storeSelect=true
        return
      }
      this.request(this.api.order.channelSaleOrder_getChannelListForRefundOrder,{
        storeId:this.signData.storeId,
        orderType:'0101',
        pageIndex:1,
        pageSize:10
      },
      true).then(data=>{
       console.log(data)
       this.shopMsg=true
       this.gridTableData.gridData=data.data
       this.selectDataTotalPage=data.totalCount

       this.visible=true
       if(this.$refs['gridTableForm']){
        this.$refs['gridTableForm'].resetFields();
       }
      })
    },
    //选择商品的点击事件
    selectShopClickEvent() {
      this.$router.push({
        path: "/OS/salesReturn/ditchReturn/ditchReturn_shop",
        query:{
          ownerId:"",
          organizationName: this.signData.organization,
          warehouseName: this.signData.warehouse,
          warehouseId: this.signData.warehouseCode,
        }
      });
      //存储填写的信息
      localStorage.setItem("shopMsgData", JSON.stringify(this.signData));
      localStorage.setItem("localTableData",JSON.stringify(this.signData.channelOrderGoodsVOList));
    },
    //监听退货数量的变化
    salesReturnShopNumberChange(val) {
      console.log(val);
      var amount = 0;
      this.signData.breakageAmount='0.00'
      this.signData.channelOrderGoodsVOList.forEach(item => {
        amount += item.refundAmount * item.returnQuantity;
      });
      this.signData.amount=amount.toFixed(2);
      this.signData.refundAmount = amount.toFixed(2);
    },
    //监听退货数量的变化-不带num
    salesReturnNoNumShopNumberChange(val){
      var amount = 0;
      this.signData.breakageAmount='0.00'
      this.signData.channelOrderGoodsVOList.forEach(item => {
        amount += item.refundAmount * item.returnQuantity;
      });
      this.signData.amount=amount.toFixed(2);
      this.signData.refundAmount = amount.toFixed(2);
    },
    //监听退货单价的变化
    salesReturnPriceChange(val){
      var amount = 0;
      this.signData.breakageAmount='0.00'
      this.signData.channelOrderGoodsVOList.forEach(item => {
        amount += item.refundAmount * item.returnQuantity;
      });
      this.signData.amount=amount.toFixed(2);
      this.signData.refundAmount = amount.toFixed(2);
    },
    //优惠金额
    priceInputChangeEvent(val) {
      console.log(this.signData.breakageAmount);
      var breakageAmount=val.target.value.match(/^\d*(\.?\d{0,2})/g)
      this.signData.breakageAmount=breakageAmount[0]
    },
    //确认btn的点击事件
    primaryBtnClick() {
      var self=this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log("dasdasd");
          let channelOrderGoodsVOList = self.signData.channelOrderGoodsVOList.filter(item => {
            if(!item.tmpQuantity){
              return item.returnQuantity != 0;
            }else{
              return item.tmpQuantity !=item.returnQuantity && item.returnQuantity !=0;
            }
          });
          if(channelOrderGoodsVOList.length==0){
            this.$message.error('退货商品数量不能全部为0');
            return
          }
          this.signData.channelOrderGoodsVOList=channelOrderGoodsVOList
          this.request(
            this.api.order.channelRefundOrder_save,
            this.signData
          ).then(data => {
            console.log("270===========");
            //重置
            localStorage.removeItem("localTableData");
            this.$refs.ruleForm.resetFields();
            this.signData.channelOrderGoodsVOList = [];
            this.$router.go(-1)
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
      this.signData.gridTableData.pageSize= page;
      this.gridFormDataSearch()
    },
    //当前页改变时
    handleCurrentChange(page) {
      this.signData.gridTableData.pageIndex = page;
      this.gridFormDataSearch()
    },
    //选择Btn的点击事件
    selectBtnClick(row) {
      console.log(row);
      this.signData.storeName=row.storeName
      this.signData.mobile=row.mobile
      this.signData.orderSn=row.orderSn
      this.visible=false
      //标识退货商户状态
      this.storeNameStatus=true
      //根据订单号得到商品数据
      this.getShopDataByOrderSn(this.signData.orderSn)
    },
    //根据订单号得到对应的商品数据
    getShopDataByOrderSn(orderSn){
      this.request(this.api.order.channelSaleOrder_get,{orderSn:orderSn,storeId:this.signData.storeId,pageStart:'',pageSize:''}).then(res=>{
      this.shopMsg=true
      console.log(res)
      localStorage.removeItem('localTableData')
      this.signData.channelOrderGoodsVOList=res.channelSaleOrderGoodsVOList.data;
      var allAmount=0
      this.signData.channelOrderGoodsVOList.forEach(item=>{
        this.$set(item,'refundAmount',item.sellPrice)
        // item.returnQuantity=item.num
        allAmount+=item.num*item.refundAmount
      })
      this.signData.amount=allAmount.toFixed(2);
      this.signData.refundAmount=allAmount.toFixed(2);
    })
    },
    //搜索
    gridFormDataSearch() {
       this.request(this.api.order.channelRefundOrder_list, this.gridTableData).then(
        res => {
          this.gridTableData.gridData=res.data
        }
      );
    },
    //重置
    gridFormDataResetFilters(gridFormData) {
      this.$refs[gridFormData].resetFields();
    },
    //组织机构改变时的事件
    getTreeDeptName(val) {
      console.log(val)
    }
  }
};
</script>

<style lang="less" scoped>
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
  .disableSelect /deep/ .el-input .el-input__inner{
    border: 1px solid red;
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

