<template>
    <el-dialog
            :title="itemParam.title"
            :visible.sync="classDialogVisible"
            class="alarmPopup"
            width="600px"
    >
        <el-form :model="filtersData" :rules="rules" label-width="200px" size="small" ref="filtersForm" inline>
            <div>
                <el-form-item prop="name" label="预警名称：">
                    <el-input placeholder="请输入内容" class="input-w" :disabled="showDisabled"  width="120px"
                              v-model="filtersData.name"></el-input>
                </el-form-item>
            </div>
            <div>
                <el-form-item prop="type" label="预警类型：" :disabled="showDisabled" width="100px">
                    <code-set v-model="filtersData.type" code="CEN017"/>
                </el-form-item>
            </div>

            <div>
                <el-form-item prop="tag" label="预警标签：" width="120px">
                    <el-input :rows="1" placeholder="最多4个字符" type="textarea" class="input-w" :disabled="showDisabled"
                              v-model="filtersData.tag"></el-input>
                </el-form-item>
            </div>
            <div>
                <el-form-item prop="color" label="预警颜色：" width="120px">
                    <el-color-picker v-model="filtersData.color"></el-color-picker>
                </el-form-item>
            </div>
            <div>
                <el-form-item prop="used" label="启停状态：" width="80">
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
        name: 'warningType_details',
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
                    used: false
                },
                CategoryOptions: [],
                //验证
                rules: {
                    name: [
                        {required: true, message: "请输入模板名称", trigger: "blur"}
                    ],
                    tag: [
                        {required: true, message: "请输入模板内容", trigger: "blur"},
                        { max: 5, message: '最多4个字符', trigger: 'blur' }
                    ],
                    used: [
                        {required: true, message: "请输入启停状态", trigger: "blur"}
                    ],
                    type: [
                        {required: true, message: "请输入模板类型", trigger: "blur"}
                    ],
                    color: [
                        {required: true, message: "颜色必选", trigger: "blur"}
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
            warningTypeDetailsPopupInit() {
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
                        this.getData();
                        break;
                    case "show": //查看
                        this.editDisabled = true;
                        this.showDisabled = true;
                        this.getData();
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
                        this.request(this.api.system.warningType_save, this.filtersData).then(data => {
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
            getData() {
                this.request(this.api.system.warningType_get, {id: this.itemParam.id}).then(data => {
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
