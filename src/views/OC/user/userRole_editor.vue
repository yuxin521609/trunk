<template>
  <el-dialog
    :title="itemParam.title"
    :visible.sync="classDialogVisible"
    class="alarmPopup"
    width="700px"
  >
    <div style="text-align: center">
      <el-transfer
        style="text-align: left; display: inline-block"
        v-model="value"
        filterable
        :render-content="renderFunc"
        :titles="['角色列表', '已选']"
        :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
        @change="handleChange"
        :data="data"
      ></el-transfer>
    </div>
    <div class="item-right">
      <el-button size="small" @click="closeDialog()">取消</el-button>
      <el-button size="small" @click="save()" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
</style>

<script>
export default {
  name: "user-role-editor",
  props: {
    itemParam: {
      type: Object
    }
  },
  data() {
    return {
      classDialogVisible: false,
      data: [],
      value: [],
      renderFunc(h, option) {
        return <span>{option.label}</span>;
      }
    };
  },
  methods: {
    handleChange(value, direction, movedKeys) {
      //console.log(value, direction, movedKeys);
    },
    save() {
      const requestData = new Object();
      requestData.userId = this.itemParam.id;
      requestData.roleIds = this.value;
      this.request(this.api.user.userRole_saveDatas, requestData)
        .then(data => {
          console.log("操作成功");
          this.closeDialog();
        })
        .catch(msg => {
          console.error(msg);
        });
    },
    userRolePopupInit() {
      this.classDialogVisible = true;
      this.getData();
    },
    //获取列表数据
    getData() {
      var self = this;
      const roleData = [];
      const valueData = [];
      self.request(this.api.user.role_list, { used: true }).then(data => {
        let _data = data.data;
        for (let i = 0; i < _data.length; i++) {
          roleData.push({
            key: _data[i].id,
            label: _data[i].name,
            disabled: false
          });
        }

        //存在角色数据
        if (_data.length > 0) {
          const filtersData = new Object();
          filtersData.userId = this.itemParam.id;
          self.request(this.api.user.userRole_list, filtersData).then(data => {
            let _data = data.data;
            for (let i = 0; i < _data.length; i++) {
              let roleId = _data[i].roleId;
              roleData.forEach(item => {
                if (item.key == roleId) {
                  valueData.push(roleId);
                }
              });
            }
          });
        }
      });
      self.data = roleData;
      self.value = valueData;
    },
    //关闭
    closeDialog() {
      this.classDialogVisible = false;
    }
  }
};
</script>