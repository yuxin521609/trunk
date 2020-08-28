<template>
  <el-dialog
    :title="itemParam.title"
    :visible.sync="classDialogVisible"
    class="alarmPopup"
    width="500px"
  >
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="code" label="序号" width="70"></el-table-column>
      <el-table-column prop="serviceType" label="服务类型" width="120"></el-table-column>
      <el-table-column prop="serviceArea" label="服务区域"></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  name: "tp-organization-serviceType",
  props: {
    itemParam: {
      type: Object
    }
  },
  data() {
    return {
      tableData: [
        {
          code: "1",
          serviceType: "男装定制",
          serviceArea: "北京市北京市朝阳区"
        },
        {
          code: "2",
          serviceType: "女装搭配",
          serviceArea: "北京市北京市海淀区"
        }
      ],
      classDialogVisible: false,
      filtersData: {
        code: "", // 新增新增职位编码
        name: "", //职位名称
        parentId: null, //父级职位  已有职位选择 如果为1及职位则为NULL
        valid: true // 使用状态
      },
      editDisabled: true, //可编辑状态  除使用状态其他都不可编辑
      showDisabled: true //查看时 使用状态不可编辑
    };
  },
  methods: {
    getValidOptions() {
      let arr = [
        {
          status_id: true,
          status_name: "使用中"
        },
        {
          status_id: false,
          status_name: "未使用"
        }
      ];
      return arr;
    },
    //关闭
    closeDialog(formName) {
      this.$refs[formName].resetFields(); //重置选项
      this.classDialogVisible = false;
    },
    //查看服务类型
    getClassData() {
      console.log(this.itemParam.id);
      this.getAxios("USER", "/position/get", { id: this.itemParam.id }).then(
        data => {
          if (data) {
            this.filtersData = data;
          }
        }
      );
      this.classDialogVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
