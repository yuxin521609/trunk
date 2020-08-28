<style lang="less" scoped></style>
<template>
  <div class="transfer_slip_list">
    <div class="item-margin">
      <el-form class="item-form" :model="formData" label-width="90px" size="small" ref="formData" inline>
        <el-form-item label="单据状态：" prop="orderStatus">
          <el-select placeholder="请选择" class="input-w" v-model="formData.orderStatus" filterable clearable>
            <el-option
                v-for="item in billType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货门店：" prop="outStoreId">
          <el-select v-model="formData.outStoreId" placeholder="请选择" class="input-w" filterable clearable>
            <el-option v-for="item in outStoreList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货门店：" prop="inStoreId">
          <el-select v-model="formData.inStoreId" placeholder="请选择" class="input-w" filterable clearable>
            <el-option v-for="item in inStoreList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货差异：" prop="difference">
          <el-select v-model="formData.difference" placeholder="请选择" class="input-w" filterable clearable>
            <el-option v-for="item in differenceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <time-interval-check :form-data="formData" label="提交时间："></time-interval-check>
        <el-form-item>
          <el-button @click="searchTableData" type="primary" plain>搜索</el-button>
          <el-button @click="initFormData" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="item-margin item-cont">
      <div v-if="!enterTypeFlag">
        <el-button size="small" type="primary" @click="addItem">新增</el-button>
      </div>
      <page-table :form-data="formData" :get-data="getTableData" :table-data="tableData">
        <el-table :data="tableData.data" style="width: 100%" row-key="id" @selection-change="tableCheckChange" id="table-data">
          <el-table-column prop="orderSn" label="调拨单号" width="200"></el-table-column>
          <el-table-column prop="outStoreName" label="发货门店" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="inStoreName" label="收货门店" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_createTime" label="提交时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_amount" label="调拨金额" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="quantity" label="调拨数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="shipmentsQty" label="实发数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="receiveQty" label="实收数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_difference" label="收货差异" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_differenceQty" label="差异数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="operationRemarks" label="备注" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_orderStatus" label="单据状态"></el-table-column>
          <el-table-column label="操作" width="260">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="seeItem(scope.row)">查看</el-button>
              <template v-if="!enterTypeFlag">
                <el-button type="text" size="small" @click="editItem(scope.row)" v-if="scope.row.orderStatus === 13">编辑</el-button>
                <el-button type="text" size="small" @click="delItem(scope.row)" v-if="scope.row.orderStatus === 0">作废</el-button>
                <el-button type="text" size="small" @click="finishItem(scope.row)" v-if="scope.row.orderStatus === 2">强制完成</el-button>
                <el-button type="text" size="small" @click="remarksItem(scope.row)" v-if="scope.row.orderStatus === 3">备注</el-button>
              </template>
              <el-button type="text" size="small" @click="downloadItem(scope.row)">导出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-table>
    </div>
    <!--备注-->
    <el-dialog title="备注" :visible.sync="remarksDialog" width="40%" :close-on-click-modal="false">
      <el-form :model="remarksFormData" :rules="rules" ref="remarksForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="备注：" prop="reason">
          <el-input type="textarea" maxlength="120"  show-word-limit :rows="3" placeholder="请输入内容" v-model="remarksFormData.operationRemarks">
          </el-input>
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
  import keepAliveMixin from "@/mixins/keepAliveMixin";
  export default {
    name: 'transfer_slip_list',
    mixins: [keepAliveMixin],
    // 数据
    data() {
      return {
        // 标识是否是零售门店进入
        enterTypeFlag: false,
        // 查询参数
        formData: {
          // 页面模块ID
          menuId: '',
          // 区分调用地方  0 门店  1 订单中心和智能搭配
          requestLocation: 1,
          // 单据状态
          orderStatus: '',
          // 发货门店
          outStoreId: '',
          // 收货门店
          inStoreId: '',
          // 收货差异
          difference: '',
          // 时间
          createTimeBegin: '',
          createTimeEnd: '',
          pageIndex: 1,
          pageSize: 10
        },
        // 收货差异
        differenceList: [
          {name: '是', id: 1},
          {name: '否', id: 0}
        ],
        // 发货门店列表
        outStoreList: [],
        // 收货门店列表
        inStoreList: [],
        // 单据状态
        billType: this.$common.getBillType('transferSlip'),
        // 表格数据
        tableData: {},
        // 选中的表格数据
        checkedTableData: [],

        // 备注弹窗
        remarksDialog: false,
        remarksFormData: {
          id: '',
          operationRemarks: ''
        },
        rules: {
          operationRemarks: [
            {type: 'string',required: true, message: '请输入内容', trigger: 'blur'}
          ]
        },
      }
    },
    // 组件
    components: {
      PageTable,
      TimeIntervalCheck
    },
    created(){
      // 删除子页面的门店缓存
      sessionStorage.removeItem('TRANSFER_SLIP_APP_INFO');
      // 获取模块id
      this.formData.menuId = this.$route.meta.currentid;
      // 控制台的零售门店进来的时候
      if(this.$route.path === '/store/transfer_slip/transfer_slip_list'){
        this.formData.requestLocation = 0;
        this.enterTypeFlag = true
      }
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getInStoreList();
        this.getOutStoreList();
        this.getTableData();
      })
    },
    // 方法
    methods: {
      // keepAlive 返回初始化
      activatedInit(){
        this.getTableData();
      },
      // 导出
      exportExcel() {
        if(this.checkedTableData.length === 0){
          this.$notify.error({ title: '错误',message: '请选择数据'});
          return
        }
        require.ensure([], () => {
          let { export_json_to_excel } = require("@/vendor/Export2Excel");
          let tHeader = [
            "调拨单号",
            "发货门店",
            "收货门店",
            "提交时间",
            "调拨金额",
            "调拨数量",
            "实发数量",
            "实收数量",
            "收货差异",
            "差异数量",
            "备注",
            "单据状态",
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "orderSn",
            "outStoreName",
            "inStoreName",
            "_createTime",
            "_amount",
            "quantity",
            "shipmentsQty",
            "receiveQty",
            "_difference",
            "_differenceQty",
            "operationRemarks",
            "_orderStatus"
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
      downloadItem(row){
        this.request(this.api.order.storeAllotOrderProductInfo_list, {
          orderSn: row.orderSn,
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
              "门店实收数量",
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
      downloadDataInit(data){
        if(data && data.length){
          data.forEach(item => {
            item._retailPrice = '￥' + item.retailPrice.toFixed(2);
            item._allotPrice = '￥' + item.allotPrice.toFixed(2);
            item._amount =  '￥' + (item.quantity * item.allotPrice).toFixed(2);
          })
        }
      },
      // 点击搜索
      searchTableData(){
        this.formData.pageIndex = 1;
        this.getTableData();
      },
      // 获取列表数据
      getTableData(){
        this.request(this.api.order.storeAllotGoodsOrder_list, this.formData).then(data => {
          this.initTableData(data.data);
          this.tableData = data
        });
      },
      // 初始化数据 导出使用
      initTableData(data){
        if(data && data.length){
          data.forEach(item => {
            item._createTime = this.$options.filters.timestampToTime(item.createTime);
            item._amount = '￥' + item.amount;
            item._difference =  item.difference === null ? '--': item.difference ? '是' : '否';
            item._differenceQty =  item.differenceQty === null ? '--': item.differenceQty;
            item._orderStatus = this.statusToName(item.orderStatus);
          })
        }
      },
      // 获取表格选中的
      tableCheckChange(val){
        this.checkedTableData = val;
      },
      // 初始查询条件
      initFormData(){
        this.$refs.formData.resetFields();
      },
      // 新增
      addItem(){
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/transfer_slip/transfer_slip_add'
        });
      },
      // 查看
      seeItem(row){
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/transfer_slip/transfer_slip_details',
          query: {
            id: row.id,
            orderSn: row.orderSn
          }
        });
      },
      // 编辑
      editItem(row){
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/transfer_slip/transfer_slip_add',
          query: {
            id: row.id,
            orderSn: row.orderSn,
            outStoreId: row.outStoreId
          }
        });
      },
      // 作废
      delItem(row){
        this.$confirm('作废后该单据将失效，是否要将该单据作废？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          this.request(this.api.order.storeAllotGoodsOrder_cancel, {id: row.id}).then(data => {
            this.$notify.success({ title: '成功',message: '作废成功'});
            this.getTableData();
          });
        }).catch(() => {
        });
      },
      // 强制完成
      finishItem(row){
        this.$confirm('确定强制完成吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          this.request(this.api.order.storeAllotGoodsOrder_enforcementFinished, {id: row.id}).then(data => {
            this.$notify.success({ title: '成功',message: '完成成功'});
            this.getTableData();
          });
        }).catch(() => {
        });
      },
      // 备注显示
      remarksItem(row){
        this.remarksFormData.id = row.id;
        this.remarksFormData.operationRemarks = row.operationRemarks;
        this.remarksDialog = true;
      },
      // 备注提交
      remarksSub(){
        this.$refs.remarksForm.validate((valid) => {
          if (valid) {
            this.request(this.api.order.storeAllotGoodsOrder_insertRemarks, this.remarksFormData).then(data => {
              this.$notify.success({ title: '成功',message: '备注成功'});
              this.remarksDialog = false;
              this.getTableData();
            });
          } else {
            return false;
          }
        });

      },
      // 状态转name
      statusToName(val){
        if(!val && val !== 0) return;
        let item = this.billType.find(item => {
          return item.id === val
        });
        if(item){
          return item.name;
        }else {
          return val
        }
      },
      // 获取发货门店数据
      async getOutStoreList() {
        // 获取userId
        let info = await this.request(this.api.user.get_userinfo, {}, true);
        // 获取直属机构
        let organization = await this.request(this.api.user.userCompany_getUserOrgByUserId, {userId: info.userId}, true);
        // enableAllocation: 1  (启用门店调拨 后端需要)
        this.request(this.api.retailStore.storeBasic_listBase, {organizationId: organization.id, enableAllocation: 1}).then(data => {
          this.outStoreList = data.data;
        });
      },
      // 获取收货门店数据
      getInStoreList() {
        this.request(this.api.store.storeBasic_list, {}).then(data => {
          this.inStoreList = data.data;
        });
      }
    },
    filters: {

    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
