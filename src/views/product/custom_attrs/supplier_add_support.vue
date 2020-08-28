<template>
  <div class="item-margin bg-fff LSS-Dpd add-comdity">
    <h3>选择制造商以及支持分类</h3>
    <h5>选择制造商和分类将决定所要填写表单内容，请认真选择</h5>
    <el-form :model="filtersData" label-width="120px" :rules="rules" size="small" ref="filtersForm">
      <el-row class="add-cdty-row">
        <el-col :span="5"></el-col>
        <el-col :span="14">
          <el-form-item prop="manufacturerId" label="选择制造商：">
            <el-select
              @change="manufacturerGet"
              class="input-w-2"
              placeholder="请选择"
              v-model="filtersData.manufacturerId"
            >
              <el-option
                v-for="(item,index) in manufacturerOptions"
                :key="index.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="cateId" label="商品分类：">
            <el-cascader
              class="input-w-2"
              :options="classData"
              v-model="cateArr"
              :value="cateArr"
              @change="cascaderGet"
              :show-all-levels="false"
              :props="props"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="add-btn-wrap">
      <el-button size="small" type="primary" @click="submitForm('filtersForm')">确认新增</el-button>
      <el-button size="small" @click="handleResetFilters('filtersForm')">重置条件</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filtersData: {
        cateId: "",
        manufacturerId:'',
        cateName:"",
        cateIdentifier:"",
        fullCateName:'',
        manufacturerName:'',
      },
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      manufacturerOptions: [], //制造商
      cateArr: [],
      rules: {
        //规则验证
        cateId: [{ required: true, message: "请选择分类", trigger: "change" }],
        manufacturerId: [
          { required: true, message: "请选择制造商", trigger: "change" }
        ]
      },
      classData: [],
      classList: []
    };
  },
  computed: {},
  created() {
    this.getClassData();
    this.getManufacturerOption();
  },
  methods: {
    manufacturerGet(val) {
      let _obj = this.manufacturerOptions.find(item => item.id == val);
      this.filtersData.manufacturerName = _obj.name;
    },
    //获取设计商
    getManufacturerOption() {
      this.request(this.api.product.manufacturer_list, {valid:true}).then(data => {
        // console.log(data.data);
        let _data = data.data;
        this.manufacturerOptions = _data;
      });
    },
    getClassData() {
      this.$common.getClassSelect(this, 1).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
    },
    cascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      if (obj.level > 0) {
        this.filtersData.cateId = cateId;
      } else {
        this.filtersData.cateId = "";
        this.$message.error("请选择二级分类");
      }
      this.filtersData.cateName = obj.name;
      this.filtersData.cateIdentifier = obj.identifier;
      this.filtersData.fullCateName = obj.fullCateName;
    },
    //获取
    handleResetFilters(formName) {
      this.$refs[formName].resetFields();
      this.cateArr = [];
    },
    //获取数据跳转
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = this.filtersData;
          this.$router.push({
            path: "/product/custom_attrs/add_support_details",
            name: "add_support_details",
            query: {
              cateId: obj.cateId,
              cateName: obj.cateName,
              cateIdentifier: obj.cateIdentifier,
              fullCateName: obj.fullCateName,
              manufacturerName: obj.manufacturerName,
              manufacturerId: obj.manufacturerId,
              _type: "add"
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.add-selectW {
  width: 80%;
}
.add-btn-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
>
