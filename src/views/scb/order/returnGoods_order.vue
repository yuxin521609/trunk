<style lang="less" scoped></style>
<template>
  <div class="distribution">
    <!-- 选择调出入方信息 -->
    <el-dialog @closed="closeDialog" width="1200px" :title="dialogIncludeObj.type === 'out' ? '选择退返货客户' : '选择收货仓库'" :visible.sync="dialogIncludeObj.isDialogTableVisible">
      <template v-if="dialogIncludeObj.type === 'out'">
        <el-form class="item-form" :model="dialogIncludeObj.formDataOut" label-width="90px" size="small" ref="formData" inline>
          <el-form-item label="客户名称：" prop="inStoreId">
            <el-select
              v-model="dialogIncludeObj.formDataOut.name"
              placeholder="请选择"
              class="input-w"
              filterable
              clearable>
              <el-option
                v-for="item in inStoreList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道类型：" prop="inStoreId">
            <el-select
              v-model="dialogIncludeObj.formDataOut.channel"
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
            <el-button @click="searchOutTableData" type="primary" plain>搜索</el-button>
            <el-button @click="initOutTableFormData" plain>重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dialogIncludeObj.tableOutDate.data" max-height="350" class="mt-10">
          <el-table-column label="单选" align="center" min-width="50">
            <template slot-scope="scope">
              <el-radio-group v-model="dialogIncludeObj.checkOutItem">
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
          <el-button @click="dialogIncludeObj.isDialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="outNext">下一步</el-button>
        </span>
      </template>
      <template v-else>
        <el-form
          class="item-form"
          :model="dialogIncludeObj.formDataIn"
          label-width="90px"
          size="small"
          ref="formData"
          inline>
          <el-form-item label="仓库类型：" prop="orderStatus">
            <el-select
              placeholder="请选择"
              class="input-w"
              v-model="dialogIncludeObj.formDataIn.warehouseType"
              filterable
              clearable>
              <el-option v-for="(item, index) in warehouseType" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库名称：" prop="orderStatus">
            <el-select
              placeholder="请选择"
              class="input-w"
              v-model="dialogIncludeObj.formDataIn.warehouseName"
              filterable
              clearable>
              <el-option v-for="item in searchWarehouseList" :key="item.id" :label="item.warehouseName" :value="item.warehouseName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchWarehouse" type="primary" plain>搜索</el-button>
            <el-button @click="initWarehouse" plain>重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dialogIncludeObj.tableInDate" max-height="350" class="mt-10">
          <el-table-column label="单选" align="center" min-width="50">
            <template slot-scope="scope">
              <el-radio-group v-model="dialogIncludeObj.checkInItem">
                <el-radio :disabled="scope.row.status == 10" :label="scope.row">&nbsp;</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="仓库名称" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.warehouseName }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="仓库类型" align="center" min-width="90">
            <template slot-scope="scope">{{ warehouseType[scope.row.warehouseType] }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="所在省/直辖市" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.provinceName }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="市/区" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.areaName }}</template>
          </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="详细地址" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.address }}</template>
          </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="联系人" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.contact }}</template>
          </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="联系电话" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.telephone }}</template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogIncludeObj.isDialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="inPrev">上一步</el-button>
          <el-button type="primary" @click="inNext">下一步</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="item-margin">
      <el-form class="item-form" :model="formData" label-width="90px" size="small" ref="formData" inline>
        <el-form-item label="模糊查询：">
          <el-input
            v-model="formData.filter"
            @keyup.enter.native="handleSearch"
            style="width:310px;"
            placeholder="退返货单号/退返客户名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="单据状态：" prop="backStatus">
          <el-select placeholder="请选择" class="input-w" v-model="formData.backStatus" clearable>
            <el-option
                v-for="(item, index) in backTypeStatus"
                :key="item"
                :label="item"
                :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退返客户：" prop="inStoreId">
          <el-select
            v-model="formData.storeId"
            placeholder="请选择"
            class="input-w"
            filterable
            clearable>
            <el-option
              v-for="item in inStoreList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货仓库：" prop="storeType">
          <el-select placeholder="请选择" class="input-w" v-model="formData.warehouseCode" clearable>
            <el-option
                v-for="item in searchWarehouseList"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.warehouseCode"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="创建时间：" prop="startDate">
          <el-date-picker v-model="formData.createTimeBegin" type="date" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item prop="endDate">
            <el-date-picker v-model="formData.createTimeEnd" type="date" placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <!-- <time-interval-check :form-data="formData" label="创建时间"></time-interval-check> -->
        <el-form-item>
          <el-button @click="searchTableData" type="primary" plain>搜索</el-button>
          <el-button @click="initFormData" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="item-margin item-cont">
      <div>
        <el-button size="small" type="primary" @click="dialogShow">新增退返货</el-button>
      </div>
      <page-table :form-data="formData" :get-data="getTableData" :table-data="tableData">
        <el-table :data="tableData.data" style="width: 100%" row-key="id" @selection-change="tableCheckChange">
          <el-table-column prop="backNum" label="退返货单号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_backStatus" label="单据状态"></el-table-column>
          <el-table-column prop="storeName" label="退返客户名称"></el-table-column>
          <el-table-column prop="goodsQuantity" label="sku种类数"></el-table-column>
          <el-table-column prop="productNum" label="返货数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="totalPrice" label="退返货值" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="warehouseName" label="收货仓库"></el-table-column>
          <el-table-column prop="realityBackQty" label="实际退返数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="realityProductNum" label="实收数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="differenceQty" label="实收差异" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="returnTime" label="实际退返时间" :show-overflow-tooltip="true"  width="120"></el-table-column>
          <el-table-column prop="_createTime" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="seeAndEditItem(scope.row, 'see')">查看</el-button>
              <el-button type="text" size="small" @click="exportExcel(scope.row)">导出</el-button>
             <el-button type="text" size="small" @click="edit(scope.row, 'edit')" v-if="scope.row.backStatus === 13">编辑</el-button>
              <el-button type="text" size="small" @click="delItem(scope.row)" v-if="scope.row.backStatus === 1">作废</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-table>
    </div>
  </div>
</template>
<script>
  import codeSet from "@/components/codeSet";
  import PageTable from "@/views/collocation/components/PageTable";
  import OrganizationSelect from "@/views/collocation/components/OrganizationSelect";
  import StoreSelect from "@/views/collocation/components/StoreSelect";
  import TimeIntervalCheck from "@/components/TimeIntervalCheck";
  export default {
    name: 'returnGoods_order',
    // 数据
    data() {
      return {
        searchWarehouseList:[],
        isSearchWarehouseList:true,
        channelType:{
          0:'零售商'
        },
        warehouseType:{
          '07001':'总仓',
          '07002':'分仓',
          '07003':'中转仓'
        },
        warehouseData:[],
        inStoreList:[],
        id:null,
        // 参数
        addFormData: {
          // 发起人
          createName: '',
          // 货主
          goodsOwner: '',
          // 机构
          organizationId: '',
          organizationName: '',
          // 订单类型
          orderType: '0204',
          // 物流
          logisticsCode: '',
          logisticsCompany: '',
          // 仓库
          warehouseCode: '',
          warehouseName: '',
          // 门店
          storeId: '',
          storeName: '',
          storeType: '',
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
        // 选择框数据
        selectList:[{
          id:1,
          name:'零时尚'
        }],
        // 弹框中包裹的对象
        dialogIncludeObj:{
          // out为调出方，in调入方
          type:'out',
          // 弹出框是否显示
          isDialogTableVisible:false,
          // 调出单检索条件 ---
          formDataOut:{
            name:null,
          },
          // 调出单
          tableOutDate:{
            data:[]
          },
          // 选中调出单某一项
          checkOutItem:{},
          // 调入单检索条件 ---
          formDataIn:{
            warehouseType:null,
            warehouseName:null
          },
          // 调入单
          tableInDate:{
            data:[]
          },
          // 选中调入单某一项
          checkInItem:{}
        },
        // 查询参数
        formData: {
          // 页面模块ID
          menuId: '',
          // 关键字
          filter: '',
          // 单据状态
          backStatus: '',
          // 门店名称
          storeId: '',
          // 仓库code
          warehouseCode:'',
          // 门店类型
          storeType: '',
          // 时间
          createTimeBegin: '',
          createTimeEnd: '',
          pageIndex: 1,
          pageSize: 10
        },
        // 单据状态
        billType: this.$common.getBillType('allot'),
        // 仓库收货状态
        receiveStatus: [
          {name: '未到货', id: 7},
          {name: '部分到货', id: 8},
          {name: '全部到货', id: 9},
          {name: '超收', id: 10}
        ],
        backTypeStatus:{
          0:'待发货',
          1:'待返货',
          2:'待收货',
          3:'已完成',
          4:'作废',
          5:'已发货',
          6:'已返货',
          7:'未到货',
          8:'部分到货',
          9:'全部到货',
          13:'待编辑',
          14:'强制完成'
        },
        // 表格数据
        tableData: {},
        // 选中的表格数据
        checkedTableData: []
      }
    },
    // 组件
    components: {
      codeSet,
      PageTable,
      OrganizationSelect,
      StoreSelect,
      TimeIntervalCheck
    },
    created(){
      // 删除子页面的门店缓存
      sessionStorage.removeItem('BACK_GOODS_INFO');
      // 获取模块id
      this.formData.menuId = this.$route.meta.currentid;
      this.info();
      this.getOrganizationIdByUserId();
    },
    activated() {
      this.getTableData();
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getTableData();
        this.tuneIn_fn();
        this.getInStoreList();
      })
    },
    // 方法
    methods: {
      dialogShow() {
        this.dialogIncludeObj.isDialogTableVisible = true;
        this.tuneIn_fn();
      },
      closeDialog() {
        Object.assign(this.dialogIncludeObj.formDataOut, {
          name:null,
          channel:null
        });
        Object.assign(this.dialogIncludeObj.formDataIn, {
          warehouseType:null,
          warehouseName:null
        });
        this.dialogIncludeObj.type = 'out';
      },
      // 获取收货门店数据
      getInStoreList() {
        this.request(this.api.store.storeBasic_listStoreBasic, {}).then(data => {
          this.inStoreList = data.data;
        });
      },
      async getOrganizationIdByUserId(){
        let info = await this.request(this.api.user.get_userinfo, {}, true);
        if(info){
          this.addFormData.createName = info.name;
          this.addFormData.allotMan = info.name;
          this.addFormData.relationDepId = info.departId;
          this.addFormData.relationDepName = info.departName;
        }
        let url = this.api.user.userCompany_getUserOrgByUserId;

        this.request(url, {userId: info.userId}).then(data => {
          this.id = data.id;
          this.addFormData.organizationId = data.id;
          this.addFormData.organizationName = data.name;
          // this.getStoreList(data.id);
          // this.getGoodsOwner(data.id);
        });
      },
      // 获取货主
      getGoodsOwner(id){
        this.request(this.api.system.goodsOwner_getByOrgId, {orgId: id, used: true}).then(data=>{
          if(data.code){
            this.addFormData.goodsOwner = data.code;
          }
        });
      },
      //获取仓库数据
      getWarehouseList() {
        Object.assign(this.dialogIncludeObj.formDataIn, {orgId: this.id, used: true})
        this.request(this.api.warehouse.warehouse_list, this.dialogIncludeObj.formDataIn).then(data => {
          this.dialogIncludeObj.tableInDate = data.data;
          this.dialogIncludeObj.checkInItem = {};
          if(this.isSearchWarehouseList) {
            this.searchWarehouseList = JSON.parse(JSON.stringify(data.data));
            this.isSearchWarehouseList = false;
          }
          data.data.forEach((item, index) => {
            item.createTime = this.$options.filters.timestampToTime(item.createTime);
          });
        });
      },
      searchWarehouse() {
        this.getWarehouseList();
      },
      initWarehouse() {
        Object.assign(this.dialogIncludeObj.formDataIn, {
          warehouseType:null,
          warehouseName:null
        });
      },
      /**
       * 获取客户列表
       * @param { String } id 调出方id
       */
      tuneIn_fn() {
        this.request(
          this.api.store.storeBasic_listStoreBasic,
          this.dialogIncludeObj.formDataOut
        ).then(res => {
          this.dialogIncludeObj.tableOutDate = res;
          this.dialogIncludeObj.checkOutItem = {};
        });
      },
      //获取门店数据
      getStoreList(id) {
        this.request(this.api.retailStore.storeBasic_listSmart, {organizationId: id}).then(data => {
          this.dialogIncludeObj.tableOutDate = data;
          data.forEach((item, index) => {
            item.createTime = this.$options.filters.timestampToTime(item.createTime);
          });
        });
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
      // 调出单下一步
      outNext(row) {
        if(JSON.stringify(this.dialogIncludeObj.checkOutItem) == '{}') {
          this.warn('请选择退返货客户！', 'warning');
          return; 
        };
        this.dialogIncludeObj.type = 'in';
        this.getWarehouseList();
      },
      // 调入单上一步
      inPrev() {
        this.dialogIncludeObj.type = 'out';
      },
      // 调入单下一步
      inNext() {
        if(JSON.stringify(this.dialogIncludeObj.checkInItem) == '{}') {
          this.warn('请选择收货仓库！', 'warning');
          return; 
        }; 
        const outObj = this.dialogIncludeObj.checkOutItem;
        const inObj = this.dialogIncludeObj.checkInItem;
        Object.assign(this.addFormData, {
          storeId: outObj.id,
          storeName: outObj.name,
          // storeType: outObj.type,
          // 仓库
          warehouseCode: inObj.warehouseCode,
          warehouseName: inObj.warehouseName,
          // 收货人
          receiveMan:inObj.contact,
          // 电话
          phone: inObj.telephone,
          warehouseType:inObj.warehouseType,
          divisionId: inObj.divisionId,
          addressInfo:inObj.address,
          provinceName: inObj.provinceName,
          provinceCode: inObj.provinceCode,
          cityName: inObj.cityName,
          cityCode: inObj.cityCode,
          areaName: inObj.areaName,
          areaCode: inObj.areaCode,
        });
        this.dialogIncludeObj.isDialogTableVisible = false;
        console.log(this.addFormData);
        // return;
        sessionStorage.setItem('BACK_GOODS_INFO', JSON.stringify(this.addFormData));
        // return;
        let module = "/" + this.$route.path.split("/")[1];
        this.$router.push({
          path: module + "/order/returnGoods_order_edit"
        });
        this.dialogIncludeObj.checkOutItem = {};
        this.dialogIncludeObj.checkInItem = {};
        this.dialogIncludeObj.type = 'out';
      },
      // 搜索
      searchOutTableData() {
        this.tuneIn_fn();
      },
      // 重置fromData选项
      initOutTableFormData() {
        Object.assign(this.dialogIncludeObj.formDataOut, {
          name:null,
          channel:null
        })
      },
      // 搜索
      searchInTableData() {
        this.getWarehouseList(this.id);
      },
      // 重置fromData选项
      initInTableFormData() {

      },
      // keepAlive 返回初始化
      activatedInit(){
        this.getTableData();
      },
      //导出
      exportExcel(row) {
        // 获取商品列表
        this.request(this.api.order.returnProductInfo_list, {orderSn:row.backNum}).then(data => {
          this.checkedTableData = data.data;
          data.data.forEach((item, index) => {
            item.realityBackQty = item.realityBackQty == null ? '--' : item.realityBackQty;
          })
          if(this.checkedTableData.length === 0){
            this.$notify.error({ title: '错误',message: '请选择数据'});
            return
          }
          require.ensure([], () => {
            let { export_json_to_excel, export_table_to_excel } = require("@/vendor/Export2Excel");
            let tHeader = [
              "商品款号",
              "商品货号",
              "名称",
              "商品图片",

              "品牌",
              "吊牌价",
              "应返数量",
              "实返数量",

              "实收数量",
            ];
            // 上面设置Excel的表格第一行的标题
            let filterVal = [
              "productCode",
              "goodsCode",
              "goodsName",
              "image",

              "brandName",
              "retailPrice",
              "planBackQuantity",
              "realityBackQty",

              "receiveQuantity"
            ];
            // 上面的index、nickName、name是tableData里对象的属性
            let list = this.checkedTableData; //把data里的tableData存到list
            let data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, "返货单商品列表");
          });
        });
       
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      },
      // 点击搜索
      searchTableData(){
        this.formData.pageIndex = 1;
        this.getTableData();
      },
      // 获取列表数据
      getTableData(){
        this.request(this.api.order.returnGoods_returnsList, this.formData).then(data => {
          this.initTableData(data.data);
          this.tableData = data
        });
      },
      // 初始化数据 导出使用
      initTableData(data){
        if(data && data.length){
          data.forEach(item => {
            item._backStatus = this.backTypeStatus[item.backStatus];
            item._storeType = this.$options.filters.codeToName("STO001", item.storeType);
            item._totalPrice = '￥' + item.totalPrice;
            item._receiveStatus = this.receiveStatusToName(item.receiveStatus);
            item._createTime = this.$options.filters.timestampToTime(item.createTime);
            item.returnTime = this.$options.filters.timestampToTime(item.returnTime);
            item.realityProductNum = item.realityProductNum == null ? '--' : item.realityProductNum;
            item.differenceQty = item.differenceQty == null ? '--' : item.differenceQty;
            item.putInStorage = item.putInStorage == null ? '--' : item.putInStorage;
          })
        }
      },
      // 获取表格选中的
      tableCheckChange(val){
        this.checkedTableData = val;
      },
      // 初始查询条件
      initFormData(){
        Object.assign(this.formData, {
          // 页面模块ID
          menuId: '',
          // 关键字
          filter: '',
          // 单据状态
          backStatus: '',
          // 门店名称
          storeId: '',
          // 仓库code
          warehouseCode:'',
          // 门店类型
          storeType: '',
          // 时间
          createTimeBegin: '',
          createTimeEnd: '',
          pageIndex: 1,
          pageSize: 10
        })
      },
      edit(row, type) {
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/order/returnGoods_order_edit',
          query: {
            id: row.id,
            backNum: row.backNum,
            type: type
          }
        }); 
      },
      // 查看 编辑
      seeAndEditItem(row, type){
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/order/returnGoods_order_detail',
          query: {
            id: row.id,
            backNum: row.backNum,
            type: type
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
          this.request(this.api.order.returnGoods_invalid, {id: row.id}).then(data => {
            this.$notify.success({ title: '成功',message: '作废成功'});
            this.getTableData();
          });
        }).catch(() => {
        });
      },
      // 新增
      addItem(){

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
      //
      receiveStatusToName(val){
        if(!val && val !== 0) return;
        let item = this.receiveStatus.find(item => {
          return item.id === val
        });
        if(item){
          return item.name;
        }else {
          return val
        }
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
