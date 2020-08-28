<!--
 * @Description:新增商品
 * @Author: elephant
 * @Date: 2019-08-20 08:58:21
 * @LastEditTime : 2020-01-07 10:53:39
 * @LastEditors  : Please set LastEditors
 -->
<template>
  <div class="item-margin bg-fff LSS-Dpd add-comdity">
    <h3>选择分类</h3>
    <h5>选择服装分类将决定所要填写表单内容，请认真选择</h5>
    <el-form :model="filtersData" label-width="100px" :rules="rules" size="small" ref="filtersForm">
      <el-row class="add-cdty-row">
        <el-col :span="5">

        </el-col>
        <el-col :span="14">
          <!-- <el-form-item prop="name" label="原始款号：">
            <el-input v-model="filtersData.name" @blur="originalCode" class="input-w-2" placeholder="请输入原始款号"></el-input>
          </el-form-item> -->
          <el-form-item prop="cateId"  label="选择分类：">
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
      <el-button size="small" type="primary" @click="submitForm('filtersForm')">确认创建</el-button>
      <el-button size="small" @click="handleResetFilters('filtersForm')">重置分类</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filtersData: {
        cateId: "",
        name: ""
      },
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      isToPuth:false,
      cateArr: [],
      rules: {
        //规则验证
        cateId: [{ required: true, message: "请选择分类", trigger: "change" }],
        name: [{ required: true, message: "请输入原始款号", trigger: "blue" }]
      },
      classData:[],
      classList:[]
    };
  },
  computed: {

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
      this.filtersData.cateCode = obj.code;
      this.filtersData.cateName = obj.name;
      this.filtersData.cateIdentifier = obj.identifier;
      this.filtersData.fullCateName = obj.fullCateName;

    },
    //
    originalCode(){
      let _name=this.filtersData.name;
      if(_name == "" || _name == undefined || _name == null || (_name.length >0 && _name.trim().length == 0)){
        this.$message({
          type: "error",
          message: '原始款号不能为空！'
        });
         return false;
       }
        this.request(this.api.product.product_verificationRepeat,{originalCode:this.filtersData.name})
        .then(res => {
            this.isToPuth=true;
            this.$message({
              type: "success",
              message: '该原始款号可以使用'
            });

        })
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
          // if(!this.isToPuth){
          //    this.$message({
          //       type: "error",
          //       message: '验证不通过！'
          //     });
          //   return false
          // }
          let params=this.filtersData;
          this.$router.push({
            path: "/product/commodity/commodityDetails",
            query: {
              cateId: params.cateId,
              cateName: params.cateName,
              cateIdentifier: params.cateIdentifier,
              fullCateName :params.fullCateName,
              cateCode:params.cateCode,
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
.add-selectW {
  width: 80%;
}
.add-btn-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
