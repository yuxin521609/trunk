<template>
  <div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="图片" prop="image">
          <el-input v-model="ruleForm.image"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="ruleForm.sort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="confirm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
    // 接收值，验证
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    echo: {
      type: Object,
      default: {},
    },
  },
  //   回显
  watch: {
    echo(aclue) {
      this.ruleForm.id = aclue.id;
      this.ruleForm.image = aclue.image;
      this.ruleForm.sort = aclue.sort;
    },
  },
  data() {
    return {
      ruleForm: {
        id: "",
        image: "",
        sort: "",
      },
    //   验证规则
      rules: {
        image: [
          { required: true, message: "请输入", trigger: ["blur", "change"] },
        ],
        sort: [
          { required: true, message: "请输入", trigger: ["blur", "change"]  },
          { type: "number", message: "请输入数字" ,trigger: ["blur", "change"] },
        ],
      },
    };
  },
  methods: {
    // 关闭弹窗之后
    handleClose() {
      this.$parent.dialogVisible = false;
      this.ruleForm = {
        id: "",
        image: "",
        sort: "",
      };
    },
    // 点击取消
    cancel() {
      this.handleClose();
    },

    // 点击确定
    confirm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          let url = url;
          let idd = null;
          if (this.ruleForm.id) {
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
          ).then(() => {
            this.$parent.list();
            this.handleClose();
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="less">
</style>
