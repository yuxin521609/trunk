<template>
     <el-dialog
      title="查看服务类型"
      :visible.sync="serviceTypeDialogVisible"
      class="alarmPopup"
      width="500px"
      append-to-body
    >
          <el-table
            :data="tableListData"
            :stripe="true"
            empty-text="暂无数据"
            header-align="center"
            header-row-class-name="item-table-header"
            highlight-current-row
          >
            <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
            <el-table-column prop="type" label="服务类型" align="center" min-width="100">
            </el-table-column>
            <el-table-column prop="device_name" align="center" label='服务区域' min-width="100"></el-table-column>
          </el-table>
    </el-dialog>
</template>
<script>
export default {
    name:'tp-service-type',
    props:'', //此处根据需求定义参数类型 是否毕传
    data(){
        return{
            serviceTypeDialogVisible:false,
            tableListData:[],
        }
    },
    methods:{
        servicePopupInit(){
            this.serviceTypeDialogVisible=true;
        }
    }
}
</script>
<style lang="less" scoped>

</style>
