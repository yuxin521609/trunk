<style lang="less" scoped>
  @import "../style/contentPublic.less";
  .mini-program{
    .page-main{display:flex;
      .side {width: 240px;padding: 20px;margin-right: 0;background: #fff;}
      .list-table{flex:1;background: 100%;background: #fff;padding: 24px;
        .table-img{height: 30px;max-width: 200px;}
      }
      .check-link-list{
        span{margin-left: 20px;}
      }
      .item-margin{
        margin-top: 0;
      }
    }
  }

</style>
<template>
  <div class="mini-program page-public">
    <div class="page-main">
      <!--侧边-->
      <div class="side item-margin">
        <h4>运营模块</h4>
        <el-tree ref="sideTree" :data="sideData" :props="sideDataProps" :default-expand-all="true" :expand-on-click-node="false" highlight-current node-key="id" @node-click="sideDataClick"></el-tree>
      </div>
      <!--表格-->
      <div class="list-table item-margin">
        <div class="page-main-btns">
          <el-button type="primary" size="small"  @click="addAndEdit(true)">新增</el-button>
        </div>
        <el-table :data="tableData" ref="dragTable" style="width: 100%"  row-key="id">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <div v-if="checkSideRow.relationType === 0" >
            <el-table-column label="图片">
              <template slot-scope="scope">
                <img :src="scope.row.coverUrl" alt="" class="table-img" v-if="scope.row.coverUrl">
              </template>
            </el-table-column>
            <el-table-column label="跳转类型">
              <template slot-scope="scope">
                {{ scope.row.linkType ? linkType[scope.row.linkType] : ''}}
              </template>
            </el-table-column>
            <el-table-column  prop="_linkInfo" label="关联内容"></el-table-column>
          </div>
          <el-table-column prop="conCatName" label="关联内容分类"  v-if="checkSideRow.relationType === 1"></el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addAndEdit(false, scope.row)">编辑</el-button>
              <el-button type="text" size="small"  @click="delTableItem(scope.row.id)">删除</el-button>
              <el-button type="text" size="small">移动</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--新增和编辑-->
      <el-dialog :title="addAndEditFlag ? '新增' : '编辑'" :visible.sync="dialogVisible" width="40%">
        <el-form ref="form" :model="addAndEditFormData" label-width="80px" :rules="rules" v-if="checkSideRow.relationType === 0" :key="checkSideRow.relationType">
          <el-form-item label="轮播图" prop="coverUrl">
            <upload-img v-model="addAndEditFormData.coverUrl" :content-txt="'点击上传'"></upload-img>
          </el-form-item>
          <el-form-item label="选择链接" prop="checkLinkList" class="small-input">
            <el-button type="primary" size="small" @click="getLink" v-if="!addAndEditFormData.checkLinkList.length">新增</el-button>
            <div v-for="item in addAndEditFormData.checkLinkList" class="check-link-list">{{item.linkTypeName}} 》 {{ item.detailsTypeName }} 》 {{ item.title }} <span><el-button type="text" size="small" @click="getLink">更换</el-button></span> </div>
            <p v-show="!addAndEditFormData.checkLinkList.length">{{ addAndEditFormData.noContent }}</p>
          </el-form-item>
        </el-form>
        <el-form ref="categoryForm" :model="addAndEditCategoryFormData" label-width="80px" :rules="categoryRules"  v-if="checkSideRow.relationType === 1"  :key="checkSideRow.relationType">
          <el-form-item label="分类" prop="categoryTreeValue">
            <el-cascader :options="categoryTreeList" v-model="addAndEditCategoryFormData.categoryTreeValue" :props="categoryTreeListProps">
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addAndEditSub" size="small">确 定</el-button>
        </span>
      </el-dialog>
      <link-dialog ref="LinkDialog" :check-link-list="addAndEditFormData.checkLinkList"></link-dialog>
    </div>
  </div>
</template>
<script>
  import UploadImg from '@/components/editor/UploadImg.vue'
  import LinkDialog from '@/views/content/operate/components/LinkDialog.vue'
  import Sortable from 'sortablejs'
  export default {
    name: 'mini_program',
    // 数据
    data() {
      return {
        // 左侧数据
        sideData: [],
        // 选中的行
        checkSideRow: {},
        // 左侧数据映射
        sideDataProps: {
          children: 'children',
          label: 'name'
        },
        // 表格数据
        tableData:[],
        // 链接类型
        linkType: {
          1: '内容链接',
          2: '商品链接',
          3: '外部链接'
        },
        detailsType: {
          1: '视频',
          2: '小视频',
          3: '图集',
          4: '文章',
          5: '定制单品',
          6: '定制套装',
          7: '标准商品'
        },
        // 新增和编辑
        // 是否显示
        dialogVisible: false,
        // 编辑的行
        checkTableRow: {},
        // 编辑还是新增  新增 true  编辑false
        addAndEditFlag: true,
        // 首页banner
        // 编辑新增提交的表单
        addAndEditFormData: {
          id: '',
          coverUrl: '',
          // 选中的链接
          checkLinkList: [],
        },
        // 验证
        rules: {
          coverUrl: [
            { type: 'string',required: true, message: '请上传轮播图', trigger: 'blur' }
          ],
          checkLinkList: [
            { type: 'array',required: true, message: '请选择关联', trigger: 'change' }
          ]
        },
        /**
         * 如果不是首页banner
         */
        // 分类选择验证
        categoryRules: {
          categoryTreeValue: [
            { type: 'array',required: true, message: '请选择分类', trigger: 'change' }
          ]
        },
        // 选中的分类
        addAndEditCategoryFormData: {
          categoryTreeValue: []
        },
        // 分类数据
        categoryTreeList: [],
        // 分类映射
        categoryTreeListProps:{
          value: '_flag',
          label: 'name',
          children: 'children',
        }
      }
    },
    // 组件
    components: {
      UploadImg,
      LinkDialog
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        // 获取左侧数据
        this.getSideData()
        // 初始行拖拽
        this.rowDrop()
      })
    },
    // keepAlive 页面显示时
    activated() {
      this.getTableData();
    },
    // 方法
    methods: {
      // 获取左侧数据
      getSideData() {
        this.request(this.api.contentCore.module_tree_list, {}).then(data => {
          if(data && data.length){
            this.sideData =  data
            // 获取默认选中的
            this.$nextTick(() => {
              const row = data[0].children[0]
              this.checkSideRow = row
              this.$refs.sideTree.setCurrentKey(row.id)
              this.getTableData(row)
            })
          }
        });
      },
      // 获取表格数据
      getTableData(row) {
        this.request(this.api.contentCore.manage_list, {modelId: row.id, orderBy: 'sort', relationType: row.relationType }).then(data => {
          if(data.data && data.data.length){
            data.data.forEach(item => {
              if(item.linkType == 1 && item.contentPasses && item.contentPasses.length > 0){
                item._linkInfo = this.detailsType[item.detailsType] + ' 》 ' + item.contentPasses[0].title
              }else if(item.productName && item.linkType == 2 ){
                item._linkInfo = this.detailsType[item.detailsType] + ' 》 ' + item.productName
              }else if(item.url && item.linkType == 3 ){
                item._linkInfo = item.url
              }else {
                item._linkInfo = '关联的'+ this.detailsType[item.detailsType] + '不存在或已下线'
              }
            })
          }
          this.tableData =  data.data
        });
      },
      // 表格行删除
      delTableItem(id){
        this.$confirm('确认删除吗？', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          this.request(this.api.contentCore.manage_delete, {id: id}).then(data => {
            this.$notify.success({ title: '成功',message: '删除成功'})
            this.getTableData(this.checkSideRow)
          });
        }).catch(() => {
        });

      },
      // 左侧数据行点击
      sideDataClick(row, node, tree){
        if( row.level > 1){
          this.checkSideRow = row
          this.getTableData(row)
        }
      },
      // 表格行拖拽
      rowDrop() {
        const tbody = this.$refs.dragTable.$el.querySelector('.el-table__body-wrapper > table > tbody')
        const _this = this
        Sortable.create(tbody, {
          onEnd({ newIndex, oldIndex }) {
            if(newIndex === oldIndex) return
            const currRow = _this.tableData.splice(oldIndex, 1)[0]
            _this.tableData.splice(newIndex, 0, currRow)
            let listData = _this.tableData.map((item,index) => {
              return {
                id: item.id,
                sort: ++index
              }
            })
            _this.request(_this.api.contentCore.manage_move, listData).then(data => {
              _this.$notify.success({ title: '成功',message: '移动成功'})
            });

          }
        })
      },
      // 新增和编辑显示
      addAndEdit(flag,row){

        if(flag){
          if(this.checkSideRow.relationType === 0){
            this.addAndEditFormData = {
              coverUrl: '',
              noContent: '',
              checkLinkList: []
            }
          }
          if(this.checkSideRow.relationType === 1){
            this.addAndEditCategoryFormData = {
              categoryTreeValue : []
            }
            this.getCategoryTreeList()
          }
        }else {
          if(this.checkSideRow.relationType === 0){
            // 内容
            if(row.linkType == 1 && row.contentPasses && row.contentPasses.length > 0){
              this.addAndEditFormData = {
                checkLinkList: [{
                  title: row.contentPasses[0].title,
                  url: row.url,
                  linkType: row.linkType,
                  linkTypeName: this.linkType[row.linkType],
                  detailsType: row.detailsType,
                  detailsTypeName: this.detailsType[row.detailsType]
                }],
                coverUrl: row.coverUrl,
                id: row.id
              }
              // 商品
            }else if(row.linkType == 2 && row.productName){
              this.addAndEditFormData = {
                checkLinkList: [{
                  title: row.productName,
                  url: row.url,
                  linkType: row.linkType,
                  linkTypeName: this.linkType[row.linkType],
                  detailsType: row.detailsType,
                  detailsTypeName: this.detailsType[row.detailsType]
                }],
                coverUrl: row.coverUrl,
                id: row.id
              }

              // 则为链接
            }else if(row.linkType == 1 && row.url){

            }else{
              this.addAndEditFormData = {
                checkLinkList: [],
                noContent: `关联的${this.detailsType[row.detailsType]}不存在或已下线`,
                coverUrl: row.coverUrl
              }
            }
          }
          if(this.checkSideRow.relationType === 1){
            this.checkTableRow = row
            let check = [row.identifier]
            if(row.identifier.indexOf('$') > -1){
              check = row.identifier.split('$')
            }
            this.addAndEditCategoryFormData.categoryTreeValue = check
            this.getCategoryTreeList()
          }
        }
        this.addAndEditFlag = flag
        this.dialogVisible = true
      },
      // 获取链接关联
      getLink(){
        this.$refs.LinkDialog.linkDialog = true
        this.$refs.LinkDialog.init()
      },
      // 新增编辑提交
      addAndEditSub(){
        // 新增url
        let url
        if(!this.addAndEditFlag){
          // 编辑url
          url = this.api.contentCore.manage_edit
        }else {
          // 新增 url
          url = this.api.contentCore.manage_save
        }
        // relationType  0 首页banner   1  其他
        if(this.checkSideRow.relationType === 0){
          this.$refs.form.validate((valid) => {
            if (valid) {
              let params = this.addAndEditFormData.checkLinkList[0]
              params.coverUrl = this.addAndEditFormData.coverUrl
              params.id = this.addAndEditFormData.id
              this.addAndEditSubSend(url, params)
            } else {
              return false;
            }
          });
        }
        if(this.checkSideRow.relationType === 1){
          this.$refs.categoryForm.validate((valid) => {
            if (valid && this.addAndEditCategoryFormData.categoryTreeValue.length) {
              const ary = this.addAndEditCategoryFormData.categoryTreeValue[this.addAndEditCategoryFormData.categoryTreeValue.length-1].split('&')
              const formData = {
                conCatId: ary[0],
                conCatName: ary[1],
                coverUrl: ary[2],
                identifier: this.addAndEditCategoryFormData.categoryTreeValue.join('$'),
                id: this.checkTableRow.id
              }
              this.addAndEditSubSend(url, formData)
            } else {
              return false;
            }
          });

        }



      },
      addAndEditSubSend(url, formData){
        // 左侧菜单id
        formData.modelId = this.checkSideRow.id
        this.request(url, formData).then(data => {
          let msg = this.addAndEditFlag ? '新增成功' : '编辑成功'
          this.$notify.success({ title: '成功',message: msg})
          // 删除完初始化表格数据
          this.getTableData(this.checkSideRow)
          this.dialogVisible = false
        })
      },
      // 获取分类tree
      getCategoryTreeList(){
        this.request(this.api.contentCore.category_tree_list, {}).then(data => {
          if(data && data.length){
            // 初始化数据
            this.categoryTreeListInit(data)
            this.categoryTreeList = data
          }
        });
      },
      // 初始数据
      categoryTreeListInit(data){
    if(data && data.length){
      data.forEach((item)=>{
        item._flag = item.id +'&'+ item.name + '&'+item.coverUrl
        if(item.children){
          if(item.children.length === 0){
            delete item.children
          }else {
            this.categoryTreeListInit(item.children)
          }
        }
      })
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
