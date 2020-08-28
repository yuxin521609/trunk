<template>
  <div class="bg-fff item-margin">
    <el-form
      class="item-form"
      :model="filtersData"
      :rules="rules"
      label-width="100px"
      size="small"
      ref="filtersForm"
      inline
    >
      <el-row>
        <div style="display: flex;background-color: white">
          <div class="flex-cen-start">
            <el-form-item prop="subType" label="部门类型：">
              <code-set v-model="filtersData.subType" code="CEN002"/>
            </el-form-item>
          </div>
          <div class="flex-cen-start">
            <el-form-item prop="parentId" label="所属机构：">
              <tree-dept v-model="filtersData.parentId" val-type="id" :default-expand-all="true"></tree-dept>
            </el-form-item>
          </div>
        </div>
        <div style="display: flex;background-color: white">
          <div class="flex-cen-start">
            <el-form-item prop="name" label="部门名称：">
              <el-input
                class="ztree-w"
                :disabled="showDisabled"
                placeholder="请输入内容"
                v-model="filtersData.name"
              ></el-input>
            </el-form-item>
          </div>
          <div class="flex-cen-start">
            <el-form-item prop="used" label="启停状态：">
              <el-switch v-model="filtersData.used" active-color="#13ce66" inactive-color="#9d9d9d"></el-switch>
            </el-form-item>
          </div>
        </div>
      </el-row>
      <el-row>
        <el-form-item label="管辖库房：">
          <ul class="">
            <li v-for="(item,index) in filtersData.warehouseListObj" :key="index" class="address-list">
              <el-select v-model="item.id" placeholder="请选择" :key="index+1">
                <el-option
                    v-for="item in warehouseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
              <i @click="removeWarehouse(index)" class="el-icon-error i-cursor"></i>
            </li>
          </ul>
          <el-button class="mt-10" size="small" @click="addWarehouse()">新增</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="服务区域：">
          <div class="mt-10 address-list" v-for="(item,index) in filtersData.departAreaList" :key="index">
            <division-list :view-model="item" :key="index+1"></division-list>
            <i @click="removeDepartArea(index)" class="el-icon-error i-cursor"></i>
          </div>
          <el-button class="mt-10" size="small" @click="addDepartArea()">新增</el-button>
        </el-form-item>
      </el-row>

    </el-form>
    <div class="item-footer" style="display: flex;background-color: white">
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
      <el-button @click="routerback('filtersForm')" size="small">取消</el-button>
    </div>
  </div>
</template>
<script>
import treeDept from "@/components/treeDept";
import codeSet from "@/components/codeSet";
import divisionList from "@/views/OC/components/divisionList.vue";
/**
 * 规格详情页面 新增 修改 查看 同一页面
 * 1,需求  当页面为修改时 分类 名称 及已有子集不可更改，但新增子集可以更改 ，单选备注等可以更改
 *
 */
export default {
  components: {
    codeSet,
    treeDept,
    divisionList
  },

  data() {
    return {
      filtersData: {
        scope: "",
        prop: "",
        type: 1,
        used: false,
        name: "",
        leaderName: "",
        telnum: "",
        address: "",
        cateId: "",
        productInformationAttributes: [
          {
            name: ""
          }
        ],
        remarks: "",
        valid: true,
        // 新增字段
        // 区域列表
        departAreaList: [],
        // 库房
        warehouseList: [],
        warehouseListObj: []
      },
      cateOptions: [],
      rules: {
        //规则验证
        subType: [
          { required: true, message: "请选择部门类型", trigger: "change" }
        ],
        parentId: [
          { required: true, message: "请选择所属机构", trigger: "change" }
        ],
        name: [{ required: true, message: "请填写部门名称", trigger: "blur" }]
      },
      _type: "",
      _id: "",
      editDisabled: false,
      showDisabled: false,
      // 仓库列表
      warehouseList: []
    }
  },
  created() {
    //获取上页面传参
    this.getQueryparams();
    // 获取仓库列表
    this.getWarehouseList()
  },
  methods: {
    //获取上页面参数
    getQueryparams() {
      //console.log(this.$route.query.id);
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
    //获取仓库数据
    getWarehouseList() {
      this.request(this.api.system.warehouse_list, {}).then(data => {
        this.warehouseList = data.data;
      });
    },
    // 新增仓库
    addWarehouse(){
      this.filtersData.warehouseListObj.push({
        id: ''
      })
    },
    // 删除仓库
    removeWarehouse(index){
      this.filtersData.warehouseListObj.splice(index, 1)
    },
    // 新增地区
    addDepartArea(){
      this.filtersData.departAreaList.push({
        area: '',
        areaCode: '',
        municipality: '',
        municipalityCode: '',
        province: '',
        provinceCode : '',
        divisionId: '',
        type: 1
      })
    },
    // 删除地区
    removeDepartArea(index){
      this.filtersData.departAreaList.splice(index, 1)
    },
    //获取数据
    getData() {
      this.request(this.api.user.depart_get, { id: this._id }).then(data => {
        data.warehouseListObj = data.departWarehousesList.map(item => {
          return {
            id: item.warehouseId
          }
        })
        this.filtersData = data;
      });
    },
    //删除新增内容
    removeDomain(item) {
      let index = this.filtersData.productInformationAttributes.indexOf(item);
      if (index !== -1) {
        this.filtersData.productInformationAttributes.splice(index, 1);
      }
    },
    //新增保存
    submitForm(formName) {
      const warehouseListFlag = this.warehouseListFlag();
      if(!warehouseListFlag){
        this.$message.error('请完善仓库数据');
        return
      }
      const departAreaListFlag = this.departAreaListFlag();
      if(!departAreaListFlag){
        this.$message.error('请完善区域数据');
        return
      }
      let url = this.api.user.depart_create_depart;
      if(this._type == 'edit'){
        url = this.api.user.depart_update_depart;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 仓库转格式
          this.filtersData.warehouseList = this.filtersData.warehouseListObj.map(item => {
            return item.id
          })
          this.request(url, this.filtersData).then(
            data => {
              this.$message.success("保存成功");
              this.routerback();
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 判断是否所有的仓库选择了
    warehouseListFlag(){
      const data = this.filtersData.warehouseListObj
      if(data && data.length){
        for(let i = 0; i < data.length; i++){
          if(!data[i].id){
            return false
          }
        }
      }
      return true
    },
    // 判断是否所有的区域都选了
    departAreaListFlag(){
      const data = this.filtersData.departAreaList
      if(data && data.length){
        for(let i = 0; i < data.length; i++){
          if(!data[i].provinceCode){
            return false
          }
          if(!data[i].municipalityCode){
            return false
          }
          if(!data[i].areaCode){
            return false
          }
        }
      }
      return true
    },
    //后退
    routerback() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
h5 {
  color: #222;
  margin-left: -15px;
}
.flex-cen-start {
  background-color: #fff;
  width: 100%;
  // padding: 20px;
}

.item-margin {
  position: relative;
  width: 100%;
  height: 100%;
}
.address-list {
  margin-bottom: 10px;
  .el-icon-error {
    margin-left: 10px;
  }
}
</style>
