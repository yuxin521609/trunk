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
      <el-form-item prop="name" label="特型部位：">
        <el-input
          class="input-w-2"
          :disabled="showDisabled"
          placeholder="请输入特型部位名称"
          v-model="filtersData.name"
        ></el-input>
        <el-switch
        :disabled="showDisabled"
          class="ml-10"
          v-model="filtersData.used"
          active-color="#13ce66"
          inactive-color="#9d9d9d">
        </el-switch>
      </el-form-item>
      <el-form-item
        v-for="(item,index) in filtersData.items"
        :label=" index == 0 ? '特型内容：':'   '"
        :key="item.key"
        :prop="'items.' + index + '.name'"
        :rules="{required: true, message: '请输入特型内容', trigger: 'blur'}"
      >
        <el-input
          class="input-w-2"
          placeholder="请输特型入内容"
          :disabled="editDisabled && !!item.id"
          v-model="item.name"
        ></el-input>
         <el-switch
          class="ml-10"
          :disabled="showDisabled"
          v-model="item.used"
          active-color="#13ce66"
          inactive-color="#9d9d9d">
        </el-switch>
        <i @click="removeDomain(item)" v-if="index != 0" v-show="!item.id" class="el-icon-error ml-10 i-cursor"></i>
      </el-form-item>
      <el-form-item label="  ">
        <el-button :disabled="showDisabled" @click="addContent" size="small">新增内容</el-button>
      </el-form-item>
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
        @click="editSubmitForm('filtersForm')"
        type="primary"
      >修改</el-button>
      <el-button @click="routerback('filtersForm')" size="small">取消</el-button>
    </div>
  </div>
</template>
<script>
/**

     *
     */
export default {
  data() {
    return {
      filtersData: {
        used:true,
        name: "",
        items: [{
          name: "",
          used:true
        }],
      },
      cateArr: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      rules: {
        //规则验证
        name: [{ required: true, message: "请输入特型名称", trigger: "blur" },
          { max: 20, message: "不超过20个字符", trigger: "blur" }]
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
  },
  computed: {},
  methods: {
    //获取上页面参数
    getQueryparams() {
      console.log(this.$route.query);
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
      this.request(this.api.user.crm_bodyfeatures_get, {
        id: this._id
      }).then(data => {
        this.filtersData = data;
      });
    },
    //新增内容
    addContent() {
      this.filtersData.items.push({
        name: "",
        used:true
      });
    },
    //删除新增内容
    removeDomain(item) {
      let index = this.filtersData.items.indexOf(item);
      if (index !== -1) {
        this.filtersData.items.splice(index, 1);
      }
    },
    //新增保存
    submitForm(formName) {
      console.log(this.filtersData);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.request(
            this.api.user.crm_bodyfeatures_create,
            this.filtersData
          ).then(data => {
            this.$message.success('新增成功！');
            this.routerback();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //修改保存
    editSubmitForm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.request(
            this.api.user.crm_bodyfeatures_update,
            this.filtersData
          ).then(data => {
            this.$message.success('修改成功！');
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
