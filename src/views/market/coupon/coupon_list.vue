<!--
 * @Author: elephant
 * @Date: 2019-10-08 13:40:21
 * @LastEditTime: 2019-11-14 15:03:47
 * @LastEditors: 
 * @Description: 卡券列表
 * @
 -->
<template>
  <div>
    <div class="item-margin">
      <el-form
        class="item-form"
        :model="filtersData"
        label-width="100px"
        size="small"
        ref="filtersForm"
        inline
      >
        <el-form-item prop="type" label="卡券类型：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.type">
            <el-option
              v-for="item in COUPON.type"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="storeId" label="适用门店：">
          <el-select
            class="input-w"
            clearable
            filterable
            placeholder="请选择"
            v-model="filtersData.storeId"
          >
            <el-option
              v-for="item in storeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="show" label="显示状态：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.show">
            <el-option label="隐藏" :value="false"></el-option>
            <el-option label="显示" :value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="couponStatus" label="上下架状态：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.couponStatus">
            <el-option label="上架" value="UPPER_FRAME"></el-option>
            <el-option label="下架" value="LOWER_FRAME"></el-option>
            <el-option label="过期" value="EXPIRED"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="handleSearch" type="primary" plain>搜索</el-button>
          <el-button size="small" @click="handleResetFilters('filtersForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--table  -->
    <div class="item-margin">
      <div class="item-cont">
        <el-button-group>
          <el-button size="small" type="primary" @click="openAddcoupon">新增卡券</el-button>
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
        >
          <el-table-column prop="typeName" align="center" label="卡券类型" min-width="100"></el-table-column>
          <el-table-column prop="couponName" align="center" label="折扣内容" min-width="100"></el-table-column>
          <el-table-column prop="storeName" align="center" label="适用门店" min-width="100"></el-table-column>
          <el-table-column
            prop="sendQuantityAndTotalLimit"
            align="center"
            label="领取数量/总量"
            min-width="100"
          ></el-table-column>
          <el-table-column prop="topDesc" align="center" label="有效时间" min-width="100"></el-table-column>
          <el-table-column prop="valid" align="center" label="状态" min-width="110">
            <template slot-scope="scope">
              <p>
                <span>【<em :class="!!scope.row.show ? 'em-show': 'em-hide'">{{!!scope.row.show ? '显示': '隐藏'}}</em>】</span>
                <span>【<em :class="!!scope.row.valid ? 'em-up-shelf': 'em-down-shelf'" >{{!!scope.row.valid ? '上架': '下架'}}</em>】</span>
              </p>
            </template>
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
              <el-button @click="openShowDetails(scope.row.id)" type="text" size="mini">查看</el-button>
              <el-button @click="openEditDetails(scope.row.id)" type="text" size="mini">修改</el-button>
              <el-button
                @click="handleIsShow(scope.row)"
                type="text"
                size="mini"
              >{{!!scope.row.show ? '隐藏': '显示'}}</el-button>
              <el-button
                @click="handleIsValid(scope.row)"
                type="text"
                size="mini"
              >{{!!scope.row.valid ? '下架': '上架'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-10 mb-20">
          <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersData.pageIndex"
            :page-sizes="[10, 20, 30,40,50]"
            :page-size="filtersData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!--table END  -->
  </div>
</template>
<script>
/**
 * 基本管理
 */
import { timesTampConvertsDate } from "@/utils/index";
export default {
  name:'coupon_list',
  data() {
    return {
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        type: "",
        storeId: "",
        show: null,
        couponStatus: ""
      },
      tableListData: [],
      total: null,
      cateOptions: [],
      storeOptions: []
    };
  },
  created() {
    this.getStoreData();
    this.getTableList();
  },
  activated () {
    this.getTableList();
  },
  methods: {
    //获取列表
    getTableList() {
      this.request(this.api.market.coupon_list, this.filtersData).then(data => {
        let _data = data.data,
          _dataLen = _data.length;
        for (let i = 0; i < _dataLen; i++) {
          //处理领取数量
          _data[i].sendQuantityAndTotalLimit = `${_data[i].sendQuantity}/${_data[i].totalLimit}`;
          //处理有效时间
           _data[i].topDesc=this.handleTopDesc(_data[i]);
          //处理卡卷类型
          _data[i].typeName=this.getTypeName(_data[i].type);
          //处理折扣内容
          _data[i].couponName=this.handleCouponName(_data[i]);
        }
        this.tableListData = _data;
        this.total = data.totalCount;
      });
    },
    //处理折扣内容函数
    handleCouponName(data){
      let usingCondition = data.usingCondition;
      let type= data.type;
      let usingConditionName='';
      let typeName='';
      switch (usingCondition) {
        //无门槛
        case 'UNCONDITIONAL':
          usingConditionName = `无门槛`;
        break;
          //满金额
        case 'AMOUNT' :
          usingConditionName = `满${data.minAmount}元`;
          break;
        //满几件
        case 'SUBSTANCE':
          usingConditionName = `满${data.minAmount}件`;
          break;
      };
      switch (type) {
        //元
        case 'REDUCE':
          typeName = `减${data.denomination}元`;
        break;
          //折
        case 'DISCOUNTS' :
           typeName = `打${data.denomination}折`;
          break;
        //实物
        case 'GIFT':
          typeName = `得${data.giftDescription}`;
          break;
      }
      return `${usingConditionName}${typeName}【可叠加】`;
    },
    //处理有效时间
    handleTopDesc(data){
      switch (data.validityType) {
        case 'COLLECTION':
          return `领取后${data.validityPeriod}天内`;
          break;
        case 'PERIOD':
          let startTime = timesTampConvertsDate(data.usingStartTime);
          let endTime = timesTampConvertsDate(data.usingEndTime);
          return  `${startTime}至${endTime}`;
          break;
        default:
          return '';
          break;
      }
    },
    //新增 跳转页面
    openAddcoupon() {
      this.$router.push({
        path: "/market/coupon/add_coupon",
        name: "add_coupon"
      });
    },
    //查看基本
    openShowDetails(id) {
      this.$router.push({
        path: "/market/coupon/show_coupon",
        name: "show_coupon",
        query: {
          couponId: id
        }
      });
    },
      //修改基本
      openEditDetails(id) {
        this.$router.push({
          path: "/market/coupon/edit_coupon",
          name: "edit_coupon",
          query: {
            couponId: id
          }
        });
      },
    //根据type 取得NAME
    getTypeName(type){
      let types= this.COUPON.type;
      let typeName='';
      for (let i = 0; i < types.length; i++) {
        if(type == types[i].code){
          typeName=types[i].name;
          break; 
        }
      };
      return typeName;
    },
    //显示隐藏
    handleIsShow(row) {
      let type = !row.show;
      this.$confirm(!!type ?'确认修改为“显示”吗？':'确认修改为“隐藏”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(({ value }) => {
           this.request(this.api.market.coupon_save, {
            show: type,
            id:row.id
          }).then(res => {
            this.$message.success('修改成功');
            row.show=type;
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });       
        });
    },
    //上下架
    handleIsValid(row) {
      let valid = !row.valid;
      this.$confirm(!!valid ?'确认修改为“上架”吗？':'修改为“下架”状态，客户已领取卡券将失效，确认操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(({ value }) => {
        this.request(this.api.market.coupon_save, {
          valid: valid,
          id:row.id
        }).then(res => {
          this.$message.success('修改成功');
          row.valid=valid;
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        });       
      });
    },
    //获取适用门店列表
    getStoreData() {
      this.request(this.api.retailStore.storeBasic_list4Feign, {
        valid: true
      }).then(res => {
        this.storeOptions = res.data;
      });
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
  },
  computed: {
    //卡券字典项集合
    COUPON() {
      let COUPONOBJ = {};
      let codeSet = this.$store.getters.codeData;
      //卡券类型
      if (codeSet.COUPON001) COUPONOBJ.type = codeSet.COUPON001.codeItemList;
      //卡券发放类型
      if (codeSet.COUPON002) COUPONOBJ.issueType = codeSet.COUPON002.codeItemList;
      //卡券使用渠道
      if (codeSet.COUPON003) COUPONOBJ.channel = codeSet.COUPON003.codeItemList;
      //卡券使用范围
      if (codeSet.COUPON004) COUPONOBJ.range = codeSet.COUPON004.codeItemList;
      //卡券使用条件
      if (codeSet.COUPON005) COUPONOBJ.usingCondition = codeSet.COUPON005.codeItemList;
      //卡券有效类型
      if (codeSet.COUPON006) COUPONOBJ.validityType = codeSet.COUPON006.codeItemList;
      return COUPONOBJ;
    }
  }
};
</script>
<style lang="less" scoped>
.em-hide {
  color: #ff9900;
}
.em-show {
  color: #00cc00;
}
.em-up-shelf {
  color: #00cc00;
}
.em-down-shelf {
  color: #ff0000;
}
</style>
