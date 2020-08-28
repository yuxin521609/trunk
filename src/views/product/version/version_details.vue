<template>
  <div>
    <el-form :rules="rules" label-width="110px" :model="filtersData" size="small" ref="filtersForm">
      <div class="tlogy-item">
        <el-form-item prop="type" label="操作系统：">
          <el-select
            placeholder="请选择"
            class="input-w-2"
            :disabled="showDisabled"
            :value="filtersData.type"
            v-model="filtersData.type"
          >
            <el-option
              v-for="item in typeListData"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="version" label="版本号：">
          <el-input
            :disabled="showDisabled"
            v-model="filtersData.version"
            class="input-w-2"
            placeholder="请输入版本号，如1.0.0"
          ></el-input>
        </el-form-item>
        <el-form-item prop="description" label="版本描述：">
          <el-input
            type="textarea"
            class="input-w-2"
            autosize
            :disabled="showDisabled"
            placeholder="请输入内容"
            v-model="filtersData.description"
          ></el-input>
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
import { validatVersion } from "@/utils/validate";
export default {
  data() {
    return {
      filtersData: {
        description: "",
        version: "",
        type:""
      },
      typeListData:[{name:'Android'},{name:'iOS'}],
      showDisabled: false,
      editDisabled: false,
      _type: "",
      _id: "",
      rules: {
        //规则验证
        type: [
          { required: true, message: "请选择操作系统", trigger: "change" }
        ],
        version: [{ required: true, message: "输入版本号", trigger: "blur" },
            { validator: validatVersion, trigger: "blur" }],
       
      },
      //分类使用
    };
  },
  created() {
    this.getQueryparams();
  },
  methods: {
    //获取上页面参数
    getQueryparams() {
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
          this.getEchoDisplayData();
          break;
        case "show": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.getEchoDisplayData();
          break;
      }
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.request(
            this.api.version.applicationVersion_save,
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
      this.request(this.api.version.applicationVersion_get, {
        id: this._id
      }).then(res => {
          this.filtersData=res;
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
.tlogy-item {
  background-color: #ffffff;
  margin: 10px;
  padding: 10px;
}

</style>
