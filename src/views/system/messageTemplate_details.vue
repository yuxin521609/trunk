<template>
    <el-dialog
            :title="itemParam.title"
            :visible.sync="classDialogVisible"
            class="alarmPopup"
            width="600px"
    >
        <el-form :model="filtersData" :rules="rules" label-width="200px" size="small" ref="filtersForm" inline>
            <div>
                <el-form-item prop="type" label="消息类型：" :disabled="showDisabled" width="120px">
                    <code-set v-model="filtersData.type" code="CEN015"/>
                </el-form-item>
            </div>
            <div>
                <el-form-item prop="name" label="消息名称：">
                    <el-input placeholder="请输入内容" class="input-w" :disabled="showDisabled"  width="120px"
                              v-model="filtersData.name"></el-input>
                </el-form-item>
            </div>
            <div>
                <el-form-item prop="content" label="模板内容：" width="120px">
                    <el-input :rows="5" placeholder="请输入内容" type="textarea" class="input-w" :disabled="showDisabled"
                              v-model="filtersData.content"></el-input>
                </el-form-item>
            </div>
            <div>
                <el-form-item prop="used" label="启停状态：" width="120">
                    <el-switch v-model="filtersData.used" active-color="#13ce66" inactive-color="#9d9d9d"></el-switch>
                </el-form-item>
            </div>
        </el-form>
        <div class="item-right">
            <el-button size="small" @click="closeDialog('filtersForm')">取消</el-button>
            <el-button v-if="this.itemParam.type != 'show'" size="small" @click="submitForm('filtersForm')"
                       type="primary">确定
            </el-button>
        </div>
    </el-dialog>
</template>


<script>
    import codeSet from "@/components/codeSet";

    export default {
        components: {codeSet},
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
                    used: false
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
            getValidOptions() {
                let arr = [{
                    status_id: true,
                    status_name: '使用中'
                }, {
                    status_id: false,
                    status_name: '未使用'
                }];
                return arr
            },
            //初始化
            messageTemplateDetailsPopupInit() {
                this.filtersData = {
                    code: "",
                    name: "",
                    type: "",
                    used: false
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
                        this.request(this.api.system.messageTemplate_save, this.filtersData).then(data => {
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
                this.request(this.api.system.messageTemplate_get, {id: this.itemParam.id}).then(data => {
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
