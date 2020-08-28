<template>
  <el-dialog
    title="提示"
    :visible.sync="printsStatusDialogVisible"
    class="alarmPopup"
    width="500px"
    append-to-body
  >
    <div  v-loading="statueLoading">
      <p>{{printsStatus}}</p>
      <p style="color:red">打印完成请点击打印成功按钮</p>
    </div>
    <div class="item-right mt-10">
      <el-button size="small" @click="closeDialog">关闭</el-button>
      <el-button size="small" @click="successPrint()" type="primary">打印成功</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "prints-success-dialog",
  data() {
    return {
      printsStatusDialogVisible: false,
      printsStatus: "正在打印中...",
      statueLoading:false,
    };
  },
  created() {},
  methods: {
    init() {},
    propInit() {
      this.printsStatusDialogVisible = true;
    },
    //打印成功
    successPrint(){
      this.statueLoading=true;
      this.$emit('setParentPrintsStatus','success');
    },
    //回调
    closeDialog() {
      this.statueLoading=false;
      this.printsStatusDialogVisible = false;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
