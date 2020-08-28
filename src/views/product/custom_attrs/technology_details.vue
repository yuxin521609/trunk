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
          <el-select
            v-else
            placeholder="请选择"
            class="input-w-2"
            :disabled="editDisabled"
            :value="filtersData.materialCateId"
            v-model="filtersData.materialCateId"
          >
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
              v-model="cateIdArr"
              :disabled="showDisabled"
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
        <el-form-item prop="name" label="工艺名称：">
          <el-input
            :disabled="showDisabled"
            v-model="filtersData.name"
            class="input-w-2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item prop="unitPrice" label="销售价格：">
          <el-input
            @input.native="setNumberPrice($event)"
            :disabled="showDisabled"
            v-model="filtersData.unitPrice"
            class="input-w-2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="工艺成本：">
          <el-input
            @input.native="setNumberPrice($event)"
            :disabled="showDisabled"
            v-model="filtersData.costPrice"
            class="input-w-2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item prop="image" label="工艺图片：">
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
        <h5 class="tlogy-title">
          互斥规则
          <em>该工艺不能与哪些工艺同时选择</em>
        </h5>
        <el-form-item label="互斥工艺：">
          <el-select
            class="input-w-2"
            placeholder="可多选"
            :disabled="showDisabled"
            v-model="setMutexData"
            @change="setMutexGet"
            @remove-tag="removeTag"
            multiple
          >
            <el-option v-for="item in mutexList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
let mirroringMaterialCates = [];
import ElUploadImg from "@/components/uploadImg/el_upload_img";
import { numberPrice } from "@/utils/validate";

export default {
  data() {
    return {
      filtersData: {
        type: 1, //很重要 区分原料和工艺的 原料类型（1：工艺，2：原料）
        materialCateId: "",
        name: "",
        unitPrice: "",
        image: "",
        costPrice: null,
        valid: true,
        description: "",
        productionMaterialCates: [], //商品分类数组
        productionMaterialExclusions: [] //工艺互斥
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
        name: [{ required: true, message: "输入原料名称", trigger: "blur" }],
        unitPrice: [
          { required: true, message: "请输入销售价格", trigger: "blur" }
        ]
      },
      //分类使用
      cateIdArr: [],
      classData: [], // 商品分类树 数据
      listData: [], // 商品 分类 一维数据
      attrClassData: [], //原料分类树数据
      attrListData: [], //原料 一维数据
      attrCateArr: [],
      cateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      productionMaterialExclusions:[],
      cateNames: "",
      mutexList: [],
      setMutexData: [] //获得到的互斥ID 需要做处理
    };
  },
  created() {
    this.getQueryparams();

    this.getMutexData();
  },
  methods: {
    setNumberPrice(_t) {
      numberPrice(_t);
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
      // 获取商品分类  type 1
      this.$common.getClassSelect(this, 1, _disabledIds).then(res => {
        this.classData = res.ztree;
        this.listData = res.list;
      });
      //获取属性分类  type 1
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
              fullCateName: list[k].fullCateName
            });
          }
        }
      }
      this.filtersData.productionMaterialCates = [
        ...categories,
        ...mirroringMaterialCates
      ];
    },
    attrCascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.attrListData.find(item => item.id == cateId);
      this.filtersData.materialCateId = obj.id;
      this.filtersData.materialCateName = obj.name;
      this.filtersData.materialCateIdentifier = obj.identifier;
      this.filtersData.materialFullCateName = obj.fullCateName;
    },
    removeTag(item) {
      if(this._type == 'edit'){
        let exclusions= this.filtersData.productionMaterialExclusions;
        if(exclusions.length >0){
          let flag =false;
          for (let i = 0; i < exclusions.length; i++) {
            if(exclusions[i].exclusionMaterialId == item && exclusions[i].id != null){
                flag=true;
                exclusions[i].status = 9;
            }
          }
          if(!flag){
            let index = exclusions.findIndex((elem) => (elem.exclusionMaterialId ==item));
            if(index != -1){
              this.filtersData.productionMaterialExclusions.splice(index,1)
            }
          }
        }
      }
    },
    //互斥处理
    setMutexGet(item) {
      let mutex = this.setMutexData,
          mutexLen = mutex.length;
        let mutexList = this.mutexList,
          mutexListLen = mutexList.length;
        let categories = [];
        for (let i = 0; i < mutexLen; i++) {
          for (let k = 0; k < mutexListLen; k++) {
            if (mutex[i] == mutexList[k].id) {
              categories.push({
                exclusionMaterialId: mutexList[k].id,
                exclusionMaterialName:mutexList[k].name
              });
            }
          }
        }
        if(this._type == 'edit'){
          let exclusions= this.filtersData.productionMaterialExclusions;
          let list =[];
            for (let i = 0; i < categories.length; i++) {
              let flag=false;
              for (let k = 0; k < exclusions.length; k++) {
                if(exclusions[k].exclusionMaterialId == categories[i].exclusionMaterialId){
                  flag=true;
                }
                if(exclusions[k].exclusionMaterialId == categories[i].exclusionMaterialId && exclusions[k].id!= null){
                  exclusions[k].status=1;
                }
              }
              if(!flag){
                list.push(categories[i])
              }else{
              }
            }
           this.filtersData.productionMaterialExclusions = [...list,...exclusions];
        }else{
          this.filtersData.productionMaterialExclusions = categories;
        }
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let Exclusions = this.filtersData.productionMaterialExclusions;
          for (let i = 0; i < Exclusions.length; i++) {
            Exclusions[i].materialId =
              this.filtersData.id != "" ? this.filtersData.id : "";
            Exclusions[i].materialName = this.filtersData.name;
          }
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
          return false;
        }
      });
    },

    //回显
    getEchoDisplayData() {
      this.request(this.api.product.productionMaterial_get, {
        id: this._id
      }).then(res => {
        this.filtersData = res;
        if (!!res.image) {
          this.productImages = [{ url: res.image }];
        }
        this.cateArr = [res.cateId];
        this.attrCateArr = [res.materialCateId];
        let Exclusion = res.productionMaterialExclusions;
        let list = [];
        for (let i = 0; i < Exclusion.length; i++) {
          list.push(Exclusion[i].exclusionMaterialId);
        }
        this.setMutexData = list;
        //回显 商品分类已选置灰
        let arr = [],
          cateIds = [];
        let Categories = res.productionMaterialCates;
        mirroringMaterialCates = [...Categories];
        if (Categories.length > 0) {
          for (let i = 0; i < Categories.length; i++) {
            arr.push(Categories[i].fullCateName); //此处的字段是错误的
            cateIds.push(Categories[i].cateId);
          }
          this.cateNames = arr.join("、");
        }
        this.getClassData(cateIds);
      });
    },
    //互斥
    getMutexData() {
      this.request(this.api.product.productionMaterial_list, {
        type: 1,
        valid: true
      }).then(res => {
        let _data = res.data;
        if(!!this._id){
          for (let i = 0; i < _data.length; i++) {
            if(_data[i].id == this._id){
              _data.splice(i,1)
              break;
            }
          }
          this.mutexList = _data;
        }else{
          this.mutexList = _data;
        }
      });
    },
    //后退
    routerback() {
      this.$router.go(-1);
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
  font-size: 22px;
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
</style>
