<template>
  <div class="box">
    <el-dialog :before-close="handleClose" title="分类管理" width="520px" :visible.sync="dialogForm" v-if="dialogForm">
      <el-form :model="ruleForm"  :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="分类名称：" prop="name">
          <el-input placeholder="请填写分类名称，不能超过5个中文" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader :disabled="isEdit" ref="cascader" v-model="ruleForm.parentId" :options="categories_categoriesTreeList_data" :props="{ checkStrictly: true, label: 'name', value: 'id', emitPath: false }" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="缩略图：" prop="storeImgs_list" res="uploadElement">
          <el-upload-img
            v-model="ruleForm.storeImgs_list"
            :EchoDisplayImages="ruleForm.storeImgs_list"
            CatalogName="store"
            :imgApi="imgApi"
            :describe="describe"
            :LssUpimgLimit="LssUpimgLimit"
          ></el-upload-img>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </el-dialog>
    <el-button size="small" type="primary" @click="dialogForm = true">新增分类</el-button>
    <dragTreeTable
      ref="table"
      :data="treeData"
      :onDrag="onTreeDataChange"
      resize
      fixed
      :isdraggable="true">
    </dragTreeTable>
  </div>
  <!-- 列表 -->
</template>

<script>
import ElUploadImg from "../components/el_upload_img_multi";
import codeSet from "@/components/codeSet";
import Sortable from 'sortablejs';
import dragTreeTable from "./lib/dragTreeTable.vue";
import demoDataList from './lib/data';

export default {
  data() {
    return {
      treeData: {
        columns: [],
        lists: []
      },
      dialogForm: false,
      categories_categoriesTreeList_data:[],// 创建分类所用-分类下拉（一二级）
      // 上传图片路径
      imgApi: this.api.content.aLiYun_upload,
      LssUpimgLimit: 1,
      // 上传图片描述
      describe: "图片尺寸为200×200，大小不超过200KB；",
      ruleForm: {
        "merchantId": null,
        "merchantName":null,
        "name": "",
        "parentId":null,
        "parentName":null,
        storeImgs_list:[]
      },
      isEdit:false,
      checkId:null,
      getList_data: [],
      filtersData: {
        pageIndex: 1, // 当前页码
        pageSize: 10, // 每页数量
        orderBy: "",
        "merchantId": ""
      },
      rules:{
        name:[{required:true, validator: (rule, value, callback) => {
          if(!value) {
            callback(new Error('请输入分类名称！'));
          };
          var len = 0;    
          for (var i=0; i< value.length; i++) {    
            if (value.charCodeAt(i)>127 || value.charCodeAt(i)==94) {    
              len += 2;    
            } else {    
              len ++;    
            }    
          }    
          if(len > 10) {
            callback(new Error('限制5个中文、10个字符！'));
          }else{
            callback();
          };
        }, trigger:'change'}],
        storeImgs_list:[{type:'array',required:true,message:'缩略图未上传!',trigger:'change'}]
      }
    };
  },
  created() {
    this.categories_categoriesTreeList();// 创建分类所用-分类下拉（一二级）
    // this.categories_sort();
  },
  mounted(){
      this.$nextTick(() => {
       
      this.categories_getListDTO();// 获取分类
    })
  },
  computed: {
    storeImgs_list() {
      return this.ruleForm.storeImgs_list;
    },
  },
  watch:{
    /**
     * 监听门店图片
     */
    storeImgs_list(value) {
      if(value && value.length > 0) {
        this.$refs.ruleForm.clearValidate('storeImgs_list');
      }else{
        this.$refs.ruleForm.validateField('storeImgs_list');
      }
    },
  },
  methods: {
    onTreeDataChange(list) {
      console.log(list);
      this.treeData.lists = list;
    },
    /**
     * 弹框取消
     */
    handleClose() {
      this.dialogForm = false;
      this.isEdit = false;
      this.checkId = null;
      Object.assign(this.ruleForm, {
        "merchantId": null,
        "merchantName":null,
        "name": "",
        "parentId":null,
        "parentName":null,
        storeImgs_list:[]
      });
    },
    /**
     * 修改
     */
    edit(row) {
      Object.assign(this.ruleForm, row);
      this.isEdit = true;
      this.checkId = row.id;
      row.image && this.ruleForm.storeImgs_list.push({url:row.image});
      this.dialogForm = true;
    },
    /**
     * 获取分类
     */
    categories_getListDTO() {
      const that = this;
    
      this.request(
        this.api.scb.categories_getListDTO,
        this.filtersData,
        true
      ).then(res => {
        var columns = [
          {
            type: "selection",
            title: "分类名称",
            field: "name",
            flex: 1,
            align: "left",
            titleAlign: "left",
            formatter: item => {
              return "<span>" + item.name + "</span>";
            }
          },
          {
            type:'image',
            title: "父分图片",
            field: "image",
            flex: 1,
            align: "center"
          },
          {
            title: "父分类",
            field: "parentName",
            flex: 1,
            align: "center"
          },
          {
            title: "商品数量",
            field: "allQty",
            flex: 1,
            align: "center"
          },
          {
            title: "操作",
            type: "action",
            flex: 1,
            align: "center",
            actions: [
              {
                text: "修改",
                onclick: this.edit,
                formatter: item => {
                  return "<i>修改 </i>";
                }
              },
              {
                text: "查看商品",
                onclick: this.showGoods,
                formatter: item => {
                  return "<i>查看商品</i>";
                }
              },
              {
                text: "删除",
                onclick: this.categories_recursionDelete,
                formatter: item => {
                  return "<i>删除</i>";
                }
              }
            ]
          }
        ];
        res = JSON.parse(JSON.stringify(res).replace(/children/g, 'lists'));
        that.getList_data = res;
        that.treeData = {
          columns: columns,
          lists:res
        };
      });
    },
    /**
     * 查看商品
     */
    showGoods(row) {
      this.href('/goods/goods_list',{ id: row.id });
    },
    /**
     * 拖拽同级切换位置
     */
    categories_sort() {
      const that = this;

      this.request(
        this.api.scb.categories_sort,
        {
          sortVO:[{
            id:'b5aa0bcc-58db-4f08-9211-7120449a20ae',
            sort:1
          },{
            id:'739c39f8-8692-45d7-8517-d182d08728d2',
            sort:2
          },{
            id:'35fdc669-482e-4cce-9103-08ee9cbaca4c',
            sort:3
          }]
        },
        true
      ).then(res => {
        
      });
    },
    /**
     * 保存分类
     */
    save() {
      const that = this;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let cascader = that.$refs.cascader;
          let cascaderValue = cascader.inputValue;
          if(cascaderValue){
            let isHave = cascaderValue.indexOf('/');
            that.ruleForm.parentName = isHave != -1 ? cascaderValue.split('/')[1] : cascaderValue;
            that.ruleForm.parentName = that.ruleForm.parentName.replace(/^\s*|\s*$/g,'');
          }
          that.ruleForm.image = that.ruleForm.storeImgs_list[0].url;

          if(this.checkId) {
            Object.assign(this.ruleForm, {
              id:this.checkId
            });
          };
          let url = this.checkId ? that.api.scb.categories_updateSelective : that.api.scb.categories_create;

          that.request(
            url,
            that.ruleForm,
            true
          ).then(res => {
            Object.assign(this.ruleForm, {
              "merchantId": null,
              "merchantName":null,
              "name": "",
              "parentId":null,
              "parentName":null,
              storeImgs_list:[]
            });
            that.warn('新建成功!');
            that.categories_categoriesTreeList();
            that.categories_getListDTO();
            that.dialogForm = false;
            this.isEdit = false;
            this.checkId = null;
          });
        }
      });
    },
    /**
     * 创建分类所用-分类下拉（一二级）
     */
    categories_categoriesTreeList() {
      const that = this;

      this.request(
        this.api.scb.categories_categoriesTreeList,
        this.filtersData,
        true
      ).then(res => {
        that.categories_categoriesTreeList_data = res;
      });
    },
    /**
     * 删除分类
     */
    categories_recursionDelete(obj) {
      var that = this;
      this.$confirm('删除后会解除商品与该分类的关系，本操作不可恢复，确认删除分类吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        that.request(
          that.api.scb.categories_recursionDelete,
          {
            id:obj.id
          },
          true
        ).then(res => {
          that.warn('删除成功！');
          that.categories_getListDTO();
          that.categories_categoriesTreeList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    /**
     * 提示
     * @param { String } message 提示文案
     * @param { String } type 提示类型
     */
    warn(message, type) {
      this.$message({
        message: message,
        type: type || "success"
      });
    },
   /**
     * 路由跳转
     * @param { String } routeName 路由路径
     * @param { Object } param 路由参数
     */
    href(routeName, param) {
      let module = '/' + this.$route.path.split('/')[1];
      this.$router.push({
        path: module + routeName,
        query: param
      });
    },
    /**
     * 模糊搜索
     */
    handleSearch() {
      this.filtersData.pageIndex = 1;
      this.getData();
    },
    /**
     * 搜索重置
     */
    handleResetFilters() {
      Object.assign(this.filtersData, {
        pageIndex: 1, // 当前页码
        pageSize: 10 // 每页数量
      });
    },
    /**
     * 点击页数
     * @param { Number } pageIndex 当前页
     */
    handleCurrentChange(pageIndex) {
      this.filtersData.pageIndex = pageIndex;
      this.getData();
    },
    /**
     *  选择每页多少条数
     *  @param { Number } pageSize 每页条数
     */
    handleSizeChange(pageSize) {
      this.filtersData.pageSize = pageSize;
      this.getData();
    }
  },
  components: {
    ElUploadImg,
    codeSet,
    dragTreeTable
  }
};
</script>
<style  lang="less" scoped>
.box {
  padding: 20px;
  margin: 8px 8px 20px 8px;
  background: #fff;
}
.el-input /deep/ .el-input__inner {
  width: 198px;
}
.image{
  width: 45px;
  height: 45px;
}
.drag-tree-table-body /deep/.action-item{
  margin-left: 10px;
}
</style>