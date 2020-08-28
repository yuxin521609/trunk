<template>
    <el-dialog
            :title="itemParam.title"
            :visible.sync="classDialogVisible"
            class="alarmPopup"
            width="600px"
    >
        <el-form :model="filtersData" :rules="rules" label-width="100px" size="small" ref="filtersForm" inline>
            <el-form-item prop="type" label="消息模板类型：">
                <el-input placeholder="请输入内容" class="input-w" :disabled="showDisabled"
                          v-model="filtersData.type"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="模板名称：">
                <el-input placeholder="请输入内容" class="input-w" :disabled="showDisabled"
                          v-model="filtersData.name"></el-input>
            </el-form-item>
            <el-form-item prop="content" label="模板内容：">
                <el-input :rows="5" placeholder="请输入内容" type="textarea" class="input-w" :disabled="showDisabled"
                          v-model="filtersData.content"></el-input>
            </el-form-item>
            <el-form-item prop="used" label="启停状态：">
                <el-select class="input-w" placeholder="请选择" :disabled="showDisabled" v-model="filtersData.used">
                    <el-option
                            v-for="item in this.getValidOptions()"
                            :key="item.status_id"
                            :label="item.status_name"
                            :value="item.status_id"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="item-right">
            <el-button size="small" @click="closeDialog('filtersForm')">取消</el-button>
            <el-button v-if="this.itemParam.type == 'add'" size="small" @click="submitForm('filtersForm')"
                       type="primary">确定
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        name: 'tp-class-details',
        props: {
            itemParam: {
                type: Object,
            },

        },
        data() {
            return {
                classDialogVisible: false,
                filtersData: {
                    type: "", // 新增新增模板编码
                    name: "", //模板名称
                    parentId: null, //父级模板  已有模板选择 如果为1及模板则为NULL
                    valid: true // 使用状态
                },
                CategoryOptions: [],
                //验证
                rules: {
                    name: [
                        {required: true, message: "请输入模板名称", trigger: "blur"}
                    ],
                    content: [
                        {required: true, message: "请输入模板内容", trigger: "blur"}
                    ],
                    used: [
                        {required: true, message: "请输入启停状态", trigger: "blur"}
                    ],
                    type: [
                        {required: true, message: "请输入模板类型", trigger: "blur"}
                    ]
                },
                editDisabled: true,//可编辑状态  除使用状态其他都不可编辑
                showDisabled: true,//查看时 使用状态不可编辑
            }
        },
        watch: {
            // itemJsonParam(newData,oldData){
            //   this.filtersData=newData;
            // }
        },
        methods: {
            getValidOptions (){
                let arr=[{
                    status_id:true,
                    status_name:'使用中'
                },{
                    status_id:false,
                    status_name:'未使用'
                }];
                return  arr
            },
            //初始化
            noticeTemplateDetailsPopupInit() {
                this.filtersData = {
                    code: "",
                    name: "",
                    type: "",
                    used: true
                }
                //对象还需初始化
                let itemStatus = this.itemParam.type;
                switch (itemStatus.toString()) {
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
                this.classDialogVisible = true;
            },
            //关闭
            closeDialog(formName) {
                this.classDialogVisible = false;
                this.$refs[formName].resetFields(); //重置选项
            },
            //保存表单
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.request(this.api.system.noticeTemplate_save,this.filtersData).then(data=>{
                            this.closeDialog(formName);
                            this.$emit("refreshItem", "刷新吧兄弟");

                        });
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            //获取列表数据
            getClassData() {
                this.request(this.api.system.noticeTemplate_get,{id: this.itemParam.id}).then(data=>{
                    this.filtersData = data;
                })
            },
            //修改表单
            editForm(formName) {
                this.submitForm(formName);
            },
        }
    }
</script>
<style lang="less" scoped>

</style>
