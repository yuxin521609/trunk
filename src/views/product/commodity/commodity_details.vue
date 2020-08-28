<!--
 * @Description: 商品详情
 * @Author: elephant
 * @Date: 2019-07-01 15:20:22
 * @LastEditTime: 2020-02-25 15:30:27
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="item-margin bg-fff item-box">
    <!-- 顶部导航 -->
    <div  v-if="!local" class="fixed-item-nav"> 
     <ul>
      <li
        @click="scrollToItem(item,index)"
        :class="toActive == index ? 'active' :'' "
        v-for="(item,index) in topList"
        :key="index"
      >{{item.title}}</li>
    </ul>
    </div>
    <ul class="item-nav">
      <li
        @click="scrollToItem(item,index)"
        :class="toActive == index ? 'active' :'' "
        v-for="(item,index) in topList"
        :key="index"
      >{{item.title}}</li>
    </ul>
    <!-- 顶部导航END -->
    <!-- 基本信息 吊牌信息 -->
      <el-form :model="productFormData" label-width="120px" size="small" ref="productFormDP" inline>
  <basic-and-tag 
  :editDisabled="editDisabled"
  :showDisabled="showDisabled"
  :productFormData="productFormData">
  </basic-and-tag>
  </el-form>
    <!-- 基本信息 吊牌信息END -->
    <!-- 销售信息 -->
    <h5 ref="productInfoRef" class="info">销售信息</h5>
    <el-row>
      <el-form :model="filtersData" label-width="100px" size="small" ref="filtersForm">
        <el-col :span="24">
          <el-form-item v-if="_type != 'add'" prop="Category" label="商品款号:">{{comCode}}</el-form-item>
          <el-form-item
            class="img-form"
            label="颜色："
          >
            <el-cascader
              :disabled="showDisabled"
              class="input-w input-h"
              :options="colorOptions"
              v-model="colorArr"
              :value="colorArr"
              @change="colorArrGet($event)"
              :show-all-levels="false"
              :props="colorProps"
              :emitPath="false"
            ></el-cascader>
            <el-upload-img
              class="ml-5"
              v-if="!showDisabled"
              :disabled="showDisabled"
              lssListType="picture-card"
              v-model="imageUrl"
              CatalogName="product"
            ></el-upload-img>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item v-for="(_key,index) in checkedSizeData" :key="index" :label="_key.name+'：'">
            <el-checkbox-group
              :disabled="_key.disabled"
              @change="handleCheckedChange($event,_key)"
              v-model="_key.checkedSizeList">
              <el-checkbox
                v-for="list in _key.productSpecificationsAttributes"
                :label="list.id"
                :key="list.name"
              >{{list.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label=" ">
            <el-button size="small" :disabled="showDisabled" @click="addSKU">添加SKU</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="24">
        <el-form label-width="100px" size="small" ref="filtersForm" inline>
          <el-form-item label="设置预警：">
            <el-input
              @input.native="setNumber($event)"
              :disabled="showDisabled"
              placeholder="请输入内容"
              v-model="setMinThreshold"
            ></el-input>
          </el-form-item>
          <el-form-item label="吊牌价：">
            <el-input
              @input.native="setNumberPrice($event)"
              :disabled="showDisabled"
              placeholder="请输入内容"
              v-model="setRetailPrice"
            ></el-input>
          </el-form-item>
          <el-form-item label="采购价：">
            <el-input
              @input.native="setNumberPrice($event)"
              :disabled="showDisabled"
              placeholder="请输入内容"
              v-model="setWholesalePrice"
            ></el-input>
          </el-form-item>
          <el-form-item label="进货价：">
            <el-input
              @input.native="setNumberPrice($event)"
              :disabled="showDisabled"
              placeholder="请输入内容"
              v-model="setPurchasePrice"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="mb-20" v-if="!showDisabled" :span="24">
        <el-button size="small" class="left"  @click="updateSKUImg">批量更新图片</el-button>
      </el-col>
      <el-col class="mb-20" :span="24">
        <!-- 销售信息table -->
        <div class="item-details-table">
          <el-table
            :data="salesInforData"
            stripe
            empty-text="暂无数据"
            header-align="center"
            header-row-class-name="item-table-header"
            :highlight-current-row="true"
          >
            <el-table-column prop="code" align="center" label="商品货号" width="150"></el-table-column>
            <el-table-column prop="color" align="center" label="颜色" width="100"></el-table-column>
            <el-table-column prop="size" align="center" label="规格信息" min-width="100"></el-table-column>
            <el-table-column prop="image" align="center" label="图片" min-width="100">
              <template slot-scope="scope">
                <img class="logo-wh" :src="scope.row.image" alt />
              </template>
            </el-table-column>
            <el-table-column prop="minThreshold" align="center" label="库存预警" width="120">
              <template slot-scope="scope">
                <el-input :disabled="showDisabled" v-model="scope.row.minThreshold" v-enter-number></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="retailPrice" align="center" label="吊牌价" width="120">
              <template slot-scope="scope">
                <el-input
                  :disabled="showDisabled"
                  v-model="scope.row.retailPrice"
                  @input.native="setNumberPrice($event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="wholesalePrice" align="center" label="采购价" width="120">
              <template slot-scope="scope">
                <el-input
                  :disabled="showDisabled"
                  v-model="scope.row.wholesalePrice"
                  @input.native="setNumberPrice($event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="purchasePrice" align="center" label="进货价" width="120">
              <template slot-scope="scope">
                <el-input
                  :disabled="showDisabled"
                  v-model="scope.row.purchasePrice"
                  @input.native="setNumberPrice($event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              v-if="!showDisabled"
              fixed="right"
              label-class-name="text-center"
              class-name="text-center"
              align="center"
              label="操作"
              width="120"
            >
              <template slot-scope="scope">
                <el-button
                  @click="editSalesInforImg(scope.row)"
                  type="text"
                  size="small"
                  v-text="scope.row.image == ''?'上传图片':'修改图片'"
                ></el-button>
                <el-button
                  v-if="_type == 'add'"
                  @click="removeSalesInfor(scope.$index)"
                  type="text"
                  size="small"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- 销售信息 END -->
    <!-- 匹配标签 -->
    <h5 ref="productTagsRef" class="info">匹配标签</h5>
    <tag-matching v-model="productTags" ref="tagRef"></tag-matching>
    <!-- 匹配标签 END-->
    <!-- 商城描述 -->
    <h5 ref="productDescriptionRef" class="info">商城描述</h5>
    <div class="description-wrap">
      <com-description
        @setParentImgList="descriptionImgList"
        @setParentVideoList="descriptionVideoList"
        ref="descriptionRef"
      ></com-description>
      <div class="stage-wrap">
        <h5>前台展示：</h5>
        <div class="full">
          <el-radio v-model="productFormData.show" :disabled="showDisabled" :label="true">是</el-radio>
          <el-radio v-model="productFormData.show" :disabled="showDisabled" :label="false">否</el-radio>
        </div>
      </div>
      <div class="stage-wrap">
        <h5>商品类型：</h5>
        <div class="full">
          <el-radio v-model="productFormData.presale" :disabled="showDisabled" :label="false">现货商品</el-radio>
          <el-radio v-model="productFormData.presale" :disabled="showDisabled" :label="true">预售商品</el-radio>
        </div>
      </div>
    </div>
    <!-- 商城描述END -->
    <div class="c_footer">
      <el-button
        size="small"
        v-if="!showDisabled"
        type="primary"
        @click="submitForm('productFormDP')"
      >确认</el-button>
      <el-button size="small" @click="goToReturn">取消</el-button>
    </div>
    <!-- 图片上传 -->
    <tp-upload-img ref="uploadImgCpt"></tp-upload-img>
    <!-- 批量修改SKU图片 -->
    <BtchReplaceImg @imgChange="btchImgChange" ref="BtchReplaceImgRef"></BtchReplaceImg>
  </div>
</template>
<script>
//引入基本信息和吊牌信息
import CommondityBasicAndTag from "../components/CommondityBasicAndTag";
//上传图片
import ElUploadImg from "@/components/uploadImg/el_upload_img";
//table上传图片
import UpLoadImgTP from "@/components/uploadImg/table_upload_img.vue";
//匹配标签
import TagMatching from "../components/tagMatching.vue";
//引入详情描述 图片视频
import ComDescription from "../components/commondity_description.vue";
// 批量替换图片
import BtchReplaceImg from "../components/BtchReplaceImg.vue";

//条件判断
import { numberPrice, inputNumber } from "@/utils/validate";
export default {
  /**
   * 商品详情 添加商品 修改商品 用一个页面
   */
  components: {
    [UpLoadImgTP.name]: UpLoadImgTP,
    ElUploadImg,
    TagMatching,
    [CommondityBasicAndTag.name]:CommondityBasicAndTag,
    ComDescription,
    BtchReplaceImg
  },
  data() {
    let that=this;
    return {
      //顶部固定
      local: true,
      //顶部点击
      toActive: "0",
      topList: [
        { title: "基本信息", _ref: "productFormDP" },
        { title: "销售信息", _ref: "productInfoRef" },
        { title: "匹配标签", _ref: "productTagsRef" },
        { title: "商城描述", _ref: "productDescriptionRef" }
      ],
      //跳页状态
      comCode: "",
      _type: "",
      cateId: "",
      productId: "",
      //查看状态
      editDisabled: false,
      showDisabled: false,
      filtersData: {},
      //复选框数据
      checkedSizeData: [],
      //一下是测试数据
      //销售信息数据
      salesInforData: [],
      colorProps: {
        lazy: true,
        lazyLoad (node, resolve) {
          that.getColorList(node,resolve);
        }
      },
      colorOptions:[],
      allColorList:[],
      colorArr: [],
      //颜色已选数组
      colorSelectData: [],
      //  提交的时候也用这个字段 基本信息使用
      // productInfoAttrs: [
      //   {
      //     productName: "测试003", //(商品名称/品名)
      //     infoName: "测02", //(基本信息名称)
      //     infoId: "7ce27322-ead1-4958-8e45-4089849a1503", //(基本信息ID)
      //     infoAttrName: "测02", //(基本信息内容名称)
      //     infoAttrId: "7ce27322-ead1-4958-8e45-4089849a1503" //(基本信息内容ID)
      //   }
      // ],
      //后台提交数据
      productFormData: {
        description: "",
        image: "", //商品图片
        originalCode: "", //原始款号
        cateId: "", //分类ID
        safetyGrade: "", //安全类别
        level: "", //等级
        performanceStandard: "", //执行标准
        qualityInspector: "01", //检验员
        designCompanyId: "", //设计商
        designCompanyCode:"",
        designCompanyName: "", //设计商名称
        ownerId:'',//货主ID
        ownerCode:'',
        ownerName:'',//货主名称
        name: "", //品名
        brandId: "", //品牌ID
        brandCode:"",
        brandName: "", //品牌名称
        tagBrandCode:"",//打印品牌
        tagBrandId:"",
        tagBrandName:"",
        postalCode: "", //邮编
        brandOwnerId:"",
        brandOwnerName: "", //品牌商
        brandOwnerCode:'',
        brandOwnerAddress: "", //地址
        ingredients: "", //配料
        fabric: "", //面料
        lining: "", //里料
        filler: "", //填充物
        popularYear: "", //流行年份
        seasonalStyle: "", //季节波段
        seasonalStyleCode:"",
        productInfoAttrs: null, //基本信息数组
        productGoodses: null, //货品信息列表 毕传
        productTags: null, //匹配标签列表 毕传
        productImages: null, //产品图片列表
        productVideos: null, //产品视频列表
        show: false,
        presale:false,//商品类型  true=>预售  false=>现货
      },
      //匹配标签数据
      specificationsType: false,
      //定义生成笛卡尔所需的数据结构 规格数据结构可以先做测试
      specificationsData: [],
      list: [],
      setMinThreshold: null, //设置最小预警
      setRetailPrice: null, //设置吊牌价格
      setWholesalePrice: null, //设置采购价格
      setPurchasePrice: null, //设置进货价格
      imageUrl: "", //图片存的字符串
      productTags: [] //标签子组件返回的数据
    };
  },
  created() {
    this.getParams(); 
    this.getSpecifications();
     //颜色
    this.getColorOptions();
    this.getAllColorList();
  },
  mounted() {
    window.addEventListener("scroll", this.btn_pos);
  },
  methods: {
    setNumberPrice(_t) {
      numberPrice(_t);
    },
    setNumber(_t) {
      inputNumber(_t);
    },
    /**
     * 1,当规格多选框发生改变时触发的事件  第一个参数 返回选中的数组  第二个参数 是在原==父数组中的下标
     * 2,根据当前的数据 生成所需的数据 放入生成笛卡尔积数组
     * 3,valArr//选择的数组   elem 当前数组源
     */
    handleCheckedChange(valArr, elem) {
      //如果当前选择有值 禁用除当前之外的筛选
      if(valArr.length >=1){
          for (let i = 0; i < this.checkedSizeData.length; i++) {
            if( this.checkedSizeData[i].id !=  elem.id){
                this.checkedSizeData[i].disabled=true;
            }
          }
      }else{ //否则清空禁用
          for (let i = 0; i < this.checkedSizeData.length; i++) {
            this.checkedSizeData[i].disabled=false;
          }
      }
      let elem_id = elem.id;
      let Attributes = elem.productSpecificationsAttributes;
      let index = this.specificationsData.findIndex(item => item.id == elem_id);
      //因为arr每次是新的数组 对下标的数组清空处理
      this.specificationsData[index].attrs = [];
      //找到对应的对象 放入数据
      for (let i = 0; i < valArr.length; i++) {
        let checkedObj = Attributes.find(item => item.id == valArr[i]);
        this.specificationsData[index].attrs.push({
          attrCode: checkedObj.code,
          attrId: checkedObj.id,
          attr: checkedObj.name,
          attrSize: checkedObj.size
        });
      }
    },
     //颜色
    getColorOptions() {
      this.request(this.api.product.colorSeries_list, {},true).then(res => {
        let _data = res.data;
        let colorList = _data.map((item, i) => ({
          value: item.id,
          label: item.name,
          leaf: false,
          }));
         this.colorOptions = colorList;
      });
    },
     getColorList(node,resolve){
      if(!node.value)return;
       this.request(this.api.product.color_list, {seriesId:node.value},true)
        .then(res => {
          let _data = res.data;
          let colorList = _data.map((item, i) => ({
            value: item.code,
            label: item.name,
            leaf: true
          }));
          resolve(colorList);
        })
    },
    getAllColorList(){
      this.request(this.api.product.color_list, {},true)
      .then(res => {
        let _data = res.data;
        this.allColorList=_data;
      })
    },
    //颜色发生改变后的数据 //改变的数据 
    colorArrGet(valArr) {
      if (valArr.length <= 1) {
        this.$message({
          type: "info",
          message: "请选择子类"
        });
        return false;
      }
      //找到color 的对象
      let colorCode =this.$common.deepCopy(valArr).pop();
      let colorObj = this.allColorList.find(
        item => item.code == colorCode
      );
      //找到 生成笛卡尔积  //找到 存储的对象
      let spData = this.specificationsData;
      //console.log(spData);
      let spIndex = spData.findIndex(item => item.id == 'myColorId');
      //先判断是否含有当前颜色 有的话 毙掉
      let colorIndex = spData[spIndex].attrs.find(
        item => item.attrCode == colorCode
      );
      spData[spIndex].attrs = [];
      //无重复颜色
      spData[spIndex].attrs.push({
        attrCode: colorObj.code,
        attrId: colorObj.id,
        attr: colorObj.name
      });
    },
    // 添加规格表格
    getTable() {
      this.list = []; // list  处理数组  去掉title //只存子集 attrs
      //声明个新的原数组  深复制一下 删除空的元素
      let primaryData = [];
      this.specificationsData.forEach(item => {
        if (item.attrs.length > 0) {
          this.list.push(item.attrs);
          primaryData.push(item);
        }
      });
      // console.log(this.list)//获得到了子集
      //声明空数组  递归获取的 笛卡尔积数据  [[]] 数组嵌套数组结构
      //[0: (3) ["红色", "M", "好"]]
      var arr = [];
      var that = this;
      //定义递归方法  从获取单一字符串 改成对象
      function func(skuarr = [], i) {
        for (let j = 0; j < that.list[i].length; j++) {
          if (i < that.list.length - 1) {
            skuarr[i] = that.list[i][j]; //hat.list[i][j].attr
            func(skuarr, i + 1);
          } else {
            arr.push([...skuarr, that.list[i][j]]);
          }
        }
        return arr;
      }
      //声明新list 等于   [0: (3) ["红色", "M", "好"]]
      let newList = func([], 0);
      let tableList = [];
      //group 排序好的结构 好放入 table 中调用 group
      newList.forEach(item => {
        let tableItem = new Object();
        tableItem.wholesalePrice = "";
        tableItem.minThreshold = "";
        tableItem.retailPrice = "";
        tableItem.purchasePrice = "";
        tableItem.image = this.imageUrl;
        tableItem.color = "";
        tableItem.colorCode = "";
        tableItem.size = item[0].attr;
        tableItem.sizeCode = item[0].attrCode;
        tableItem.sizeAttribute = item[0].attrSize;
        tableItem.productGoodsSpecifications = [];
        for (let i = 0; i < primaryData.length; i++) {
          // console.log( primaryData[i]);
          // console.log( item[i]);
          if (primaryData[i].title == "颜色") {
            tableItem.color = item[i].attr;
            tableItem.colorCode = item[i].attrCode;
          }
          // if (primaryData[i].id == this.specificationsData[0].id) {
          // }
          tableItem.productGoodsSpecifications.push({
            specificationsId: primaryData[i].id,
            specificationsName: primaryData[i].title,
            specificationsAttributeId: item[i].attrId,
            specificationsAttributeIdName: item[i].attr
          });
        }
        tableList.push(tableItem);
      });
      //处理给颜色增加色系  真坑
      let codeList=this.allColorList;
      function getColorSeriesData(code, type) {
        let obj = codeList.find(item => item.code == code);
        if (type == "name") {
          return obj.seriesName;
        } else {
          return obj.seriesId;
        }
      }
      for (let i = 0; i < tableList.length; i++) {
        tableList[i].colorSeries = getColorSeriesData(
          tableList[i].colorCode,
          "name"
        );
        tableList[i].colorSeriesId = getColorSeriesData(
          tableList[i].colorCode,
          "id"
        );
      }
      // console.log(tableList);
      let infoData = this.salesInforData,
        infoLen = infoData.length; //table 数组
      let tableListLen = tableList.length;
      if (infoLen >= 1) {
        for (let i = 0; i < infoLen; i++) {
          for (let k = 0; k < tableListLen; k++) {
            if (
              infoData[i].colorCode == tableList[k].colorCode &&
              infoData[i].sizeCode == tableList[k].sizeCode
            ) {
              this.$message({
                message:
                  "已有重复规格：" +
                  tableList[k].size +
                  "，颜色：" +
                  tableList[k].color,
                type: "warning"
              });
              return false;
            }
          }
        }
        this.salesInforData.push(...tableList);
      } else {
        this.salesInforData = tableList;
      }
    },
    //// 取到路由带过来的参数
    getParams() {
      let _qurey = this.$route.query;
      this._type = _qurey._type;
      this.cateId = _qurey.cateId;
      this.productId = _qurey.productId;
      let itemStatus = _qurey._type;
      // console.log(itemStatus);
      switch (itemStatus.toString()) {
        case "add":
          this.getBasicData(); //获取基本信息列表
          this.productFormData.cateId = this.cateId;
          this.productFormData.cateName = _qurey.cateName;
          this.productFormData.cateIdentifier = _qurey.cateIdentifier;
          this.productFormData.fullCateName = _qurey.fullCateName;
          this.productFormData.cateCode = _qurey.cateCode;
          this.editDisabled = false;
          this.showDisabled = false;
          break;
        case "edit":
          this.editDisabled = true;
          this.showDisabled = false;
          this.setPromiseAll();
          break;
        case "show":
          this.editDisabled = true;
          this.showDisabled = true;
          this.setPromiseAll();
          break;
      }
    },
    //获取基本信息列表
    getBasicData() {
      this.request(this.api.product.productInformation_list, {
        cateId: this.cateId,
        subset: true,
        valid: true
      }).then(data => {
        let _data = data.data,
          _dataLen = _data.length;
        //创建数组 存入对象
        let productInfo = [];
        for (let i = 0; i < _dataLen; i++) {
          let obj = {};
          obj.productName = "";
          obj.infoName = _data[i].name;
          obj.infoId = _data[i].id;
          obj.infoAttrName = "";
          obj.infoAttrId = "";
          obj._children = _data[i].productInformationAttributes;
          obj.required = _data[i].required;
          productInfo.push(obj);
        }
        // this.productInfoAttrs = productInfo;
        this.productFormData.productInfoAttrs = productInfo;
      });
    },
    //获取规格
    getSpecifications() {
      this.request(this.api.product.productSpecifications_list, {
        cateId: this.cateId,
        subset: true,
        valid: true
      },true).then(data => {
        //获取 颜色 后 添加 生成笛卡尔所需的初始数据 specificationsData
        let _data = data.data;
        for (let i = 0; i < _data.length; i++) {
          _data[i].checkedSizeList = [];
          _data[i].disabled=false;
          //重新排序
          _data[i].productSpecificationsAttributes = _data[i].productSpecificationsAttributes.sort((a, b) => a.sort - b.sort);
          this.specificationsData.push({
            title: _data[i].name,
            id: _data[i].id,
            attrs: []
          });
        }
        this.specificationsData.push({
          title:'颜色',
          id: 'myColorId',
          attrs: []
        });
        //当原数组生成好后开始操作
        this.specificationsType = true;
        this.checkedSizeData = _data;
      });
    },
    //标签处理 懵逼处理
    handleTags() {
      let productTags =
        this.$common.deepCopy(this.productFormData.productTags) || [];
      let tags = this.$common.deepCopy(this.productTags);
      let deleteTags = [];
      for (let i = 0; i < productTags.length; i++) {
        let flag = false;
        for (let k = 0; k < tags.length; k++) {
          if (productTags[i].tagId == tags[k].tagId) {
            flag = true;
            tags[k] = productTags[i];
            break;
          }
        }
        if (!flag) {
          productTags[i].status = 9;
          deleteTags.push(productTags[i]);
        }
      }
      this.productFormData.productTags = [...deleteTags, ...tags];
    },
    //新增
    submitForm(formName) {
      if (this.salesInforData.length <= 0) {
        this.$message({
          message: "货品必须录入",
          type: "error"
        });
        return;
      }
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          //标签 处理
          this.handleTags();
          this.productFormData.productGoodses =
            this.salesInforData.length > 0 ? this.salesInforData : null;
            if(!!this.productFormData.productImages){
                for (let i = 0; i < this.productFormData.productImages.length; i++) {
                this.productFormData.productImages[
                  i
                ].productName = this.productFormData.name;
              }
            }
            if(!!this.productFormData.productVideos){
              for (let i = 0; i < this.productFormData.productVideos.length; i++) {
                this.productFormData.productVideos[
                  i
                ].productName = this.productFormData.name;
              }
            }
          let josnFormData = JSON.parse(JSON.stringify(this.productFormData));
          let Attrs = josnFormData.productInfoAttrs;
          for (let i = 0; i < Attrs.length; i++) {
            delete Attrs[i]._children;
          }
          this.request(this.api.product.product_save, josnFormData).then(
            data => {
              this.$message.success("保存成功");
              setTimeout(() => {
                this.goToReturn();
              }, 500);
            }
          );
        } else {
          this.$message({
            message: "请填入必填字段",
            type: "error"
          });
          return false;
        }
      });
    },
    setPromiseAll() {
      Promise.all([this.getShowBasicData(), this.getProductData()])
        .then(res => {
          //获取根据ID返回的数据
          this.productLogic(res[1]);
          //获取基本信息的数据
          this.basicLogic(res[0]);
        })
    },
    //修改 查看 数据
    getProductData() {
      return new Promise((resolve, reject) => {
        this.request(this.api.product.product_get, { id: this.productId }).then(
          data => {
            resolve(data);
          }
        );
      });
    },
    //查看时基本数据
    getShowBasicData() {
      return new Promise((resolve, reject) => {
        this.request(this.api.product.productInformation_list, {
          cateId: this.cateId,
          subset: true
        },true).then(data => {
          resolve(data);
        });
      });
    },
    //
    basicLogic(data) {
      let _data = data.data,
        _dataLen = _data.length;
      let Attrs = this.productFormData.productInfoAttrs;
      for (let i = 0; i < _dataLen; i++) {
        for (let k = 0; k < Attrs.length; k++) {
          if (_data[i].id == Attrs[k].infoId) {
            Attrs[k]._children = _data[i].productInformationAttributes;
            Attrs[k].required = _data[i].required;
          }
        }
      }
    },
    //根据ID返回的数据
    productLogic(data) {
      let _data = data;
      this.comCode = _data.code;
      this.productFormData = _data;
      this.salesInforData = _data.productGoodses;
      //处理Tags 抽出tagId传入子组件
      let tags = _data.productTags;
      let allIds = [];
      for (let i = 0; i < tags.length; i++) {
        allIds.push({ tagId: tags[i].tagId });
      }
      this.$refs.tagRef.propInit(this.$common.deepCopy(allIds));
      //处理图片视频 放入子组件
      this.$refs.descriptionRef.videoImgPropInit(this.$common.deepCopy(_data),this.showDisabled);
    },
    //添加sku
    addSKU() {
      if (this.specificationsType) {
        let _data = this.specificationsData;
        let _dataLen = _data.length;
        let num = 0;
        for (let i = 0; i < _dataLen; i++) {
          if (_data[i].attrs.length != 0) {
            num += 1;
          }
        }
        if (num >= 2) {
          this.getTable();
        } else {
          this.$message.error("缺少必要的规格！");
        }
      }
    },
    //删除 sku
    removeSalesInfor(index) {
      this.salesInforData.splice(index, 1);
    },
    //上传图片
    editSalesInforImg(row) {
      this.$refs.uploadImgCpt.uploadImgPopupInit(row);
    },
    btn_pos: function() {
      //滚动条的高度
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      // var clientHeight=document.documentElement.clientHeight;
      //滚动条的高度>可视区的高度
      if (scrollTop > 200) {
        this.local = false;
      } else {
        this.local = true;
      }
    },
    // 批量更新SKU图片
    updateSKUImg() {
      if(this.salesInforData.length <= 0){
        this.$message.error("请添加SKU！");
        return false;
      }
      const obj = {};
      let arr = this.$common.deepCopy(this.salesInforData);
      arr = arr.reduce((item, next) => {
        obj[next.colorCode] ? '' : obj[next.colorCode] = true && item.push({
          color:next.color,
          colorCode:next.colorCode
        });
        return item;
      }, []);
      this.$refs.BtchReplaceImgRef.propInit(arr);
    },
    // 批量更新图片发生改变时调用
    btchImgChange(obj){
      for (let i = 0; i < this.salesInforData.length; i++) {
        if(this.salesInforData[i].colorCode == obj.colorCode){
          this.salesInforData[i].image=obj.imgUrl;
        }
      }
    },
    //跳转某地
    scrollToItem(item, index) {
      if(index == this.toActive){
        return;
      }
      this.toActive = index; //event.currentTarget.offsetTop
      const currentY = document.documentElement.scrollTop || document.body.scrollTop;
      let topNum = null;
      switch (index) {
        case 0:
          this.scrollAnimation(currentY, 200);
          break;
        case 1:
          topNum = this.$refs.productInfoRef.offsetTop;
          this.scrollAnimation(currentY, topNum-10);
          break;
        case 2:
          topNum = this.$refs.productTagsRef.offsetTop;
          this.scrollAnimation(currentY, topNum-20);
          break;
        default:
          topNum = this.$refs.productDescriptionRef.offsetTop;
          this.scrollAnimation(currentY, topNum-20);
          break;
      }
      topNum=null;
    },
    /**
     * 动画垂直滚动到页面指定位置
     * @param { Number } currentY 当前位置
     * @param { Number } targetY 目标位置
     */
    scrollAnimation(currentY, targetY) {
      // 计算需要移动的距离
      let needScrollTop = targetY - currentY;
      let _currentY = currentY;
      setTimeout(() => {
        // 一次调用滑动帧数，每次调用会不一样
        const dist = Math.ceil(needScrollTop / 10);
        _currentY += dist;
        window.scrollTo(_currentY, currentY);
        // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
        if (needScrollTop > 10 || needScrollTop < -10) {
          this.scrollAnimation(_currentY, targetY);
        } else {
          window.scrollTo(_currentY, targetY);
        }
      }, 1);
    },
    /**
     * @description: 商品描述
     * @param {type}
     * @return:
     */
    //商品描述图片返回的数据
    descriptionImgList(params) {
      this.productFormData.productImages = params;
    },
    //商品描述视频返回的数据
    descriptionVideoList(params) {
      this.productFormData.productVideos = params;
    },
    //返回
    goToReturn() {
      if (this._type == "edit") {
        this.$router.go(-1);
      } else if (this._type == "add") {
        this.$router.go(-2);
      } else {
        this.$router.go(-1);
      }
    }
  },
  watch: {
    //监听品名变化 放入数据中
    "productFormData.name": function(newVal, oldVal) {
      let _sales = this.productFormData.productInfoAttrs;
      if (_sales <= 0) {
        return;
      }
      for (let i = 0; i < _sales.length; i++) {
        _sales[i].productName = newVal;
      }
    },
    //监听table 设置价格等
    numberChange(item) {
      let _sales = this.salesInforData;
      if (_sales.length <= 0) {
        return false;
      }
      for (let i = 0; i < _sales.length; i++) {
        _sales[i].minThreshold = item.setMinThreshold;
        _sales[i].retailPrice = item.setRetailPrice;
        _sales[i].wholesalePrice = item.setWholesalePrice;
        _sales[i].purchasePrice = item.setPurchasePrice;
      }
    }
  },
  computed: {
    //计算销售信息同设子属性
    numberChange() {
      const {
        setMinThreshold,
        setRetailPrice,
        setWholesalePrice,
        setPurchasePrice
      } = this;
      return {
        setMinThreshold,
        setRetailPrice,
        setWholesalePrice,
        setPurchasePrice
      };
    }
  }
};
</script>
<style lang="less" scoped>
.item-box {
  padding: 0 30px 30px;
}
.fixed-item-nav {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1030;
  height: 64px;
  width: 100%;
  padding: 0 18px 0 212px;
  font-size: 20px;
 
  >ul{
     background: #ffffff;
     height: 64px;
  width: 100%;
   color: #333333;
  display: flex;
  padding-left: 20px;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #c3c7ce;
  }
  li {
    cursor: pointer;
    font-weight: bold;
    margin-right: 50px;
  }

  li.active {
    color: #2290e8;
  }

  li:hover {
    color: #2290e8;
  }
}

.item-nav {
  height: 64px;
  font-size: 20px;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #c3c7ce;
  li {
    cursor: pointer;
    font-weight: bold;
    margin-right: 50px;
  }

  li.active {
    color: #2290e8;
  }

  li:hover {
    color: #2290e8;
  }
}

.basic-wrap {
  margin-top: 25px;
}

.info {
  font-size: 18px;
  color: #000000;
  margin-bottom: 20px;
  border-bottom: 1px solid #eeeeee;
  font-weight: 100;
}
span {
  font-size: 16px;
  color: #999999;
  margin-left: 10px;
  font-weight: 100;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.c_footer {
  width: 100%;
  height: 80px;
  margin-top: 30px;
}
.img-form {
  /deep/.el-form-item__content {
    display: flex;
    align-items: top;
    justify-content: flex-start;
    .input-w {
      margin-right: 10px;
    }
  }
}
.input-w {
  margin-right: 10px;
}

.img-upload {
  display: flex;
  align-items: top;
  justify-content: flex-start;
  margin-right: 10px;
  /deep/ .el-upload-list--picture {
    margin-left: 10px;
    margin-top: -10px;
    max-width: 200px;
    margin-right: 10px;
  }
}
.el-icon-error {
  padding-top: 8px;
}
.description-wrap {
  .label {
    font-size: 14px;
    color: #000000;
  }
}
// 外部
.stage-wrap {
  display: flex;
  width: 100%;
  margin-top: 20px;
  justify-content: flex-start;
  flex-wrap: wrap;
  > h5 {
    font-size: 14px;
    font-weight: 100;
    width: 80px;
    flex: 0 0 auto;
  }
  .full {
    min-width: 500px;
    flex: 1;
  }
}
.input-h{
  height: 35px;
}
.left{
  margin-left: 100px;
}
</style>
