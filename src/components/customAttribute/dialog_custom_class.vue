<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-20 08:58:11
 * @LastEditTime: 2019-08-21 18:13:56
 * @LastEditors: Please set LastEditors
 -->
<template>
  <el-dialog
    title="添加品类"
    :visible.sync="customClassVisible"
    class="alarmPopup"
    width="400px"
    append-to-body
  >
    <el-form
      class="item-form"
      :model="filtersData"
      :rules="rules"
      label-width="100px"
      size="small"
      ref="filtersForm"
    >
      <el-form-item prop="type" label="定制分类">
        <el-select class="input-w" placeholder="请选择" v-model="filtersData.type">
          <el-option
            v-for="item in this.$common.getGrandType()"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="item-right">
      <el-button size="small" @click="closeDialog('filtersForm')">取消</el-button>
      <el-button size="small" @click="submitForm('filtersForm')" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "tp-custom-class",
  data() {
    return {
      customClassVisible: false,
      filtersData: {
          type:'',
      },
      rules:{}
    };
  },
  created() {},
  methods: {
    poputInit() {
      this.customClassVisible = true;
    },
    //确定修改
    submitForm(formName) {
        this.$emit('getClass',this.filtersData.type);
        this.customClassVisible = false;
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {

    //       //   this.$emit("refreshItem", "刷新吧兄弟");

    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    },
    //关闭
    closeDialog(formName) {
      this.attributeDialogVisible = false;
      this.$refs[formName].resetFields(); //重置选项
    }
  }
};
</script>

