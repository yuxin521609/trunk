<!--
 * @Description: SN码打印记录
 * @Author: elephant
 * @Date: 2019-09-18 15:20:22
 * @LastEditTime : 2019-12-24 11:19:32
 * @LastEditors  : Please set LastEditors
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
        <el-form-item  prop="relationOrgId" label="隶属机构：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.relationOrgId">
            <el-option
              v-for="item in relationDepOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="tagBrandId" label="品牌：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.tagBrandId">
            <el-option
              v-for="item in brandOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="productCode" label="商品款号：">
          <el-input class="input-w" placeholder="请输入内容" v-model="filtersData.productCode"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="商品编码：">
          <el-input class="input-w" placeholder="请输入内容" v-model="filtersData.code"></el-input>
        </el-form-item>
        <el-form-item prop="sn" label="SN码：">
          <el-input class="input-w" placeholder="请输入内容" v-model="filtersData.sn"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="商品名称：">
          <el-input class="input-w" placeholder="请输入内容" v-model="filtersData.name"></el-input>
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
        <el-button size="small" type="primary" @click="batchPrints">批量重打</el-button>
        <el-button plain @click="exportExcel" size="small">导出</el-button>
      </div>
      <div class="item-table">
        <el-table
          :data="tableListData"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="ownerName" align="center" label="货主名称" min-width="100"></el-table-column>
          <el-table-column prop="relationDepName" align="center" label="机构名称" min-width="100"></el-table-column>
          <el-table-column prop="tagBrandName" align="center" label="品牌" min-width="100"></el-table-column>
          <el-table-column prop="productCode" align="center" label="商品款号" min-width="100"></el-table-column>
          <el-table-column prop="code" align="center" label="商品编码" min-width="100"></el-table-column>
          <el-table-column prop="sn" align="center" label="SN码" min-width="100"></el-table-column>
          <el-table-column prop="name" align="center" label="商品名称" min-width="100"></el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button @click="singlePrint(scope.row)" type="text" size="small">重新打印</el-button>
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
    <!-- 打印 -->
    <batch-prints-dialog ref="batchPrintsRef"></batch-prints-dialog>
  </div>
</template>
<script>
import axios from "axios";

import BatchPrintsDialog from "@/components/Prints/BatchPrintsDialog";
import { getToken, TokenKey } from "@/utils/auth";
/**
 * sn打印管理
 */
let selectPrintData = [];
export default {
  components: {
    BatchPrintsDialog
  },
  data() {
    return {
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        productCode: "",
        relationOrgId: "",
        code: "",
        name: "",
        sn: "",
        tagBrandId: "" //品牌ID
      },
      tableListData: [],
      total: null,
      //品牌
      brandOptions: [],
      relationDepOptions: [],
      exportExcelData: []
    };
  },

  created() {
    this.init();
    this.getTableList();
    this.getDepartList();
    this.getBrandOptions();
  },
  methods: {
    init() {
      selectPrintData = [];
      this.exportExcelData = [];
    },
    getDepartList() {
      this.request(this.api.user.userCompany_getUserAllDepartByUserId,{}).then(res => {
        this.relationDepOptions = res;
      });
    },
    getBrandOptions() {
      this.request(this.api.product.productBrand_list, {}).then(data => {
        let _data = data.data;
        this.brandOptions = _data;
      });
    },
    //获取列表
    getTableList() {
      this.request(this.api.product.productGoodsSn_list, this.filtersData).then(
        data => {
          let _data = data.data;
          this.tableListData = _data;
          this.total = data.totalCount;
        }
      );
    },
    //当前选中的数据
    handleSelectionChange(_data) {
      let arr = [];
      for (let i = 0; i < _data.length; i++) {
        arr.push({
          sn: _data[i].sn,
          productGoodsCode: _data[i].code
        });
      }
      selectPrintData = arr;
      this.exportExcelData = _data;
    },
    batchPrints() {
      if (selectPrintData.length > 0) {
        this.$refs.batchPrintsRef.popupInit(selectPrintData);
      } else {
        this.$message.error("请选择要重新打印的数据！");
      }
    },
    //单个打印
    singlePrint(_data) {
      let arr = [{ sn: _data.sn, productGoodsCode: _data.code }];
      this.$refs.batchPrintsRef.popupInit(arr);
    },
    //导出SN
    exportExcel() {
      if (this.exportExcelData.length > 0) {
        require.ensure([], () => {
          let { export_json_to_excel } = require("@/vendor/Export2Excel");
          let tHeader = [
            "机构名称",
            "品牌",
            "商品款号",
            "商品编码",
            "SN码",
            "商品名称"
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "relationDepName",
            "tagBrandName",
            "productCode",
            "code",
            "sn",
            "name"
          ];
          // 上面的index、nickName、name是tableData里对象的属性
          let list = this.exportExcelData; //把data里的multipleSelectionData存到list
          let data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "SN码打印记录");
        });
      } else {
        this.$message.error("请勾选导出的数据");
        //    let filtersData=this.filtersData;
        //  let  formData ={
        //     productCode:filtersData.productCode,
        //     relationOrgId: filtersData.relationOrgId,
        //     code: filtersData.code,
        //     name: filtersData.name,
        //     sn: filtersData.sn,
        //     tagBrandId:filtersData.tagBrandId //品牌ID
        //   };
        //  let url =`http://11.1.1.143:9001/${this.api.product.productGoodsSn_export.url}`;
        //  console.log(this.api.product.productGoodsSn_export);
         
        // axios({
        //     url:url,
        //     data:formData,
        //     method:'post',
        //     headers:{
        //         "accessToken":getToken(),
        //     },
        //     responseType: 'blob', //二进制流
        // }).then(function (res) {
        //     if(!res) return
        //     let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'})
        //     let url = window.URL.createObjectURL(blob);
        //     let aLink = document.createElement("a");
        //     aLink.style.display = "none";
        //     aLink.href = url;
        //     aLink.setAttribute("download", "SN码打印记录.xlsx");
        //     document.body.appendChild(aLink);
        //     aLink.click();
        //     document.body.removeChild(aLink); 
        //     window.URL.revokeObjectURL(url); 
        // }).catch(function (error) {
        //     console.log(error)
        // });
        
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
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
  }
};
</script>
<style lang="less" scoped>
</style>
