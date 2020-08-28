<template>
  <el-container class="index-con">
    <el-header class="index-header" height="60px;">
      <v-header></v-header>
    </el-header>
    <el-main class="index-main">
      <div class="home-wrap">
        <div class="home-left">
          <h3 class="home-title">系统入口222</h3>
          <div class="left-top">
            <h6 class="home-subtitle">
              <i class="vertical"></i>最近使用
            </h6>
            <!-- <div>
          <dl class="nav-wrap">
            <dt></dt>
            <dd>零售门店系统</dd>
          </dl>
            </div>-->
            <div class="txt-center">
              <i class="no-icon">!</i>
              <p class="no-txt">暂无最近使用内容</p>
            </div>
          </div>
          <div>
            <h6 class="home-subtitle">
              <i class="vertical"></i>后台系统
            </h6>
            <div class="left-cont">
              <dl v-for="(item,index) in systemList" :key="index" @click="goToHtml(item)" class="nav-wrap">
                <dt :class="generateClassName(item)"></dt>
                <dd>{{item.name}}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="home-right">
          <div class="done">
            <h3 class="home-title">待办事项</h3>
            <!-- <ul class="home-list">
          <li v-for="item in 7" :key="item">
            <span>工单待处理事项工单</span>
            <i>6</i>
          </li>
            </ul>-->
            <dl class="no-done-wrap">
              <dt>
                <i class="no-icon">!</i>
              </dt>
              <dd>
                <p class="no-txt">暂无最近使用内容</p>
              </dd>
            </dl>
          </div>
          <div class="message">
            <h3 class="home-title">消息通知</h3>
            <!-- <ul class="home-list">
          <li v-for="item in 5" :key="item">系统派发您一条新的采集工单！</li>
            </ul>-->
            <dl class="no-message-wrap">
              <dt>
                <i class="no-icon">!</i>
              </dt>
              <dd>
                <p class="no-txt">暂无最近使用内容</p>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import vHeader from "@/components/public/vHeader.vue";
import { mapActions } from 'vuex'
//工单是boss
const systemArr =[
        { appId:'71859be9-a2ee-11e9-a22d-0242ac110002', className: "hi-user", name: "用户中心",link:'/crm' },
        { appId:'71859d71-a2ee-11e9-a22d-0242ac110002', className: "hi-product", name: "商品中心",link:'/product'},
        { appId:'71859d9f-a2ee-11e9-a22d-0242ac110002', className: "hi-content", name: "内容中心" ,link:'/content'},
        { appId:'71859dc3-a2ee-11e9-a22d-0242ac110002', className: "hi-boss", name: "BOSS系统", link:'/workorder'},
        { appId:'71859dec-a2ee-11e9-a22d-0242ac110002', className: "hi-retail", name: "零售门店系统" ,link:'/store'},
        { appId:'d8416da4-d7bc-4a3f-83cf-0c99bff60ddc', className: "hi-os", name: "组织架构",link:'/OC' },
        { appId:'71859e53-a2ee-11e9-a22d-0242ac110002', className: "hi-oc", name: "订单中心" ,link:'/OS'},
        { appId:'26d58727-a2c2-11e9-a22d-0242ac110002', className: "hi-lc", name: "智能搭配系统", link:'/collocation' },
        { appId:'14b83ea4-0d02-11ea-a898-0242ac110002', className: "hi-scb", name: "SCB商户运营", link:'/scb' },
        { className: "hi-gd", name: "工单中心" },
        { className: "hi-engine", name: "业务引擎"  },
        { className: "hi-pm", name: "采购管理系统" },
        { className: "hi-pos", name: "商户管理中心" },
        { className: "hi-knowledge", name: "知识库" },
        { className: "hi-train", name: "培训系统" },
        { appId:'fac7343e-d2a8-11e9-a898-0242ac110002', className: "hi-marketing", name: "营销系统", link:'/market' },
        { className: "hi-myop", name: "开放平台" },
        { className: "hi-sample", name: "样衣生产系统" },
        { className: "hi-call", name: "呼叫中心" },
        {appId:'cdb5723c-f17f-11e9-a898-0242ac110002', className: "hi-wms", name: "仓配调度中心", link:'/warehouse' },
        {appId:'7141a577-81dd-4f1d-9d1c-a55242388b72', className: "hi-fmis", name: "财务系统" ,link:'/fmis'}
      ]
export default {
  data() {
    return {
      systemList:[],
      // 权限模块列表
      authModuleRoutes: []
    }
  },
  created () {
    // 判断是否是从别的模块返回
    let flag = this.$route.query.isClearRouter;
    if(flag){
      // 如果是 使用刷新解决清除addRouter的路由
      window.location.href = window.location.href.split('?')[0];
      // 清空所有缓存的页面
      this.cachedViewDelAll();
    }else{
      this.init();
      this.getUserAppData();
    }
  },
  methods: {
    ...mapActions({
      cachedViewDelAll: 'cachedViews/cachedViewDelAll',
    }),
    init(){
      this.systemList=[];
    },
    getUserAppData(){
       this.request(this.api.system.APPLICATION_GETLISTBYAUTH, {})
       .then(res => {
          let _data=res,_dataLen=_data.length;
          let list=[];
          for (let i = 0; i < _dataLen; i++) {
              for (let k = 0; k < systemArr.length; k++) {
                  if(_data[i].id == systemArr[k].appId){
                    systemArr[k].routePath = _data[i].routePath;
                    list.push(systemArr[k]);
                    break;
                  }
              }
          }
          this.systemList=list;
          console.log(this.systemList)
        });
    },
    generateClassName(item) {
      // 调用方法，动态生成index
      return `home-icon ${item.className}`;
    },
    goToHtml(item){
      // window.localStorage.setItem('appId',item.appId);
      this.$router.push({path: item.routePath});
    }
  },
  components: {
    vHeader
  }
};
</script>
<style lang="less" scoped>
.vertical {
  width: 3px;
  height: 14px;
  background-color: #2290e8;
  margin-right: 4px;
  display: inline-block;
  vertical-align: text-top;
}
.home-wrap {
  margin: 0 10px 10px;
  display: flex;
  justify-content: space-between;
}
.home-title {
  font-size: 18px;
  height: 58px;
  line-height: 58px;
  color: #333333;
  border-bottom: 1px solid #e6e8ed;
}
.home-subtitle {
  font-weight: 100;
  font-size: 14px;
  color: #333333;
}
.nav-wrap {
  text-align: center;
  width: 114px;

  margin: 30px 0 14px;
  dt {
    cursor: pointer;
    margin: 0 auto;
    width: 50px;
    height: 50px;
    border-radius: 8px;
  }
  dd {
    cursor: pointer;
    margin-top: 16px;
    font-size: 12px;
    color: #333333;
  }
}
.home-left {
  padding: 0 24px;
  background: #ffffff;
  min-width: 400px;
  flex: 1;
}
.home-right {
  margin-left: 10px;
  width: 320px;
  -webkit-box-flex: 0;
  flex: 0 0 auto;
}
.left-top {
  height: 190px;
  padding: 22px 0 0;
}
.left-cont {
  display: flex;
  flex-wrap: wrap;
}
.done {
  padding: 0 24px;
  background: #ffffff;
  height: 370px;
  .home-list {
    height: 280px;
  }
}
.message {
  padding: 0 24px;
  background: #ffffff;
  height: 318px;
  margin-top: 10px;
  .home-list {
    height: 220px;
  }
}

.home-list {
  overflow-y: auto;
  li {
    cursor: pointer;
    margin: 16px 0 0;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    span {
      display: inline-block;
      width: 220px;
      color: #333333;
      overflow: hidden;
      white-space: nowrap;
      word-break: break-all;
      text-overflow: ellipsis;
    }
    i {
      width: 32px;
      height: 18px;
      line-height: 18px;
      background-color: #eef3f7;
      border-radius: 9px;
      text-align: center;
      color: #62819a;
    }
  }
}
.home-icon {
  background: url("../../assets/img/home_icon.png") no-repeat;
  background-size: 851px 264px;
}
.hi-user {
  background-position: -17px -1px;
}
.hi-product {
  background-position: -131px -1px;
}
.hi-content {
  background-position: -242px -1px;
}
.hi-boss {
  background-position: -353px -1px;
}
.hi-retail {
  background-position: -465px -1px;
}
.hi-os {
  background-position: -575px -1px;
}
.hi-oc {
  background-position: -690px -1px;
}
.hi-lc {
  background-position: -803px -1px;
}

.hi-pm {
  background-position: -17px -91px;
}
.hi-pos {
  background-position: -131px -91px;
}
.hi-knowledge {
  background-position: -242px -91px;
}
.hi-train {
  background-position: -353px -91px;
}
.hi-marketing {
  background-position: -465px -91px;
}
.hi-myop {
  background-position: -575px -91px;
}
.hi-sample {
  background-position: -690px -91px;
}
.hi-call {
  background-position: -803px -91px;
}

.hi-wms {
  background-position: -17px -177px;
}
.hi-fmis {
  background-position: -131px -177px;
}
.hi-gd {
  background-position: -242px -177px;
}
.hi-engine {
  background-position: -353px -177px;
}
.hi-scb {
  background-position: -17px -91px;
}

.no-icon {
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 1px solid #999999;
  border-radius: 50%;
  color: #999999;
  font-size: 12px;
  line-height: 22px;
  text-align: center;
  margin-right: 10px;
}
.no-txt {
  display: inline-block;
  color: #999999;
  font-size: 12px;
}
.txt-center {
  line-height: 150px;
  text-align: center;
}

.no-done-wrap {
  text-align: center;
  .no-icon {
    margin-top: 120px;
  }
  .no-txt {
    margin-top: 10px;
  }
}
.no-message-wrap {
  text-align: center;
  .no-icon {
    margin-top: 110px;
  }
  .no-txt {
    margin-top: 10px;
  }
}
</style>
