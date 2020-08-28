<style lang="less" scoped >
  @import "../style/contentPublic.less";
  .content-class{
    .btns{padding-bottom: 10px;}
    .table-img{height: 36px;}
    .el-tag{margin-right: 10px;}
    .add-edit  /deep/ .el-input__inner{width: 300px;}
    .add-edit {
      p {line-height: 25px;}
    }
  }
</style>
<template>
  <div class="content-class page-public">
    <div class="page-main">
      <div class="page-main-inner item-margin">
        <div class="btns">
          <el-button type="primary" size="small" @click="itemAdd(true)">新建一级分类</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" row-key="id" :tree-props="tableTreeProps" >
          <el-table-column prop="name" label="内容分类" width="280"></el-table-column>
          <el-table-column prop="_contentType" label="内容类型" width="200"></el-table-column>
          <el-table-column prop="" label="内容封面">
            <template slot-scope="scope">
              <img :src="scope.row.coverUrl" alt="" class="table-img">
            </template>
          </el-table-column>
          <el-table-column prop="_tags" label="分类标签"></el-table-column>
          <el-table-column prop="contentCount" label="文件数"></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="itemEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="itemDel(scope.row)">删除</el-button>
              <el-button type="text" size="small" @click="itemAdd(false, scope.row)">添加子分类</el-button>
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
        <el-form-item label="内容类型" prop="types">
          <el-select v-model="addAndEditFormData.types" multiple placeholder="请选择可发布类型">
            <el-option v-for="item in contentCountListFilter()" :key="item.type" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类标签">
          <el-input v-model="tagsVal" placeholder="请输入分类标签" @keyup.13.native="tagsKeyUp"></el-input>
          <el-tag v-for="(item, index) in addAndEditFormData.tagList" closable @close="tagClose(index)" :key="index">{{ item.name }}</el-tag>
          <p>您可添加标签，标签最多八个字符，按回车键确认。描述越准确，越利于触达兴趣人群。</p>
        </el-form-item>
        <el-form-item label="分类封面">
          <upload-img v-model="addAndEditFormData.coverUrl" v-if="dialogVisible"></upload-img>
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
  import UploadImg from '@/components/editor/UploadImg.vue'
  export default {
    name: 'content_class',
    // 数据
    data() {
      return {
        // 内容类型
        contentCount: {
          4: '文章',
          3: '图集',
          2: '小视频',
          1: '视频'
        },
        contentCountList: [
          {name: '文章', type: '4'},
          {name: '图集', type: '3'},
          {name: '小视频', type: '2'},
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
          tagList: [],
          coverUrl: '',
          contentType: '',
          parentId: '',
          // 自用
          parentName: '',
          types: []
        },
        // 验证
        rules: {
          parentId: [
            { type: 'string',required: true, message: '请选择上级分类', trigger: 'blur' }
          ],
          name: [
            { type: 'string',required: true, message: '请输入分类名称', trigger: 'blur' }
          ],
          types: [
            { type: 'array',required: true, message: '请选择可发布类型', trigger: 'blur' }
          ]
        },
      }
    },
    // 组件
    components: {
      PageTable,
      UploadImg
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
        this.request(this.api.contentCore.category_tree_list, {}).then(data => {
          this.tableDataInit(data)
          this.tableData = data
        });
      },
      tableDataInit(data){
        if(data && data.length){
          data.forEach(items => {
            if(items.children && items.children.length){
              this.tableDataInit(items.children)
            }
            if(items.contentType){
              let type = JSON.parse(items.contentType)
              let typeStr = ''
              type.forEach(item => {
                typeStr += this.contentCount[item] + ','
              })
              items._contentType = typeStr.substring(0, typeStr.length - 1)
            }
            if(items.tagList && items.tagList.length){
              let tagStr = ''
              items.tagList.forEach(item => {
                tagStr += item.name + ','
              })
              items._tags = tagStr.substring(0, tagStr.length - 1)
            }
          })
        }
      },
      // 新增 显示
      itemAdd(flag, row){
        this.checkRow = null
        this.isAddOne = flag
        this.dialogVisible = true
        this.addAndEditFlag = true
        this.$nextTick(()=>{
          this.$refs.form.resetFields()
          this.addAndEditFormData.tagList = []
          this.addAndEditFormData.types = []
          this.tagsVal = ''
          this.addAndEditFormData.coverUrl = ''
          this.addAndEditFormData.id = ''
          // 一级默认父id = 'sys'
          this.addAndEditFormData.parentId = 'sys'
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
          tagList: row.tagList,
          coverUrl: row.coverUrl,
          contentType: '',
          parentId: row.parentId,
          id: row.id,
          // 自用
          parentName: row.parentName,
          types: []
        }
        if(row.contentType){
          let type = JSON.parse(row.contentType)
          this.addAndEditFormData.types = type
        }
        this.dialogVisible = true
        this.addAndEditFlag = false
      },
      // 删除
      itemDel(row){
        this.$confirm('确认删除吗？', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          this.request(this.api.contentCore.content_category_delete, {id: row.id} ).then(data => {
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
              url = this.api.contentCore.content_category_insert
              if(this.isAddOne){
                url = this.api.contentCore.content_category_add
              }
            }else {
              url = this.api.contentCore.content_category_update
            }
            this.addAndEditFormData.contentType = JSON.stringify(this.addAndEditFormData.types)
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
      // 标签
      tagsKeyUp(){
        if(!this.tagsVal) return
        if(this.tagsVal.length > 8){
          this.tagsVal = this.tagsVal.substr(0, 8)
        }
        this.addAndEditFormData.tagList.push({
          name: this.tagsVal
        })
        this.tagsVal = ''
      },
      // 删除标签
      tagClose(index){
        this.addAndEditFormData.tagList.splice(index, 1);
      },
      // 过滤类型
      contentCountListFilter() {
        let ary = []
        if(!this.checkRow){
          return this.contentCountList
        }else{
          let type = JSON.parse(this.checkRow.contentType)
          if(type && type.length){
            for(let i = 0; i < type.length; i++){
              for(let n = 0; n < this.contentCountList.length; n++){
                if(type[i] == this.contentCountList[n].type){
                  ary.push(this.contentCountList[n])
                  break
                }
              }
            }
          }
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
