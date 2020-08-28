<!--
 * @Author: elephant
 * @Date: 2019-11-06 11:39:47
 * @LastEditTime: 2019-11-15 14:58:58
 * @LastEditors: your name
 * @Description: 颜色属性维护
 * @
 -->
<template>
  <div class="item-margin color-box">
    <!-- 左侧色系 -->
    <div class="color-left">
      <div class="color-top">
        <span>色系</span>
        <el-button size="mini" @click="addColorSeries" type="primary">新增</el-button>
      </div>
       <el-form
          :model="colorSeriesForm"
          size="small"
          ref="colorSeriesFormRef"
          inline
          :inline-message="true"
        >
      <el-table
        @row-click="colorSeriesRowClick"
        class="color-series"
        :data="colorSeriesForm.colorSeriesData"
        key="colorSeriesData"
        stripe
        v-loading="colorSeriesLoading"
        empty-text="暂无数据"
        header-align="center"
        header-row-class-name="item-table-header"
        :highlight-current-row="true"
        height="750"
        ref="seriesTableRef"
      >
        <el-table-column prop="name" align="left" label="色系名称">
          <template slot-scope="scope">
            <el-form-item
                :prop="'colorSeriesData.' + scope.$index + '.name'"
                 :rules="[
                  { required: true, message: '请输入色系名称',trigger: 'blur'},
                  { min: 1, max: 10, message: '最长不超过10个字符', trigger: 'blur' }
                ]"
              >
            <el-input
              data-type="noTrigger" 
              v-if="scope.row._edit"
              @blur="colorSeriesBlur(scope.row)"
              class="color-series-input"
              v-model="scope.row.name"
            ></el-input>
            <p v-else >{{scope.row.name}}</p>
           </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="text-center"
          class-name="text-center"
          align="right"
          width="100"
        >
          <template slot-scope="scope">
            <i class="el-icon-edit nav-i" data-type="noTrigger" @click="editColorSeries(scope.row)"></i>
            <i class="el-icon-delete nav-i" data-type="noTrigger"  @click="deleteColorSeries(scope)"></i>
          </template>
        </el-table-column>
      </el-table>
       </el-form>
    </div>
    <!-- 左侧色系END -->
    <!-- 右侧颜色 -->
    <div v-if="colorIsShow" class="color-right">
      <div class="color-top">
        <span>关联颜色</span>
        <el-button size="mini" @click="addColor" type="primary">新增</el-button>
      </div>
       <el-form
          :model="colorForm"
          size="small"
          ref="colorFormRef"
          inline
          :inline-message="true"
        >
      <el-table
        class="color"
        :data="colorForm.colorData"
        v-loading="colorLoading"
        stripe
        empty-text="暂无数据"
        header-align="center"
        header-row-class-name="item-table-header"
        :highlight-current-row="true"
         height="750"
        ref="colorTableRef"
      >
        <el-table-column prop="name" align="left" label="颜色名称">
          <template slot-scope="scope">
             <el-form-item
                :prop="'colorData.' + scope.$index + '.name'"
                 :rules="[
                  { required: true, message: '请输入颜色名称',trigger: 'blur'},
                  { min: 1, max: 10, message: '最长不超过10个字符', trigger: 'blur' }
                ]"
              >
            <el-input
              v-show="scope.row._edit"
              class="color-series-input"
              v-model="scope.row.name"
            ></el-input>
            <p v-show="!scope.row._edit">{{scope.row.name}}</p>
             </el-form-item>
          </template>
        </el-table-column>
         <el-table-column prop="code" align="left" label="颜色编码">
          <template slot-scope="scope">
             <el-form-item
                :prop="'colorData.' + scope.$index + '.code'"
                 :rules="[
                  { required: true, message: '请输入颜色编码',trigger: 'blur'},
                  {validator: validateColorCode, trigger: 'blur' }
                ]"
              >
            <el-input
              v-show="scope.row._edit"
              class="color-series-input"
              v-model="scope.row.code"
            ></el-input>
            <p v-show="!scope.row._edit">{{scope.row.code}}</p>
             </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="text-center"
          class-name="text-center"
          align="right"
          width="100"
        >
          <template slot-scope="scope">
             <el-button @click="editOrSubmitColor(scope.row)" type="text" size="mini">{{!!scope.row._edit?'保存':'编辑'}}</el-button>
             <el-button @click="deleteColor(scope)" type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-form>
    </div>
    <!-- 右侧颜色 END-->
  </div>
</template>
<script>
let mirrorColorSeriesData =[];
import { validateColorCode } from "@/utils/validate";
export default {
  data() {
    return {
      //颜色Code 验证
      validateColorCode:validateColorCode,
      colorSeriesForm:{
        colorSeriesData: []
      },

      colorIsShow:false,
      colorForm:{
        colorData:[],
      },
      colorSeriesLoading:false,
      colorLoading:false,
      colorSeriesId:'',
      colorSeriesValidate:true,
    };
  },
  created() {
    //获取色系
    this.getColorSeriesData('init');
  },
  methods: {
    //获取色系列表
    getColorSeriesData(type) {
      this.colorSeriesLoading=true;
      this.request(this.api.product.colorSeries_list, {},true).then(res => {
        let _data = res.data;
        for (let i = 0; i < _data.length; i++) {
          _data[i]._edit = false;
        }
        if(_data.length > 0 && type == 'init'){
          this.colorIsShow=true;
          this.colorSeriesId=_data[0].id;
          this.getColorData();
        }
        mirrorColorSeriesData=this.$common.deepCopy(_data);
        this.colorSeriesForm.colorSeriesData = _data;
        this.colorSeriesLoading=false;
        this.$refs['colorSeriesFormRef'].clearValidate();
      });
    },
    //获取颜色
    getColorData(){
        this.colorLoading=true;
       this.request(this.api.product.color_list, {seriesId:this.colorSeriesId},true)
       .then(res => {
        let _data = res.data;
        for (let i = 0; i < _data.length; i++) {
          _data[i]._edit = false;
        }
        this.colorForm.colorData=_data;
        this.colorLoading=false;
       })
    },
    //色系被点击
    colorSeriesRowClick(row,column, event){
      if(!this.colorSeriesValidate){
        return
      }
      let attrType=event.target.getAttribute('data-type');
      if(attrType != 'noTrigger'){
        if(!!row.id){
          this.colorSeriesId=row.id;
          this.getColorData();
        }
      }
    },
    //色系修改
    editColorSeries(row) {
      row._edit = true;
    },
    //色系删除
    deleteColorSeries(scope) {
      if(!!scope.row.id){
        this.request(this.api.product.colorSeries_delete, { id: scope.row.id }).then(
          res => {
            this.$message.success("删除成功！");
            this.removeObj(this.colorSeriesForm.colorSeriesData,scope.row.id);
          }
        );
      }else{
         this.colorSeriesForm.colorSeriesData.splice(scope.$index, 1);
      }
    },
    //色系失去焦点
    colorSeriesBlur(row) {
      let colorSeriesData = this.colorSeriesForm.colorSeriesData;
      let flag = true;
      if(!row.name.replace(/\s*/g, "")){
        this.$message.error("请输入色系！");
        return
      }
      //检查重复
      for (let i = 0; i < colorSeriesData.length; i++) {
        if (colorSeriesData[i].id != row.id && colorSeriesData[i].name.replace(/\s*/g, "") == row.name.replace(/\s*/g, "")){
          flag = false;
          break;
        }
      }
      if (!flag) {
        this.$message.error("已有相同色系！");
        return
      }
       //根据镜像判断是否修改了字段修改了才提交
      for (let i = 0; i < mirrorColorSeriesData.length; i++) {
        if(mirrorColorSeriesData[i].name.replace(/\s*/g, "") == row.name.replace(/\s*/g, "") && row.id != null){
          row._edit=false;
          this.handleColorSeriesValidateError();
          return
        }
      }
      if (flag) {
        this.colorSeriesSubmit(row);
      }
    },
    //色系保存
    colorSeriesSubmit(params) {
      this.$refs['colorSeriesFormRef'].validate(valid => {
        if (valid) {
          this.request(this.api.product.colorSeries_save, params).then(res => {
            params._edit = false;
            this.$message.success("保存成功");
            this.getColorSeriesData();
            this.handleColorSeriesValidateError();
          });
        }else{
          this.handleColorSeriesValidateError();
          this.$message.error("规则验证不通过");
        }
      });
    },
    //点击新增色系
    addColorSeries() {
      this.handleEmptyColor(this.colorSeriesForm.colorSeriesData,'colorSeries');
      this.$nextTick(() => {
         this.tableScrollTop('seriesTableRef',this.colorSeriesForm.colorSeriesData)
      })
     
    },
    //点击新增颜色
    addColor(){
      this.handleEmptyColor(this.colorForm.colorData,'color');
      this.$nextTick(() => {
         this.tableScrollTop('colorTableRef',this.colorForm.colorData)
      })
    },
    //点击新增时跳到指定位置
    tableScrollTop(_ref,_data){
      let tableData=_data;
      let _el=null;
      if(_ref == 'seriesTableRef'){
        _el=this.$refs.seriesTableRef;
      }else{
        _el=this.$refs.colorTableRef;
      }
       _el.setCurrentRow(tableData[tableData.length - 1])
      const targetTop = _el.$el.querySelectorAll('.el-table__body tr')[tableData.length -1 ].getBoundingClientRect().top;
      const containerTop = _el.$el.querySelector('.el-table__body').getBoundingClientRect().top;
      const scrollParent = _el.$el.querySelector('.el-table__body-wrapper');
      scrollParent.scrollTop = targetTop - containerTop;
    },
    //编辑或保存颜色
    editOrSubmitColor(params){
      //params._edit=!params._edit;
      if(!!params._edit){
        this.$refs['colorFormRef'].validate(valid => {
         if (valid) {
           params.seriesId=this.colorSeriesId;
           this.request(this.api.product.color_save, params).then(res => {
             params._edit = false;
             this.$message.success("保存成功");
             this.getColorData();
           });
         }else{
           this.$message.error("规则验证不通过");
         }
       });
      }else{
        params._edit=true;
      }
    },
    //删除颜色
    deleteColor(scope){
      if(!!scope.row.id){
        this.request(this.api.product.color_delete, { id: scope.row.id }).then(
          res => {
            this.$message.success("删除成功！");
            this.removeObj(this.colorForm.colorData,scope.row.id);
          }
        );
      }else{
         this.colorForm.colorData.splice(scope.$index, 1);
      }
    },
    /**
     * @Date: 2019-11-07 17:02:03
     * @description: 增加延时 处理色系失去焦点时
     * 点击列表 触发右侧列表联动
     * @author: element
     * @param {type} 
     * @return: 
     */
    handleColorSeriesValidateError(){
      this.colorSeriesValidate=false;
      setTimeout(() => {
        this.colorSeriesValidate=true;
      }, 2000);
    },
    /**
     * @Date: 2019-11-07 15:36:02
     * @description: 处理空颜色和色系  有就提示 无增加
     * @author: elephant
     * @param {_arr,type}  _arr 数据源 type 区分色系和颜色
     * @return: 
     */   
    handleEmptyColor(_arr,type){
      let flag = true;
      for (let i = 0; i < _arr.length; i++) {
        if (_arr[i].id == null) {
          flag = false;
          break;
        }
      }
      if (flag) {
        let obj = {
          name: "",
          _edit: true
        };
        if(type == 'color'){
          obj.code="";
        }
        _arr.push(obj);
      } else {
         if(type == 'color'){
           this.$message.error("当前颜色未保存！");
         }else{
           this.$message.error("当前色系未保存！");
         }
      }
    },
    /**
     * @Date: 2019-11-07 11:48:28
     * @description: 删除数组中的某一个对象
     * @author: elephant
     * @param {_arr,_obj} 数组 需删除的对象
     * @return: //返回删除后剩余的数组
     */
    removeObj(_arr, _obj) {
      var length = _arr.length;
      for (var i = 0; i < length; i++) {
        if (_arr[i].id == _obj) {
          if (i == 0) {
            _arr.shift(); //删除并返回数组的第一个元素
            return _arr;
          } else if (i == length - 1) {
            _arr.pop(); //删除并返回数组的最后一个元素
            return _arr;
          } else {
            _arr.splice(i, 1); //删除下标为i的元素
            return _arr;
          }
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.color-box {
  display: flex;
  justify-content: space-between;
  .color-left {
    min-width: 400px;
    width: 400px;
    margin-right: 10px;
    background-color: #ffffff;
    padding: 10px;
  }
  .color-right {
    flex: 1;
    background-color: #ffffff;
    padding: 10px;
  }
}
.color-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid #eeeeee;
}
.color-box /deep/ .nav-i {
  margin: 0 8px;
  cursor: pointer;
  display: none;
}
.color-series /deep/ .el-table__row:hover .nav-i {
  display: inline-block;
}
.color-box /deep/ .el-form-item {
  margin-bottom: 0;
}
</style>