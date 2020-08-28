<template>
  <el-dialog
    :title="itemParam.title"
    :visible.sync="classDialogVisible"
    class="alarmPopup"
    width="900px"
  >
    <div>
      <h5 class="main-top" style="font-size:25px;">关联机构</h5>
      <div class="flex-space-around">
        <div class="flex-fixed-ztree ml-10 mr-10">
          <el-tree
            :data="ztreeData"
            :props="defaultProps"
            :default-expand-all="true"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
        <div class="flex-w item-table mr-10">
          <div class="item-margin">
            <div class="item-table">
              <el-table
                :data="tableListData"
                stripe
                @row-dblclick="dbclick"
                empty-text="暂无数据"
                header-align="center"
                header-row-class-name="item-table-header"
                :highlight-current-row="true"
              >
                <el-table-column prop="code" align="center" label="部门编码" width="100"></el-table-column>
                <el-table-column prop="name" align="center" label="授权机构/部门" min-width="100"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="item-right">
        <el-button size="small" @click="save" type="primary">确定</el-button>
        <el-button size="small" @click="closeDialog">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { formatTimestamp } from "@/utils/date";

export default {
  name: "user-depart-editor",
  props: {
    itemParam: {
      type: Object
    }
  },
  data() {
    return {
      userId: String,
      classDialogVisible: false,
      itemStautsParam: {
        type: "add",
        title: "新增职位",
        id: ""
      },
      total: null, //总条目数
      tableListData: [
        {
          code: String
        }
      ],
      serviceParam: null, //向子组件传参 需设置类型
      ztreeData: [],
      defaultProps: {
        //定义ZTREE
        children: "children",
        label: "label"
      }
    };
  },
  created() {},

  methods: {
    save() {
      const requestData = new Object();
      requestData.userId = this.userId;
      requestData.departIds = [];
      let _dataLen = this.tableListData.length;
      for (let i = 0; i < _dataLen; i++) {
        requestData.departIds.push(this.tableListData[i].id);
      }
      this.request(this.api.user.userDepart_saveDatas, requestData)
        .then(data => {
          this.closeDialog();
        })
        .catch(msg => {
          console.error(msg);
        });
    },
    //关闭
    closeDialog() {
      this.classDialogVisible = false;
    },
    dbclick(row) {
      this.tableListData.splice(
        [this.tableListData.findIndex(t => t.code == row.code)],
        1
      );
    },
    userDepartPopupInit() {
      this.classDialogVisible = true;
      this.userId = this.itemParam.id;
      this.getDepartTree();
      this.getTableList();
    },
    getDepartTree() {
      this.request(this.api.user.DEPART_LIST_POST, {}).then(data => {
        let _data = data,
          _dataLen = _data.length;
        for (let i = 0; i < _dataLen; i++) {
          _data[i].label = _data[i].name;
          _data[i].children = this.setSubList(_data[i].sublist);
        }
        // let root = [
        //   {
        //     label: "组织机构",
        //     parentd: null,
        //     children: _data
        //   }
        // ];
        // this.ztreeData = root;
        this.ztreeData = _data;
      });
    },
    setSubList(_data) {
      if (_data == null || _data.length == 0) return _data;
      for (let i = 0; i < _data.length; i++) {
        _data[i].label = _data[i].name;
        _data[i].children = this.setSubList(_data[i].sublist);
      }
      return _data;
    },
    //获取列表
    getTableList() {
      const filtersData = new Object();
      filtersData.userId = this.userId;
      this.request(this.api.user.depart_getUserDepList, filtersData).then(
        data => {
          let _data = data;
          let _dataLen = _data.length;
          for (let i = 0; i < _dataLen; i++) {
            _data[i].isShow = true;
            _data[i].isType = 1;
            _data[i].createTime = formatTimestamp(
              _data[i].createTime,
              "yyyy-MM-dd hh:mm:ss"
            );
          }
          this.tableListData = _data;
          this.total = data.totalCount;
        }
      );
    },
    handleNodeClick(a) {
      let row = { id: a.id, code: a.code, name: a.name };
      if (this.tableListData == null) {
        this.tableListData = [];
      }
      if (this.tableListData.findIndex(t => t.code == row.code) < 0) {
        this.tableListData.push(row);
      }
    },
    //子组件传参刷新 父组件
    refreshList() {
      this.handleResetFilters("filtersForm");
      this.handleSearch();
    }
  }
};
</script>
<style lang="less" scoped>
h5 {
  color: #222;
  margin-left: -15px;
}
</style>
