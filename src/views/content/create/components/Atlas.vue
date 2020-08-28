<style lang="less" scoped>
  .my-atlas{
    .atlas-upload-img{padding: 20px;}
    .table-img{height: 100px;}
    .material-upload{height: 80px;width: 80px;border-radius: 5px;border: 1px dashed #d9d9d9;cursor: pointer;text-align: center;float: left;margin-right: 20px;line-height: 80px;
    }
    .material-upload:hover{border: 1px dashed #409EFF;}
    .img-list{height: 200px;overflow: auto;}
  }
</style>
<template>
  <div class="my-atlas">
    <release-public :form-data="formData" ref="releasePublic">
      <!--发布图集-->
      <el-table :data="formData.atlasList" ref="dragTable" style="width: 100%"  row-key="url" :show-header="false">
        <el-table-column prop="name" label="图片" width="300">
          <template slot-scope="scope">
            <img :src="scope.row.url" alt="" class="table-img" v-if="scope.row.url">
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述">
          <template slot-scope="scope">
            <el-input type="textarea" :rows="4" placeholder="请输入图片说明" v-model="scope.row.description">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="uploadTableImg(scope)">更换</el-button>
            <el-button type="text" size="small"  @click="delTableItem(scope)">删除</el-button>
            <el-button type="text" size="small">移动</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="atlas-upload-img clearfix">
        <div class="material-upload" @click="imgCheckDialogShow">选择图片</div>
      </div>
    </release-public>
    <el-dialog title="选择图片" :visible.sync="imgCheckDialog" width="45%" :close-on-click-modal="false" :close="imgCheckDialogClose">
      <div class="upload-list">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="本地上传" name="local">
            <upload-img :call-back="uploadImgCallBack" content-txt="本地选择"></upload-img>
          </el-tab-pane>
          <el-tab-pane label="素材库" name="material">
            <div class="img-list">
              <radio-list :radio-list="materialImgList" :type="2" :radio-check="materialRadioCheck" v-if="activeName === 'material'"></radio-list>
              <el-button type="primary" @click="getMaterialImgData(true)" size="small">加载更多</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer" v-if="activeName === 'material'">
        <el-button @click="imgCheckDialog = false" size="small">取 消</el-button>
          <el-button type="primary" @click="imgCheckDialogSub" size="small">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import ReleasePublic from '@/views/content/create/components/ReleasePublic'
  import UploadImg from '@/components/editor/UploadImg'
  import RadioList from '@/views/content/create/components/RadioList'
  import Sortable from 'sortablejs'
  export default {
    props:{
      formData:{
        type: Object
      }
    },
    // 数据
    data() {
      return {
        // 修改的行
        uploadRow:null,

        // 选择图片弹窗
        imgCheckDialog: false,
        // tabs 默认选中的
        activeName: 'local',
        // 素材列表
        materialRadioCheck: [],
        materialImgList: [],
        materialImgFrom: {
          pageIndex: 1,
          pageSize: 12,
          type: 2  // 1 -- 视频  2 -- 图片
        }
      }
    },
    // 组件
    components: {
      ReleasePublic,
      UploadImg,
      RadioList
    },
    created(){

    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        // 初始行拖拽
        this.rowDrop()
      })
    },
    // 方法
    methods: {
      // 初始化
      init(){
        // 初始化公共的
        this.$refs.releasePublic.init()
      },
      // 表格行拖拽
      rowDrop() {
        const tbody = this.$refs.dragTable.$el.querySelector('.el-table__body-wrapper > table > tbody')
        const _this = this
        Sortable.create(tbody, {
          onEnd({ newIndex, oldIndex }) {
            if(newIndex === oldIndex) return
            const currRow = _this.formData.atlasList.splice(oldIndex, 1)[0]
            _this.formData.atlasList.splice(newIndex, 0, currRow)
          }
        })
      },
      // 删除
      delTableItem(scope){
        this.$confirm('确认删除吗？', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          this.$message.success('删除成功');
          this.formData.atlasList.splice(scope.$index, 1)
        }).catch(() => {
        });

      },
      // 更改
      uploadTableImg(scope){
        this.uploadRow = scope
        this.imgCheckDialogShow()
      },


      // 选择图片弹窗显示
      imgCheckDialogShow(){
        this.imgCheckDialog = true
        this.materialImgFrom.pageIndex = 1
        this.activeName = 'local'
      },
      imgCheckDialogClose(){
        this.uploadRow = null
      },
      //图片 素材 本地 切换
      handleClick(node){
        if(node.name === 'material'){
          this.getMaterialImgData(false)
        }
      },
      // 图片回调
      uploadImgCallBack(url){
        if(url){
          if(this.uploadRow){
            this.uploadRow.row.url = url
            this.uploadRow = null
          }else{
            this.formData.atlasList.push({
              url: url,
              description: '',
              type: 2   // 图片类型  1  封面  2  内容
            })
          }
          this.imgCheckDialog = false
        }
      },

      // 选中素材
      imgCheckDialogSub(){
        if(this.materialRadioCheck){
          if(this.uploadRow){
            this.uploadRow.row.url = this.materialRadioCheck[0].url
          }else{
            this.formData.atlasList.push({
              url: this.materialRadioCheck[0].url,
              libraryId: this.materialRadioCheck[0].id,
              description: '',
              type: 2   // 图片类型  1  封面  2  内容
            })
          }
          this.imgCheckDialog = false
          this.uploadRow = null
        }else{
          this.$message.error('请选择图片')
        }
      },
      // 获取素材信息
      getMaterialImgData(flag){
        if(flag){
          this.materialImgFrom.pageIndex++
        }
        this.request(this.api.contentCore.library_list, this.materialImgFrom).then(data => {
          if(flag){
            this.materialImgList = this.materialImgList.concat(data.data)
          }else {
            this.materialImgList =  data.data
          }
        });
      },

    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {

    }
  }
</script>
