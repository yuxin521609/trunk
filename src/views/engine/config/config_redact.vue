<!-- 创建新工单 -->
<template>
  <div>
    <!-- 指派 -->
    <el-dialog title="预览" :visible.sync="dialogTableVisible">
      <el-form class="item-form previewVisible-list" size="small" :inline="true" :model="formInline">
        <!-- 模糊查询 -->
        <el-form-item class="item" :label="item.itemName" width="200" :key="item.id" v-for="item in tableItemsObj">
          <el-input disabled value="--"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新建工单 -->
    <div class="item-margin" style="height:100%;">
      <div class="item-form">
        <div class="mt-30">工单定义</div>
        <el-form class="item-form" size="small" :inline="true" :model="jobOrderExtendObj">
          <section class="extend-list">
            <!-- 业务类型 -->
            <div class="item">
              <i class="colorRed">*</i>
              <el-form-item label="业务类型：">
                <code-set v-model="jobOrderExtendObj.busType" code="CEN012" :multiple="false"/>
              </el-form-item>
            </div>
            <!-- 服务类型 -->
            <div class="item">
              <i class="colorRed">*</i>
              <el-form-item label="服务类型：">
                <code-set v-model="jobOrderExtendObj.serveType" code="CEN013" :multiple="false"/>
              </el-form-item>
            </div>
            <!-- 适用部门 -->
            <div class="item">
              <i class="colorRed">*</i>
              <el-form-item label="适用部门：">
                <tree-dept
                  v-model="jobOrderExtendObj.dept"
                  val-type="id"
                  :sel-type="1"
                  :default-expand-all="true"
                ></tree-dept>
              </el-form-item>
            </div>
            <!-- 优先级 -->
            <div class="item">
              <i class="colorRed">*</i>
              <el-form-item label="优先级：">
                <el-select  v-model="jobOrderExtendObj.priority"  placeholder="请选择">
                  <el-option  v-for="item in prioritys"  :label="item.label" :key="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- 工单名称 -->
            <div class="item">
              <i class="colorRed">*</i>
              <el-form-item label="工单名称：">
                <el-input style="width:199px;" v-model="jobOrderExtendObj.name" placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
            <!-- 工单排版 -->
            <div class="item">
              <i class="colorRed">*</i>
              <el-form-item label="工单排版：">
                <el-select v-model="jobOrderExtendObj.layout" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- 源单编码 -->
            <div class="item">
              <i class="colorRed">*</i>
              <el-form-item label="源单编码：">
                <el-input style="width:199px;" v-model="jobOrderExtendObj.sourceOrderParams.sourceOrderType" placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
          </section>
        </el-form>
        <!-- 工单配置内容 -->
        <div class="mt-30">工单配置内容</div>
        <el-form class="item-form" size="small" :inline="true" :model="formInline">
          <i class="colorRed">*</i>
          <el-form-item prop="parentName" label="具体源单：">
            <el-select v-model="TableSet_defalut" disabled value-key="id" @change="tableItemGetListMap">
              <el-option v-for="(item, index) in TableSet_List" :value="item" :key="item.id">{{ item.tableCn }}</el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 配置字段 -->
        <div class="display-flex" v-if="listMapArr.length">
          <i class="colorRed" style="line-height:19px">*</i>
          <span>配置流转数据：</span>
          <div class="tree">
            <div class="tree-title text-center">
              <span>源单数据</span>
              <span>是否可读写</span>
              <span>关联数据</span>
            </div>
            <!-- 一级分类 -->
            <ul>
              <li v-for="(item, index) in listMapArr" :key="index">
                <div class="justify-content content">
                  <span class="l">
                    <el-checkbox
                      class="ml-20"
                      @change="selectParent(item.checked, index, item)"
                      v-model="item.checked">
                    </el-checkbox>
                    <i @click="click_isShow(index)">
                      <i :class="item.isShow ? 'el-icon-minus' : 'el-icon-plus'"></i>
                      {{ item.tableCn }}
                    </i>
                  </span>
                  <span class="r">
                    <template>
                      <el-radio-group v-model="item.isRead" @change="changeRadioParent(item.isRead, index)">
                        <el-radio :disabled="!item.checked" :label="1">可读写</el-radio>
                        <el-radio :disabled="!item.checked" :label="0">只读</el-radio>
                      </el-radio-group>
                    </template>
                  </span>
                  <span class="r"></span>
                </div>
                <!-- 二级分类 -->
                <ul v-if="item.sublist && item.sublist.length > 0 && item.isShow">
                  <li v-for="(items, indexs) in item.sublist" v-if="items.visible" :key="indexs">
                    <div class="justify-content content">
                      <span class="l text-index10">
                        <el-checkbox
                          class="ml-20"
                          @change="selectChilder(items.checked, index, indexs, item)"
                          v-model="items.checked"
                        >{{ items.itemName }}</el-checkbox>
                      </span>
                      <span class="r">
                        <template>
                          <el-radio-group v-model="items.isRead" @change="changeRadioChild(items.isRead, index)">
                            <el-radio :disabled="!items.checked"  :label="1">可读写</el-radio>
                            <el-radio :disabled="!items.checked" :label="0">只读</el-radio>
                          </el-radio-group>
                        </template>
                      </span>
                      <span class="r">
                        <template>
                          <el-checkbox label="关联数据" :disabled="!items.checked" v-model="items.request"></el-checkbox>
                        </template>
                      </span>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-50 mb-50">
          <el-button type="primary" @click="saveJobOrder" size="small">确定</el-button>
          <el-button @click="href('workOrder_new_list')" size="small">取消</el-button>
          <el-button @click="dialogTableVisible = true" size="small" v-if="Object.values(tableItemsObj).length > 0">预览</el-button>
        </div>
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
import { constants } from 'crypto';
import { exists } from 'fs';
import { async } from 'q';
let token = getToken();

export default {
  data() {
    return {
      // 名称校验集合
      existObj:{},
      // 具体单源默认value
      TableSet_defalut:'请选择',
      // 具体单源列表
      TableSet_List:[],
      jobOrderExtendObj_name:null,
      // 新建表单提交数据
      jobOrderExtendObj: {
        busType: "", // 业务类型
        currentUser: "",
        dept: "",// 适用部门
        layout: "",// 工单排版
        name: "",// 工单名称
        priority: '',// 优先级
        serveType: "",// 服务类型
        sourceOrderParams: {
          sourceOrderChild: ""
        },
        tableItems: [
          {
            codeName: "",
            currentUser: "",
            id: "",
            inputType: "",
            isRead: 0,
            itemAlias: "",
            itemCode: "",
            itemName: "",
            itemType: 0,
            jdbcType: "",
            length: 0,
            linkItemName: "",
            linkTable: "",
            nullAble: true,
            precisions: 0,
            primaryKey: true,
            remarks: "",
            sort: 0,
            status: 0,
            tableSetId: "",
            visible: true
          }
        ],
        tableSets: [
          {
            alias: "",
            code: "",
            currentUser: "",
            dataSourceId: "",
            id: "",
            linkType: 0,
            orderExtendId: "",
            remarks: "",
            sort: 0,
            sourceChileType: "",
            sourceOrderType: "",
            status: 0,
            tableCn: "",
            tableId: "",
            tableName: "",
            type: 0
          }
        ],
        workOrderProcessItem: []
      },
      // 父类选择对象备份
      tableSetsObj:{},
      // 子类选择对象备份
      tableItemsObj:{},
      // 配置选项
      listMapArr:[],
      formInline: {
        user: "",
        region: ""
      },
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        used: null, //有效状态
        filter: "", //搜索关键字
        startDate: "",
        endDate: ""
      },
      currentPage: 1, // 当前页数
      total: 130, //总条目数
      value: "",
      storageValArr: '',
      // 指派单选框
      radio: "1",
      // 指派
      options: [{
          value: '01',
          label: '三栏'
        }, {
          value: '02',
          label: '四栏'
        }],
         // 指派
      prioritys: [{
          value: '01',
          label: '高'
        },{
          value: '02',
          label: '中'
        },{
          value: '03',
          label: '低'
        }],
        value: '',
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px"
    };
  },
  created() {
    this.getTableSet_List();
    this.jobOrderExtendGet(this.$route.query.id);
    // this.tableItemListByOrderExtendId(this.$route.query.id);

    console.log(this.$route.query)
  },
  mounted() {},
  methods: {
    /**
     * 获取工单类型扩展
     */
    jobOrderExtendGet(id) {
      const that = this;
      // 请求数据
      this.request(
        this.api.job_order.jobOrderExtendGet,
        {
          id
        }
      ).then(res=>{
        that.jobOrderExtendObj = res;
        that.jobOrderExtendObj_name = JSON.parse(JSON.stringify(that.jobOrderExtendObj.name));
        // let findItem = that.TableSet_List.find(item => {
        //   return res.sourceOrderParams.sourceOrderType == item.code;
        // });
        that.tableItemGetListMap({
          id:res.sourceOrderParams.sourceOrderChild,
          // tableCn:findItem.tableCn
        });
      });
    },
    /**
     * 根据源单获取所有子表数据项
     */
    tableItemListByOrderExtendId(id) {
      const that = this;

      this.request(
        that.api.job_order.tableItemListByOrderExtendId,
        {
          orderExtendId: id
        }
      ).then(res => {
      let tableItemListByWorkOrderCodeArr =[];
        // 处理配置单源数据字段
        res.forEach((item, index) => {
          if(item.type == 0) that.TableSet_defalut = item.tableCn;
          item.sublist.forEach((items, indexs) => {
            // if(items.visible == false) return;
            tableItemListByWorkOrderCodeArr.push(items);
          })
        });
        console.log(tableItemListByWorkOrderCodeArr)
        // 点亮字段勾选
        tableItemListByWorkOrderCodeArr.forEach((itemArr, indexArr) => {
          let isRead = null,
              index = null,
              indexs = null,
              tableSetsObj = null,
              obj = {};
          if(itemArr.visible == false) return;
          that.listMapArr.forEach((item, index) => {
            item.sublist.forEach((items, indexs) => {
              if(items.itemName ==  itemArr.itemName) {
                obj = {
                  isRead : true,
                  index : index,
                  indexs : indexs,
                  tableSetsObj : item
                }
                return;
              }
            })
          });
          console.log(obj)
          that.selectChilder(obj.isRead, obj.index, obj.indexs, obj.tableSetsObj);
          that.listMapArr[obj.index].sublist[obj.indexs].isRead = itemArr.isRead;
          that.listMapArr[obj.index].sublist[obj.indexs].request = itemArr.request;
          that.changeRadioChild(itemArr.isRead, obj.index);
        });
        console.log(that.listMapArr);
        console.log(tableItemListByWorkOrderCodeArr);
      });
    },
    /**
     * 改变父单选框
     * @param { Boolean } isRead 是否选中状态
     * @param { Number } index 当前索引
     */
    changeRadioParent(isRead, index) {
      const that = this,
            listMapArr = that.listMapArr;

        listMapArr[index].sublist.forEach((items, index) => {
          items.isRead = isRead;
        })
      console.log(listMapArr[index].sublist)

    },
    /**
     * 改变子单选框
     * @param { Boolean } isRead 子选框选中状态
     * @param { Number } index 当前索引
     */
    changeRadioChild(isRead, index) {
      var that = this,
            listMapArr = that.listMapArr,
            isRadioParent;
      // 如果选择的是左侧的选框，当全部子选框被选中时，父级选框被勾选，否则取消勾选
      if(isRead) {
        isRadioParent = listMapArr[index].sublist.every((item) => {
          return item.isRead === 1;
        });
        listMapArr[index].isRead = isRadioParent ?  1 : null;
      }else{
        isRadioParent = listMapArr[index].sublist.every((item) => {
          return item.isRead === 0;
        });
        listMapArr[index].isRead = isRadioParent ? 0 : null;
      };
      console.log(listMapArr[index].sublist)
      console.log(that.tableItemsObj)
    },
    /**
     * 获取具体单源列表
     */
    getTableSet_List() {
      const that = this;
      // 请求数据
      this.request(
        this.api.job_order.getTableSet_List,
        {
          isSourceOrder:1
        }
      ).then(res=>{
        that.TableSet_List = res.data;
      });
    },
    /**
     * 获取工单配置内容
     * @param { String } selval.id 请求id
     */
    tableItemGetListMap(selVal) {
      const that = this;

      that.jobOrderExtendObj.sourceOrderParams.sourceOrderChild = selVal.id;
      // 请求数据
      this.request(
        this.api.job_order.tableItemGetListMap,
        {
          tableSetId: selVal.id
        }
      ).then(res=>{
        // 数据初始化放在最前面做
        res.forEach((item, index) => {
          item.checked = false;
          // json名称修改
          item.sourceTableId = item.id;
          delete item.id;
          item.checkedLength = 0;
          item.radioLength = 0;
          item.isShow = false;
          item.isRead = '';
          item.sublist.forEach((items, indexs) => {
            items.checked = false;
            items.request = false;
            items.isRead = '';
          })
        });
        /**
         * 拷贝一份配置选项，为了删除sublist中visible为false的附加选，不然操作会出错
         * 但是最后如果选择了子单，是需要把这个删除项带上的，所以要准备一个暂时备份
         */
        this.listMapArr_backup = JSON.parse(JSON.stringify(res));
        // 删除res下sublist中visible为false的项；
        res.forEach((item, index) => {
          let find_Visible_false = item.sublist.findIndex((items, indexs) => {
            return items.visible == false;
          });
          if(find_Visible_false != -1) {
            item.sublist.splice(find_Visible_false, 1);
          };
        });
        that.listMapArr = res;
        that.tableItemListByOrderExtendId(this.$route.query.id);
      });
    },
    /**
     * 新建工单
     */
    async saveJobOrder() {
      const that = this,
            _tableSetsObj = Object.values(that.tableSetsObj) || [],
            _tableItemsObj = Object.values(that.tableItemsObj) || [],
            jobOrderExtendObj = that.jobOrderExtendObj;

      // 文本框校验
      if(!jobOrderExtendObj.busType) {
        that.warn('请选择业务类型！');
        return;
      };
      if(!jobOrderExtendObj.serveType) {
        that.warn('请选择服务类型！');
        return;
      };
      if(!jobOrderExtendObj.dept) {
        that.warn('请选择适用部门！');
        return;
      };
      if(!jobOrderExtendObj.serveType) {
        that.warn('请选择优先级！');
        return;
      };
      if(!jobOrderExtendObj.name) {
        that.warn('工单名称不能为空！');
        return;
      };
      /**
      * 名称校验
      */
     // 名字不能重复，编辑获取的名字不做检验
      if(that.jobOrderExtendObj_name != jobOrderExtendObj.name) {
        let list = await that.request(
          that.api.job_order.jobOrderExtend_validation,
          {
            name:jobOrderExtendObj.name,
            sourceOrderParams:that.jobOrderExtendObj.sourceOrderParams
          }
        );
        if(!list.exist) {
          that.warn(list.msg);
          return;
        };
      };
      if(!jobOrderExtendObj.layout) {
        that.warn('请选择工单排版！');
        return;
      };
      if(!jobOrderExtendObj.sourceOrderParams.sourceOrderType) {
        that.warn('请选择源单编码！');
        return;
      };
      if(that.TableSet_defalut=='请选择') {
        that.warn('请选择具体单源！');
        return;
      };
      if(_tableSetsObj.length === 0) {
        that.warn('请配置流转数据！');
        return;
      };
      let detectionRadio = _tableItemsObj.find(item => {
        return typeof item.isRead != 'number';
      })
      console.log(that.tableItemsObj)
      console.log(_tableItemsObj)
      if(detectionRadio){
          that.warn(`请设置${detectionRadio.itemName}是否可读写！`);
          return;
      };
      // 提交之前深拷贝，删除无用子类
      let tableSetsData = JSON.parse(JSON.stringify(_tableSetsObj));
      let tableItemsData = JSON.parse(JSON.stringify(_tableItemsObj));
      let sourceOrderItem = tableSetsData.find((item, index) => {
        return item.type == 0;
      })
      // 把隐藏项带入tableItemsData
      this.listMapArr.forEach((item, index) => {
        // 如果是主数据则终止
        if(item.type == 0) return;
        let isChecked = item.sublist.some(x => {
          return x.checked == true;
        })
        if(isChecked) {
          let UUID = that.listMapArr_backup[index].sublist.find(x => {
            return x.visible == false;
          });
          if(UUID) tableItemsData.push(UUID);
        }
      });
      console.log(tableItemsData)
      // 删除无用子类
      tableSetsData.forEach((item, index) => {
        delete item.sublist;
      });
      let data = Object.assign(JSON.parse(JSON.stringify(that.jobOrderExtendObj)), {
        tableSets: tableSetsData,
        tableItems: tableItemsData
      });
      console.log(1)
      // return;
      this.request(
        this.api.job_order.jobOrderExtend_update,
        data
      ).then(res=>{
          that.warn('工单编辑成功！','success');
          that.href('workOrder_new_list');
      });
    },
    /**
     * 选择一级菜单
     * @param { Boolean } isChecked 是否选中状态
     * @param { Number } index 父级索引
     * @param { Object } tableSetsObj 当前选中数据集合
     */
    selectParent(isChecked, index, tableSetsObj) {
      const that = this,
            listMapArr = that.listMapArr;

      if (isChecked) {
        // 全选视图逻辑
        listMapArr[index].sublist.forEach((item, i) => {
          item.checked = true;
        });
        listMapArr[index].checkedLength = listMapArr[index].sublist.length;
        // 数据存入父类备份集合
        that.tableSetsObj[index] = tableSetsObj;// 以对象形式存入父类
        // 数据存入子类备份集合
        tableSetsObj.sublist.forEach((subItem, subIndex) => {
          that.tableItemsObj[parseInt(`${index}${subIndex}`)] = subItem;// 以他们的索引拼接为对象名如：00、01、10。为了删除时方便，注意得存入数字类型，下面提交要排序
        });
      } else {
        // 全选视图逻辑
        listMapArr[index].sublist.forEach((item, i) => {
          item.checked = false;
        });
        listMapArr[index].checkedLength = 0;
        // 删除父类备份集合数据
        delete that.tableSetsObj[index];
        // 删除子类备份集合数据
        tableSetsObj.sublist.forEach((subitems, subIndexs) => {
          delete that.tableItemsObj[parseInt(`${index}${subIndexs}`)];
        });
      }
        console.log(that.tableSetsObj);
        console.log(that.tableItemsObj);
    },
    /**
     * 选择二级菜单
     * @param { Boolean } isChecked 是否选中状态
     * @param { Number } index 父级索引
     * @param { Number } indexs 子级索引
     * @param { Object } tableSetsObj 当前选中数据集合
     */
    selectChilder(isChecked, index, indexs, tableSetsObj) {
      const that = this,
            listMapArr = that.listMapArr;
      // 子元素选中计数
      if (isChecked) {
        listMapArr[index].checkedLength++;
        tableSetsObj.sublist[indexs].createTime =new Date().toISOString();
        that.tableSetsObj[index] = tableSetsObj;
        that.tableItemsObj[parseInt(`${index}${indexs}`)] = tableSetsObj.sublist[indexs];
        tableSetsObj.sublist[indexs].checked = isChecked;
      } else {
        listMapArr[index].checkedLength--;
        if(listMapArr[index].checkedLength == 0) {
          delete that.tableSetsObj[index];
        }
        delete that.tableItemsObj[parseInt(`${index}${indexs}`)];
      }
      // 判断子元素是否全部选中
      if (listMapArr[index].checkedLength === listMapArr[index].sublist.length) {
        listMapArr[index].checked = true;
      } else {
        listMapArr[index].checked = false;
      }
      console.log(that.tableSetsObj);
      console.log(that.tableItemsObj);
    },
    /**
     * 控制二级分类显示或者隐藏
     * @param { Number } index 当前索引
     */
    click_isShow(index) {
      const that = this,
            listMapArr = that.listMapArr;

      listMapArr[index].isShow = !listMapArr[index].isShow;
    },
    /**
     * 跳转工单详情
     * @param { String } routeName 路由名称
     */
    href(routeName) {
      this.$router.push({
        path: `/${routeName}`,
        name: routeName
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
     * 模糊搜索
     */
    handleSearch() {},
    /**
     * 搜索重置
     */
    handleResetFilters() {}
  },
  components: {
    codeSet,
    treeDept
  }
};
</script>
<style  lang="less" scoped>
.previewVisible-list{
  display: flex;
  flex-wrap: wrap;
  .item{
      width: 50%;
      margin-right: 0;
      text-align: right;
  }
}
.extend-list{
  display: flex;
  flex-wrap: wrap;
  width: 1150px;
  .item{
    width: 320px;
    text-align: right;
  }
}
i{
  font-style:normal;
}
.colorRed{
  color: red;
  line-height:30px;
}
h5 {
  color: #222;
  margin-left: -15px;
}
.test {
  color: #9d9d9d;
}
.display-flex {
  display: flex;
}
.text-center{
  text-align: center;
}
.justify-content {
  display: flex;
  // justify-content: space-between;
}
.content {
  height: 50px;
  line-height: 50px;
}

.tree {
  width: 1000px;
  border-right: 1px solid #ccc;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  .tree-title{
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    font-size:16px;
  }
  span {
    display: inline-block;
    width: 33%;
    border-bottom: 1px solid #ccc;
  }
  .text-index10 {
    text-indent: 10px;
  }
  .l {
    border-right: 1px solid #ccc;
  }
  .r{
    text-indent: 20px;
  }
}
</style>
