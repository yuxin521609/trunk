<template>
  <div class="bg-fff item-margin">
    <el-form
      class="item-form"
      :model="this.filtersData"
      :rules="rules"
      label-width="100px"
      size="small"
      ref="filtersForm"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="subType" label="机构类型：">
            <div class="input-w-2">
              <code-set v-model="filtersData.subType" code="CEN001"/>
            </div>
          </el-form-item>
          <el-form-item prop="name" label="机构名称：">
            <el-input
              class="input-w-2"
              width="300"
              :disabled="showDisabled"
              placeholder="请输入内容"
              v-model="filtersData.name"
            ></el-input>
          </el-form-item>
          <el-form-item prop="leaderId" label="机构负责人：">
            <div class="input-w-2">
              <tree-person class="aa" :labelmodel.sync="leader.leaderName" v-model="leader"></tree-person>
            </div>
          </el-form-item>
          <el-form-item prop="divisionId" label="行政地址：">
            <division @set-division="setDivision" v-model="filtersData.divisionId"></division>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="parentId" label="上级机构：">
            <div class="input-w-2">
              <tree-dept
                type="0"
                v-model="filtersData.parentId"
                val-type="id"
                :default-expand-all="true"
              ></tree-dept>
            </div>
          </el-form-item>
          <el-form-item prop="used" label="启停状态：">
            <el-switch v-model="filtersData.used" active-color="#13ce66" inactive-color="#9d9d9d"></el-switch>
          </el-form-item>
          <el-form-item prop="telnum" label="联系电话：">
            <div class="input-w-2">
              <el-input :disabled="showDisabled" placeholder="请输入内容" v-model="filtersData.telnum"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="address" label="详细地址：">
            <div class="input-w-2">
              <el-input :disabled="showDisabled" placeholder="请输入内容" v-model="filtersData.address"></el-input>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="item-footer">
      <el-button
        v-if="this._type == 'add'"
        size="small"
        @click="submitForm('filtersForm')"
        type="primary"
      >确定</el-button>
      <el-button
          v-else-if="this._type == 'edit'"
          size="small"
          @click="submitForm('filtersForm')"
          type="primary"
      >修改</el-button>
      <el-button size="small" @click="routerback('filtersForm')">取消</el-button>
    </div>
  </div>
</template>
<script>
import treeDept from "@/components/treeDept";
import treePerson from "@/components/treePerson";
import codeSet from "@/components/codeSet";
import division from "@/components/division";
import {isvalidPhone} from '@/utils/validate'
var validPhone=(rule, value,callback)=>{
  if (!isvalidPhone(value) && value){
    callback(new Error('请输入正确的11位手机号码'))
  }else {
    callback()
  }
}
export default {
  components: {
    codeSet,
    treeDept,
    treePerson,
    division
  },
  data() {
    // type类型(1男装2女装)
    return {
      // 负责人
      leader: {
        leaderId: "",
        leaderName: ""
      },
      filtersData: {
        // 机构类型
        subType: '',
        // 机构名称
        name: '',
        // 上级机构
        parentId: '',
        // 机构负责人
        leaderId: '',
        // 联系电话
        telnum: '',
        // 详细地址
        address: '',
        // 省市区
        province: '',
        provinceCode: '',
        municipality: '',
        municipalityCode: '',
        area: '',
        areaCode: '',
        divisionId: '',
        // 启停
        used : true
      },
      cateOptions: [],
      rules: {
        //规则验证
        subType: [
          { required: true, message: "请选择机构类型", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
        divisionId: [
          { required: true, message: "请输入行政地址", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "请选择上级机构", trigger: "change" }
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        telnum: [
          { required: false, trigger: "blur", validator: validPhone}
  ]
      },
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
          this.getData();
          break;
        case "show": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.getData();
          break;
      }
    },
    setDivision(var1) {
      this.filtersData.province = var1.province;
      this.filtersData.provinceCode = var1.provinceCode;
      this.filtersData.municipality = var1.municipality;
      this.filtersData.municipalityCode = var1.municipalityCode;
      this.filtersData.area = var1.area;
      this.filtersData.areaCode = var1.areaCode;
      this.filtersData.divisionId = var1.divisionId;
    },
    //获取数据
    getData() {
      this.request(this.api.user.depart_get, { id: this._id }).then(data => {
        this.filtersData = data;
        const leaderId = this.filtersData.leaderId,
          leaderName = this.filtersData.leaderName;
        Object.assign(this.leader, {
          leaderId,
          leaderName
        });
      });
    },
    //新增保存
    submitForm(formName) {
      const leaderId = this.leader.leaderId;
      const leaderName = this.leader.leaderName;
      // 合并对象
      Object.assign(this.filtersData, {
        leaderId,
        leaderName
      });
      let url = this.api.user.depart_create_organization
      if(this._type == 'edit'){
        url = this.api.user.depart_update_organization
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.request(url, this.filtersData).then(
            data => {
              this.$message.success("保存成功");
              this.routerback();
            }
          );
        } else {
          return false;
        }
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
.address-top {
  width: 100%;
  display: flex;
  li {
    flex: 1;
    height: 50px;
    line-height: 50px;
    text-indent: 20px;
    border: 1px solid #eeeeee;
    background-color: rgba(0, 0, 0, 0.05);
  }
  li:nth-child(2) {
    border-left: none;
    flex: 2;
  }
}
.address-cont {
  width: 100%;
  display: flex;
  li {
    padding: 10px 20px;
    flex: 1;
    vertical-align: center;
    border: 1px solid #eeeeee;
    border-top: none;
  }
  li:nth-child(2) {
    flex: 2;
    border-left: none;
  }
}
.address-list {
  .el-icon-error {
    margin-left: 10px;
  }
}
</style>
