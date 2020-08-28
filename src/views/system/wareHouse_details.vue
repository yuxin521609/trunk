<template>
    <el-dialog
            :title="itemParam.title"
            :visible.sync="classDialogVisible"
            class="alarmPopup"
            width="800px"
    >
    <div class=" bg-fff">
        <el-form :model="filtersData"  :rules="rules"  label-width="100px" size="small"
                 ref="filtersForm">
            <el-row>
                <el-col :span="12"  style="padding-right: 80px;">
                    <el-form-item prop="code" label="仓库编号：">
                        <el-input class="input-w" :disabled="showDisabled" placeholder="请输入内容"
                                  v-model="filtersData.code"></el-input>
                    </el-form-item>
                    <el-form-item prop="orgId" label="隶属机构：">
                        <organization-select v-model="filtersData.orgId" width-class="input-w" ref="organization"></organization-select>
                    </el-form-item>
                    <el-form-item prop="telnum" label="固定电话：">
                        <el-input class="input-w" :disabled="showDisabled" placeholder="请输入内容"
                                  v-model="filtersData.telnum"></el-input>
                    </el-form-item>
                    <el-form-item  prop="type"  label="仓库类型：">
                        <code-set v-model="filtersData.type" code="CEN018" :disabled="showDisabled"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="name" label="仓库名称：">
                        <el-input class="input-w" :disabled="showDisabled" placeholder="请输入内容"
                                  v-model="filtersData.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="leader" label="负责人：">
                        <el-input class="input-w" :disabled="showDisabled" placeholder="请输入内容"
                                  v-model="filtersData.leader"></el-input>
                    </el-form-item>
                    <el-form-item prop="mobilenum" label="手机号：">
                        <el-input class="input-w" :disabled="showDisabled" placeholder="请输入内容"
                                  v-model="filtersData.mobilenum"></el-input>
                    </el-form-item>
                    <el-form-item prop="used" label="启停状态" width="80">
                        <el-switch v-model="filtersData.used" active-color="#13ce66" inactive-color="#9d9d9d"></el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="所在地区：" prop="divisionId">
                        <division v-model="filtersData.divisionId" @set-division="setDivision" ref="division"  :disabled="showDisabled"></division>
                    </el-form-item>
                    <el-form-item label="" prop="address">
                        <el-input v-model="filtersData.address" placeholder="请输入详细地址" class="input-w"  :disabled="showDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="仓库描述：">
                        <el-input type="textarea" v-model="filtersData.description"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="item-footer item-right">
            <el-button size="small" @click="classDialogVisible = false">取消</el-button>
            <el-button size="small" @click="submitForm('filtersForm')" type="primary">确定</el-button>
        </div>
    </div>
    </el-dialog>
</template>
<script>
    import {isvalidPhone} from '@/utils/validate'
    import division from "@/components/division";
    import codeSet from '@/components/codeSet'
    import OrganizationSelect from "@/views/system/components/OrganizationSelect.vue";
    let validPhone=(rule, value,callback)=>{
        if(!value){
            callback(new Error('请输入手机号码'));
        }else if (!isvalidPhone(value) && value){
            callback(new Error('请输入正确的11位手机号码'));
        }else {
            callback();
        }
    };
    export default {
        name:"wareHouse_details",
        components: {
            codeSet,
            division,
            OrganizationSelect
        },
        props: {
            itemParam: {
                type: Object,
            },

        },
        data() {
            return {
                filtersData:{
                    // 仓库编号
                    code: '',
                    // 隶属机构
                    orgId: '',
                    // 固定电话
                    telnum: '',
                    // 仓库名称
                    name: '',
                    // 负责人
                    leader: '',
                    // 手机号
                    phone: '',
                    // 仓库地址
                    divisionId: '',
                    // 详细地址
                    address: '',
                    // 仓库描述
                    description: '',
                    // 存储类型
                    type: '',
                    // 启停状态
                    used: true
                },
                classDialogVisible:false,
                editDisabled: false,
                showDisabled: false,
                //验证
                rules: {
                    code: [
                        {required: true, message: "请输入仓库编号", trigger: "blur"}
                    ],
                    name: [
                        {required: true, message: "请输入仓库名称", trigger: "blur"},
                    ],
                    orgId: [
                        {required: true, message: "请选择机构", trigger: "blur"}
                    ],
                    leader: [
                        {required: true, message: "请输入负责人", trigger: "blur"}
                    ],
                    mobilenum: [
                        { required: true, trigger: "blur", validator: validPhone}
                    ],
                    type: [
                        {required: true, message: "请选择仓库类型", trigger: "blur"}
                    ],
                    divisionId: [
                        {required: true, message: "请选择仓库地址", trigger: "blur"}
                    ],
                    address: [
                        {required: true, message: "请输入详细地址", trigger: "blur"}
                    ]
                },
            };
        },
        methods: {
            //初始化
            wareHouseDetailsPopupInit() {
                this.filtersData = {
                    // 仓库编号
                    code: '',
                    // 隶属机构
                    orgId: '',
                    // 固定电话
                    telnum: '',
                    // 仓库名称
                    name: '',
                    // 负责人
                    leader: '',
                    // 手机号
                    phone: '',
                    // 仓库地址
                    divisionId: '',
                    // 详细地址
                    address: '',
                    // 仓库描述
                    description: '',
                    // 存储类型
                    type: '',
                    // 启停状态
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
                        this.getData(this.itemParam.id);
                        break;
                    case "show": //查看
                        this.editDisabled = true;
                        this.showDisabled = true;
                        break;
                }
                this.classDialogVisible = true;
                this.$nextTick(()=>{
                    this.$refs.division.init();
                })
            },
            //获取仓库数据
            getData(_id) {
                this.request(this.api.system.warehouse_get, {id: _id}).then(data => {
                    this.filtersData = data;
                });
            },
            //保存
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.request(this.api.system.warehouse_save, this.filtersData).then(data => {
                            this.$message({
                                type: "success",
                                message: "操作成功"
                            });
                            this.classDialogVisible = false;
                            this.$emit("refreshItem", "刷新上级数据");
                        });
                    }
                });
            },
            // 获取省市信息
            setDivision(division){
                this.filtersData.divisionId =  division.divisionId;
            },
        },
    }
</script>
<style lang="less" scoped>

</style>
