<!--
 * @Author:elephant
 * @Date: 2019-11-08 16:51:02
 * @LastEditTime : 2020-01-17 16:12:02
 * @LastEditors  : Please set LastEditors
 * @Description: 商品中心 商品详情 基本信息和吊牌信息详情
 -->
<template>

    <el-tabs v-model="activeName" class="basic-wrap pt-20" type="card">
      <el-tab-pane label="基本信息" name="basic">
        <h5 class="info">
          基本信息
          <!-- <span>上次更新时间2019-02-01</span> -->
        </h5>
        <!-- 基本信息根据款式不同 所属的切换也不同 -->
        <el-form-item
          v-for="(item,index) in productFormData.productInfoAttrs"
          :prop="'productInfoAttrs.' + index + '.infoAttrId'"
          :label="item.infoName+ '：'"
          :key="index"
          :rules="{required: item.required, message: '请选择内容', trigger: 'change'}"
        >
          <el-select
            :disabled="showDisabled"
            placeholder="请选择"
            @change="basicSelectGet"
            class="input-w"
            v-model="item.infoAttrId"
          >
            <el-option
              v-for="list in item._children"
              :key="list.id"
              :label="list.name"
              :value="list.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 基本信息 END -->
      </el-tab-pane>
      <el-tab-pane label="吊牌信息" name="tag">
        <h5 class="info">
          档案归属
          <span></span>
        </h5>
         <el-form-item
          prop="ownerId"
          :rules="{required: true, message: '请选择货主', trigger: 'change'}"
          label="归属货主："
          value-key="code"
        >
          <el-select
            filterable
            :disabled="editDisabled"
            @change="ownerGet"
            class="input-w"
            placeholder="请选择"
            v-model="productFormData.ownerName"
          >
            <el-option
              v-for="(item,index) in ownerOptions"
              :key="index.id"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <h5 class="info">
          吊牌信息
          <span></span>
        </h5>
        <el-form-item
          prop="name"
          :rules="{required: true, message: '请输入品名', trigger: 'blur'}"
          label="品名："
        >
          <el-input
            class="input-w"
            :disabled="showDisabled"
            placeholder="请输入内容"
            v-model="productFormData.name"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="brandName"
          :rules="{required: true, message: '请选择品牌', trigger: 'change'}"
          label="品牌："
        >
          <el-select
            :loading="productStatus.brandLoading"
            @visible-change="handleVisibleChange($event,productStatus.brandActive,'brand')"
            filterable
             value-key="id"
            :disabled="editDisabled"
            @change="brandIdGet"
            class="input-w"
            placeholder="请选择"
            v-model="productFormData.brandName"
          >
            <el-option
              v-for="(item,index) in brandOptions"
              :key="index.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="tagBrandName"
          :rules="{required: true, message: '请选择打印品牌：', trigger: 'change'}"
          label="打印品牌："
        >
          <el-select
            :loading="productStatus.brandLoading"
            @visible-change="handleVisibleChange($event,productStatus.brandActive,'brand')"
            filterable
            value-key="id"
            :disabled="showDisabled"
            @change="tagBrandIdGet"
            class="input-w"
            placeholder="请选择"
            v-model="productFormData.tagBrandName"
          >
            <el-option
              v-for="(item,index) in brandOptions"
              :key="index.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="originalCode"
          :rules="{required: true, message: '请输入原始款号', trigger: 'blur'}"
          label="原始款号："
        >
          <el-input
            v-model="productFormData.originalCode"
            :disabled="editDisabled"
            class="input-w"
            placeholder="请输入原始款号"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="seasonalStyle"
          :rules="{required: true, message: '请选择季节波段', trigger: 'change'}"
          label="季节波段："
        >
          <el-select
            :disabled="editDisabled"
            class="input-w"
            @change="seasonalStyleGet"
            placeholder="请选择"
            v-model="productFormData.seasonalStyle"
          >
            <el-option
              v-for="(item,index) in seasonalStyleOptions"
              :key="index.code"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="popularYear" label="年份：">
          <el-date-picker
            :disabled="showDisabled"
            class="input-w"
            v-model="productFormData.popularYear"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="designCompanyName" label="设计商：">
          <el-select
            :disabled="showDisabled"
            @change="designCompanyGet"
            class="input-w"
            placeholder="请选择"
            :loading="productStatus.designCompanyLoading"
            @visible-change="handleVisibleChange($event,productStatus.designCompanyActive,'designCompany')"
            filterable
            value-key="id"
            v-model="productFormData.designCompanyName"
          >
            <el-option
              v-for="(item,index) in designCompanyOptions"
              :key="index.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="brandOwnerName" label="品牌商：">
          <el-select
            :disabled="showDisabled"
            @change="brandOwnerGet"
            value-key="id"
            :loading="productStatus.brandOwnerLoading"
            @visible-change="handleVisibleChange($event,productStatus.brandOwnerActive,'brandOwner')"
            filterable
            class="input-w"
            placeholder="请选择"
            v-model="productFormData.brandOwnerName"
          >
            <el-option
              v-for="(item,index) in brandOwnerOptions"
              :key="index.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="performanceStandard" label="执行标准：">
           <el-autocomplete
            class="input-w"
            :debounce="500"
            value-key="name"
            v-model="productFormData.performanceStandard"
            :fetch-suggestions="queryPerformanceStandardSearch"
            placeholder="请输入内容"
            @select="handlePerformanceStandardSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item prop="qualityInspector" label="检验员：">
          <el-input
            :disabled="showDisabled"
            class="input-w"
            placeholder="请输入内容"
            v-model="productFormData.qualityInspector"
          ></el-input>
        </el-form-item>
        <el-form-item prop="lining" label="里料：">
          <el-input
            class="input-w"
            :disabled="showDisabled"
            placeholder="请输入内容"
            v-model="productFormData.lining"
          ></el-input>
        </el-form-item>
        <el-form-item prop="ingredients" label="配料：">
          <el-input
            class="input-w"
            :disabled="showDisabled"
            placeholder="请输入内容"
            v-model="productFormData.ingredients"
          ></el-input>
        </el-form-item>
        <el-form-item prop="filler" label="填充物：">
          <el-input
            class="input-w"
            :disabled="showDisabled"
            placeholder="请输入内容"
            v-model="productFormData.filler"
          ></el-input>
        </el-form-item>
        <el-form-item prop="fabric" label="面料：">
          <el-input
            class="input-w"
            :disabled="showDisabled"
            placeholder="请输入内容"
            v-model="productFormData.fabric"
          ></el-input>
        </el-form-item>
        <el-form-item prop="level" label="等级：">
          <el-input
            class="input-w"
            :disabled="showDisabled"
            placeholder="请输入内容"
            v-model="productFormData.level"
          ></el-input>
        </el-form-item>
        <el-form-item prop="postalCode" label="邮编：">
          <el-input
            class="input-w"
            :disabled="showDisabled"
            placeholder="请输入内容"
            v-model="productFormData.postalCode"
          ></el-input>
        </el-form-item>
        <el-form-item prop="safetyGrade" label="安全类别：">
          <el-autocomplete
            class="input-w"
            :debounce="500"
            value-key="name"
            v-model="productFormData.safetyGrade"
            :fetch-suggestions="querySafetyGradeSearch"
            placeholder="请输入内容"
            @select="handleSafetyGradeSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item prop="brandOwnerAddress" label="地址：">
          <el-input
            type="textarea"
            class="input-w-2"
            :disabled="showDisabled"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="productFormData.brandOwnerAddress"
          ></el-input>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
  
</template>
<script>
export default {
  name: "basic-and-tag",
  props: {
    productFormData: {
      type: Object
    },
    editDisabled:{
        type:Boolean,
        default:false
    },
    showDisabled:{
        type:Boolean,
        default:false
    },
  },
  data() {
    return {
      //商品状态集合
      productStatus: {
        brandActive: false,
        brandLoading: true,
        brandOwnerActive: false,
        brandOwnerLoading: true,
        DesignCompanyActive: false,
        DesignCompanyLoading: true
      },
      activeName:"tag",
      //标签切换默认
      brandOptions: [], //品牌
      brandOwnerOptions: [], //品牌商
      designCompanyOptions: [], //设计商
      ownerOptions: [],//货主
    };
  },
  created() {
    //获取货主
    this.getOwnerOptions();
  },
  methods: {
    //做延时加载下拉数据
    handleVisibleChange(type, active, str) {
      if (!!type) {
        if (!active) {
          switch (str) {
            //品牌
            case "brand":
              this.productStatus.brandActive = true;
              this.productStatus.brandLoading = false;
              this.getBrandOption();
              break;
            //品牌商
            case "brandOwner":
              this.productStatus.brandOwnerActive = true;
              this.productStatus.brandOwnerLoading = false;
              this.getBrandOwnerOption();
              break;
            //设计商
            case "designCompany":
              this.productStatus.designCompanyActive = true;
              this.productStatus.designCompanyLoading = false;
              this.getDesignCompanyOption();
              break;
            default:
              break;
          }
        }
      }
    },
    //获取货主
    getOwnerOptions(){
       this.request(this.api.warehouse.warehouseBase_goodsOwner_list, {valid: true,orderBy:'create_time'},true).then(
        res => {
          this.ownerOptions = res.data;
        }
      );
    },
    //获取设计商
    getDesignCompanyOption() {
      this.request(
        this.api.product.designCompany_list,
        { valid: true },
        true
      ).then(data => {
        let _data = data.data;
        this.designCompanyOptions = _data;
      });
    },
    //获取品牌商
    getBrandOwnerOption() {
      this.request(
        this.api.product.productBrandOwner_list,
        {
          valid: true
        },
        true
      ).then(data => {
        let _data = data.data;
        this.brandOwnerOptions = _data;
      });
    },
    //试试获取封装属性
    //品牌商ID改变时获取ID 同时赋值name
    brandOwnerGet(val) {
      let _obj = this.brandOwnerOptions.find(item => item.id == val);
      this.productFormData.brandOwnerName = _obj.name;
      this.productFormData.brandOwnerId= _obj.id;
      this.productFormData.brandOwnerCode = _obj.code;
      this.productFormData.brandOwnerAddress = _obj.address;
      this.productFormData.postalCode = _obj.postalCode;
    },
    //获取品牌
    getBrandOption() {
      this.request(
        this.api.product.productBrand_list,
        { valid: true },
        true
      ).then(data => {
        let _data = data.data;
        this.brandOptions = _data;
      });
    },
    //货主id 
    ownerGet(val){
      let _obj = this.ownerOptions.find(item => item.code == val);
      this.productFormData.ownerName = _obj.name;
      this.productFormData.ownerCode = _obj.code;
      this.productFormData.ownerId = _obj.code;

    },
    //品牌ID改变时获取ID 同时赋值name
    brandIdGet(val) {
      let _obj = this.brandOptions.find(item => item.id == val);
      this.productFormData.brandName = _obj.name;
      this.productFormData.brandCode = _obj.code;
      this.productFormData.brandId = _obj.id;
    },
    tagBrandIdGet(val) {
      let _obj = this.brandOptions.find(item => item.id == val);
      this.productFormData.tagBrandName = _obj.name;
      this.productFormData.tagBrandCode = _obj.code;
      this.productFormData.tagBrandId =  _obj.id;
    },
    //设计商ID改变时获取ID 同时赋值name
    designCompanyGet(val) {
      let _obj = this.designCompanyOptions.find(item => item.id == val);
      this.productFormData.designCompanyName = _obj.name;
      this.productFormData.designCompanyCode = _obj.code;
      this.productFormData.designCompanyId = _obj.id;

    },
    //季节波段
    seasonalStyleGet(name) {
      let seasonal = this.seasonalStyleOptions.find(item => item.name == name);
      this.productFormData.seasonalStyleCode = seasonal.code;
    },
    //安全类别选择
    handleSafetyGradeSelect(item){
     // console.log(item);
    },
    //安全类别搜索
    querySafetyGradeSearch(queryString,cb){
      if(!!queryString){
        this.request(
          this.api.product.safetyGrade_list,
          { searchWords: queryString },
          true
        ).then(res => {
              cb(res.data)
        });
      }
    },
    //执行标准搜索
    queryPerformanceStandardSearch(str,cb){
      if(!!str){
        this.request(
          this.api.product.performanceStandard_list,
          { searchWords: str },
          true
        ).then(res => {
            cb(res.data)
        });
      }
    },
    //执行标准选择
    handlePerformanceStandardSelect(item){
    },
    //基本信息存储默认值
    basicSelectGet(vId) {
      let obj = {};
      let basicData = this.productFormData.productInfoAttrs,
        basicLen = basicData.length;
      for (let i = 0; i < basicLen; i++) {
        obj = basicData[i]._children.find(item => {
          //这里的userList就是上面遍历的数据源
          return item.id === vId; //筛选出匹配数据
        });
        if (obj) {
          break;
        }
      }
      //找到匹配数组的下标
      let index = this.productFormData.productInfoAttrs.findIndex(
        elem => elem.infoAttrId == vId
      );
      //补充数组数据
      this.productFormData.productInfoAttrs[index].infoAttrName = obj.name;
    },
  },
  computed: {
    //季节波段
    seasonalStyleOptions() {
      let codeSet = this.$store.getters.codeData;
      if (codeSet.PRO001) {
        return codeSet.PRO001.codeItemList;
      }
    }, //执行标准
    // performanceStandardOptions() {
    //   let codeSet = this.$store.getters.codeData;
    //   if (codeSet.PRO002) {
    //     return codeSet.PRO002.codeItemList;
    //   }
    // },
  }
};
</script>
<style lang="less" scoped>
</style>