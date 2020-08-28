<template>
  <div>
    <el-form :rules="rules" label-width="110px" :model="filtersData" size="small" ref="filtersForm">
      <div class="tlogy-item">
        <el-form-item prop="type" label="操作系统：">
          <el-select
            placeholder="请选择"
            class="input-w-2"
            :disabled="showDisabled"
            :value="filtersData.type"
            v-model="filtersData.type"
            @change="handleTypeChange"
          >
            <el-option
              v-for="item in typeListData"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item prop="version" label="升级版本：">
          <el-select
            @change="handleVersionGet"
            :placeholder="!!filtersData.type ? '请选择':'请先选择操作系统'"
            class="input-w-2"
            :disabled="showDisabled || !filtersData.type"
            :value="filtersData.version"
            v-model="filtersData.version"
          >
            <el-option
              v-for="item in versionListData"
              :key="item.version"
              :label="item.version"
              :value="item.version"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item prop="forcedUpgrade" label="升级形式：">
          <el-select
            placeholder="请选择"
            class="input-w-2"
            :disabled="showDisabled"
            :value="filtersData.forcedUpgrade"
            v-model="filtersData.forcedUpgrade"
          >
            <el-option
              v-for="item in forcedUpgradeOpts"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item prop="upgradeScope" label="升级范围：">
          <el-select
            placeholder="请选择"
            class="input-w-2"
            :disabled="showDisabled"
            :value="filtersData.upgradeScope"
            v-model="filtersData.upgradeScope"
          >
            <el-option
              v-for="item in upgradeScopeOpts"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="downloadUrl" label="升级URL：">
          <el-input
            :disabled="showDisabled"
            v-model="filtersData.downloadUrl"
            class="input-w-2"
            placeholder="http://或https://"
          ></el-input>
        </el-form-item>
        <el-form-item prop="description" label="升级提示：">
          <el-input
            type="textarea"
            class="input-w-2"
            autosize
            :disabled="showDisabled"
            placeholder="请输入内容"
            v-model="filtersData.description"
          ></el-input>
        </el-form-item>
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
    </el-form>
  </div>
</template>
<script>
import { validatDwnloadUrl } from "@/utils/validate";
export default {
  data() {
    return {
      filtersData: {
        description: "",
        version: "",
        versionId:"",
        type:"",
        forcedUpgrade:null,
        downloadUrl:'',
        upgradeScope:'',
      },
      typeListData:[{name:'Android'},{name:'iOS'}],
      forcedUpgradeOpts:[{name:'强制',type:true},{name:'可选',type:false}],
      upgradeScopeOpts:[{name:'全部',type:'all'}],
      versionListData:[],
      showDisabled: false,
      editDisabled: false,
      _type: "",
      _id: "",
      rules: {
        //规则验证
        type: [
          { required: true, message: "请选择操作系统", trigger: "change" }
        ],
        version: [{ required: true, message: "请选择版本号", trigger: "change" }],
        forcedUpgrade: [
          { required: true, message: "请选择升级形式", trigger: "change" }
        ],
         upgradeScope: [
          { required: true, message: "请选择升级范围", trigger: "change" }
        ],
        downloadUrl: [
          { required: true, message: "请输入升级地址", trigger: "blur" },
           { validator: validatDwnloadUrl, trigger: "blur" }
        ],
      },
      //分类使用
    };
  },
  created() {
    this.init();
    this.getQueryparams();
  },
  methods: {
    init(){
      this.filtersData= {
        description: "",
        version: "",
        versionId:"",
        type:"",
        forcedUpgrade:null,
        downloadUrl:'',
        upgradeScope:'',
      };
    },
    //获取上页面参数
    getQueryparams() {
      this._type = this.$route.query.type;
      this._id = this.$route.query.id;
      let itemStatus = this._type;
      switch (itemStatus.toString()) {
        case "add": //新增
          this.editDisabled = false;
          this.showDisabled = false;
          break;
        case "edit": //修改
          this.editDisabled = true;
          this.showDisabled = false;
          this.getEchoDisplayData();
          break;
        case "show": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.getEchoDisplayData();
          break;
      }
    },
    //切换处理
    handleTypeChange(item){
      this.filtersData.version='';
      this.filtersData.versionId='';
      this.getVersionList(item);
    },
    getVersionList(item){
      this.request(this.api.version.applicationVersion_list, {type:item}).then(data => {
        let _data = data.data;
        console.log(_data);
        this.versionListData= _data;
      });
    },
    //版本号发生改变时 获取版本号ID 并赋值
    handleVersionGet(e){
      let obj =this.versionListData.find(item => item.version == e );
      this.filtersData.versionId=obj.id;
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.request(
            this.api.version.applicationVersionControl_save,
            this.filtersData
          ).then(res => {
            this.$message.success("保存成功");
            setTimeout(() => {
              this.routerback();
            }, 500);
          });
        } else {
          return false;
        }
      });
    },

    //回显
    getEchoDisplayData() {
      this.request(this.api.version.applicationVersionControl_get, {
        id: this._id
      }).then(res => {
          this.filtersData=res;
          this.getVersionList(res.type)
      });
    },
    //后退
    routerback() {
      this.$router.go(-1);
    }
  }

};
</script>
<style lang="less" scoped>
.tlogy-item {
  background-color: #ffffff;
  margin: 10px;
  padding: 10px;
}

</style>
