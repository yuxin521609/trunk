<template>
  <div class="content">
    <div class="title">
      <label>到货检验记录报告</label>
    </div>
    <div class="base-msg">
      <label>基本信息</label>
      <div class="base-span">
        <span>到货单号：879789789879</span>
        <span>到货日期：2019年06月20日</span>
        <span>供应商：某某供应商</span>
        <span>物流名称：德邦物流</span>
        <span>物流单号：979789898080808</span>
      </div>
    </div>
    <div class="base-msg">
      <label>收货信息</label>
      <div class="base-span">
        <span>外包检查：良好</span>
        <span>包装情况：良好</span>
        <span>签收情况：正常</span>
        <span>到货包数：6</span>
        <span>到货总件数：300</span>
      </div>
    </div>
    <div class="base-msg">
      <label>质检信息：</label>
      <div class="report-table">
        <el-table
          :data="tableData"
          :summary-method="getSummaries"
          show-summary
          header-row-class-name="item-table-header"
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="id" label="商品款号" width="180"></el-table-column>
          <el-table-column prop="name" label="商品货号"></el-table-column>
          <el-table-column prop="amount1" label="商品图片"></el-table-column>
          <el-table-column prop="amount2" label="商品名称"></el-table-column>
          <el-table-column prop="amount3" label="质检数量"></el-table-column>
          <el-table-column prop="amount3" label="合格数量"></el-table-column>
          <el-table-column prop="amount3" label="不合格数量"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="base-msg">
      <label>具体不合格品明细：</label>
      <div class="report-table">
        <el-table
          :data="tableData"
          :summary-method="getSummaries"
          show-summary
          header-row-class-name="item-table-header"
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="id" label="商品款号" width="180"></el-table-column>
          <el-table-column prop="name" label="商品货号"></el-table-column>
          <el-table-column prop="amount1" label="商品图片"></el-table-column>
          <el-table-column prop="amount2" label="商品名称"></el-table-column>
          <el-table-column prop="amount3" label="残损类别"></el-table-column>
          <el-table-column prop="amount3" label="严重(C类)数量"></el-table-column>
          <el-table-column prop="amount3" label="轻微(B类)数量"></el-table-column>
          <el-table-column prop="amount3" label="不良简述"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="base-msg">
      <label>质检建议：不合格返还厂</label>
    </div>
    <div class="base-msg">
      <label>检验员：火眼金睛的张三</label>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return  {
           tableData: [{
          id: '12987122',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        }, {
          id: '12987123',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        }, {
          id: '12987124',
          name: '王小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        }, {
          id: '12987125',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        }, {
          id: '12987126',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        }]
        }
    },
    methods:{
        getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += ' 元';
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums;
      }
    }
    }
</script>

<style lang="less" scoped>
.content {
  background-color: #fff;
  margin: 10px;
  padding-bottom: 100px;
  .title {
    width: 100%;
    text-align: center;
    font-size: 30px;
    color: #222;
    font-weight: 700;
  }
  .base-msg {
    margin-top: 20px;
    margin-left: 10px;
    label {
      font-weight: 700;
      color: #222;
    }
    .base-span {
      margin-top: 10px;
      display: flex;
      span {
        margin-right: 100px;
        width: 263px;
      }
    }
  }
}
</style>

