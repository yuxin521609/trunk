<!-- 创建新工单 -->
<template>
  <div>
    <!-- 新建工单 -->
    <div class="item-margin" style="height:100%;">
      <div class="item-form">
        <el-form ref="form" :model="jobOrderTimeSaveObj">
          <div class="display-flex leftName">
            <span class="leftName-span"><i class="colorRed">*&nbsp;</i>时限管理名称：</span>
            <el-form-item>
              <el-input maxlength="30"  v-model="jobOrderTimeSaveObj.name" class="width350"></el-input>
            </el-form-item>
          </div>
          <div class="display-flex leftName">
            <span class="leftName-span"><i class="colorRed">*&nbsp;</i>设置处理时长：</span>
            <el-form-item>
              <el-input type="number" v-model="jobOrderTimeSaveObj.handleTime.day" class="width50"></el-input>&nbsp;天&nbsp;
              <el-input type="number" v-model="jobOrderTimeSaveObj.handleTime.hour" class="width50"></el-input>&nbsp;时&nbsp;
              <el-input type="number" v-model="jobOrderTimeSaveObj.handleTime.minute" class="width50"></el-input>&nbsp;分&nbsp;
              <el-input type="number" v-model="jobOrderTimeSaveObj.handleTime.s" class="width50"></el-input>&nbsp;秒&nbsp;
            </el-form-item>
          </div>
          <div class="display-flex leftName">
            <span class="leftName-span"><i class="colorRed">&nbsp;</i>设置流入工单池时间：</span>
            <el-form-item>
              <el-input type="number" v-model="jobOrderTimeSaveObj.jobPoolTime.day" class="width50"></el-input>&nbsp;天&nbsp;
              <el-input type="number" v-model="jobOrderTimeSaveObj.jobPoolTime.hour" class="width50"></el-input>&nbsp;时&nbsp;
              <el-input type="number" v-model="jobOrderTimeSaveObj.jobPoolTime.minute" class="width50"></el-input>&nbsp;分&nbsp;
              <el-input type="number" v-model="jobOrderTimeSaveObj.jobPoolTime.s" class="width50"></el-input>&nbsp;秒&nbsp;
            </el-form-item>
          </div>
          <div class="display-flex leftName">
            <span class="leftName-span">适用工单：</span>
            <el-form-item >
                <div class="width600">
                  <el-tag
                    class="mr-10"
                    v-for="(item, index) in jobOrderTimeSaveObj.applyWorkOrders"
                    :key="item.workOrderName"
                    closable
                    :type="item.type"
                    @close="deleteTag(index)"
                  >{{item.workOrderName}}
                  </el-tag>
                </div>
                <el-dropdown
                  size="medium"
                  :split-button="true"
                  type="primary"
                  @command="addApplyWorkOrder">
                  添加
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="item" :key="index" v-for="(item, index) in findAll_List">{{ item.name }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
          </div>
          <div class="display-flex leftName">
            <span class="leftName-span"><i class="colorRed">*&nbsp;</i>预警设置：</span>
            <el-form-item>
              <div class="set-warning mt-10" :class="{isEndTime:alaItem.endTime.isEndTime}" :key="alaIndex" v-for="(alaItem, alaIndex) in jobOrderTimeSaveObj.alarmSets">
                <i class="el-icon-close" @click="closeAlarmSets(alaIndex)"></i>
                <el-form ref="form" :model="alaItem">
                  <div class="display-flex leftName2 mt-20">
                    <span class="leftName-span2"><i class="colorRed">*&nbsp;</i>预警时间段：</span>
                    <el-form-item>
                      <el-input type="number" v-model="alaItem.endTime.day" class="width50"></el-input>&nbsp;天&nbsp;
                      <el-input type="number" v-model="alaItem.endTime.hour" class="width50"></el-input>&nbsp;时&nbsp;
                      <el-input type="number" v-model="alaItem.endTime.minute" class="width50"></el-input>&nbsp;分&nbsp;
                      <el-input type="number" v-model="alaItem.endTime.s" class="width50"></el-input>&nbsp;秒&nbsp;
                    </el-form-item>
                  </div>
                  <div class="display-flex leftName2 mt-20">
                    <span class="leftName-span2"><i class="colorRed">*&nbsp;</i>预警类型：</span>
                    <el-form-item>
                      <el-select v-model="alaItem.warnType" placeholder="请选择">
                        <el-option
                          :value="wItem.id"
                          :label="wItem.tag"
                          :key="wItem.id"
                          :style="{background:wItem.color}"
                          class="warningTypeColor"
                          v-for="wItem in warningTypeList.data">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <el-form-item label="预警提醒：" label-width="110px">
                    <div class="display-flex">
                      <template>
                        <!-- `checked` 为 true 或 false -->
                        <el-checkbox v-model="alaItem.localRemindDisabled" hca>站内提醒</el-checkbox>
                      </template>
                      <el-select
                        v-model="alaItem.localRemind"
                        :disabled="!alaItem.localRemindDisabled"
                        placeholder="请选择消息模板">
                        <el-option
                          :value="mItem.id"
                          :label="mItem.name"
                          :key="mItem.id"
                          v-for="mItem in messageTemplate_List.data">
                        </el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                  <el-form-item label="接收人：" label-width="110px" class=" mt-10">
                    <div class="display-flex">
                      <template>
                        <el-checkbox v-model="alaItem.signerReceive">工单签发人</el-checkbox>
                        <el-checkbox v-model="alaItem.adminReceiveDisabled">管理者</el-checkbox>
                      </template>
                      所属机构：&nbsp;
                      <tree-dept
                        v-model="alaItem.adminReceive"
                        :disabled="!alaItem.adminReceiveDisabled"
                        val-type="id"
                        :sel-type="1"
                        :default-expand-all="true"
                      ></tree-dept>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              <el-button class="mt-10" @click="addAlarmSets">添加</el-button>
            </el-form-item>
          </div>
          <div class="display-flex leftName">
            <span class="leftName-span">启停状态:</span>
            <el-form-item>
              <el-switch
                active-color="#13ce66"
                inactive-color="#9d9d9d"
                v-model="jobOrderTimeSaveObj.isStart">
              </el-switch>
            </el-form-item>
          </div>
          <el-form-item label-width="200px">
            <el-button type="primary" v-no-more-click @click="saveJobTime" size="small">确定</el-button>
            <el-button @click="href('workorder/config/workOrder_time_list')" size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 新建工单 -->
  </div>
</template>
<!-- 工单池 -->

<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
import codeSet from "@/components/codeSet";
import treeDept from "@/components/treeDept";
import { filter } from "minimatch";
import { get } from "http";
let token = getToken();

export default {
  data() {
    return {
      // 预警类型列表
      warningTypeList:[],
      // 消息模板列表
      messageTemplate_List:[],
      // 适用工单列表
      findAll_List:[],
      applyWorkOrders_backups:[],
      // 预警设置列表备份，添加时候直接深拷贝使用
      "alarmSetsBck":{},
      jobOrderTimeSaveObjName:'',
      // 新增工单时限对象集合
      jobOrderTimeSaveObj:{
        "alarmSets": [// 预警设置列表
          {
            // 预警结束时间
            endTime: {
              day:'00',
              hour:'00',
              minute:'00',
              s:'00'
            },
            "adminReceive": "",// 管理者接收
            "localRemind": "",// 站内提醒
            "signerReceive": false,// 工单签发人接收
            "warnType": "",// 预警类型
            localRemindDisabled:false,// 站内提醒状态
            adminReceiveDisabled:false// 管理者状态
          }
        ],
        // 处理时间时长
        handleTime: {
          day:'00',
          hour:'00',
          minute:'00',
          s:'00'
        },
        // 流入工单池时间
        jobPoolTime: {
          day:'00',
          hour:'00',
          minute:'00',
          s:'00'
        },
        "applyWorkOrders": [],// 适用工单
        "isStart": 1,// 启停状态
        "name": "",// 时限管理名称
      }
    };
  },
  created() {
    // 拷贝预警设置
    this.alarmSetsBck = JSON.parse(JSON.stringify(this.jobOrderTimeSaveObj.alarmSets[0]));
    this.getJobOrderTimeGet(this.$route.query.id);
    this.getWarningTypeList();
    this.getMessageTemplate_List();
    this.getFindAll_List();
    // this.tableItemListByOrderExtendId();
  },
  methods: {
    /**
     * 获取工单时间配置内容
     */
    getJobOrderTimeGet(id) {
      const that = this;

      this.request(
        that.api.job_order.jobOrderTimeGet,
        {
          id
        }
      ).then(res => {
        // 启停状态数据处理
        res.isStart = res.isStart ? true : false;
        // 站内提醒，接收人数据处理
        res.alarmSets.forEach((item, index) => {
          item.localRemindDisabled = item.localRemind ? true : false;
          item.adminReceiveDisabled = item.adminReceive ? true : false;
          item.signerReceive = item.signerReceive == 'true' ? true : false;
          item.endTime = that.strObj(item.endTime);

        });
        res.handleTime = that.strObj(res.handleTime);
        res.jobPoolTime = that.strObj(res.jobPoolTime);
        that.jobOrderTimeSaveObj = res;
        // 备份适用工单，添加时做校验
        that.applyWorkOrders_backups = JSON.parse(JSON.stringify(that.jobOrderTimeSaveObj.applyWorkOrders));
        that.jobOrderTimeSaveObjName = JSON.parse(JSON.stringify(that.jobOrderTimeSaveObj.name));
      });
    },
    /**
     * 字符串转对象
     */
    strObj(str) {
      const arr = str.split('-');
      return {
        day:this.replenishZero(arr[0]),
        hour:this.replenishZero(arr[1]),
        minute:this.replenishZero(arr[2]),
        s:this.replenishZero(arr[3])
      }
    },
    /**
     * 补零函数
     * @param { Nunber | String } item 数字或数字字符串 如： 1，'1'
     * @return { String } 如：'01'
     */
    replenishZero(item) {
        item = parseInt(item);

        return item < 10 ? `0${item}` : item;
    },
    /**
     * 获取预警类型
     */
    getWarningTypeList() {
      const that = this;

      this.request(
        that.api.job_order.getWarningType_List,
      ).then(res => {
        that.warningTypeList = res;
      });
    },
    /**
     * 获取消息模板
     */
    getMessageTemplate_List() {
      const that = this;

      this.request(
        that.api.job_order.getMessageTemplate_List,
      ).then(res => {
        that.messageTemplate_List = res;
      });
    },
    /**
     * 获取适用工单
     */
    getFindAll_List() {
      const that = this;

      this.request(
        that.api.job_order.getFindAll_List,{}
      ).then(res => {
        that.findAll_List = res;
      });
    },
    /**
     * 预防js注入攻击函数
     * @param { String } str 输入的文本
     */
    preventGsImplantAttack(str) {
      const res = /(<|>)/ig;

      return str.replace(res ,item => {
        switch(item) {
          case '<':
            return '&lt;';
            break;
          case '>':
            return '&gt;';
            break;
        }
      });
    },
    /**
     * 保存工单时间
     */
    async saveJobTime() {
      const that = this,
            nameReg = /^([\w\u4E00-\u9FA5_\-]+)+$/;

      if(!that.jobOrderTimeSaveObj.name) {
        this.warn('时限管理名称不能为空！');
        return;
      };
      if(!nameReg.test(that.jobOrderTimeSaveObj.name)) {
        this.warn('时限管理名称不能含有特殊字符！');
        return;
      };
      // 编辑的名字不等于数据库存的名字，才去校验，名字是否重复
      if(this.jobOrderTimeSaveObjName != that.jobOrderTimeSaveObj.name) {
        let isRepetition = await this.request(
          this.api.job_order.jobOrderTime_validation,
          {
            name:that.jobOrderTimeSaveObj.name,
            applyWorkOrders:[]
          }
        );
        if(!isRepetition.exist) {
          that.warn(isRepetition.msg);
          return;
        };
      }
      let handleTimeEvery = Object.values(that.jobOrderTimeSaveObj.handleTime).every(item => {
        return item == false;
      });
      if(handleTimeEvery) {
          this.warn('处理时长不能为空！');
          return;
      };
      for(let item in that.jobOrderTimeSaveObj.handleTime) {
        if(that.jobOrderTimeSaveObj.handleTime[item] < 0) {
          this.warn('处理时长不能含有负数！');
          return;
        }
      };
      for(let item in that.jobOrderTimeSaveObj.jobPoolTime) {
        if(that.jobOrderTimeSaveObj.jobPoolTime[item] < 0) {
          this.warn('流入工单池时间不能含有负数！');
          return;
        }
      };
      if(!that.jobOrderTimeSaveObj.alarmSets.length) {
          this.warn('请添加预警配置！');
          return;
      };
      for(var i = 0; i < that.jobOrderTimeSaveObj.alarmSets.length; i++){
        var item = that.jobOrderTimeSaveObj.alarmSets[i];
        let endTimeEvery = Object.values(item.endTime).every(item => {
          return item == false;
        });
        if(endTimeEvery) {
            this.warn('预警时间段不能为空！');
            return;
        };
        for(let i in item.endTime) {
          if(item.endTime[i] < 0) {
            this.warn('预警时间段不能含有负数！');
            return;
          }
        };
        // 把除了当前的endTime全部装到endTimeArr里
        let endTimeArr = [];
        that.jobOrderTimeSaveObj.alarmSets.forEach((items, indexs) => {
          for(name in items.endTime) {
            items.endTime[name] = this.replenishZero(items.endTime[name]);
          };
          if(items !== item) {
            endTimeArr.push({endTime: items.endTime});
          };
        });
        // 拿当前的endTime跟数组里所有时间做比较，如果时间相同，那么返回这个元素
        let isEndTimes = endTimeArr.find((isItem, IsIndex) => {
          let item_endTime = parseInt(Object.values(item.endTime).join(''));
          let items_endTime = parseInt(Object.values(isItem.endTime).join(''));
          return item_endTime === items_endTime;
        });
        if(isEndTimes) {
          isEndTimes.endTime.isEndTime = true;
          this.warn('预警时间段不能重复设置！');
          return;
        };
        if(!item.warnType) {
          this.warn('请选择预警类型！');
          return;
        };
        if(item.localRemindDisabled && !item.localRemind) {
          this.warn('请选择预警提醒！');
          return;
        };
        if(item.localRemindDisabled && !item.signerReceive  && !item.adminReceiveDisabled) {
          this.warn('请勾选接收人！');
          return;
        };
        if(item.adminReceiveDisabled && !item.adminReceive) {
          this.warn('请选择所属机构！');
          return;
        };
      };
      // 数据提交之前，最后一次深拷贝
      let data = JSON.parse(JSON.stringify(that.jobOrderTimeSaveObj));
      // 处理数据
      data.handleTime = this.obj2Str(data.handleTime);
      data.jobPoolTime = this.obj2Str(data.jobPoolTime);
      data.isStart = data.isStart ? 1 : 0;
      data.alarmSets.forEach((item ,index) => {
        item.endTime = this.obj2Str(item.endTime);
        // 如果站内消息没有勾选，清除站内提醒数据
        item.localRemind = item.localRemindDisabled ?  item.localRemind : '';
        // 如果接收人没有勾选，清除管理者接收数据
        item.adminReceive = (item.adminReceiveDisabled || item.signerReceive) ? item.adminReceive : '';
      });
      // return;
      this.request(
        that.api.job_order.jobOrderTimeUpdate,
        data
      ).then(res => {
         that.warn('工单时限编辑成功！','success');
          that.href('workorder/config/workOrder_time_list');
      });
    },
    /**
     * 提示
     */
    warn(message, type) {
      this.$message({
        message: message,
        type: type || 'warning'
      });
    },
    /**
     * 对象拼接字符串
     * @param { Object } timeObj 时间对象
     */
    obj2Str(timeObj) {
      let  newTimeObj ='';

      for(var item in timeObj) {
        if(timeObj[item]) {
          newTimeObj += `${timeObj[item]}-`;
        }else{
          newTimeObj += `0-`;
        }
      };
      return newTimeObj.replace(/-$/g,'');
    },
    /**
     * 添加预警
     */
    addAlarmSets() {
      const that = this;

      that.jobOrderTimeSaveObj.alarmSets.push(JSON.parse(JSON.stringify(that.alarmSetsBck)));
    },
    /**
     * 删除预警
     */
    closeAlarmSets(index) {
      const that = this;

      that.jobOrderTimeSaveObj.alarmSets.splice(index, 1);
    },
    /**
     * 添加适用工单，且添加的工单不能重复
     * @param { Object } item 选中的每一项
     */
    async addApplyWorkOrder(item) {
      const that = this;
      // 判断是否是编辑时获取的适用工单，如果不是可以走检验
      let isExist = this.applyWorkOrders_backups.every(v => {
        return v.workOrderId !=  item.id;
      });
      // 检验工单是否已经创建
      if(isExist) {
        let isRepetition = await this.request(
          this.api.job_order.jobOrderTime_validation,
          {
            name:'',
            applyWorkOrders:[{
              workOrderId:item.id,
              workOrderName:item.name
            }]
          }
        );
        // 如果已经存在，提示并终止添加此条工单
        if(!isRepetition.exist) {
          that.warn(isRepetition.msg);
          return;
        };
      };
      let isHas = that.jobOrderTimeSaveObj.applyWorkOrders.every((i) => {
        return i.workOrderId != item.id;
      });
      if(!isHas) return;
      that.jobOrderTimeSaveObj.applyWorkOrders.push({
        workOrderId:item.id,
        workOrderName:item.name
      });

    },
    /**
     * 适用工单校验
     */
    applyWorkOrdersValidation(item) {
      this.request(
        this.api.job_order.jobOrderTime_validation,
        {
          name:'',
          applyWorkOrders:[{
            workOrderId:item.id,
            workOrderName:item.name
          }]
        }
      );
    },
    /**
     * 删除适用工单
     */
    deleteTag(index) {
       const that = this;

      that.jobOrderTimeSaveObj.applyWorkOrders.splice(index, 1);
    },
    /**
     * 跳转
     */
    href(routeName) {
      this.$router.push({
        path: `/${routeName}`,
      });
    },
    /**
     * 领取工单
     */
    open2() {
      this.$message({
        message: "工单领取成功！",
        type: "success"
      });
    },
  },
  components: {
    codeSet,
    treeDept
  }
};
</script>
<style  lang="less" scoped>
.warningTypeColor{
  border-radius:5px;
  color:#fff;
  margin-bottom:1px;
}
.leftName{
  .leftName-span{
      width: 200px;
      height: 40px;
      line-height: 40px;
      text-align: right;
      padding-right: 10px;
      .colorRed{
        color: red;
        line-height:30px;
      }
  }
}
.leftName2{
  .leftName-span2{
      width: 98px;
      height: 40px;
      line-height: 40px;
      text-align: right;
      padding-right: 10px;
      .colorRed{
        color: red;
        line-height:30px;
      }
  }
}
.el-icon-close{
  cursor:pointer;
}
h5 {
  color: #222;
  margin-left: -15px;
}
.set-warning {
  width: 650px;
  padding-bottom: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  position: relative;
  .el-icon-close {
    position: absolute;
    top: 15px;
    right: 15px;
  }
}
.isEndTime{
  border: 1px solid #FFEC8B;
  box-shadow: 0 2px 2px 2px #f5f5f5;
}
.width600{
  width: 600px;
}
.width350 {
  width: 350px;
}
.width50 {
  width: 75px;
}
.test {
  color: #9d9d9d;
}
.display-flex {
  display: flex;
}
.justify-content {
  display: flex;
  justify-content: space-between;
}
.content {
  height: 50px;
  line-height: 50px;
}
.text-index10 {
  text-indent: 10px;
}
.tree {
  width: 700px;
  border-right: 1px solid #ccc;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  span {
    display: inline-block;
    width: 50%;
  }
  span {
    border-bottom: 1px solid #ccc;
  }
  .l {
    border-right: 1px solid #ccc;
  }
}
</style>
