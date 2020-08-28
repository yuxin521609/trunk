<style lang="less" scoped>
  @import "../style/contentPublic.less";
  .mini-program{
    .page-main{display:flex;
      .side {width: 240px;padding: 20px;margin-right: 0;background: #fff;}
      .list-table{flex:1;width: 100%;background: #fff;padding: 24px;
        .table-img{height: 30px;max-width: 200px;}
        .item-margin{ margin-top: 0; }
      }
      .check-link-list{
        span{margin-left: 20px;}
      }
      .enterprise{background: #fff;flex:1;padding-bottom: 20px;
        .item-cont{ padding-bottom: 0; }
        .no-content{height: 60px;line-height: 60px;border-bottom: 1px solid #e6e6e6;border-top: 1px solid #e6e6e6;text-align: center;color: #909399;}
        .editor{width: 600px;}
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
      <div v-if="checkSideRow.id == 1" class="list-table item-margin">
        <div class="page-main-btns">
          <el-button type="primary" size="small"  @click="addAndEdit(true)">新增</el-button>
        </div>
        <el-table :data="tableData" ref="dragTable" style="width: 100%"  row-key="id">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
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
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addAndEdit(false, scope.row)">编辑</el-button>
              <el-button type="text" size="small"  @click="delTableItem(scope.row.id)">删除</el-button>
              <el-button type="text" size="small">移动</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="checkSideRow.id == 2" class="enterprise item-margin">
        <div class="item-cont" v-if="enterpriseType === 1 || enterpriseType === 3">
          <el-button type="primary" size="small"  @click="enterpriseEdit" >编辑</el-button>
          <el-button  size="small"  @click="enterpriseClear">清除</el-button>
        </div>
        <div class="item-cont" v-if="enterpriseType === 2">
          <el-button type="primary" size="small"  @click="enterpriseSub">保存</el-button>
          <el-button  size="small"  @click="enterpriseClose">取消</el-button>
        </div>
        <!--富文本-->
        <div class="item-cont">
          <div class="no-content" v-show="enterpriseType === 1">暂无数据</div>
          <editor ref="editor" class="editor"  v-show="enterpriseType === 2"></editor>
          <div class="content" v-html="enterpriseInfo.content"  v-show="enterpriseType === 3"></div>
        </div>
      </div>
      <!--新增和编辑-->
      <el-dialog :title="addAndEditFlag ? '新增' : '编辑'" :visible.sync="dialogVisible" width="40%">
        <el-form ref="form" :model="addAndEditFormData" label-width="80px" :rules="rules">
          <el-form-item label="轮播图" prop="coverUrl">
            <upload-img v-model="addAndEditFormData.coverUrl" :content-txt="'点击上传'"></upload-img>
          </el-form-item>
          <el-form-item label="选择链接" prop="checkLinkList" class="small-input">
            <el-button type="primary" size="small" @click="getLink" v-if="!addAndEditFormData.checkLinkList.length">新增</el-button>
            <div v-for="item in addAndEditFormData.checkLinkList" class="check-link-list">{{item.linkTypeName}} 》 {{ item.detailsTypeName }} 》 {{ item.title }} <span><el-button type="text" size="small" @click="getLink">更换</el-button></span> </div>
            <p v-show="!addAndEditFormData.checkLinkList.length">{{ addAndEditFormData.noContent }}</p>
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
  import Editor from '@/components/editor/Editor'
  import UploadImg from '@/components/editor/UploadImg.vue'
  import LinkDialog from '@/views/content/operate/components/LinkDialog.vue'
  import Sortable from 'sortablejs'
  export default {
    name: 'mini_women',
    // 数据
    data() {
      return {
        /**
         * 左侧
         */
        // 左侧数据
        sideData: [],
        // 选中的行
        checkSideRow: {},
        // 左侧数据映射
        sideDataProps: {
          children: 'children',
          label: 'name'
        },
        /**
         * 首页
         */
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
         * 内购企业
         */
        enterpriseInfo: {
          content: ''
        },
        enterpriseType: null
      }
    },
    // 组件
    components: {
      UploadImg,
      LinkDialog,
      Editor
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        // 获取左侧数据
        this.getSideData();
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
        this.sideData =  [{
          name: '女装小程序',
          id: '3',
          level: 1,
          children: [
            {name: '首页banner', id: '1', level: 2},
            {name: '内购企业', id: '2', level: 2}
          ]
        }];
        // 获取默认选中的
        this.$nextTick(() => {
          const row = this.sideData[0].children[0];
          this.checkSideRow = row;
          this.$refs.sideTree.setCurrentKey(row.id);
          this.getTableData(row);
        })
      },
      /**
       * 首页banner
       */
      // 获取表格数据
      getTableData(row) {
        this.request(this.api.contentCore.womenOperationManage_listWeb, {modelType: row.id, orderBy: 'sort'}).then(data => {
          if(data.data && data.data.length){
            data.data.forEach(item => {
              if(item.linkType == 1 && item.contentPasses && item.contentPasses.length > 0){
                item._linkInfo = this.detailsType[item.detailsType] + ' 》 ' + item.contentPasses[0].title;
              }else if(item.productName && item.linkType == 2 ){
                item._linkInfo = this.detailsType[item.detailsType] + ' 》 ' + item.productName;
              }else if(item.url && item.linkType == 3 ){
                item._linkInfo = item.url;
              }else {
                item._linkInfo = '关联的'+ this.detailsType[item.detailsType] + '不存在或已下线';
              }
            })
          }
          this.tableData =  data.data;
          // 初始行拖拽
          this.rowDrop();
        });
      },
      // 表格行删除
      delTableItem(id){
        this.$confirm('确认删除吗？', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          this.request(this.api.contentCore.womenOperationManage_delete, {id: id}).then(data => {
            this.$notify.success({ title: '成功',message: '删除成功'});
            this.getTableData(this.checkSideRow);
          });
        }).catch(() => {
        });

      },
      // 左侧数据行点击
      sideDataClick(row, node, tree){
        if( row.level > 1){
          this.checkSideRow = row;
          if(row.id == 1){
            this.getTableData(row);
          }
          if(row.id == 2){
            this.getEnterpriseData(row);
          }
        }
      },
      // 表格行拖拽
      rowDrop() {
        const tbody = this.$refs.dragTable.$el.querySelector('.el-table__body-wrapper > table > tbody')
        const _this = this
        Sortable.create(tbody, {
          onEnd({ newIndex, oldIndex }) {
            if(newIndex === oldIndex) return;
            const currRow = _this.tableData.splice(oldIndex, 1)[0]
            _this.tableData.splice(newIndex, 0, currRow)
            let listData = _this.tableData.map((item,index) => {
              return {
                id: item.id,
                sort: ++index
              }
            })
            _this.request(_this.api.contentCore.womenOperationManage_move, listData).then(data => {
              _this.$notify.success({ title: '成功',message: '移动成功'});
            });

          }
        })
      },
      // 新增和编辑显示
      addAndEdit(flag,row){
        if(flag){
          this.addAndEditFormData = {
            coverUrl: '',
            noContent: '',
            checkLinkList: []
          }
        }else {
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
        this.addAndEditFlag = flag;
        this.dialogVisible = true;
      },
      // 获取链接关联
      getLink(){
        this.$refs.LinkDialog.linkDialog = true;
        this.$refs.LinkDialog.init();
      },
      // 新增编辑提交
      addAndEditSub(){
        // 新增url
        let url = this.api.contentCore.womenOperationManage_save;
        if(!this.addAndEditFlag){
          // 编辑url
          url = this.api.contentCore.womenOperationManage_edit;
        }
        this.$refs.form.validate((valid) => {
          if (valid) {
            let params = this.addAndEditFormData.checkLinkList[0];
            params.coverUrl = this.addAndEditFormData.coverUrl;
            params.id = this.addAndEditFormData.id;
            this.addAndEditSubSend(url, params)
          } else {
            return false;
          }
        });
      },
      addAndEditSubSend(url, formData){
        // 左侧菜单id
        formData.modelType = this.checkSideRow.id;
        this.request(url, formData).then(data => {
          let msg = this.addAndEditFlag ? '新增成功' : '编辑成功';
          this.$notify.success({ title: '成功',message: msg});
          // 删除完初始化表格数据
          this.getTableData(this.checkSideRow);
          this.dialogVisible = false;
        })
      },
      /**
       * 内购企业
       */
      // 获取数据
      getEnterpriseData(row){
        this.request(this.api.contentCore.womenOperationManage_listWeb, {modelType: row.id, orderBy: 'sort'}).then(data => {
          let contentInfo = data.data;
          if(contentInfo && contentInfo.length === 0){
            this.enterpriseType = 1;
          }else {
            this.enterpriseInfo = contentInfo[0];
            if(!this.enterpriseInfo.content){
              this.enterpriseType = 1;
            }else{
              this.enterpriseType = 3;
            }
          }
        });
      },
      // 编辑
      enterpriseEdit(){
        if(this.enterpriseType === 1){
          this.$refs.editor.setEditorHtml('');
        }else {
          this.$refs.editor.setEditorHtml(this.enterpriseInfo.content);
        }
        this.enterpriseType = 2;
      },
      // 提交
      enterpriseSave(content){
        let params = {modelType: this.checkSideRow.id, content: content};
        if(this.enterpriseInfo.id){
          params.id = this.enterpriseInfo.id
        }
        this.request(this.api.contentCore.womenOperationManage_saveText, params ).then(data => {
          this.$notify.success({ title: '成功', message: '操作成功'});
          this.getEnterpriseData(this.checkSideRow);
        });
      },
      enterpriseSub(){
        let html = this.$refs.editor.getEditorHtml();
        if(html == '<p><br></p>'){
          this.$notify.error({ title: '错误',message: '请输入数据'});
          return
        }
        this.enterpriseSave(html)
      },
      // 清空
      enterpriseClear(){
        this.$confirm('确认清空数据吗？', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          this.enterpriseSave('')
        }).catch(() => {
        });
      },
      // 取消
      enterpriseClose(){
        this.getEnterpriseData(this.checkSideRow);
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {
    }
  }
</script>
