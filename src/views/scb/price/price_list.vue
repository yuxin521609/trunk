<template>
  <div>
    <el-dialog width="555px"  @closed="closeDialog" title="添加门店" :visible.sync="dialogTableVisible">
      <el-form ref="ruleForm" :model="addFormData" :rules="rules" label-width="120px" size="small">
        <el-form-item label="门店名称：" prop="purchaseAgentId">
          <el-select ref="storeElement" :value-key="item" v-model="addFormData.purchaseAgentId" clearable filterable>
              <el-option v-for="(item, index) in storeBasic_listForScbPriceManagement_data.data" :label="item.name" :key="index" :its="item" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购折扣：" prop="purchaserDiscountValue">
          <el-input v-model="addFormData.purchaserDiscountValue" placeholder="请填写采购折扣，如：2.4" class="input-w-2"></el-input>
        </el-form-item>
        <el-form-item class="mt-30">
          <el-button  size="small" @click="dialogTableVisible = false">取消</el-button>
          <el-button type="primary" @click="addList" size="small">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="item-margin">
      <el-form class="item-form" :model="filtersData" label-width="90px" size="small" ref="formData" inline>
        <el-form-item label="门店名称：">
          <el-select v-model="filtersData.purchaseAgentId" clearable filterable>
              <el-option v-for="(item, index) in getStoreList_data.data" :label="item.name" :key="index" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" type="primary" plain>搜索</el-button>
          <el-button @click="handleResetFilters" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="box">
      <el-button size="small" type="primary" @click="dialogTableVisible = true">添加门店</el-button>
      <page-table :form-data="filtersData" :get-data="purchasingAgentPriceManagement_list" :table-data="discountData">
        <el-table
          class="mt-20"
          :data="discountData.data"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true">
          <el-table-column prop align="center" :show-overflow-tooltip="true" label="门店" min-width="100">
            <template slot-scope="scope">{{ scope.row.purchaseAgentName }}</template>
          </el-table-column>
          <el-table-column prop align="center" :show-overflow-tooltip="true" label="联系人" min-width="100">
            <template slot-scope="scope">{{ scope.row.phone }}&nbsp;【{{ scope.row.administrator }}】</template>
          </el-table-column>
          <el-table-column prop align="center" :show-overflow-tooltip="true" label="可用余额/冻结余额" min-width="100">
            <template slot-scope="scope">{{ scope.row.usableBalance + '/' + scope.row.disableBalance }}</template>
          </el-table-column>
          <el-table-column prop align="center" :show-overflow-tooltip="true" label="采购折扣" min-width="100">
            <template slot-scope="scope">{{ scope.row.purchaserDiscountValue }}</template>
          </el-table-column>2
          <el-table-column prop align="center" :show-overflow-tooltip="true" label="指定折扣商品" min-width="100">
            <template slot-scope="scope">{{ scope.row.productSumQty }}款</template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="timeRedact(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-table>
    </div>
  </div>
</template>
<!-- 工单池 -->
<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
import codeSet from "@/components/codeSet";
import treeDept from "@/components/treeDept";
import { filter } from "minimatch";
import { get } from "http";
import PageTable from "@/views/collocation/components/PageTable";

let token = getToken();

export default {
  name:'price_list',
  data() {
    return {
      dialogTableVisible:false,
      // 新建商品折扣提交参数
      addFormData:{
        "administrator": "", // 管理员
        "merchantId": "", // 商品id
        "merchantName": "", // 商品名称
        "phone": "", // 采购商管理员手机号
        "purchaseAgentId": "", // 采购商id
        "purchaseAgentName": "", // 采购商名称
        "purchaserDiscountType": 1, // 采购商类型（0：满减，1：折扣）；
        "purchaserDiscountValue": null, // 采购折扣
      },
      // 折扣列表
      discountData: [],
      data_obj: {},
      // 折扣类型
      discountType: ["预约折扣", "阶梯折扣", "单品折扣"],
      // 门店列表
      storeList: {},
      // 检索
      filtersData: {
        pageIndex: 1, // 当前页码
        pageSize: 10, // 每页数量
        "orderBy": "",
        purchaseAgentId:null
      },
      // 门店
      getStoreList_data:{},
      // 过滤后的门店
      storeBasic_listForScbPriceManagement_data:{},
      rules: {
        purchaseAgentId: [{ required: true, message: '请选择门店！', trigger: 'change' }], 
        purchaserDiscountValue: [{ required: true, validator: (rule, value, callback) => {
          if(!value) {
            callback(new Error('请输入折扣金额！'));
          };
          if(!(/(^[1-9](\.\d)?$)|(^[0]\.\d$)/.test(value))) {
            callback(new Error('请填写采购折扣，如：2.4！'));
          }else{
            callback();
          };
        }, trigger: 'change' }]
      },
    };
  },
  created() {
    const that = this;
    // 获取全部门店
    this.getStoreList();
    // 获取过滤后的门店
    this.storeBasic_listForScbPriceManagement();
    this.purchasingAgentPriceManagement_list(); // 获取折扣列表
  },
  activated() {
    this.purchasingAgentPriceManagement_list();
  },
  methods: {
    /**
     * 关闭弹框
     */
    closeDialog() {
      this.addFormData = {
        "administrator": "", // 管理员
        "merchantId": "", // 商品id
        "merchantName": "", // 商品名称
        "phone": "", // 采购商管理员手机号
        "purchaseAgentId": "", // 采购商id
        "purchaseAgentName": "", // 采购商名称
        "purchaserDiscountType": 1, // 采购商类型（0：满减，1：折扣）；
        "purchaserDiscountValue": null, // 采购折扣
      };
    },
    /**
     * 新增列表数据
     */
    addList() {
      
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const checkItem = this.storeBasic_listForScbPriceManagement_data.data.find(item => {
            return item.id == this.addFormData.purchaseAgentId;
          }); 

          // return;
          Object.assign(this.addFormData, {
            "administrator": checkItem.linkman, // 管理员
            "phone": checkItem.phone, // 采购商管理员手机号
            "purchaseAgentName": checkItem.name, // 采购商名称
          });
          this.request(
            this.api.scb.purchasingAgentPriceManagement_save,
            this.addFormData
          ).then(res => {
            this.warn('新建成功！');
            this.dialogTableVisible = false;
            this.purchasingAgentPriceManagement_list();
            // 清空新建提交数据
            this.addFormData = {
              "administrator": "", // 管理员
              "merchantId": "", // 商品id
              "merchantName": "", // 商品名称
              "phone": "", // 采购商管理员手机号
              "purchaseAgentId": "", // 采购商id
              "purchaseAgentName": "", // 采购商名称
              "purchaserDiscountType": 0, // 采购商类型（0：满减，1：折扣）；
              "purchaserDiscountValue": 0, // 采购折扣
            };
          });
        }
      });
     
    },
    /**
     * 查询门店列表
     */
    getStoreList() {
      const that = this;

      this.request(
      that.api.store.storeBasic_listStoreBasic
      ).then(res => {
        that.getStoreList_data = res;
      });
    },
    /**
     * 查询门店列表
     */
    storeBasic_listForScbPriceManagement() {
      const that = this;

      this.request(
        that.api.store.storeBasic_listForScbPriceManagement
      ).then(res => {
        that.storeBasic_listForScbPriceManagement_data = res;
      });
    },
    /**
     * 删除折扣
     */
    removeDiscount(item) {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          switch (item.type) {
            case 0:
              this.request(
                this.api.market.marketingMiddleground_deleteDiscountSetting,
                {
                  id: item.discountId
                }
              ).then(res => {
                this.purchasingAgentPriceManagement_list();
                this.warn("删除成功!");
              });
              break;
            case 1:
              this.request(
                this.api.market.marketingMiddleground_deleteDiscountParameterS,
                {
                  id: item.discountId
                }
              ).then(res => {
                this.purchasingAgentPriceManagement_list();
                this.warn("删除成功!");
              });
              break;
            case 2:
              this.request(
                this.api.market
                  .marketingMiddleground_deleteSingleProductDiscount,
                {
                  id: item.discountId
                }
              ).then(res => {
                this.purchasingAgentPriceManagement_list();
                this.warn("删除成功!");
              });
              break;
          }
        })
        .catch(() => {
          this.warn("取消删除!", "info");
        });
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
     * 编辑
     * @param { Object } item 当前对象
     * @param { Boolean } isRead 是否可对写
     * @property { Boolean }isEcho 是否是编辑
     * @return { Object } Obj 返回对象
     */
    timeRedact(item) {
      var Obj = {};
      this.href("scb/price/price_edit", {
        isEdit: true,
        id: item.id,
      });
    },
    /**
     * 获取折扣列表
     */
    purchasingAgentPriceManagement_list() {
      this.request(
        this.api.scb.purchasingAgentPriceManagement_list,
        this.filtersData
      ).then(res => {
        this.discountData = res;
      });
    },
    /**
     * 跳转工单详情
     */
    href(routeName, param) {
      this.$router.push({
        path: "/" + routeName,
        query: param
      });
    },
    /**
     * 模糊搜索
     */
    handleSearch() {
      this.filtersData.pageIndex = 1;
      this.purchasingAgentPriceManagement_list();
    },
    /**
     * 搜索重置
     */
    handleResetFilters() {
      Object.assign(this.filtersData, {
        pageIndex: 1, // 当前页码
        pageSize: 10, // 每页数量
        "orderBy": "",
        purchaseAgentId:null
      });
    },
    /**
     * 点击页数
     * @param { Number } pageIndex 当前页
     */
    handleCurrentChange(pageIndex) {
      this.filtersData.pageIndex = pageIndex;
      this.purchasingAgentPriceManagement_list();
    },
    /**
     *  选择每页多少条数
     *  @param { Number } pageSize 每页条数
     */
    handleSizeChange(pageSize) {
      this.filtersData.pageSize = pageSize;
      this.purchasingAgentPriceManagement_list();
    }
  },
  components: {
    codeSet,
    treeDept,
    PageTable
  }
};
</script>
<style  lang="less" scoped>
.previewVisible-list {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 50%;
    margin-right: 0;
    text-align: right;
  }
}
.blueness {
  color: #1e90ff;
}
h5 {
  color: #222;
  margin-left: -15px;
}
.test {
  color: #9d9d9d;
}
.box {
  padding: 20px 20px 20px 20px;
  margin: 8px 8px 20px 8px;
  background: #fff;
}
</style>
