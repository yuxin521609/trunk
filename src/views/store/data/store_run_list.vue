<template>
  <div>
    <!-- 模糊搜索 -->
    <div class="item-margin">
      <el-form
              class="item-form"
              size="small"
              :inline="true"
              :model="filtersData">
        <el-form-item label="指标：">
          <el-select v-model="filtersData.dimension" filterable @change="getChartData" ref="dimension">
            <el-option v-for="(item, index) in dimensionality_list" :label="item.name" :key="index"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="筛选门店：">
          <el-select
                  v-model="filtersData.storeIdList"
                  clearable
                  filterable
                  :multiple-limit="3"
                  class="input-w-5"
                  @change="getChartData"
                  placeholder="请选择门店，最多可选择3个门店"
                  multiple>
            <el-option v-for="(item, index) in getStoreList_data.data" :label="item.name" :key="index"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </div>
    <!-- 模糊搜索 -->
    <!-- 门店会员 -->
    <div class="box">
      <!-- 图表筛选条件 -->
      <select-date @changeDate="changeDate" @selectChart="selectChart" :isMonthSelect="false"></select-date>
      <!-- echarts图表 -->
      <div v-show="chartType == 0">
        <div id="chart_example" class="mt-30"></div>
        <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
        <el-table
                style="width: 100%"
                :data="getChartData_list.storeVOList"
                stripe
                empty-text="暂无数据"
                header-row-class-name="item-table-header"
                :highlight-current-row="true">
          <el-table-column fixed="left" :show-overflow-tooltip="true" width="150" label="门店名称">
            <template slot-scope="scope">{{ scope.row.storeName|| '--' }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" fixed="left" label="指标" prop="dimension"></el-table-column>
          <el-table-column
                  :prop="'v'+index"
                  :label="item.date"
                  :show-overflow-tooltip="true"
                  :key="index"
                  v-for="(item, index) in dataList"
                  :formatter="tableFormatter"
          ></el-table-column>
        </el-table>
      </div>
      <div v-show="chartType == 1">
        <div id="chart_example2" class="mt-30"></div>
        <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
        <el-table
                style="width: 100%"
                :data="getChartData_list.storeVOListAll"
                stripe
                empty-text="暂无数据"
                header-row-class-name="item-table-header"
                :highlight-current-row="true">
          <el-table-column fixed="left" :show-overflow-tooltip="true" width="150" label="门店名称">
            <template slot-scope="scope">{{ scope.row.storeName|| '--' }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="指标" prop="dimension"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" :label="dataStartEnd" prop="sumData"
                           :formatter="tableFormatter"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 工单列表 -->
  </div>
</template>
<!-- 工单池 -->
<script>
  import {getToken} from '@/utils/auth'
  import codeSet from '@/components/codeSet'
  import treeDept from '@/components/treeDept'
  import selectDate from '../components/selectDate'
  // echarts/lib/chart/line
  import echarts from 'echarts';

  let token = getToken()

  export default {

    data() {
      return {
        colorList:  ['#2eddc1','#FCCE10','#E87C25','#277bbb','#E87fff','#277aaa','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
        myChart: null,
        myChart2: null,
        dataStartEnd: null,
        // 维度列表
        dimensionality_list: [{
          name: '销售收入',
          id: 0
        }, {
          name: '退货率',
          id: 1
        }, {
          name: '客单价',
          id: 2
        }, {
          name: '件单价',
          id: 3
        }, {
          name: '连带率',
          id: 4
        }],
        // data数据
        getChartData_list: {},
        chartType: 0,
        dataList: [],
        // 获取门店信列表
        getStoreList_data: [],
        filtersData: {
          "dimension": 0,
          "storeIdList": [],
          "beginTime": "",
          "endTime": "",
        },
        // 门店列表请求参数
        filtersDataStore: {
          pageIndex: '',// 当前页码
          pageSize: '',// 每页数量
          name: '',// 门店名称
          organizationId: '',// 隶属机构
          businessStatus: '',// 营业状态
          type: '',// 门店类型
          createBegin: '',// 创建时间开始
          createEnd: ''// 创建时间结束
        }
      }
    },
    mounted() {

    },
    created() {
      const that = this;

      this.getStoreList(); // 获取门店列表
    },
    methods: {
      // 表格过滤
      tableFormatter(row, column) {
        let val = row[column.property];
        if (this.filtersData.dimension == 1) {
          return val + '%'
        } else if(this.filtersData.dimension == 4) {
          return val
        }else {
          return '￥' + val
        }
      },
      // 图表hover显示数据初始
      chartTooltipInit(params){
        let html = '';
        if(params && params.length){
          html += params[0].axisValueLabel + '<br>';
          params.forEach(item => {
            html += "<span style=\"display:inline-block;width:10px;height: 10px;border-radius: 5px;margin-right: 10px;background:" + item.color + "\"></span>" + item.seriesName + " ："
            if (this.filtersData.dimension == 1) {
              html += item.value + '%'
            } else if(this.filtersData.dimension == 4) {
              html += item.value
            }else {
              html += '￥' + item.value
            }
            html += '<br>'
          })
        }
        return html
      },
      /**
       * 获取表格数据
       */
      getChartData() {
        let that = this;
        // 基于准备好的dom，初始化echarts实例
        this.$nextTick(() => {
          this.myChart = echarts.init(document.getElementById('chart_example'));
          this.request(
                  that.api.store.storeDataStatistics_getStoreManageDataAnalysis,
                  this.filtersData
          ).then(res => {
            // 指定图表的配置项和数据 ------------------
            var option = {
              color: this.colorList,
              tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: (params) => {
                  return this.chartTooltipInit(params)
                }
              },
              legend: {
                data: []
              },
              dataZoom: [
                {
                  type: 'slider',
                  show: true,
                  xAxisIndex: [0],
                  start: 0,
                  end: 100
                },
                {
                  type: 'inside',
                  xAxisIndex: [0],
                  start: 0,
                  end: 100
                }
              ],
              title: {
                textStyle: {
                  color: '#409EFF',
                },
                left: '45%'
              },
              xAxis: {
                data: []
              },
              yAxis: {
              },
              series: [{
                type: 'line',
                name: '全部门店',
                data: []
              }]
            };
            res.storeVOList.forEach((item, index) => {
              let dimensionItem = this.dimensionality_list.find(item => {
                return item.id == this.filtersData.dimension
              });
              item.dimension = dimensionItem.name;
              item.dataList.forEach((items, indexs) => {
                item['v' + indexs] = items.amount;
              })
            });
            if (res.storeVOList.length) {
              this.dataList = res.storeVOList[0].dataList;
            }
            if (res.allStoreData && res.allStoreData.length) {
              this.dataStartEnd = res.allStoreData[0].date + '-' + res.allStoreData[res.allStoreData.length - 1].date;
            }
            // 添加chart数据
            if (this.filtersData.storeIdList && this.filtersData.storeIdList.length) {
              var series = [];
              res.storeVOList.forEach((item, index) => {
                var data_list = [];
                option.legend.data.push(item.storeName);
                item.dataList.forEach((items, indexs) => {
                  data_list.push(items.amount)
                });
                series.push({
                  type: 'line',
                  name: item.storeName,
                  data: data_list
                });
              });
              if (res.storeVOList && res.storeVOList.length) {
                res.storeVOList[0].dataList.forEach((item, index) => {
                  option.xAxis.data.push(item.date);
                });
              }
              option.series = series;
            } else {
              res.allStoreData.forEach((item, index) => {
                option.xAxis.data.push(item.date);
                option.series[0].data.push(item.amount);
              });
            }
            // 添加汇总数据
            res.storeVOListAll = [{
              storeName: '全部门店',
              dimension: this.$refs.dimension.selectedLabel,
              sumData:res.allStoreSumAmount
            }]
            this.getChartData_list = res;
            // 使用刚指定的配置项和数据显示图表。
            this.myChart.clear();
            this.myChart.setOption(option);
            if (this.chartType == 1) {
              this.myChart2 = echarts.init(document.getElementById('chart_example2'));
              // 汇总图图表配置项，数据 ----------------------
              var option2 = {
                color: this.colorList,
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                  },
                  formatter: (params) => {
                    return this.chartTooltipInit(params)
                  }
                },
                dataZoom: [
                  {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    start: 0,
                    end: 50
                  },
                  {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 0,
                    end: 50
                  }
                ],
                xAxis: [
                  {
                    type: 'category',
                    data: [],
                    axisTick: {
                      alignWithLabel: true
                    }
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ],
                series: [
                  {
                    name: '汇总',
                    type: 'bar',
                    barMaxWidth: 30,
                    data: []
                  }
                ]
              };
              this.getChartData_list.storeVOList.forEach((item, index) => {
                option2.xAxis[0].data.push(item.storeName)
                option2.series[0].data.push(item.sumData)
              });
              this.myChart2.clear();
              this.myChart2.setOption(option2);
            }
          });
        });
      },
      /**
       * 改变日期
       */
      changeDate(chartUpDateArr) {
        this.filtersData.beginTime = chartUpDateArr[0];
        this.filtersData.endTime = chartUpDateArr[1];
        this.getChartData(); // 获取表格数据
        console.log(chartUpDateArr + '请求数据')

      },
      /**
       * 选择图表
       */
      selectChart(type) {
        this.chartType = type;
        console.log(type)
        this.$nextTick(() => {
          this.myChart2 = echarts.init(document.getElementById('chart_example2'));
          // 汇总图图表配置项，数据 ----------------------
          var option2 = {
            color: this.colorList,
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: (params) => {
                return this.chartTooltipInit(params)
              }
            },
            dataZoom: [
              {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 50
              },
              {
                type: 'inside',
                xAxisIndex: [0],
                start: 0,
                end: 50
              }
            ],
            xAxis: [
              {
                type: 'category',
                data: [],
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '汇总',
                type: 'bar',
                barMaxWidth: 30,
                data: []
              }
            ]
          };
          this.getChartData_list.storeVOList.forEach((item, index) => {
            option2.xAxis[0].data.push(item.storeName)
            option2.series[0].data.push(item.sumData)
          });
          this.myChart2.clear();
          this.myChart2.setOption(option2);

        })
      },
      // 点击页数
      handleCurrentChange(pageIndex) {
        this.filtersData.pageIndex = pageIndex;
        this.getList();
      },
      // 点击每页多少条数
      handleSizeChange(pageSize) {
        this.filtersData.pageSize = pageSize;
      },
      //导出
      exportExcel() {
        require.ensure([], () => {
          let {export_json_to_excel, export_table_to_excel} = require("@/vendor/Export2Excel");
          let tHeader = ["门店名称", "指标"];
          // 上面设置Excel的表格第一行的标题
          let filterVal = ["storeName", "dimension"];
          // 把data里的tableData存到list
          let list;
          if(this.chartType == 0){
            list = this.getChartData_list.storeVOList;
            this.dataList.forEach((item, index) => {
              tHeader.push(item.date);
              filterVal.push('v' + index)
            })
          }
          if(this.chartType == 1){
            list = this.getChartData_list.storeVOListAll;
            tHeader.push(this.dataStartEnd);
            filterVal.push("sumData")
          }
          let data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "门店经营数据分析");
        });
      },
      formatJson(filterVal, jsonData) {
        console.log(jsonData)
        return jsonData.map(v => filterVal.map(j => v[j]));
      },
      /**
       * 查询门店列表
       */
      getStoreList() {
        const that = this;

        this.request(
                that.api.store.storeBasic_list,
                this.filtersDataStore
        ).then(res => {
          that.getStoreList_data = res;
        });
      },
      /**
       * 跳转工单详情
       */
      href(routeName, param) {
        this.$router.push({
          path: '/' + routeName,
          name: routeName,
          query: param
        })
      },
      /**
       * 模糊搜索
       */
      handleSearch() {
        this.filtersData.pageIndex = 1;
        this.getChartData();
      },
      /**
       * 搜索重置
       */
      handleResetFilters() {
        Object.assign(this.filtersData, {
          "dimension": 0,
          "storeIdList": [],
          "beginTime": "",
          "endTime": "",
        });
      },
    },
    components: {
      codeSet,
      treeDept,
      selectDate
    }
  }
</script>
<style lang="less" scoped>
  #chart_example, #chart_example2 {
    // width: 50%;
    height: 500px;
    margin: 30px auto;
  }

  .box {
    padding: 20px;
    margin: 8px;
    background: #fff;
  }

  .blueness {
    color: #1E90FF;
  }

  .warningType {
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    background: red;
    color: #fff;
    font-size: 12px;
    border-radius: 4px;
    margin-left: 10px;
    text-align: center;
  }

  .color {
    background: #FF6347;
  }

  h5 {
    color: #222;
    margin-left: -15px;
  }

  .test {
    color: #9d9d9d;
  }
</style>
