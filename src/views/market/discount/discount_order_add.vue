<template>
  <div>
    <div class="discountStores">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
        <!-- 模糊查询 -->
        <el-form-item label="使用门店：" prop="storeName">
          <el-select
            v-model="ruleForm.storeName"
            clearable
            filterable
            placeholder="请选择"
             @change="pitchOn"
          >
            <el-option
              v-for="(item, index) in storeList.data"
              :key="index"
              :label="item.name"
              :value="item.name"       
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 折扣方案类型： -->
        <el-form-item label="折扣方案类型：" prop="discount">
          <el-select
            v-model="ruleForm.discount"
            clearable
            filterable
            placeholder="请选择"
            @change="selectDiscount"
          >
            <el-option
              v-for="(item,index) in option"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <makeAddBox
      v-if="activeName === 0"
      :storeName="ruleForm.storeName"
      :dialogVisible="dialogVisible"
      :storeId="storeId"
    />
    <ladderAdd
      v-if="activeName === 1"
      :storeName="ruleForm.storeName"
      :dialogVisible="dialogVisible"
       :storeId="storeId"
    />
  </div>
</template>
<script>
import makeAddBox from "./discount_order_add/makeAddBox.vue";
import ladderAdd from "./discount_order_add/ladderAdd.vue";
export default {
  // 注册子组件
  components: {
    makeAddBox,
    ladderAdd,
  },
  data() {
    return {
      ruleForm: { storeName: "", discount: "" },
      storeId:"",
      storeList: {},
      activeName: "",

      option: [
        {
          label: "预约折扣1",
          value: 0,
        },
        {
          label: "阶梯折扣2",
          value: 1,
        },
      ],
      dialogVisible: false,
      rules: {
        storeName: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value && this.ruleForm.discount) {
                this.dialogVisible = true;
              } else {
                this.dialogVisible = false;
              }
            },
            trigger: "change",
          },
        ],
        discount: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value && this.ruleForm.storeName) {
                this.dialogVisible = true;
              } else {
                this.dialogVisible = false;
              }
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  // 加载之前
  created() {
    this.getStoreList();
  },
  // 执行方法
  methods: {
    //  选中的 门店 id
    pitchOn(name) {
      let add = this.storeList.data.find((v,j)=>{
        return name === v.name;
      });
      this.storeId = add.id
    },
    // 选择折扣方式时
    selectDiscount(item) {
      console.log(item);
      this.activeName = item;
    },
    // 获取店铺列表
    getStoreList() {
      this.request(this.api.store.storeBasic_list, {
        pricingPower: 0,
      }).then((res) => {
        this.storeList = res;
      });
    },
  },
};
</script>
<style lang="less">
.discountStores {
  height: 200px;
  background-color: #ffffff;
  margin: 10px 10px 0 10px;
  padding: 40px;
  .el-input {
    width: 270px;
  }
}
</style>
