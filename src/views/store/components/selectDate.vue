<template>
  <div class="chart-filters">
    <!-- 时间筛选 -->
    <div>
      <span
        :class="{'filters-check':checkDate_index == index}"
        :key="index"
        v-for="(item, index) in isMonthSelect ? filtersDates_list : filtersDate_list"
        @click="handleFiltersDate(index, item.type)"
        >{{ item.name }}
      </span>
      <span>
        <!-- 按日筛选 -->
        <template v-if="!isMonthSelect">
            <div class="block">
              <span class="demonstration">时间筛选：</span>
              <el-date-picker
                  size="mini"
                  v-model="value"
                  @change="selectDate"
                  @focus="selectDateFocus"
                  type="daterange"
                  range-separator="至"
                  value-format=""
                  start-placeholder="开始日期"
                  :picker-options="pickerOptions"
                  end-placeholder="结束日期">
              </el-date-picker>
            </div>
        </template>
        <!-- 按月筛选 -->
        <template v-else>
          <div class="block">
            <span class="demonstration">时间筛选：</span>
            <el-date-picker
              v-model="value"
              size="mini"
              @change="selectDate"
              type="month"
              placeholder="选择月">
            </el-date-picker>
          </div>
        </template>
      </span>
    </div>
    <!-- 图表筛选 -->
    <div class="chart-classify">
        <span
          :class="{'chart-classify-check':checkChart_index == index}"
          :key="index"
          v-for="(item, index) in filtersChart_list"
          @click="handleFiltersChart(index, item.type)"
        >{{ item.name }}</span>
    </div>
  </div>
</template>
<script>

import { getToken } from "@/utils/auth";
let token = getToken();
let timeOptionRange = null;
export default {
  props: {
    // 是否按照月份筛选
    isMonthSelect:[Boolean],
  },
  data() {
    return {
      value:'',
      minDate: '',
      maxDate: '',
      // this.nowNum == 1时不包含当前日期， this.nowNum == 0时包含当前日期
      nowNum: 0,
      pickerOptions:{
        onPick: ({ maxDate, minDate }) => {
          this.maxDate = maxDate;
          this.minDate = minDate;
        },
        disabledDate: (date) => {
          let maxDate = this.maxDate;
          let minDate = this.minDate;

          let endTime = '';
          if (minDate) {
            let val = Date.now() - (new Date(this.minDate).valueOf() + 31 * 24 * 60 * 60 * 1000);
            if (val < 0) {
              endTime = Date.now() - this.nowNum * 24 * 60 * 60 * 1000;
            } else {
              endTime = (new Date(this.minDate).valueOf() + 31 * 24 * 60 * 60 * 1000);
            }
            if (minDate && maxDate) {
              return date && (date.valueOf() > endTime)
            }
            return date && (date.valueOf() > endTime || date.valueOf() < minDate.valueOf() - 31 * 24 * 60 * 60 * 1000)
          } else {
            return date && (date.valueOf() > Date.now() - this.nowNum * 24 * 60 * 60 * 1000)
          }
        },
      },
      // 选中筛选日期下标
      checkDate_index:0,
      // 选中筛选图表下标
      checkChart_index:0,
      // 筛选日期列表
      filtersDate_list:[
        {
          name:'今日',
          type:'1'
        },{
          name:'近7日',
          type:'7'
        },{
          name:'近30日',
          type:'30'
        },{
          name:'本月',
          type:'current'
        }],
      // 筛选日期列表
      filtersDates_list:[
        {
          name:'本月',
          type:'current'
        },{
          name:'上月',
          type:'s'
        },{
          name:'上上月',
          type:'ss'
        }
      ],
      // 筛选图表列表
      filtersChart_list:[
        {
          name:'趋势图',
          type:0
        },{
          name:'汇总图',
          type:1
        }
      ]
    };
  },
  created() {
    // 按月筛选从本月开始，具体期限从近30天开始
    var type = this.isMonthSelect ? 'current' : '1';
    this.$emit('changeDate',this.initDate(type));
  },
  mounted(){

  },
  watch: {

  },
  methods: {
    /**
     * 日期筛选时
     */
    selectDate(dateArr) {
      if(!dateArr){
        this.minDate = '';
        this.maxDate = '';
        return;
      }
      // 重置日期选择下标
      if(dateArr instanceof Array) {
        this.checkDate_index = null;
        // this.$emit('clickDate',dateArr);
        this.$emit('changeDate',dateArr);
      }else{
        var oDate = new Date(dateArr);
        var resultDate = new Date(oDate.setMonth(oDate.getMonth() + 1,0));
        this.checkDate_index = null;
        // this.$emit('clickDate',[dateArr,resultDate]);
        this.$emit('changeDate',[dateArr,resultDate]);
      };
    },
    /**
     * 获取焦点
     */
    selectDateFocus() {
      this.minDate = '';
      this.maxDate = '';
    },
     /**
     * 选择筛选日期
     */
    handleFiltersDate(index, type) {
        this.checkDate_index = index;

        // this.$emit('clickDate',this.initDate(type));
        this.$emit('changeDate',this.initDate(type));
        this.value = '';
    },
    /**
     * 选择筛选图表
     */
    handleFiltersChart(index, type) {
        this.checkChart_index = index;
        this.$emit('selectChart', type);
    },
    /**
     * 格式化日期
     * @param { String } type 日期类型
     */
    initDate(type) {
      // 获取日期对象
      var oDate = new Date();
      // 将时间设置为00点00分00秒
      var currentDate = new Date(oDate.toLocaleDateString());
      // 集合
      var dateArr = [];

      switch(type) {
        // 今日
        case '1':
          dateArr = [currentDate, currentDate];
        break;
        // 近7日
        case '7':
          var oDate = new Date();
          // 获取7天前日期 如：13
          var date = oDate.getDate()-6;
          // 获取7天前GMT格式日期
          var disDate = new Date(oDate.setDate(date));
          // 将时间设置为00点00分00秒
          var resultDate = new Date(disDate.toLocaleDateString());

          dateArr = [resultDate, currentDate];
        break;
        // 近30日
        case '30':
          var oDate = new Date();
          // 获取30天前日期 如：30
          var date = oDate.getDate()-29;
          // 获取30天前GMT格式日期
          var disDate = new Date(oDate.setDate(date));
          // 将时间设置为00点00分00秒
          var resultDate = new Date(disDate.toLocaleDateString());

          dateArr = [resultDate, currentDate];
        break;
        // 本月
        case 'current':
          var oDate = new Date();
          // 获取本月1号GMT格式日期
          var disDate = new Date(oDate.setDate(1));
          // 将时间设置为00点00分00秒
          var resultDate = new Date(disDate.toLocaleDateString());

          dateArr = [resultDate, currentDate];
        break;
        // 上月
        case 's':
          var oDate = new Date();
          // 获取上个月月份
          var getMonth = oDate.getMonth()-1;
          // 将日期设置为1号
          oDate.setMonth(getMonth, 1);
          // 获取上个月1号日期
          var startDate = new Date(oDate.toLocaleDateString());
          // 重置日期对象
          var oDate = new Date();
          // 获取上个月最后一天
          var getDate = new Date(oDate.setDate(0)).getDate();
          // 将日期设置为最后一天
          oDate.setMonth(getMonth, getDate);
          // 获取上个月最后一天日期
          var endDate = new Date(oDate.toLocaleDateString());

          dateArr = [startDate, endDate];
        break;
        // 上上月
        case 'ss':
          var oDate = new Date();
          // 获取上个月月份
          var getMon = oDate.getMonth()-1;
          // 获取上上个月月份
          var getMonth = oDate.getMonth()-2;
          // 将日期设置为1号
          oDate.setMonth(getMonth, 1);
          // 获取上上个月1号日期
          var startDate = new Date(oDate.toLocaleDateString());
          // 重置日期对象
          var oDate = new Date();
          // 获取上上个月最后一天
          var getDate = new Date(oDate.setMonth(getMon, 0)).getDate();
          // 将日期设置为最后一天
          oDate.setMonth(getMonth, getDate);
          // 获取上个月最后一天日期
          var endDate = new Date(oDate.toLocaleDateString());

          dateArr = [startDate, endDate];
        break;
      };
      return dateArr;
    }
  }
};
</script>

<style lang="less" scoped>
 // 图表筛选条件
  .chart-filters{
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
  .chart-classify span{
    padding: 5px 10px;
    margin:0 10px;
    font-weight: bold;
    font-size: 15px;
  }
  .chart-classify .chart-classify-check{
    color: #409EFF;
  }
  span{
    padding: 5px 10px;
    margin:0 10px;
    display: inline-block;
    text-align: center;
  }
  .filters-check{
    background: #f1f1f1;
    color: #409EFF;
    border-radius: 5px;
    font-weight: 400;
  }
</style>

