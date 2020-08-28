<template>
  <div>
    <div class="selectLogin">
      <el-form
        :model="ruleForm1"
        :rules="rules"
        ref="ruleForm1"
        label-width="0px"
        class="demo-ruleForm1"
      >
        <!-- 密码登录 -->

        <el-form-item prop="phone">
          <el-input v-model="ruleForm1.phone" maxlength="11" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input v-model="ruleForm1.pwd" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="text" @click="forgetPassword">忘记密码?</el-button>
          <el-button
            type="primary"
            @click="clickLogin('ruleForm1')"
            style=" margin-left: -5px;"
          >点击登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setToken } from "../../utils/auth";
import * as userTypes from "@/types/userConfig";
import * as codeTypes from "@/types/codeset";
import { mapMutations, mapActions } from "vuex";
import { isvalidPhone } from "@/utils/validate";
import SelectOrganization from "@/components/Modal/SelectOrganization.vue";
export default {
    // 接收父组件传的值
   props: {
    activeName: {
      type: String,    
      default: '',      
    },
  },
  data() {
    return {
      ruleForm1: {
        phone: "",
        pwd: "",
      },     
      tenantId: "9889d4ed-dea4-11e9-a898-0242ac110002",  
      rules: {
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["blur"],
          },
          {
            pattern: /^1\d{10}$/,
            message: " 手机号不合法",
            trigger: ["blur"],
          },
        ],

        pwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["blur"],
          },
          {
            pattern: /^\w{6,18}$/,
            message: " 请输入不少于6位数登录密码",
            trigger: ["blur"],
          },
        ],
      },
    };
  },
// 重置清空校验Input
  watch: {
    activeName(value) {
      this.$refs.ruleForm1.resetFields();
    },
  },
  methods: {
    // 忘记密码
    forgetPassword() {
      this.$router.push({ path: "/login/find" });
    },
    // 储存Token
    ...mapMutations({
      FN_SET_TOKEN: userTypes.FN_SET_TOKEN,
    }),
    ...mapActions({
      FN_CODESET_LOAD: codeTypes.FN_LOAD_DATA,
    }),
 
    // 获取手机号ID
    // verification() {
    //   this.request(this.api.user.userCompany_loginCheckTenantData, {
    //     phoneNum: this.ruleForm1.phone,
    //   }).then((s) => {
    //     this.tenantId = s[0].id;
    //     console.log(this.tenantId);
    //   });
    // },
    // 密码点击登录
    clickLogin(ruleForm1) {
      this.$refs[ruleForm1].validate((valid) => {
        if (valid) {
          alert("submit!");
          // 验证手机号，获取ID
          debugger
          this.request(this.api.user.userCompany_loginCheckTenantData, {
            phoneNum: this.ruleForm1.phone,
          }).then((s) => {
            this.tenantId = s[0].id;
            console.log(this.tenantId);
            // 发送登录数据
            this.request(this.api.user.login_loginByPwd, {
              phoneNum: this.ruleForm1.phone,
              pwd: this.ruleForm1.pwd,
              tenantId: this.tenantId,
            }).then((res) => {
              //存储登录Token
              this.FN_SET_TOKEN(res.token);
              //得到codeData数据
              this.FN_CODESET_LOAD();
              // 存储登陆人名称
              localStorage.setItem("userName", res.userInfo.userName);
              localStorage.setItem("tenantId", res.userInfo.tenantId);
              this.$router.push({ path: "/home" });
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less">
</style>