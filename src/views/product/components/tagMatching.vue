<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-06 14:36:41
 * @LastEditTime: 2019-08-13 19:03:52
 * @LastEditors: Please set LastEditors
 -->
<template>
  <ul class="tag-wrap">
    <!-- 分组 -->
    <li>
      <div class="check-tab">
        <span class="label">搜索标签：</span>
        <el-input
        class="input-w-2"
        placeholder="请输入标签名称"
        v-model="filterText">
        </el-input>&nbsp;
        <!-- <el-button type="primary" @click="setCheckedKeys" plain size="small">添加标签</el-button> -->
      </div>
      <div class="ztree-wrap">
        <el-tree
          :data="allTagGroups"
          show-checkbox
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
          @check-change="handleCheckChange"
          @check="handleCheck"
        ></el-tree>
      </div>
    </li>
    <!-- 录入标签 -->
    <li>
      <div class="select-tabs">
        <h6 class="label">已选标签：</h6>
        <ul class="clearfix">
          <li v-for="(item,index) in selectTags" :key="index">{{item.tagName}}</li>
        </ul>
      </div>
    </li>
  </ul>
</template>
<script>
let allTags = [];
let flag = true;
let tagFlag=false,groupFlag=false,tagIds=[];
export default {
  name: "tag-group-list",
  data() {
    return {
      wholeGroups: [], //全部分组
      //全部标签分组
      allTagGroups: [],
      //新
      defaultProps: {
        children: "collocationTagItems",
        label: "name"
      },
      selectTags: [], //已选标签
      filterText: '',
    };
  },
  created() {
    this.init();
    this.getAllGroupData();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    selectTags(val){
      //console.log(val);
      //productId tagId tagName
      if(val.length >0){
        let tags= this.$common.deepCopy(val);
        let arr=[];
        for (let i = 0; i < tags.length; i++) {
          arr.push({tagId:tags[i].tagId,tagName:tags[i].tagName,})
        }
        this.$emit('input',arr);
        tags = null;
      }
    },
  },
  methods: {
    init() {
      this.wholeGroups=[];
      this.allTagGroups=[];
      this.selectTags=[];
      this.filterText='';
      flag=true;
      allTags=[];
      tagFlag=false;
      groupFlag=false;
      tagIds=[];
    },
    //获取全部分组
    getAllGroupData() {
      this.request(this.api.collocation.collocationTagGroup_list, {
        subset: true,
        valid: true
      }).then(res => {
        //  console.log(res);
        let _data = res.data;
        let tagList = [];
        for (let i = 0; i < _data.length; i++) {
          // _data[i]._id = _data[i].id;
          let items = _data[i].collocationTagItems;
          for (let k = 0; k < items.length; k++) {
            items[k].name = items[k].tagName;
            // items[k]._id = items[k].tagId;
            tagList.push(items[k]);
          }
        }
        //console.log(_data);
        //拿到全部的 数组及标签 进行set 处理
        this.allTagGroups = _data; //全部
        //存储下全部的标签 只有标签 会有重复 但无关紧要
        allTags = this.$common.deepCopy(tagList);
        //处理回显
        groupFlag=true;
        this.handleEcho();
      });
    },
    //回显数据 从父组件获取  先这么写 后期优化  抬走下一位
    propInit(_ids){
      if(_ids.length > 0){
        tagFlag=true;
        tagIds=_ids;
        this.handleEcho();
      }
    },
    handleEcho(){
      if(tagFlag && groupFlag){
        this.setCheckedKeys(tagIds)
        //已经懵逼了 再写个方法处理向右边放入数据
        this.setSelectTags(tagIds);
      }
    },
    //节点选中状态发生变化时的回调
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
      flag = checked;
      let _ids = [];
      if (!checked) {
        if (!!data.tagId) {
        console.log(1);
          //拿到已选的数据中的值
          let tags = this.selectTags;
          for (let i = 0; i < tags.length; i++) {
            if (tags[i].tagId != data.tagId) {
              _ids.push(tags[i].id);
            }
          }
         // this.$refs.tree.setCheckedKeys(_ids);
        }
      }
    },
    //节点发生改变触发回调 当复选框被点击的时候触发
    handleCheck(data, obj) {
      // console.log(data);
      console.log(obj);
      if (obj.checkedKeys.length > 0) {
        this.handleKeyGetTagData(obj.checkedKeys);
      } else {
        this.selectTags = [];
      }
    },
    //处理Key 找到属性
    handleKeyGetTagData(keys) {
        //此时获取的Key 是ztree 的id
        // console.log(allTags);
        let tags = allTags,
          tagsLen = tags.length;
        let selectTags = [];
        let hash = {};
        for (let i = 0; i < keys.length; i++) {
          for (let k = 0; k < tagsLen; k++) {
            if (keys[i] == tags[k].id && !!tags[k].tagId) {
              selectTags.push(tags[k]);
            }
          }
        }
        const newArr = selectTags.reduceRight((item, next) => {
          hash[next.tagId] ? "" : (hash[next.tagId] = true && item.push(next));
          return item;
        }, []);
        this.selectTags = this.$common.deepCopy(newArr);
        //console.log(this.selectTags);
        //让其他ztree有当前标签的被选中
        //TODO 加个状态 如果事件调用顺序变了 会出现问题
      if (flag) {
        this.setCheckedKeys(newArr);
      }
    },
    //根据TagId 选中 全部Ztree中 已有的标签
    setCheckedKeys(tagsList) {
      let listId = [];
      let tags = allTags,
        tagsLen = tags.length;
      for (let i = 0; i < tagsList.length; i++) {
        for (let k = 0; k < tagsLen; k++) {
          if (tagsList[i].tagId == tags[k].tagId) {
            listId.push(tags[k].id);
          }
        }
      }
      this.$refs.tree.setCheckedKeys(listId);
    },
    //修改回显时处理右边的数据
    setSelectTags(tagsList){
      let list = [];
      let tags = allTags,
        tagsLen = tags.length;
        for (let i = 0; i < tagsList.length; i++) {
          for (let k = 0; k < tagsLen; k++) {
            if (tagsList[i].tagId == tags[k].tagId) {
              list.push(tags[k]);
            }
          }
        }
        this.selectTags=list;
    },
    //处理过滤函数
    filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
    },
  }
};
</script>
<style lang="less" scoped>
.tag-wrap {
  display: flex;
  justify-content: space-between;

  > li {
    min-width: 200px;
    background-color: #fafafa;
    padding: 20px;
  }
  > li:nth-child(1) {
    flex: 1;
  }
  > li:nth-child(2) {
    width: 300px;
    margin-left: 20px;
  }
}
.ztree-wrap {
  height: 400px;
  overflow-y: auto;
  margin-top: 10px;
}
.whole-wrap {
  padding: 15px 0 0;
}
.all-wrap {
  padding: 10px 0 0;
}
.common-wrap {
  border-bottom: 1px dashed #aaa;
}
.check-tabs {
  display: flex;
  .label {
    display: inline-block;
    width: 80px;
    line-height: 24px;
    text-align: right;
  }
  ul {
    flex: 1;
    li {
      float: left;
      height: 24px;
      line-height: 24px;
      padding: 0 10px;
      margin: 0 8px 15px;
      cursor: pointer;
      font-size: 12px;
    }
    li.active {
      background-color: rgba(25, 158, 216, 1);
      color: #fff;
      box-shadow: 0 0 5px rgba(34, 144, 232, 1);
    }
  }
}
.select-tabs {
  display: flex;
  .label {
    display: inline-block;
    width: 80px;
    line-height: 24px;
    text-align: right;
  }
  ul {
    flex: 1;
    li {
      float: left;
      height: 24px;
      line-height: 24px;
      margin: 0 3px 8px;
      font-size: 14px;
    }
  }
}
.page-more {
  border-top: 1px solid #e6e8ed;
  margin-top: 10px;
  div.btn {
    width: 120px;
    border: 1px solid #e6e8ed;
    border-top: 1px solid #fff;
    margin: -1px auto 0;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
    line-height: 30px;
  }
}
.mt-1 {
  margin-top: 2px;
}
</style>
