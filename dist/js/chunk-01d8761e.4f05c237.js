(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-01d8761e"],{"8dcc":function(e,t,r){"use strict";var o=r("f043"),s=r.n(o);s.a},b953:function(e,t,r){"use strict";r.r(t);var o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"login-wrap"},[r("div",{staticClass:"login-container"},[r("h3",{staticClass:"title"},[e._v("\n      账号注册\n    ")]),r("input",{staticStyle:{position:"absolute",left:"-10000px"},attrs:{type:"password",name:"password"}}),r("el-form",{staticClass:"demo-ruleForm "},[r("div",{staticClass:"login-left"},[r("div",{staticClass:"register-wrapper"},[r("div",{attrs:{id:"register"}},[r("el-form",{ref:"ruleForm2",staticClass:"demo-ruleForm",attrs:{model:e.ruleForm2,rules:e.rules2,"label-width":"100px"}},[r("el-form-item",{staticClass:"line"},[r("h5",{staticClass:"hint"},[e._v("\n                  账号信息\n                ")])]),r("el-form-item",{attrs:{prop:"phoneNum",label:"手机号："}},[r("el-input",{attrs:{id:"username","auto-complete":"off",placeholder:"请输入常用手机号码",maxlength:"11"},on:{blur:e.phonecheckBlur},model:{value:e.ruleForm2.phoneNum,callback:function(t){e.$set(e.ruleForm2,"phoneNum",t)},expression:"ruleForm2.phoneNum"}})],1),r("el-form-item",{staticClass:"code",attrs:{prop:"checkCode",label:"验证码："}},[r("el-input",{staticClass:"verifyCode",attrs:{placeholder:"请输入收到的手机验证码",oninput:"this.value=this.value.replace(/[^0-9]/g,'');",maxlength:"6","auto-complete":"new-password"},model:{value:e.ruleForm2.checkCode,callback:function(t){e.$set(e.ruleForm2,"checkCode",t)},expression:"ruleForm2.checkCode"}}),r("el-input",{staticStyle:{position:"fixed",bottom:"-9999px"},attrs:{id:"checkCode"}}),r("el-button",{staticClass:"verifyBtn",attrs:{disabled:e.isDisabled,size:"small"},on:{click:e.validPhoneNumber}},[e._v("\n                  "+e._s(e.buttonText)+"\n                ")])],1),r("el-form-item",{attrs:{prop:"password",label:"设置密码："}},[r("el-input",{staticStyle:{position:"fixed",bottom:"-9999px"},attrs:{id:"password",type:"password"}}),r("el-input",{attrs:{type:"password","auto-complete":"new-password",minlength:"8",placeholder:"请设置不少于8位的登录密码"},model:{value:e.ruleForm2.password,callback:function(t){e.$set(e.ruleForm2,"password",t)},expression:"ruleForm2.password"}})],1),r("el-form-item",{attrs:{prop:"checkPass",label:"验证密码："}},[r("el-input",{staticStyle:{position:"fixed",bottom:"-9999px"},attrs:{type:"password"}}),r("el-input",{attrs:{type:"password","auto-complete":"new-password",placeholder:"请再次输入所设置的密码"},model:{value:e.ruleForm2.checkPass,callback:function(t){e.$set(e.ruleForm2,"checkPass",t)},expression:"ruleForm2.checkPass"}})],1),r("el-form-item",{staticClass:"line"},[r("h5",{staticClass:"hint"},[e._v("\n                  用户信息\n                ")])]),r("el-form-item",{attrs:{prop:"name",label:"姓名："}},[r("el-input",{attrs:{type:"name","auto-complete":"off",placeholder:"请输入您的姓名"},model:{value:e.ruleForm2.name,callback:function(t){e.$set(e.ruleForm2,"name",t)},expression:"ruleForm2.name"}})],1),r("el-form-item",[r("el-button",{staticStyle:{width:"100%"},attrs:{type:"primary"},on:{click:function(t){return e.submitForm("ruleForm2")}}},[e._v("\n                  注册\n                ")])],1)],1)],1)])]),r("div",{staticClass:"login-right"},[r("p",[e._v("已有账号，请直接点击“登录”按钮，登录使用。")]),r("el-button",{staticClass:"goToLogin",staticStyle:{width:"100%"},attrs:{"native-type":"button"},on:{click:e.goToLogin}},[e._v("\n          登录\n        ")])],1)])],1)])},s=[],i={name:"Register",data:function(){var e=this,t=function(t,r,o){""===r?o(new Error("请输入常用手机号码")):e.checkMobile(r)?o():o(new Error("手机号码不合法"))},r=function(e,t,r){""===t?r(new Error("请输入收到的手机验证码")):r()},o=function(t,r,o){""===r||r.length<8?o(new Error("请设置不少于8位的登录密码")):(""!==e.ruleForm2.checkPass&&e.$refs.ruleForm2.validateField("checkPass"),o())},s=function(t,r,o){""===r?o(new Error("请再次输入密码")):r!==e.ruleForm2.password?o(new Error("两次输入密码不一致!")):o()};return{ruleForm2:{password:"",checkPass:"",phoneNum:"",checkCode:""},rules2:{password:[{required:!0,validator:o,trigger:"blur"}],checkPass:[{required:!0,validator:s,trigger:"blur"}],phoneNum:[{required:!0,validator:t,trigger:"blur"}],checkCode:[{required:!0,validator:r,trigger:"blur"}],name:[{required:!0,validator:function(e,t,r){t?/(^\s)|(\s$)/.test(t)?r(new Error("姓名前后不能含有空格")):/^[a-zA-Z\u4e00-\u9fa5]+(\s+[a-zA-Z\u4e00-\u9fa5]+)*$/g.test(t)?r():r(new Error("姓名只能输入英文字母或者汉字")):r(new Error("请输入姓名"))},trigger:"blur"}]},buttonText:"发送验证码",isDisabled:!0,flag:!0,loginPhonecheckF:!1}},methods:{phonecheckBlur:function(){""!=this.ruleForm2.phoneNum?this.isDisabled=!1:this.isDisabled=!0},validPhoneNumber:function(e){var t=this,r=this.ruleForm2.phoneNum;if(""==r||!this.checkMobile(r))return this.$message.error("请先输入正确手机号"),!1;this.request(this.api.user.get_loginPhonecheck,{phoneNum:r}).then(function(e){t.sendCode()}).catch(function(e){})},sendCode:function(){var e=this,t=this.ruleForm2.phoneNum;this.request(this.api.user.get_sendPersonCode,{phoneNum:t,type:1}).then(function(t){var r=60;if(e.buttonText="已发送",e.isDisabled=!0,e.flag){e.flag=!1;var o=setInterval(function(){r--,e.buttonText="".concat(r," 秒"),0===r&&(clearInterval(o),e.buttonText="重新获取",e.isDisabled=!1,e.flag=!0)},1e3)}}).catch(function(e){})},submitForm:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;t.request(t.api.user.get_register,t.ruleForm2).then(function(e){setTimeout(function(){t.$alert("您已注册成功","提示",{confirmButtonText:"确定"}).then(function(){t.$router.push({path:"/login/login_new"})}).catch(function(){})},400)}).catch(function(e){t.$message.error(e.message)})})},goToLogin:function(){this.$router.push({path:"/login/login_new"})},checkMobile:function(e){var t=/^1\d{10}$/;return!!t.test(e)}}},n=i,a=(r("8dcc"),r("2877")),l=Object(a["a"])(n,o,s,!1,null,"26f0b669",null);t["default"]=l.exports},f043:function(e,t,r){}}]);