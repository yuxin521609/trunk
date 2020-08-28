<template>
  <div class="content">
    <div class="left-content">
      <div class="left">
        <span>仓库列表</span>
        <el-button type="primary" class="add-btn" size="small" @click="addBtnCliclEvent">新增</el-button>
      </div>
      <div class="warehouse-name" v-if="warehouseData.length>0">
        <span>仓库名称</span>
        <ul>
          <li
            v-for="(item,index) in warehouseData"
            :key="item.id"
            @click="warehouseLiClickEvent(index)"
          >{{item.warehouseName}}</li>
        </ul>
      </div>
      <div class="blank" v-else>
        <span>暂无仓库</span>
      </div>
    </div>
    <div class="right-content">
      <div v-if="contentTable || warehouseData.length>0">
        <div class="right">
          <span>仓库信息</span>
          <el-button
            type="primary"
            class="add-btn"
            size="small"
            @click="saveBtnCliclEvent('ruleForm')"
          >{{routerTypeTitle}}</el-button>
        </div>
        <div class="right-form">
          <el-form
            :model="signData"
            :rules="rules"
            ref="ruleForm"
            label-width="130px"
            class="demo-ruleForm"
          >
            <el-form-item label="仓库编码：" prop="warehouseCode">
              <el-input
                v-model="signData.warehouseCode"
                style="width:300px"
                placeholder="请输入仓库编码"
                maxlength="10"
                :disabled='isEditor'
              ></el-input>
            </el-form-item>
            <el-form-item label="仓库名称：" prop="warehouseName">
              <el-input v-model="signData.warehouseName" style="width:300px" placeholder="请输入仓库名称" :disabled="editorType"></el-input>
            </el-form-item>
            <el-form-item label="仓库类型：" prop="warehouseType">
              <el-select v-model="signData.warehouseType" placeholder="请选择" style="width:300px" :disabled="editorType">
                <el-option
                  v-for="item in warehouseTypeData"
                  :key="item.id"
                  :label="item.description"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="divisionId" label="仓库地址：">
              <div style="width:750px;">
                <division @set-division="setDivision" ref="division" v-model="signData.divisionId" :isDisabled="editorType"></division>
              </div>
            </el-form-item>
            <el-form-item prop="address" label="详细地址：">
              <el-input v-model="signData.address" style="width:300px" placeholder="请输入详细地址" :disabled="editorType"></el-input>
            </el-form-item>
            <el-form-item label="联系人：" prop="contact">
              <el-input v-model="signData.contact" style="width:300px" placeholder="请输入联系人" :disabled="editorType"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：" prop="telephone">
              <el-input
                v-model="signData.telephone"
                style="width:300px"
                maxlength="11"
                placeholder="请输入联系方式"
                :disabled="editorType"
              ></el-input>
            </el-form-item>
            <el-form-item label="仓库管控路由：" prop="externalApplication" class="right-router">
              <el-select
                v-model="signData.externalApplication"
                :disabled="editorType"
                placeholder="请选择"
                style="width:300px"
                @change="selectWarehouseRouterData"
              >
                <el-option
                  v-for="item in warehouseRouterData"
                  :key="item.id"
                  :label="item.appName"
                  :value="item.appName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="启停状态：" prop="isValid">
              <el-switch v-model="signData.isValid" active-color="#13ce66" inactive-color="#ff4949" :disabled="editorType"></el-switch>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="blank" v-else>
        <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
import division from "@/components/division";
import { isvalidPhone } from "@/utils/phonevalide";
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};

export default {
  components: {
    division
  },
  data() {
    return {
      routerTypeTitle: "保存",
      //标识新增仓库还是编辑仓库
      isEditor:false,
      //标识当前是新增还是保存
      editorType:false,
      //标记当前仓库的索引值
      idx: -1,
      //仓库列表数据源
      warehouseData: [],
      //外部管控路由接口
      warehouseRouterData: [],
      //隶属机构数据
      organizationListData: [],
      //表单数据
      signData: {
        id: "",
        //仓库编码
        warehouseCode: "",
        //仓库名称
        warehouseName: "",
        //仓库类型
        warehouseType: "",
        //联系人
        contact: "",
        //联系电话
        telephone: "",
        //外部拓展应用ID
        externalPropertiesId: "",
        //外部拓展应用名称
        externalApplication: "",
        //启停状态
        isValid: false,
        //地址相关
        divisionId: "",
        provinceName: "",
        provinceCode: "",
        cityName: "",
        cityCode: "",
        areaName: "",
        areaCode: "",
        address: ""
      },
      //仓库类型数据
      warehouseTypeData: [],
      rules: {
        warehouseCode: [
          { required: true, message: "仓库编码不能为空", trigger: "blur" }
        ],
        warehouseName: [
          { required: true, message: "仓库名称不能为空", trigger: "change" }
        ],
        warehouseType: [
          { required: true, message: "仓库类型不能为空", trigger: "change" }
        ],
        contact: [
          { required: true, message: "联系人不能为空", trigger: "change" }
        ],
        telephone: [{ required: true, trigger: "blur", validator: validPhone }],
        divisionId: [
          { required: true, message: "联系地址不能为空", trigger: "change" }
        ],
        address: [
          { required: true, message: "详细地址不能为空", trigger: "change" }
        ],
        externalApplication: [
          { required: true, message: "管控路由不能为空", trigger: "change" }
        ]
      },
      //左侧仓库名称
      warehouseLeft: false,
      //右侧内容
      contentTable: false
    };
  },
  watch: {
    routerTypeTitle(val){
      if(val=='编辑'){
        this.isEditor=true;
        this.editorType=true;
      }else{
        // this.isEditor=false;
        this.idx=-1
        this.editorType=false;
      }
    }
  },
  mounted() {
    this.getOrganizationListData();
    //得到仓库列表数据
    this.getWarehouseListData();
  },
  methods: {
    // routerSymbol(rule, value, callback) {
    //   if (
    //     this.signData.routerSymbol == "1" &&
    //     !this.signData.externalApplication
    //   ) {
    //     callback(new Error("请选择WMS"));
    //   } else {
    //     callback();
    //   }
    // },
    //得到组织机构数据
    async getOrganizationListData() {
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      console.log(info);
      //得到直属机构与关联机构（type-0 机构 type-1 部门）
      this.request(this.api.user.userCompany_getUserAllDepartByUserId, {
        userId: info.userId,
        type: 0
      }).then(data => {
        //得到组织机构数据
        this.organizationListData = data;
        console.log(data);
      });
    },
    //得到仓库列表数据
    getWarehouseListData() {
      this.request(this.api.warehouse.warehouseBase_warehouse_list, {}).then(
        res => {
          console.log(res);
          this.warehouseData = res.data;
          if(res.data.length==0)return;
          this.routerTypeTitle='编辑'
          this.$nextTick(() => {
            this.signData = JSON.parse(JSON.stringify(res.data[0]));
          });

        }
      );
      //得到仓库类型数据 code==07 仓库类型
      this.request(
        this.api.warehouse.warehouseBase_configurationDictionaryByCode,
        { code: "CONFIGURABLE07" }
      ).then(res => {
        this.warehouseTypeData = res;
      });
      //得到仓库管控路由数据
      this.request(
        this.api.warehouse.warehouseBase_extApplication_list,
        {}
      ).then(res => {
        console.log(res);
        this.warehouseRouterData = res;
      });
    },
    //选中了仓库路由数据
    selectWarehouseRouterData(val) {
      var externalPropertiesId = this.warehouseRouterData.find(
        item => item.appName == val
      ).id;
      this.signData.externalPropertiesId = externalPropertiesId;
    },
    //新增Btn的点击事件
    addBtnCliclEvent() {
      console.log("新增btn的点击事件---");
      this.$nextTick(() => {
        this.isEditor=false;
        this.contentTable = true;
        this.idx = -1;
        //重置数据
        this.routerTypeTitle = "保存";
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields();
          this.signData.id = "";
        })
        this.$refs.division.init(); 
        this.signData.externalApplication = "";
      });
    },
    //新增仓库的点击事件
    warehouseLiClickEvent(index) {
      if (this.idx != index) {
        this.isEditor=true;
        this.routerTypeTitle = "编辑";
        this.request(this.api.warehouse.warehouseBase_warehouse_getByPrimary, {
          id: this.warehouseData[index].id
        }).then(res => {
          console.log(res);
          this.$nextTick(() => {
            this.signData = res;
          });
        });
        this.idx = index;
      }
    },
    //保存Btn的点击事件
    saveBtnCliclEvent(formName) {
      if(this.routerTypeTitle=='编辑'){
        this.isEditor=true;
        this.routerTypeTitle ='保存'
        return
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.request(
            this.api.warehouse.warehouseBase_warehouse_save,
            this.signData
          ).then(res => {
            console.log(res);
            this.$nextTick(() => {
              //保存成功,刷新数据
              this.getWarehouseListData();
              this.routerTypeTitle = "编辑";
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setDivision(var1) {
      this.signData.provinceName = var1.province;
      this.signData.provinceCode = var1.provinceCode;
      this.signData.cityName = var1.municipality;
      this.signData.cityCode = var1.municipalityCode;
      this.signData.areaName = var1.area;
      this.signData.areaCode = var1.areaCode;
      this.signData.divisionId = var1.divisionId;
    }
  }
};
</script>

 <style lang="less" scoped>
.content {
  .left-content {
    position: absolute;
    background-color: white;
    width: 20%;
    top: 70px;
    bottom: 10px;
    .left {
      margin: 10px;
      display: flex;
      flex-direction: column;
      span {
        border-bottom: 1px solid #ddd;
        padding: 10px;
        // padding-bottom:15px;
        // padding-left:10px;
      }
      .add-btn {
        width: 60px;
        position: absolute;
        top: 12px;
        right: 18px;
      }
    }
    .warehouse-name {
      margin: 10px;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      span {
        color: #222;
        font-weight: 700;
        border-bottom: 1px solid #ddd;
        padding: 10px;
      }
      li {
        padding: 10px;
        border-bottom: 1px solid #ddd;
      }
      li:hover {
        background-color: #fafafa;
      }
    }
  }
  .right-content {
    position: absolute;
    background-color: white;
    width: 79%;
    left: 20.5%;
    top: 70px;
    bottom: 10px;
    .right {
      margin: 10px;
      padding: 5px;
      border-bottom: 1px solid #ddd;
      display: flex;
      align-items: center;
      span {
        flex: auto;
      }
    }
    .right-form {
      margin-top: 20px;
    }
  }
  .blank {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #ddd;
    font-size: 35px;
  }
  .right-router /deep/ .el-form-item__error{
    left: 260px;
  }
}
</style>