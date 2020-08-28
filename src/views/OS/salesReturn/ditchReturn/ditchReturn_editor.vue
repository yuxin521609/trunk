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
        <el-row>
          <el-col :span="8">
            <el-form-item label="组织机构：" prop="organizationCode">

            </el-form-item>
            <el-form-item label="渠道订单号：" prop="orderSn">
              <div class="order_div">
                <el-input v-model="signData.orderSn"></el-input>
                <p
                  class="select_order_label"
                  @click="selectOrderSnClickEvent"
                  v-popover:popover
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
                  :label="item.name"
                  :key="item.id"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流公司：" prop="logisticsList">
              <el-select
                @change="selectwarehouseCodeChange"
                v-model="signData.logisticsList"
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
          </el-col>
          <el-col :span="6">
            <el-form-item label="网销店铺：" >
              <el-select
                @change="selectwarehouseCodeChange"
                v-model="signData.logisticsList"
                placeholder="请选择店铺"
              >
                <el-option
                  v-for="item in logisticsListData"
                  :label="item.company"
                  :key="item.id"
                  :value="item.company"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户名称：" prop="name">
              <el-input v-model="signData.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="客户电话：" prop="phone">
              <el-input v-model="signData.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="物流单号：" prop="logisticsSn">
              <el-input v-model="signData.logisticsSn" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="table_msg">
        <div class="title_span">
          <span>商品信息</span>
          <span class="select_shop_title" @click="selectShopClickEvent">选择商品</span>
        </div>
        <div class="table_div">
          <el-table
            :data="signData.tableData"
            stripe
            style="width: 100%"
            header-row-class-name="item-table-header"
            max-height="400"
          >
            <el-table-column prop="date" label="商品款号" width="180"></el-table-column>
            <el-table-column prop="name" label="商品货号" width="180"></el-table-column>
            <el-table-column prop="address" label="商品图片">
              <!-- <template slot-scope="scope">
                  <image :scr='scope.row.image' style="width:32px;height:32px;"></image>
              </template>-->
            </el-table-column>
            <el-table-column prop="date" label="商品名称" width="180"></el-table-column>
            <el-table-column prop="name" label="商品类型" width="180">
              <template slot-scope="scope">
                <span>颜色：{{scope.row.name}}</span>
                <br />
                <span>尺寸：{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="品牌"></el-table-column>
            <el-table-column prop="date" label="商品品类" width="180"></el-table-column>
            <el-table-column prop="name" label="规格属性" width="180">
              <template slot-scope="scope">
                <span>颜色：{{scope.row.name}}</span>
                <br />
                <span>尺寸：{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="销售单价">
              <template slot-scope="scope">
                <span>￥{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="arrivalQuantity" label="退货单价" width="120" align="center">
              <template slot-scope="scope">
                <div class="tag_div">
                  <span>￥</span>
                  <el-input
                    @change="shopNumberChange($event,scope.row)"
                    min="0"
                    max="9"
                    type="number"
                    v-model="scope.row.arrivalQuantity"
                    placeholder="填写数量"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="销售数量"></el-table-column>
            <el-table-column prop="address" label="退货数量" width="180" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.num"
                  @change="bottomShopNumberChange"
                  :min="0"
                  :max="100"
                  v-enter-number
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="money-div">
          <span>商品总金额：￥{{signData.amount?signData.amount:'--'}}</span>
          <div class="money-content">
            <span>优惠金额：</span>
            <input type="text" class="input-price" placeholder="填写优惠项" />
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
          <span>订单金额：￥{{signData.actualAmount?signData.actualAmount:'--'}}</span>
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
      <el-popover ref="popover" placement="right" width="800" trigger="click" v-model="visible">
        <div style="width:100%;display:flex;border-bottom:1px solid #ccc;padding-bottom:8px;">
          <span style="color:#409eff;flex:auto;">选择退货单</span>
          <i class="el-icon-close" @click="visible=false"></i>
        </div>
        <div style="margin-top:20px;">
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
          height="350"
        >
          <el-table-column width="150" property="date" label="订单号"></el-table-column>
          <el-table-column width="100" property="name" label="商户姓名"></el-table-column>
          <el-table-column width="300" property="address" label="联系电话"></el-table-column>
          <el-table-column width="150" property="date" label="订单来源"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                @click="selectBtnClick(scope.row)"
                type="text"
                size="small"
                style="color:#409eff"
              >选择</el-button>
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
            :total="400"
          ></el-pagination>
        </div>
      </el-popover>
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
        //退货备注
        remarks: "",
        //优惠金额
        preferentialAmount: "",
        //组织机构
        organizationCode: "",
        //退货日期
        date: "",
        //收货仓库
        warehouse: "",
        //渠道订单号
        orderSn: "",
        //物流公司
        logisticsList: "",
        //退货商户
        name: "",
        //联系电话
        phone: "",
        //物流单号
        logisticsSn: "",
        //表格数据
        tableData: [
          {
            num: 1,
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            num: 1,
            date: "2016-05-04",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1517 弄"
          },
          {
            num: 1,
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1519 弄"
          },
          {
            num: 1,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄"
          },
          {
            num: 1,
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1519 弄"
          },
          {
            num: 1,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄"
          }
        ]
      },
      rules: {
        organizationCode: [
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
        name: [
          { required: true, message: "商户姓名不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        logisticsSn: [
          { required: true, message: "物流单号不能为空", trigger: "blur" }
        ]
      },
      //收货仓库--合格的仓库
      WarehouseCodeData: [],
      //获取物流数据
      logisticsListData: [],
      //标识popover的显示或隐藏
      visible: false,
      //选择订单table的数据
      gridTableData: {
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条,
        pageSize: 5,
        //检索字段
        searchKey: "",
        //订单来源数据
        channelCodes: [],
        gridData: [
          {
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-04",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          }
        ]
      }
    };
  },
  mounted() {
    this.getWarehouseList();
    this.getLogisticsList();
  },
  methods: {
    //得到仓库列表
    getWarehouseList() {
      this.request(this.api.system.warehouse_list, {
        used: true,
        storageType: 0
      }).then(data => {
        console.log(data);
        this.WarehouseCodeData = data.data;
      });
    },
    //获取物流数据
    getLogisticsList() {
      this.request(this.api.order.expressCompany_list, {}).then(data => {
        console.log(data);
        this.logisticsListData = data.data;
      });
    },
    //收货仓库
    selectwarehouseCodeChange(val) {
      console.log(val);
    },
    //选择订单号的点击事件
    selectOrderSnClickEvent() {
      console.log("selectOrderSnClickEvent.......");
      this.gridTableData.channelCodes = [];
    },
    //选择商品的点击事件
    selectShopClickEvent() {
      this.$router.push({
        path:'/OS/salesReturn/ditchReturn/ditchReturn_shop'
      })
    },
    //监听数值的变化
    bottomShopNumberChange(val) {
      console.log(val);
    },
    //优惠金额
    priceInputChangeEvent() {
      console.log(this.signData.preferentialAmount);
    },
    //确认btn的点击事件
    primaryBtnClick() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          console.log("dasdasd");
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

