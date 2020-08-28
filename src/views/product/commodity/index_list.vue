<!--
 * @Description: 商品中心 =>商品列表
 * @Author:elephant
 * @Date: 2019-07-01 15:20:22
 * @LastEditTime: 2020-04-01 16:01:35
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <div class="item-margin">
      <el-form
        class="item-form"
        :model="filtersData"
        label-width="90px"
        size="small"
        ref="filtersForm"
        inline
      >
        <el-form-item prop="cateIdentifier" label="品类：">
          <el-cascader
            class="input-w"
            filterable
            :options="classData"
            @visible-change="serchVisibleChange($event,searchStatus.cateActive,'cate')"
            v-model="cateArr"
            :value="cateArr"
            @change="cascaderGet"
            :show-all-levels="false"
            :props="props"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="valid" label="商品状态：">
          <el-select class="input-w" placeholder="请选择" filterable v-model="filtersData.valid">
            <el-option
              v-for="item in productOptions"
              :key="item.status"
              :label="item.name"
              :value="item.status"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="brandId" label="品牌：">
          <el-select
            class="input-w"
            placeholder="请选择"
            :loading="searchStatus.brandLoading"
            @visible-change="serchVisibleChange($event,searchStatus.brandActive,'brand')"
            filterable
            v-model="filtersData.brandId"
          >
            <el-option
              v-for="item in brandOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="quantityGE" label="库存数量：">
          <el-col :span="11">
            <el-input class="input-w" placeholder="请输入最小值" v-model="filtersData.quantityGE"></el-input>
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="11">
            <el-input class="input-w" placeholder="请输入最大值" v-model="filtersData.quantityLE"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item prop="brandOwnerId" label="品牌商：">
          <el-select
            class="input-w"
            placeholder="请选择"
            :loading="searchStatus.brandOwnerLoading"
            filterable
            @visible-change="serchVisibleChange($event,searchStatus.brandOwnerActive,'brandOwner')"
            v-model="filtersData.brandOwnerId"
          >
            <el-option
              v-for="(item,index) in brandOwnerOptions"
              :key="index.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="designCompanyId" label="设计商：">
          <el-select
            class="input-w"
            placeholder="请选择"
            filterable
            :loading="searchStatus.designCompanyLoading"
            @visible-change="serchVisibleChange($event,searchStatus.designCompanyActive,'designCompany')"
            v-model="filtersData.designCompanyId"
          >
            <el-option
              v-for="item in designCompanyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item prop="ownerId" label="货主：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.ownerId">
            <el-option
              v-for="(item,index) in ownerOptions"
              :key="index.id"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="colorCode" label="颜色：">
          <el-cascader
            class="input-w"
            v-model="colorArr"
            :value="colorArr"
            :options="colorOptions"
            @change="colorCodeGet"
            :show-all-levels="false"
            :props="colorProps"
            :emitPath="false"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="seasonalStyleCode" label="季节：">
          <el-select
            filterable
            class="input-w"
            placeholder="请选择"
            v-model="filtersData.seasonalStyleCode"
          >
            <el-option
              v-for="(item,index) in seasonalStyleOptions"
              :key="index.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="searchWords" label="综合搜索：">
          <el-input class="input-w" placeholder="商品款号/货号/原始款号" v-model="filtersData.searchWords"></el-input>
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
        <el-button size="small" type="primary" @click="openAddCommodity">新增商品</el-button>
        <el-button size="small" type="primary" plain @click="openPrintsModal">打印吊牌</el-button>
        <el-button size="small" type="primary" plain @click="exportShare">导出分享</el-button>
        <el-button size="small" type="primary" plain @click="exportDataPacket">导出数据包</el-button>
      </div>
      <div class="item-table">
        <el-table
          :data="tableListData"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true"
          row-key="id"
          lazy
          :load="load"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="code" align="center"   width="80">
            <template slot-scope="scope">
              <!-- <i
                @click="childrenIsShow(scope.row)"
                :data-id="scope.row.id"
                v-if="scope.row.isShow"
                :class="scope.row.isType == 1 ?'el-icon-circle-plus-outline i-cursor' : 'el-icon-remove-outline i-cursor'"
              ></i>-->
              <div :class="[!scope.row.children ? 'children-checked':'parent-checked']" >
              <el-checkbox
                v-model="scope.row.checked"
                :key="scope.row.id"
                @change="handleCheckAllChange(scope.row)"
              ></el-checkbox>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="code" align="center" label="商品款号" min-width="125"></el-table-column>
          <el-table-column prop="subCode" align="center" label="商品货号" min-width="150"></el-table-column>
          <el-table-column prop="color" align="center" label="颜色" min-width="100"></el-table-column>
          <el-table-column prop="brandName" align="center" label="品牌" min-width="80"></el-table-column>
          <el-table-column prop="ownerName" align="center" label="货主" min-width="100"></el-table-column>
          <el-table-column prop="fullCateName" align="center" label="品类" min-width="120"></el-table-column>
          <el-table-column prop="name" align="center" label="商品名称" min-width="120"></el-table-column>
          <el-table-column prop="originalCode" align="center" label="原始款号" min-width="120"></el-table-column>
          <el-table-column prop="image" align="center" label="商品图片" min-width="120">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="hover">
                <img class="poporer-img" :src="scope.row.image" />
                <img slot="reference" :src="scope.row.image" class="table-img-wh" />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="retailPrice" align="center" label="吊牌价" min-width="100"></el-table-column>
          <el-table-column prop="valid" align="center" label="商品状态" min-width="110">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.valid"
                v-if="scope.row.isShow"
                active-color="#13ce66"
                @change="switchValid(scope.row)"
                inactive-color="#9d9d9d"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                @click="openShowDetails(scope.row)"
                v-if="scope.row.isShow"
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                @click="openEditDetails(scope.row)"
                v-if="scope.row.isShow"
                type="text"
                size="small"
              >修改</el-button>
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
    <!--table END  -->
    <!-- 打印 -->
    <prints-dialog ref="printsRef"></prints-dialog>
  </div>
</template>
<script>
const PrintsDialog = resolve =>
  require(["@/components/Prints/PrintsDialog.vue"], resolve);
let csvExportData = {};
export default {
  name: "index_list",
  data() {
    let that = this;
    return {
      filtersData: {
        colorCode: "",
        colorSeriesCode: "",
        ownerId: "", //货主
        brandId: "", //品牌ID
        brandOwnerId: "",
        cateIdentifier: "", // 分类标识码
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        //季节字段
        seasonalStyleCode: "",
        searchWords: "", //检索关键字
        designCompanyId: "", //设计商Id
        // tenantId: "", //平台租户（所属机构）ID ,
        valid: true //有效状态
      },
      colorProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          that.getColorList(node, resolve);
        }
      },
      classData: [],
      classList: [],
      cateArr: [],
      colorArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      //商品有效状态
      productOptions: [
        {
          status: true,
          name: "上架"
        },
        {
          status: false,
          name: "下架"
        }
      ],
      total: 0,
      searchStatus: {
        cateActive: false,
        brandActive: false,
        brandLoading: true,
        brandOwnerActive: false,
        brandOwnerLoading: true,
        DesignCompanyActive: false,
        DesignCompanyLoading: true
      },
      //品类Data 以后可能使用VUx 读取看具体需求，当多处调用时存入VUX；
      CategoryOptions: [],
      //品牌
      brandOptions: [],
      //设计商
      designCompanyOptions: [],
      colorOptions: [],
      colorList: [],
      //品牌商
      brandOwnerOptions: [], //品牌商
      //table列表数据
      tableListData: [],
      //货主
      ownerOptions: [],
    };
  },
  components: {
    PrintsDialog
  },
  created() {
    //获取列表
    this.getTableList();
    //颜色
    this.getColorOptions();
    //获取货主
    this.getOwnerOptions();
  },
  activated() {
    this.getTableList();
  },
  mounted() {
    // var ssu = new window.SpeechSynthesisUtterance('你好我爱你亲爱的');
    // window.speechSynthesis.speak(ssu);
  },
  methods: {
    //处理搜索下拉显示
    serchVisibleChange(type, active, str) {
      if (!!type) {
        if (!active) {
          switch (str) {
            //品类
            case "cate":
              this.searchStatus.cateActive = true;
              this.getClassData();
              break;
            //品牌
            case "brand":
              this.searchStatus.brandActive = true;
              this.searchStatus.brandLoading = false;
              this.getBrandOptions();
              break;
            //品牌商
            case "brandOwner":
              this.searchStatus.brandOwnerActive = true;
              this.searchStatus.brandOwnerLoading = false;
              this.getBrandOwnerOption();
              break;
            //设计商
            case "designCompany":
              this.searchStatus.designCompanyActive = true;
              this.searchStatus.designCompanyLoading = false;
              this.getDesignCompanyOptions();
              break;
            default:
              break;
          }
        }
      }
    },
    //批量打印
    openPrintsModal() {
      //需要打印逻辑
      let arr = [];
      for (let i = 0; i < this.tableListData.length; i++) {
        if (this.tableListData[i].valid == true) {
          arr.push(this.tableListData[i].code);
        }
      }
      if (arr.length <= 0) {
        this.$message.error("无可打印吊牌数据");
        return false;
      }
      this.$refs.printsRef.popupInit(arr);
    },
    //导出分享
    exportShare() {
      this.filtersData.pageIndex = 0;
      this.filtersData.pageSize = 0;
      let _self = this.filtersData;
      console.log(_self);
      let hasProp = false;
      Object.keys(_self).forEach(function(key) {
        // console.log(key + "==" + _self[key].length);
        if (_self[key].length > 0) {
          hasProp = true;
        }
      });
      if (hasProp) {
        console.log("istrue");
        this.request(
          this.api.product.productShare_share,
          this.filtersData
        ).then(res => {
          console.log(res);
          const { href } = this.$router.resolve({
            path: "/share/product_list",
            query: {
              identifier: res
            }
          });
          window.open(href, "_blank");
        });
      } else {
        this.$notify({
          title: "提示",
          message: "请至少选择一项商品筛选条件（商品状态条件除外）！",
          type: "warning",
          duration: 2000
        });
      }
    },
    //颜色
    getColorOptions() {
      this.request(this.api.product.colorSeries_list, {}, true).then(res => {
        let _data = res.data;
        let colorList = _data.map((item, i) => ({
          value: item.id,
          label: item.name,
          leaf: false
        }));
        this.colorOptions = colorList;
      });
    },
    //获取货主
    getOwnerOptions() {
      this.request(
        this.api.warehouse.warehouseBase_goodsOwner_list,
        { valid: true, orderBy: "create_time" },
        true
      ).then(res => {
        this.ownerOptions = res.data;
      });
    },
    getColorList(node, resolve) {
      if (!node.value) return;
      this.request(
        this.api.product.color_list,
        { seriesId: node.value },
        true
      ).then(res => {
        let _data = res.data;
        let colorList = _data.map((item, i) => ({
          value: item.code,
          label: item.name,
          leaf: true
        }));
        resolve(colorList);
      });
    },
    colorCodeGet(e) {
      let color = this.$common.deepCopy(e).pop();
      if (e.length >= 2) {
        this.filtersData.colorCode = color;
        this.filtersData.colorSeriesId = "";
      } else {
        this.filtersData.colorCode = "";
        this.filtersData.colorSeriesId = color;
      }
    },
    //获取分类
    getClassData() {
      //分类类型（1：标准分类，2：定制分类，3：原料分类或者称为属性分类）
      this.$common.getClassSelect(this, 1).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
    },
    cascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      this.filtersData.cateIdentifier = obj.identifier;
    },
    //获取品牌商
    getBrandOwnerOption() {
      this.request(this.api.product.productBrandOwner_list, {}, true).then(
        data => {
          let _data = data.data;
          this.brandOwnerOptions = _data;
        }
      );
    },
    /**
     * 用于点击table列表中某行 获取当前行下级子分类
     * 1，在获取列表数据时给每个列表中添加字段 stratus ==1  表示当前行可展开；
     * 2，点击某一行时，获取当前行的下标， 当数据返回后 把对象抽出，插入在已知下标后。
     * 3，当点击关闭时，根据下标和唯一标识 删除已知 数据中的字段；
     * */
    //获取列表
    getTableList() {
      this.request(this.api.product.product_listProduct, this.filtersData).then(
        data => {
          let _data = data.data,
            _dataLen = _data.length;
          for (let i = 0; i < _dataLen; i++) {
            _data[i].isShow = true;
            _data[i].isType = 1;
            _data[i]._cid = "";
            _data[i].children = [];
            _data[i].hasChildren = true;
            _data[i].checked = false;
          }
          this.tableListData = _data;
          this.total = data.totalCount;
        }
      );
    },
    //设计商
    getDesignCompanyOptions() {
      this.request(this.api.product.designCompany_list, {}, true).then(data => {
        //  console.log(data);
        this.designCompanyOptions = data.data;
      });
    }, //品牌
    getBrandOptions() {
      this.request(this.api.product.productBrand_list, {}, true).then(data => {
        //console.log(data.data);
        let _data = data.data;
        this.brandOptions = _data;
      });
    },
    //搜索
    handleSearch() {
      this.filtersData.pageIndex = 1;
      this.filtersData.pageSize = 10;
      this.getTableList();
    },
    //清空重置
    handleResetFilters(formName) {
      this.$refs[formName].resetFields();
      this.cateArr = [];
      this.colorArr = [];
      this.filtersData.stockLE = "";
      this.filtersData.colorSeriesId = "";
    },
    //滑块开关
    switchValid(params) {
      this.request(this.api.product.product_save, params);
    },
    //新增商品按钮
    openAddCommodity() {
      this.$router.push({
        path: "/product/commodity/addCommodity",
        name: "addCommodity"
      });
    },
    //查看商品
    openShowDetails(params) {
      this.$router.push({
        path: "/product/commodity/show_commodity",
        name: "show_commodity",
        query: {
          productId: params.id,
          cateId: params.cateId,
          _type: "show"
        }
      });
    },
    //修改商品
    openEditDetails(params) {
      this.$router.push({
        path: "/product/commodity/edit_commodity",
        name: "edit_commodity",
        query: {
          productId: params.id,
          cateId: params.cateId,
          _type: "edit"
        }
      });
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
    },
    // table树懒加载数据
    load(tree, treeNode, resolve) {
      this.request(this.api.product.productGoods_listProductGoods, {
        productId: tree.id,
        colorCode: this.filtersData.colorCode,
        colorSeriesCode: this.filtersData.colorSeriesCode
      }).then(res => {
        let _data = res.data;
        let _dataLen = _data.length;
        for (let i = 0; i < _dataLen; i++) {
          _data[i].subCode = _data[i].code;
          _data[i].code = null;
          if(!!tree.checked){
            _data[i].checked = true;
          }
        }
        tree.children=res.data;
        resolve(res.data);
      });
    },
    // 导出模板
    exportDataPacket(){
      let csvData=csvExportData;
      if(!csvData.spuList && !csvData.skuList){
        this.$message.error('请勾选导出的数据！');
        return false;
      }
      this.util.exportExcelCSV(
        this.api.FN_ALLPATH(this.api.product.productDataPackage_export_csv),
        csvData,  
        '商品数据包.csv'
      );
    },
    // 处理table 选中
    handleCheckAllChange(row) {
      //父级
      if (!row.productCode) {
        for (let j = 0; j < row.children.length; j++) {
          if(!!row.checked){
            row.children[j].checked=true;
          }else{
            row.children[j].checked=false;
          }
        }
      }else{
        // 子集
        let tableObj = this.tableListData.find((item) => (item.code == row.productCode));
        let tableObjChildren = tableObj.children;
        let flag = true;
        for (let n = 0; n < tableObjChildren.length; n++) {
          if(!tableObjChildren[n].checked){
            flag = false;
          }
        }
        if(!!flag){
          tableObj.checked = true;
        }else{
          tableObj.checked = false;
        }
      }
      //简化 
      let tableList = this.$common.deepCopy(this.tableListData);
      let spu = [],sku = [];
      for (let i = 0; i < tableList.length; i++) {
        //当父级等于true时放入进去
        if(!!tableList[i].checked){
          spu.push(tableList[i].code);
        }else{
          let children = tableList[i].children;
          for (let k = 0; k < children.length; k++) {
            if(!!children[k].checked){
              sku.push(children[k].subCode);
            }
          }
        }
      }
      let obj = {
        spuList :spu,
        skuList :sku
      }
      csvExportData=obj;
    }
    //点击获取子元素插入数组
    // childrenIsShow(row) {
    //   let _id = row.id; //当前数据ID
    //   let _type = row.isType; //状态 1 关闭 0 打开
    //   if (_type == "1") {
    //     //当前为关闭状态 需请求接口获取子元素
    //     row.isType = 0;
    //     this.getChildData(row, _id);
    //   } else {
    //     //当前为打开状态 需删除子元素
    //     row.isType = 1;
    //     this.removeChildData(row);
    //   }
    // },
    // //获取子集
    // getChildData(row, _id) {
    //   let _index = this.tableListData.findIndex(item => item.id == _id);
    //   if (!row._chilren) {
    //     this.request(this.api.product.productGoods_listProductGoods, {
    //       productId: _id,
    //       colorCode: this.filtersData.colorCode,
    //       colorSeriesCode: this.filtersData.colorSeriesCode
    //     }).then(res => {
    //       let _data = res.data;
    //       let _dataLen = _data.length;
    //       for (let i = 0; i < _dataLen; i++) {
    //         _data[i].subCode = _data[i].code;
    //         _data[i].code = null;
    //       }
    //       row._chilren = _data;
    //       //根据下标插入进去 获取ID 在数组中的下标
    //       this.tableListData.splice(_index + 1, 0, ..._data);
    //       //获取子集id存入 元素属性
    //       let arr = [];
    //       for (let { id } of _data) {
    //         arr.push(id);
    //       }
    //       row._cid = arr.join();
    //     });
    //   } else {
    //     this.tableListData.splice(_index + 1, 0, ...row._chilren);
    //   }
    // },
    // //删除子集
    // removeChildData(row) {
    //   let cid = row._cid;
    //   let cidArr = cid.split(",");
    //   let _table = this.tableListData,
    //     tableLen = _table.length;
    //   for (let i = 0; i < cidArr.length; i++) {
    //     for (let j = 0; j < this.tableListData.length; j++) {
    //       if (cidArr[i] == this.tableListData[j].id) {
    //         this.tableListData.splice(j, 1);
    //       }
    //     }
    //   }
    // }
  },

  computed: {
    //季节波段
    seasonalStyleOptions() {
      let codeSet = this.$store.getters.codeData;
      if (codeSet.PRO001) {
        return codeSet.PRO001.codeItemList;
      }
    }
  }
};
</script>

<style scoped lang="less">
.poporer-img {
  width: auto;
  height: 320px;
}
.parent-checked{
  display: inline-block;
}
.children-checked{
  text-align: right;
}
</style>
