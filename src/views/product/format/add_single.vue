<template>
  <div class="item-margin bg-fff LSS-Dpd add-comdity">
    <h3>选择分类</h3>
    <el-form class=" single-form"  :model="filtersData" label-width="120px" :rules="rules" size="small" ref="filtersForm">
        <el-form-item prop="cateId"  label="商品分类：">
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
    </el-form>
    <div class="add-btn-wrap mt-30">
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
      },
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      cateArr: [],
      rules: {
        //规则验证
        cateId: [{ required: true, message: "请选择分类", trigger: "change" }],
      },
      classData:[],
      classList:[]
    };
  },
  created() {
   this.getClassData();
  },
  methods: {
     getClassData(){
        this.$common.getClassSelect(this,1).then(res =>{
           this.classData=res.ztree;
           this.classList=res.list;
        })
      },
    cascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj=  this.classList.find((item)=>(item.id == cateId));
      if(obj.level > 0){
        this.filtersData.cateId=cateId;
      }else{
        this.filtersData.cateId='';
        this.$message.error('请选择二级分类');
      }
      this.filtersData.cateName = obj.name;
      this.filtersData.cateIdentifier = obj.identifier;
      this.filtersData.fullCateName = obj.fullCateName;
    },
    //
    //获取
    handleResetFilters(formName) {
      this.$refs[formName].resetFields();
      this.cateArr = [];
    },
    //获取数据跳转
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$router.push({
            path: "/product/format/add_single",
            name: "add_single",
            query: {
              cateId: this.filtersData.cateId,
              cateName: this.filtersData.cateName,
              cateIdentifier: this.filtersData.cateIdentifier,
              fullCateName :this.filtersData.fullCateName,
              _type: "add",
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
.add-btn-wrap ,.single-form{
  display: flex;
  align-items: center;
  justify-content: center;
}
.single-form{
  margin: 200px 0 100px;
}
</style>

