<template>
  <div>
    <div class="content-from">
      <el-form
        :inline="true"
        :model="signData"
        size="small"
        ref="ruleForm"
        class="demo-form-inline"
        label-width="104px"
      >
        <el-form-item label="模糊查询：" prop="searchWords">
          <el-input
            style="width:240px;"
            v-model="signData.searchWords"
            placeholder="商品款号/货号/商品名称/原始款号"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品分类：">
          <el-cascader
            class="input-w"
            :options="classData"
            v-model="cateArr"
            @change="classChange"
            :show-all-levels="false"
            :props="props"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="品牌：" label-width="88px" prop="brandId">
          <el-select v-model="signData.brandId" placeholder="请选择">
            <el-option v-for="item in brandData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="季节：" label-width="94px" prop="appropriateSeasonCode">
          <el-select v-model="signData.appropriateSeasonCode" placeholder="请选择">
            <el-option
              v-for="(item,index) in seasonalStyleOptions"
              :key="index.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颜色：" prop="colorCode">
          <el-select v-model="signData.colorCode" placeholder="请选择">
            <el-option
              v-for="item in colorData"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库：" prop="warehouseCode">
          <el-select v-model="signData.warehouseCode" placeholder="请选择" style="width:240px;">
            <el-option
              v-for="item in warehouseArr"
              :key="item.id"
              :label="item.warehouseName"
              :value="item.warehouseCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货主：" label-width="105px" prop="ownerId">
          <el-select v-model="signData.ownerId" placeholder="请选择" style="width:160px;">
            <el-option
              v-for="item in ownerData"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自定义筛选：" label-width="126px" prop="quantityType">
          <el-select v-model="signData.quantityType" placeholder="请选择">
            <el-option
              v-for="item in quantityTypeArr"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label prop="logicType" style="margin:0px -14px;">
          <el-select v-model="signData.logicType" placeholder="请选择" style="margin:0 5px;">
            <el-option
              v-for="item in logicTypeArr"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label prop="quantity" style="margin-left:10px;">
          <el-input class="input-w" placeholder="具体数量" v-model="signData.quantity" v-enter-number></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="onSearchContent" size="small">搜索</el-button>
          <el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-table">
      <el-tabs v-model="signData.inventoryStatus" @tab-click="activeTabClickEvent">
        <el-tab-pane label="合格品" name="1"></el-tab-pane>
        <el-tab-pane label="残次品" name="2"></el-tab-pane>
      </el-tabs>
      <el-button plain @click="exportExcel" size="small">导出</el-button>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        header-row-class-name="item-table-header"
        empty-text="暂无数据"
      >
        <el-table-column width="55">
          <template slot-scope="scope">
            <i
              @click="childrenIsShow(scope.row)"
              :data-id="scope.row.id"
              v-if="scope.row.isShow"
              :class="scope.row.isType == 1 ?'el-icon-circle-plus-outline i-cursor' : 'el-icon-remove-outline i-cursor'"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="商品款号" width="170">
          <template slot-scope="scope">{{ scope.row.spu }}</template>
        </el-table-column>
        <el-table-column prop="sku" label="货号" width="170">
          <template slot-scope="scope">{{ scope.row.sku }}</template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column prop="image" label="商品图片">
          <template slot-scope="scope">
            <img :src="scope.row.image" style="width:32px;height:32px;" />
          </template>
        </el-table-column>
        <el-table-column prop="originalCode" label="原始款号">
          <template slot-scope="scope">{{ scope.row.originalCode }}</template>
        </el-table-column>
        <el-table-column prop="colorName" label="颜色">
          <template slot-scope="scope">{{ scope.row.colorName }}</template>
        </el-table-column>
        <el-table-column prop="sizeName" label="规格">
          <template slot-scope="scope">{{ scope.row.sizeName }}</template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌">
          <template slot-scope="scope">{{ scope.row.brandName }}</template>
        </el-table-column>
        <el-table-column prop="quantity" label="库存总量">
          <template slot-scope="scope">{{ scope.row.quantity }}</template>
        </el-table-column>
        <el-table-column label="冻结库存">
          <template slot-scope="scope">{{ scope.row.frozenQuantity }}</template>
        </el-table-column>
        <el-table-column prop="availableQuantity" label="可用库存" align="center">
          <template slot-scope="scope">{{ scope.row.availableQuantity}}</template>
        </el-table-column>
        <el-table-column prop="inTransitQuantity" label="在途库存" align="center">
          <template slot-scope="scope">{{ scope.row.inTransitQuantity}}</template>
        </el-table-column>
      </el-table>
      <div :class="{'page_div':tableData.length>0}">
        <div
          style="color:#222;flex:auto;font-weight:700;font-size:13px;"
          v-show="tableData.length>0"
        >
          <span>货主：{{tableListData.ownerCount}}家</span>
          <span style="margin-left:10px;margin-right:10px;">仓库：{{tableListData.warehouseCount}}个</span>
          <span style="margin-left:10px;margin-right:10px;">总库存量：{{tableListData.inventoryCount}}件</span>
          <span>其中款号数{{tableListData.productCodeCount}}种</span>
          <span style="margin-left:10px;margin-right:10px;">货号数{{tableListData.goodsCodeCount}}个</span>
          <span style="margin-left:10px;margin-right:10px;">累计可用库存：{{tableListData.availableCount}}</span>
          <span style="margin-left:10px;margin-right:10px;">累计冻结库存：{{tableListData.blockedCount}}</span>
          <span style="margin-left:10px;margin-right:10px;">累计在途库存：{{tableListData.inTransitCount}}</span>
        </div>
        <div :class="{'pagination':tableData.length==0}">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="signData.pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="signData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //搜索得数据源
      signData: {
        //搜索
        searchWords: "",
        //品牌ID
        brandId: "",
        //季节编码
        appropriateSeasonCode: "",
        //分类
        cateIdentifier: "",
        //仓库编码
        warehouseCode: "",
        //颜色
        colorCode: "",
        //货主编码
        ownerId: "",
        //数量类型(0：可用数量，1：冻结数量，2：总数量)
        quantityType: "",
        //逻辑运算符（0：小于，1：等于，2：大于，3：小于等于，4：大于等于）
        logicType: "",
        //数量
        quantity: "",
        //商品形态（0：未知，1：合格，2：残次，3：在途)
        inventoryStatus: "1",
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      //品牌数据
      brandData: [],
      //颜色数据
      colorData: [],
      //仓库
      warehouseArr: [],
      // 分类数据
      classData: [],
      classList: [],
      // 分类映射
      props: {
        value: "identifier",
        label: "name",
        children: "children"
      },
      // 选中的分类
      cateArr: [],
      //货主数据
      ownerData: [],
      //自定义筛选
      logicTypeArr: [
        {
          id: 0,
          value: "小于"
        },
        {
          id: 1,
          value: "等于"
        },
        {
          id: 2,
          value: "大于"
        },
        {
          id: 3,
          value: "小于等于"
        },
        {
          id: 4,
          value: "大于等于"
        }
      ],
      quantityTypeArr: [
        {
          id: 0,
          value: "可用数量"
        },
        {
          id: 1,
          value: "冻结数量"
        },
        {
          id: 2,
          value: "总数量"
        }
      ],
      //标记临时得选项名称
      tempTabName: -1,
      //表数据
      tableListData: {},
      //表格数据
      tableData: [],
      totalCount: 1,
      multipleSelectionData: [{ statementSn: "0101010" }]
    };
  },
  //监听器
  watch: {
    qualityStatus(newVal, oldVal) {
      // this.tempTabName = newVal;
      // switch (this.signData.qualityStatus) {
      //   case "1":
      //     console.log("合格品====");
      //     break;
      //   case "2":
      //     console.log("残次品====");
      //     break;
      // }
      // this.getStatementListData();
    }
  },
  computed: {
    //季节波段
    seasonalStyleOptions() {
      let codeSet = this.$store.getters.codeData;
      console.log(codeSet);
      if (codeSet.PRO001) {
        return codeSet.PRO001.codeItemList;
      }
    }
  },
  mounted() {
    this.getOrganizationListData();
    this.getTableListData();
    this.getBrandOptionsData();
    this.getColorData();
    this.getClassData();
  },
  methods: {
    //得到组织机构数据
    async getOrganizationListData() {
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      console.log(info);
      //得到部门Id
      // this.shop_user.relationDepId = info.departId;

      this.request(this.api.user.userCompany_getUserOrgByUserId, {
        userId: info.userId,
        type: 0
      }).then(data => {
        //获取货主列表
        this.getGoodsOwnerListData(data.id);
        //得到仓库数据
        this.getWarehouseList(data.id);
      });
    },
    //得到表格数据
    getTableListData() {
      this.request(
        this.api.warehouse.warehouseBase_inventory_list,
        this.signData
      ).then(res => {
        console.log(res);
        res.data.data.forEach(item => {
          item.isType = 1;
          item.isShow = true;
        });
        this.tableListData = res;
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      });
    },
    //得到品牌数据
    getBrandOptionsData() {
      this.request(this.api.product.productBrand_list, {}, true).then(data => {
        let _data = data.data;
        this.brandData = _data;
      });
    },
    //得到颜色数据
    getColorData() {
      this.request(this.api.product.color_list, {}, true).then(res => {
        let _data = res.data;
        this.colorData = _data;
      });
    },
    //得到仓库数据
    getWarehouseList(orgId) {
      this.request(this.api.warehouse.warehouseBase_warehouse_list, {
        isValid: true
      }).then(data => {
        this.warehouseArr = data.data;
      });
    },
    //获取货主列表
    getGoodsOwnerListData(orgId) {
      this.request(this.api.warehouse.warehouseBase_goodsOwner_list, {
        valid: true
      }).then(res => {
        this.ownerData = res.data;
      });
    },
    // 获取商品分类数据
    getClassData() {
      //分类类型（1：标准分类，2：定制分类，3：原料分类或者称为属性分类）
      this.$common.getClassSelect(this, 1).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
    },
    // 商品分类Change
    classChange(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.identifier == cateId);
      this.signData.cateIdentifier = obj.identifier;
    },
    //搜索
    onSearchContent() {
      this.signData.productId = "";
      this.signData.pageIndex = 1;
      //刷新数据
      this.getTableListData();
    },
    //重置
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
      this.cateArr = [];
      this.signData.cateIdentifier = "";
      this.signData.productId = "";
    },
    //选项卡切换事件
    activeTabClickEvent(tab, event) {
      if (this.tempTabName != this.signData.inventoryStatus) {
        this.getTableListData();
        this.tempTabName = this.signData.inventoryStatus;
      }
    },
    //导出
    exportExcel() {
      this.exportExcelSelectData();
    },
    //导出选中的数据
    exportExcelSelectData() {
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "商品款号",
          "货号",
          "商品名称",
          "商品图片",
          "原始款号",
          "颜色",
          "规格",
          "品牌",
          "库存总量",
          "冻结库存",
          "可用库存",
          "在途库存"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "spu",
          "sku",
          "name",
          "image",
          "原始款号",
          "colorName",
          "sizeName",
          "brandName",
          "quantity",
          "frozenQuantity",
          "availableQuantity",
          "inTransitQuantity"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.multipleSelectionData; //把data里的multipleSelectionData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "门店待对账表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //点击获取子元素插入数组
    childrenIsShow(row) {
      console.log(row);
      let _id = row.id; //当前数据ID
      let _type = row.isType; //状态 1 关闭 0 打开
      if (_type == "1") {
        //当前为关闭状态 需请求接口获取子元素
        row.isType = 0;
        this.getChildData(row, _id);
      } else {
        //当前为打开状态 需删除子元素
        row.isType = 1;
        this.removeChildData(row);
      }
    },
    //获取子集
    getChildData(row, _id) {
      console.log(_id);

      this.signData.productId = _id;
      // {
      //       productId: _id,
      //       inventoryStatus: this.signData.inventoryStatus
      //     }
      let _index = this.tableData.findIndex(item => item.id == _id);
      if (!row._chilren) {
        this.request(
          this.api.warehouse
            .warehouseBase_inventory_getProductGoodsInventoryByProductCode,
          this.signData
        ).then(res => {
          let _data = res.data;
          let _dataLen = _data.length;
          for (let i = 0; i < _dataLen; i++) {
            _data[i].subCode = _data[i].code;
            _data[i].code = null;
          }
          row._chilren = _data;
          //根据下标插入进去 获取ID 在数组中的下标
          this.tableData.splice(_index + 1, 0, ..._data);
          //获取子集id存入 元素属性
          let arr = [];
          for (let { id } of _data) {
            arr.push(id);
          }
          row._cid = arr.join();
        });
      } else {
        this.tableData.splice(_index + 1, 0, ...row._chilren);
      }
    },
    //删除子集
    removeChildData(row) {
      let cid = row._cid;
      let cidArr = cid.split(",");
      let _table = this.tableData,
        tableLen = _table.length;
      for (let i = 0; i < cidArr.length; i++) {
        for (let j = 0; j < this.tableData.length; j++) {
          if (cidArr[i] == this.tableData[j].id) {
            this.tableData.splice(j, 1);
          }
        }
      }
    },
    //每页条数改变时
    handleSizeChange(page) {
      this.signData.pageSize = page;
      this.getTableListData();
    },
    //当前页改变时
    handleCurrentChange(page) {
      this.signData.productId = "";
      this.signData.pageIndex = page;
      this.getTableListData();
    }
  }
};
</script>

<style lang="less" scoped>
.content-from {
  background-color: #fff;
  padding-top: 20px;
  margin: 0 10px;
}
.content-table {
  background-color: #fff;
  padding: 10px 20px;
  margin: 10px;
}
.page_div {
  margin-top: 20px;
  padding-bottom: 10px;
  margin-right: 20px;
  display: flex;
  align-items: center;
}
.pagination {
  margin-top: 20px;
  padding-bottom: 10px;
  margin-right: 20px;
  text-align: right;
}
</style>