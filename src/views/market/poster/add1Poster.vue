<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <el-form
      :model="ruleForm"
      :rules="rules"
      :validate-on-rule-change="true"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="海报" prop="image">
        <el-input v-model="ruleForm.image"></el-input>
      </el-form-item>
      <el-form-item label="序号" prop="sort">
        <el-input v-model.number="ruleForm.sort"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="cancel('ruleForm')">取 消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    editSeries: {
      type: Object,
      default: {},
    },
  },
  watch: {
    // 编辑回显
    editSeries(avlue) {
      this.ruleForm.id = avlue.id;
      this.ruleForm.image = avlue.image;
      this.ruleForm.sort = avlue.sort;
    },
  },
  data() {
    return {
      ruleForm: {
        id: "",
        image: "",
        sort: "",
      },
      rules: {
        image: [
          { required: true, message: "请输入", trigger: ["blur", "change"] },
        ],
        sort: [
          { required: true, message: "请输入", trigger: ["blur", "change"] },
          { type: "number", message: "必须为数字值" },
        ],
      },
    };
  },
  methods: {
    //   关闭清除
    handleClose(done) {
      this.$parent.dialogVisible = false;
      this.ruleForm = {
        id: "",
        image: "",
        sort: "",
      };
    },
    // 确定添加
    confirm(ruleForm) {
      // 验证
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          // 编辑-添加
          let url = "";
          let idd = null;
          if (this.ruleForm.id) {
            console.log(this.ruleForm.id)
            url = "market-service/market/updateValid";
            idd = this.ruleForm.id;
          } else {
            url = "market-service/market/save";
          }
          this.request(
            { url: url, method: "post" },
            {
              id: idd,
              image: this.ruleForm.image,
              sort: this.ruleForm.sort,
            }
          )
            .then((res) => {
              this.handleClose();
              this.$parent.list();
            })           
        } else {
          return false;
        }
      });
    },
    // 点击取消
    cancel(ruleForm) {
      // 清除验证的信息
      this.$refs[ruleForm].resetFields();

      this.handleClose();
    },
  },
};
</script>

<style lang="less">
</style>