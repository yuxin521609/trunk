<template>
  <div>
    <div class='tab_div' style='font-weight:bold;padding-left:18px;'>
        <el-menu :default-active="typeActiveIndex" text-color="#222" active-text-color="#2290e8" 
            mode="horizontal" @select="typeActiveSelect" style='border-bottom:none;'>
            <el-menu-item index="1" style='border-bottom:none;'>微信收款设置</el-menu-item>
            <el-menu-item index="2" style='border-bottom:none;'>支付宝收款设置</el-menu-item>
        </el-menu>
    </div>
    <div class="search_div" v-show="typeActiveIndex==1">
      <el-form ref="wxformData" :model="signData" :rules="wxPayRules" :inline="true" label-width="140px">
        <el-form-item label="管理员手机号：" prop="wxMobile">
          <el-input
            style="width:300px;"
            v-model="signData.wxMobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item><br/>
        <el-form-item label="APPID：" prop="wxAppId">
          <el-input
            style="width:300px;"
            v-model="signData.wxAppId"
            placeholder="请输入appid"
          ></el-input>
        </el-form-item><br/>
        <el-form-item label="商家号：" prop="shopNumber">
          <el-input
            style="width:300px;"
            v-model="signData.shopNumber"
            placeholder="请输入商家号"
          ></el-input>
        </el-form-item><br/>
        <el-form-item label="商户密钥：" prop="shopPrivateKey">
           <el-input
            type="textarea"
            resize='none'
            :rows='3'
            style="width:300px;"
            v-model="signData.shopPrivateKey"
            placeholder="请输入32位商户密钥"
           ></el-input>
        </el-form-item><br/>
        <el-form-item label="付款证书：" prop="keyPath">
          <div class="upload-file">
            <el-upload
              class="upload-demo"
              :action="fileAction()"
              :headers="tokenHeaders"
              name="credential"
              :on-success="handleFileSuccess"
              :on-change="beforefileUploadChange"
              :show-file-list='false'
              >
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <span>{{fileTag}}</span>
          </div>
        </el-form-item><br/>
        <el-form-item>
          <el-button type="primary" @click="wxPaySaveInputDataBtnClick('wxformData')" size="small" style="margin-left:140px;">保存</el-button>
          <!-- <el-button type="primary" @click="jieMiBtn" size="small" style="margin-left:120px;">解密</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="search_div" v-show="typeActiveIndex==2">
      <el-form ref="aliformData" :model="signData" :rules="aliPayRules" :inline="true" label-width="140px">
        <el-form-item label="管理员手机号：" prop="aliMobile">
          <el-input
            style="width:300px;"
            v-model="signData.aliMobile"
            placeholder="请输入appid"
          ></el-input>
        </el-form-item><br/>
        <el-form-item label="APPID：" prop="aliAppId">
          <el-input
            style="width:300px;"
            v-model="signData.aliAppId"
            placeholder="请输入appid"
          ></el-input>
        </el-form-item><br/>
        <el-form-item label="PID：" prop="PID">
          <el-input
            style="width:300px;"
            v-model="signData.PID"
            placeholder="请输入PID"
          ></el-input>
        </el-form-item><br/>
        <el-form-item label="应用私钥：" prop="userPrivateKey">
           <el-input
            :rows='3'
            type="textarea"
            resize='none'
            style="width:300px;"
            v-model="signData.userPrivateKey"
            placeholder="请输入应用私钥"
           ></el-input>
        </el-form-item><br/>
        <el-form-item label="应用公钥：" prop="aliPublicKey">
           <el-input
            type="textarea"
            resize='none'
            :rows='3'
            style="width:300px;"
            v-model="signData.aliPublicKey"
            placeholder="请输入应用公钥"
           ></el-input>
        </el-form-item><br/>
        <el-form-item label="支付宝公钥：" prop="aliUsePayPublicKey">
           <el-input
            type="textarea"
            resize='none'
            :rows='3'
            style="width:300px;"
            v-model="signData.aliUsePayPublicKey"
            placeholder="请输入支付宝公钥"
           ></el-input>
        </el-form-item><br/>
        <el-form-item>
          <el-button type="primary" @click="aliPaySaveInputDataBtnClick('aliformData')" size="small" style="margin-left:140px;">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {Encrypt,dEncrypt} from '@/vendor/CryptoJS'
import { getToken } from "@/utils/auth";
import {isvalidPhone} from '@/utils/validate'
let token = getToken(); 
let validPhone=(rule, value,callback)=>{
  if(!value){
    callback(new Error('请输入手机号码'));
  }else if (!isvalidPhone(value) && value){
    callback(new Error('请输入正确的11位手机号码'));
  }else {
    callback();
  }
};
export default {
  data() {
    return {
      fileTag:'未上传',
      tokenHeaders:{accessToken: token},
      fileList:[],
      signData:{
        id:'',
        //标识时支付宝还是微信支付 
        tag:"11002",
        //管理员手机号
        contactMobile:'',
        //微信手机号
        wxMobile:'',
        //文件路径
        keyPath:"",
        //标识微信APPID
        wxAppId:'',
        //商家号或者PID
        publicId:"",
        //标识商家号
        shopNumber:"",   
        //标识PID
        PID:"",
        aliMobile:'',
        //商户密钥或者应用私钥   
        privateKey:"",
        //标识商户密钥
        shopPrivateKey:"",
        //标识应用私钥
        userPrivateKey:"",   
        //标识支付宝APPID
        aliAppId:'',
        appid:"",
        //应用公钥  
        aliPublicKey:'', 
        publicKey:"",
        //支付宝公钥
        aliUsePayPublicKey:'',
        aliPayPublicKey:""
      },
      typeActiveIndex:'1',
      wxPayRules:{
        wxMobile:[ { required: true, trigger: "blur", validator: validPhone}],
        wxAppId:[{ required: true, message: "appId不能为空", trigger: "blur" }],
        shopNumber: [{ required: true, message: "商户号不能为空", trigger: "blur" }],
        shopPrivateKey: [{ required: true, message: "商家密钥不能为空", trigger: "blur" }],
        keyPath:[{ required: true, message: "文件不能为空", trigger: "change" }]
      },
      aliPayRules: {
        aliMobile:[ { required: true, trigger: "blur", validator: validPhone}],
        aliAppId:[{ required: true, message: "appId不能为空", trigger: "blur" }],
        PID: [{ required: true, message: "PID不能为空", trigger: "blur" }],
        userPrivateKey: [{ required: true, message: "应用私钥不能为空", trigger: "blur" }],
        aliPublicKey:[{ required: true, message: "应用公钥不能为空", trigger: "blur" }],
        aliUsePayPublicKey: [{ required: true, message: "支付宝公钥不能为空", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getByAssociationData(this.signData.tag)
  },
  methods: {
    getByAssociationData(tag){
      //得到收款页数据
      this.request( this.api.financial.financialConfig_getByAssociationId,{tag:tag}).then(res =>{
        console.log(res);
        if(!res)return
        if(res.tag =='11002'){
          this.signData={
            id:res.id,
            tag:res.tag,
            wxAppId:dEncrypt(res.appid),
            keyPath:res.keyPath,
            wxMobile:res.contactMobile,
            shopNumber:dEncrypt(res.publicId),
            shopPrivateKey:dEncrypt(res.privateKey)
          }
          var result = this.fileList.some(item=>{
            if(item.name==this.signData.keyPath){
              return true 
            } 
          })
          if(result){
            console.log("已经包含该元素了")
          }else{
            this.fileList=[]
            this.fileList.push({name:this.signData.keyPath});
            this.fileTag='已上传'
          }
        }else{
          this.signData={
            id:res.id,
            tag:res.tag,
            PID:dEncrypt(res.publicId),
            userPrivateKey:dEncrypt(res.privateKey),
            aliMobile:res.contactMobile,
            aliAppId:dEncrypt(res.appid),
            aliPublicKey:dEncrypt(res.publicKey),
            aliUsePayPublicKey:dEncrypt(res.aliPayPublicKey)
          }
        }
      })
    },
    //文件上传成功过
    handleFileSuccess(res, file){
      console.log(res)
      this.signData.keyPath=res.data
      console.log(this.signData.keyPath)
    },
    typeActiveSelect(index){
     this.typeActiveIndex=index
     this.signData={} 
     console.log(index)
      switch(index){
        case "1":
          //微信支付  
          this.signData.tag="11002";
          this.getByAssociationData(this.signData.tag);
          break;
        case "2":
          //支付宝支付  
          this.signData.tag="11001";
          this.getByAssociationData(this.signData.tag);
          break;
      }
    },
    fileAction() {
      return this.api.FN_ALLPATH(this.api.financial.financialConfig_uploadCredential);
    },
    jieMiBtn(){
      console.log("jimi");
      
       var publicId=dEncrypt(this.signData.publicId)
       var privateKey=dEncrypt(this.signData.privateKey)
       console.log(publicId)
       console.log(privateKey)
    },
    //微信支付设置
    wxPaySaveInputDataBtnClick(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.signData.appid=Encrypt(this.signData.wxAppId)
          this.signData.publicId=Encrypt(this.signData.shopNumber)
          this.signData.privateKey=Encrypt(this.signData.shopPrivateKey)
          this.signData.contactMobile=this.signData.wxMobile
          this.request(this.api.financial.financialConfig_paymentConfig,this.signData).then(res =>{
            console.log(res)
            this.$message.success(`保存成功`);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //支付宝支付设置
    aliPaySaveInputDataBtnClick(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.signData.publicId=Encrypt(this.signData.PID)
          this.signData.privateKey=Encrypt(this.signData.userPrivateKey)
          this.signData.appid=Encrypt(this.signData.aliAppId)
          this.signData.publicKey=Encrypt(this.signData.aliPublicKey)
          this.signData.aliPayPublicKey=Encrypt(this.signData.aliUsePayPublicKey)
          this.signData.contactMobile=this.signData.aliMobile
          this.request( this.api.financial.financialConfig_paymentConfig,this.signData).then(res =>{
            console.log(res)
            this.$message.success(`保存成功`);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },  
    beforefileUploadChange(file) {
      console.log(file);
      //文件上传之前调用做一些拦截限制
      this.fileList=[]
      this.fileList.push({name:file.name});
      this.fileTag="已上传"
    },
  }
};
</script>

<style lang="less" scoped>
.store_name_div{
    position:absolute;
    right:42px;
    top:80px;
    color:#222;
    font-weight:bold;
}
.tab_div{
    margin: 0 10px;
    padding:0 32px;
    background-color: #fff;
}
.search_div {
  margin: 0 10px;
  padding-top: 20px;
  background-color: #fff;
  .first-input {
    width: 300px;
  }
}
.amountFount{
  color:red;
}
.table_div {
  margin: 10px;
  background-color: #fff;
  padding-top: 20px;
  padding-left: 10px;
}
.page_div{
  margin-top:20px;
  padding-bottom:10px;
  margin-right:20px;
  display:flex;
  align-items:center;
}
.upload-file{
  display:flex;
  color:#222;
  font-size:15px;
  span {
    margin-left:15px;
  }
}
</style>



