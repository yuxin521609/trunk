<!--
 * @Author: elephant
 * @Date: 2020-02-12 10:01:50
 * @LastEditTime: 2020-02-25 12:43:15
 * @LastEditors: Please set LastEditors
 * @Description: 登录时 弹出框  选择组织
 * @custom_string_obkoro: 看看写点什么
 -->
<template>
  <div>
    <el-dialog
      title="账号存在多组织，请选择："
      :visible.sync="dialogVisible"
      class="alarmPopup"
      width="400px"
      :show-close="false"
      :before-close="closeDialog"
    >
        <ul class="wrap">
          <li  v-for="(item,index) in tenantList"
              :key="index"
              @click="itemClick(item,index)"
              :class="{'active':item.isSelected}">{{item.name}}</li>
        </ul>
    </el-dialog>
  </div>
</template>
<script>

export default {
  data() {
    return {
      dialogVisible: false,
       tenantId:'',
       tenantList:[],
       type:'',
    };
  },
  created() {
  },
  methods: {
     propInit(arr,type) {
      for (let k = 0; k < arr.length; k++) {
        arr[k].isSelected = false;
      }
      this.tenantList = arr;
      this.type=type;
      this.dialogVisible = true;
    },
    itemClick(item){
       item.isSelected = !item.isSelected;
       this.tenantId = item.id ? item.id : "";
       if(!!item.isSelected){
         this.$emit('change',this.tenantId,this.type);
         this.dialogVisible=false;
       }
       this.noClick(item);
    },
    // 置灰其他未选
    noClick(item) {
      for (let i = 0; i < this.tenantList.length; i++) {
        if (item.id != this.tenantList[i].id) {
          this.tenantList[i].isSelected = false;
        }
      }
    },
    closeDialog(done) {
      if(!this.tenantId){
        this.$message.error('请选择归属货主！');
        return false;
      }
      done();
    }
  }
};
</script>
<style lang="less" scoped>
.wrap{
  >li{
    width: 100%;
    height: 60px;
    text-align: center;
    line-height: 60px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid transparent;

  }
  >li.active{
    background-color: #f7fcff;
    color:#3b91ff;
    border: 1px solid #eff5f5;
    border-radius: 3px;
  }
}
</style>
