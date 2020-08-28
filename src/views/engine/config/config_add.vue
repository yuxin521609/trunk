<template>
  <div class="create-store">
    <template>
      <section>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="form-label">
          <!-- 增值服务 -->
          <el-form-item label="增值服务：" prop="storeName">
             <el-switch
                v-model="ruleForm.name"
                active-color="#13ce66"
                @change="switchValid(ruleForm.name)"
                inactive-color="#9d9d9d"
                active-text="当前状态:关闭"
            ></el-switch>
          </el-form-item>
          <!-- 免费品类 -->
       <el-form-item  label="商品分类：">
          <div class="input-w-2">
            <el-cascader-multi
              :disabled="showDisabled"
              v-model="cateIdArr"
              only-last="true"
              :data="options"
              :clearable="true"
              :is-two-dimension-value="true"
              separator="/"
              :value-key="value"
              label-key="label"
              children-key="children"
            ></el-cascader-multi>
          </div>
        </el-form-item>
          <!-- 服务价格 -->
          <el-form-item label="服务价格：" prop="region">
            <el-input v-model="ruleForm.name" placeholder="请输入服务价格"></el-input>
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

export default {
  data() {
    return {
      props: { multiple: true },
      // 当前选中的菜单
      activeName: 'first',
      // 新建门店提交对象
      save_createStore_obj:{
        name:'z'
      },
      cateIdArr:[],
      props: { multiple: true },
        options: [{
          value: 1,
          label: '东南',
          children: [{
            value: 2,
            label: '上海',
            children: [
              { value: 3, label: '普陀' },
              { value: 4, label: '黄埔' },
              { value: 5, label: '徐汇' }
            ]
          }, {
            value: 7,
            label: '江苏',
            children: [
              { value: 8, label: '南京' },
              { value: 9, label: '苏州' },
              { value: 10, label: '无锡' }
            ]
          }, {
            value: 12,
            label: '浙江',
            children: [
              { value: 13, label: '杭州' },
              { value: 14, label: '宁波' },
              { value: 15, label: '嘉兴' }
            ]
          }]
        }, {
          value: 17,
          label: '西北',
          children: [{
            value: 18,
            label: '陕西',
            children: [
              { value: 19, label: '西安' },
              { value: 20, label: '延安' }
            ]
          }, {
            value: 21,
            label: '新疆维吾尔族自治区',
            children: [
              { value: 22, label: '乌鲁木齐' },
              { value: 23, label: '克拉玛依' }
            ]
          }]
        }],
      value1: new Date(2016, 9, 10, 18, 40),
      ruleForm: {
          storeName: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          storeName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
    };
  },
  created() {
    this.categories_getTree();
  },
  mounted() {
  },
  methods: {
    categories_getTree() {
      this.request(
          this.api.product.categories_getTree,
      ).then(res => {

      });
    },
    cateChangeGet(value) {
      console.log(value)
    },
    handleClick() {

    },
     save_createStore(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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

