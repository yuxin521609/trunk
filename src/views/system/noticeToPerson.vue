<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我的消息" name="first">
            <div>
                <div class="item-margin">
                    <div class="item-table">
                        <el-table
                                :data="tableListData"
                                stripe
                                empty-text="暂无数据"
                                header-align="center"
                                header-row-class-name="item-table-header"
                                :highlight-current-row="true"
                        >
                            <el-table-column prop="type" align="center" label="我的消息" width="100"></el-table-column>
                            <el-table-column prop="name" align="center" label="发送时间" min-width="100"></el-table-column>
                            <el-table-column prop="content" align="center" label="消息类型" min-width="100"></el-table-column>
                            <el-table-column prop="updateTime" align="center" label="消息内容" min-width="100"></el-table-column>
                            <el-table-column
                                    fixed="right"
                                    label-class-name="text-center"
                                    class-name="text-center"
                                    align="center"
                                    label="操作"
                                    width="140"
                            >
                                <template slot-scope="scope">
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
            </div>
        </el-tab-pane>
        <el-tab-pane label="我的通知" name="second">
            <div>
                <div class="item-margin">
                    <div class="item-table">
                        <el-table
                                :data="tableListData2"
                                stripe
                                empty-text="暂无数据"
                                header-align="center"
                                header-row-class-name="item-table-header"
                                :highlight-current-row="true"
                        >
                            <el-table-column prop="type" align="center" label="我的通知" width="100"></el-table-column>
                            <el-table-column prop="name" align="center" label="发送时间" min-width="100"></el-table-column>
                            <el-table-column prop="content" align="center" label="通知类型" min-width="100"></el-table-column>
                            <el-table-column prop="updateTime" align="center" label="通知内容" min-width="100"></el-table-column>
                            <el-table-column
                                    fixed="right"
                                    label-class-name="text-center"
                                    class-name="text-center"
                                    align="center"
                                    label="操作"
                                    width="140"
                            >
                                <template slot-scope="scope">
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
            </div>
        </el-tab-pane>
    </el-tabs>
</template>
<script>

    export default {
        data() {
            return {
                activeName: 'first',
                filtersData: {
                    pageIndex: 1,//当前页码
                    pageSize: 10,//每页数量
                    used: null,//有效状态
                    filter: '', //搜索关键字
                    datefilter: [],
                    startDate: "",
                    endDate: ""
                },
                tableListData: [],
                tableListData2: [],
                total: null, //总条目数


            }
        },
        created() {
            // this.getTableList();
            // this.getTableList2();
        },
        mounted() {
        },
        methods: {
            //获取列表
            getTableList() {
                this.request(this.api.system.messageTo_list,this.filtersData).then(data=>{
                    let _data = data.data, _dataLen = _data.length;
                    // for (let i = 0; i < _dataLen; i++) {
                    //     _data[i].isShow = true;
                    //     _data[i].isType = 1;
                    //     _data[i].updateTime = formatTimestamp(_data[i].updateTime,"yyyy-MM-dd hh:mm:ss");
                    // }
                    this.tableListData = _data;
                    this.total = data.totalCount;
                });
            },
            getTableList2() {
                this.request(this.api.system.messageTo_list,this.filtersData).then(data=>{
                    let _data = data.data, _dataLen = _data.length;
                    // for (let i = 0; i < _dataLen; i++) {
                    //     _data[i].isShow = true;
                    //     _data[i].isType = 1;
                    //     _data[i].updateTime = formatTimestamp(_data[i].updateTime,"yyyy-MM-dd hh:mm:ss");
                    // }
                    this.tableListData = _data;
                    this.total = data.totalCount;
                });
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
                this.request(this.api.system.noticeTemplate_delete,{id:_id,status:9}).then(data=>{
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
    }
</script>
<style lang="less" scoped>

</style>
