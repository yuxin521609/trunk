<template>
  <ul class="tag-wrap">
    <!-- 分组 -->
    <li>
      <div class="check-tabs common-wrap">
        <h6 class="label">常用分组：</h6>
        <ul class="clearfix">
          <li
            v-for="(item, index) in commonGroups"
            :key="index"
            @click="checkItem(item)"
            :class="{active: item._active}"
          >{{ item.name }}</li>
        </ul>
      </div>
      <div class="check-tabs whole-wrap">
        <h6 class="label">全部分组：</h6>
        <ul class="clearfix">
          <li
            v-for="(item, index) in wholeGroups"
            :key="index"
            @click="checkItem(item)"
            :class="{active: item._active}"
          >{{ item.name }}</li>
        </ul>
      </div>
      <div class="page-more">
        <div @click="getMoreTags" class="btn">
          更多匹配标签
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
    </li>
    <!-- 录入标签 -->
    <li>
      <div class="check-tab">
        <span class="label">录入标签：</span>
        <el-autocomplete
          class="input-w-2 mt-1"
          v-model="tagName"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入标签名称"
          @select="handleSelect"
        ></el-autocomplete>&nbsp;
        <el-button type="primary" plain size="small">添加标签</el-button>
      </div>
      <div class="check-tabs all-wrap" v-for="(elem,pIndex) in allTagGroups" :key="pIndex">
        <h6 class="label">{{elem.name}}：</h6>
        <ul class="clearfix">
          <li
            v-for="(item,index) in elem.collocationTagItems"
            :key="index"
            @click="tagCheckItem(item)"
            :class="{active: item._active}"
          >{{ item.tagName }}</li>
        </ul>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  name: "tag-group-list",
  data() {
    return {
      commonGroups: [], //常用分组
      wholeGroups: [], //全部分组
      restaurants: [],
      tagName: "",
      timeout: null,
      //全部标签分组
      allTagGroups: []
    };
  },
  created() {
    this.init();
    this.getAllGroupData();
  },
  methods: {
    init() {},

    //获取全部分组
    getAllGroupData() {
      this.request(this.api.collocation.collocationTagGroup_list, {
        subset: true,
        valid: true
      }).then(res => {
        console.log(res);
        let _data = res.data;
        //拿到全部的 数组及标签 进行set 处理
        for (let i = 0; i < _data.length; i++) {
          _data[i]._active = false;
          let items=_data[i].collocationTagItems;
          for (let k = 0; k < items.length; k++) {
              items[k]._active = false;
          }
        }
        //TODO 要删掉
        let sss = this.$common.deepCopy(_data);
        let a = sss.splice(0, 1);
        console.log(sss);

        this.commonGroups = sss; //常用
        this.wholeGroups = _data; //全部
      });
    },

    //全部分组点击
    checkItem(item) {
      //未选改已选
      if (!item._active) {
        this.allChangeState(item.id, false, this.commonGroups);
        this.allChangeState(item.id, false, this.wholeGroups);
        this.allTagGroups.push(item);
      } else {
        this.allChangeState(item.id, true, this.commonGroups);
        this.allChangeState(item.id, true, this.wholeGroups);
        let index = this.allTagGroups.findIndex((elem) =>(elem.id == item.id));
        if(index != -1){
            this.allTagGroups.splice(index, 1);
        }
      }
    },
    //改变全部状态
    allChangeState(_id, _type, arr) {
      let cGroups = arr;
      for (let i = 0; i < cGroups.length; i++) {
        if (cGroups[i].id == _id) {
          if (!_type) {
            cGroups[i]._active = true;
          } else {
            cGroups[i]._active = false;
          }
          break;
        }
      }
    },
    //点击标签
    tagCheckItem(item){
        if(item._active === undefined){
          this.$set(item, '_active', '');
        }
         //未选改已选
        if(!item._active){
          item._active = true;
          //this.checkedData.push(item.id);
        }else {
          item._active = false;
          // let i = this.checkedData.findIndex(tab => {
          //   return item.id === tab
          // });
          // this.checkedData.splice(i, 1);
        }
    },
    getMoreTags() {},
    querySearchAsync(queryString, cb) {},
    createStateFilter(queryString) {
      //   return state => {
      //     return (
      //       state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      //     );
      //   };
    },
    handleSelect(item) {
      console.log(item);
    }
  }
};
</script>
<style lang="less" scoped>
.tag-wrap {
  > li {
    background-color: #fafafa;
    padding: 20px;
    margin-bottom: 20px;
  }
}
.whole-wrap {
  padding: 15px 0 0;
}
.all-wrap{
    padding: 10px 0 0 ;
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
      border-radius: 12px;
      margin: 0 8px 15px;
      cursor: pointer;
      font-size: 12px;
      box-shadow: 0 0 5px rgba(153, 153, 153, 0.3);
    }
    li.active {
      background-color: rgba(25, 158, 216, 1);
      color: #fff;
      box-shadow: 0 0 5px rgba(34, 144, 232, 1);
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
