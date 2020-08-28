<template>
    <el-dialog
    :title="itemParam.title"
    :visible.sync="attributeDialogVisible"
    class="alarmPopup"
    width="500px"
    >
    <el-form :model="filtersData" :rules="rules" label-width="100px" size="small" ref="filtersForm" inline>
        <el-form-item  parentId="parentId"  label="父级分类：">
           <el-cascader
           class="input-w"
            v-if="itemStatus == 'add'"
           :disabled="editDisabled"
            :options="classData"
             v-model="cateArr"
             :value="cateArr"
             @change="cascaderGet"
             :show-all-levels="false"
             :props="props"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item  prop="name"  label="分类名称：">
         <el-input placeholder="请输入内容" class="input-w" :disabled="editDisabled" v-model="filtersData.name"></el-input>
        </el-form-item>
         <el-form-item v-if="itemStatus != 'add'" prop="code"  label="分类编码：">
         <el-input placeholder="请输入内容" class="input-w" :disabled="editDisabled" v-model="filtersData.code"></el-input>
        </el-form-item>
        <el-form-item prop="valid" label="使用状态：">
          <el-select  class="input-w" placeholder="请选择" :disabled="showDisabled" v-model="filtersData.valid">
            <el-option
              v-for="item in this.$common.getValidOptions()"
              :key="item.status_id"
              :label="item.status_name"
              :value="item.status_id"
            ></el-option>
          </el-select>
        </el-form-item>
    </el-form>
    <div class="item-right">
        <el-button size="small" @click="closeDialog('filtersForm')">取消</el-button>
        <el-button  v-if="this.itemParam.type == 'add'" size="small" @click="submitForm('filtersForm')" type="primary">确定</el-button>
        <el-button  v-else-if="this.itemParam.type == 'edit'" size="small" @click="editForm('filtersForm')" type="primary">修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
    name:'tp-attribute',
    props: {
        itemParam: {
          type:Object,
        },
    },
    data(){
        return{
            attributeDialogVisible:false,
            filtersData:{
                code: "", // 新增新增分类编码
                name: "", //分类名称
                parentId: null, //父级分类  已有分类选择 如果为1及分类则为NULL
                parentName:null,
                valid: true, // 使用状态
                type:3
            },
            cateArr:[],
            props:{
              value: 'id',
              label:'name',
              children: 'children'
            },
            //验证
            rules:{
              name:[
                { required: true, message: "请输入分类名称", trigger: "blur" }
              ],
              code:[
                { required: true, message: "请输入分类编码", trigger: "blur" }
              ]
            },
            editDisabled:true,//可编辑状态  除使用状态其他都不可编辑
            showDisabled:true,//查看时 使用状态不可编辑
             classData:[],
            classList:[],
            itemStatus:''
        }
    },
    created () {
       this.getListData();
    },
    methods:{
       getListData(){
          this.$common.getClassSelect(this,3).then(res =>{
            this.classData=res.ztree;
            this.classList=res.list;
          })
      },
        cascaderGet(e){
          this.filtersData.parentId=JSON.parse(JSON.stringify(e)).pop();
          let obj=this.classList.find((item) => (item.id ==  this.filtersData.parentId))
          this.filtersData.parentName = obj.name;
        },
        //初始化
        attributePopupInit(){
          this.filtersData = {
            code: "",
            name: "",
            parentId: null,
            parentName: null,
            valid: true,
             type:3
          }
          //对象还需初始化
          this.itemStatus = this.itemParam.type;
          switch (this.itemStatus.toString()) {
            case "add": //新增
              this.editDisabled = false;
              this.showDisabled = false;
              break;
            case "edit": //修改
              this.editDisabled = true;
              this.showDisabled = false;
              this.getClassData();
              break;
            case "show": //查看
              this.editDisabled = true;
              this.showDisabled = true;
              this.getClassData();
              break;
          }
            this.attributeDialogVisible=true;
        },
        //关闭
        closeDialog(formName){
            this.attributeDialogVisible=false;
            this.$refs[formName].resetFields(); //重置选项
        },
        //保存表单
        submitForm(formName){
           this.$refs[formName].validate(valid => {
              if (valid) {
                  this.request(this.api.product.categories_save, this.filtersData).then(data => {
                  this.$message.success('保存成功');
                  this.closeDialog(formName);
                  setTimeout(() => {
                      this.$emit("refreshItem", "刷新吧兄弟");
                  }, 2000);

                });
              } else {
                console.log("error submit!!");
                return false;
              }
            });
        },
        //获取列表数据
        getClassData(){
          this.request(this.api.product.categories_get,{id:this.itemParam.id}).then(data=>{
              this.cateArr=[];
              this.cateArr.push(data.parentId)
              this.filtersData=data;
          })
        },
        //修改表单
        editForm(formName){
          this.submitForm(formName);
        },
    }
}
</script>
<style lang="less" scoped>

</style>
