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
           <el-select v-else placeholder="请选择" class="input-w" :disabled="editDisabled" v-model="filtersData.parentId">
              <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  prop="name"  label="分类名称：">
         <el-input placeholder="请输入内容" class="input-w" :disabled="editDisabled" v-model="filtersData.name"></el-input>
        </el-form-item>
        <el-form-item prop="customizedType" label="定制类型：">
          <el-select  class="input-w" placeholder="请选择" :disabled="editDisabled" v-model="filtersData.customizedType">
            <el-option
              v-for="item in customizedTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item  prop="description"  label="分类描述：">
         <el-input type="textarea" placeholder="请输入内容" class="input-w-2" :disabled="showDisabled" v-model="filtersData.description"></el-input>
        </el-form-item>
         <el-form-item  prop="image"  label="分类图片：">
           <el-upload-img
            v-model="filtersData.image"
            :EchoDisplayImages="productImages"
            CatalogName="product"
            ></el-upload-img>
        </el-form-item>
        <el-form-item prop="valid" label="有效状态：">
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
import ElUploadImg from '@/components/uploadImg/el_upload_img';
/**
 * 定制分类列表
 */
const customizedTypeList = [{id:1,name:'套装'},{id:2,name:'单品'}];
export default {
    name:'tp-custom',
    props: {
        itemParam: {
          type:Object,
        },
    },
    data(){
        return{
            customizedTypeList,
            attributeDialogVisible:false,
            filtersData:{
                image:"",//分类图片
                description:"",//定制描述
                name: "", //分类名称
                parentId: null, //父级分类  已有分类选择 如果为1及分类则为NULL
                parentName:null,
                valid: true, // 使用状态
                type:2,
                customizedType:null
            },
             cateArr:[],
            props:{
              value: 'id',
              label:'name',
              children: 'children'
            },
           productImages:[],
            //验证
            rules:{
              name:[
                { required: true, message: "请输入分类名称", trigger: "blur" }
              ],
              customizedType:[ { required: true, message: "请选择定制类型", trigger: "blur" }]
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
          this.$common.getClassSelect(this,2).then(res =>{
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
            image:"",//分类图片
            description:"",//定制描述
            name: "",
            parentId: null,
            parentName:null,
            valid: true,
            type:2
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
           this.productImages=[];
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
           if(!!data.image){
              this.productImages=[{url:data.image}];
           }else{
             this.productImages=[];
           }
            this.filtersData=data;
          })
        },
        //修改表单
        editForm(formName){
          this.submitForm(formName);
        },
    },
    components: {
      ElUploadImg
    },
}
</script>
<style lang="less" scoped>

</style>
