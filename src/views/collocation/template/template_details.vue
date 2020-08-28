<template>
  <div class="bg-fff item-margin">
    <el-form
      class="item-form"
      :model="filtersData"
      :rules="rules"
      label-width="120px"
      size="small"
      ref="filtersForm"
      inline
    >
      <el-row>
        <el-tabs v-model="activeName" class="basic-wrap">
          <el-tab-pane label="模板内容" name="cont">
            <el-col :span="24"></el-col>


          </el-tab-pane>
          <el-tab-pane label="模板设置" name="setup"></el-tab-pane>
        </el-tabs>
      </el-row>
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
        @click="submitForm('filtersForm')"
        type="primary"
      >修改</el-button>
      <el-button size="small" @click="routerback('filtersForm')">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rules: {},
      filtersData: {},
      activeName: "cont",
      _type: "",
      _id: "",
      editDisabled: false,
      showDisabled: false
    };
  },
  created() {
    //获取上页面传参
    this.getQueryparams();
  },
  methods: {
    //获取上页面参数
    getQueryparams() {
      let params = this.$route.query;
      this._type = params._type;
      this._id = params._id;
      switch (params._type.toString()) {
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
    submitForm(){

    },
    getData() {}

  },
  components: {}
};
</script>
<style lang="less" scoped>
</style>
