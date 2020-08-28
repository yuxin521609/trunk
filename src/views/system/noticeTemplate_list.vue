<template>
    <div>
        <div class="item-margin">
            <el-form class="item-form" :model="filtersData" label-width="90px" size="small" ref="filtersForm" inline>
                <el-form-item prop="filter" label="综合搜索：">
                    <el-input class="input-w" placeholder="请输入内容" v-model="filtersData.filter"></el-input>
                </el-form-item>
                <el-form-item label="选择日期：" prop="startDate">
                    <el-date-picker v-model="filtersData.startDate" type="date"
                                    placeholder="开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="endDate">
                    <el-date-picker v-model="filtersData.endDate" type="date"
                                    placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" @click="handleSearch" type="primary" plain>搜索</el-button>
                    <el-button size="small" @click="handleResetFilters('filtersForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--table  -->
        <div class="item-margin">
            <div class="item-cont">
                <el-button-group>
                    <el-button size="small" type="primary" @click="openAddClass">新增</el-button>
                </el-button-group>
            </div>
            <div class="item-table">
                <el-table
                        :data="tableListData"
                        stripe
                        empty-text="暂无数据"
                        header-align="center"
                        header-row-class-name="item-table-header"
                        :highlight-current-row="true"
                >
                    <el-table-column prop="type" align="center" label="消息编码" width="100"></el-table-column>
                    <el-table-column prop="name" align="center" label="消息名称" min-width="100"></el-table-column>
                    <el-table-column prop="content" align="center" label="模板内容" min-width="100"></el-table-column>
                    <el-table-column prop="updateTime" align="center" label="更新时间" min-width="100"></el-table-column>
                    <el-table-column prop="used" align="center" label="启停状态" width="80">
                        <template slot-scope="scope">
                            <el-switch
                                    v-model="scope.row.used"
                                    active-color="#13ce66"
                                    @change="switchValid(scope.row)"
                                    inactive-color="#9d9d9d">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label-class-name="text-center"
                            class-name="text-center"
                            align="center"
                            label="操作"
                            width="140"
                    >
                        <template slot-scope="scope">
                            <el-button @click="handleEditClick(scope.row.id)" type="text" size="small">编辑</el-button>
                            <el-button @click="handleDeleteClick(scope.row.id)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination mt-10 mb-20">
                    <el-pagination
                            class="mr-20"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="filtersData.pageIndex"
                            :page-sizes="[10,20,30,40,50]"
                            :page-size="filtersData.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                    ></el-pagination>
                </div>
            </div>
        </div>

        <!--table END  -->
        <tp-class-details :itemParam="itemStautsParam" @refreshItem="refreshList"
                          ref="noticeTemplateDetailsCpt"></tp-class-details>
    </div>
</template>
<script>
    import { formatTimestamp } from '@/utils/date'
    /**
     * 模板管理
     */
    import noticeTemplateDetailsAy from "@/views/system/noticeTemplate_details.vue";

    export default {
        data() {
            return {
                filtersData: {
                    pageIndex: 1,//当前页码
                    pageSize: 10,//每页数量
                    used: null,//有效状态
                    filter: '', //搜索关键字
                    startDate: "",
                    endDate: ""
                },
                tableListData: [],
                cateOptions: [{
                    label: '江苏',
                    cities: []
                }],
                itemStautsParam: {
                    type: 'add',
                    title: '新增模板',
                    id: ''
                },
                props: {
                    value: 'id',
                    label: 'name',
                    children: 'cities'
                },
                //搜索项模板
                cateParentData: {
                    level: 0,
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                total: null, //总条目数
            }
        },
        created() {
            this.getTableList();

        },
        mounted() {
        },
        methods: {
            //获取列表
            getTableList() {
                this.request(this.api.system.messageTemplate_list,this.filtersData).then(data=>{
                    let _data = data.data, _dataLen = _data.length;
                    for (let i = 0; i < _dataLen; i++) {
                        _data[i].isShow = true;
                        _data[i].isType = 1;
                        _data[i].updateTime = formatTimestamp(_data[i].updateTime,"yyyy-MM-dd hh:mm:ss");
                    }
                    this.tableListData = _data;
                    this.total = data.totalCount;
                });
            },
            //滑块开关
            switchValid(params) {
                this.request(this.api.user.messageTemplate_save,params).then(data=>{
                    this.$message({
                        type: "success",
                        message: data.message
                    });
                })
            },
            //搜索
            handleSearch() {
                this.filtersData.pageIndex = 1;
                this.getTableList();
            },
            //清空重置
            handleResetFilters(formName) {
                this.$refs[formName].resetFields();
            },
            //新增模板
            openAddClass() {
                this.itemStautsParam.type = 'add',
                    this.itemStautsParam.title = "新增模板"
                this.$refs.noticeTemplateDetailsCpt.noticeTemplateDetailsPopupInit();
            },
            //查看  //查看 及修改 只带ID过去取消传参
            handleShowClick(_id) {
                this.itemStautsParam.type = 'show';
                this.itemStautsParam.title = "查看模板";
                this.itemStautsParam.id = _id;
                this.$refs.noticeTemplateDetailsCpt.noticeTemplateDetailsPopupInit();
            },
            //修改模板
            handleEditClick(_id) {
                this.itemStautsParam.type = 'edit';
                this.itemStautsParam.title = "修改模板";
                this.itemStautsParam.id = _id;
                this.$refs.noticeTemplateDetailsCpt.noticeTemplateDetailsPopupInit();
            },
            //删除模板
            handleDeleteClick(_id) {
                this.request(this.api.system.messageTemplate_delete,{id:_id,status:9}).then(data=>{
                    this.getTableList();
                })
            },
            //当前页数修改时发生改变
            handleCurrentChange(val) {
                this.filtersData.pageIndex = val;
                this.getTableList();
            },
            // 每页显示多少条时发生改变
            handleSizeChange(val) {
                this.filtersData.pageSize = val;
                this.getTableList();
            },
            //子组件传参刷新 父组件
            refreshList() {
                this.handleResetFilters('filtersForm');
                this.handleSearch();
            }
        },
        components: {
            [noticeTemplateDetailsAy.name]: noticeTemplateDetailsAy
        }
    }
</script>
<style lang="less" scoped>

</style>
