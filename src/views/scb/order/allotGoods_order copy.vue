<style lang="less" scoped></style>
<template>
  <div class="transfer_slip_list">
    <!-- 选择调出入方信息 -->
    <el-dialog @closed="closeDialog" width="1200px" :title="allocatingType ? '选择调出方客户' : '选择调入方客户'" :visible.sync="dialogTableVisible">
      <template v-if="allocatingType">
        <el-form class="item-form" :model="formData" label-width="90px" size="small" ref="formData" inline>
          <el-form-item label="客户名称：" prop="inStoreId">
            <el-select
              v-model="formDataOut.name"
              placeholder="请选择"
              class="input-w"
              filterable
              clearable>
              <el-option
                v-for="item in searchTuneOut_data"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道类型：" prop="inStoreId">
            <el-select
              v-model="formDataOut.channel"
              placeholder="请选择"
              class="input-w"
              filterable
              clearable>
              <el-option
                v-for="item in channelType"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchTableDataOut" type="primary" plain>搜索</el-button>
            <el-button @click="initFormDataOut" plain>重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tuneOut_data.data" max-height="350" class="mt-10">
          <el-table-column label="单选" align="center" min-width="50">
            <template slot-scope="scope">
              <el-radio-group v-model="checkTuneOutUser">
                <el-radio :label="scope.row">&nbsp;</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="渠道客户名称" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="渠道类型" align="center" min-width="90">
            <template slot-scope="scope">零售商</template>
          </el-table-column>
          <el-table-column label="所在省/直辖市" align="center" min-width="90">
            <template :show-overflow-tooltip="true" slot-scope="scope">{{ scope.row.provinceName }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="市/区" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.cityName }}</template>
          </el-table-column>
           <el-table-column :show-overflow-tooltip="true" label="详细地址" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.addressInfo }}</template>
          </el-table-column>
           <el-table-column :show-overflow-tooltip="true" label="联系人" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.linkman }}</template>
          </el-table-column>
           <el-table-column :show-overflow-tooltip="true" label="联系电话" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.phone }}</template>
          </el-table-column>
           <el-table-column :show-overflow-tooltip="true" label="最后一次采配时间" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.createTime }}</template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="dcNext">下一步</el-button>
        </span>
      </template>
      <template v-else>
        <el-form
          class="item-form"
          :model="formData"
          label-width="90px"
          size="small"
          ref="formData"
          inline>
          <el-form-item label="客户名称：" prop="inStoreId">
            <el-select
              v-model="formDataIn.name"
              placeholder="请选择"
              class="input-w"
              filterable
              clearable>
              <el-option
                v-for="item in searchTuneIn_data"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道类型：" prop="inStoreId">
            <el-select
              v-model="formDataIn.channel"
              placeholder="请选择"
              class="input-w"
              filterable
              clearable>
              <el-option
                v-for="item in channelType"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchTableDataIn" type="primary" plain>搜索</el-button>
            <el-button @click="initFormDataIn" plain>重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tuneIn_data.data" max-height="350" class="mt-10">
          <el-table-column label="单选" align="center" min-width="50">
            <template slot-scope="scope">
              <el-radio-group v-model="checkTuneInUser">
                <el-radio :disabled="scope.row.status == 10" :label="scope.row">&nbsp;</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="渠道客户名称" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="渠道类型" align="center" min-width="90">
            <template slot-scope="scope">零售商</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="所在省/直辖市" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.provinceName }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="市/区" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.cityName }}</template>
          </el-table-column>
           <el-table-column :show-overflow-tooltip="true" label="详细地址" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.addressInfo }}</template>
          </el-table-column>
           <el-table-column :show-overflow-tooltip="true" label="联系人" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.linkman }}</template>
          </el-table-column>
           <el-table-column :show-overflow-tooltip="true" label="联系电话" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.phone }}</template>
          </el-table-column>
           <el-table-column :show-overflow-tooltip="true" label="最后一次采配时间" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.createTime }}</template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogMap">上一步</el-button>
          <el-button type="primary" @click="drNext">下一步</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="item-margin">
      <el-form
        class="item-form"
        :model="formData"
        label-width="90px"
        size="small"
        ref="formData"
        inline
      >
        <!-- 模糊查询 -->
        <el-form-item label="模糊查询：">
          <el-input
            v-model="formData.filter"
            @keyup.enter.native="handleSearch"
            style="width:310px;"
            placeholder="收货单号/关联单号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="单据状态：" prop="orderStatus">
          <el-select
            placeholder="请选择"
            class="input-w"
            v-model="formData.orderStatus"
            filterable
            clearable
          >
            <el-option v-for="item in billType" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调出名称：" prop="outStoreId">
          <el-select
            v-model="formData.outStoreId"
            placeholder="请选择"
            class="input-w"
            filterable
            clearable
          >
            <el-option
              v-for="item in inStoreList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调入名称：" prop="inStoreId">
          <el-select
            v-model="formData.inStoreId"
            placeholder="请选择"
            class="input-w"
            filterable
            clearable
          >
            <el-option
              v-for="item in inStoreList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <time-interval-check :form-data="formData" label="创建时间："></time-interval-check>
        <el-form-item>
          <el-button @click="searchTableData" type="primary" plain>搜索</el-button>
          <el-button @click="initFormData" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="item-margin item-cont">
      <div v-if="!enterTypeFlag">
        <el-button size="small" type="primary" @click="addAllot">新增调货</el-button>
        <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
      </div>
      <page-table :form-data="formData" :get-data="getTableData" :table-data="tableData">
        <el-table
          :data="tableData.data"
          style="width: 100%"
          row-key="id"
          @selection-change="tableCheckChange"
          id="table-data"
        >
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column prop="orderSn" label="调拨单号" width="200"></el-table-column>
          <el-table-column prop="_orderStatus" label="状态"></el-table-column>
          <el-table-column prop="outStoreName" label="调出方名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="inStoreName" label="调入方名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="skuQuantity" label="SKU数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="调出数量" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.quantity|| '--' }}</template>
          </el-table-column>
          <el-table-column label="调出货值" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.amountCopy }}</template>
          </el-table-column>
          <el-table-column label="调入货值" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.transferValueCopy == 'null' ? '--' : scope.row.transferValueCopy }}</template>
          </el-table-column>
          <el-table-column prop="shipmentsQty" label="实发数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="receiveQty" label="实收数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="differenceQty" label="实收差异" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="recallOrderNumber" label="关联调出单号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="receiptNumber" label="关联收货单号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_createTime" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="260">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="seeItem(scope.row)">查看</el-button>
              <template v-if="!enterTypeFlag">
                <el-button
                  type="text"
                  size="small"
                  @click="editItem(scope.row)"
                  v-if="scope.row.orderStatus === 13"
                >编辑</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="delItem(scope.row)"
                  v-if="scope.row.orderStatus === 0"
                >作废</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="finishItem(scope.row)"
                  v-if="scope.row.orderStatus === 2"
                >强制完成</el-button>
                <!-- <el-button
                  type="text"
                  size="small"
                  @click="remarksItem(scope.row)"
                  v-if="scope.row.orderStatus === 3"
                >备注</el-button> -->
              </template>
              <el-button type="text" size="small" @click="downloadItem(scope.row)">导出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-table>
    </div>
    <!--备注-->
    <el-dialog title="备注" :visible.sync="remarksDialog" width="40%" :close-on-click-modal="false">
      <el-form
        :model="remarksFormData"
        :rules="rules"
        ref="remarksForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="备注：" prop="reason">
          <el-input
            type="textarea"
            maxlength="120"
            show-word-limit
            :rows="3"
            placeholder="请输入内容"
            v-model="remarksFormData.operationRemarks"
          ></el-input>
          <p>最大长度为120个字符</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarksDialog = false" size="small">取 消</el-button>
        <el-button @click="remarksSub" type="primary" size="small">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import PageTable from "@/views/collocation/components/PageTable";
import TimeIntervalCheck from "@/components/TimeIntervalCheck";
export default {
  name: "allotGoods_order",
  // 数据
  data() {
    return {
      id:null,
      channelType:{
        0:'零售商',
        1:'经销商',
        2:'分销商',
      },
      formDataOut:{
        enableAllocation: 1,
        name:null,
        channel:null
      },
      formDataIn:{
        enableAllocation: 1,
        name:null,
        channel:null
      },
      // 调出方列表
      tuneOut_data:[],
      searchTuneOut_data:[],
      iStuneOut_fn:true,
      // 调入方列表
      tuneIn_data:[],
      searchTuneIn_data:[],
      iStuneIn_fn:true,
      // 选中调出方信息
      checkTuneOutUser:{},
      // 选中调入方信息
      checkTuneInUser:{},
      // 参数
      addFormData: {
        // 发货人
        allotMan: '',
        // 发货人直属机构
        organizationId: '',
        organizationName: '',
        // 订单类型
        // orderType: '0203',
        // 发货门店
        outStoreId: '',
        outStoreName: '',
        // 收货门店
        inStoreId: '',
        inStoreName: '',
        // 收货人
        receiveMan: '',
        // 电话
        phone: '',
        // 省市区信息
        provinceName: '',
        provinceCode: '',
        cityName: '',
        cityCode: '',
        areaName: '',
        areaCode: '',
        divisionId: '',
        // 地址
        addressInfo: ''
      },
      // 选择调出弹框
      dialogTableVisible:false,
      // 选择调出类型
      allocatingType:true,
      // 标识是否是零售门店进入
      enterTypeFlag: false,
      // 查询参数
      formData: {
        filter:null,
        // 页面模块ID
        menuId: "",
        // 区分调用地方  0 门店  1 订单中心和智能搭配
        requestLocation: 1,
        // 单据状态
        orderStatus: "",
        // 发货门店
        outStoreId: "",
        // 收货门店
        inStoreId: "",
        // 收货差异
        difference: "",
        // 时间
        createTimeBegin: "",
        createTimeEnd: "",
        pageIndex: 1,
        pageSize: 10
      },
      // 收货差异
      differenceList: [{ name: "是", id: 1 }, { name: "否", id: 0 }],
      // 发货门店列表
      outStoreList: [],
      // 收货门店列表
      inStoreList: [],
      // 单据状态
      billType: this.$common.getBillType("allot"),
      // 表格数据
      tableData: {},
      // 选中的表格数据
      checkedTableData: [],

      // 备注弹窗
      remarksDialog: false,
      remarksFormData: {
        id: "",
        operationRemarks: ""
      },
      rules: {
        operationRemarks: [
          {
            type: "string",
            required: true,
            message: "请输入内容",
            trigger: "blur"
          }
        ]
      }
    };
  },
  // 组件
  components: {
    PageTable,
    TimeIntervalCheck
  },
  created() {
    // 删除子页面的门店缓存
    sessionStorage.removeItem("TRANSFER_SLIP_APP_INFO");
    // 获取模块id
    this.formData.menuId = this.$route.meta.currentid;
    this.info();
    this.getInStoreList();
  },
  activated() {
    this.getTableData();
  },
  // 初始化数据
  mounted() {
    this.$nextTick(() => {
      // this.getInStoreList();
      this.getOutStoreList();
      this.getTableData();
    });
  },
  // 方法
  methods: {
    // 获取收货门店数据
    getInStoreList() {
      this.request(this.api.store.storeBasic_listStoreBasic, {}).then(data => {
        this.inStoreList = data.data;
      });
    },
    /**
     * 点击新增调货
     */
    addAllot() {
      this.dialogTableVisible = true;
      this.allocatingType = true;
      this.tuneOut_fn();
    },
    async info() {
      // 获取userId
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      // 保存用户名称
      this.addFormData.allotMan = info.name;
      // 获取直属机构
      let organization = await this.request(this.api.user.userCompany_getUserOrgByUserId, {userId: info.userId}, true);
      this.addFormData.organizationId =  organization.id;
      this.addFormData.organizationName =  organization.name;
    },
    closeDialog() {
      Object.assign(this.formDataOut, {
        enableAllocation: 1,
        name:null,
        channel:null
      });
      Object.assign(this.formDataIn, {
        enableAllocation: 1,
        name:null,
        channel:null
      });
    },
    /**
     * 调入、调出门店接口列表，调出传入调入ID（SCB)
     * @param
     * @param
     */
    tuneOut_fn() {
      this.request(
        this.api.store.storeBasic_listStoreBasic,
        this.formDataOut
      ).then(data => {
        this.tuneOut_data = data;
        this.checkTuneOutUser = {};
        if(!this.iStuneOut_fn) return;
        this.iStuneOut_fn = false;
        this.searchTuneOut_data = JSON.parse(JSON.stringify(data.data));
      });
    },
    /**
     * 获取调入方客户
     * @param { String } id 调出方id
     */
    tuneIn_fn(id) {
      Object.assign(this.formDataIn, {
        id:this.id
      })
      this.request(
        this.api.store.storeBasic_listStoreBasic,
        this.formDataIn
      ).then(data => {
        this.tuneIn_data = data;
        this.checkTuneInUser = {};
        if(!this.iStuneIn_fn) return;
        this.iStuneIn_fn = false;
        this.searchTuneIn_data = JSON.parse(JSON.stringify(data.data));
        
      });
    },
    /**
     * 调出下一步
     */
    dcNext() {
      if(JSON.stringify(this.checkTuneOutUser) == '{}') {
        this.warn('请选择调出方客户！', 'warning');
        return;
      };
      this.allocatingType = false;
      this.id = this.checkTuneOutUser.id;
      this.tuneIn_fn();
    },
    /**
     * 调入上一步
     */
    handleDialogMap() {
      this.allocatingType = true;
    },
    /**
     * 提示
     * @param { String } message 提示文案
     * @param { String } type 提示类型
     */
    warn(message, type) {
      this.$message({
        message: message,
        type: type || "success"
      });
    },
    /**
     * 调入下一步
     */
    drNext() {
      if(JSON.stringify(this.checkTuneInUser) == '{}') {
        this.warn('请选择调入方客户！', 'warning');
        return;
      }; 
      Object.assign(this.addFormData, {
        outStoreId: this.checkTuneOutUser.id,
        outStoreName: this.checkTuneOutUser.name,
        // 收货门店
        inStoreId: this.checkTuneInUser.id,
        inStoreName: this.checkTuneInUser.name,
        // 收货人
        receiveMan: this.checkTuneInUser.linkman,
        // 电话
        phone: this.checkTuneInUser.phone,
        // 省市区信息
        provinceName: this.checkTuneInUser.provinceName,
        provinceCode: this.checkTuneInUser.provinceCode,
        cityName: this.checkTuneInUser.cityName,
        cityCode: this.checkTuneInUser.cityCode,
        areaName: this.checkTuneInUser.areaName,
        areaCode: this.checkTuneInUser.areaCode,
        divisionId: this.checkTuneInUser.divisionId,
        // 地址
        addressInfo: this.checkTuneInUser.addressInfo
      });
      console.log(this.addFormData);
      sessionStorage.setItem('TRANSFER_SLIP_APP_INFO', JSON.stringify(this.addFormData));
      this.dialogTableVisible = false;
      // return;
      let module = "/" + this.$route.path.split("/")[1];
      this.$router.push({
        path: module + "/order/allotGoods_order_edit"
      });
      this.checkTuneOutUser = {};
      this.checkTuneInUser = {};
    },
    // keepAlive 返回初始化
    activatedInit() {
      this.getTableData();
    },
    // 导出
    exportExcel() {
      if (this.checkedTableData.length === 0) {
        this.checkedTableData = this.tableData.data;
      }
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "调拨单号",
          "状态",
          "调出方名称",
          "调入方名称",

          "SKU数量",
          "调出数量",
          "调出货值",
          "调入货值",

          "实发数量",
          "实收数量",
          "实收差异",
          "关联调出单号",

          "关联收货单号",
          "创建时间"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "orderSn",
          "_orderStatus",
          "outStoreName",
          "inStoreName",

          "skuQuantity",
          "quantity",
          "amountCopy",
          "transferValueCopy",

          "shipmentsQty",
          "receiveQty",
          "differenceQty",
          "recallOrderNumber",

          "receiptNumber",
          "_createTime"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.checkedTableData; //把data里的tableData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "调拨单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    // 行商品详情导出
    downloadItem(row) {
      this.request(this.api.order.storeAllotOrderProductInfo_list, {
        orderSn: row.orderSn
      }).then(data => {
        this.downloadDataInit(data.data);
        let downloadData = data.data;
        require.ensure([], () => {
          let { export_json_to_excel } = require("@/vendor/Export2Excel");
          let tHeader = [
            "商品款号",
            "商品货号",
            "名称",
            "品牌",
            "吊牌价",
            "调拨单价",
            "调拨数量",
            "调拨金额",
            "门店实发数量",
            "门店实收数量"
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "productCode",
            "goodsCode",
            "goodsName",
            "brandName",
            "_retailPrice",
            "_allotPrice",
            "quantity",
            "_amount",
            "shipmentsQty",
            "receiveQty"
          ];
          // 上面的index、nickName、name是tableData里对象的属性
          let list = downloadData; //把data里的tableData存到list
          let data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "调拨商品信息");
        });
      });
    },
    downloadDataInit(data) {
      if (data && data.length) {
        data.forEach(item => {
          item._retailPrice = "￥" + item.retailPrice;
          item._allotPrice = "￥" + item.allotPrice;
          item._amount = "￥" + (item.quantity * item.allotPrice);
        });
      }
    },
    // 点击搜索
    searchTableData() {
      this.formData.pageIndex = 1;
      this.getTableData();
    },
    searchTableDataOut() {
      this.tuneOut_fn();
    },
    searchTableDataIn() {
      this.tuneIn_fn();
    },
    // 获取列表数据
    getTableData() {
      this.request(
        this.api.order.storeAllotGoodsOrder_recallList,
        this.formData
      ).then(data => {
        this.initTableData(data.data);
        this.tableData = data;
      });
    },
    // 初始化数据 导出使用
    initTableData(data) {
      if (data && data.length) {
        data.forEach(item => {
          item._createTime = this.$options.filters.timestampToTime(
            item.createTime
          );
          item.amountCopy = item.amountCopy == 'null' ? '--' : item.amountCopy
          item._amount = "￥" + item.amount;
          item._difference =
            item.difference === null ? "--" : item.difference ? "是" : "否";
          item._differenceQty =
            item.differenceQty === null ? "--" : item.differenceQty;
          item._orderStatus = this.statusToName(item.orderStatus);
        });
      }
    },
    // 获取表格选中的
    tableCheckChange(val) {
      this.checkedTableData = val;
    },
    // 初始查询条件
    initFormData() {
      Object.assign(this.formData,  {
        filter:null,
        // 页面模块ID
        menuId: "",
        // 区分调用地方  0 门店  1 订单中心和智能搭配
        requestLocation: 1,
        // 单据状态
        orderStatus: "",
        // 发货门店
        outStoreId: "",
        // 收货门店
        inStoreId: "",
        // 收货差异
        difference: "",
        // 时间
        createTimeBegin: "",
        createTimeEnd: "",
        pageIndex: 1,
        pageSize: 10
      })
    },
    initFormDataOut() {
      Object.assign(this.formDataOut, {
        enableAllocation: 1,
        name:null,
        channel:null
      })
    },
    initFormDataIn() {
      Object.assign(this.formDataIn, {
        enableAllocation: 1,
        name:null,
        channel:null
      })
    },
    // 新增
    addItem() {
      let module = "/" + this.$route.path.split("/")[1];
      this.$router.push({
        path: module + "/order/allotGoods_order_edit"
      });
    },
    // 查看
    seeItem(row) {
      let module = "/" + this.$route.path.split("/")[1];
      this.$router.push({
        path: module + "/order/allotGoods_order_detail",
        query: {
          id: row.id,
          orderSn: row.orderSn
        }
      });
    },
    // 编辑
    editItem(row) {
      let module = "/" + this.$route.path.split("/")[1];
      sessionStorage.setItem('TRANSFER_SLIP_APP_INFO', JSON.stringify(row));
      this.$router.push({
        path: module + "/order/allotGoods_order_edit",
        query: {
          id: row.id,
          orderSn: row.orderSn,
          outStoreId: row.outStoreId
        }
      });
    },
    // 作废
    delItem(row) {
      this.$confirm("作废后该单据将失效，是否要将该单据作废？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: false
      })
      .then(() => {
        this.request(this.api.order.storeAllotGoodsOrder_invalid, {
          id: row.id
        }).then(data => {
          this.$notify.success({ title: "成功", message: "作废成功" });
          this.getTableData();
        });
      })
      .catch(() => {});
    },
    // 强制完成
    finishItem(row) {
      this.$confirm("确定强制完成吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: false
      })
        .then(() => {
          this.request(
            this.api.order.storeAllotGoodsOrder_forcedEnd,
            { 
              id: row.id,
              operator:this.addFormData.allotMan
            }
          ).then(data => {
            this.$notify.success({ title: "成功", message: "完成成功" });
            this.getTableData();
          });
        })
        .catch(() => {});
    },
    // 备注显示
    remarksItem(row) {
      this.remarksFormData.id = row.id;
      this.remarksFormData.operationRemarks = row.operationRemarks;
      this.remarksDialog = true;
    },
    // 备注提交
    remarksSub() {
      this.$refs.remarksForm.validate(valid => {
        if (valid) {
          this.request(
            this.api.order.storeAllotGoodsOrder_insertRemarks,
            this.remarksFormData
          ).then(data => {
            this.$notify.success({ title: "成功", message: "备注成功" });
            this.remarksDialog = false;
            this.getTableData();
          });
        } else {
          return false;
        }
      });
    },
    // 状态转name
    statusToName(val) {
      if (!val && val !== 0) return;
      let item = this.billType.find(item => {
        return item.id === val;
      });
      if (item) {
        return item.name;
      } else {
        return val;
      }
    },
    // 获取发货门店数据
    async getOutStoreList() {
      // 获取userId
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      // 获取直属机构
      let organization = await this.request(
        this.api.user.userCompany_getUserOrgByUserId,
        { userId: info.userId },
        true
      );
      // enableAllocation: 1  (启用门店调拨 后端需要)
      this.request(this.api.retailStore.storeBasic_listBase, {
        organizationId: organization.id,
        enableAllocation: 1
      }).then(data => {
        this.outStoreList = data.data;
      });
    },
    // 获取收货门店数据
    // getInStoreList() {
    //   this.request(this.api.store.storeBasic_list, {}).then(data => {
    //     this.inStoreList = data.data;
    //   });
    // }
  },
  filters: {},
  // 计算属性
  computed: {},
  // 监听数据变化
  watch: {}
};
</script>
