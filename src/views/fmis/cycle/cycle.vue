<template>
  <div>
    <div class="table_div">
      <el-button type="primary" @click="addBtnClickEvent" size="small" v-auth="codeData"
      data-code="170101">新增</el-button>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        header-row-class-name="item-table-header"
        @selection-change="selectionChange"
      >
        <!-- <el-table-column type="selection"></el-table-column> -->
        <el-table-column label="结算周期名称">
          <template slot-scope="scope">{{ scope.row.name?scope.row.name:'--' }}</template>
        </el-table-column>
        <el-table-column prop label="常规结算周期">
          <template slot-scope="scope">{{ scope.row.taskCode | filterTaskCode}}</template>
        </el-table-column>
        <el-table-column prop="nodeDays" label="自定义结算周期" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.nodeDays?scope.row.nodeDays:'--' }}</template>
        </el-table-column>
        <el-table-column prop="merchantType" label="店铺类型">
          <template slot-scope="scope">{{ scope.row.merchantType | filterMerchantType }}</template>
        </el-table-column>
        <el-table-column prop="merchant" label="适用门店">
          <template slot-scope="scope">{{ scope.row.merchant?scope.row.merchant:'--' }}</template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template slot-scope="scope">{{ scope.row.updateTime | timestampToTime }}</template>
        </el-table-column>
        <el-table-column prop="valid" label="启停状态">
          <template slot-scope="scope">
            <el-switch v-auth="codeData"
              data-code="170104" v-model="scope.row.valid" active-color="#13ce66" inactive-color="#ff4949" @change="switchChangeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="editorBtnClick(scope.row)" type="text" size="small" :disabled='scope.row.valid' v-auth="codeData"
              data-code="170102">编辑</el-button>
            <el-button @click="deleteBtnClick(scope.row)" type="text" size="small" :disabled='scope.row.valid' v-auth="codeData"
              data-code="170103">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:20px;padding-bottom:10px;margin-right:20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="signData.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="signData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="showCycleFrom" width="500px" @close='hideDialog'>
      <el-form :model="cycleFromData" ref="cycleFromData" :rules="rules">
        <el-form-item label="对账周期名称：" label-width="120px" prop="name">
          <el-input v-model="cycleFromData.name" style="width:200px;" placeholder="请输入内容" @input="nameInputChangeValue"></el-input>
        </el-form-item>
        <el-form-item label="选择对账周期：" label-width="120px" prop='taskCode'>
          <el-select v-model="cycleFromData.taskCode" placeholder="请选择" @change="changeTaskCode">
            <el-option v-for='item in statementCycleTypeListData' :key="item.id" :label="item.description" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自定义结算日：" label-width="120px" prop='tagDays' v-if="tagDaysState">
          <el-popover placement="bottom" width="200" trigger="click">
            <div class="day-arr-check input-w" slot="reference" style="height: 32px;border: 1px solid #DCDFE6;overflow-y: auto;border-radius:5px;">
              <el-tag
                  v-for="tag in cycleFromData.tagDays"
                  :key="tag.id"
                  closable
                  size="mini"
                  @close="dayArrItemClickEvent(tag)"
                  class='tag_date'
              >
                {{tag.day}}
              </el-tag>
              <i class="el-icon-arrow-down icon"></i>
              <span class='span_style'>{{placeholderStr}}</span>
            </div>
            <div class="list">
              <ul class="clearfix ul_style">
                <li v-for="item in dayArr" :key="item.id" class='li_style' @click="dayArrItemClickEvent(item)" :class="{check : item.flag}">{{ item.id }}</li>
              </ul>
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item label="适用店铺类型：" label-width="120px" prop='merchantType'>
          <el-select v-model="cycleFromData.merchantType" placeholder="请选择" @change="changeStoreName" :class="{store_type:storeState}">
            <el-option v-for='item in storeData' :key="item.id" :label='item.description' :value='item.code'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用门店：" label-width="120px" prop='merchantId'> 
          <el-select v-model="cycleFromData.merchantId" placeholder="请选择"  @focus="storeFocus" @change="changeMarchantName">
            <el-option v-for='item in merchantStoreData' :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelClickEvent('cycleFromData')">取 消</el-button>
        <el-button type="primary" @click="sureAddFromOfCycle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { constants } from "crypto";
export default {
  data() {
    return {
      signData: {
        //组织机构Id集合(包括直属机构还有关联机构)
        organizationIds:[],
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      //得到权限Code
      codeData: [],
      //存储表格选择项改变时的数据
      multipleSelectionData: [],
      //表格数据
      tableData: [],
      //总条数
      totalCount: 1,
      //标识是否显示新增对账周期表单
      showCycleFrom: false,
      //新增表单数据
      cycleFromData: {
        //对账周期名称
        name:'',
        //对账周期Code
        taskCode:'',
        //店铺类型Code
        merchantType: "",
        //上传给后台的自定义日期
        nodeDays:'',
        //标识选择的结算日期
        tagDays: [],
        //适用门店Id
        merchantId: '',
        //适用门店name
        merchant:'',
        //组织机构id
        organizationId:'',
      },
      rules: {
        name: [
          { required: true, message: "对账周期名称不能为空", trigger: "blur" }
        ],
        taskCode: [
          { required: true, message: "对账周期不能为空", trigger: "change" }
        ],
        merchantType: [
          { required: true, message: "店铺类型不能为空", trigger: "change" }
        ],
        tagDays: [
          { required: true, message: "自定义结算日不能为空", trigger: "change" }
        ],
        merchantId: [
          { required: true, message: "适用门店不能为空", trigger: "change" }
        ]
      },
      //标识店铺类型是否有数据
      storeState:false,
      //标识自定义日期是否显示
      tagDaysState:false,
      //结算日期数组
      dayArr: [],
      //得到对账周期数据
      statementCycleTypeListData:[],
      //店铺类型数据
      storeData:[],
      //得到适用门店数据
      merchantStoreData:[],
      // 选中的日期
      dayArrChecked: '',
      placeholderStr:'请选择',
      //标识是新增还是编辑
      tag:'',
      title:"新增对账周期配置"
    };
  },
  filters: {
    //过滤常规结算周期
    filterTaskCode(val){
      switch (val) {
        case '05001':
          return '日结';
          break;
        case '05002':
          return '周结';
          break;
        case '05004':
          return '月结';
          break;
        case '05010':
          return '自定义';
          break;
        default:
          return '--';
          break;
      }
    },
    //过滤店铺类型
    filterMerchantType(val){
      switch (val) {
        case '06002':
          return '网销店铺';
          break;
        case '06001':
          return '零售店铺';          
          break;
        default:
          return '--';
          break;
      }
    }, 
  },
  mounted() {
    //得到日期数据
    this.getDataArr();
    //得到组织机构数据
    this.getOrganizationListData();
    //得到对账周期数据
    this.getStatementCycleTypeListData();
    //得到店铺数据
    this.getStoreTypeListData();
  },
  methods: {
    //得到组织机构数据
    async getOrganizationListData() {
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      console.log(info);
      //得到部门Id
      // this.signData.relationDepId = info.departId;
      //得到当前登录人的直属机构id
      this.request(this.api.user.userCompany_getUserOrgByUserId, {
        userId: info.userId,
        type: 0
      }).then(data => {
        console.log(data);
        //得到机构id
        this.cycleFromData.organizationId=data.id;
      });
      //得到关联机构（type-0 机构 type-1 部门）
      this.request(this.api.user.userCompany_getUserAllDepartByUserId, {
        userId: info.userId,
        type: 0
      }).then(data => {
        //得到组织机构数据
        this.organizationListData=data;
        console.log(data);
        this.signData.organizationIds=[]
        data.forEach(item => {
          this.signData.organizationIds.push(item.id);
        });
        //得到列表数据
        this.getCycleListData();
      });
    },
    // 得到code码，用来限制是否显示按钮
    getCodeLimitToBtnStatus(codeId) {
      this.request(this.api.user.crm_userCompany_authList, {
        menuId: codeId
      }).then(res => {
        console.log(res);
        this.codeData = res;
      });
    },
    //结算日期的item的点击事件
    dayArrItemClickEvent(item){
      item.flag = !item.flag
      this.$nextTick(() => {
        this.placeholderStr=''
        this.cycleFromData.tagDays = this.dayArr.filter(item => {
          return item.flag
        })
        this.cycleFromData.tagDays.forEach(item=>{
          item.day=item.id+"日"
        })
      })
    },
    //得到自定义结算日数据
    getDataArr(){
      //添加日期数组
      let ary = []
      for (var i = 0; i < 28; i++) {
        var str = null;
        if (i < 9) {
          str = "0" + (i + 1);
        } else {
          str = i + 1 + "";
        }
        ary[i] = {
          id:str,
          flag: false
        };
      }
      this.dayArr = ary;
    },
    //得到列表数据
    getCycleListData() {
      this.request(this.api.financial.financialConfig_list, this.signData).then(
        data => {
          console.log(data);
          this.totalCount = data.totalCount;
          this.tableData = data.data;
        }
      );
      //得到按钮操作权限数据
      this.getCodeLimitToBtnStatus(this.$route.meta.currentid);
    },
    storeFocus(){
      console.log("changStoreNamr........")
      if(!this.cycleFromData.merchantType){
        this.storeState=true
      }else{
        console.log("fale===========")
        this.storeState=false
      }
    },
    //得到对账周期数据
    getStatementCycleTypeListData(){
      this.request(this.api.financial.financialBase_statementCycleTypeList,{}).then(
        data=>{
          console.log(data)
          this.statementCycleTypeListData=data
        }
      )
    },
    //得到店铺类型数据
    getStoreTypeListData(){
      this.request(this.api.financial.financialBase_merchantTypeList,{}).then(
        data=>{
          console.log(data)
          this.storeData=data
        }
      )
    },
    //得到适用门店数据
    getMerchantStoreListByType(organizationId,merchantType){
      this.request(this.api.financial.financialBase_merchantListByType,{organizationId:organizationId,merchantType:merchantType}).then(
        data=>{
          console.log(data)
          data.forEach(item=>{
            if(item.storeName){
              item.name=item.storeName
            }
          })
          this.merchantStoreData=data
        }
      )
    },
    //switch改变时的事件
    switchChangeState(row){
     console.log(row)
      if(row.valid){
        var time=this.$options.filters.timestampToTimeOfSwitchToStart(new Date())
        this.showMessageBox("启用后，账单生成开始时间为"+time,row.id,row.valid)
      }else{
        var time=this.$options.filters.timestampToTimeOfSwitchToEnd(new Date())
        this.showMessageBox("停用后，系统会把之前未对账的交易生成对账单,上次账单生成结束时间"+time,row.id,row.valid)
      }
    },
    //输入
    nameInputChangeValue(val){
      if (val.length > 20) {
        this.cycleFromData.name = val.substr(0, 20);
      }
    },
    //切换对账周期的事件
    changeTaskCode(val){
      this.placeholderStr='请选择'
      if(val!='05010'){
        this.cycleFromData.tagDays=[]
        this.dayArr.forEach(item => {
        item.flag=false
      });
        this.tagDaysState=false
      }else{
        this.tagDaysState=true
      }
    },
    //切换店铺时的事件
    changeStoreName(val){
     console.log(val)
     this.storeState=false
     this.cycleFromData.merchantId=''
    //  this.cycleFromData.merchant=''
     //清空适用门店数据
     this.getMerchantStoreListByType(this.cycleFromData.organizationId,val) 
    },
    //适用门店的选择事件
    changeMarchantName(val){
     console.log(val)
     this.storeState=false
     this.cycleFromData.merchant=this.merchantStoreData.find(item=>item.id==val).name
    },    
    //新增
    addBtnClickEvent() {
      console.log("addBtnClickEvent");
      //标识是新增还是编辑
      this.tag='add'
      this.title='新增对账周期配置'
      this.showCycleFrom = true;
    },
    //表格选择项改变时触发
    selectionChange(val) {
      this.multipleSelectionData = val;
    },
    //编辑Btn的事件
    editorBtnClick(row) {
      //标识是新增还是编辑
      this.tag='editor'
      this.title='编辑对账周期配置'
      console.log("editorBtnClick....");
      this.request(this.api.financial.financialConfig_getByPrimary,{configId:row.id}).then(data=>{
        console.log(data)
        if(data.taskCode=='05010'){
          this.tagDaysState=true
        }
        this.getMerchantStoreListByType(this.cycleFromData.organizationId,data.merchantType)
        var tagDataArr=[]
        if(data.nodeDays){
          var tagDays=data.nodeDays.split(',')
          console.log(tagDays)
          tagDays.forEach((item,index) => {
            tagDataArr.push({
              id:item.substring(0,2),
              day:item,
              flag:false
            })
          });
          this.placeholderStr=''
          tagDataArr.forEach(item=>{
            this.dayArr.forEach(dateItem => {
              if(item.id==dateItem.id){
                dateItem.flag=true
              }
            })
          })
        }

        this.$set(data,'tagDays',tagDataArr)
        this.cycleFromData=data
        this.showCycleFrom = true;
      })
    },
    //删除Btn的事件
    deleteBtnClick(row) {
      console.log("删除Btn的事件");
      this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.request(this.api.financial.financialConfig_logicDelete,{configId:row.id}).then(data=>{
            console.log(data)
            //更新数据
            this.getCycleListData()
          })
        }).catch(() => {
          console.log("取消。。。。。。")  
        });
    },
    //每页条数改变时 
    handleSizeChange(page) {
      this.signData.pageSize = page;
      this.getCycleListData();
    },
    //当前页改变时
    handleCurrentChange(page) {
      this.signData.pageIndex = page;
      this.getCycleListData();
    },
    //取消
    cancelClickEvent(cycleFromData){
      this.hideDialog()
    },
    //确定新增对账表单
    sureAddFromOfCycle() {
      if(this.cycleFromData.tagDays){
        var nodeDays=''
        this.cycleFromData.tagDays.forEach((item,index)=>{
          if(index!=this.cycleFromData.tagDays.length-1){
            nodeDays+=item.day+','
          }else{
            nodeDays+=item.day
          }
        })
        this.cycleFromData.nodeDays=nodeDays
      }
      this.$refs['cycleFromData'].validate((valid) => {
        if (valid) {
          switch(this.tag){
            case 'add':
              this.request(this.api.financial.financialConfig_insert,this.cycleFromData).then(data=>{
                console.log('新增保存成功。。。')
                this.showCycleFrom=false
                //刷新列表
                this.getCycleListData()
              })
              break;
            case 'editor':
                this.request(this.api.financial.financialConfig_updateByPrimary,this.cycleFromData).then(data=>{
                  console.log('编辑保存成功。。。')
                  this.showCycleFrom=false
                  this.hideDialog()
                  //刷新列表
                  this.getCycleListData()
                })
              break;
          }
        
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //隐藏dialog
    hideDialog(){
      console.log("hidePopover")
      this.$refs.cycleFromData.resetFields();
      this.placeholderStr='请选择'
      this.storeState=false
      this.tagDaysState=false
      this.showCycleFrom=false
      this.tag=""
      this.cycleFromData.nodeDays=''
      this.merchantStoreData=[]
      this.cycleFromData.merchant=''
      //对账周期名称
      this.cycleFromData.name='',
      //对账周期Code
      this.cycleFromData.taskCode='',
      //店铺类型Code
      this.cycleFromData.merchantType= "",
      //标识选择的结算日期
      this.cycleFromData.tagDays= [],
      //适用门店Id
      this.cycleFromData.merchantId= '',
      this.dayArr.forEach(item => {
        item.flag=false
      });
    },
    //显示信息提示框
    showMessageBox(msg,configId,valid){
      this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.request(this.api.financial.financialConfig_updateValid,{configId:configId,symbol:valid}).then(data=>{
            console.log(data)
          }).catch(err=>{
            console.log('请求出错。。。')
            this.tableData.forEach(item => {
              if(item.id==configId){
                item.valid=!item.valid
              }
            })  
          })
        }).catch(() => {
          console.log("取消。。。。。。")
          this.tableData.forEach(item => {
            if(item.id==configId){
              item.valid=!item.valid
            }
          })      
        });
    }
  }
};
</script>

<style scoped>
.check{
  background: #00abee;
}
.table_div {
  margin: 10px;
  background-color: #fff;
  padding-top: 20px;
  padding-left: 10px;
}
.icon{
  height:32px;
  line-height: 32px;
  position: absolute;
  right:150px;
  top:0;
  color:#C0C4CC;
  /* background:#C0C4CC; */
}
.ul_style{
  width: 176px;
  border:1px solid #ccc;
  border-bottom:none;  
  border-right:none;
}
.li_style{
  width: 35px;
  height: 20px;
  float: left;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
  border-right:1px solid #ccc;
  border-bottom:1px solid #ccc;
}
.span_style{
  height:32px;
  position: absolute;
  left:15px;
  top:0;
  color:#C0C4CC;
  line-height: 32px;
}
.tag_date{
  margin-left:1px;
  margin-bottom:3px;
  margin-top:3px;
  height: 19px;
  padding: 0 5px;
  line-height: 19px;
  float:left;
}
.store_type /deep/ .el-input .el-input__inner{
  border: 1px solid red;
}
</style>


