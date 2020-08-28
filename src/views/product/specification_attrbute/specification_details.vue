<!--
 * @Description: 规格详情
 * @Author: elephant
 * @Date: 2019-08-20 08:58:20
 * @LastEditTime: 2019-08-23 18:16:19
 * @LastEditors: Please set LastEditors
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
      <el-row>
        <el-col :span="24">
          <el-form-item prop="cateId" label="商品分类：">
            <el-cascader
              class="input-w"
              v-if="this._type == 'add'"
              :disabled="editDisabled"
              :options="classData"
              v-model="cateArr"
              :value="cateArr"
              @change="cascaderGet"
              :show-all-levels="false"
              :props="props"
            ></el-cascader>
            <el-select
              v-else
              placeholder="请选择"
              class="input-w"
              :disabled="editDisabled"
              v-model="filtersData.cateId"
            >
              <el-option
                v-for="item in classList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="name" label="规格名称：">
            <el-input
              class="input-w"
              placeholder="请输入内容"
              :disabled="editDisabled"
              v-model="filtersData.name"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="valid" label="使用状态：">
            <el-radio v-model="filtersData.valid" :disabled="showDisabled" :label="true">使用中</el-radio>
            <el-radio v-model="filtersData.valid" :disabled="showDisabled" :label="false">未使用</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="尺码属性：">
            <el-radio v-model="isShow" :disabled="editDisabled" :label="true">开启</el-radio>
            <el-radio v-model="isShow" :disabled="editDisabled" :label="false">隐藏</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="description" label="备注：">
            <el-input
              type="textarea"
              class="input-w"
              autosize
              :disabled="showDisabled"
              placeholder="请输入内容"
              v-model="filtersData.description"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          v-for="(item,index) in filtersData.productSpecificationsAttributes"
          :key="index"
        >
          <el-form-item
            :prop="'productSpecificationsAttributes.' + index + '.name'"
            :label=" index == 0 ? '规格内容：':'   '"
            :rules="{required: true, message: '请输入信息内容', trigger: 'blur'}"
          >
            <el-input
              class="ztree-w"
              :disabled="editDisabled && !!item.id"
              v-model="filtersData.productSpecificationsAttributes[index].name"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              class="ztree-w"
              v-if="isShow"
              placeholder="尺码属性（选填）"
              v-model="filtersData.productSpecificationsAttributes[index].size"
              :disabled="editDisabled && !!item.id"
            >
              <el-option
                v-for="item in sizeOptions"
                :key="item.code"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :prop="'productSpecificationsAttributes.' + index + '.code'"
            :rules="rules.specificationCode"
          >
            <el-input
              class="ztree-w"
              v-model="filtersData.productSpecificationsAttributes[index].code"
              :disabled="editDisabled && !!item.id"
              minlength="2"
              maxlength="2"
              placeholder="请输入编码（必填）只能两位"
            ></el-input>
            <i class="el-icon-top icon-cursor-p mr-5"
            @click="attributesUp(item,index)"
            v-if="filtersData.productSpecificationsAttributes.length >1 && index!=0"
            >
            </i>
              <i class="el-icon-bottom icon-cursor-p mr-5"
              @click="attributesDown(item,index)"
              v-if="filtersData.productSpecificationsAttributes.length >1 && index != filtersData.productSpecificationsAttributes.length -1"

            >
            </i>
            <i
              @click="removeDomain(item)"
              v-if="index != 0"
              v-show="!item.id"
              class="el-icon-error icon-cursor-p mr-5"
            ></i>

          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label>
            <el-button class="label-input-right" :disabled="showDisabled" @click="addContent" >新增内容</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="item-footer">
      <el-button
        v-if="this._type == 'add'"
        size="small"
        @click="submitForm('filtersForm')"
        type="primary"
      >确定</el-button>
      <el-button
        v-else-if="this._type == 'edit'"
        size="small"
        @click="submitForm('filtersForm')"
        type="primary"
      >修改</el-button>
      <el-button @click="routerback('filtersForm')">取消</el-button>
    </div>
  </div>
</template>
<script>
import * as types from "@/types/codeset";
import { mapGetters } from "vuex";
import {validateSpecificationCode} from "@/utils/validate";
/**
 * 规格详情页面 新增 修改 查看 同一页面
 */
export default {
  data() {
    return {
      filtersData: {
        cateId: "",
        cateIdentifier: "",
        name: "",
        description: "",
        valid: true,
        productSpecificationsAttributes: [
          {
            code: "",
            name: "",
            size: ""
          }
        ]
      },
      cateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      CategoryOptions: [],
      codeData: {
        orderBy: "",
        pageIndex: 1,
        pageSize: 100
      },
      isShow: true,
      rules: {
        //规则验证
        cateId: [
          { required: true, message: "请选择商品分类", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入规格名称", trigger: "blur" },
          { max: 12, message: "不超过12个字符", trigger: "blur" }
        ],
        valid: [{ required: true, message: "请输入规格名称", trigger: "blur" }],
         description:[{ max:200, message: "最长200个汉字", trigger: "blur"}],
         specificationCode:[{required: true, message: '请输入编码', trigger: 'blur'},
            { validator: validateSpecificationCode, trigger: 'blur' }]
      },
      editDisabled: false,
      showDisabled: false,
      _type: "",
      _id: "",
      classData: [],
      classList: []
    };
  },
  created() {
    //获取上页面传参
    this.getQueryparams();
    //尺码属性
    this.getClassData();
  },
  mounted() {},
  computed: {
    sizeOptions() {
      let codeSet = this.$store.getters.codeData;
      if (codeSet.STA001) {
        return codeSet.STA001.codeItemList;
      }
    }
  },
  methods: {
    getClassData() {
      this.$common.getClassSelect(this, 1).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
    },
    cascaderGet(e) {
      this.filtersData.cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == this.filtersData.cateId);
      this.filtersData.cateName = obj.name;
      this.filtersData.cateIdentifier = obj.identifier;
      this.filtersData.fullCateName = obj.fullCateName;
    },
    //获取上页面参数
    getQueryparams() {
      //console.log(this.$route.query.id);
      this._type = this.$route.query.type;
      this._id = this.$route.query.id;
      let itemStatus = this._type;
      switch (itemStatus.toString()) {
        case "add": //新增
          this.editDisabled = false;
          this.showDisabled = false;
          break;
        case "edit": //修改
          this.editDisabled = true;
          this.showDisabled = false;
          this.getSpcificationData();
          break;
        case "show": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.getSpcificationData();
          break;
      }
    },
    //获取数据
    getSpcificationData() {
      this.request(this.api.product.productSpecifications_get, {
        id: this._id
      }).then(data => {
        let _data=data;
        _data.productSpecificationsAttributes = _data.productSpecificationsAttributes.sort((a, b) => a.sort - b.sort);
        this.filtersData = _data;
      });
    },
    //新增
    submitForm(formName) {
      // console.log(JSON.stringify(this.filtersData))
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.request(
            this.api.product.productSpecifications_save,
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

    //后退
    routerback() {
      this.$router.go(-1);
    },
    addContent() {
      this.filtersData.productSpecificationsAttributes.push({
        code: "",
        name: "",
        size: "",
        sort: "",
      });
       this.heandleSort();
    },
    //删除新增内容
    removeDomain(item) {
      let index = this.filtersData.productSpecificationsAttributes.indexOf(
        item
      );
      if (index !== -1) {
        this.filtersData.productSpecificationsAttributes.splice(index, 1);
      }
    },
    //向下改变元素
    attributesDown(item,index){
       this.moveItems(this.filtersData.productSpecificationsAttributes, index, index + 1);
       this.heandleSort();
    },
    //向上改变元素
    attributesUp(item,index){
       this.moveItems(this.filtersData.productSpecificationsAttributes, index, index- 1);
       this.heandleSort();
    },
    moveItems(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    },
    heandleSort(){
      for (let i = 0; i < this.filtersData.productSpecificationsAttributes.length; i++) {
        this.filtersData.productSpecificationsAttributes[i].sort=i+1;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.icon-cursor-p{
  cursor: pointer;
}
</style>
