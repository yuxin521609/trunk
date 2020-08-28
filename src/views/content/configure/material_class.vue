<style lang="less" scoped >
  @import "../style/contentPublic.less";
  .material-class{
    .btns{padding-bottom: 10px;}
    .table-img{height: 36px;}
    .el-tag{margin-right: 10px;}
    .add-edit  /deep/ .el-input__inner{width: 200px;}
  }
</style>
<template>
  <div class="material-class page-public">
    <div class="page-main">
      <div class="page-main-inner item-margin">
        <div class="btns">
          <el-button type="primary" size="small" @click="itemAdd(true)">新建一级分类</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" row-key="id" :tree-props="tableTreeProps" >
          <el-table-column prop="name" label="素材分类" width="280"></el-table-column>
          <el-table-column prop="_contentType" label="素材类型" width="200">
            <template slot-scope="scope">
              {{ scope.row.sourceType === 2 ? '图片' : '视频' }}
            </template>
          </el-table-column>
          <el-table-column prop="sourceCount" label="文件数"></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="itemEdit(scope.row)" v-if="scope.row.status !== 5">编辑</el-button>
              <el-button type="text" size="small" @click="itemDel(scope.row)" v-if="scope.row.status !== 5">删除</el-button>
              <el-button type="text" size="small" @click="itemAdd(false, scope.row)" v-if="scope.row.status !== 5">添加子分类</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--新增和编辑-->
    <el-dialog :title="addAndEditFlag ? '新增' : '编辑'" :visible.sync="dialogVisible" width="30%" class="add-edit">
      <el-form ref="form" :model="addAndEditFormData" label-width="80px" :rules="rules">
        <el-form-item label="上级分类" prop="parentId" v-if="!isAddOne">
          <el-input v-model="addAndEditFormData.parentName" placeholder="" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addAndEditFormData.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="内容类型" prop="sourceType">
          <el-select v-model="addAndEditFormData.sourceType" placeholder="请选择素材类型" v-if="dialogVisible">
            <el-option v-for="item in materialTypeListFilter()" :key="item.type" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addAndEditSub" size="small">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import PageTable from '@/views/content/components/PageTable.vue'
  export default {
    name: 'material_class',
    // 数据
    data() {
      return {
        // 内容类型
        materialType: {
          2: '图片',
          1: '视频'
        },
        materialTypeList: [
          {name: '图片', type: '2'},
          {name: '视频', type: '1'}
        ],
        // 表格数据
        tableData: [],
        // 表格映射
        tableTreeProps: {
          children: 'children',
          hasChildren: 'hasChildren'
        },

        // 新增和编辑
        // 是否新增一级
        isAddOne: false,
        // 新增子类时的父row
        checkRow: null,
        // 标签
        tagsVal: '',
        dialogVisible: false,
        addAndEditFlag: true,
        addAndEditFormData: {
          name: '',
          sourceType: '',
          parentId: '',
          // 自用
          parentName: ''
        },
        // 验证
        rules: {
          parentId: [
            { type: 'string',required: true, message: '请选择上级分类', trigger: 'blur' }
          ],
          name: [
            { type: 'string',required: true, message: '请输入分类名称', trigger: 'blur' }
          ],
          sourceType: [
            { type: 'string',required: true, message: '请选择素材类型', trigger: 'blur' }
          ]
        },
      }
    },
    // 组件
    components: {
      PageTable
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getData()
      })
    },
    // 方法
    methods: {
      // 获取数据
      getData(){
        this.request(this.api.contentCore.source_category_tree_list, {}).then(data => {
          this.tableData = data
        });
      },
      // 新增 显示
      itemAdd(flag, row){
        this.checkRow = null
        this.isAddOne = flag
        this.dialogVisible = true
        this.addAndEditFlag = true
        this.$nextTick(()=>{
          this.addAndEditFormData = {
            name: '',
            sourceType: '',
            // 一级默认父id = 'sys'
            parentId: 'sys',
            id: '',
            // 自用
            parentName: ''
          }
          if(!flag){
            this.checkRow = row
            this.addAndEditFormData.parentId = row.id
            this.addAndEditFormData.parentName = row.name
          }
        })


      },
      // 编辑 显示
      itemEdit(row){
        // 判断是否是一级
        if(row.parentId === 'sys'){
          this.isAddOne = true
        }
        this.tagsVal =  ''
        this.addAndEditFormData = {
          name: row.name,
          sourceType: row.sourceType.toString(),
          parentId: row.parentId,
          parentName: row.parentName,
          id: row.id,
        }
        this.dialogVisible = true
        this.addAndEditFlag = false
      },
      // 删除
      itemDel(row){
        if(row.sourceCount > 0){
          this.$notify.error({ title: '错误',message: '文件数为0时才可删除'})
          return
        }
        this.$confirm('确认删除吗？', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          this.request(this.api.contentCore.source_category_delete, {id: row.id} ).then(data => {
            this.$notify.success({ title: '成功',message: '删除成功'})
            this.getData()
          });
        }).catch(() => {
        });
      },
      // 新增编辑提交
      addAndEditSub(flag){
        let url
        this.$refs.form.validate((valid) => {
          if (valid) {
            if(this.addAndEditFlag){
              url = this.api.contentCore.source_category_insert
              if(this.isAddOne){
                url = this.api.contentCore.source_category_add
              }
            }else {
              url = this.api.contentCore.source_category_update
            }
            this.request(url, this.addAndEditFormData).then(data => {
              if(this.addAndEditFlag){
                this.$notify.success({ title: '成功',message: '新增成功'})
              }else{
                this.$notify.success({ title: '成功',message: '编辑成功'})
              }
              this.dialogVisible = false
              this.getData()
            });
          } else {
            return false;
          }
        });

      },
      // 过滤类型
      materialTypeListFilter() {
        let ary
        if(!this.checkRow){
          return this.materialTypeList
        }else{
          ary = this.materialTypeList.filter(item => item.type == this.checkRow.sourceType)
          return  ary
        }
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {

    }
  }
</script>
