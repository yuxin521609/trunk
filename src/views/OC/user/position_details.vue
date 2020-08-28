<template>
  <el-dialog
    :title="itemParam.title"
    :visible.sync="classDialogVisible"
    class="alarmPopup"
    width="500px"
  >
    <el-form
      :model="filtersData"
      :rules="rules"
      label-width="100px"
      size="small"
      ref="filtersForm"
      inline
    >
      <el-form-item prop="name" label="职位名称：">
        <el-input
          placeholder="请输入内容"
          class="input-w"
          :disabled="showDisabled"
          v-model="filtersData.name"
        ></el-input>
      </el-form-item>
      <el-form-item prop="jobDescribe" label="职位描述：">
        <el-input
          placeholder="请输入内容"
          class="input-w"
          :disabled="showDisabled"
          v-model="filtersData.jobDescribe"
        ></el-input>
      </el-form-item>
      <el-form-item prop="type" label="职位类型：" :disabled="showDisabled">
        <code-set v-model="filtersData.type" code="CEN004"/>
      </el-form-item>
      <el-form-item prop="used" align="center" label="启停状态" width="80" :disabled="showDisabled">
        <el-switch v-model="filtersData.used" active-color="#13ce66" inactive-color="#9d9d9d"></el-switch>
      </el-form-item>
    </el-form>
    <div class="item-right">
      <el-button size="small" @click="closeDialog('filtersForm')">取消</el-button>
      <el-button
        v-if="this.itemParam.type == 'add'"
        size="small"
        @click="submitForm('filtersForm')"
        type="primary"
      >确定</el-button>
      <el-button
        v-else-if="this.itemParam.type == 'edit'"
        size="small"
        @click="editForm('filtersForm')"
        type="primary"
      >修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
import codeSet from "@/components/codeSet";
export default {
  components: { codeSet },
  name: "tp-class-details",
  props: {
    itemParam: {
      type: Object
    }
  },
  data() {
    return {
      classDialogVisible: false,
      filtersData: {
        name: "", //职位名称
        type: "",
        used: false
      },
      CategoryOptions: [],
      //验证
      rules: {
        name: [
          { required: true, message: "请输入职位名称", trigger: "blur" },
          { max: 10, message: '职位名称最多10个字符', trigger: 'change' }
        ],
        jobDescribe: [{ required: false,max: 20, message: "职位描述最多20个字符", trigger: "change" }],
        type: [{ required: true, message: "请选择职位类型", trigger: "blur" }]
      },
      editDisabled: true, //可编辑状态  除使用状态其他都不可编辑
      showDisabled: true //查看时 使用状态不可编辑
    };
  },
  watch: {
    // itemJsonParam(newData,oldData){
    //   this.filtersData=newData;
    // }
  },
  methods: {
    getValidOptions() {
      let arr = [
        {
          status_id: true,
          status_name: "使用中"
        },
        {
          status_id: false,
          status_name: "未使用"
        }
      ];
      return arr;
    },
    //初始化
    positionDetailsPopupInit() {
      this.filtersData = {
        code: "",
        name: "",
        type: "",
        used: false
      };
      //对象还需初始化
      let itemStatus = this.itemParam.type;
      switch (itemStatus.toString()) {
        case "add": //新增
          this.editDisabled = false;
          this.showDisabled = false;
          break;
        case "edit": //修改
          this.editDisabled = true;
          this.showDisabled = false;
          this.getClassData();
          break;
        case "show": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.getClassData();
          break;
      }
      this.classDialogVisible = true;
    },
    //关闭
    closeDialog(formName) {
      this.classDialogVisible = false;
      this.$refs[formName].resetFields(); //重置选项
    },
    //保存表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.request(this.api.user.position_save, this.filtersData).then(
            data => {
              this.closeDialog(formName);
              this.$emit("refreshItem", "刷新");
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //获取列表数据
    getClassData() {
      this.request(this.api.user.position_get, { id: this.itemParam.id }).then(
        data => {
          this.filtersData = data;
        }
      );
    },
    //修改表单
    editForm(formName) {
      this.submitForm(formName);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
