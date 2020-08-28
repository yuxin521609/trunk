<template>
  <div class="create-store">
    <template>
      <section>
        <el-form :model="save_createStore_obj" :rules="rules" ref="save_createStore_obj" label-width="120px" class="form-label">
          <!-- 增值服务 -->
          <el-form-item label="增值服务：">
             <el-switch
                v-model="save_createStore_obj.used"
                active-color="#13ce66"
                inactive-color="#9d9d9d"
            ></el-switch>
            <span class="ml-10">当前状态：{{ save_createStore_obj.used ? '启用' : '关闭' }}</span>
          </el-form-item>
          <!-- 免费品类 -->
        <el-form-item  label="商品分类：">
          <div class="block">
            <el-cascader
              style="width:370px;"
              v-model="goodsIdArr"
              :show-all-levels="false"
              :options="categories_getTree_Arr"
              :props="propss"
              clearable></el-cascader>
          </div>
        </el-form-item>
          <!-- 服务价格 -->
          <el-form-item label="服务价格：">
            <el-input style="height:40px;" v-model="save_createStore_obj.price" placeholder="请输入服务价格"></el-input>
          </el-form-item>
        </el-form>
      </section>
    </template>
    <div class="save">
      <el-button type="primary" @click="save_createStore">确认</el-button>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import { setTimeout } from 'timers';

export default {
  data() {
    return {
      propss: {
        multiple: true,
        value:'identifier',
        label:'name'
      },
      // 新建门店提交对象
      save_createStore_obj:{
        "used":false,
        "price":"",
        "list":[]
      },
      // 获取下拉品类树结构
      categories_getTree_Arr:[],
      // 选中的商品集合
      goodsIdArr:[],
      // 增值服务配置
      rules: {
        storeName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        price: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    };
  },
  created() {
    // 获取下拉品类树结构
    this.categories_getTree();
    // 获取选中的下拉品类树结构
    this.appreciationServiceConfig_get();
  },
  mounted() {

  },
  methods: {
    /**
     * 保存新建门店
     */
    save_createStore() {
      const that = this,
            goodsIdArr = JSON.parse(JSON.stringify(this.goodsIdArr)),
            save_createStore_obj = JSON.parse(JSON.stringify(this.save_createStore_obj));
      // 处理商品集合
      goodsIdArr.forEach((item, index) => {
        const sub = item.splice(item.length-1,1)[0];
        save_createStore_obj.list.push({
          identifier:sub
        });
      });
      // 处理增值服务状态
      save_createStore_obj.used = save_createStore_obj.used ? 1 : 0;
      console.log(this.goodsIdArr)
      console.log(save_createStore_obj)
      // return;
      this.request(
        this.api.product.appreciationServiceConfig_save,
        save_createStore_obj
      ).then(res => {
        that.warn('添加成功!');
      });
    },
    /**
     * 提示
     */
    warn(message, type) {
      this.$message({
        message: message,
        type: type || 'success'
      });
    },
    /**
     * 获取全部下拉品类树结构
     */
    categories_getTree() {
      this.request(
        this.api.product.categories_getTree,
        {
          "valid":"true",
          "type":"1"
        }
      ).then(res => {
        this.categories_getTree_Arr = res;
        this.isChildrenNull(res);
      });
    },
    /**
     * 递归将categories_getTree_Arr中所有空的children设置为null
     * @param { Array } res 需要递归的数据数组
     */
    isChildrenNull(res) {
      res.forEach((item, index) => {
        if(item.children && item.children.length == 0) {
          item.children = null;
        }else{
          this.isChildrenNull(item.children);
        }
      });
    },
    /**
     * 获取选中的下拉品类树结构
     */
    appreciationServiceConfig_get() {
      this.request(
        this.api.product.appreciationServiceConfig_get
      ).then(res => {
        // 处理选中下拉品类
        res.list.forEach((item, index) => {
          const identifierArr = item.identifier.split('.');
          const itemArr = [];
          let str = '';
          identifierArr.forEach((items, indexs) => {
            // 如果不是第一个数组，拼接时加上点;
            str += (indexs != 0) ? `.${items}` : `${items}`;
            itemArr.push(str);
          });
          this.goodsIdArr.push(itemArr);
        });

        Object.assign(this.save_createStore_obj, {
          used: res.used ? true : false,
          price:res.price
        });
        console.log(this.goodsIdArr);
      });
    }
  },
  components: {}
};
</script>
<style  lang="less" scoped>
  .create-store{
    margin: 8px;
    padding: 20px;
    background: #fff;
    .save{
      margin-left: 120px;
    }
    .form-label{
      margin-top: 20px;
      .el-input, .el-select{
        width: 370px;

      }
      .el-input /deep/ .el-input__inner{height: 40px;}
      .el-checkbox-group{
        width: 550px;
      }
      .el-input-short{
        width: 180px;
      }
      .video-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 80px;
        height: 80px;
        text-align: center;
        line-height: 80px;
        span{
          font-size: 35px;
          color: #d9d9d9;
        }
      }
      .video-upload-p{
        color: #666;
        font-size: 12px;
      }
      .video-upload:hover{
        border: 1px dashed #409EFF;
      }
    }
  }
  .display-flex{
    display:flex;
  }
</style>

