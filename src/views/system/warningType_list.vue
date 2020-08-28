<template>
    <div>
        <div class="item-margin">
            <el-form class="item-form" :model="filtersData" label-width="90px" size="small" ref="filtersForm" inline>
                <el-form-item prop="filter" label="模糊查询：">
                    <el-input class="input-w" placeholder="请输入内容" v-model="filtersData.filter"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="预警类型：">
                    <code-set v-model="filtersData.type" code="CEN017"/>
                </el-form-item>
                <el-form-item prop="used" label="启停状态：">
                    <el-select placeholder="请选择" class="input-w" v-model="filtersData.used">
                        <el-option
                                v-for="item in this.$common.usedOptions()"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                        ></el-option>
                    </el-select>
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
                    <el-table-column prop="name" align="left" label="预警名称" width="200"></el-table-column>
                    <el-table-column prop="type" align="left" label="预警类型" min-width="150">
                        <template slot-scope="scope">{{"CEN017"|codeToName(scope.row.type)}}</template>
                    </el-table-column>
                    <el-table-column prop="tag" align="left" label="预警标签" min-width="150"></el-table-column>
                    <el-table-column prop="color" align="left" label="预警颜色预览" min-width="100" >
                        <template slot-scope="scope">
                            <span class="warningcolor" :style="{'background': scope.row.color}">{{scope.row.tag}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" align="left" label="更新时间" min-width="100">
                        <template slot-scope="scope">{{scope.row.updateTime|timestampToTime}}</template>
                    </el-table-column>
                    <el-table-column prop="used" align="left" label="启停状态" width="120">
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
                            label-class-name="text-left"
                            class-name="text-left"
                            align="left"
                            label="操作"
                            width="180"
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
        <warningType_details :itemParam="itemStautsParam" @refreshItem="refreshList"
                          ref="warningTypeDetailsCpt"></warningType_details>
    </div>
</template>
<script>
    /**
     * 模板管理
     */
    import warningTypeDetailsAy from "@/views/system/warningType_details.vue";
    import codeSet from '@/components/codeSet'

    export default {
        name: 'warningType_list',
        components: {
            codeSet,
            [warningTypeDetailsAy.name]: warningTypeDetailsAy
        },
        data() {
            return {
                filtersData: {
                    pageIndex: 1,//当前页码
                    pageSize: 10,//每页数量
                    filter: null, //搜索关键字
                    startDate: null,
                    endDate: null
                },
                tableListData: [],
                cateOptions: [{
                    label: '江苏',
                    cities: []
                }],
                itemStautsParam: {
                    type: 'add',
                    title: '新增预警配置',
                    id: ''
                },
                props: {
                    value: 'id',
                    label: 'name',
                    children: 'cities'
                },
                total: null, //总条目数

            }
        },
        created() {
            this.getTableList();

        },
        mounted() {
        },
        activated() {
            this.getTableList();
        },
        methods: {
            //获取列表
            getTableList() {
                this.request(this.api.system.warningType_list,this.filtersData).then(data=>{
                    let _data = data.data, _dataLen = _data.length;
                    for (let i = 0; i < _dataLen; i++) {
                        _data[i].isShow = true;
                        _data[i].isType = 1;
                    }
                    this.tableListData = _data;
                    this.total = data.totalCount;
                });
            },
            //滑块开关
            switchValid(params) {
                this.request(this.api.system.warningType_save,params).then(data=>{
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
                    this.itemStautsParam.title = "新增预警配置"
                this.$refs.warningTypeDetailsCpt.warningTypeDetailsPopupInit();
            },
            //查看  //查看 及修改 只带ID过去取消传参
            handleShowClick(_id) {
                this.itemStautsParam.type = 'show';
                this.itemStautsParam.title = "查看预警配置";
                this.itemStautsParam.id = _id;
                this.$refs.warningTypeDetailsCpt.warningTypeDetailsPopupInit();
            },
            //修改模板
            handleEditClick(_id) {
                this.itemStautsParam.type = 'edit';
                this.itemStautsParam.title = "修改预警配置";
                this.itemStautsParam.id = _id;
                this.$refs.warningTypeDetailsCpt.warningTypeDetailsPopupInit();
            },
            //删除模板
            handleDeleteClick(_id) {
                if (!confirm("确定要删除当前行数据么？"))
                {
                    return;
                }
                this.request(this.api.system.warningType_delete,{id:_id,status:9}).then(data=>{
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
   .warningcolor{
       color: #fff;
       padding: 10px;
   }
   .el-table{
       padding: 0 15px;
   }
</style>
