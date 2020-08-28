<template>
  <!--到货单-->
  <div>
    <div class="item-margin">
      <el-form
        class="item-form"
        :model="filtersData"
        label-width="90px"
        size="small"
        ref="filtersForm"
        inline
      >
        <el-row>
          <el-col>
            <el-form-item prop="searchKey" label="模糊查询：">
              <el-input class="input-w" placeholder="到货单号/采购订单号" v-model="filtersData.searchKey"></el-input>
            </el-form-item>
            <el-form-item prop="arrivalStatusList" label="状态：">
              <el-select class="input-w" placeholder="请选择" v-model="filtersData.arrivalStatusList" multiple>
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="warehousingStatusList" label="入库状态：">
              <el-select class="input-w" placeholder="请选择" v-model="filtersData.warehousingStatusList" multiple>
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="warehouseCodes" label="入库仓：">
              <el-select class="input-w" placeholder="请选择" v-model="filtersData.warehouseCodes" multiple>
                <el-option
                  v-for="item in WarehouseCodeData"
                  :key="item.id"
                  :label="item.warehouseName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="supplierCodes" label="供应商：">
              <el-select class="input-w" placeholder="请选择" v-model="filtersData.supplierCodes" multiple>
                <el-option
                  v-for="item in suppliers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="orderType" label="收货类型：">
              <el-select class="input-w" placeholder="请选择" v-model="filtersData.orderType">
                <el-option label="门店收货" value="030102"></el-option>
                <el-option label="仓库收货" value="030101"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="startTime" label="创建时间：">
              <el-date-picker v-model="filtersData.startTime" type="date" placeholder="开始时间"></el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime">
              <el-date-picker v-model="filtersData.endTime" type="date" placeholder="结束时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button @click="handleSearch" type="primary" plain size="small">搜索</el-button>
              <el-button @click="handleResetFilters('filtersForm')" size="small">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--table  -->
    <div class="item-margin">
      <div class="item-cont">
        <el-button
          size="small"
          type="primary"
          @click="openAddClass()"
          v-auth="codeData"
          data-code="DAM_CREATE"
        >新增</el-button>
        <el-button size="small" @click="exportExcel()" v-auth="codeData" data-code="DAM_EXPORT">导出</el-button>
      </div>
      <div class="item-table">
        <el-table
          :data="tableListData"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="arrivalSn" align="center" label="到货单号" width="150"></el-table-column>
          <el-table-column align="center" label="状态" min-width="100">
            <template slot-scope="scope">{{ scope.row.arrivalStatus | filterArrivalStatus}}</template>
          </el-table-column>
          <el-table-column prop="orderSn" align="center" label="关联采购订单号" width="210"></el-table-column>
          <el-table-column prop="warehousingStatus" align="center" label="入库状态" min-width="100">
            <template slot-scope="scope">{{ scope.row.warehousingStatus | filterWarehousingStatus}}</template>
          </el-table-column>
          <el-table-column prop="quantity" align="center" label="应收总数" min-width="100"></el-table-column>
          <el-table-column prop="actualQuantity" align="center" label="实收总数" min-width="100"></el-table-column>
          <el-table-column prop="orderType" align="center" label="收货类型" min-width="100">
            <template slot-scope="scope">{{ scope.row.orderType | filterOrderType}}</template>
          </el-table-column>
          <el-table-column prop="warehouse" align="center" label="收货仓库/门店" min-width="100"></el-table-column>
          <el-table-column prop="supplier" align="center" label="供应商" min-width="100"></el-table-column>
          <el-table-column prop="createBy" align="center" label="创建人" min-width="100"></el-table-column>
          <el-table-column prop="remarks" align="center" label="备注" min-width="100">
            <template slot-scope="scope">{{ scope.row.remarks?scope.row.remarks:'--'}}</template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" min-width="150">
            <template slot-scope="scope">{{ scope.row.createTime | timestampToTime}}</template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                @click="openShowDetails(scope.row.arrivalSn)"
                type="text"
                size="small"
                v-auth="codeData"
                data-code="DAM_VIEW"
              >查看</el-button>
              <el-button
                @click="deleteItem(scope.row)"
                type="text"
                size="small"
                v-auth="codeData"
                data-code="DAM_INVALID"
                :disabled="scope.row.arrivalStatus!='03010101' && scope.row.arrivalStatus!='03010102'"
              >作废</el-button>

              <el-button
                v-auth="codeData"
                data-code="DAM_VIEWREPORT"
                @click="findQuality(scope.row.id)"
                type="text"
                size="small"
              >查看质检报告</el-button>
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :disabled="scope.row.arrivalStatus!='03010102'"
                    :command="dropdownItemValueChange('synchronization',scope.row)"
                  >同步</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <el-button @click="syncClickEvent(scope.row)" type="text" size="small">同步</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-10 mb-20">
          <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersData.pageIndex"
            :page-sizes="[10,20,30,40,50]"
            :page-size="filtersData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAllCount"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!--table END  -->
    <!--<tp-class-details :itemParam="itemStautsParam"  @refreshItem="refreshList" ref="positionDetailsCpt"></tp-class-details>-->
  </div>
</template>

<script>
import { formatTimestamp } from "@/utils/date";

/**
 * 基本管理
 */
export default {
  data() {
    return {
      //货主
      goodsOwner:'',
      //得到权限Code
      codeData: [],
      filtersData: {
        orderType:"",
        searchKey: "", //搜索关键字
        arrivalStatusList: [], //到货状态
        warehousingStatusList: [], //入库状态
        warehouseCodes: [], //收货仓库
        supplierCodes: [], //供应商
        startTime: "",
        endTime: "",
        pageIndex: 1, //当前页码
        pageSize: 10 //每页数量
      },
      options1: [
        {
          value: "03010101",
          label: "未完成"
        },
        {
          value: "03010102",
          label: "同步失败"
        },
        {
          value: "03010103",
          label: "部分到货"
        },
        {
          value: "08",
          label: "已完成"
        },
        {
          value: "15",
          label: "已作废"
        },
      ],
      // NOT_WAREHOUSE(0,"未入库"),
      //     PARTIAL_WAREHOUSE(1,"部分入库"),
      // WAREHOUSED(2,"全部入库"),
      //     OVERDUE_WAREHOUSE(3,"入库超收");
      options2: [
        {
          value: "1001",
          label: "未入库"
        },
        {
          value: "1002",
          label: "部分入库"
        },
        {
          value: "1003",
          label: "全部入库"
        },
        {
          value: "1004",
          label: "入库超收"
        }
      ],
      tableListData: [],
      totalAllCount: null,
      datefilter: [],
      //table中checkBox的状态
      multipleSelection: [],
      WarehouseCodeData: [], //收货仓库集合
      suppliers: [] //供应商集合
    };
  },
  // 过滤器
  filters: {
    //过滤入库状态
    filterWarehousingStatus(val) {
      switch (val) {
        case "1001":
          return "未入库";
          break;
        case "1002":
          return "部分入库";
          break;
        case "1003":
          return "全部入库";
          break;
        case "1004":
          return "超收入库";
          break;
        default:
          return "--"
          break;   
      }
    },
    //过滤作废状态
    filterArrivalStatus(val) {
      switch (val) {
        case "03010101":
          return "未完成";
          break;
        case "03010102":
          return "同步失败";
          break;
        case "03010103":
          return "部分到货";
          break;
        case "08":
          return "已完成";
          break;
        case "15":
          return "已作废";
          break;
        default:
          return "--"
          break; 
      }
    },
    filterOrderType(val){
        switch (val) {
        case "030101":
          return "仓库收货";
          break;
        case "030102":
          return "门店收货";
          break;
        default:
          return "--"
          break; 
      }
    }
  },
  created() {
    //得到组织机构数据
    this.getWarehouseListData();
    this.getTableList();
    // this.findReceivingLibraries();
    this.getCodeLimitToBtnStatus(this.$route.meta.currentid);
  },
  methods: {
    //得到组织机构数据
    async getWarehouseListData() {
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      console.log(info);
      //得到部门Id
      // this.signData.relationDepId = info.departId;

      this.request(this.api.user.userCompany_getUserOrgByUserId, {
        userId: info.userId,
        type: 0
      }).then(data => {
        console.log(data);
        //得到仓库数据
        this.getWarehouseList(data.id);
        //得到供货商数据
        this.findSuppliers(data.id); 
        //获取货主列表
        this.getGoodsOwnerListData(data.id);
      });
    },
    // 得到code码，用来限制是否显示按钮
    getCodeLimitToBtnStatus(codeId) {
      this.request(this.api.user.crm_userCompany_authList, {
        menuId: codeId
      }).then(res => {
        console.log(res);
        this.codeData = res;
      });
    },
    //获取列表
    getTableList() {
      this.request(
        this.api.order.channelPurchaseArrivalOrder_list,
        this.filtersData
      ).then(data => {
        console.log(data);
        data.data.forEach(item => {
          item.arrivalStatusName=this.$options.filters.filterArrivalStatus(item.arrivalStatus)
          item.warehousingStatusName=this.$options.filters.filterWarehousingStatus(item.warehousingStatus)
          item.orderTypeName=this.$options.filters.filterOrderType(item.orderType)
          item.createTimeName=this.$options.filters.timestampToTime(item.createTime)
        })
        this.totalAllCount = data.totalCount;
        this.tableListData = data.data;
      });
    },
    //得到仓库列表
    getWarehouseList(orgId) {
      console.log(orgId);
      this.request(this.api.warehouse.warehouseBase_warehouse_list, {
        isValid: true,
      }).then(res => {
        console.log(res);
        this.WarehouseCodeData = res.data;
      });
    },
    //查询供应商列表
    findSuppliers(organizationId) {
      console.log(246);
      this.request(this.api.product.supplier_list, {organizationId: organizationId,cooperation:true}).then(data => {
        console.log(data);
        this.suppliers = data.data;
      });
    },
    //判断是否可以选择
    isSelectCheck(row, index) {
      if (row.orderStatus == 2) {
        return true;
      } else {
        return false;
      }
    },
    //选中checkBox的状态
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //新增
    openAddClass() {
      this.$router.push({
        path: "/OS/business/purchase/arrivalNotice_add",
        query: {
          type: "add"
        }
      });
    },
    //查看
    openShowDetails(arrivalSn) {
      console.log(arrivalSn);
      this.$router.push({
        path: "/OS/business/purchase/arrivalNotice_check",
        name: "arrivalNotice_check",
        query: {
          arrivalSn: arrivalSn,
          type: "show"
        }
      });
    },
    //导出
    exportExcel() {
      console.log("导出Excel表格...+++++++++++++++++++");
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "发货单号",
          "状态",
          "关联采购订单号",
          "入库状态",
          "应收总数",
          "实收总数",
          "收货类型",
          "收货仓库/门店",
          "供应商",
          "创建人",
          "备注",
          "创建时间"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "arrivalSn",
          "arrivalStatusName",
          "orderSn",
          "warehousingStatusName",
          "quantity",
          "actualQuantity",
          "orderTypeName",
          "warehouse",
          "supplier",
          "createBy",
          "remarks",
          "createTimeName"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.tableListData; //把data里的tableData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "到货表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //查看质检报告
    findQuality(id) {
      console.log(id)
      this.$router.push({
        path:'/OS/business/purchase/arrivalNotice_report',
        query:{
          qualityId:id
        }
      })
    },
    //获取货主列表
    getGoodsOwnerListData(organizationId) {
      this.request(this.api.system.goodsOwner_list, {
        orgId: organizationId
      }).then(data => {
        console.log(data.data);
        this.goodsOwner = data.data[0].code;
      });
    },
    //作废
    deleteItem(val) {
      console.log(val);
      this.request(
        this.api.order.channelPurchaseArrivalOrder_obsoleteByArrivalSn,
        {arrivalSn: val.arrivalSn , goodsOwner:this.goodsOwner,orderType:val.orderType}
      ).then(res => {
        console.log(res);
        this.getTableList();
      });
    },
    //下拉框事件
    handleCommand(row) {
      console.log(row);
      if (row.synchronization == "synchronization") {
        //点击了同步
        this.syncClickEvent(row.row);
      }
    },
    //下拉框事件参数
    dropdownItemValueChange(synchronization, row) {
      return {
        synchronization: synchronization,
        row: row
      };
    },
    //同步
    syncClickEvent(row) {
      this.request(
        this.api.order.channelPurchaseArrivalOrder_syncChannelArrivalOrder,row
      ).then(data => {
        console.log(data);
        this.getTableList();
      });
    },
    //搜索
    handleSearch() {
      console.log("getTableList.........");
      this.filtersData.pageIndex = 1;
      this.getTableList();
    },

    //清空重置
    handleResetFilters(formName) {
      this.$refs[formName].resetFields();
      this.getTableList();
    },
    //当前页数修改时发生改变
    handleCurrentChange(val) {
      this.filtersData.pageIndex = val;
      this.getTableList();
    },
    // 每页显示多少条时发生改变
    handleSizeChange(val) {
      this.filtersData.pageSize = val;
      this.getTableList();
    }
  }
};
</script>

<style scoped>
</style>