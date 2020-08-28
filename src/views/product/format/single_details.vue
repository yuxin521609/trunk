<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-01 15:20:22
 * @LastEditTime: 2019-07-01 15:20:22
 * @LastEditors: your name
 -->

<template>
  <div class="bg-fff item-margin">
    <el-form
      class="item-form"
      :rules="rules"
      :model="filtersData"
      label-width="100px"
      size="small"
      ref="filtersForm"
      inline
    >
      <div>
        当前商品分类：{{fullCateName}}
        <el-button v-if="_type == 'add'" @click="routerGo" type="text">切换分类</el-button>
      </div>
      <h5 class="tlogy-title">基本信息</h5>
      <el-form-item prop="name" label="商品名称：">
        <el-input
          class="input-w"
          placeholder="请输入内容"
          :disabled="showDisabled"
          v-model="filtersData.name"
        ></el-input>
      </el-form-item>
      <el-form-item prop="valid" label="使用状态：">
        <el-select
          class="input-w"
          placeholder="请选择"
          :disabled="showDisabled"
          v-model="filtersData.valid"
        >
          <el-option
            v-for="item in this.$common.getValidOptions()"
            :key="item.status_id"
            :label="item.status_name"
            :value="item.status_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="single-cus-warp" prop="cusCateIdentifier" label="定制分类：">
        <el-cascader
          :disabled="showDisabled"
          class="input-w"
          :options="classData"
          v-model="cateArr"
          @change="cascaderGet"
          :placeholder="cusPlaceholder"
          :show-all-levels="false"
          :props="props"
          change-on-select
        ></el-cascader>
      </el-form-item>
      <!-- 商品基础内容 -->
      <h5 class="tlogy-subtitle">商品基础内容</h5>
      <el-tabs v-model="activeName" type="card" class="basic-wrap">
        <el-tab-pane label="已选原料" name="material">
          <!-- 原料table -->
          <div class="item-cont">
            <el-button size="small" :disabled="showDisabled" @click="openAddMaterial">选择原料</el-button>
          </div>
          <div class="mt-10">
            <el-form-item label="筛选分类：">
              <el-cascader
                class="input-w"
                :options="attrClassData"
                v-model="materialAttrCateArr"
                :value="materialAttrCateArr"
                @change="materialAttrCascaderGet"
                :show-all-levels="false"
                :props="props"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="综合搜索：">
              <el-input class="input-w" placeholder="名称或编码" v-model.trim="materialForm.searchWords"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="SPUSearch('material',materialForm)">筛选</el-button>
              <el-button @click="SPUReset('material',materialForm)">重置</el-button>
            </el-form-item>
          </div>
          <div class="item-table">
            <el-table
              height="400"
              :data="materialTableListData"
              stripe
              empty-text="暂无数据"
              header-align="center"
              header-row-class-name="item-table-header"
              :highlight-current-row="true"
            >
              <el-table-column prop="materialCateName" align="center" label="分类" min-width="100"></el-table-column>
              <el-table-column prop="code" align="center" label="标准编码" min-width="100"></el-table-column>
              <el-table-column prop="name" align="center" label="原料名称" min-width="100"></el-table-column>
              <el-table-column prop="image" align="center" label="图片" width="80">
                <template slot-scope="scope">
                  <img class="table-img-wh" :src="scope.row.image" alt>
                </template>
              </el-table-column>
              <el-table-column prop="unitPrice" align="center" label="销售价格" min-width="100"></el-table-column>
              <el-table-column prop="usageAmount" align="center" label="用量" min-width="120">
                <template slot-scope="scope">
                  <el-input
                    v-enter-number
                    type="number"
                    @blur="usageAmountBlur(scope.row,scope.row.usageAmount)"
                    :disabled="showDisabled"
                    v-model.number="scope.row.usageAmount"
                    placeholder="请输入"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label-class-name="text-center"
                class-name="text-center"
                align="center"
                label="操作"
                width="50"
              >
                <template slot-scope="scope">
                  <el-button
                    :disabled="showDisabled"
                    @click="removeMaterialAndTechnology(scope.row.materialId,'material')"
                    type="text"
                    size="small"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 原料table end  -->
        </el-tab-pane>
        <el-tab-pane label="已选工艺" name="technology">
          <!-- 工艺table  -->
          <div class="item-cont">
            <el-button size="small" :disabled="showDisabled" @click="openAddTechnology">选择工艺</el-button>
          </div>
          <div class="mt-10">
            <el-form-item label="筛选分类：">
              <el-cascader
                class="input-w"
                :options="attrClassData"
                v-model="technologyAttrCateArr"
                :value="technologyAttrCateArr"
                @change="technologyAttrCascaderGet"
                :show-all-levels="false"
                :props="props"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="综合搜索：">
              <el-input class="input-w" placeholder="名称或编码" v-model="technologyForm.searchWords"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="SPUSearch('technology',technologyForm)">筛选</el-button>
              <el-button @click="SPUReset('technology',technologyForm)">重置</el-button>
            </el-form-item>
          </div>
          <div class="item-table">
            <el-table
              height="400"
              :data="technologyTableListData"
              stripe
              empty-text="暂无数据"
              header-align="center"
              header-row-class-name="item-table-header"
              :highlight-current-row="true"
            >
              <el-table-column prop="materialCateName" align="center" label="分类" min-width="100"></el-table-column>
              <el-table-column prop="code" align="center" label="标准编码" min-width="100"></el-table-column>
              <el-table-column prop="name" align="center" label="工艺名称" min-width="100"></el-table-column>
              <el-table-column prop="image" align="center" label="图片" width="80">
                <template slot-scope="scope">
                  <img class="table-img-wh" :src="scope.row.image" alt>
                </template>
              </el-table-column>
              <el-table-column prop="unitPrice" align="center" label="销售价格" min-width="100"></el-table-column>
              <el-table-column prop="usageAmount" align="center" label="用量" min-width="120">
                <template slot-scope="scope">
                  <el-input
                    v-enter-number
                    type="number"
                    @blur="usageAmountBlur(scope.row,scope.row.usageAmount)"
                    :disabled="showDisabled"
                    v-model.number="scope.row.usageAmount"
                    placeholder="请输入"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label-class-name="text-center"
                class-name="text-center"
                align="center"
                label="操作"
                width="50"
              >
                <template slot-scope="scope">
                  <el-button
                    :disabled="showDisabled"
                    @click="removeMaterialAndTechnology(scope.row.materialId,'technology')"
                    type="text"
                    size="small"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 工艺table   End-->
        </el-tab-pane>
      </el-tabs>
      <!-- 商品SKU -->
      <h5 class="tlogy-title">商品SKU</h5>
      <div class="sku-wrap">
        <dl class="sku-item" v-for="(item,index) in productGoodses" :key="index">
          <dt @click.stop="skuEditItem(item,index)">
            <img :src="item.image" class="sku-img-wh">
            <div class="abs-cont">
              <p>SKU价格：{{item.price}}</p>
              <p>SKU名称：{{item.name}}</p>
              <i @click.stop="skuIconRemove(item,index)" class="el-icon-delete i-index"></i>
            </div>
          </dt>
          <dd class="mt-5">
            <el-radio
              @change="skuRadioChange($event,item,index)"
              v-model="item.defaultStatus"
              :label="true"
            >设为默认</el-radio>
          </dd>
        </dl>
        <nav
          v-if="productGoodses.length <= 9 && _type != 'show'"
          @click="addSkuBtn"
          class="single-btn"
        >
          <i class="el-icon-plus"></i>
        </nav>
      </div>
      <!-- 商品SKU end -->
    </el-form>
    <div class="item-footer">
      <el-button
        v-if="_type == 'add'"
        size="small"
        @click="submitForm('filtersForm')"
        type="primary"
      >确定</el-button>
      <el-button
        v-else-if="_type == 'edit'"
        size="small"
        @click="submitEditForm('filtersForm')"
        type="primary"
      >修改</el-button>
      <el-button size="small" @click="routerback('filtersForm')">取消</el-button>
    </div>
    <!-- SKU -->
    <tp-new-sku
      @setParentSKUData="getSubSKUData"
      @setParentEditSKUData="getSubEditSKUData"
      ref="skuRef"
    ></tp-new-sku>
    <!-- 原料 setMaterialData 子向父穿的参数 setEchoData 父向子穿的参数  -->
    <tp-material-dialog @setParentMaterialData="getSubMaterialList" ref="materialDialogRef"></tp-material-dialog>
    <!-- 工艺 -->
    <tp-technology-dialog @setParentTechnologyData="getSubTechnologyList" ref="technologyDialogRef"></tp-technology-dialog>
  </div>
</template>
<script>
import SingleMaterialDialog from "@/components/customAttribute/single_material_dialog";
import SingleTechnologyDialog from "@/components/customAttribute/single_technology_dialog";
import NewSku from "@/components/SKUAssembly/add_new_sku";
/**
 * TODO  一些地方用不掉... 深复制
 * 如优化 需去掉
 */
/**
 * 父组件已选原料镜像
 */
let middlewareMaterialList = [];
/**
 * 父组件已选工艺镜像
 */
let middlewareTechnologyList = [];
/**
 * 原料和工艺数据合并生成的新数据
 */
let materialAndTechnologyList = [];
let cusCateType=false,cusTableType=false;
export default {
  data() {
    return {
      filtersData: {},
      activeName: "material", //切换
      rules: {
        //规则验证
        valid: [{ required: true, message: "请选择状态", trigger: "change" }],
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" },
        {max:24, message: "最长24个汉字", trigger: "blur" }]
      },

      editDisabled: false,
      showDisabled: false,
      materialTableListData: [], //原料table列表
      technologyTableListData: [], //工艺 table 列表
      fullCateName: "", //分类显示
      //定制分类搜索
      classData: [],
      classList: [],
      //属性分类数据
      attrClassData: [],
      attrListData: [],
      //定制分类
      cateArr: [],
      //属性分类
      materialAttrCateArr: [],
      //工艺分类
      technologyAttrCateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      //原料搜索字段
      materialForm: {
        materialCateId: "",
        searchWords: ""
      },
      //工艺搜索字段
      technologyForm: {
        materialCateId: "",
        searchWords: ""
      },
      _type: "",
      _id: "",
      //定制货品信息列表
      productGoodses: [],
      cusPlaceholder: "请选择定制分类",
      setCateIdentifier:"",//后台获取的定制分类
    };
  },
  created() {
    this.init();
    this.getClassData();
    this.getQueryparams();
  },
  methods: {
    init(){
      middlewareMaterialList = [];
      middlewareTechnologyList = [];
      materialAndTechnologyList = [];
      this.filtersData={};
      this.materialTableListData=[]; //原料table列表
      this.technologyTableListData=[];
      this.productGoodses=[];
      this.materialForm={
        materialCateId: "",
        searchWords: ""
      };
      //工艺搜索字段
      this.technologyForm={
        materialCateId: "",
        searchWords: ""
      };
      cusCateType=false;cusTableType=false;
    },
    getClassData() {
      //分类类型（1：标准分类，2：定制分类，3：原料分类或者称为属性分类）
      this.$common.getClassSelect(this, 2).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
        cusCateType=true;
        this.setCusCateName();
      });
      //获取属性分类  type 3
      this.$common.getClassSelect(this, 3).then(res => {
        this.attrClassData = res.ztree;
        this.attrListData = res.list;

      });
    },
    //定制分类
    cascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      this.filtersData.cusCateIdentifier = obj.identifier;
      this.filtersData.cusCateId = obj.id;
      this.filtersData.cusCateName = obj.name;
      this.filtersData.cusFullCateName = obj.fullCateName;
    },
    //原料属性分类
    materialAttrCascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.attrListData.find(item => item.id == cateId);
      this.materialForm.materialCateId = obj.id;
      // this.materialForm.materialCateIdentifier = obj.identifier;
    },
    //工艺属性分类
    technologyAttrCascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.attrListData.find(item => item.id == cateId);
      this.technologyForm.materialCateId = obj.id;
    },
    //获取上页面参数
    getQueryparams() {
      let params = this.$route.query;
      this._type = params._type;
      this._id = params._id;
      let itemStatus = this._type;
      switch (itemStatus.toString()) {
        case "add": //新增
          this.editDisabled = false;
          this.showDisabled = false;
          this.fullCateName = params.fullCateName;
          let filters = this.filtersData;
          ({
            cateId: filters.cateId,
            cateName: filters.cateName,
            cateIdentifier: filters.cateIdentifier,
            fullCateName: filters.fullCateName
          } = params);
          break;
        case "edit": //修改
          this.editDisabled = true;
          this.showDisabled = false;
          this.getData();
          break;
        case "show": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.getData();
          break;
      }
    },
    //添加sku
    addSkuBtn() {
      if (middlewareMaterialList.length <= 0) {
        this.$message.error("请选择原料");
        return false;
      }
      if (middlewareTechnologyList.length <= 0) {
        this.$message.error("请选择工艺");
        return false;
      }
      let List = this.arrCopy(materialAndTechnologyList);
      this.$refs.skuRef.popupInit("add", List);
    },
    //获取SKU子组件返回的数据
    getSubSKUData(skuData) {
      this.productGoodses.push(skuData);
      if (this.productGoodses.length == 1) {
        this.productGoodses[0].defaultStatus = true;
      }
    },
    //获取SKU子组件编辑后返回的数据
    getSubEditSKUData(editSkuData, subType, subIndex) {
      if (subType == "edit") {
        this.productGoodses.splice(subIndex, 1, editSkuData);
      }
    },
    //编辑当前的sku
    skuEditItem(item, _index) {
      if (middlewareMaterialList.length <= 0) {
        this.$message.error("请选择原料");
        return false;
      }
      if (middlewareTechnologyList.length <= 0) {
        this.$message.error("请选择工艺");
        return false;
      }
      let List = this.arrCopy(materialAndTechnologyList);
      let skuItem = JSON.parse(JSON.stringify(item)),
        skuIndex = _index;
      this.$refs.skuRef.editPopupInit(
        "edit",
        List,
        skuItem,
        skuIndex,
        this._type
      );
    },
    //删除当前的SKU
    skuIconRemove(item, _index) {
      this.productGoodses.splice(_index, 1);
    },
    //添加原料
    openAddMaterial() {
      this.$refs.materialDialogRef.popupInit(
        this.filtersData.cateIdentifier,
        this._type,
        this.arrCopy(middlewareMaterialList),
        this.arrCopy(this.productGoodses)
      );
    },
    //子组件传回的已选数据
    getSubMaterialList(list, productGoodsesIds) {
      console.log(list);
      let subMaterialList = list;
      //假如是新增的情况下 根本不需要做很多判断 直接放入
      this.materialTableListData = subMaterialList;
      middlewareMaterialList = [...subMaterialList];
      materialAndTechnologyList = [
        ...middlewareMaterialList,
        ...middlewareTechnologyList
      ];
      this.SPUReset("material", this.materialForm);
      this.SPUSearch("material", this.materialForm);
      //删除已选SKU
      this.arrRemoveSelectedSku(productGoodsesIds);
    },
    //添加工艺
    openAddTechnology() {
      //当点添加的时候 存个当前的数据
      this.$refs.technologyDialogRef.popupInit(
        this.filtersData.cateIdentifier,
        this._type,
        this.arrCopy(middlewareTechnologyList),
        this.arrCopy(this.productGoodses)
      );
    },
    //工艺添加成功后返回的数据
    getSubTechnologyList(list, productGoodsesIds) {
      let subMaterialList = list;
      //假如是新增的情况下 根本不需要做很多判断 直接放入
      this.technologyTableListData = subMaterialList;
      middlewareTechnologyList = [...subMaterialList];
      materialAndTechnologyList = [
        ...middlewareMaterialList,
        ...middlewareTechnologyList
      ];
      this.SPUReset("technology", this.technologyForm);
      this.SPUSearch("technology", this.technologyForm);
      //删除已选SKU
      this.arrRemoveSelectedSku(productGoodsesIds);
    },
    //原料搜索及原料重置  TODO //以后和工艺合并
    SPUSearch(SPUType, SPUForm) {
      let filters = SPUForm;
      if (filters.materialCateId == "" && filters.searchWords == "") {
        if (SPUType == "material") {
          this.materialTableListData = [...middlewareMaterialList];
        } else {
          this.technologyTableListData = [...middlewareTechnologyList];
        }
        filters = null;
        return false;
      }
      //镜像数据 搜索时拿到全部的数据 也就是镜像数据;
      let middleTableList =
        SPUType == "material"
          ? [...middlewareMaterialList]
          : [...middlewareTechnologyList];
      let filtersList = [];
      if (!!filters.materialCateId) {
        for (let i = 0; i < middleTableList.length; i++) {
          if (
            middleTableList[i].materialCateId.search(filters.materialCateId) !=
            -1
          ) {
            filtersList.push(middleTableList[i]);
           // break;
          }
        }
      } else {
        filtersList =
          SPUType == "material"
            ? [...middlewareMaterialList]
            : [...middlewareTechnologyList];
      }
      let List = [];
      if (!!filters.searchWords) {
        for (let i = 0; i < filtersList.length; i++) {
          let str = `${filtersList[i].name}${filtersList[i].code}`;
          if (str.toUpperCase().search(filters.searchWords.toUpperCase()) != -1) {
            List.push(filtersList[i]);
           // break;
          }
        }
      } else {
        List = filtersList;
      }
      if (SPUType == "material") {
        this.materialTableListData = List;
      } else {
        this.technologyTableListData = List;
      }
      filtersList = null;
      List = null;
      middleTableList = null;
    },
    SPUReset(SPUType, SPUForm) {
      if (SPUType == "material") {
        this.materialForm = {
          materialCateId: "",
          searchWords: ""
        };
        this.materialAttrCateArr = [];
      } else {
        this.technologyForm = {
          materialCateId: "",
          searchWords: ""
        };
        this.technologyAttrCateArr = [];
      }
    },
    //新增
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let filters = this.filtersData;
          filters.productGoodses = [...this.productGoodses];
          filters.productMaterials = [...materialAndTechnologyList];
          console.log(this.filtersData);
          this.request(
            this.api.product.customizedProduct_save,
            this.filtersData
          ).then(data => {
            this.$message.success("保存成功");
            setTimeout(() => {
              this.routerback();
            }, 500);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //修改保存
    submitEditForm(formName) {
      console.log(materialAndTechnologyList);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let filters = JSON.parse(JSON.stringify(this.filtersData));
          //处理已选数组
          let mirrorFilters = JSON.parse(JSON.stringify(this.filtersData));
          let mirrorMTMR = mirrorFilters.productMaterials;
          let MTMR = materialAndTechnologyList;
          let deleteMTMR = []; //已删除已有ID的数据
          for (let i = 0; i < mirrorMTMR.length; i++) {
            let flag = false;
            for (let k = 0; k < MTMR.length; k++) {
              if (
                mirrorMTMR[i].materialId == MTMR[k].materialId &&
                MTMR[k].id != null
              ) {
                flag = true;
              }
            }
            if (!flag) {
              //此处是已删除的数据 但不正确 还要知道当前数据是不是删除后又新增的
              mirrorMTMR[i].status = 9;
              deleteMTMR.push(mirrorMTMR[i]);
            }
          }
          //处理SKU  镜像sku数据
          let mirrorPtGs = mirrorFilters.productGoodses;
          //当前sku数据
          let ptGs = [...this.productGoodses];
          let deleteGoodses = [];
          for (let i = 0; i < mirrorPtGs.length; i++) {
            //镜像skuI
            let mirrorPtGsMs = mirrorPtGs[i].productGoodsMaterials;
            let parentFlag = false;
            for (let k = 0; k < ptGs.length; k++) {
              //skuk
              let ptGsMs = ptGs[k].productGoodsMaterials;
              //SKU已选数据判断循环
              if (mirrorPtGs[i].id == ptGs[k].id && ptGs[k].id != null) {
                parentFlag = true;
                let deleteArr = [];
                for (let o = 0; o < mirrorPtGsMs.length; o++) {
                  let flag = false;
                  for (let l = 0; l < ptGsMs.length; l++) {
                    if (
                      mirrorPtGsMs[o].materialId == ptGsMs[l].materialId &&
                      ptGsMs[l].id != null
                    ) {
                      flag = true;
                    }
                  }
                  if (!flag) {
                    //此处是已删除的数据 但不正确 还要知道当前数据是不是删除后又新增的
                    mirrorPtGsMs[o].status = 9;
                    deleteArr.push(mirrorPtGsMs[o]);
                  }
                }
                //当前的数据
                ptGs[k].productGoodsMaterials = [...ptGsMs, ...deleteArr];
              }
              //子集循环完成
            }
            if (!parentFlag) {
              mirrorPtGs[i].status = 9;
              deleteGoodses.push(mirrorPtGs[i]);
            }
          }
          filters.productGoodses = [...ptGs, ...deleteGoodses];
          filters.productMaterials = [
            ...materialAndTechnologyList,
            ...deleteMTMR
          ];
          this.request(this.api.product.customizedProduct_save, filters).then(
            data => {
              this.$message.success("保存成功");
              setTimeout(() => {
                this.routerback();
              }, 500);
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除原料数据
    removeMaterialAndTechnology(itemId, listType) {
      let names = [];
      let productGoodses = this.productGoodses;
      for (let i = 0; i < productGoodses.length; i++) {
        let materials = productGoodses[i].productGoodsMaterials;
        for (let k = 0; k < materials.length; k++) {
          if (materials[k].materialId == itemId) {
            names.push(productGoodses[i].name);
            break;
          }
        }
      }
      if (names.length > 0) {
        let strName = names.join("/");
        this.$confirm(`sku${strName}已使用到该项，是否确认删除!`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            //删除操作的时候还需要判断 productGoodsMaterials 的长度 如果为0
            for (let i = 0; i < productGoodses.length; i++) {
              let materials = productGoodses[i].productGoodsMaterials;
              for (let k = 0; k < materials.length; k++) {
                if (materials[k].materialId == itemId) {
                  materials.splice(k, 1);
                  productGoodses[i].valid = false; //未使用状态
                  break;
                }
              }
            }
            this.removeTableAndSku(itemId, listType);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        //未有用到的原料工艺直接删除
        this.removeTableAndSku(itemId, listType);
      }
    },
    //回显数据
    getData() {
      this.request(this.api.product.customizedProduct_get, {
        id: this._id
      }).then(res => {
        console.log(res);
        let _data = res;
        this.filtersData = JSON.parse(JSON.stringify(_data));
        let Materials = [..._data.productMaterials];
        this.fullCateName = _data.fullCateName;

        let materialsTable = [],
          technologyTable = [];
        for (let i = 0; i < Materials.length; i++) {
          if (Materials[i].type == 2) {
            materialsTable.push(Materials[i]);
          } else {
            technologyTable.push(Materials[i]);
          }
        }
        //回显列表数据；
        this.materialTableListData = materialsTable;
        middlewareMaterialList = [...materialsTable];
        this.technologyTableListData = technologyTable;
        middlewareTechnologyList = [...technologyTable];
        materialAndTechnologyList = [
          ...middlewareMaterialList,
          ...middlewareTechnologyList
        ];
        this.productGoodses = [..._data.productGoodses];
        this.setCateIdentifier = _data.cusCateIdentifier
         if(!!_data.cusCateIdentifier){
          cusTableType=true;
          this.setCusCateName();
        }

      });
    },
    setCusCateName(){
      if(cusCateType && cusTableType){
        let arr=[];
        let ids=this.setCateIdentifier.split('.');
        let list=this.classList,listLen=list.length;
        for (let k = 0; k < ids.length; k++) {
          for (let i = 0; i < listLen; i++) {
            if(ids[k] == list[i].code){
              arr.push(list[i].id)
              break;
            }
          }
        }
        this.cateArr=arr;
      }
    },
    //删除操作列表和sku
    removeTableAndSku(itemId, listType) {
      if (listType == "material") {
        let mlIndex = middlewareMaterialList.findIndex(
          item => item.materialId == itemId
        );
        middlewareMaterialList.splice(mlIndex, 1);
        this.materialTableListData.splice(mlIndex, 1);
      } else {
        let mrIndex = middlewareTechnologyList.findIndex(
          item => item.materialId == itemId
        );
        middlewareTechnologyList.splice(mrIndex, 1);
        this.technologyTableListData.splice(mrIndex, 1);
      }
      let mlmrIndex = materialAndTechnologyList.findIndex(
        item => item.materialId == itemId
      );
      materialAndTechnologyList.splice(mlmrIndex, 1);
    },
    //数组删除SKU已选数据
    arrRemoveSelectedSku(productGoodsesIds) {
      let ids = new Set(productGoodsesIds);
      if (ids.length > 0) {
        let productGoodses = this.productGoodses;
        for (let j = 0; j < ids.length; j++) {
          for (let i = 0; i < productGoodses.length; i++) {
            let materials = productGoodses[i].productGoodsMaterials;
            for (let k = 0; k < materials.length; k++) {
              if (materials[k].materialId == ids[j]) {
                materials.splice(k, 1);
                productGoodses[i].valid = false; //未使用状态
                break;
              }
            }
          }
        }
      }
    },
    //列表用量发生变化 并计算金额
    usageAmountBlur(item, _usageAmount) {
      let productGoodses = this.productGoodses;
      for (let i = 0; i < productGoodses.length; i++) {
        let materials = productGoodses[i].productGoodsMaterials;
        for (let k = 0; k < materials.length; k++) {
          if (materials[k].materialId == item.materialId) {
            materials[k].usageAmount = _usageAmount;
            productGoodses[i].price +=
              materials[k].usageAmount * materials[k].unitPrice;
            console.log(productGoodses[i]);
            break;
          }
        }
      }
    },
    //单选框发生改变
    skuRadioChange(elem, item, skuIndex) {
      let list = this.productGoodses;
      for (let i = 0; i < list.length; i++) {
        list[i].defaultStatus = false;
      }
      item.defaultStatus = true;
    },
    routerGo() {
      this.$router.go(-1);
    },
    routerback() {
      if (this._type == "edit") {
        this.$router.go(-1);
      } else if (this._type == "add") {
        this.$router.go(-2);
      } else {
        this.$router.go(-1);
      }
    },
    //数组对象深拷贝
    arrCopy(arr) {
      let copy = [];
      for (let i = 0; i < arr.length; i++) {
        copy.push(JSON.parse(JSON.stringify(arr[i])));
      }
      return copy;
    }
  },

  components: {
    [NewSku.name]: NewSku,
    [SingleMaterialDialog.name]: SingleMaterialDialog,
    [SingleTechnologyDialog.name]: SingleTechnologyDialog
  }
};
</script>
<style lang="less" scoped>
.sku-wrap {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;

  .single-btn {
    width: 150px;
    height: 150px;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    text-align: center;
    cursor: pointer;
    line-height: 156px;

    i {
      font-size: 28px;
      color: #8c939d;
    }
  }
  .single-btn:hover {
    border: 1px dashed blueviolet;
  }
}

.sku-item {
  margin-right: 10px;
  dt {
    cursor: pointer;
    width: 150px;
    height: 150px;
    border-radius: 6px;
    position: relative;
    display: table-cell; //主要是这个属性
    vertical-align: middle;
    text-align: center;
    box-shadow: 5px 5px 5px #999;
    img {
      border-radius: 6px;
      height: 150px;
      width: auto;
      max-width: 150px;
    }
    .abs-cont {
      text-align: left;
      position: absolute;
      left: 0;
      top: 0;
      font-size: 12px;
      color: #ffffff;
      padding: 4px 2px 4px 4px;
      border-radius: 6px;
      width: 100%;
      height: 100%;
      background-color: #000000;
      opacity: 0.5;
      display: none;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      i {
        position: absolute;
        right: 10px;
        bottom: 10px;
        cursor: pointer;
        font-size: 18px;
      }
    }
  }
  dt:hover .abs-cont {
    display: block;
  }
}
</style>
