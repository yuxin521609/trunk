<template>
  <!-- 预约折扣 -->
  <div class="make" v-if="dialogVisible">
    <el-form :model="ruleForm" label-width="150px" :rules="rules" ref="ruleFormref">
      <!-- 模糊查询 -->
      <el-form-item label="预约折扣类型：" prop="type1">
        <el-select
          v-model="ruleForm.type1"
          placeholder="请选择"
          clearable
          filterable
          @change="selectDiscount"
        >
          <el-option
            v-for="(item,index) in option1"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="activeName === 0" label="减免金额：" prop="input1">
        <el-input v-model="ruleForm.input1" placeholder="请输入金额：如50"></el-input>元
      </el-form-item>

      <el-form-item v-if="activeName === 1" label="折扣额度：" prop="input2">
        <el-input v-model="ruleForm.input2" placeholder="请输入折扣：如3.5"></el-input>折
      </el-form-item>
      <!-- 确定 取消 -->
      <div class="confirm">
        <el-button type="primary" @click="confirmAdd">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    storeName: {
      type: String,
      default: "",
    },
    storeId: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      ruleForm: {
        type1: "",
        input1: "",
        input2: "",
      },
      option1: [
        {
          label: "预约减免指定金额0",
          value: 0,
        },
        {
          label: "预约折上折1",
          value: 1,
        },
      ],
      activeName: "",
      rules: {
        type1: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: ["blur", "change"],
          },
        ],
        input1: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入减免金额"));
              }
              if (/^\d+$/.test(value)) {
                callback();
              } else {
                callback(new Error("请输入正确的金额"));
              }
            },
            trigger: ["blur"],
          },
        ],
        input2: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入减免金额"));
              }
              if (/^\d+$/.test(value)) {
                callback();
              } else {
                callback(new Error("请输入正确的金额"));
              }
            },
            trigger: ["blur"],
          },
        ],
      },
    };
  },
  watch: {
    // 清空折扣数值
    activeName() {
      this.ruleForm.input1 = "";
      this.ruleForm.input2 = "";
    },
  },
  // 加载之前
  createds() {},
  // 执行方法
  methods: {

    // 点击确定：验证门店 折扣方案类型
    confirmAdd() {
      let addValue = null;
      if (this.activeName == 0) {
        addValue = this.ruleForm.input1;
      } else {
        addValue = this.ruleForm.input2;
      }
      this.$refs.ruleFormref.validate((valid) => {
        if (valid) {
          alert("submit!");
          this.request(
            this.api.market.marketingMiddleground_createDiscountSetting,
            {
              storeId: this.storeId, // 门店id
              storeName: this.storeName, // 门店名称
              type: this.activeName, // 0：满，1：打折。
              value: addValue, // value
            }
          ).then((res) => {
            this.$router.push("discount_manage_list");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 选择折扣方式时
    selectDiscount(item) {
      this.activeName = item;
    },
    // 取消时 回到折扣列表
    cancel() {
      this.$router.push("discount_manage_list");
    },
  },
};
</script>
<style lang="less">
.make {
  height: 300px;
  background-color: #ffffff;
  margin: 0 10px 10px;
  padding: 40px;

  .el-tabs__item {
    height: 0px;
    background-color: #ffffff;
  }
  .el-input {
    width: 270px;
  }
  .confirm {
    margin-left: 150px;
  }
}
</style>
