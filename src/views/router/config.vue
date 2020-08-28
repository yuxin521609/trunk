<style lang="less" scoped></style>
<template>
  <div class="router-config">
    <div class="item-cont">
      <div class="item-cont">
        <el-button size="small" type="primary" @click="addItem('app')">新增APP</el-button>
      </div>
      <el-table ref="table" :data="tableList" style="width: 100%;" row-key="id" size="mini" border lazy :load="tableLoad" :tree-props="{children: 'sublist', hasChildren: 'hasChildren'}">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="code" label="编码" width="120"></el-table-column>
        <el-table-column prop="routePath" label="路由地址" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="modulePath" label="模块地址" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="meta" label="元信息" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="按钮权限">
          <template slot-scope="scope" v-if="scope.row.authlist && scope.row.authlist.length">
            <el-button type="text" size="small" @click="editItem('auth', item)" v-for="item in scope.row.authlist" :key="item.id">{{ item.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editItem('menu', scope.row)" v-if="scope.row.code">编辑</el-button>
            <el-button type="text" size="small" @click="editItem('app', scope.row)" v-else>编辑</el-button>
            <el-button type="text" size="small" @click="addItem('menu', scope.row)">新增子菜单</el-button>
            <el-button type="text" size="small" @click="addItem('auth', scope.row)" v-if="(!scope.row.sublist || scope.row.sublist.length === 0) && scope.row.code">新增按钮</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--弹窗-->
    <el-dialog :title="isAddItem ? '新增' : '编辑' " :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false">
      <el-form ref="form" :model="addAndEditFormData" label-width="80px">
        <el-form-item label="编码" v-if="addAntEditType != 'app'">
          <el-input v-model="addAndEditFormData.code"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="addAndEditFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="addAndEditFormData.type"></el-input>
        </el-form-item>
        <el-form-item label="路由地址">
          <el-input type="textarea" v-model="addAndEditFormData.routePath"></el-input>
        </el-form-item>
        <el-form-item label="模块地址">
          <el-input type="textarea" v-model="addAndEditFormData.modulePath"></el-input>
        </el-form-item>
        <el-form-item label="元信息">
          <el-input type="textarea" v-model="addAndEditFormData.meta"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="dialogVisibleSub" size="small">确定</el-button>
          <el-button @click="dialogVisible = false" size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  // 数字补0操作
  function addZero(num) {
    return num < 10 ? '0' + num : num;
  }

  export default {
    name: 'router_config',
    // 组件
    components: {},
    // 数据
    data() {
      return {
        // 表格数据
        tableList: [],
        // 新增还是编辑
        isAddItem: true,
        // 是否显示弹窗
        dialogVisible: false,
        // 操作的行数据
        checkedRowData: {},
        // 新增或编辑参数
        addAndEditFormData: {},
        // 新增或编辑的类型
        addAntEditType: ''
      }
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getAppData()
      })
    },
    // 方法
    methods: {
      // 获取顶级中台列表
      getAppData(){
        this.request(this.api.system.application_List, {}).then(data => {
          if(data.data && data.data.length) {
            data.data.forEach(item => {
              item.hasChildren = true
            });
            this.tableList = data.data;
          }else {
            this.tableList = [];
          }
        });
      },
      // 加载子菜单
      tableLoad(tree, treeNode, resolve) {
        // 判断是否动态子集
        if(tree.code){
          resolve(tree.sublist)
        }else {
          let appId = tree.id;
          this.request(this.api.system.menu_getListMap, {appId: appId}).then(data => {
            if(data && data.length) {
              this.tableDataInit(data);
              resolve(data)
            }else {
              resolve([])
            }
          });
        }
      },
      // 子菜单初始化 增加hasChildren
      tableDataInit(data){
        if(data && data.length) {
          data.forEach(item => {
            if(item.sublist && item.sublist.length){
              item.hasChildren = true;
              this.tableDataInit(item.sublist);
            }else {
              item.sublist = [];
              item.hasChildren = false;
            }
          })
        }
      },
      /**
       * 新增
       * @param type   新增类型  app -> 顶级菜单   menu -> 左侧菜单   auth -> 页面按钮
       * @param row    点击的当前父级行   如果没有为新增顶级
       */
      async addItem(type, row) {
        // 保存点击的行数据
        if(row){
          this.checkedRowData = row;
        }
        this.isAddItem = true;
        this.dialogVisible = true;
        this.addAntEditType = type;
        switch (type) {
          case 'app':
            this.addAndEditFormData = {
              name: '',
              routePath: '',
              modulePath: '',
              meta: '',
            };
            break;
          case 'menu':
            // 获取用户信息
            let userInfo = await this.request(this.api.user.get_userinfo, {}, true);
            this.addAndEditFormData = {
              name: '',
              code: '',
              routePath: '',
              modulePath: '',
              meta: '',
              type: 0,
              appId: row.appId || row.id,
              parentId: '',
              parentCode: '',
              tenantId: userInfo.tenantId
            };
            // 判断是否是menu的最大一级 app是父级时没有code
            if(!row.code){
              // 获取menu最大值
              this.request(this.api.system.menu_getMaxMenuCode, {}).then(data => {
                this.addAndEditFormData.code = Number(data) + 1
              });
            }else {
              this.addAndEditFormData.parentId = row.id;
              this.addAndEditFormData.parentCode = row.code;
              if(row.sublist && row.sublist.length === 0){
                this.addAndEditFormData.code = row.code + '.01'
              }
              if(row.sublist && row.sublist.length > 0){
                // 取最大值
                let code = '0';
                row.sublist.forEach(item => {
                  let numAry = item.code.split('.');
                  let maxAry = code.split('.');
                  let num = Number(numAry[numAry.length - 1]);
                  let max = Number(maxAry[maxAry.length - 1]);
                  if(num >= max) {
                    numAry[numAry.length - 1] = addZero(num + 1);
                    code = numAry.join('.');
                  }
                });
                this.addAndEditFormData.code = code;
              }
            }
            break;
          case 'auth':
            this.addAndEditFormData = {
              menuId: row.id,
              code: '',
              name: '',
              routePath: '',
              modulePath: '',
              meta: ''
            };
            if(!row.authlist) {
              this.$set(row, 'authlist', []);
            }
            if(row.authlist && row.authlist.length === 0){
              this.addAndEditFormData.code = '01'
            }
            if(row.authlist && row.authlist.length > 0){
              // 取最大值
              let max = '0';
              row.authlist.forEach(item => {
                let num = Number(item.code);
                if(num >= Number(max)) {
                  max = addZero(num + 1);
                }
              });
              this.addAndEditFormData.code = max;
            }
            break;
        }
      },
      /**
       * 编辑
       * @param type   新增类型  app -> 顶级菜单   menu -> 左侧菜单   auth -> 页面按钮
       * @param row    点击的当前父级行
       */
      editItem(type, row) {
        this.checkedRowData = row;
        this.isAddItem = false;
        this.dialogVisible = true;
        this.addAntEditType = type;
        this.addAndEditFormData = JSON.parse(JSON.stringify(row))
      },
      /**
       * 保存
       */
      dialogVisibleSub() {
        let url = '';
        switch (this.addAntEditType) {
          case 'app':
            url = this.api.system.application_save;
            break;
          case 'menu':
            url = this.api.system.menu_save;
            break;
          case 'auth':
            url = this.api.system.auth_save;
            break;
        }
        this.request(url, this.addAndEditFormData).then(data => {
          this.$notify.success({ title: '成功',message: '操作成功'});
          switch (this.addAntEditType) {
            case 'app':
              this.getAppData();
              break;
            case 'menu':
              // 判断是新增还是编辑  提交表单有id视为编辑
              if(this.addAndEditFormData.id) { // 编辑
                this.checkedRowData.name = data.name;
                this.checkedRowData.code = data.code;
                this.checkedRowData.routePath = data.routePath;
                this.checkedRowData.modulePath = data.modulePath;
                this.checkedRowData.meta = data.meta;
                this.checkedRowData.type = data.type;
              }else { // 新增
                const id = this.checkedRowData.id;
                data.sublist = [];
                data.hasChildren = false;
                if(this.$refs.table.store.states.lazyTreeNodeMap[id]) {
                  this.$refs.table.store.states.lazyTreeNodeMap[id].push(data);
                }else {
                  this.checkedRowData.hasChildren = true;
                  if(this.checkedRowData.sublist){
                    this.checkedRowData.sublist.push(data)
                  }
                }
              }
              break;
            case 'auth':
              // 判断是新增还是编辑  提交表单有id视为编辑
              if(this.addAndEditFormData.id) { // 编辑
                this.checkedRowData.name = data.name;
                this.checkedRowData.code = data.code;
                this.checkedRowData.routePath = data.routePath;
                this.checkedRowData.modulePath = data.modulePath;
                this.checkedRowData.meta = data.meta;
              }else { // 新增
                this.checkedRowData.authlist.push(data);
              }
              break;
          }
          this.dialogVisible = false;
        });
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
