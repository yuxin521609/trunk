<style scoped lang="less">
  .rebort_table /deep/ .el-radio {margin-right: 10px;}
  .titles {
    width: 100%;
    height: 80px;
    background: #fff;
    display: flex;
    align-items: center;
    padding-left: 18px;
    box-sizing: border-box;
    font-weight: bold;
  }

  .rebort_table {
    padding: 0 18px;
    box-sizing: border-box;
    background: #fff;
  }
  .rebort_table_title {
    display: flex;
    border: 1px solid #ccc;
    border-right: none;
    border-top: none;
  }
  .rebort_table_title {
    border-top: 1px solid #ccc;
  }
  .rebort_table_title li {
    width: calc(25%-13px);
  }
  .rebort_table_title:last-child,
  .rebort_table_list:last-child {
    border-bottom: 1px solid #ccc;
  }
  .rebort_table_title li,
  .rebort_table_list li {
    width: 25.6%;
    height: 47px;
    display: flex;
    align-items: center;
    border-right: 1px solid #ccc;
    padding-left: 18px;
    /* box-sizing: border-box; */
  }
  .rebort_table_title li:last-child {
    /* background-color: rebeccapurple; */
    width: 25.6%;
  }
  .el-checkbox {
    margin-right: 10px;
  }
  .item-footer {
    background: #fff;
    padding: 18px;
  }
  .rebort_table_title_top {
    overflow-y: scroll;
  }

  .rebort_table_title_top::-webkit-scrollbar-thumb {
    background: #fff;
  }
  .rebort_table_title_top::-webkit-scrollbar-track {
    background: #fff;
    border-right: 1px solid #ccc !important;
  }
  .lasttopli {
    border-right: none !important;
  }
</style>

<template>
  <div class="rebort_table">
    <div class="titles">按用户授权</div>
    <ul class="rebort_table_title rebort_table_title_top">
      <li>
        <el-checkbox v-model="topChecked" @change="perChange">功能权限</el-checkbox>
      </li>
      <li>操作权限</li>
      <li>字段权限</li>
      <li class="lasttopli">数据权限</li>
    </ul>
    <tree-per :data="tableData" @item-change="treeChange"></tree-per>
    <div class="item-footer">
      <el-button @click="submitForm('filtersForm')" type="primary" size="small">确定</el-button>
      <el-button @click="routerback('filtersForm')" size="small">取消</el-button>
    </div>
  </div>
</template>
<script>
  import treePer from "@/components/treePermission";
  export default {
    components: { treePer },
    data() {
      return {
        // url传参账户id及userId
        user_id: '',
        _id: '',
        // 是否全选
        topChecked: false,
        // 列表数据
        tableData: [],
        // 数据权限
        dataAuthList: [
          {name: '个人', authType: 0},
          {name: '部门', authType: 1},
          {name: '部门及以下', authType: 2},
          {name: '机构', authType: 3}
        ]
      };
    },
    created(){
      this.user_id = this.$route.query.userId
      this._id = this.$route.query.id
    },
    mounted(){
      this.$nextTick(()=> {
        this.getData()
      })
    },
    methods: {
      // 后退
      routerback() {
        this.$router.go(-1);
      },
      // 获取数据
      getData() {
        this.request(this.api.system.user_Auth_Tree, {
          userId: this.user_id
        }).then(data=> {
          this.tableDataInit(data);
          this.tableData = data;
          this.topChecked = data.findIndex(f => f.checked) > -1;
        })
      },
      tableDataInit(data){
        if(data && data.length){
          data.forEach(item => {
            if(item.leaf){
              let dataAuthChecked = item.sublist.find(item => item.type === 'dataAuth');
              if(dataAuthChecked){
                item._dataAuthChecked = dataAuthChecked.authType;
              }else {
                item._dataAuthChecked = 0
              }
              item.sublist = item.sublist.filter(item => item.type === 'auth' );
              item._dataAuthList = this.dataAuthList.map(auth => {
                return {
                  name: auth.name,
                  authType: auth.authType,
                  menuId: item.id
                }
              })
            }else{
              this.tableDataInit(item.sublist);
            }
          })
        }
      },
      // 返回权限设置是否全选
      treeChange(topChecked) {
        var hasChecked = this.tableData.findIndex(f => f.checked) > -1;
        if (hasChecked) {
          this.topChecked = hasChecked;
        } else {
          this.topChecked = topChecked;
        }
      },
      // 新增和编辑提交
      submitForm(formName) {
        let perDa = this.combinaParams();
        let postDa = {
          id: this._id,
          menuList: perDa.menus,
          authList: perDa.ops,
          dataAuthList: perDa.dataAuthList
        };
        this.request(this.api.user.crm_userCompany_saveUserAuth, postDa).then(data => {
          this.routerback();
        });
      },
      // 获取参数权限设置参数
      combinaParams() {
        var list = this.tableData;
        let allList = {
          menus: [],
          ops: [],
          dataAuthList: []
        };
        this.recurveData(allList, list);
        return allList;
      },
      recurveData(allList, list) {
        list.forEach(f => {
          if(f.leaf){
            let dataAuth = f._dataAuthList.find(item => {
              return item.authType === f._dataAuthChecked
            });
            allList.dataAuthList.push(dataAuth);
          }
          if (f.checked) {
            switch (f.type) {
              case "menu":
                allList.menus.push(f.id);
                break;
              case "auth":
                allList.ops.push(f.id);
                break;
            }
          }
          if (f.sublist && f.sublist.length > 0) {
            this.recurveData(allList, f.sublist);
          }
        });
      },
      // 功能权限全选
      perChange(val) {
        this.tableData.forEach(f => {
          f.checked = val;
          if (f.sublist && f.sublist.length > 0) {
            this.cbChange(f.sublist, val);
          }
        });
      },
      cbChange(list, checked) {
        list.forEach(f => {
          f.checked = checked;
          if (f.sublist && f.sublist.length > 0) {
            this.cbChange(f.sublist, checked);
          }
        });
      }
    },
    computed: {

    },
    watch: {

    },
  };
</script>

