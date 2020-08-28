<template>
  <div class="bg-fff item-margin roleManage-details">
    <div class="titles">角色信息</div>
    <el-form
      class="item-form"
      :model="filtersData"
      label-width="100px"
      size="small"
      ref="filtersForm"
      inline
      style="background: #fff;"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item
            prop="name"
            label="角色名称："
            :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' },{ max: 10, message: '角色名称最多10个字符', trigger: 'change' }]"
          >
            <el-input
              class="input-w"
              placeholder="请输入内容"
              :disabled="isShow"
              v-model="filtersData.name"
            ></el-input>
          </el-form-item>
          <el-form-item
            :disabled="isShow"
            prop="type"
            label="角色类型："
            :rules="[{ required: true, message: '请选择角色类型', trigger: 'blur' },]"
          >
            <code-set v-model="filtersData.type" code="CEN003"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="titles">权限设置</div>
    <div class="rebort_table">
      <ul class="rebort_table_title rebort_table_title_top">
        <li>
          <el-checkbox v-model="topChecked" @change="perChange">功能权限</el-checkbox>
        </li>
        <li>操作权限</li>
        <li>字段权限</li>
        <li class="lasttopli">数据权限</li>
      </ul>
      <tree-per :data="tableData" @item-change="treeChange"></tree-per>
    </div>
    <div class="item-footer">
      <el-button v-if="isEdit||isAdd" @click="submitForm('filtersForm')" type="primary" size="small">确定</el-button>
      <el-button @click="routerback('filtersForm')" size="small">取消</el-button>
    </div>
  </div>
</template>

<script>
import codeSet from "@/components/codeSet";
import treePer from "@/components/treePermission";
export default {
  components: { codeSet, treePer },
  data() {
    return {
      filtersData: {
        name: "",
        type: "",
        code: ""
      },
      _id: null,
      topChecked: false,
      tableData: [],
      isAdd: false,
      isEdit: false,
      isShow: false,
      // 数据权限
      dataAuthList: [
        {name: '个人', authType: 0},
        {name: '部门', authType: 1},
        {name: '部门及以下', authType: 2},
        {name: '机构', authType: 3}
      ]
    };
  },
  created() {
    this.getQueryparams();
  },
  methods: {
    // 获取上页面参数及初始化页面数据
    getQueryparams() {
      let t_type = this.$route.query.type;
      this._id = this.$route.query.id;
      switch (t_type.toString()) {
        case "add": //新增
          this.isAdd = true;
          break;
        case "edit": //修改
          this.isEdit = true;
          break;
        case "show": //查看
          this.isShow = true;
          break;
      }
      this.getInfo();
      this.getData();
    },
    // 编辑获取详情
    async getInfo() {
      if (this.isEdit) {
        var da = await this.request(this.api.user.role_get, {
          id: this._id
        });
        this.filtersData = da;
      }
    },
    // 获取数据
    async getData() {
      var list = await this.request(this.api.system.Role_Auth_Tree, {
        roleId: this._id
      });
      this.topChecked = list.findIndex(f => f.checked) > -1;
      this.tableDataInit(list);
      this.tableData = list;
    },
    tableDataInit(data){
      if(data && data.length){
        data.forEach(item => {
          if(item.leaf){
            let dataAuthChecked = item.sublist.find(item => item.type === 'dataAuth');
            if(dataAuthChecked){
              item._dataAuthChecked = dataAuthChecked.authType;
            }else {
              item._dataAuthChecked = 0
            }
            item.sublist = item.sublist.filter(item => item.type === 'auth' );
            item._dataAuthList = this.dataAuthList.map(auth => {
              return {
                name: auth.name,
                authType: auth.authType,
                menuId: item.id
              }
            })
          }else{
            this.tableDataInit(item.sublist);
          }
        })
      }
    },
    // 后退
    routerback() {
      this.$router.go(-1);
    },
    // 返回权限设置是否全选
    treeChange(topChecked) {
      var hasChecked = this.tableData.findIndex(f => f.checked) > -1;
      if (hasChecked) {
        this.topChecked = hasChecked;
      } else {
        this.topChecked = topChecked;
      }
    },
    // 新增和编辑提交
    submitForm(formName) {
      if (this.isAdd || this.isEdit) {
        let url = this.isAdd
          ? this.api.user.role_create
          : this.api.user.role_update;
        this.$refs[formName].validate(valid => {
          if (valid) {
            let perDa = this.combinaParams();
            let postDa = {
              id: this._id,
              type: this.filtersData.type,
              name: this.filtersData.name,
              code: this.filtersData.code,
              menuList: perDa.menus,
              authList: perDa.ops,
              dataAuthList: perDa.dataAuthList,
              used: true
            };
            this.request(url, postDa).then(data => {
              this.routerback();
            });
          }
        });
      }
    },
    // 获取参数权限设置参数
    combinaParams() {
      var list = this.tableData;
      let allList = {
        menus: [],
        ops: [],
        dataAuthList: []
      };
      this.recurveData(allList, list);
      return allList;
    },
    recurveData(allList, list) {
      list.forEach(f => {
        if(f.leaf){
          let dataAuth = f._dataAuthList.find(item => {
            return item.authType === f._dataAuthChecked
          });
          allList.dataAuthList.push(dataAuth);
        }
        if (f.checked) {
          switch (f.type) {
            case "menu":
              allList.menus.push(f.id);
              break;
            case "auth":
              allList.ops.push(f.id);
              break;
          }
        }
        if (f.sublist && f.sublist.length > 0) {
          this.recurveData(allList, f.sublist);
        }
      });
    },
    // 功能权限全选
    perChange(val) {
      this.tableData.forEach(f => {
        f.checked = val;
        if (f.sublist && f.sublist.length > 0) {
          this.cbChange(f.sublist, val);
        }
      });
    },
    cbChange(list, checked) {
      list.forEach(f => {
        f.checked = checked;
        if (f.sublist && f.sublist.length > 0) {
          this.cbChange(f.sublist, checked);
        }
      });
    }
  }
};
</script>

<style scoped>
  .roleManage-details /deep/ .el-radio {margin-right: 10px;}

  .title {
  background-color: #fff;
  padding: 15px 0 15px 30px;
  margin-bottom: 10px;
}
.titles {
  width: 100%;
  height: 80px;
  background: #fff;
  display: flex;
  align-items: center;
  padding-left: 18px;
  box-sizing: border-box;
  font-weight: bold;
}

.rebort_table {
  padding: 0 18px;
  box-sizing: border-box;
  background: #fff;
}
.rebort_table_title {
  display: flex;
  border: 1px solid #ccc;
  border-right: none;
  border-top: none;
}
.rebort_table_title {
  border-top: 1px solid #ccc;
}
.rebort_table_title li {
  width: calc(25%-13px);
}
.rebort_table_title:last-child,
.rebort_table_list:last-child {
  border-bottom: 1px solid #ccc;
}
.rebort_table_title li,
.rebort_table_list li {
  width: 25.6%;
  height: 47px;
  display: flex;
  align-items: center;
  border-right: 1px solid #ccc;
  padding-left: 18px;
  /* box-sizing: border-box; */
}
.rebort_table_title li:last-child {
  /* background-color: rebeccapurple; */
  width: 25.6%;
}
.el-checkbox {
  margin-right: 10px;
}
.item-footer {
  background: #fff;
  padding: 18px;
}
.rebort_table_title_top {
  overflow-y: scroll;
}

.rebort_table_title_top::-webkit-scrollbar-thumb {
  background: #fff;
}
.rebort_table_title_top::-webkit-scrollbar-track {
  background: #fff;
  border-right: 1px solid #ccc !important;
}
.lasttopli {
  border-right: none !important;
}
</style>
