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
              <el-input class="input-w" placeholder="入库单号/关联到货单号" v-model="filtersData.searchKey"></el-input>
            </el-form-item>

            <el-form-item prop='warehouseType' label="入库类型：">
              <el-select class="input-w" placeholder="请选择" v-model="filtersData.warehouseType">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="warehouseType" label="入库仓库：">
              <el-select class="input-w" placeholder="请选择" v-model="filtersData.warehouse">
                <el-option
                  v-for="item in warehouseList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="startTime" label="入库时间：">
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
        <el-button-group>
          <el-button size="small" @click="exportExcel()" v-auth="codeData" data-code="WRM_EXPORT">导出</el-button>
        </el-button-group>
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
          <el-table-column prop="warehouseSn" align="center" label="入库单号" width="220"></el-table-column>
          <el-table-column prop="warehouseQuantity" align="center" label="入库总数" min-width="100">
            <template slot-scope="scope">{{scope.row.warehouseQuantity?scope.row.warehouseQuantity:'--'}}</template>            
          </el-table-column>
          <el-table-column prop="orderSn" align="center" label="关联源单" min-width="210"></el-table-column>
          <el-table-column prop="warehouse" align="center" label="入库仓库" min-width="100"></el-table-column>
          <el-table-column prop="warehouseType" align="center" label="入库类型" min-width="100">
            <template slot-scope="scope">{{ scope.row.warehouseType | fiterWarehouseType}}</template>
          </el-table-column>
          <el-table-column prop="operator" align="center" label="入库人" min-width="100">
            <template slot-scope="scope">{{scope.row.operator?scope.row.operator:'--'}}</template>            
          </el-table-column>
          <el-table-column prop="remarks" align="center" label="备注" min-width="100">
            <template slot-scope="scope">{{scope.row.remarks?scope.row.remarks:'--'}}</template>            
          </el-table-column>
          <el-table-column prop="warehouseTime" align="center" label="入库时间" min-width="100">
            <template slot-scope="scope">{{scope.row.warehouseTime | timestampToTime}}</template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="140"
          >
            <template slot-scope="scope">
              <el-button
                @click="openShowDetails(scope.row)"
                type="text"
                size="small"
                v-auth="codeData"
                data-code="WRM_VIEW"
              >查看</el-button>
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
            :total="total"
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
      //得到权限数据Code
      codeData: [],
      // 仓库列表
      warehouseList:[],
      filtersData: {
        searchKey: "", //搜索关键字
        warehouseType: "", //入库类型
        warehouseType: "", //入库类型
        startTime: "",
        endTime: "",
        pageIndex: 1, //当前页码
        pageSize: 10 //每页数量
      },
      options1: [
        {
          value: "0",
          label: "未完成"
        },
        {
          value: "1",
          label: "到货中"
        },
        {
          value: "2",
          label: "已完成"
        },
        {
          value: "3",
          label: "已作废"
        }
      ],
      options2: [
        {
          value: "03010102",
          label: "采购入库"
        },
        {
          value: "010202",
          label: "网销退货入库"
        },
        {
          value: "020402",
          label: "渠道退返入库"
        },
         {
          value: "020202",
          label: "其他入库"
        },
      ],
      tableListData: [],
      total: null,
      //创建时间数组
      datefilter: [],
      //table中checkBox的状态
      multipleSelection: [],
      receivingLibraries: [], //收货仓库集合
      suppliers: [] //供应商集合
    };
  },
   // 过滤器
  filters: {
    //过滤入库状态
    fiterWarehouseType(val) {
       switch (val) {
        case '03010102':
          return '采购入库'
          break;
        case '010202':
          return '网销退货入库'
          break;
        case '020202':
          return '渠道退货入库'
          break;
        case '020402':
          return '门店返货入库'
          break;
      }
    }
  },
  created() {
    this.getTableList();
    this.findReceivingLibraries();
    this.findSuppliers();
    this.userinfo();
    this.getCodeLimitToBtnStatus(this.$route.meta.currentid);
  },
  methods: {
    async userinfo() {
      this.info = await this.request(this.api.user.get_userinfo, {}, true); // 获取用户信息
      this.getWarehouseList(this.info.tenantId);
    },
    //获取仓库数据
    getWarehouseList(tenantId) {
      this.request(this.api.system.warehouse_list, {tenantId}).then(data => {
        this.warehouseList = data.data;
      });
    },
    // 得到code码，用来限制是否显示按钮
    getCodeLimitToBtnStatus(codeId) {
    //   this.request(this.api.user.crm_userCompany_authList, {
    //     menuId: codeId
    //   }).then(res => {
    //     console.log(res);
    //     this.codeData = res;
    //   });
    },
    //获取列表
    getTableList() {
      this.request(this.api.order.warehouseStorageOrder_list,this.filtersData).then(res=>{
        console.log(res)
        res.data.forEach(item => {
          item.warehouseTypeName=this.$options.filters.fiterWarehouseType(item.warehouseType)
          item.warehouseTimeName=this.$options.filters.timestampToTime(item.warehouseTime)
        })
        this.total=res.totalCount
        this.tableListData=res.data
      })
    },
    //判断是否可以选中
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
    //查看
    openShowDetails(row) {
      this.$router.push({
        path: "/OS/stockOrder/putOrder/putOrder_check",
        query: {
          warehouseSn:row.warehouseSn
        }
      });
    },
    //查询仓库列表
    findReceivingLibraries() {},
    //查询供应商列表
    findSuppliers() {},
    //导出
    exportExcel() {
      console.log("导出Excel表格...+++++++++++++++++++");
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "入库单号",
          "入库总数",
          "关联源单",
          "入库仓库",
          "入库类型",
          "入库人",
          "备注",
          "入库时间"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "warehouseSn",
          "warehouseQuantity",
          "orderSn",
          "warehouse",
          "warehouseTypeName",
          "operator",
          "remarks",
          "warehouseTimeName"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.tableListData; //把data里的tableData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "入库表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //查看质检报告
    findQuality(id) {},
    //作废
    deleteItem(val) {
      if (confirm("确定作废？")) {
        this.postAxios(this.$base.api.arrivalOrder_logicDelete, val).then(
          data => {
            this.getTableList();
          }
        );
      }
    },
    //搜索
    handleSearch() {
      this.filtersData.pageIndex = 1;
      this.getTableList();
    },

    //清空重置
    handleResetFilters(formName) {
      this.$refs[formName].resetFields();
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