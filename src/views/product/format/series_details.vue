<template>
  <div class="custom">
    <el-form
      class="item-form"
      :rules="rules"
      :model="filtersData"
      label-width="100px"
      size="small"
      ref="filtersForm"
      inline
    >
      <!-- 基本信息 -->
      <section class="info">
        <h3>基本信息</h3>

        <!-- 商品名称 -->
        <el-form-item prop="name" label="商品名称：">
          <el-input
            class="input-w"
            :disabled="showDisabled"
            v-model="filtersData.name"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <!-- 使用状态 -->
        <el-form-item prop="valid" label="使用状态：">
          <el-select
            class="input-w"
            placeholder="请选择状态"
            :disabled="showDisabled"
            v-model="filtersData.valid"
          >
            <el-option
              v-for="item in this.$common.getValidLowerOptions()"
              :key="item.status_id"
              :label="item.status_name"
              :value="item.status_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 定制分类 -->
        <el-form-item prop="cusCateIdentifier" label="定制分类：">
          <el-cascader
            :disabled="showDisabled"
            class="input-w"
            :options="cusClassData"
            v-model="cusCateArr"
            @change="cusCascaderGet"
            :placeholder="cusPlaceholder"
            :show-all-levels="false"
            :props="props"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <!-- 商品主图 -->
        <el-form-item prop="image" label="商品主图：">
          <el-upload-img
            :disabled="showDisabled"
            v-model="filtersData.image"
            :EchoDisplayImages="productImages"
            CatalogName="product"
          ></el-upload-img>
        </el-form-item>
      </section>
      <!-- 基本信息 -->
      <!-- 商品内容 -->
      <section class="content">
        <h3>商品内容</h3>
        <div class="ml-20">
          <el-button
            :disabled="showDisabled"
            type="primary"
            @click="cateVisible = true"
            size="small"
            class="mt-20"
            plain
          >添加品类</el-button>
          <!-- editableTabsValue == 选项卡name -->
          <el-tabs
            v-if="customizedSetProducts.length > 0"
            class="mt-20"
            v-model="editableTabsValue"
            @tab-remove="removeTab"
            type="card"
            :closable="_type == 'show'?false:true"
          >
            <el-tab-pane
              v-for="(item, index) in customizedSetProducts"
              :key="index"
              :label="item.title"
              :name="item.name"
            >
              <div class="sku-wrap">
                <dl
                  class="sku-item"
                  v-for="(itemCild,_index) in item.customizedSetProductGoodses"
                  :key="_index"
                >
                  <dt>
                    <img :src="itemCild.image" class="sku-img-wh">
                    <div class="abs-cont">
                      <p>单品价格：{{itemCild.price}}</p>
                      <p>单品名称：{{itemCild.customizedProductGoodsName}}</p>
                      <i v-if="_type != 'show' " @click.stop="skuIconRemove(index,_index)"  class="el-icon-delete i-index"></i>
                    </div>
                  </dt>
                  <dd class="mt-5">
                    <el-radio
                      :disabled="showDisabled"
                      @change="skuRadioChange(index,itemCild,_index)"
                      v-model="itemCild.defaultStatus"
                      :label="true"
                    >设为默认</el-radio>
                  </dd>
                </dl>
                <nav
                  v-if="item.customizedSetProductGoodses.length <= 9 && _type != 'show'"
                  class="single-btn"
                  @click="addCdSetPtGs(item,index)"
                >
                  <i class="el-icon-plus"></i>
                </nav>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </section>
      <!-- 商品描述 -->
      <section class="content">
        <h3>商品内容</h3>
        <!--富文本-->
        <div class="lss-editor-txt" v-if="_type == 'show'" v-html="editorHtml"></div>
        <editor v-else class="mt-20" ref="editor"></editor>
      </section>
      <!-- 发布 -->
      <section class="content ml-20">
        <div v-if="_type != 'add'">
          售价区间：
          <i class="color243">{{filtersData.minPrice}}-{{filtersData.maxPrice}}</i>
        </div>
        <div class="mt-20">
          <el-button
            v-if="_type == 'add'"
            size="small"
            @click="submitForm('filtersForm')"
            type="primary"
          >确认发布</el-button>
          <el-button
            v-else-if="_type == 'edit'"
            size="small"
            @click="submitEditForm('filtersForm')"
            type="primary"
          >修改</el-button>
          <el-button size="small" @click="routerback('filtersForm')">取消</el-button>
        </div>
      </section>
      <!-- 添加分类 -->
      <el-dialog title="添加分类" :visible.sync="cateVisible" width="400px">
        <el-form-item label="商品分类：">
          <el-cascader
            class="input-w"
            :options="classData"
            v-model="cateArr"
            @change="cascaderGet"
            :show-all-levels="false"
            :props="props"
          ></el-cascader>
        </el-form-item>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="addTab" type="primary">确 定</el-button>
        </span>
      </el-dialog>
    </el-form>
    <!-- 套装组件 -->
    <tp-series-dialog @setParentSeriesData="getSubSeriesData" ref="seriesDialogRef"></tp-series-dialog>
  </div>
</template>
<script>
//SPUlist信息
import TpSeriesDialog from "@/components/customAttribute/series_dialog";
import ElUploadImg from "@/components/uploadImg/el_upload_img";
import Editor from "@/components/editor/Editor";
let echoDisplayProducts = [];
let spuCateObj = new Object();
let cusCateType = false,
  cusTableType = false;
export default {
  components: {
    ElUploadImg,
    TpSeriesDialog,
    Editor
  },
  data() {
    return {
      filtersData: {
        image: "",
        name: "",
        valid: null,
        detail: ""
      },
      //添加分类状态
      cateVisible: false,
      showDisabled: false,
      editDisabled: false,
      _id: "",
      _type: "",
      //tabs
      editableTabsValue: "",
      spuTabsCateIds: [],
      //图片
      productImages: [],
      //商品分类
      cateArr: [],
      classData: [],
      classList: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      //定制分类
      cusClassData: [],
      cusClassList: [],
      cusCateArr: [],
      cusPlaceholder: "请选择定制分类",
      setCateIdentifier: "", //后台获取的定制分类
      rules: {
        //规则验证
        valid: [{ required: true, message: "请选择状态", trigger: "change" }],
        name: [{ required: true, message: "请输入内容", trigger: "blur" },
         {max:24, message: "最长24个汉字", trigger: "blur" }],
        image: [{ required: true, message: "请上传图片", trigger: "blur" }]
      },
      //定制套装产品（SPU）信息 下部
      customizedSetProducts: [],
      editorHtml: ""
    };
  },
  created() {
    this.init();
    this.getClassData();
    this.getQueryparams();
  },
  mounted() {
    this.$nextTick(() => {
      if (this._type != "show") this.$refs.editor.setEditorHtml("");
    });
  },
  methods: {
    init() {
      this.filtersData = {
        image: "",
        name: "",
        valid: null,
        detail: ""
      };
      this.productImages = [];
      this.setCateIdentifier = "";
      this.cusCateArr = [];
      this.cateArr = [];
      this.customizedSetProducts = [];
      echoDisplayProducts = [];
      this.editorHtml = "";
    },
    getClassData() {
      //分类类型（1：标准分类，2：定制分类，3：原料分类或者称为属性分类）
      this.$common.getClassSelect(this, 1).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
      this.$common.getClassSelect(this, 2).then(res => {
        this.cusClassData = res.ztree;
        this.cusClassList = res.list;
        cusCateType = true;
        this.setCusCateName();
      });
    },
    //商品分了切换
    cascaderGet(e) {
      //此处分类放在别处 定制套装产品（SPU）信息 下面
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      if (obj.level > 0) {
        this.filtersData.cateId = cateId;
      } else {
        this.filtersData.cateId = "";
        this.$message.error("请选择二级分类");
      }
      let spuCate = spuCateObj;
      ({
        id: spuCate.cateId,
        name: spuCate.cateName,
        identifier: spuCate.cateIdentifier,
        fullCateName: spuCate.fullCateName
      } = obj);
    },
    //定制分类切换
    cusCascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.cusClassList.find(item => item.id == cateId);
      this.filtersData.customizedCateIdentifier = obj.identifier;
      this.filtersData.customizedCateId = obj.id;
      this.filtersData.customizedCateName = obj.name;
      this.filtersData.customizedFullCateName = obj.fullCateName;
    },
    //获取上页面参数
    getQueryparams() {
      let params = this.$route.query;
      //console.log(params._type);
      this._type = params._type;
      this._id = params._id;
      switch (this._type.toString()) {
        case "add": //新增
          this.editDisabled = false;
          this.showDisabled = false;
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
    //向组件发送数据
    addCdSetPtGs(item, index) {
      // console.log(item);
      let list = this.$common.deepCopy(item);
      this.$refs.seriesDialogRef.popupInit(list, index);
    },
    //接收组件传回的数据
    getSubSeriesData(list, index) {
      this.customizedSetProducts[index].customizedSetProductGoodses = list;
    },
    //单选框发生改变
    skuRadioChange(parentIndex, item, skuIndex) {
      let list = this.customizedSetProducts[parentIndex]
        .customizedSetProductGoodses;
      for (let i = 0; i < list.length; i++) {
        list[i].defaultStatus = false;
      }
      item.defaultStatus = true;
    },
    addTab(targetName) {
      let tabsCateIds = this.spuTabsCateIds;
      let cateObj = spuCateObj;
      let tabName = cateObj.cateName;
      let tabCateId = cateObj.cateId;
      let isId = tabsCateIds.filter(item => item == tabCateId);
      if (isId.length > 0) {
        this.$message.error("已有重复的品类");
        return false;
      }
      tabsCateIds.push(tabCateId);
      this.customizedSetProducts.push({
        title: tabName, //为商品分类名称
        name: tabCateId, //为商品分类id
        customizedSetProductGoodses: [],
        cateId: cateObj.cateId,
        cateIdentifier: cateObj.cateIdentifier,
        cateName: cateObj.cateName,
        fullCateName: cateObj.fullCateName
      });
      //  console.log(this.customizedSetProducts);
      this.editableTabsValue = tabCateId;
      this.cateVisible = false;
    },
    removeTab(targetName) {
      this.$confirm(`是否确认删除!`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let tabs = this.customizedSetProducts;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
                this.spuTabsCateIds.splice(index, 1);
              }
            });
          }
          this.editableTabsValue = activeName;
          this.customizedSetProducts = tabs.filter(
            tab => tab.name !== targetName
          );
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
    },
    skuIconRemove(parentIndex, _index) {
      this.customizedSetProducts[
        parentIndex
      ].customizedSetProductGoodses.splice(_index, 1);
    },
    setCusCateName() {
      if (cusCateType && cusTableType) {
        let arr = [];
        let ids = this.setCateIdentifier.split(".");
        let list = this.cusClassList,
          listLen = list.length;
        for (let k = 0; k < ids.length; k++) {
          for (let i = 0; i < listLen; i++) {
            if (ids[k] == list[i].code) {
              arr.push(list[i].id);
              break;
            }
          }
        }
        this.cusCateArr = arr;
        //  console.log(this.cusCateArr);
      }
    },
    //新增
    submitForm(formName) {
      let SetProducts = this.customizedSetProducts;
      if (SetProducts.length <= 0) {
        this.$message.error("请添加商品内容");
        return false;
      }
      let emptyName = [];
      for (let i = 0; i < SetProducts.length; i++) {
        let cdSetPtGs = SetProducts[i].customizedSetProductGoodses;
        if (cdSetPtGs.length <= 0) {
          emptyName.push(SetProducts[i].title);
        }
      }
      if (emptyName.length > 0) {
        let strName = emptyName.join("/");
        this.$message.error(`${strName}请添加SKU`);
        return false;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          //获取富文本
          let filters = this.$common.deepCopy(this.filtersData);
          filters.detail = this.$refs.editor.getEditorHtml();
          for (let i = 0; i < SetProducts.length; i++) {
            SetProducts[i].customizedCateIdentifier =
              filters.customizedCateIdentifier;
            SetProducts[i].customizedCateId = filters.customizedCateId;
            SetProducts[i].customizedCateName = filters.customizedCateName;
            SetProducts[i].customizedFullCateName =
              filters.customizedFullCateName;
          }
          filters.customizedSetProducts = SetProducts;
          this.request(this.api.product.customizedSet_save, filters).then(
            data => {
              this.$message.success("保存成功");
              setTimeout(() => {
                this.routerback();
              }, 500);
            }
          );
        } else {
          this.$message.error("请填写必填项");
          return false;
        }
      });
    },
    //根据ID 回显
    getData() {
      this.request(this.api.product.customizedSet_get, { id: this._id }).then(
        res => {
          // console.log(res);
          this.filtersData = res;
          echoDisplayProducts = this.$common.deepCopy(
            res.customizedSetProducts
          );
          if (!!res.image) {
            this.productImages = [{ url: res.image }];
          }
          this.setCateIdentifier = res.customizedCateIdentifier;
          if (!!res.customizedCateIdentifier) {
            cusTableType = true;
            this.setCusCateName();
          }
          let tabCateIds = [];
          let cdSetPts = res.customizedSetProducts;
          for (let i = 0; i < cdSetPts.length; i++) {
            cdSetPts[i].name = cdSetPts[i].cateId;
            cdSetPts[i].title = cdSetPts[i].cateName;
            tabCateIds.push(cdSetPts[i].cateId);
          }
          this.customizedSetProducts = cdSetPts;
          this.spuTabsCateIds = tabCateIds;
          this.editableTabsValue = cdSetPts[0].cateId;
          //富文本
          if (this._type == "show") {
            this.editorHtml = res.detail;
          } else {
            this.$refs.editor.setEditorHtml(res.detail);
          }
        }
      );
    },
    //修改保存
    submitEditForm(formName) {
      let SetProducts = this.customizedSetProducts;
      if (SetProducts.length <= 0) {
        this.$message.error("请添加商品内容");
        return false;
      }
      let emptyName = [];
      for (let i = 0; i < SetProducts.length; i++) {
        let cdSetPtGs = SetProducts[i].customizedSetProductGoodses;
        if (cdSetPtGs.length <= 0) {
          emptyName.push(SetProducts[i].title);
        }
      }
      if (emptyName.length > 0) {
        let strName = emptyName.join("/");
        this.$message.error(`${strName}请添加SKU`);
        return false;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          //获取富文本
          let filters = this.$common.deepCopy(this.filtersData);
          filters.detail = this.$refs.editor.getEditorHtml();
          for (let i = 0; i < SetProducts.length; i++) {
            SetProducts[i].customizedCateIdentifier =
              filters.customizedCateIdentifier;
            SetProducts[i].customizedCateId = filters.customizedCateId;
            SetProducts[i].customizedCateName = filters.customizedCateName;
            SetProducts[i].customizedFullCateName =
              filters.customizedFullCateName;
          }

          let eoDyPts = echoDisplayProducts; //镜像
          let cdSetPts = this.$common.deepCopy(this.customizedSetProducts); //新
          let deleteProducts = [];
          //镜像
          for (let i = 0; i < eoDyPts.length; i++) {
            let eoDyPtGs = eoDyPts[i].customizedSetProductGoodses;
            let parentFlag = false;
            for (let k = 0; k < cdSetPts.length; k++) {
              let cdSetPtGs = cdSetPts[k].customizedSetProductGoodses;
              //数据判断
              if (eoDyPts[i].id == cdSetPts[k].id && cdSetPts[k].id != null) {
                parentFlag = true;
                let deleteArr = [];
                for (let o = 0; o < eoDyPtGs.length; o++) {
                  let flag = false;
                  for (let l = 0; l < cdSetPtGs.length; l++) {
                    if (
                      eoDyPtGs[o].customizedProductGoodsId ==
                        cdSetPtGs[l].customizedProductGoodsId &&
                      cdSetPtGs[l].id != null
                    ) {
                      flag = true;
                    }
                  }
                  if (!flag) {
                    //此处是已删除的数据 但不正确 还要知道当前数据是不是删除后又新增的
                    eoDyPtGs[o].status = 9;
                    deleteArr.push(eoDyPtGs[o]);
                  }
                }
                //当前数据
                cdSetPts[k].customizedSetProductGoodses = [
                  ...cdSetPtGs,
                  ...deleteArr
                ];
              }
              //子循环完成
            }
            //
            if (!parentFlag) {
              eoDyPts[i].status = 9;
              deleteProducts.push(eoDyPts[i]);
            }
          }
          filters.customizedSetProducts = [...cdSetPts, ...deleteProducts];
          this.request(this.api.product.customizedSet_save, filters).then(
            data => {
              this.$message.success("保存成功");
              setTimeout(() => {
                this.routerback();
              }, 500);
            }
          );
        } else {
          this.$message.error("请填写必填项");
          return false;
        }
      });
    },
    routerback() {
      this.$router.go(-1);
    }
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
.disFlex {
  display: flex;
}
.custom {
  background: #fff;
  margin: 8px 8px 0 8px;
  padding: 0 20px 50px 20px;
  .color243 {
    color: rgb(243, 131, 3);
    font-style: normal;
  }
  .sku-parcel {
    display: flex;
    .sku-add {
      margin-top: 10px;
      text-align: center;
      cursor: pointer;
      i {
        font-size: 28px;
        color: #8c939d;
      }
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 120px;
      height: 130px;
      line-height: 128px;
      vertical-align: top;
    }
  }
  .sku {
    display: flex;
    li {
      margin: 10px 15px 10px 0;
      .sku-img {
        position: relative;
        width: 120px;
        height: 130px;
        border-radius: 5px;
        box-shadow: 5px 5px 5px #999;
        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
        p {
          width: 100%;
          height: 100%;
          padding: 5px;
          position: absolute;
          top: 0;
          left: 0;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          border-radius: 4px;
          span {
            font-size: 11px;
            display: inline-block;
          }
          i {
            position: absolute;
            bottom: 10px;
            right: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .colorRed {
    color: red;
    line-height: 30px;
    margin-right: 3px;
  }

  section {
    padding-top: 30px;
  }
  h3 {
    font-size: 16px;
  }
}
.lss-editor-txt {
  border: 1px solid #999999;
  height: 500px;
  overflow-y: auto;
}
</style>
