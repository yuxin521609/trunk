<template>
  <div class="loginPage">
    <div class="loginBox">
      <div class="selectLogin">
        <el-tabs v-model="activeName" style="width:167px">
          <!-- 密码登录 -->
          <el-tab-pane label="密码登录" name="first">
            <codeLogin :activeName="activeName" />
          </el-tab-pane>

          <!-- 验证码登录 -->
          <el-tab-pane label="验证码登录" name="second">
            <verificationLogin :activeName="activeName" />
          </el-tab-pane>
        </el-tabs>

        <!-- 注册 -->
        <el-button type="text" class="onBox">还没有账号?</el-button>
        <el-button plain @click="registerLogin" type="primary">立即注册</el-button>
      </div>
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
import verificationLogin from "./verificationLogin.vue";
import codeLogin from "./codeLogin.vue";

export default {
  components: {
    codeLogin,
    verificationLogin,
  },
  data() {
    return {
      activeName: "first",
    };
  },

  methods: {
    // 立即注册
    registerLogin() {
      this.$router.push({ path: "/login/register" });
    },
    // 忘记密码
    forgetPassword() {
      this.$router.push({ path: "/login/find" });
    },

  },
};
</script>

<style lang="less">
.loginPage {
  width: 100%;
  height: 100%;
  background: url("../../assets/img/bg.png");

  position: relative;
  .loginBox {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 205px;
    height: 300px;
    background-color: #ffffff;
    border-radius: 3%;
    .selectLogin {
      .onBox {
        margin-right: 15px;
      }
      margin: 15px;

      .el-form-item__content {
        line-height: 30px;
      }
      .el-input__inner {
        height: 25px;
        padding: 0px 6px;

      }
      .el-button--primary {
        margin: -25px 0 0 10px;
        padding: 5px 45px;
      }
      .el-button--text {
        float: right;
        font-size: 10px;
        margin-top: -30px;
      }
    }
  }
}
</style>>

