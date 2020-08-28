<template>
  <!-- 渠道订单 -->
  <div class="base">
    <div class="middle-from">
      <el-form
        :inline="true"
        :model="formInline"
        size="small"
        ref="ruleForm"
        class="demo-form-inline"
      >
        <el-form-item prop="searchKey" label="模糊查询：">
          <el-input
            class="seachKey-input"
            v-model="formInline.searchKey"
            placeholder="订单号/收货人/收货人电话/收货人地址"
          ></el-input>
        </el-form-item>

        <el-form-item label="订单状态：" prop="businessStatusList">
          <el-select v-model="formInline.businessStatusList" placeholder="请选择" :multiple="true">
            <el-option label="待发货" value="05"></el-option>
            <el-option label="已发货" value="06"></el-option>
            <el-option label="已完成" value="08"></el-option>
            <el-option label="异常完成" value="16"></el-option>
            <el-option label="异常发货" value="17"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属机构：" prop="organizationCodes">
          <el-select v-model="formInline.organizationCodes" placeholder="请选择" :multiple="true">
            <el-option
              v-for="item in organizationListData"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="dateTime" label="创建时间：">
          <el-date-picker
            class="date-picker-div"
            v-model="formInline.startTime"
            type="date"
            placeholder="开始时间"
          ></el-date-picker>
          <el-date-picker v-model="formInline.endTime" type="date" placeholder="结束时间"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" plain @click="onSearchContent" size="small">搜索</el-button>
          <el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- table -->
    <div class="table">
      <el-button
        type="primary"
        @click="openAddAttrbute"
        size="small"
        v-auth="codeData"
        data-code="CAO_CREATE"
      >新增</el-button>
      <el-button
        :disabled="multipleSelectionData.length==0"
        plain
        @click="exportExcel"
        size="small"
      >导出</el-button>
      <el-button
        plain
        @click="batchBtnClick"
        style="margin-bottom:20px;"
        v-auth="codeData"
        :disabled="multipleSelection.length==0"
        data-code="CAO_BATCHAUDIT"
        size="small"
      >批量审核</el-button>

      <!-- table订单 -->
      <template>
        <el-table
          ref="multipleTable"
          :data="netSalesTableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          header-row-class-name="item-table-header"
        >
          <el-table-column :selectable="isSelectCheck" type="selection" width="55"></el-table-column>

          <el-table-column label="销售订单号" prop="orderSn" width="210" align="center"></el-table-column>

          <el-table-column prop="reviewed" label="订单状态" width="80" align="center">
            <template slot-scope="scope">
              <span>{{scope.row | filterReviewed}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="paymentStatus" label="支付状态" width="80" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.paymentStatus | filterPaymentStatus}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="storeName" label="购买商户" width="80" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.storeName ? scope.row.storeName:'--'}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="receiverName" label="收货人" width="80" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.receiverName ? scope.row.receiverName:'--'}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="receiverMobile" label="收货人电话" width="160" align="center"></el-table-column>

          <el-table-column prop="receiverAddress" label="收货地址" width="160" align="center">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.receiverAddress"
                placement="top"
              >
                <span>{{scope.row.receiverAddress | filterToAddress}}</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="amount" label="订单金额" width="180" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.amount | filterPrice}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="actualAmount" label="实付金额" width="180" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.actualAmount | filterPrice}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="paymentCode" label="支付方式" width="80" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.paymentCode | filterPaymentCode}}</span>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" width="160" align="center">
            <template slot-scope="scope">{{ scope.row.createTime | timestampToTime}}</template>
          </el-table-column>

          <el-table-column prop="organizationCode" label="所属机构" width="180" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.organizationCode ? scope.row.organizationCode:'--'}}</span>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="agent" label="推荐人" width="80" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.agent ? scope.row.agent:'--'}}</span>
            </template>
          </el-table-column>-->

          <el-table-column prop="address" label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button
                @click="checkBtnClick(scope.row)"
                type="text"
                v-auth="codeData"
                data-code="CAO_VIEW"
              >查看</el-button>
              <el-button
                v-auth="codeData"
                data-code="CAO_UPDATE"
                @click="editBtnClick(scope.row)"
                type="text"
                :disabled="scope.row.reviewed!=0 && scope.row.reviewed!=2"
              >修改</el-button>
              <el-button
                @click="cancleBtnclick(scope.row.orderId)"
                type="text"
                v-auth="codeData"
                data-code="CAO_CANCEL"
                :disabled="scope.row.reviewed==1 && scope.row.businessStatus!='05'"
              >取消</el-button>
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="dropdownItemValueChange('isRemark',scope.row)"
                    v-auth="codeData"
                    data-code="CAO_REMARKS
"
                  >添加备注</el-dropdown-item>
                  <el-dropdown-item
                    v-auth="codeData"
                    data-code="CAO_AUDIT"
                    v-if="scope.row.reviewed == 0"
                    :command="dropdownItemValueChange('isCheck',scope.row)"
                  >审核订单</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <div class="block" style="margin-top:20px;padding-bottom:10px;margin-right:20px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="formInline.pageIndex"
            :page-sizes="[10,20,30,40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totlePage"
          ></el-pagination>
        </div>
      </template>
    </div>

    <!-- 圆形进度条 -->
    <el-dialog
      :visible.sync="circleDialogVisible"
      class="circleProgress"
      @close="closeCircleProgress"
      :show-close="false"
    >
      <el-progress type="circle" :percentage="20"></el-progress>
      <div style="margin-top:10px;">
        <label>正在读取订单</label>
      </div>
      <div>
        <label>请不要关闭本页面,关闭后将会读取失败!</label>
      </div>
    </el-dialog>

    <!-- 表格数据  -->
    <el-dialog :visible.sync="TableVisible">
      <div style="position: relative;top:-40px;">
        <div class="first-title">
          <h3>累计读取订单</h3>
          <h3 style=" right: 30px;position: absolute;top:10px;">{{allTotalData}}单</h3>
        </div>
        <div class="middle-title">
          <h3>成功有效订单</h3>
          <h3 style=" right: 30px;position: absolute;top:53px;">{{validTotalData}}单</h3>
        </div>
        <h5 style="position: absolute;top:127px;">订单读取明细如下</h5>
      </div>
      <el-table :data="gridData" height="200px">
        <el-table-column property="row" label="行号" width="80"></el-table-column>
        <el-table-column property="searchKey" label="订单号" width="160"></el-table-column>
        <el-table-column property="orderStatus" label="读取结果">
          <template slot-scope="scope">
            <div>{{scope.row.orderStatus | filterOrderStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column label="有效状态">
          <template slot-scope="scope">
            <div>
              <i :class="{'el-icon-success':scope.row.orderStatus==2}"></i>
              <span style="margin-left: 10px">{{ scope.row.status }}</span>
            </div>
            <div>
              <i :class="{'el-icon-warning':scope.row.orderStatus!=2}"></i>
              <span style="margin-left: 10px">{{ scope.row.status }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="btn">
        <el-button plain @click="closeTable" size="small">取消</el-button>
        <el-button type="primary" @click="successBtnClickTable" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
import codeSet from "@/components/codeSet";
import treeDept from "@/components/treeDept";
import { filter } from "minimatch";
import { get } from "http";
let token = getToken();
export default {
  components: {
    codeSet,
    treeDept
  },

  data() {
    return {
      //权限Code码
      codeData: [],
      //是否显示备注信息框
      isShowRemarkMsgBox: false,
      //仓储性质数据
      storageValArr: [],
      //订单来源支持多数据绑定
      orderValArr: [],
      formInline: {
        orderType: "0201",
        searchKey: "",
        // 日期时间
        startTime: "",
        endTime: "",
        channelCodes: [],
        //订单状态
        businessStatusList: [],
        //组织机构
        organizationCodes:[],
        //店铺名称
        storeName: "",
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      channelSaleOrderVoList: [],
      //网销订单表格数据
      netSalesTableData: [],
      //总的条数
      totlePage: 1,
      //table中checkBox的状态
      multipleSelection: [],
      /***************上面的时网销订单相关******************/
      //圆形进度条相关
      circleDialogVisible: false,
      // 日期时间
      dateTime: "",
      dialogFormVisible: false,
      //表格数据
      TableVisible: false,
      gridData: [],
      //总的单数
      allTotalData: "",
      //有效单数
      validTotalData: 0,
      //需要上传的文件
      fileList: [],
      fileData: new FormData(),
      fileUrl: "",
      ditchFileName: "",
      babyFileName: "",
      uploadData: [],
      //获取门店列表数据
      storeListData: [],
      //组织机构数据
      organizationListData: [],
      //存储需要导出表格的数据
      multipleSelectionData: [],
      // //创建时间-开始时间
      // startTime:{
      //   disabledDate: time => {
      //       if (this.formInline.startTime) {
      //         return (
      //           time.getTime() < new Date(this.formInline.startTime).getTime()- 8.64e7
      //         )
      //       } else {
      //         // 不能大于当前日期
      //         return time.getTime() < Date.now()- 8.64e7
      //       }
      //     }
      // },
      // //创建时间-结束时间
      // endTime:{
      //   disabledDate: time => {
      //       if (this.formInline.starttime) {
      //         return (
      //           time.getTime() > Date.now() ||
      //           time.getTime() < new Date(this.formInline.starttime).getTime()- 8.64e7 // 加- 8.64e7则表示包当天
      //         )
      //       } else {
      //         return time.getTime() < Date.now()- 8.64e7
      //       }
      //     }
      // },
    };
  },
  created() {
    //得到组织机构
    this.getWarehouseListData();

    this.getCodeLimitToBtnStatus(this.$route.meta.currentid);
    //得到表格数据
    this.getChannelSaleOrderListTableData();
  },
  // 过滤器
  filters: {
    filterOrderStatus(val) {
      if (val == 2) {
        return "订单有效,商品库存已锁定";
      }
      if (val == 1) {
        return "订单无效";
      }

      return "订单信息不全";
    },
    //过滤地址
    filterToAddress(val) {
      if (val.length > 12) {
        let newStr = val.substring(0, 11) + "....";
        return newStr;
      } else {
        return val;
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
          return "--";
          break;
      }
    },
    //过滤订单来源
    filterChannelCode(val) {
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
          return "--";
          break;
      }
    },
    //过滤订单状态
    filterReviewed(val) {
      switch (val.reviewed) {
        case 0:
          return "待审核";
          break;
        case 2:
          return "审核驳回";
          break;
        case 1:
          switch (val.businessStatus) {
            case "05":
              return "待发货";
              break;
            case "06":
              return "已发货";
              break;
            case "08":
              return "已完成";
              break;
            case "16":
              return "异常完成";
              break;
            case "17":
              return "异常发货";
              break;
            default:
              return "--";
              break;
          }
          break;
        default:
          return "--";
          break;
      }
    },
    //过滤支付状态
    filterPaymentStatus(val) {
      switch (val) {
        case "01":
          return "未支付";
          break;
        case "02":
          return "部分支付";
          break;
        case "03":
          return "已支付";
          break;
        case "08":
          return "已完成";
          break;
        default:
          return "--";
          break;
      }
    },
    filterPrice(val) {
      if (val && val != null) {
        val = String(val);
        let left = val.split(".")[0],
          right = val.split(".")[1];
        right = right
          ? right.length >= 2
            ? "." + right.substr(0, 2)
            : "." + right + "0"
          : ".00";
        let temp = left
          .split("")
          .reverse()
          .join("")
          .match(/(\d{1,3})/g);
        return (
          "￥" +
          (Number(val) < 0 ? "-" : "") +
          temp
            .join(",")
            .split("")
            .reverse()
            .join("") +
          right
        );
      } else if (val === 0) {
        // 注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
        return "￥" + "0.00";
      } else {
        return "--";
      }
    }
  },
  methods: {
    //得到组织机构数据
    async getWarehouseListData() {
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      console.log(info);
      //得到部门Id
      // this.shop_user.relationDepId = info.departId;

      this.request(this.api.user.userCompany_getUserOrgByUserId, {
        userId: info.userId,
        type: 0
      }).then(data => {
        console.log(data);
        this.organizationListData.push(data);
      });
    },
    // 得到code码，用来限制是否显示按钮
    getCodeLimitToBtnStatus(codeId) {
      this.request(this.api.user.crm_userCompany_authList, {
        menuId: codeId
      }).then(res => {
        this.codeData = res;
      });
    },
    //新增基本信息  跳转页面
    openAddAttrbute() {
      this.$router.push({
        path: "/OS/channelSales/channelSales_add",
        name: "channelSales_add",
        query: {
          type: "add"
        }
      });
      localStorage.setItem("type", "add");
      // eventVue.$emit('sendMsg',sendObj)
    },
    isSelectCheck(row, index) {
      if (row.reviewed == 0) {
        return true;
      } else {
        return false;
      }
    },
    //取消
    closeTable() {
      let tempData = this.gridData.filter(item => item.orderStatus == 2);
      if (tempData.length > 0) {
        this.request(this.api.order.channelSaleOrder_updateBatch, {
          channelSaleOrderVoList: tempData,
          tagCode: "ORDER_CANCEL"
        }).then(data => {});
      } else {
        this.request(this.api.order.channelSaleOrder_updateBatch, {
          channelSaleOrderVoList: [],
          tagCode: "ORDER_CANCEL"
        }).then(data => {});
      }
      this.TableVisible = false;
    },
    //确认
    successBtnClickTable() {
      //   dialogFormVisible = false
      let tempData = this.gridData.filter(item => item.orderStatus == 2);
      if (tempData.length > 0) {
        this.request(this.api.order.channelSaleOrder_updateBatch, {
          channelSaleOrderVoList: tempData,
          tagCode: "ORDER_CONFIRM"
        }).then(data => {
          this.TableVisible = false;
        });
      } else {
        this.request(this.api.order.channelSaleOrder_updateBatch, {
          channelSaleOrderVoList: [],
          tagCode: "ORDER_CONFIRM"
        }).then(data => {
          this.TableVisible = false;
        });
      }
    },
    //得到ListData表格数据
    getChannelSaleOrderListTableData() {
      this.request(this.api.order.channelSaleOrder_list, this.formInline).then(
        res => {
          //获取总的页数
          this.totlePage = res.totalCount;
          this.netSalesTableData = res.data;
        }
      );
    },
    onSubmit() {
      this.getChannelSaleOrderListTableData();
      console.log("submit!");
      console.log(this.valArr);
    },
    //搜索
    onSearchContent() {
      let startTime = this.formInline.startTime;
      let endTime = this.formInline.endTime;
      //搜索
      this.getChannelSaleOrderListTableData();
    },
    //重置表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formInline.channelCodes = [];
      this.formInline.startTime = "";
      this.formInline.endTime = "";
      console.log(2);
    },
    //导入按钮的点击事件
    leadBtnClick() {
      console.log("leadBtn");
    },
    //批量审核
    batchBtnClick() {
      this.multipleSelection.forEach(item => {
        item.orderType = "0201";
        item.reviewed = 1;
      });
      this.request(this.api.order.channelSaleOrder_updateBatch, {
        channelSaleOrderVoList: this.multipleSelection
      }).then(data => {
        //上传成功，清空选项
        this.$refs.multipleTable.clearSelection();
        this.$message({
          message: "批量审核成功",
          type: "success"
        });
        //刷新列表
        this.getChannelSaleOrderListTableData()
      });
    },

    //文件上传相关的事件
    // 手动上传
    customRequest(file) {},
    //选中checkBox的状态
    handleSelectionChange(val) {
      val.forEach(item => {
        item.reviewedName=this.$options.filters.filterReviewed(item.reviewed)
        item.paymentStatusName=this.$options.filters.filterPaymentStatus(item.paymentStatus)
        item.amounteName=this.$options.filters.filterPrice(item.amount)
        item.actualAmountName=this.$options.filters.filterPrice(item.actualAmount)
        item.paymentCodeName=this.$options.filters.filterPaymentCode(item.paymentCode)
        item.createTimeName=this.$options.filters.timestampToTime(item.createTime)
      });
      this.multipleSelection = val;
      this.multipleSelectionData=val
    },
    //点击按钮上传服务器
    submitUpload() {
      // this.ditchFileName.search("ExportOrderList")
      if (this.ditchFileName.search("ExportOrderList") == -1) {
        this.ditchTipMsg();
        return;
      }
      if (this.babyFileName.search("ExportOrderDetailList") == -1) {
        this.babyTipMsg();
        return;
      }
      var formdata = this.fileData;
      console.log(formdata);
      axios({
        method: "POST",
        url: this.channelSaleOrder_Import,
        headers: {
          "Content-Type": "multipart/form-data",
          accessToken: token
        },
        data: this.fileData
      })
        .then(res => {
          this.validTotalData = 0;
          console.log("450==================");
          console.log(res);
          console.log(res.data);
          this.gridData = res.data.data;
          this.allTotalData = this.gridData[this.gridData.length - 1].row;
          this.gridData.forEach(item => {
            if (item.orderStatus == 2) {
              this.validTotalData++;
            }
          });
          console.log(this.allTotalData + "=====");
          this.$refs["ditch-upload"].clearFiles();
          this.$refs["baby-upload"].clearFiles();
          this.fileData.delete("channelSaleOrderImport");
          this.ditchFileName = "";
          this.babyFileName = "";

          this.dialogFormVisible = false;
          // this.circleDialogVisible=true;

          this.TableVisible = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
     exportExcel() {
      console.log("导出Excel表格...+++++++++++++++++++");
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "销售订单号",
          "订单状态",
          "支付状态",
          "购买商户",
          "收货人",
          "收货人电话",
          "收货地址",
          "订单金额",
          "实付金额",
          "支付方式",
          "创建时间",
          "所属机构"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "orderSn",
          "reviewedName",
          "paymentStatusName",
          "storeName",
          "receiverName",
          "receiverMobile",
          "receiverAddress",
          "amountName",
          "actualAmountName",
          "paymentCodeName",
          "createTimeName",
          "organizationCode"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.multipleSelection; //把data里的multipleSelection存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "网销退货表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    handleRemove(file, fileList) {
      //   console.log(file, fileList);
    },
    handlePreview(file) {
      //   console.log(file);
    },
    //订单表
    ditchfileChange(file, fileList) {
      //添加文件名字
      this.fileData.append("channelSaleOrderImport", file.raw);
      //截取名字前缀
      this.ditchFileName = file.name.slice(0, file.name.length - 4);
    },
    //文件列表移除时的操作
    removeDitchFileList(file, fileList) {
      this.$refs["ditch-upload"].clearFiles();
      this.ditchFileName = "";
    },
    ditchTipMsg() {
      this.$message.error("订单表名字不正确");
    },
    //宝贝表
    babyFileChange(file, fileList) {
      // console.log(fileList.raw);
      console.log(file.raw);
      this.fileData.append("channelSaleOrderImport", file.raw);
      this.babyFileName = file.name.slice(0, file.name.length - 4);
    },
    //清空宝贝表
    removeBabyFileList(file, fileList) {
      this.$refs["baby-upload"].clearFiles();
      this.babyFileName = "";
    },
    babyTipMsg() {
      this.$message.error("宝贝表名字不正确");
    },
    //CircleProgress关闭时的回调
    closeCircleProgress() {
      // console.log("closeCircleProgress")
      this.TableVisible = true;
    },
    //下拉选项
    handleCommand(rowId) {
      console.log("485========");

      console.log(rowId);
      if (rowId["remark"] == "isRemark") {
        //  this.isShowRemarkMsgBox=true
        //备注
        this.$prompt("请输入备注", "添加订单备注", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(({ value }) => {
            let rowObj = rowId["row"];
            rowObj.remarks = value;

            console.log("510================");
            console.log(rowObj);
            (this.channelSaleOrderVoList = []),
              this.channelSaleOrderVoList.push({
                orderId: rowObj.orderId,
                receiverAddress: rowObj.receiverAddress,
                reviewed: rowObj.reviewed,
                receiverMobile: rowObj.receiverMobile,
                orderSn: rowObj.orderSn,
                receiverName: rowObj.receiverName,
                receiverMobile: rowObj.receiverMobile,
                orderType: "0201",
                channelCode: rowObj.channelCode,
                remarks: rowObj.remarks,
                warehouseCode: rowObj.warehouseCode,
                goodsOwner: rowObj.goodsOwner
              });
            this.request(this.api.order.channelSaleOrder_updateBatch, {
              channelSaleOrderVoList: this.channelSaleOrderVoList,
              tagCode: "ORDER_UPDATE"
            }).then(data => {
              this.$message({
                type: "success",
                message: "备注信息是: " + value
              });
              //刷新列表
              this.getChannelSaleOrderListTableData()
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消备注"
            });
          });
      } else {
        const h = this.$createElement;
        this.$msgbox({
          title: "订单审核",
          message: h("p", null, [
            h("span", null, "审核通过后,库房将接收订单发货通知 ")
          ]),
          showCancelButton: true,
          showClose: false,
          confirmButtonText: "确定",
          cancelButtonText: "驳回"
        })
          .then(action => {
            console.log(action);
            let rowObj = rowId["row"];
            rowObj.reviewed = 1;
            (this.channelSaleOrderVoList = []),
              this.channelSaleOrderVoList.push({
                orderId: rowObj.orderId,
                receiverAddress: rowObj.receiverAddress,
                reviewed: rowObj.reviewed,
                receiverMobile: rowObj.receiverMobile,
                orderSn: rowObj.orderSn,
                receiverName: rowObj.receiverName,
                receiverMobile: rowObj.receiverMobile,
                orderType: "0201",
                channelCode: rowObj.channelCode,
                warehouseCode: rowObj.warehouseCode,
                goodsOwner: rowObj.goodsOwner
              });
            this.request(this.api.order.channelSaleOrder_updateBatch, {
              channelSaleOrderVoList: this.channelSaleOrderVoList,
              tagCode: "ORDER_UPDATE"
            }).then(data => {
              this.$message({
                type: "info",
                message: "action: " + action
              });
              //刷新列表
              this.getChannelSaleOrderListTableData()
            });
          })
          .catch(res => {
            console.log(res);
            let rowObj = rowId["row"];
            rowObj.reviewed = 2;
            (this.channelSaleOrderVoList = []),
              this.channelSaleOrderVoList.push({
                orderId: rowObj.orderId,
                receiverAddress: rowObj.receiverAddress,
                reviewed: rowObj.reviewed,
                receiverMobile: rowObj.receiverMobile,
                orderSn: rowObj.orderSn,
                receiverName: rowObj.receiverName,
                receiverMobile: rowObj.receiverMobile,
                orderType: "0201",
                channelCode: rowObj.channelCode,
                warehouseCode: rowObj.warehouseCode,
                goodsOwner: rowObj.goodsOwner
              });
            this.request(this.api.order.channelSaleOrder_updateBatch, {
              channelSaleOrderVoList: this.channelSaleOrderVoList,
              tagCode: "ORDER_UPDATE"
            }).then(data => {
              this.$message({
                type: "info",
                message: "action: " + action
              });
            });
          });
      }
    },
    dropdownItemValueChange(isRemark, row) {
      return {
        remark: isRemark,
        row: row
      };
    },
    //查看按钮
    checkBtnClick(row) {
      console.log(row.orderSn);
      this.$router.push({
        path: "/OS/channelSales/channelSales_check",
        name: "show_channelSales_check",
        query: {
          orderSn: row.orderSn
        }
      });
    },
    //修改按钮
    editBtnClick(row) {
      console.log(row);
      this.$router.push({
        path: "/OS/channelSales/channelSales_editor",
        name: "channelSales_editor",
        query: {
          orderSn: row.orderSn,
          reviewed: row.reviewed
        }
      });
      localStorage.setItem("type", "add");
    },
    //取消按钮
    cancleBtnclick(orderId) {
      this.request(this.api.order.channelSaleOrder_cancel, {
        orderId: orderId,
        orderType: "0201"
      }).then(data => {
        this.$message({
          type: "info",
          message: "取消成功"
        });
        //刷新数据
        this.getChannelSaleOrderListTableData();
      });
    },
    //每页条数改变时
    handleSizeChange(page) {
      console.log(page);
      this.formInline.pageSize = page;
      this.getChannelSaleOrderListTableData();
    },
    // 当前页改变时
    handleCurrentChange(page) {
      console.log(page);
      this.formInline.pageIndex = page;
      this.getChannelSaleOrderListTableData();
    }
  }
};
</script>

<style lang="less" scoped>
.seachKey-input {
  width: 300px;
}
.btn {
  width: 100%;
  text-align: right;
  margin-top: 15px;
  margin-right: 20px;
}
.date-picker-div {
  margin-right: 10px;
}
.base {
  margin: 8px;
}
.main-top {
  // background-color: aqua;
  color: #222;
  display: inline-block;
  margin-left: -15px;
  width: 300px;
  line-height: 70px;
}
.block {
  margin-top: 20px;
  padding-bottom: 10px;
  margin-right: 20px;
}
h3 {
  margin-top: 0;
  margin-bottom: 15px;
}
.el-form {
  padding-top: 15px;
}
.middle-from {
  background-color: #fff;
  padding-left: 70px;
}
.table {
  margin-top: 8px;
  background-color: #fff;
  padding: 24px;
  // padding-top: 20px;
  // padding-left: 70px;
}
.upload-demo {
  float: left;
  margin-right: 10px;
}
.circleProgress {
  text-align: center;
}
// .addbtn button{
//    padding: 9px 15px;
// }
</style>

