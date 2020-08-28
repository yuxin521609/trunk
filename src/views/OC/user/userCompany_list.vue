<template>
  <div>
    <div class="item-margin">
      <el-form
        class="item-form"
        :model="filtersData"
        label-width="90px"
        size="small"
        ref="filtersForm"
        inline
      >
        <el-form-item prop="filter" label="模糊查询：">
          <el-input class="input-w" placeholder="工号/员工姓名/手机号" v-model="filtersData.filter"></el-input>
        </el-form-item>
        <el-form-item prop="departId" label="所属部门：">
          <tree-dept v-model="filtersData.departId" val-type="id"></tree-dept>
        </el-form-item>
        <el-form-item prop="positionId" label="职位：">
          <el-select placeholder="请选择" class="input-w" v-model="filtersData.positionId">
            <el-option
              v-for="item in positionOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
          <el-button @click="handleSearch" type="primary" plain>搜索</el-button>
          <el-button @click="handleResetFilters('filtersForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--table  -->
    <div class="item-margin">
      <div class="item-cont">
        <el-button-group>
          <el-button size="small" type="primary" @click="openAddAttrbute">新增</el-button>
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
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="jobNum" align="left" label="员工工号" width="100"></el-table-column>
          <el-table-column prop="loginName" align="left" label="员工账号" width="150"></el-table-column>
          <el-table-column prop="avatar" align="left" label="员工头像" width="100">
            <template slot-scope="scope">
              <img :src="scope.row.avatar || defaultHeader" width="50" height="50">
            </template>
          </el-table-column>
          <el-table-column prop="name" align="left" label="员工姓名" min-width="80"></el-table-column>
          <!-- <el-table-column prop="gender" align="left" label="性别" min-width="60">
            <template slot-scope="scope">{{"COM004"|codeToName(scope.row.gender)}}</template>
          </el-table-column> -->
          <el-table-column prop="departName" align="left" label="所属部门" min-width="100"></el-table-column>
          <el-table-column prop="positionName" align="left" label="职位" min-width="100"></el-table-column>
          <el-table-column prop="leader" align="left" label="是否部门负责人" width="130">
            <template slot-scope="scope">
              {{ scope.row.leader ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column
            label-class-name="text-left"
            class-name="text-left"
            align="left"
            label="授权部门/机构"
            min-width="120"
          >
            <template slot-scope="scope">
              <el-button
                @click="edituserdepart2(scope.row.userId)"
                v-if="scope.row.isShow"
                type="text"
                size="small"
              >查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label-class-name="text-left"
            class-name="text-left"
            align="left"
            label="关联角色"
            min-width="80"
          >
            <template slot-scope="scope">
              <el-button
                @click="rolelist(scope.row.userId)"
                v-if="scope.row.isShow"
                type="text"
                size="small"
              >查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="phoneNum" align="left" label="手机号" width="130"></el-table-column>
          <el-table-column prop="used" align="left" label="启停状态" width="100">
            <template slot-scope="scope">
              <el-switch
                v-if="scope.row.isShow"
                v-model="scope.row.used"
                active-color="#13ce66"
                @change="switchValid(scope.row)"
                inactive-color="#9d9d9d"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-left"
            class-name="text-left"
            align="left"
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                @click="openShowDetails(scope.row.id)"
                v-if="scope.row.isShow"
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                @click="openEditDetails(scope.row.id)"
                v-if="scope.row.isShow"
                type="text"
                size="small"
              >编辑</el-button>
              <!-- <el-button
                @click="resetPwdShow(scope.row.id)"
                v-if="scope.row.isShow"
                type="text"
                size="small"
              >重置密码</el-button> -->
              <el-button
                @click="edituserrole(scope.row.userId)"
                v-if="scope.row.isShow"
                type="text"
                size="small"
              >关联角色</el-button>
              <el-button
                @click="edituserdepart(scope.row.userId)"
                v-if="scope.row.isShow"
                type="text"
                size="small"
              >关联机构</el-button>
              <el-button
                  @click="editUserAuth(scope.row)"
                  v-if="scope.row.isShow"
                  type="text"
                  size="small"
              >用户授权</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-10 mb-20">
          <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersData.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="filtersData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!--table END  -->
    <userRoleEditor :itemParam="userRoleItemParam" ref="userRoleCpt"></userRoleEditor>
    <userRoleList :itemParam="userRoleItemParam" ref="userRoleListCpt"></userRoleList>
    <UserDepartEditor :itemParam="userDepartItemParam" ref="userDepartCpt"></UserDepartEditor>
    <user2depart :itemParam="userDepartItemParam" ref="user2DepartCpt"></user2depart>
    <reset_pwd :itemParam="userSetItemParam" ref="resetPwdCpt"></reset_pwd>
  </div>
</template>
<script>
import userRoleEditor from "@/views/OC/user/userRole_editor.vue";
import userRoleList from "@/views/OC/user/userRoleList.vue";
import UserDepartEditor from "@/views/OC/user/userDepart_editor.vue";
import treeDept from "@/components/treeDept";
import user2depart from "@/views/OC/user/user2depart.vue";
import reset_pwd from "@/views/OC/user/resetPwd.vue";
// 默认头像
import defaultHeader from '../../../assets/img/default_header.png';
/**
 * 基本管理
 */
export default {
  name: 'userCompany_list',
  components: {
    userRoleEditor,
    treeDept,
    UserDepartEditor,
    user2depart,
    reset_pwd,
    userRoleList
  },
  data() {
    return {
      defaultHeader: defaultHeader,
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        filter: "" //搜索关键字
      },
      tableListData: [],
      total: null,
      positionOptions: [],
      userRoleItemParam: {
        title: "关联角色",
        id: ""
      },
      userDepartItemParam: {
        title: "授权机构/部门",
        id: ""
      },
      userSetItemParam: {
        title: "重置密码",
        id: ""
      }
    };
  },
  created() {
    this.getTableList();
    this.getPositionList();
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key == 13) {
        self.handleSearch();
      }
    };
  },
  activated() {
    this.getTableList();
  },
  methods: {
    //获取列表
    getTableList() {
      this.request(this.api.user.userCompany_list, this.filtersData).then(
        data => {
          let _data = data.data,
            _dataLen = _data.length;
          for (let i = 0; i < _dataLen; i++) {
            _data[i].isShow = true;
            _data[i].isType = 1;
          }
          this.tableListData = _data;
          this.total = data.totalCount;
        }
      );
    },
    //获取职位
    getPositionList() {
      this.request(this.api.user.position_list, {used: true}).then(data => {
        this.positionOptions = data.data;
      });
    },
    // 按用户授权
    editUserAuth(row){
      this.$router.push({
        path: "/OC/user/userCompany_auth",
        query: {
          userId: row.userId,
          id: row.id
        }
      });
    },
    //新增基本信息  跳转页面
    openAddAttrbute() {
      this.$router.push({
        path: "/OC/user/userCompany_details",
        query: {
          type: "add"
        }
      });
    },
    //查看基本信息
    openShowDetails(id) {
      this.$router.push({
        path: "/OC/user/userCompany_details",
        query: {
          id: id,
          type: "show"
        }
      });
    },
    //修改基本信息
    openEditDetails(id) {
      this.$router.push({
        path: "/OC/user/userCompany_details",
        query: {
          id: id,
          type: "edit"
        }
      });
    },
    //修改密码
    resetPwdShow(id) {
      this.userSetItemParam.title = "重置密码";
      this.userSetItemParam.id = id;
      this.$refs.resetPwdCpt.setPwdPopupInit();
    },
    //用户关联角色
    edituserrole(userid) {
      this.userRoleItemParam.title = "关联角色";
      this.userRoleItemParam.id = userid;
      this.$refs.userRoleCpt.userRolePopupInit();
    },
    //用户关联机构
    edituserdepart(userid) {
      this.userDepartItemParam.title = "授权机构/部门";
      this.userDepartItemParam.id = userid;
      this.$refs.userDepartCpt.userDepartPopupInit();
    },
    //用户关联机构2
    edituserdepart2(userid) {
      this.userDepartItemParam.title = "授权机构/部门";
      this.userDepartItemParam.id = userid;
      this.$refs.user2DepartCpt.user2DepartPopupInit();
    },
    //用户关联角色
    rolelist(userid) {
      this.userRoleItemParam.title = "关联角色";
      this.userRoleItemParam.id = userid;
      this.$refs.userRoleListCpt.userRoleListPopupInit();
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
    //滑块开关
    switchValid(params) {
      let self = this;
      let urlCon = this.util.deepCopy(self.api.user.userCompany_updateSelective);
      urlCon.tip = false;
      self.request(urlCon, params).then(data => {
      });
    },
    //点击获取子元素插入数组
    childrenIsShow(e) {
      let _id = e.target.dataset.id; //当前数据ID
      let _type = e.target.dataset.type; //状态 1 关闭 0 打开
      if (_type == "1") {
        //当前为关闭状态 需请求接口获取子元素
        e.target.className = "el-icon-remove-outline i-cursor";
        this.editType(_id, 0);
        this.getChildData(e, _id);
      } else {
        //当前为打开状态 需删除子元素
        this.editType(_id, 1);
        e.target.className = "el-icon-circle-plus-outline i-cursor";
        this.removeChildData(e);
      }
    },
    //修改当前数据的type
    editType(_id, type) {
      let _index = this.tableListData.findIndex(item => item.id == _id);
      if (type == 1) {
        this.tableListData[_index].isType = 1;
      } else {
        this.tableListData[_index].isType = 0;
      }
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
