<template>
    <!-- 渠道订单 -->
    <div class="base">
        <!-- table -->
        <div class="table">
            <div class="item-cont">
                <el-button-group>
                    <el-button size="small" type="primary" @click="openAddClass">新增</el-button>
                </el-button-group>
            </div>
            <!-- table订单 -->
            <template>
                <el-table
                        :data="tableData.data"
                        stripe
                        empty-text="暂无数据"
                        header-align="center"
                        header-row-class-name="item-table-header"
                        :highlight-current-row="true"
                >
                    <el-table-column prop="code" label="仓库编号" width="100"></el-table-column>
                    <el-table-column prop="name" label="仓库名称" min-width="100"></el-table-column>
                    <el-table-column prop="orgName" label="隶属机构" min-width="100"></el-table-column>
                    <el-table-column prop="type" label="仓库类型" min-width="100">
                        <template slot-scope="scope">{{"CEN018" | codeToName(scope.row.type)}}</template>
                    </el-table-column>
                    <el-table-column prop="leader" label="负责人" min-width="100"></el-table-column>
                    <el-table-column prop="telnum" label="固定电话" min-width="100"></el-table-column>
                    <el-table-column prop="mobilenum" label="手机号码" min-width="100"></el-table-column>
                    <el-table-column min-width="100" :show-overflow-tooltip="true" label="仓库地址">
                        <template slot-scope="scope">{{ scope.row.division }} {{ scope.row.address }}</template>
                    </el-table-column>
                    <el-table-column prop="description" label="备注" min-width="100"></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" min-width="90">
                        <template slot-scope="scope">{{scope.row.updateTime | timestampToTime}}</template>
                    </el-table-column>
                    <el-table-column prop="used" label="启停状态" width="80">
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
                            label="操作"
                            width="140"
                    >
                        <template slot-scope="scope">
                            <el-button @click="handleEditClick(scope.row.id)" type="text" size="small">编辑</el-button>
                            <el-button @click="handleDeleteClick(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="tableData.pageIndex"
                            :page-sizes="[10,20,30,40,50]"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tableData.totalCount">
                    </el-pagination>
                </div>
            </template>
        </div>
        <wareHouse_details :itemParam="itemStatusParam" @refreshItem="refreshList" ref="wareHouseDetailsCpt">

        </wareHouse_details>
    </div>
</template>

<script>
    import wareHouse_details from "@/views/system/wareHouse_details.vue";
    import treeDept from "@/components/treeDept";
    import codeSet from '@/components/codeSet'

    export default {
        name: 'wareHouse_list',
        components: {
            codeSet,
            treeDept,
            wareHouse_details
        },
        data() {
            return {
                filtersData: {
                    pageIndex: 1,//当前页码
                    pageSize: 10//每页数量
                },
                itemStatusParam: {
                    type: 'add',
                    title: '新增仓库',
                    id: ''
                },
                // 表格数据
                tableData: {},
                editDisabled: false,
                showDisabled: false,
                dialogFormVisible:false
            }
        },
        created(){
            this.getTableList()
        },
        mounted(){
            this.getTableList()
        },
        activated() {
            this.getTableList();
        },
        methods: {
            //获取仓库列表
            getTableList(){
                this.request(this.api.system.warehouse_list,this.filtersData).then(data=>{
                    let _data=data.data;
                    let _dataLen=_data.length;
                    for (let i=0;i<_dataLen;i++){
                        _data[i].isShow = true;
                        _data[i].isType = 1;
                    }
                    this.tableData =data;
                });
            },
            //新增模板
            openAddClass() {
                this.itemStatusParam.type = 'add';
                this.itemStatusParam.title = "新增仓库";
                this.$refs.wareHouseDetailsCpt.wareHouseDetailsPopupInit();
            },
            //查看  //查看 及修改 只带ID过去取消传参
            handleShowClick(_id) {
                this.itemStatusParam.type = 'show';
                this.itemStatusParam.title = "查看仓库";
                this.itemStatusParam.id = _id;
                this.$refs.wareHouseDetailsCpt.wareHouseDetailsPopupInit();
            },
            //修改模板
            handleEditClick(_id) {
                this.itemStatusParam.type = 'edit';
                this.itemStatusParam.title = "修改仓库";
                this.itemStatusParam.id = _id;
                this.$refs.wareHouseDetailsCpt.wareHouseDetailsPopupInit();
            },
            //滑块开关
            switchValid(params){
                this.request(this.api.system.warehouse_save,params).then(data=>{
                    this.$message({
                        type: "success",
                        message: "状态修改成功！"
                    });
                })
            },
            //删除仓库
            handleDeleteClick(params) {
                if(params.used)
                {
                    this.$message({
                        type: "error",
                        message: "不能删除未停用的仓库！"
                    });
                    return;
                }
                if (!confirm("确定要删除当前行数据么？"))
                {
                    return;
                }
                this.request(this.api.system.warehouse_delete, params).then(data => {
                    this.$message({
                        type: "success",
                        message: "删除仓库成功！"
                    });
                    this.getTableList();
                });
            },

            // 表格更改条数
            handleSizeChange(val){
                this.filtersData.pageSize=val;
                this.getTableList();
            },
            // 表格更改页数
            handleCurrentChange(val){
                this.filtersData.pageIndex=val;
                this.getTableList();
            },
            //子组件传参刷新 父组件
            refreshList() {
                this.filtersData.pageIndex = 1;
                this.getTableList();
            }

        }
    }
</script>

<style lang="less" scoped>
    h3{
        margin-top: 0;
        margin-bottom: 15px;
    }
    h5{
        color: black;
        margin-left: 8px;
    }
    .el-form{
        padding-top:15px;
    }
    .middle-from,.table{
        background-color: #fff;
        margin: 8px;
        // padding-left: 70px;
    }
    // .table{
    //     padding-top: 20px;
    // }
    .upload-demo{
        float: left;
        margin-right: 10px;
    }
    .circleProgress {
        text-align: center;
    }

</style>

