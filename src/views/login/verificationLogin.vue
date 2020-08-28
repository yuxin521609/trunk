<template>
  <div class="selectLogin">
    <el-form
      :model="ruleForm2"
      :rules="rules"
      ref="ruleForm2"
      label-width="0px"
      class="demo-ruleForm2"
    >
      <!-- 验证码登录 -->

      <el-form-item prop="phone1">
        <el-input v-model="ruleForm2.phone1" maxlength="11" placeholder="请输入手机号" @blur="verifyCell"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="ruleForm2.code" maxlength="6" placeholder="请输入验证码" style="width:85px"></el-input>
        <el-button
          type="text"
          @click="getCode('ruleForm2')"
          style=" margin-top:0px;"
          :disabled="forbidSend"
        >获取验证码</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style=" margin-left:-5px;"
          @click="codeClickLogin('ruleForm2')"
        >点击登录</el-button>
      </el-form-item>

      <!-- 注册 -->
    </el-form>
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
      ruleForm2: {
        phone1: "",
        code: "",
      },
      type2: 2,
      tenantId: "",
      forbidSend: true,
      rules: {
        phone1: [
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
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: ["blur"],
          },
          {
            pattern: /^\d{6}$/,
            message: " 请输入正确验证码",
            trigger: ["blur"],
          },
        ],
      },
    };
  },
// 重置清空校验Input
  watch: {
    activeName(value) {
      this.$refs.ruleForm2.resetFields();
    },
  },
  methods: {
    // 验证手机号是否正确--是否显示(发送验证码按钮)
    verifyCell() {
      if (this.ruleForm2.phone1.length == 11) {
        this.forbidSend = false;
      } else {
        this.forbidSend = true;
      }
    },
    // 获取验证码
    getCode(ruleForm2) {
      this.request(this.api.user.login_sendCode, {
        phoneNum: this.ruleForm2.phone1,
        type: this.type2,
      });
    },
   
    // 储存Token
    ...mapMutations({
      FN_SET_TOKEN: userTypes.FN_SET_TOKEN,
    }),
    ...mapActions({
      FN_CODESET_LOAD: codeTypes.FN_LOAD_DATA,
    }),

    // 获取手机号ID
    // getCode() {
    //   this.request(this.api.user.userCompany_loginCheckTenantData, {
    //     phone1: this.ruleForm2.phone1,
    //   }).then((s) => {
    //     this.tenantId = s[0].id;
    //     console.log(this.tenantId);
    //   });
    // },
     
  
    // 验证码点击登录
    codeClickLogin(ruleForm2) {
      this.$refs[ruleForm2].validate((valid) => {
        if (valid) {
          alert("submit!");
          // 验证手机号，获取ID
          this.request(this.api.user.userCompany_loginCheckTenantData, {
            phone1: this.ruleForm2.phone1,
          }).then((s) => {
            this.tenantId = s[0].id;
            console.log(this.tenantId);
            
            // 发送登录数据
            this.request(this.api.user.login_loginByPhoneAndCode, {
              phoneNum: this.ruleForm2.phone1,
              code: this.ruleForm2.code,
              tenantId: this.tenantId,
            }).then((res) => {
              // 存储登陆人名称
              localStorage.setItem("userName", res.userInfo.userName);
              localStorage.setItem("tenantId", res.userInfo.tenantId);
              //存储登录Token
              this.FN_SET_TOKEN(res.token);
              //得到codeData数据
              this.FN_CODESET_LOAD();
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
</style>>

