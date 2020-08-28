<style lang="less" scoped>
  .check-tabs{
    .check-tabs-item{display: flex;
      .label{display: inline-block;width: 120px;line-height: 24px;text-align: right;}
      ul{flex: 1;
        li{float: left;height: 24px;line-height: 24px;padding: 0 5px;border-radius: 12px;margin-right: 15px;margin-bottom: 15px;cursor: pointer;font-size: 12px;box-shadow: 0 0 5px rgba(153, 153, 153, 0.3)}
        li.active{background-color: rgba(25, 158, 216, 1); color: #fff;box-shadow: 0 0 5px rgba(34, 144, 232, 1);}
      }
    }
    .page-more{border-top: 1px solid #e6e8ed;margin-top: 10px;
      div.btn{
        width: 120px;border: 1px solid #e6e8ed;border-top: 1px solid #fff;margin: -1px auto 0;text-align: center;font-size: 12px;cursor: pointer;line-height: 30px;
      }
    }
  }
</style>
<template>
  <div class="check-tabs">
    <div class="check-tabs-item" v-for="group in listDataFilter()" v-if="group.collocationTagItems.length > 0">
      <div class="label">{{ group.name }}：</div>
      <ul class="clearfix">
        <li v-for="(item, index) in group.collocationTagItems" :key="index" @click="checkItem(item)" :class="{active: item.checkFlag}">{{ item.tagName }}</li>
      </ul>
    </div>
    <div class="page-more" v-if="listData.length > 2">
      <div @click="getMoreTags" class="btn">
        更多匹配标签 <i :class="{'el-icon-arrow-down' : !isShowMore, 'el-icon-arrow-up' : isShowMore }"></i>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'check-tabs',
    props: {
      // 选中的数据
      checkedData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    // 数据
    data() {
      return {
        listData: [],
        isShowMore: false
      }
    },
    // 组件
    components: {},
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getTagGroupList()
      })
    },
    // 方法
    methods: {
      // 选择
      checkItem(item){
        if(item.checkFlag === undefined){
          this.$set(item, 'checkFlag', '');
        }
        if(!item.checkFlag){
          item.checkFlag = true;
          this.checkedData.push(item.tagId);
        }else {
          item.checkFlag = false;
          let i = this.checkedData.findIndex(tab => {
            return item.tagId === tab
          });
          this.checkedData.splice(i, 1);
        }
      },
      // 获取查询标签
      getTagGroupList(){
        this.request(this.api.collocation.collocationTagGroup_list, {subset: true, valid: true}).then(data => {
          this.listData = data.data;
        });
      },
      // 获取更多标签
      getMoreTags() {
        this.isShowMore = !this.isShowMore;
      },
      listDataFilter(){
        if(!this.isShowMore){
          return this.listData.filter((item, index) => {
            return index < 2
          })
        }else {
          return this.listData
        }
      },
      /**
       * Methods (组件方法)
       */
      // 清空选择
      clearChecked(){
        if(this.listData.length){
          // 清除样式
          this.listData.forEach(item => {
            if(item.collocationTagItems.length){
              item.collocationTagItems.forEach(tags => {
                if(tags.checkFlag === undefined){
                  this.$set(item, 'checkFlag', false);
                }else{
                  tags.checkFlag = false
                }
              })
            }
          })
        }
        // 清空数组
        this.checkedData.length = 0
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {
     /* checkedData: {
        handler(newVal, oldVal) {

        },
        deep: true
      }*/
    }
  }
</script>
