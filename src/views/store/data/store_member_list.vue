<style lang="less" scoped>
  .goods-inventory-list{
    .chart-list {height: 400px;padding-top: 20px;
      .chart-bar {width: 60%;height: 100%;float: left;}
      .chart-pig {width: 40%;height: 100%;float: left;}
      .input-w-2 {width: 300px;}
    }
    .time-check{position: relative;}
  }
</style>
<template>
  <div class="goods-inventory-list">
    <div class="item-margin">
      <el-form class="item-form" :model="formData" label-width="90px" size="small" ref="formData" inline>
        <el-form-item label="指标：" prop="dimension">
          <el-select placeholder="请选择" class="input-w" v-model="formData.dimension" ref="dimension" @change="getChartData">
            <el-option v-for="item in goodsType" :key="item.status" :label="item.name" :value="item.status"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="筛选门店：" prop="storeIdList">
          <el-select placeholder="请选择" class="input-w-5" v-model="formData.storeIdList" filterable clearable multiple
                     :multiple-limit="3"  @change="getChartData">
            <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-button @click="getChartData" type="primary" plain>搜索</el-button>-->
<!--        </el-form-item>-->
      </el-form>
    </div>
    <div class="item-margin item-cont">
      <select-date @changeDate="changeDate" @selectChart="selectChart" :isMonthSelect="true"></select-date>
      <div class="chart-list clearfix">
        <div class="chart-bar" ref="chartBar"></div>
        <div class="chart-pig" ref="chartPie" v-show="formData.dimension != 5"></div>
      </div>
    </div>
    <div class="item-margin item-cont">
      <div>
        <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" row-key="id" id="table-data">
        <el-table-column prop="storeName" label="门店名称" :show-overflow-tooltip="true" fixed="left"></el-table-column>
        <el-table-column prop="dimension" label="指标" :show-overflow-tooltip="true" fixed="left"></el-table-column>
        <el-table-column :prop="item.prop" :label="item.name" :show-overflow-tooltip="true" v-for="(item, index) in tableThList" :key="item.prop"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import selectDate from '../components/selectDate';
  // 引入基本模板
  let eCharts = require('echarts/lib/echarts');
  // 引入柱状图组件
  require('echarts/lib/chart/bar');
  // 引入饼状图图组件
  require('echarts/lib/chart/pie');
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  // 引入legend组件
  require("echarts/lib/component/legend");
  require("echarts/lib/component/dataZoom");
  export default {
    name: '',
    // 数据
    data() {
      return {
        colorList:  ['#2eddc1','#FCCE10','#E87C25','#277bbb','#E87fff','#277aaa','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
        // 图表类型 0 分布图 1 汇总图
        chartType: 0,
        // 参数
        formData: {
          dimension: 1,
          storeIdList: [],
          startTime: '',
          endTime: '',
          productType: ''
        },
        // 动态表格
        tableThList: [],
        // 门店列表
        storeList: [],
        // 表格数据
        tableData: [],
        // 商品类型
        goodsType: [
          {status: 1, name: '商品品类'},
          {status: 2, name: '商品颜色'},
          {status: 3, name: '商品尺码'},
          {status: 4, name: '商品价格'},
          {status: 5, name: '商品品牌'}
        ],
        goodsTypeParams: {
          1: 'productType',
          2: 'color',
          3: 'size',
          4: 'priceRange',
          5: 'brandName'
        },
        // 柱状图dom
        chartBar: {
          dom: null,
          checked: null,
          legendData: null,
          xData: null,
          seriesList: null
        },
        // 是否是本月
        isThisMonth: false
      }
    },
    // 组件
    components: {
      selectDate
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        // 柱状图准备
        this.chartBarBefore();
        // 获取门店
        this.getStoreList();
      })
    },
    // 方法
    methods: {
      // 导出
      exportExcel() {
        require.ensure([], () => {
          let {export_json_to_excel} = require("@/vendor/Export2Excel");
          let tHeader = [
            "门店名称",
            "指标",
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "storeName",
            "dimension"
          ];
          this.tableThList.forEach(item => {
            tHeader.push(item.name);
            filterVal.push(item.prop)
          });
          // 上面的index、nickName、name是tableData里对象的属性
          let list = this.tableData; //把data里的tableData存到list
          let data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "存货商品结构分析");
        });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      },
      // 获取门店数据
      getStoreList() {
        this.request(this.api.store.storeBasic_list, {}).then(data => {
          this.storeList = data.data;
        });
      },
      // 改变日期
      changeDate(val) {
        if(!val) return;
        this.formData.startTime = val[0];
        this.formData.endTime = val[1];
        let date = new Date();
        let year = date.getFullYear();
        let mouth = date.getMonth();
        let thisDate = new Date(val[0]);
        let thisYear = thisDate.getFullYear();
        let thisMouth = thisDate.getMonth();
        console.log(year,mouth)
        console.log(thisYear,thisMouth)
        if(year === thisYear && mouth === thisMouth){
          this.isThisMonth = true
        }else{
          this.isThisMonth = false
        }
        // 获取数据
        this.getChartData();
      },
      // 图类型切换
      selectChart(val) {
        if(!val && val !== 0) return;
        this.chartType = val;
        // 获取数据
        this.getChartData();
      },
      // 获取数据
      getChartData() {
        this.chartBar.checked = null;
        this.chartBar.xData = null;
        this.chartBar.seriesList = null;
        this.chartBar.legendData = null;
        this.tableThList = [];
        this.formData.productType = '';
        if(this.chartType === 0){
          this.getStoreDataStatisticsStockDetailed().then(data => {
            this.tableData = data.data;
            this.tableThList = data.tableThList;
            if(this.formData.storeIdList.length > 0){
              this.chartBarInit(data.xData, data.seriesList, data.legendData)
            }
          });
          this.getStoreDataStatisticsStockSummary().then(data => {
            this.chartPieInit(data.pieData);
            if(this.formData.storeIdList.length === 0){
              this.chartBarInit(data.xData, data.seriesList, []);
            }
          });
        }
        if(this.chartType === 1){
          this.getStoreDataStatisticsStockSummary().then(data => {
            console.log(data)
            this.tableData = data.data;
            this.tableThList = data.tableThList;
            this.chartPieInit(data.pieData);
            this.chartBarInit(data.xData, data.seriesList, []);
          });
        }
      },
      // 查询存货商品明细数据统计
      getStoreDataStatisticsStockDetailed() {
        return new Promise((resolve, reject) => {
          let urlConfig = this.api.store.historyStoreProduct_stockDetailed;
          if(this.isThisMonth){
            urlConfig = this.api.store.storeDataStatistics_stockDetailed
          }
          this.request(urlConfig, this.formData).then(data => {
            // 表格th
            let tableThList = [];
            // x轴数据
            let xData = [];
            // series数据
            let seriesList = [];
            // legend数据
            let legendData = [];
            if(data && data.length){
              data.forEach((store, storeIndex) => {
                store.dimension = this.$refs.dimension.selectedLabel;
                legendData.push(store.storeName)
                if(store.infoList && store.infoList.length){
                  if(this.goodsTypeParams[this.formData.dimension] === 'priceRange'){
                    store.infoList.sort((x, y) => {
                      return x.priceRange - y.priceRange
                    })
                  }
                  let ary = [];
                  store.infoList.forEach((info, infoIndex) => {
                    if(storeIndex === 0){
                      let name = this.priceNameInit(info[this.goodsTypeParams[this.formData.dimension]]);
                      xData.push(name);
                      tableThList.push({
                        name: name,
                        prop: 'value' + infoIndex
                      })
                    }
                    store['value' + infoIndex] = info.quantity;
                    ary.push(info.quantity)
                  });
                  seriesList.push({
                    name: store.storeName,
                    type: 'bar',
                    barMaxWidth: 30,
                    itemStyle: {
                      color: (params) => {
                        if(this.chartBar.checked === params.dataIndex + '' + params.seriesIndex){
                          return 'red'
                        }else {
                          return this.colorList[params.seriesIndex]
                        }
                      },
                    },
                    data: ary
                  })
                }
              });
            }
            resolve({
              data,
              legendData,
              xData,
              seriesList,
              tableThList
            })
          });
        })
      },
      // 查询存货商品汇总数据统计
      getStoreDataStatisticsStockSummary() {
        return new Promise((resolve, reject) => {
          let urlConfig = this.api.store.historyStoreProduct_stockSummary;
          if(this.isThisMonth){
            urlConfig = this.api.store.storeDataStatistics_stockSummary
          }
          this.request(urlConfig, this.formData).then(data => {
            // 表格th
            let tableThList = [];
            let xData = [];
            let tableItem = {
              storeName: '全部门店',
              dimension: this.$refs.dimension.selectedLabel
            };
            let seriesList = [];
            let pieData = [];
            let ary = [];
            if(data && data.length){
              if(this.goodsTypeParams[this.formData.dimension] === 'priceRange'){
                data.sort((x, y) => {
                  return x.priceRange - y.priceRange
                })
              }
              data.forEach((item, index) => {
                ary.push(item.quantity);
                tableItem['value' + index] = item.quantity;
                let name = this.priceNameInit(item[this.goodsTypeParams[this.formData.dimension]]);
                pieData.push({
                  value: item.quantity,
                  name: name
                });
                xData.push(name);
                tableThList.push({
                  name: name,
                  prop: 'value' + index
                })
              });
              seriesList.push({
                name: '',
                type: 'bar',
                barMaxWidth: 30,
                itemStyle: {
                  color: (params) => {
                    if(this.chartBar.checked === params.dataIndex + '' + params.seriesIndex){
                      return 'red'
                    }else {
                      return this.colorList[params.seriesIndex]
                    }
                  },
                },
                data: ary
              });
            }
            resolve({
              data: [tableItem],
              xData,
              seriesList,
              pieData,
              tableThList
            })
          });
        });
      },
      // 根据商品类型统计分类明细
      getStoreDataStatisticsStockCategoryDetailed(urlConfig, storeName) {
        let params = {};
        if(storeName){
          let store = this.storeList.find(item => {
            return item.name === storeName
          });
          params = JSON.parse(JSON.stringify(this.formData));
          params.storeIdList = [store.id]
        }else{
          params = this.formData
        }
        this.request(urlConfig, params).then(data => {
          let pieData = [];
          if(data && data.length){
            data.forEach( item => {
              let name = this.priceNameInit(item[this.goodsTypeParams[this.formData.dimension]]);
              pieData.push({
                name: name,
                value: item.quantity
              })
            })
          }
          this.chartPieInit(pieData);
        });
      },
      // 初始价格区间
      priceNameInit(name){
        let newName;
        if(this.goodsTypeParams[this.formData.dimension] === 'priceRange'){
          switch(name) {
            case '499':
              newName = '0-499';
              break;
            case '999':
              newName = '500-999';
              break;
            case '1499':
              newName = '1000-1499';
              break;
            case '1999':
              newName = '1500-1999';
              break;
            case '2999':
              newName = '2000-2999';
              break;
            case '3000':
              newName = '3000及以上';
              break;
            default:
              newName = name
          }
        }else {
          newName = name
        }
        return newName
      },
      // 因echarts 重复渲染click事件重复添加 暂时解决 先获取dom添加click事件
      chartBarBefore(){
        this.chartBar.dom = eCharts.init(this.$refs.chartBar);
        this.chartBar.dom.on('click',params => {
          if(this.formData.dimension === 3 || this.formData.dimension === 4) return;
          let storeName = params.seriesName;
          this.chartBar.checked = params.dataIndex + '' + params.seriesIndex;
          this.chartBarInit(this.chartBar.xData, this.chartBar.seriesList, this.chartBar.legendData);
          if(this.formData.dimension === 1){
            this.formData.productType = params.name;
            let urlConfig = this.api.store.historyStoreProduct_stockCategoryDetailed;
            if(this.isThisMonth){
              urlConfig = this.api.store.storeDataStatistics_stockCategoryDetailed
            }
            this.getStoreDataStatisticsStockCategoryDetailed(urlConfig, storeName)
          }
          if(this.formData.dimension === 2){
            this.formData.color = params.name;
            let urlConfig = this.api.store.historyStoreProduct_stockColorSeriesDetailed;
            if(this.isThisMonth){
              urlConfig = this.api.store.storeDataStatistics_stockColorSeriesDetailed
            }
            this.getStoreDataStatisticsStockCategoryDetailed(urlConfig, storeName)
          }
        });
      },
      /**
       * 门店信息柱状图显示
       * @param xData   x轴data
       * @param seriesList series数据
       * @param legendData legend数据
       */
      chartBarInit(xData, seriesList, legendData) {
        this.chartBar.xData = xData;
        this.chartBar.legendData = legendData;
        this.chartBar.seriesList = seriesList;
        let option = {
          animation: false,
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
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
          legend: {
            data: legendData
          },
          grid: {
            top: '6%',
            left: '3%',
            right: '4%',
            bottom: '12%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              // 坐标轴轴线相关设置
              axisLine: {
                lineStyle: {
                  color: '#dcdfe6'
                }
              },
              // 坐标轴刻度相关设置
              axisTick: {
                show: false
              },
              // 坐标轴在 grid 区域中的分隔线
              splitLine: {
                show: false
              },
              // 坐标轴刻度标签的相关设置
              axisLabel: {
                show: true,
                color: '#555'
              },
              data: xData
            }
          ],
          yAxis: [
            {
              type: 'value',
              // 坐标轴轴线相关设置
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#dcdfe6'
                }
              },
              // 坐标轴刻度相关设置
              axisTick: {
                show: false
              },
              // 坐标轴在 grid 区域中的分隔线
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'solid'
                }
              },
              // 坐标轴刻度标签的相关设置
              axisLabel: {
                show: true,
                color: '#555'
              },
            }
          ],
          series: seriesList
        };
        this.chartBar.dom.clear();
        this.chartBar.dom.setOption(option);
      },
      /**
       * 门店信息饼状图显示
       * @param data 显示数据
       */
      chartPieInit(data) {
        let chartPie = eCharts.init(this.$refs.chartPie);
        let option = {
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: data,
              label: {
                formatter: '{b}: {d}%'
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ],
          color: this.colorList
        };
        chartPie.clear();
        chartPie.setOption(option);
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
