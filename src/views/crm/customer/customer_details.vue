<template>
  <el-form
    label-width="110px"
    :rules="rules"
    :model="filtersData"
    size="small"
    ref="filtersForm"
    inline
  >
    <div class="tlogy-item">
      <h5 class="tlogy-title">基本信息</h5>
      <el-row>
        <el-col :span="12">
          <el-col :span="24">
            <el-form-item label="姓名：">
              <el-input v-model="filtersData.name" class="input-w-2" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="valid" label="性别：">
              <el-radio v-model="filtersData.gender" :disabled="showDisabled" label="0">男</el-radio>
              <el-radio v-model="filtersData.gender" :disabled="showDisabled" label="1">女</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="phone" label="电话：">
              <el-input
                v-model="filtersData.phone"
                :disabled="editDisabled"
                class="input-w-2"
                placeholder="电话"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="24">
            <el-form-item label="地址：">
              <el-input
                v-model="filtersData.address"
                :disabled="editDisabled"
                class="input-w-2"
                placeholder="地址"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="出生日期：">
              <el-date-picker
                class="input-w-2"
                v-model="filtersData.birthday"
                type="date"
                placeholder="选择出生日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <!-- 身体数据 -->
      <h5 class="tlogy-title">身体数据</h5>
      <el-form-item label="角色姓名：">
        <el-select
          class="input-w-2"
          placeholder="请选择"
          :disabled="showDisabled"
          v-model="mainUserData.id"
          @change="roleNameGet"
        >
          <el-option
            v-for="item in roleNameOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <p class="p-txt">上次更新时间 {{preMeasureTime}}</p>
      </el-form-item>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="净体测量" name="netBody">
          <el-form-item v-for="(item,index) in netBodyList" :key="index" :label="item.name+'：'">
            <el-input v-model="item.value" disabled class="input-w" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="成衣数据" name="readyMade"></el-tab-pane>
        <el-tab-pane label="体型特征" name="shape">
          <el-form-item v-for="(item,index) in bodyList" :key="index" :label="item.name+'：'">
            <el-input v-model="item.value" disabled class="input-w" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <div class="item-footer">
        <el-button
          v-if="_type == 'edit'"
          size="small"
          @click="submitForm('filtersForm')"
          type="primary"
        >修改</el-button>
        <el-button size="small" @click="routerback('filtersForm')">取消</el-button>
      </div>
    </div>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      filtersData: {
        name: "",
        birthday: "",
        gender: '',
      },
      mainUserData: {
        id: ""
      },
      activeName: "netBody",
      showDisabled: false,
      editDisabled: false,
      _type: "",
      _id: "",
      _uid: "",
      roleNameOptions: [],
      preMeasureTime: "",
      rules: {
        //规则验证
        phone: [
          { required: false, message: "请输入电话号码", trigger: "blur" },
          {
            pattern: /^1[345789]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ]
      },
      bodyDataList: [],
      netBodyList: [],
      bodyList: []
    };
  },
  created() {
    //获取上页面传参
    this.getQueryparams();
  },
  methods: {
    handleClick() {},
    //新增
    submitForm() {
    //  TODO
      console.log(this.filtersData);
      this.request(this.api.user.crm_userCustomer_update,this.filtersData)
      .then(res => {
        this.$message.success("修改成功");
            setTimeout(() => {
              this.routerback();
            }, 500)
      });
    },
    getQueryparams() {
      //console.log(this.$route.query.id);
      this._type = this.$route.query.type;
      this._id = this.$route.query.id;
      this._uid = this.$route.query._uid;
      let itemStatus = this._type;
      switch (itemStatus.toString()) {
        case "add": //新增
          this.editDisabled = false;
          this.showDisabled = false;
          break;
        case "edit": //修改
          this.editDisabled = true;
          this.showDisabled = false;
          this.getData();
          break;
        case "show": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.getData();
          break;
      }
      this.getRoleNameOptions();
      this.getBodyData();
    },
    getRoleNameOptions() {
      //获取下拉角色
      this.request(this.api.user.crm_userRecord_getUserRecordByUserId, {
        mainUserId: this._uid
      }).then(res => {
        this.roleNameOptions = res;
      });
    },
    getData() {
      //获取回显数据
      this.request(this.api.user.crm_userCustomer_get, { id: this._id }).then(
        res => {
          console.log(res);

          this.filtersData = res;
        }
      );
    },
    //下拉角色发生改变
    roleNameGet(_id) {
      let obj = this.roleNameOptions.find(item => item.id == _id);
      this.preMeasureTime = obj.preMeasureTime;
      if (obj.tag == "主档案") {
        this.HandleBodyData(true);
      } else {
        this.HandleBodyData(false, _id);
      }
    },
    //获取净体等数据
    getBodyData() {
      this.request(this.api.user.crm_userMeasurement_list, {
        mainUserId: this._uid
      }).then(res => {
        this.bodyDataList = res.data;
        this.HandleBodyData(true);
      });
    },
    //获取净体等数据后处理
    HandleBodyData(self, _id) {
      let _data = this.bodyDataList,
        _dataLen = _data.length;
      let bodyList = [],
        netBodyList = [];
      for (let i = 0; i < _dataLen; i++) {
        if (self) {
          if (_data[i].recordId == "" || _data[i].recordId == null) {
            if (_data[i].type == 1) {
              bodyList.push(_data[i]);
            } else if (_data[i].type == 0) {
              netBodyList.push(_data[i]);
            }
          }
        } else {
          if (_data[i].recordId == _id) {
            if (_data[i].type == 1) {
              bodyList.push(_data[i]);
            } else if (_data[i].type == 0) {
              netBodyList.push(_data[i]);
            }
          }
        }
      }
      this.netBodyList = netBodyList;
      this.bodyList = bodyList;
    },
    //后退
    routerback() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.tlogy-item {
  background-color: #ffffff;
  margin: 10px;
  padding: 10px;
}
.tlogy-footer {
  background-color: #ffffff;
  margin: 0 10px 10px;
  padding: 10px;
}
.tlogy-title {
  font-size: 22px;
  height: 50px;
  line-height: 50px;
  text-indent: 40px;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 20px;
  em {
    margin-left: 20px;
    font-size: 14px;
    color: #ff6677;
  }
}
.p-txt {
  color: #606266;
}
</style>
