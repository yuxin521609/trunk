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
            <el-form-item prop="filter" label="模糊查询：">
              <el-input class="input-w" placeholder="到货单号/采购订单号" v-model="filtersData.filter"></el-input>
            </el-form-item>

            <el-form-item prop label="入库状态：">
              <el-select class="input-w" placeholder="请选择" v-model="filtersData.joinLibraryStatus">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="dateTime" label="创建时间：">
              <el-date-picker
                class="date-picker-div"
                v-model="filtersData.startTime"
                type="date"
                placeholder="开始时间"
              ></el-date-picker>
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
          <el-table-column prop="warehouseSn" align="center" label="入库单号" width="100"></el-table-column>
          <el-table-column prop="warehouseQuantity" align="center" label="入库总数" min-width="100"></el-table-column>
          <el-table-column prop="arrivalSn" align="center" label="关联到货单" min-width="100"></el-table-column>
          <el-table-column prop="warehouse" align="center" label="入库仓库" min-width="100"></el-table-column>
          <el-table-column prop="warehouseType" align="center" label="入库类型" min-width="100">
            <template slot-scope="scope">{{ scope.row.warehouseType | fiterWarehouseType}}</template>
          </el-table-column>
          <el-table-column prop="operator" align="center" label="入库人" min-width="100"></el-table-column>
          <el-table-column prop="remarks" align="center" label="备注" min-width="100"></el-table-column>
          <el-table-column prop="createTime" align="center" label="入库时间" min-width="100">
            <template slot-scope="scope">{{ scope.row.createTime | timestampToTime}}</template>
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
                @click="openShowDetails(scope.row.id)"
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
      filtersData: {
        cateId: "", //产品分类ID
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        valid: null, //有效状态
        filter: "", //搜索关键字
        startDate: "",
        endDate: "",
        arrivalStatus: "", //到货状态
        joinLibraryStatus: "", //入库状态
        receivingLibrary: "", //收货仓库
        supplier: "", //供应商
        startTime: "",
        endTime: ""
      },
      //     NOT_COMPLETE(0,"未完成"),
      // ARRIVAL(1,"到货中"),
      //     COMPLETE(2,"已完成"),
      //     DELETE(3,"已作废"),
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
      // NOT_WAREHOUSE(0,"未入库"),
      //     PARTIAL_WAREHOUSE(1,"部分入库"),
      // WAREHOUSED(2,"全部入库"),
      //     OVERDUE_WAREHOUSE(3,"入库超收");
      options2: [
        {
          value: "0",
          label: "未入库"
        },
        {
          value: "1",
          label: "部分入库"
        },
        {
          value: "2",
          label: "全部入库"
        },
        {
          value: "3",
          label: "入库超收"
        }
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
        case 501:
          return '未入库'
          break;
        case 502:
          return '部分入库'
          break;
        case 503:
          return '全部入库'
          break;
        case 504:
          return '超收入库'
          break;
      }
    }
  },
  created() {
    this.getTableList();
    this.findReceivingLibraries();
    this.findSuppliers();

    this.getCodeLimitToBtnStatus(this.$route.meta.currentid);
  },
  methods: {
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
      this.request(this.api.order.channelPurchaseWarehouseOrder_list,this.filtersData).then(res=>{
          console.log(res)
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
    openShowDetails(id) {
      this.$router.push({
        path: "/OS/business/purchase/joinLibraryOrder_check",
        query: {
          id: id,
          type: "show"
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
          "关联到货单",
          "入库仓库",
          "入库类型",
          "入库人",
          "备注",
          "入库时间"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "arrivalNum",
          "arrivalStatus",
          "procureNum",
          "joinLibraryStatus",
          "receivablesTotal",
          "collectTotal",
          "remarks",
          "createTime"
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
      // this.$refs[formName].resetFields();
      // this.getTableList();
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
.date-picker-div {
  margin-right: 10px;
}
</style>