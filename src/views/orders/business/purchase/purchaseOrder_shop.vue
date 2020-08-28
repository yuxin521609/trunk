<template>
  <div class="base">
    <div class="title">
      <i class="el-icon-back" @click="backToPreRoute"></i>
      <span>选择商品</span>
    </div>
    <!--主题-->
    <div class="content">
      <el-form :inline="true" :model="formInline" @submit.native.prevent>
        <!--查询条件-->
        <div class="organizationVal-div">
          <el-form-item label="查找商品：">
            <el-input
              v-model="formInline.searchWords"
              @keyup.enter.native="searchShopWithKey"
              placeholder="快速搜索商品"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <!--分类-->
      <span class="category-span">分类</span>
      <div class="category-span-all" :style="{'min-height':allCategoryHeight?'180px':''}">
        <div v-for="(item,index) in categoryList" :key="index">
          <div class="all" v-show="item.view" v-if="item.list && item.list.length > 0">
            <div class="shop-brand">
              <span>{{index+1 | categoryNumber}}级分类：</span>
              <span
                class="i-cursor"
                @click="categoryAllClick(item,index,$event)"
                :class="item.isSelect?'selcte_color':'normal_color'"
              >全部</span>
            </div>
            <div class="all-brand" :style="{'height':categoryIndex!=index?'25px':''}">
              <ul>
                <li
                  v-for="(elem,_index) in item.list"
                  :class="elem._type ==true?'selcte_color':'normal_color'"
                  @click.stop="categoryBrandLiClick(item,index,elem,_index)"
                  :key="_index"
                >{{elem.name}}</li>
              </ul>
            </div>
            <div class="category-more" @click="categoryMoreClick(index)">
              <span>更多</span>
              <i v-if="categoryIndex!=index" class="el-icon-arrow-down"></i>
              <i v-else class="el-icon-arrow-up"></i>
            </div>
            <div class="category-more" v-show="index==2" @click="categoryMoreRightClick(index)">
              <span>更多分类</span>
              <i v-show="isRightCategory" class="el-icon-arrow-down"></i>
              <i v-show="!isRightCategory" class="el-icon-arrow-up"></i>
            </div>
          </div>
        </div>
      </div>
      <!--区分线-->
      <label class='line'></label>
      <!--品牌列表-->
      <span class="brand-span">品牌</span>
      <div class="all">
        <div class="shop-brand ">
          <span>商品品牌：</span>
          <span
            @click="allBrandShopClick"
            :class="allBrand_index==-1?'selcte_color':'normal_color'"
          >全部</span>
        </div>
        <div :class="allBrand?'all-brand-p item-b':'all-brand-p item-n'" >
          <ul>
            <li
              :class="brand_index==index?'selcte_color':'normal_color'"
              v-for="(item,index) in allBrandDataArr"
              @click.stop="allBrandLiClickEvent(index)"
              :key="index"
            >{{item.name}}</li>
          </ul>
        </div>
        <div class="all-brand-more" @click="showArrowUpClick">
          <span>更多品牌</span>
          <i v-show="!isArrowShowUp" class="el-icon-arrow-down"></i>
          <i v-show="isArrowShowUp" class="el-icon-arrow-up"></i>
        </div>
      </div>
    </div>
    <!--商品-->
    <div class="shop">
      <div class="tip-title">
        <span>全部></span>
        <span>已加入{{allTotal}}件商品</span>
      </div>
      <div class="shop-content" @scroll="shopContentScroll" ref="shopContent">
        <!-- 显示独立数据 -->
        <div class="show-specific-shop" v-for="(item,index) in productData" :key="index">
          <div>
            <img :src="item.image" alt="占位图">
          </div>
          <div class="shop-specific-title">
            <span>{{item.name}}</span>
            <span>进货价：{{item.purchasePrice}}</span>
            <!-- <span style="font-size:12px;">库存量：{{item.stock}}</span> -->
          </div>
          <label class="add_icon" @click="addLabelClickEvent(item.id,index)">＋</label>
        </div>
      </div>
    </div>
    <!--统计-->
    <div class="bottom_view" v-if="showContineBtn">
      <div class="left-bottom">
        <span>合计商品件数：</span>
        <span>{{allTotal}}</span>
        <span>件</span>
        <span
          v-if="bottomTableData.length>0"
          @click="clickShowBottomModel"
        >{{isShowBottomTableModel?'收起':'展开'}}</span>
      </div>
      <div class="right-bottom">
        <el-button type="primary" size="small" @click="successBtnClickEvent">确认</el-button>
        <el-button plain size="small" @click="cancleBtnClcikEventToBackPrePage">取消</el-button>
      </div>
    </div>
    <!--提交-->
    <div class="bottom_view" v-else>
      <div class="contine-btn">
        <el-button type="primary" size="small" @click="continueBtnClickEvent">继续选择</el-button>
        <el-button plain size="small" @click="cancleBtnClcikEvent">取消</el-button>
      </div>
    </div>

    <!--根据商品类型查询的商品数据-->
    <transition name="el-zoom-in-bottom">
      <div v-show="showZoomTable" class="transition-table">
        <span style="display:inline-block;margin:10px 0 10px 10px;">{{shopName}}</span>
        <div class="table-div">
          <el-table :data="productGoodsData" header-row-class-name="item-table-header" width="100%" height="270">
            <el-table-column prop label="商品图片" width="100">
              <template slot-scope="scope">
                <img :src="scope.row.image" style="width:64px;height:64px;">
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
            <el-table-column prop label="商品类型" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.type!=null?scope.row.type:'成品'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="fullCateName" label="商品类目" align="center"></el-table-column>
            <el-table-column prop="code" label="商品货号" align="center"></el-table-column>
            <el-table-column prop label="规格属性" align="center">
              <template slot-scope="scope">
                <span>颜色：{{scope.row.color}}</span>
                <br>
                <span>尺寸：{{scope.row.size}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="availableQuantity" label="库存数量" align="center"></el-table-column> -->
            <el-table-column label="进货价" align="center">
              <template slot-scope="scope">
                <span>￥{{scope.row.purchasePrice}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="数量" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.num"
                  @change="shopNumberChange"
                  :min="0"
                  style="width:150px;line-height:30px;"
                  v-enter-number
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </transition>

    <!-- 展示的是本地缓存的数据 -->
    <!--选中的商品-->
    <transition name="el-zoom-in-bottom">
      <div v-show="isShowBottomTableModel" class="transition-table">
        <!-- <span style="display:inline-block;margin:10px 0 10px 10px;">{{shopName}}</span> -->
        <div class="table-div">
          <el-table
            :data="bottomTableData"
            style="width: 100%"
             height="250"
            header-row-class-name="item-table-header"
          >
            <el-table-column prop="date" label="商品图片" width="160">
              <template slot-scope="scope">
                <img :src="scope.row.image" style="width:64px;height:64px;">
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width="150" align="center"></el-table-column>
            <el-table-column prop="code" label="商品货号" width="260" align="center"></el-table-column>
            <el-table-column prop="color" label="商品规格" width="260" align="center">
              <template slot-scope="scope">
                <span>颜色：{{scope.row.color}}</span>
                <br>
                <span>尺寸：{{scope.row.size}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="purchasePrice" label="单价" width="160" align="center"></el-table-column>
            <el-table-column prop="stock" label="数量" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.num"
                  @change="bottomShopNumberChange"
                  :min="0"
                  style="width:150px;line-height:30px;"
                  v-enter-number
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import { constants } from "crypto";
import treeDept from "@/components/treeDept";
import { debuglog } from "util";
let sourceCategoryList = [];
export default {
  components: {
    treeDept
  },
  data() {
    return {
      //控制继续选择
      showContineBtn: true,
      // 获取商品参数
      formInline: {
        //全部商品--当前页
        pageIndex: 1,
        //全部商品--当前页显示数据
        pageSize: 30,
        //输入的搜索内容
        searchWords: "",
        //所属机构
        ownerId: "",
        //分类的Id
        cateIdentifier: "",
        //记录选中的品牌id
        brandId: "",
        //是否查询有效状态值
        validStock:0
      },

      /**
       * 分类
       **/
      // 分类数据
      categoryList: [],
      //是否显示上拉箭头
      isArrowShowUp:false,
      //分类的初始高度
      allCategoryHeight:true,
      //三级更多分类品牌icon的下标
      isRightCategory:true,
      //记录品牌icon的下标   分类的icon下标
      categoryIndex:-1,

      /**
       * 品牌
       **/
      //品牌数据
      allBrandDataArr: [],
      //全部的下标
      allBrand_index: -1,
      //全部下的分类下标
      brand_index: -1,
      //更多品牌的初始高度
      initialHeight:true,
      // 品牌的下拉箭头
      allBrand:false,

      /**
       * 商品
       **/
      //商品名称
      shopName: "",
      //全部商品数据
      productData: [],
      //全部商品总数
      allProductCount: "",
      //标识是否展开选中商品的数据
      isShowBottomTableModel: false,
      //底部弹起的data的数据  选中商品的数据
      bottomTableData: [],
      //临时的底部数据（单独给取消使用）
      bottomTempTableData:[],
      //是否显示动画
      showZoomTable: false,
      //请求的tabbleData数据  根据商品类型查询的商品数据
      productGoodsData: [],
      //总的数量 商品选中的
      allTotal: 0,
    };
  },
  created() {
    //得到全部品牌数据
    this.getProductBrandListData();
    //得到分类品牌数据
    this.getCategoryListData();
    //得到全部商品数据
    this.getProductAvailableQuantityListData();
  },
  mounted() {
    this.pageShow();
  },
  filters: {
    categoryNumber(val) {
      switch (val) {
        case 1:
          return "一";
          break;
        case 2:
          return "二";
          break;
        case 3:
          return "三";
          break;
        case 4:
          return "四";
          break;
      }
    }
  },
  methods: {
    // 初始化
    pageShow() {
      //得到货主信息
      // this.formInline.ownerId = this.$route.query.ownerId;
      if (localStorage.getItem("localTableData")) {
        this.bottomTableData = JSON.parse(
          localStorage.getItem("localTableData")
        );
        this.allTotal=0
        this.bottomTableData.forEach(item=>{
          this.allTotal+=item.num
        })
      }
    },
    //点击回车键发起搜索
    searchShopWithKey() {
      this.getProductAvailableQuantityListData();
    },
    //返回新增页面
    backToPreRoute() {
      this.cancleBtnClcikEventToBackPrePage()
    },

    /**
     * 分类
     **/
    //得到分类数据
    getCategoryListData() {
      this.request(this.api.product.categories_list, { type: 1 }).then(data => {
        //存储分类品牌数据
        let _data = data.data;
        let level = 0;
        let calssArr = this.getCurrentCategoryClassArr(_data, level);
        sourceCategoryList = [...calssArr];
        this.categoryList = calssArr;
        for (var i = 0; i < this.categoryList.length; i++) {
          if (i < 3) {
            this.categoryList[i].view = true;
          }
          if (i >= 3) {
            this.categoryList[i].view = false;
          }
        }
      });
    },
    //分类的点击事件
    categoryBrandLiClick(item, index, elem, _index) {
      // 重置商品全部选中
      this.allBrand_index = -1;
      this.brand_index = -1;
      this.formInline.brandId = ''
      this.formInline.pageIndex=1
      item.isSelect = false;
      item.identifier = elem.identifier
      //替换样式
      for (let k = 0; k < item.list.length; k++) {
        item.list[k]._type = false;
      }
      elem._type = true;
      // 如果是最后一级 不再刷新分类
      if (index != this.categoryList.length - 1) {
        // 刷新分类
        this.getCurrentCategoryChildData(index, elem);
      }
      // 获取选中的分类
      this.formInline.cateIdentifier = elem.identifier
      // 刷新品牌
      this.getProductBrandListData()
      // 刷新商品数据
      this.getProductAvailableQuantityListData();
    },
    // 初始化分类数据
    getCurrentCategoryClassArr(__data, _level) {
      let arr = [];
      function getClassArr(__data, _level) {
        let arr1 = [],
          arr2 = [];
        for (let i = 0; i < __data.length; i++) {
          if (_level == __data[i].level) {
            arr1.push(__data[i]);
          } else if(_level < __data[i].level ){
            arr2.push(__data[i]);
          }
        }
        arr.push({ isSelect: true, list: arr1, identifier: '', level: _level});
        if (arr2.length > 0) {
          _level++;
          getClassArr(arr2, _level);
        }
      }
      getClassArr(__data, _level);
      return arr;
    },
    //得到当前点击子类下的所有子类数据
    getCurrentCategoryChildData(index, elem) {
      this.request(this.api.product.categories_list, {
        type: 1,
        identifier: elem.identifier
      }).then(res => {
        let _data = res.data;
        let level = elem.level;
        let list = this.getCurrentCategoryClassArr(_data, level+1);
        if (list.length > 0) {
          this.categoryList.splice(index + 1,sourceCategoryList.length-1, ...list);
        }else{
          this.categoryList.splice(index + 1,sourceCategoryList.length-1,{ isSelect: true, list: [] });
        }
        for (var i = 0; i < this.categoryList.length; i++) {
          if (i < 3) {
            this.categoryList[i].view = true;
          }
          if (i >= 3) {
            this.categoryList[i].view = false;
          }
        }
      });
    },
    //分类的全部按钮
    categoryAllClick(item, index, e) {
      // 选中全部
      item.isSelect = true
      // 页码重置
      this.formInline.pageIndex = 1
      // 初始该行下的分类全部不选中
      for (let k = 0; k < item.list.length; k++) {
        item.list[k]._type = false;
      }
      // 如果当前行有选中分类
      if(item.identifier){
        // 重置
        item.identifier = ''
      }
      // 重置商品全部选中
      this.allBrand_index = -1;
      this.brand_index = -1;
      this.formInline.brandId = ''
      this.formInline.pageIndex=1
      // 获取上级选中的分类
      const identifier = this.getCheckCategory(index)
      if(identifier){
        this.formInline.cateIdentifier = identifier
      }else{
        this.formInline.cateIdentifier = ''
      }
      // 如果是最后一级 不再刷新分类
      if (index != this.categoryList.length - 1) {
        // 刷新分类
        this.getCurrentCategoryChildData(index, item);
      }
      // 刷新品牌
      this.getProductBrandListData()
      // 刷新商品数据
      this.getProductAvailableQuantityListData();
    },
    // 分类-更换箭头icon
    categoryMoreClick(index){
      console.log(index)
      if(this.categoryIndex==index){
        this.categoryIndex=-1
        return
      }
      this.categoryIndex=index
    },
    //三级更多分类-点击事件-更换icon
    categoryMoreRightClick(index){
      this.isRightCategory=!this.isRightCategory
      console.log(this.isRightCategory)
      if(!this.isRightCategory){
        for (var i = 0; i < this.categoryList.length; i++) {
          this.categoryList[i].view = true;
        }
      }else{
        for (var i = 0; i < this.categoryList.length; i++) {
          if (i < 3) {
            this.categoryList[i].view = true;
          }
          if (i >= 3) {
            this.categoryList[i].view = false;
          }
        }
      }

    },
    // 获取选中的分类  index   该行的index
    getCheckCategory(index){
      if(index == 0){
        return ''
      }
      let identifier = '',length;
      if(index){
        length = index
      }else{
        length = this.categoryList.length
      }
      for(let i = length; i > -1 ; i--){

        if(this.categoryList[i].identifier){
          identifier = this.categoryList[i].identifier
          break
        }
      }
      return identifier
    },
    /**
     * 品牌
     */
    //得到品牌的全部数据
    getProductBrandListData() {
      this.request(this.api.product.productBrand_listForCate, {cateIdentifier:this.formInline.cateIdentifier}).then(res => {
        this.allBrandDataArr = res.data;
      });
    },
    //全部品牌的全部点击事件
    allBrandShopClick() {
      this.allBrand_index = -1;
      this.brand_index = -1;
      this.formInline.brandId = ''
      this.formInline.pageIndex=1
      this.getProductAvailableQuantityListData();
    },
    //全部品牌的里面的每一个品牌的点击事件
    allBrandLiClickEvent(index) {
      this.allBrand_index = 0;
      this.brand_index = index;
      this.formInline.pageIndex=1
      //记录选中的品牌id
      this.formInline.brandId = this.allBrandDataArr[index].id;
      //点击全部品牌里面的品牌时，发送id请求数据
      this.getProductAvailableQuantityListData();
    },
    //更多品牌-更换箭头icon
    showArrowUpClick(){
      this.isArrowShowUp=!this.isArrowShowUp
      // this.initialHeight=!this.initialHeight
      this.allBrand = !this.allBrand
    },

    /**
     * 商品
     */
    //得到全部商品数据
    getProductAvailableQuantityListData() {
      // pageStart:1,pageSize:30
      this.request(
        this.api.product.product_listAvailableQuantityForProduct,
        this.formInline
      ).then(data => {
        // let concatData = this.productData.concat(data.data);
        this.productData = data.data;
        this.allProductCount = data.totalCount;
      });
    },
    //点击了加号按钮
    addLabelClickEvent(currentShopId, index) {
      this.request(
        this.api.product.productGoods_listProductGoods,
        {
          productId: currentShopId,
          ownerId:this.formInline.ownerId
        }
      ).then(data => {
        let _data = data.data;
        _data.forEach((item, index) => {
          item.num = "0";
        });
        let _bottomData = this.bottomTableData,
          _bottomDataLen = _bottomData.length;
        for (let i = 0; i < _bottomDataLen; i++) {
          for (let j = 0; j < _data.length; j++) {
            if (_data[j].id == _bottomData[i].id) {
              _data[j].num = _bottomData[i].num;
            }
          }
        }
        this.productGoodsData = _data;
        //得到当前数据的index
        this.shopName = this.productData[index].name;
        //显示底部table表格
        this.showZoomTable = true;
        //显示继续选择按钮
        this.showContineBtn = false;
      });
    },
    //展开按钮的点击事件
    clickShowBottomModel() {
      this.showZoomTable = false;
      this.isShowBottomTableModel = !this.isShowBottomTableModel;
    },
    //本地缓存选中的商品数据
    bottomShopNumberChange(val){
      this.$nextTick(()=>{
        this.bottomTableData=this.bottomTableData.filter(item=>{
          return item.num && item.num!=0
        })
        if(this.bottomTableData.length==0){
          this.clickShowBottomModel()
        }
        this.allTotal = 0;
        this.bottomTableData.forEach(item => {
          this.allTotal += item.num;
        });
      })
    },

    /**
     * 提交
     */
    //确认按钮的点击事件
    successBtnClickEvent() {
      this.showZoomTable = false;
      let content = 0;
      for (let i = 0; i < this.bottomTableData.length; i++) {
        content+=this.bottomTableData[i].num * this.bottomTableData[i].purchasePrice;
      }
      let filterBottomData=this.bottomTableData.filter(item=>{
        return item.num!=0
      })
      filterBottomData.forEach(item=>{
        item.type='成品'
      })
      this.bottomTableData=filterBottomData
      //存储商品总金额过去
      localStorage.setItem("allShopPrice",content)
      localStorage.setItem("localTableData",JSON.stringify(this.bottomTableData));
      localStorage.removeItem('type')
      this.$router.go(-1)
      //  this.$router.push({
      //   path: "/procureOrder_add"
      // });
    },
    //点击取消返回上级页面
    cancleBtnClcikEventToBackPrePage(){
      localStorage.removeItem('type')
      this.$router.go(-1)
      // this.$router.push({
      //   path: "/procureOrder_add"
      // })
    },
    //取消按钮的点击事件
    cancleBtnClcikEvent() {
      this.showZoomTable = false;
      this.isShowBottomTableModel=false
      //显示继续选择按钮
      this.showContineBtn = true;
    },
    //继续选择
    continueBtnClickEvent() {
      console.log("continueBtnClickEvent======1")
      this.showZoomTable = false;
      //显示继续选择按钮
      this.showContineBtn = true;
      for (var i = 0; i < this.productGoodsData.length; i++) {
        var goodsDataId = this.productGoodsData[i].id;
        for (var j = 0; j < this.bottomTableData.length; j++) {
          if (this.bottomTableData[j].id=== goodsDataId) {
            
      //       // 说明已经存在该Id
            this.bottomTableData[j].num = this.productGoodsData[i].num;
      //       // if (i == this.productGoodsData.length - 1) {
      //       //   return;
      //       // } else {
      //       //   break;
      //       // }
          }
        }
      }
      console.log("continueBtnClickEvent======2")
      this.productGoodsData= this.productGoodsData.filter(item=>{
        return item.num && item.num!=0
      })
      console.log("continueBtnClickEvent======3")
      //确认选择加入购物车
      this.bottomTableData = this.bottomTableData.concat(this.productGoodsData);
      //去除重复的对象
      this.bottomTableData = this.deteleBottonTableDataObject(this.bottomTableData);
      //计算已添加的数量
      this.allTotal = 0;
      this.bottomTableData.forEach(item => {
        this.allTotal += parseFloat(item.num);
      });
      console.log("continueBtnClickEvent======4")
    },
    //去除数组中的重复对象
    deteleBottonTableDataObject(arr) {
      var hash = {};
      const newArr = arr.reduce((item, next) => {
        hash[next.id] ? "" : (hash[next.id] = true && item.push(next));
        return item;
      }, []);
      return newArr;
    },
    shopNumberChange(val) {
    //  console.log(val)
    },
    //监听滚动事件,懒加载
    shopContentScroll(e) {
      this.$nextTick(() => {
        const el = this.$refs.shopContent;
        const offsetHeight = el.offsetHeight;
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight;
        let allPage = Math.ceil(
          this.allProductCount / this.formInline.pageSize
        );
        if (offsetHeight + scrollTop - scrollHeight >= -1) {
          //判断当前页是否小于总页数
          if (this.formInline.pageIndex <= allPage) {
            this.formInline.pageIndex++;
            // this.getProductAvailableQuantityListData();
             this.request(
              this.api.product.product_listAvailableQuantityForProduct,
              this.formInline
            ).then(data => {
              let concatData = this.productData.concat(data.data);
              this.productData = concatData;
            });
          } else {
            console.log("已经没有新数据了。。。。。");
          }
        }
      });
    }
  }
};
</script>


<style lang="less" scoped>
.base {margin-top: -70px;
  width: 100%;
  //计算高度
  // height: calc(100% - 100px);
  height: 100%;
  // background-color: greenyellow;
  position: relative;
  box-sizing: border-box;

  .organizationVal-div {
      // background-color: aqua;
    position: absolute;
    z-index: 0;
    right: 200px;
    width: 200px;
    white-space: nowrap;
  }
  .span-btn {
    // background-color: red;
    white-space: nowrap;
    span {
      display: inline-block;
      width: 40px;
      height: 40px;
      font-size: 25px;
      text-align: center;
      line-height: 40px;
      border: 1px solid pink;
    }
    span:nth-child(1) {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
    span:nth-child(2) {
      padding: 0 20px;
      border-left: none;
      border-right: none;
      border-radius: 0;
    }
    span:nth-child(3) {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
  .category-span-all {
    overflow: hidden;
  }
  .all-brand-more {
    // background-color: #ccc;
    // border: 1px solid pink;
    cursor: pointer;
    position: relative;
    height: 25px;
    min-width: 81px;
    top: 20px;
    // left: 80%;
    line-height: 25px;
    padding: 2px;
    padding-top: 0;
    color: #ABADB6;
    span {
      // display: inline-block;
      margin-right: 5px;
    }
  }
  .title {
    background-color: #fff;
    padding: 15px 0 15px 30px;
    i{font-size: 20px;margin-right: 10px;line-height: 25px;cursor: pointer;}
  }
  .content {
    background-color: #fff;
    padding: 15px 0 0 30px;
    margin: 10px;
    .all {
      display: flex;
      position: relative;
    }
    .shop-brand {
      margin: 20px 30px 10px 0;
    }
    .category-more {
      // background-color: #fff;
      // border: 1px solid #ABADB6;
      cursor: pointer;
      position: relative;
      min-width: 50px;
      text-align: center;
      height: 25px;
      line-height: 25px;
      position: relative;
      top: 20px;
      margin-right: 10px;
      border-radius: 3px;
      padding: 0 3px;
      color: #ABADB6;
    }
    // .category-more-right{

    // }
    .all-brand {
      // position: relative;
      overflow: hidden;
      margin: 20px 30px 10px 0;
      max-width: 75%;
    }
    .all-brand ul li,.all-brand-p ul li {
      cursor: pointer;
      float: left;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 0 6px;
      border-radius: 3px;
    }
    // .category{
    //     background-color: pink;
    // }
    .one_category_brand {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .one_category_li ul {
        margin-right: 10px;
        li {
          margin-right: 30px;
        }
      }
    }
  }
  .category-span {
    width: 100%;
    display: inline-block;
    margin-top: 45px;
    font-size: 18px;
  }
  .line {
    width: 95%;
    // background-color:red;
    display: block;
    border-bottom: 1px solid #ccc;
  }
  .brand-span {
    display: block;
    margin-top: 20px;
    font-size: 18px;
  }
  .shop {
    position: relative;
    background-color: #fff;
    margin: 10px;
    padding: 30px;
    z-index: 1;
    .tip-title {
      display: flex;
      span:first-child {
        flex: 1;
      }
    }
    .shop-content {
      // background-color: red;
      position: relative;
      overflow: hidden;
      overflow-x: hidden;
      overflow-y: scroll;
      height: 400px;
      margin-top: 20px;
      margin-bottom: 30px;
      display: flex;
      flex-wrap: wrap;
      // border: 1px solid rebeccapurple;
      .show-specific-shop {
        border: 1px solid #ececec;
        padding: 10px;
        width: 150px;
        height: 168px;
        box-sizing: border-box;
        margin: 0 30px 30px 0;
        position: relative;
        img {
          display: inline-block;
          width: 100px;
          height: 100px;
          border: 1px solid #ccc;
          padding: 5px;
          box-sizing: border-box;
          margin-left: 14px;
          margin-bottom: 5px;
        }
        .shop-specific-title {
          display: flex;
          flex-direction: column;
          // align-items: center;
          span:first-child {
            display: inline-block;
            margin-bottom: 3px;
            // text-align: center;
          }
        }
        .add_icon {
          text-align: center;
          // background-color: aqua;
          display: inline-block;
          border: 1px solid #ABADB6;
          width: 19px;
          height: 19px;
          line-height: 19px;
          cursor: pointer;
          position: absolute;
          right: 5px;
          bottom: 5px;
          border-radius: 50%;
        }
        .add_icon:hover {
          border: 1px solid #2290E8;
          font-weight: 600;
          color: #2290E8;
        }
      }
    }
  }
  .bottom_view {
    background-color: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 3;
    padding: 20px;
    padding-left: 250px;
    width: 100%;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    justify-content: flex-end;
    display: flex;
    border: 1px solid #ccc;
    .left-bottom {
      flex: 1;
      // background-color: aqua;
      span {
        display: inline-block;
      }
      span:nth-child(2) {
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 0 30px;
        margin-right: 3px;
      }
      span:nth-child(4) {
        margin-left: 25px;
        color: #2290E8;
      }
    }
  }

  .transition-table {
    padding-right: 250px;
    position: fixed;
    bottom: 0;
    z-index: 2;
    background-color: #fff;
    width: 100%;
    height: 400px;
    .table-div {
      padding: 0 30px;
    }
  }
  .selcte_color {
    color: #2290E8;
    font-weight: 600;
    // border: 1px solid orange;
    padding: 3px;
    border-radius: 3px;
  }
  .normal_color {
    color: #ABADB6;
    // border: 1px solid #ABADB6;
    padding: 3px;
    border-radius: 3px;
  }
  .normal_color:hover,.category-more:hover,.selcte_color:hover,.all-brand-more:hover{
    color: #6DBEFF;
  }
}
.all-brand-p{
  margin: 20px 30px 10px 0;
    max-width: 75%;
}
.item-n{
  height: 25px;
  overflow: hidden;
}
.item-b{
  height: 130px;
  overflow-y: scroll;
  border: 1px solid #e7e7e7;
}
</style>
