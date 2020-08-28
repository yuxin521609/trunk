<!--
 * @Description: 同步库存及隐藏接口调用
 * @Author: elephant
 * @Date: 2019-08-20 08:58:21
 * @LastEditTime: 2019-08-22 19:26:52
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="bg-fff item-margin item-padding">
  <el-tabs v-model="activeName">
    <el-tab-pane label="自定义" name="customize">
     <el-form
      class="item-form"
      :rules="rules"
      :model="filtersData"
      label-width="100px"
      size="small"
      ref="filtersForm"
      inline
    >
      <el-row>
        <el-col :span="24">
          <el-form-item prop="_service" label="微服务：">
            <el-select placeholder="请选择" class="input-w" v-model="filtersData._service">
              <el-option
                v-for="item in serviceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="_url" label="url：">
            <el-input class="input-w" placeholder="请输入内容" v-model="filtersData._url"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="_method" label="请求方式：">
            <el-select placeholder="请选择" class="input-w" v-model="filtersData._method">
              <el-option
                v-for="item in methodOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="_form" label="请求类型：">
            <el-select placeholder="请选择" class="input-w" v-model="filtersData._form">
              <el-option
                v-for="item in formOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-for="(item,index) in params" :key="index">
          <el-form-item :label=" index == 0 ? '请求参数：':'   '">
            <el-input class="ztree-w" v-model.trim="item.name" placeholder="请输入字段名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input class="ztree-w" v-model.trim="item.code" placeholder="请输入参数"></el-input>
            <i
              @click="removeDomain(item)"
              v-if="index != 0"
              v-show="!item.id"
              class="el-icon-error"
            ></i>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label>
            <el-button class="label-input-right" @click="addContent">新增参数</el-button>
          </el-form-item>
        </el-col>
      </el-row>

    <div class="item-footer">
      <el-button size="small" @click="submitForm('filtersForm')" type="primary">发送请求</el-button>
    </div>
    </el-form>
    </el-tab-pane>
      <el-tab-pane label="同步库存" name="aync">
          <el-form
      class="item-form"
      :rules="rules"
      :model="ayncFormData"
      label-width="100px"
      size="small"
      ref="ayncForm"
      inline
    >
      <el-row>
        <el-col :span="24">
          <el-form-item prop="goodsOwner" label="货主：">
            <!-- <el-select placeholder="请选择" class="input-w" v-model="ayncFormData.goodsOwner">
              <el-option
                v-for="item in goodsOwnerOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select> -->
             <el-input class="input-w" disabled placeholder="请输入内容" v-model="name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="warehouseCode" label="仓库：">
            <el-select placeholder="请选择" class="input-w" v-model="ayncFormData.warehouseCode">
              <el-option
                v-for="item in warehouseOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="productGoodsCode" label="货品编码：">
            <el-input class="input-w" placeholder="请输入内容" v-model="ayncFormData.productGoodsCode"></el-input>
          </el-form-item>
        </el-col>
       
      </el-row>
    </el-form>
        <el-button size="small" @click="ayncForm('ayncForm')" type="primary">同步库存</el-button>
      </el-tab-pane>
      </el-tabs>
  </div>
</template>
<script>
/**
 * { url: service + "/xxxxxxx", method: "post", form: true, auth: false }
 * url: ""
 * method: "get"   默认 post
 * form: true      默认 false
 * auth: true      默认 true
 * tip: true       默认 false
 */
export default {
  data() {
    return {
      activeName:'customize',
      rules: {},
      filtersData: {
        _url: "",
        _service: "",
        _method: "post",
        _form: false
      },
      params: [{ name: "", code: "" }],
      serviceOptions: [
        { name: "order", id: "order-service" },
        { name: "collocation", id: "collocation-service" },
        { name: "content", id: "content-service" },
        { name: "system", id: "system-service" },
        { name: "product", id: "product-service" },
        { name: "retail-store", id: "retail-store-service" },
        { name: "user", id: "user-service" }
      ],
      methodOptions: [
        { name: "get" },
        { name: "post" },
        { name: "put" },
        { name: "delete" }
      ],
      formOptions: [{ name: "form", id: true }, { name: "json", id: false }],
      ayncFormData:{
        goodsOwner:null,
        warehouseCode:null,
        productGoodsCode:null
      },
      name:'',
      goodsOwnerOptions:[],
      warehouseOptions:[],
    };
  },
  created() {
    this.getGoodsOwner();
    this.getWarehouse();
  },
  methods: {
    addContent() {
      this.params.push({
        code: "",
        name: ""
      });
    },
    //删除新增内容
    removeDomain(item) {
      let index = this.params.indexOf(item);
      if (index !== -1) {
        this.params.splice(index, 1);
      }
    },
    //发送请求
    submitForm() {
      let param = this.params;
      let paramName, paramCode;
      let filter = this.filtersData;
      let obj = new Object();

      for (let i = 0; i < param.length; i++) {
        paramName = !!param[i].name ? param[i].name : '';
        paramCode = !!param[i].code ? param[i].code : '';
        if(!!paramName){
            obj[paramName] = paramCode;
        }
      }
      console.log(obj);
      this.request({
          url:filter._service + '/'+filter._url,
          method:filter._method,
          form:filter._form
      }
          , obj)
      .then(res =>{
         this.$message.success('成功')
      })
    },
    //同步库存新增
    //获取货主
    getGoodsOwner(){
       this.request(this.api.system.goodsOwner_getByUserId)
       .then(res =>{
          console.log(res);
           // this.goodsOwnerOptions=res;
           this.name=res.name;
           this.ayncFormData.goodsOwner=res.code;

       })
    },
    //获取仓库
    getWarehouse(){
       this.request(this.api.system.warehouse_getListByUser)
       .then(res =>{
          //console.log(res);
          this.warehouseOptions=res;
      })
     
    },
    //同步库存
    ayncForm(){
      this.request(this.api.product.productGoodsStock_synchronousStock,this.ayncFormData)
      .then(res =>{
         this.$message.success('同步成功')
      })
      .catch(err=>{
        this.$message.error('同步失败');
      })
    },

  }
};
</script>
<style lang="less" scoped>
.item-padding{
  padding: 20px
}
</style>
