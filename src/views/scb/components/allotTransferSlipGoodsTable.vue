<style lang="less" scoped>
  .goods-table{
    .pagination{margin-top: 20px;}
    .item-cont{
      .btns{float: right;}
    }
    .text-info{
      li{line-height: 32px;margin-bottom: 18px;
        .discount-remarks{padding-left: 72px;margin-bottom: 30px;}
      }
    }
  }
  .goods-table .txt-red /deep/ .el-input__inner{color: red;}
</style>
<template>
  <div class="goods-table">
    <el-table :data="showTableData" style="width: 100%">
      <el-table-column prop="productCode" label="商品款号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="goodsCode" label="商品货号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="goodsName" label="名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <image-popover :img-src="scope.row.image"></image-popover>
        </template>
      </el-table-column>
      <el-table-column prop="color" label="颜色" max-width="70"></el-table-column>
      <el-table-column prop="size" label="尺码" max-width="70"></el-table-column>
      <el-table-column prop="brandName" label="品牌" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="priceTag" label="吊牌价"></el-table-column>
      <el-table-column prop="settlePrice" label="调入结算单价" width="100">
        <template slot-scope="scope">
          <el-input @input.native="purchasePriceChange($event, scope.row)" v-model="scope.row.settlePrice"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="未结算货量"></el-table-column>
      <el-table-column label="数量" width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.inputQuantity"  @input.native="handleInput($event, scope)" @change="handleChange(scope)" :min="0" label="选择的数量" size="mini" :class="{'txt-red' : scope.row.quantity < scope.row.inputQuantity}"></el-input-number>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" v-if="tableData.length > 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length" :page-size="formData.pageSize" :current-page="formData.pageIndex">
      </el-pagination>
    </div>
    <div class="item-cont clearfix">
      <ul class="text-info">
        <li>吊牌总价：{{ checkedAllSKUInfo.retailPriceTotal }}</li>
        <li>sku种类数：{{ checkedAllSKUInfo.skuNum }}</li>
        <li>商品总数：{{ checkedAllSKUInfo.goodsTotal }}</li>
        <li>调入方货值：{{ checkedAllSKUInfo.transferValueCopy }}</li>
      </ul>
      <div class="btns">
        <el-button type="primary" @click="href" size="small" plain>取消</el-button>
        <el-button type="primary" @click="finalSub('13')" size="small" plain>存为草稿</el-button>
        <el-button type="primary" @click="continueCheckGoods" size="small" plain>继续选货</el-button>
        <el-button type="primary" @click="finalSub('0')" size="small">确认调拨</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import ImagePopover from "@/views/collocation/components/ImagePopover";
  import { numberPrice } from "@/utils/validate";
  export default {
    name: '',
    props: {
      // 提交门店信息
      transferSlipAddInfo: {
        type: Object,
        default(){
          return {}
        }
      },
      // 是否显示
      checkedGoodsShow: {
        type: Boolean,
        default: false
      },
      // 表格数据
      tableData: {
        type: Array
      }
    },
    // 数据
    data() {
      return {
        value: '',
        // 分页显示的数据
        showTableData: [],
        formData: {
          pageIndex: 1,
          pageSize: 10
        },
        // 选择的商品总信息
        checkedAllSKUInfo: {
          retailPriceTotal: 0,
          typeTotal: 0,
          goodsTotal: 0,
          actualPriceTotal: 0,
          discount: ''
        },
      }
    },
    // 组件
    components: {
      ImagePopover
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.init();
      })
    },
    // 方法
    methods: {
      init(){
        this.formData.pageIndex = 1;
        console.log(this.tableData)
        // 获取显示的数据
        this.getShowTableData();
        // 计算选中的商品总信息
        this.getCheckedAllSKUInfo();
      },
      // 获取显示数据
      getShowTableData(){
        if(this.tableData.length <= 10){
          this.showTableData = this.tableData;
          this.tableData.forEach((item, index) => {
            item.stock = item.inputQuantity;
          })
        }
        if(this.tableData.length > 10){
          this.showTableData = this.tableData.slice((this.formData.pageIndex - 1) * this.formData.pageSize, this.formData.pageIndex * this.formData.pageSize )
        }
      },
      // 数量输入改变
      /**
       *
       * @param $event dom节点
       * @param scope el-table 行数据的所有信息
       */
      handleInput($event, scope){
        this.$nextTick(()=>{
          let val = $event.target.value;
          scope.row.inputQuantity = $event.target.value = val.replace(/[^\d.]/g,'');
          this.handleChange(scope)
        })
      },
      /**
       * 数量点击改变
       * @param scope el-table 行数据的所有信息
       */
      handleChange(scope){
        if(scope.row.inputQuantity == 0){
          this.$confirm('返货量为0时，将删除该商品', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            showClose:false
          }).then(() => {
            this.tableData.splice(scope.$index + (this.formData.pageIndex - 1) * this.formData.pageSize, 1);
            if(this.showTableData.length === 1 && this.formData.pageIndex > 1){
              this.formData.pageIndex = this.formData.pageIndex -1;
            }
            this.getShowTableData();
            this.$nextTick(()=>{
              // 计算选中的商品总信息
              this.getCheckedAllSKUInfo();
            })
          }).catch(() => {
            scope.row.inputQuantity = 1;
          });
        }else {
          this.$nextTick(()=>{
            // 计算选中的商品总信息
            this.getCheckedAllSKUInfo();
          });
        }
      },
      /**
       * 单价改变
       * @param $event dom节点
       * @param row 修改单价的行数据
       */
      purchasePriceChange($event, row){
        let val = $event.target.value;
        // if(!val) {
        //   row.allotPrice = 0;
        //   return
        // }
        numberPrice($event);
        row.allotPrice = $event.target.value;
        this.$nextTick(()=>{
          // 计算选中的商品总信息
          this.getCheckedAllSKUInfo();
        })
      },
      // 取消
      href() {
        this.$router.push({
          path: '/scb/order/allotGoods_order'
        });
      },
      // 计算选中的商品总信息
      getCheckedAllSKUInfo(){
        this.checkedAllSKUInfo = {
          retailPriceTotal: 0,
          typeTotal: 0,
          goodsTotal: 0,
          actualPriceTotal: 0,
          discount: this.checkedAllSKUInfo.discount,
          skuNum:null,
          transferValueCopy:null
        };
        // 获取所有的 商品货号 + 颜色  集合
        let typeTotalObj = {};
        if(this.tableData.length){
          this.tableData.forEach(item => {
            this.checkedAllSKUInfo.skuNum += 1;
            this.checkedAllSKUInfo.transferValueCopy += Number(item.settlePrice) * Number(item.inputQuantity);
            this.checkedAllSKUInfo.retailPriceTotal += Number(item.priceTag) * Number(item.inputQuantity);
            this.checkedAllSKUInfo.goodsTotal += Number(item.inputQuantity);
            this.checkedAllSKUInfo.actualPriceTotal += Number(item.allotPrice) * Number(item.inputQuantity);
            let goodsCodeColor = item.goodsCode + item.color;
            if(!typeTotalObj[goodsCodeColor]){
              typeTotalObj[goodsCodeColor] = 1
            }
          });
          this.checkedAllSKUInfo.transferValueCopy = this.checkedAllSKUInfo.transferValueCopy.toFixed(2);
          this.checkedAllSKUInfo.retailPriceTotal = this.checkedAllSKUInfo.retailPriceTotal.toFixed(2);
          this.checkedAllSKUInfo.actualPriceTotal = this.checkedAllSKUInfo.actualPriceTotal.toFixed(2);
          this.checkedAllSKUInfo.typeTotal = Object.keys(typeTotalObj).length;
        }
      },
      /**
       * 输入全部商品的折扣过滤
       * @param $event dom节点
       */
      goodsAllDiscount($event){
        let value = $event.target.value;
        this.checkedAllSKUInfo.discount = $event.target.value = value.match(/\d(\.\d?)?/g) && value.match(/\d(\.\d?)?/g)[0] || null;
      },
      // 折扣回车
      goodsAllDiscountEnter(){
        if(!this.checkedAllSKUInfo.discount) return;
        this.checkedAllSKUInfo.discount = this.checkedAllSKUInfo.discount.replace(/\.$/, '');
        if(this.tableData.length){
          this.tableData.forEach(item => {
            item.allotPrice = (item.retailPrice * Number(this.checkedAllSKUInfo.discount) / 10).toFixed(2)
          });
          // 计算选中的商品总信息
          this.getCheckedAllSKUInfo();
        }
      },
      // 继续选货
      continueCheckGoods(){
        this.$emit('update:checkedGoodsShow', false)
      },
      /**
       * 最终提交
       * @param orderStatus 调拨单状态  13-待编辑 0-待发货
       */
      finalSub(orderStatus){
        if(!this.tableData.length){
          return
        }
        this.transferSlipAddInfo.infoVOS = [];
        console.log(this.tableData);
        
        this.tableData.forEach(item => {
          let obj = {
            // 货品编码
            goodsCode: item.goodsCode,
            // 货品名称
            goodsName: item.goodsName,
            // 商品(spu)编码
            productCode: item.productCode,
            // 商品类型
            productType: item.productType,
            // 商品图片
            image: item.image,
            // 品牌
            brandName: item.brandName,
            brandCode: item.brandCode,
            // 设计商
            designCompanyName: item.designCompanyName,
            designCompanyCode: item.designCompanyCode,
            // 尺码
            size: item.size,
            // 颜色
            color: item.color,
            // 颜色色系
            colorSeries: item.colorSeries,
            // 吊牌价
            retailPrice: item.priceTag,
            // 调拨单价
            allotPrice: item.settlePrice,
            // 数量
            quantity: item.inputQuantity
          };
          this.transferSlipAddInfo.infoVOS.push(obj);
        });
        this.transferSlipAddInfo.quantity = this.checkedAllSKUInfo.goodsTotal;
        this.transferSlipAddInfo.transferValueCopy = this.checkedAllSKUInfo.transferValueCopy;
        this.transferSlipAddInfo.orderStatus = orderStatus;
        this.request(this.api.order.storeAllotGoodsOrder_keep, this.transferSlipAddInfo).then(data => {
          if(data && data.length){
            let html = '';
            data.forEach(errItem => {
              for(let i = this.tableData.length - 1; i >= 0; i--){
                if(this.tableData[i].goodsCode == errItem.code){0
                  if(errItem.stockQty == 0){
                    this.tableData.splice(i, 1);
                    html += '<p>'+ errItem.code + '：可用库存为0，已删除该商品；</p>';
                  }else {
                    html += '<p>'+ errItem.code + '：可用库存不足，已更新为最大值' + errItem.stockQty + '；</p>';
                    this.tableData[i].stockQty = errItem.stockQty;
                    this.tableData[i].quantity = errItem.stockQty;
                  }
                  break;
                }
              }
            });
            // this.$notify({
            //   title: '提示',
            //   duration: 0,
            //   dangerouslyUseHTMLString: true,
            //   message: html
            // });
            this.$nextTick(() => {
              this.init();
            })
          }else {
            this.$notify.success({ title: '成功',message: '新增成功'});
            this.$router.push({
              path: '/scb/order/allotGoods_order'
            })
          }
        });
      },
      /**
       * 表格更改条数
       * @param val 每页的条数
       */
      handleSizeChange(val){
        this.formData.pageSize = val;
        this.formData.pageIndex = 1;
        this.getShowTableData();
      },
      /**
       * 表格更改页数
       * @param val 页码
       */
      handleCurrentChange(val){
        this.formData.pageIndex=val;
        this.getShowTableData();
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {

    }
  }
</script>
