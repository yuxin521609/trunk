<template>
  <div>
    <el-form :rules="rules" label-width="110px" :model="filtersData" size="small" ref="filtersForm">
      <div class="tlogy-item">
        <h5 class="tlogy-title">基本信息</h5>
        <el-form-item prop="materialCateId" label="属性分类：">
          <el-cascader
          v-if="_type == 'add'"
            class="input-w-2"
            :disabled="editDisabled"
            :options="attrClassData"
            v-model="attrCateArr"
            :value="attrCateArr"
            @change="attrCascaderGet"
            :show-all-levels="false"
            :props="props"
          ></el-cascader>
        <el-select v-else placeholder="请选择" class="input-w-2" :disabled="editDisabled"
            :value="filtersData.materialCateId"
            v-model="filtersData.materialCateId">
            <el-option
            v-for="item in attrListData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            ></el-option>
        </el-select>
        </el-form-item>
         <el-form-item v-if="_type != 'add'" label="已选分类：">
        <div>{{cateNames}}</div>
      </el-form-item>
        <el-form-item :prop="_type == 'add'?'productionMaterialCates':''" label="商品分类：">
          <div class="input-w-2">
          <el-cascader-multi
            :disabled="showDisabled"
            v-model="cateIdArr"
            @change="cateChangeGet"
            :data="classData"
            :only-last="true"
            :clearable="true"
            :is-two-dimension-value="false"
            separator="/"
            value-key="id"
            label-key="name"
            children-key="children"
          ></el-cascader-multi>
          </div>
        </el-form-item>
        <el-form-item prop="name" label="原料名称：">
          <el-input v-model="filtersData.name" class="input-w-2"   :disabled="showDisabled" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item prop="unitPrice" label="销售价格：">
          <el-input @input.native="setNumberPrice($event)"  v-model="filtersData.unitPrice" class="input-w-2"  :disabled="showDisabled" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="成本：">
          <el-input @input.native="setNumberPrice($event)" v-model="filtersData.costPrice" class="input-w-2"   :disabled="showDisabled" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item prop="brandId" label="品牌：">
          <el-select
            :disabled="editDisabled"
            class="input-w-2"
            placeholder="请选择"
            @change="brandIdGet"
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
        <el-form-item
          prop="productionYear"
          :rules="{required: true, message: '请选择年份', trigger: 'change'}"
          label="年份："
        >
          <el-date-picker
            :disabled="editDisabled"
            class="popularYear-w"
            v-model="filtersData.productionYear"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="image" label="原料图片：">
          <el-upload-img
           :disabled="showDisabled"
            v-model="filtersData.image"
            :EchoDisplayImages="productImages"
            CatalogName="product"
          ></el-upload-img>
        </el-form-item>
        <el-form-item prop="valid" label="使用状态：">
          <el-radio v-model="filtersData.valid" :disabled="showDisabled" :label="true">使用中</el-radio>
          <el-radio v-model="filtersData.valid" :disabled="showDisabled" :label="false">未使用</el-radio>
        </el-form-item>
        <el-form-item prop="description" label="备注：">
          <el-input
            type="textarea"
            class="input-w-2"
            autosize
            :disabled="showDisabled"
            placeholder="请输入内容"
            v-model="filtersData.description"
          ></el-input>
        </el-form-item>
      </div>
      <div class="tlogy-footer">
        <h5 class="tlogy-title">面料选填</h5>
        <el-form-item label="零剪成本：">
          <el-input
           @input.native="setNumberPrice($event)"
            :disabled="showDisabled"
            v-model="filtersData.productionMaterialOptional.costPrice"
            class="input-w-2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="成分：">
          <el-input
            :disabled="showDisabled"
            v-model="filtersData.productionMaterialOptional.ingredient"
            class="input-w-2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="纱支：">
          <el-input
            :disabled="showDisabled"
            v-model="filtersData.productionMaterialOptional.yarnCount"
            class="input-w-2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="克重：">
          <el-input
            @input.native="setNumberPrice($event)"
            :disabled="showDisabled"
            v-model="filtersData.productionMaterialOptional.grams"
            class="input-w-2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="花型：">
          <el-input
            :disabled="showDisabled"
            v-model="filtersData.productionMaterialOptional.pattern"
            class="input-w-2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="季节：">
          <el-select
            :disabled="showDisabled"
            class="input-w-2"
            placeholder="请选择"
            v-model="filtersData.productionMaterialOptional.season"
          >
            <el-option
              v-for="(item,index) in seasonOptions"
              :key="index.code"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
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
            @click="submitForm('filtersForm')"
            type="primary"
          >修改</el-button>
          <el-button size="small" @click="routerback('filtersForm')">取消</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
let mirroringMaterialCates=[];
import ElUploadImg from "@/components/uploadImg/el_upload_img";
import { validatePositiveNumber,numberPrice} from "@/utils/validate";
export default {
  data() {
    return {
      filtersData: {
        type: 2, //很重要 区分原料和工艺的 原料类型（1：工艺，2：原料）
        materialCateId: "",
        name: "",
        unitPrice:null,
        image: "",
        costPrice: null,
        productionYear: "",
        brandId: "",
        valid: true,
        description: "",
        productionMaterialOptional: { //面料可选
          type: 2, //选填 很重要 区分原料和工艺的 原料类型（1：工艺，2：原料）；
          costPrice: null,
          ingredient: "",
          yarnCount: "",
          grams: "",
          pattern: ""
        },
        productionMaterialCates:[] //商品分类数组
      },

      productImages: [], //回显图片
      showDisabled: false,
      editDisabled: false,
      _type: "",
      _id: "",
      rules: {
        //规则验证
        materialCateId: [
          { required: true, message: "请选择属性分类", trigger: "change" }
        ],
        productionMaterialCates: [
          { required: true, message: "请选择商品分类", trigger: "change" }
        ],
        brandId: [{ required: true, message: "请选择品牌", trigger: "change" }],
        name: [{ required: true, message: "输入原料名称", trigger: "blur" }],
        unitPrice: [
          { required: true, message: "请输入销售价格", trigger: "blur" },
           {validator:validatePositiveNumber,trigger: "blur"}
        ],
        productionYear: [
          { required: true, message: "请选择年份", trigger: "change" }
        ]
      },
      brandOptions: [], //品牌
      cateNames:'',
      //分类使用
      cateIdArr:[],
      classData: [], // 商品分类树 数据
      listData: [], // 商品 分类 一维数据
      attrClassData: [], //原料分类树数据
      attrListData: [], //原料 一维数据
      attrCateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      }
    };
  },
  created() {
    this.getQueryparams();
    this.getBrandOptions();
  },
  methods: {
   setNumberPrice(_t){
    numberPrice(_t)
   },
    //获取上页面参数
    getQueryparams() {
      this._type = this.$route.query._type;
      this._id = this.$route.query._id;
      let itemStatus = this._type;
      switch (itemStatus.toString()) {
        case "add": //新增
          this.editDisabled = false;
          this.showDisabled = false;
           this.getClassData();
          break;
        case "edit": //修改
          this.editDisabled = true;
          this.showDisabled = false;
          this.getEchoDisplayData();
          break;
        case "show": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.getEchoDisplayData();
          break;
      }
    },
    getClassData(_disabledIds) {
      //获取商品分类  type 1
      this.$common.getClassSelect(this, 1,_disabledIds).then(res => {
        this.classData = res.ztree;
        this.listData = res.list;
      });
      //获取属性分类  type 3
      this.$common.getClassSelect(this, 3).then(res => {
        this.attrClassData = res.ztree;
        this.attrListData = res.list;
      });
    },
    cateChangeGet(e) {
      let careIdArr = this.cateIdArr,
          careIdLen = careIdArr.length;
        let list = this.listData,
          listLen = list.length;
        let categories = [];
        for (let i = 0; i < careIdLen; i++) {
          for (let k = 0; k < listLen; k++) {
            if (careIdArr[i] == list[k].id) {
              categories.push({
                cateId: list[k].id,
                cateName: list[k].name,
                cateIdentifier: list[k].identifier,
                fullCateName:list[k].fullCateName
              });
            }
          }
        }
        this.filtersData.productionMaterialCates = [...categories,...mirroringMaterialCates];
    },
    attrCascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.attrListData.find(item => item.id == cateId);
      this.filtersData.materialCateId = obj.id;
      this.filtersData.materialCateName = obj.name;
      this.filtersData.materialCateIdentifier = obj.identifier;
      this.filtersData.materialFullCateName = obj.fullCateName;
    },
    brandIdGet(val) {
      let _obj = this.brandOptions.find(item => item.id == val);
      this.filtersData.brandName = _obj.name;
    },
    //品牌
    getBrandOptions() {
      this.request(this.api.product.productBrand_list, {valid:true}).then(data => {
        //console.log(data.data);
        let _data = data.data;
        this.brandOptions = _data;
      });
    },
    //提交
    submitForm(formName) {
      console.log(this.filtersData);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.request(
            this.api.product.productionMaterial_save,
            this.filtersData
          ).then(res => {
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
    //回显
    getEchoDisplayData() {
      this.request(this.api.product.productionMaterial_get, {
        id: this._id
      }).then(res => {
        console.log(res);
        if(res.productionMaterialOptional == null){
          res.productionMaterialOptional={}
        }
         this.filtersData = res;
        if(!!res.image){
          this.productImages = [{ url: res.image }];
        }
        this.attrCateArr = [res.materialCateId];
        //回显 商品分类已选置灰
         let arr = [],
            cateIds = [];
          let Categories = res.productionMaterialCates;
          mirroringMaterialCates=[...Categories];
          if(Categories.length > 0){
            for (let i = 0; i < Categories.length; i++) {
              arr.push(Categories[i].fullCateName); //此处的字段是错误的
              cateIds.push(Categories[i].cateId);
            }
            this.cateNames = arr.join("、");
          }
          this.getClassData(cateIds);
      });
    },
    //后退
    routerback() {
      this.$router.go(-1);
    }
  },
  computed: {
    //季节
    seasonOptions() {
      let codeSet = this.$store.getters.codeData;
      if (codeSet.PRO005) {
        return codeSet.PRO005.codeItemList;
      }
    }
  },
  components: {
    ElUploadImg
  }
};
</script>
<style lang="less" scoped>
.tlogy-item {
  background-color: #ffffff;
  margin: 10px;
  padding: 10px;
}
.tlogy-footer {
  background-color: #ffffff;
  margin: 0 10px 10px;
  padding: 10px;
}
.tlogy-title {
  font-size: 22px ;
  height: 50px;
  line-height: 50px;
  text-indent: 40px;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 20px;
  em {
    margin-left: 20px;
    font-size: 14px;
    color: #ff6677;
  }
}

.popularYear-w {
  width: 280px !important;
}
</style>
