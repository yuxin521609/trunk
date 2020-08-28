<!-- 工单池 -->
<template>
  <div>
    <div class="item-margin">
      <div class="booking_top">
        <!-- 工单基本信息 -->
        <div class="overstrikings">盘点信息</div>
        <div class="user">
          <ul class="info-list">
            <li>盘点门店：{{ get_data.storeName || '--' }}</li>
            <li>隶属机构：{{ get_data.organization || '--' }}</li>
            <li>盘点单号：{{ get_data.checkOrderNum || '--' }}</li>
            <li>盘点时间：{{ get_data.startTime | timestampToTime }}</li>
            <li>是否确定：{{ get_data.checkOrderStatus ? '是' : '否' }}</li>
          </ul>
        </div>
        <div class="overstrikings mt-20">盘点商品</div>
        <el-table
          class="mt-20"
          :data="get_goods_data.data"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true">
          <el-table-column align="left" label="商品款号" min-width="130">
            <template  slot-scope="scope">{{ scope.row.productCode || '--' }}</template>
          </el-table-column>
           <el-table-column align="left" label="商品货号" min-width="130">
            <template  slot-scope="scope">{{ scope.row.goodsCode || '--' }}</template>
          </el-table-column>
          <el-table-column align="left" label="商品图片" min-width="130">
            <template  slot-scope="scope">
              <img :src="scope.row.image" alt="" class="tabImg">
            </template>
          </el-table-column>
          <el-table-column align="left" label="品牌" min-width="130">
            <template  slot-scope="scope">{{ scope.row.brandName || '--' }}</template>
          </el-table-column>
          <el-table-column align="left" label="系统数量" min-width="130">
            <template  slot-scope="scope">{{ scope.row.systemQuantity }}</template>
          </el-table-column>
          <el-table-column align="left" label="盘点数量" min-width="130">
            <template  slot-scope="scope">{{ scope.row.checkQuantity || '--' }}</template>
          </el-table-column>
          <el-table-column align="left" label="差异量" min-width="130">
            <template  slot-scope="scope">{{ scope.row.differenceQuantity  }}</template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-10 mb-20">
          <!-- 分页 -->
          <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersData.pageIndex"
            :page-sizes="[10,20,30,40,50]"
            :page-size="filtersData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="get_goods_data.totalCount"
          ></el-pagination>
        </div>
      </div>
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
  import { mapGetters } from 'vuex';
  import * as userTypes from "@/types/userConfig";
  let token = getToken();

  export default {
    data() {
      return {
         // 商品信息是否显示
        isConsumer:false,
        // 数据对象
        get_data:{},
        get_goods_data:{},
        // 检索
        filtersData:{
          pageIndex: 1,// 当前页码
          pageSize: 10,// 每页数量
          orderId:this.$route.query.id
        },
        workOrderLog_list:{},
        tableItemGetListMapObj:{},
        active: 3
      };
    },
    created() {
      this.getOrderDetail(this.$route.query.id);
      this.getOrderGoodsDetail();
    },
    methods: {
      /**
       * 获取详情基本信息
       */
      getOrderDetail(id) {
        const that = this;

        this.request(
          that.api.store.checkStockOrder_getMainInfoForOrderCenter,
          {
            orderId:id
          }
        ).then(res => {
          this.get_data = res;
        });
      },
      /**
       * 获取详情商品信息
       */
      getOrderGoodsDetail() {
        const that = this;

        this.request(
          that.api.store.checkStockResultProduct_getProductInfoForOrderCenter,
          this.filtersData
        ).then(res => {
          this.get_goods_data = res;
        });
      },
      /**
      * 提示
      */
      warn(message, type) {
        this.$message({
          message: message,
          type: type || 'warning'
        });
      },
      /**
       * 点击页数
       * @param { Number } pageIndex 当前页
       */
      handleCurrentChange(pageIndex){
         this.filtersData.pageIndex = pageIndex;
         this.getOrderGoodsDetail();
      },
      /**
       *  选择每页多少条数
       *  @param { Number } pageSize 每页条数
       */
      handleSizeChange(pageSize){
         this.filtersData.pageSize = pageSize;
         this.getOrderGoodsDetail();
      },
    },
    computed: {
      ...mapGetters({
        userInfo: userTypes.GETTER_USERINFO
      })
    },
    components: {
      codeSet,
      treeDept
    }
  }
</script>
<style  lang="less" scoped>
.goodsLit{
   margin: 8px;
   padding: 20px;
   background: #fff;
}
.tabImg{
   width: 50px;
   height: 50px;
}
.right{
    align-self:flex-end; // 垂直居下样式设置
    margin: 0 30px 20px 0;
  }
  .order-record{
    height: 700px;
    overflow-y: scroll;
  }
  h5 {
    color: #222;
    margin-left: -15px;
  }
  .order-course{
    font-size: 16px;
  }
  .test {
    color: #9d9d9d;
  }
  .work-order-info {
    display: flex;
    justify-content: space-between;
  }
  .booking_top{
    background: #fff;
    padding: 20px;
    .overstrikings{
      font-weight: bold;
      color: #000;
    }
  }
  .user{
    display: flex;
    // align-items:center;
  }
  .userInfo{
    padding: 20px 30px 30px 30px;
    .userInfo-img{
      display: block;
      width: 50px;
      height: 50px;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50px;
      }
    }
  }
  .examine{
    align-self:flex-end;
  }
  .info-list {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    li {
      width: 24%;
      padding-bottom: 15px;
      text-indent: 30px;
    }
  }
  .jdbcType-image{
    width: 35px;
    height: 35px;
  }
  .the-results{
    width: 1400px;
    display: flex;
    text-align: right;
    flex-wrap: wrap;
    .the-results-span{
      width: 350px;
    }
  }
  .the-results-three-rows{
    width: 1050px;
  }
  .text-indent15{
    text-indent: 15px;
  }
  .text-indent45{
    text-indent: 45px;
  }
    .text-indent75{
    text-indent: 75px;
  }
  .color243{
    color:rgb(243, 131, 3);
  }
.spu {
  li {
    div{
      display: flex;
      border-bottom: 1px solid #f0f0f0;
      span {
        height: 50px;
        flex: 1;
        line-height: 50px;
        position: relative;
        text-align: center;
      }
      .text-left{
        text-align: left;
      }
      img {
        width: 40px;
        height: 40px;
      }
    }
    .spu-border {
      border-bottom: 1px solid rgb(243, 131, 3);
    }
  }
}
  .display-flex{
    display: flex;
  }
  .subImg{
    width: 35px;
    height: 35px;
  }
  .correlationData-p{
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  h5 {
    color: #222;
    margin-left: -30px;
  }
  .s{
    margin-top:10px;
    display:block;
    font-size:15px;
  }
  .test {
    color: #9d9d9d;
  }
  .work-order-info {
    display: flex;
    justify-content: space-between;
  }
  .correlationData{
    height: 300px;
    overflow-y:scroll;
    padding:0 15px 15px 15px;
      h3{
        font-size: 16px;
        padding: 15px 0;
      }
      ul{
        display: flex;
        flex-wrap:wrap;
        li{
          width: 20%;
          text-indent: 20px;
          padding: 5px 0;
        }
        img{
          width: 120px;
          height: 150px;
        }
        span{
          display: block;
          margin-top: 10px;
        }
      }
  }
</style>
