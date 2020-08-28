<style lang="less" scoped>
  .article{

  }
</style>
<template>
  <div class="article">
    <release-public :form-data="formData" ref="releasePublic">
      <!--富文本-->
      <editor ref="editor"></editor>
    </release-public>
  </div>
</template>
<script>
  import ReleasePublic from '@/views/content/create/components/ReleasePublic'

  import Editor from '@/components/editor/Editor'
  export default {
    props:{
      formData:{
        type: Object
      }
    },
    // 数据
    data() {
      return {

      }
    },
    // 组件
    components: {
      ReleasePublic,
      Editor
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {

      })
    },
    // 方法
    methods: {
      // 初始化
      init(){
        // 初始化公共的
        this.$refs.releasePublic.init();
        this.$refs.editor.setEditorHtml('')
      }


    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {

    }
  }
</script>
