<template>
  <div class="bg-fff item-margin">
    <el-form
      class="item-form"
      :model="filtersData"
      :rules="rules"
      label-width="100px"
      size="small"
      ref="filtersForm"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="cateId" label="选择分类：">
            <el-cascader
              v-if="this._type == 'add'"
              class="input-w"
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

          <el-form-item prop="name" label="信息名称：">
            <el-input
              class="input-w"
              :disabled="showDisabled"
              placeholder="请输入内容"
              v-model="filtersData.name"
            ></el-input>
          </el-form-item>

          <el-form-item
            v-for="(item,index) in filtersData.productInformationAttributes"
            :label=" index == 0 ? '信息内容：':'   '"
            :key="item.key"
            :prop="'productInformationAttributes.' + index + '.name'"
            :rules="{required: true, message: '请输入信息内容', trigger: 'blur'}"
          >
            <el-input
              class="ztree-w"
              placeholder="请输入内容"
              :disabled="editDisabled && !!item.id"
              v-model="filtersData.productInformationAttributes[index].name"
            ></el-input>
            <i
              @click="removeDomain(item)"
              v-if="index != 0"
              v-show="!item.id"
              class="el-icon-error"
            ></i>
          </el-form-item>

          <el-form-item label="  ">
            <el-button :disabled="showDisabled" @click="addContent" size="small">新增内容</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="flex-cen-start">
            <el-form-item prop="valid" label="使用状态：">
              <el-radio v-model="filtersData.valid" :disabled="showDisabled" :label="true">使用中</el-radio>
              <el-radio v-model="filtersData.valid" :disabled="showDisabled" :label="false">未使用</el-radio>
            </el-form-item>
          </div>
          <el-form-item prop="required " label="是否必填：">
            <el-radio v-model="filtersData.required " :disabled="showDisabled" :label="true">必填</el-radio>
            <el-radio v-model="filtersData.required " :disabled="showDisabled" :label="false">选填</el-radio>
          </el-form-item>
          <el-form-item prop="description" label="备注：">
            <el-input
              :disabled="showDisabled"
              type="textarea"
              class="input-w-2"
              autosize
              placeholder="请输入内容"
              v-model="filtersData.description "
            ></el-input>
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
      <el-button size="small" @click="routerback('filtersForm')">取消</el-button>
    </div>
  </div>
</template>
<script>
/**
 * 规格详情页面 新增 修改 查看 同一页面
 * 1,需求  当页面为修改时 分类 名称 及已有子集不可更改，但新增子集可以更改 ，单选备注等可以更改
 *
 *
 */
export default {
  data() {
    return {
      filtersData: {
        cateId: "",
        cateIdentifier: "",
        name: "",
        productInformationAttributes: [
          {
            name: ""
          }
        ],
        description: "",
        valid: true,
        required: true
      },
      cateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },

      rules: {
        //规则验证
        cateId: [{ required: true, message: "请选择分类", trigger: "change" }],
        name: [{ required: true, message: "请输入信息名称", trigger: "blur" },
        { max:12, message: "最长12个汉字", trigger: "blur" }],
        description:[{ max:200, message: "最长200个汉字", trigger: "blur"}]
      },
      _type: "",
      _id: "",
      editDisabled: false,
      showDisabled: false,
      classData: [],
      classList: []
    };
  },
  created() {
    //获取上页面传参
    this.getQueryparams();
    this.getClassData();
  },
  computed: {},
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
          this.getBasicData();
          break;
        case "show": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.getBasicData();
          break;
      }
    },
    //获取数据
    getBasicData() {
      //productInformationAttribute
      this.request(this.api.product.productInformation_get, {
        id: this._id
      }).then(data => {
        this.filtersData = data;
      });
    },
    //新增内容
    addContent() {
      this.filtersData.productInformationAttributes.push({
        name: ""
      });
    },
    //删除新增内容
    removeDomain(item) {
      let index = this.filtersData.productInformationAttributes.indexOf(item);
      if (index !== -1) {
        this.filtersData.productInformationAttributes.splice(index, 1);
      }
    },
    //新增保存
    submitForm(formName) {
      console.log(this.filtersData);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.request(
            this.api.product.productInformation_save,
            this.filtersData
          ).then(data => {
            this.routerback();
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
    }
  }
};
</script>
<style lang="less" scoped>
</style>
