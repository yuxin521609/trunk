<template>
  <!--//采购单-->
  <div class="purchases-bass">
    <!-- input-form -->
    <div class="item-form">
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

            <el-form-item prop="businessStatusList" label="状态：">
              <el-select class="input-w" placeholder="请选择" multiple v-model="filtersData.businessStatusList">
                <el-option
                  v-for="item in options1"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="channelCodes" label="订单来源：">
              <code-set v-model="filtersData.channelCodes" code="ORD001" :multiple="true"/>
            </el-form-item>
            <el-form-item label="所属机构：" prop="organizationCodes">
             <el-select v-model="filtersData.organizationCodes" placeholder="请选择" :multiple="true">
              <el-option
                v-for="item in organizationListData"
                :label="item.name"
                :key="item.id"
                :value="item.id"
              ></el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="supplierCodes" label="供应商：">
              <el-select class="input-w" placeholder="请选择" multiple v-model="filtersData.supplierCodes">
                <el-option
                  v-for="item in suppliers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择日期：">
              <template>
                <div class="block">
                  <el-date-picker
                    class="date-picker-div"
                    v-model="filtersData.startTime"
                    type="date"
                    placeholder="开始时间"
                  ></el-date-picker>
                  <el-date-picker v-model="filtersData.endTime" type="date" placeholder="结束时间"></el-date-picker>
                </div>
              </template>
            </el-form-item>
            <el-form-item>
              <el-button @click="handleSearch" type="primary" plain size="small">搜索</el-button>
              <el-button @click="handleResetFilters('filtersForm')" size="small">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- table -->
    <div class="item-table">
      <div class="item-cont">
        <el-button size="small" type="primary" @click="openAddClass()" style="margin-right:10px;">新增</el-button>
        <el-upload
          class="upload-demo"
          :action="fileAction()"
          accept=".xlsx,.xls,.csv"
          :headers="tokenHeaders"
          name="multipartFile"
          :on-success="handleFileSuccess"
          :on-change="beforefileUploadChange"
          :show-file-list='false'
          >
          <el-button size="small" type="primary">导入</el-button>
        </el-upload>
        <!-- <el-button size="small" @click="importExcel()"  >导入</el-button> -->
        <el-button size="small" style="margin-left: 10px;">
          <a href="https://content-template.oss-cn-beijing.aliyuncs.com/excel/order.xlsx" style="color:#222;">下载模板</a>
        </el-button>
      </div>
      <div class="item-table">
        <el-table
          :data="purchaseOrderListData"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true"
        >
          <el-table-column prop="orderSn" align="center" label="采购订单号" width="210"></el-table-column>
          <el-table-column align="center" label="状态" min-width="100">
            <template slot-scope="scope">{{ scope.row.businessStatus | filterBusinessStatus}}</template>
          </el-table-column>
          <el-table-column prop="contractSn" align="center" label="采购合同号" width="150">
            <template slot-scope="scope">
              <span>{{scope.row.contractSn?scope.row.contractSn:'--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supplier" align="center" label="供应商" width="100"></el-table-column>
          <el-table-column prop="amount" align="center" label="采购金额" width="100"></el-table-column>
          <!--todo 差两个参数-->
          <el-table-column prop="validAmount" align="center" label="实付金额" width="100"></el-table-column>
          <el-table-column align="center" label="付款方式" min-width="100">
            <template slot-scope="scope">{{ scope.row.paymentCode | filterPaymentCode}}</template>
          </el-table-column>
          <el-table-column align="center" label="到货状态" min-width="100">
            <template slot-scope="scope">{{ scope.row.warehouseStatus | filterWarehouseStatus}}</template>
          </el-table-column>
          <el-table-column prop="quantity" align="center" label="采购总数" width="100"></el-table-column>
          <el-table-column prop="actualQuantity" align="center" label="实收总数" width="100"></el-table-column>
          <el-table-column prop="deliverNum" align="center" label="发货次数" width="100"></el-table-column>
          <el-table-column align="center" label="创建时间" min-width="180">
            <template slot-scope="scope">{{ scope.row.createTime | timestampToTime}}</template>
          </el-table-column>
          <el-table-column prop="purchaser" align="center" label="采购人" width="130">
            <template slot-scope="scope">{{ scope.row.purchaser ? scope.row.purchaser :'--'}}</template>
          </el-table-column>
          <el-table-column prop="organization" align="center" label="所属机构" width="100">
            <template slot-scope="scope">{{ scope.row.organization ? scope.row.organization :'--'}}</template>
          </el-table-column>
          <el-table-column align="center" label="订单来源" min-width="100">
            <template slot-scope="scope">{{ scope.row.channelCode | filterChannelCode}}</template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="160"
          >
            <template slot-scope="scope">
              <el-button @click="openShowDetails(scope.row.orderSn)" type="text" size="small" v-auth="codeData" data-code='PCO_VIEW'>查看</el-button>
              <el-button  @click="openEdit(scope.row.orderSn)" type="text" size="small" v-auth="codeData" data-code='PCO_UPDATE' :disabled="scope.row.businessStatus!='06' || scope.row.deliverNum!=0">修改</el-button>
              <el-button  @click="deleteItem(scope.row)" type="text" size="small" v-auth="codeData" data-code='PCO_DELETE' :disabled="scope.row.businessStatus!='06' || scope.row.deliverNum!=0">删除</el-button>
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" v-if="scope.row.businessStatus=='06'">
                  <el-dropdown-item :command="dropdownItemValueChange('addNote',scope.row)">添加到货单</el-dropdown-item>
                  <el-dropdown-item :command="dropdownItemValueChange('done',scope.row)">确认完成</el-dropdown-item>
                </el-dropdown-menu>
                <el-dropdown-menu slot="dropdown" v-else>
                  <el-dropdown-item :command="dropdownItemValueChange('addNote',scope.row)" disabled>添加到货单</el-dropdown-item>
                  <el-dropdown-item disabled :command="dropdownItemValueChange('done',scope.row)">确认完成</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
  </div>
</template>

<script>
import { formatTimestamp } from "@/utils/date";
import codeSet from "@/components/codeSet";
import treeDept from "@/components/treeDept";
import { getToken } from "@/utils/auth";
import { Loading } from 'element-ui';
let token = getToken(); 
/**
 * 基本管理
 */
export default {
  components: {
    codeSet,
    treeDept
  },
  data() {
    return {
      loadingInstance:null,
      //权限Code码
      codeData:[],
      tokenHeaders:{accessToken: token},
      fileList:[],
      filtersData: {
        orderType: "0301",
        searchKey: "",
        businessStatusList: [],
        channelCodes: [],
        //组织机构code码
        organizationCodes: [],
        supplierCodes: [],
        startTime: "",
        endTime: "",
        pageIndex: 1,
        pageSize: 10
      },
      options1: [
        {
          value: "06",
          name: "未完成"
        },
        {
          value: "08",
          name: "已完成"
        },
        {
          value: "15",
          name: "已作废"
        }
      ],
      //采购订单列表
      purchaseOrderListData: [],

      total: null,
      //日期
      datefilter: [],

      agencies: [], //所属机构集合
      suppliers: [], //供应商集合
      //组织机构数据
      organizationListData: [],
    };
  },
  created() {
    //得到表格数据
    this.getTableList();
    this.findAgencyList();
    this.findSuppliers();
    //得到组织机构
    this.getWarehouseListData()

    this.getCodeLimitToBtnStatus(this.$route.meta.currentid);
  },
  filters:{
    //过滤当前状态
    filterBusinessStatus(val) {
     switch (val) {
        case "06":
          return "未完成";
          break;
        case "08":
          return "已完成";
          break;
        case "15":
          return "已作废";
          break;
        default:
          return '--'
        break;
      }
    },
    //过滤支付状态
    filterPaymentCode(val) {
      switch (val) {
        case "01":
          return "现金";
          break;
        case "02":
          return "银行卡";
          break;
        case "03":
          return "微信";
          break;
        case "04":
          return "支付宝";
          break;
        case "05":
          return "支票";
          break;
        case "06":
          return "电汇";
          break;
        case "07":
          return "汇票";
          break;
        case "08":
          return "其他";
          break;
        default:
          return '--'
        break;
      }
    },
    //过滤到货状态
    filterWarehouseStatus(val){
      switch (val) {
        case "1001":
          return "未到货";
        break;
        case "1002":
          return "部分到货";
        break;
        case "1003":
          return "全部到货";
        break;
        case "1004":
          return "超收到货";
          break;
        default:
          return "--"
        break;
      }
    },
    //过滤订单来源
    filterChannelCode(val){
      switch (val) {
        case "01":
          return "淘宝";
        break;
        case "02":
          return "京东";
        break;
        case "03":
          return "天猫";
        break;
        case "04":
          return "手工录入";
          break;
        default:
          return "--"
        break;
      }
    }
  },
  methods: {
    fileAction() {
      return this.api.FN_ALLPATH(this.api.order.channelPurchaseOrder_importPurchaseOrder);
    },
    //文件上传成功过
    handleFileSuccess(res, file){
      if(!res.data.model){
        this.$nextTick(() => { 
          let html = '';
          res.data.invalid.forEach(errItem => {
            html += '<p>'+ errItem + '：该商品不存在</p>';
          });
          this.$notify({
            title: '提示',
            duration: 0,
            dangerouslyUseHTMLString: true,
            message: html
          });
          this.loadingInstance.close();
        });
        return;
      }
      var uploadData = JSON.stringify(res.data.model)
      var invalid =JSON.stringify(res.data.invalid)
      console.log(res)
      this.$nextTick(() => { 
        this.$router.push({  
          name: "purchaseOrder_add",
          params: {
            uploadData:uploadData,
            invalid:invalid
          }
        })
        localStorage.setItem("type", "add");
        this.loadingInstance.close();
      });
    },
    beforefileUploadChange(file) {
      console.log(file);
      //文件上传之前调用做一些拦截限制
      // this.fileList=[]
      // this.fileList.push({name:file.name});
      this.loadingInstance = Loading.service({ 
        fullscreen: true,
        text:'正在拼命导入。。。' 
      });
    },
    // 得到code码，用来限制是否显示按钮
    getCodeLimitToBtnStatus(codeId) {
      this.request(this.api.user.crm_userCompany_authList, {
        menuId: codeId
      }).then(res => {
        console.log(res);
        this.codeData=res
      });
    },
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
        this.organizationListData.push(data)
        //得到供货商数据
        this.getSupplierListData(data.id)
      });
    },
    //得到供货商数据
    getSupplierListData(organizationId) {
      console.log(246);
      //cooperation 为true得到有合作的供应商 不传 得到全部的供应商
      this.request(this.api.product.supplier_list, {cooperation:true}).then(data => {
        console.log(data);
        this.suppliers = data.data;
      });
    },
    //获取列表
    getTableList() {
      this.request(
        this.api.order.channelPurchaseOrder_list,
        this.filtersData
      ).then(data => {
        this.total = data.totalCount;
        this.purchaseOrderListData = data.data;
      });
    },
    //新增
    openAddClass() {
      this.$router.push({
        path: "/OS/business/purchase/purchaseOrder_add",
        query: {
          type: "add"
        }
      });
      localStorage.setItem("type", "add");
    },
    //查看
    openShowDetails(orderSn) {
      this.$router.push({
        path: "/OS/business/purchase/purchaseOrder_check",
        query: {
          orderSn: orderSn
        }
      });
    },
    //修改
    openEdit(orderSn) {
      console.log(orderSn)
      this.$router.push({
        path: "/OS/business/purchase/purchaseOrder_editor",
        query: {
          orderSn: orderSn
        }
      });
      localStorage.setItem("type", "add");
    },
    //下拉选项
    handleCommand(row) {
      console.log(row)
      if (row["remark"] == "addNote") {
        //点击了到货单
        this.$router.push({
          path: "/OS/business/purchase/arrivalNotice_add",
          query: {
            orderSn:row['row'].orderSn
          }
      });
      } else {
        //点击了该行的完成
        this.request(this.api.order.channelPurchaseOrder_updatePurchaseOrderStatus,{orderSn:row['row'].orderSn, symbol:'complete'}).then(data=>{
          this.$message({
            message: '订单已完成',
            type: 'success'
          });
          //刷新表格数据
          this.getTableList()
        })
      }
    },
    dropdownItemValueChange(tagStr, row) {
      return {
        remark: tagStr,
        row: row
      };
    },
    //查询所属机构列表
    findAgencyList() {

    },
    //查询供应商列表
    findSuppliers() {},
    //导入
    importExcel(id) {
      console.log("importExcel")
      // this.postAxios(this.$base.api.procureOrder_importExcel, {}).then(data => {
      //   alert(data.data);
      //   this.getTableList();
      // });
    },
    //下载模板
    downloadTemplate() {},
    //查看质检报告
    findQuality(id) {},
    //删除
    deleteItem(val) {
      if (confirm("确定删除？")) {
        console.log(val);
        this.request(this.api.order.channelPurchaseOrder_logicDelete, {
          orderSn: val.orderSn
        }).then(data => {
          this.getTableList();
        });
      }
    },
    //完成订单
    completeOrder(val) {
      if (
        confirm(
          "确认采购订单完成吗？\n" +
            "\n" +
            "确认后采购订单结束，不可增添到货单！"
        )
      ) {
        this.postAxios(this.$base.api.procureOrder_confirm, val).then(data => {
          this.getTableList();
        });
      }
    },
    //搜索
    handleSearch() {
      console.log(this.filtersData);
      this.getTableList();
    },

    //清空重置
    handleResetFilters(formName) {
      console.log("handleResetFilters======");
      this.$refs[formName].resetFields();
      this.filtersData.startTime = "";
      this.filtersData.endTime = "";
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

<style  lang="less" scoped>
.purchases-bass {
  // background-color: #fff;
  height: 100%;
  margin: 8px;
  .item-form {
    margin-bottom: 8px;
    background-color: #fff;
    padding: 10px 10px 0 10px;
  }
  .item-cont {
    margin-right: 10px;
    display: flex;
  }
  .date-picker-div {
    margin-right: 10px;
  }
}
.table {
  padding: 20px;
}
</style>

