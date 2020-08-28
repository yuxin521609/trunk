<template>
  <!-- 阶梯折扣 -->
  <div class="ladderDiscount" v-if="dialogVisible">
    <el-form :model="ruleForm" label-width="150px" :rules="rules" ref="ruleForm">
      <!-- 模糊查询 -->
      <el-form-item label="梯形折扣类型：" prop="type1">
        <el-select
          v-model="ruleForm.type1"
          placeholder="请选择"
          clearable
          filterable
          @change="selectDiscount"
        >
          <el-option
            v-for="(item,index) in option1"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="设置阶梯：" prop="input1">
        <div class="mitigate">
          <div v-for="(item,index) of input1" :key="index">
            <div v-if="activeName === 0">
              满
              <el-input v-model="item.quantity"></el-input>件 ,
              打
              <el-input v-model="item.value"></el-input>折
              <i class="el-icon-remove mlr10px" @click="deleteLadderItem(index)"></i>
            </div>

            <div v-if="activeName === 1">
              满
              <el-input v-model="item.quantity"></el-input>元 ,
              打
              <el-input v-model="item.value"></el-input>折
              <i class="el-icon-remove mlr10px" @click="deleteLadderItem(index)"></i>
            </div>

            <div v-if="activeName === 2">
              满
              <el-input v-model="item.quantity"></el-input>件 ,
              减
              <el-input v-model="item.value"></el-input>元
              <i class="el-icon-remove mlr10px" @click="deleteLadderItem(index)"></i>
            </div>

            <div v-if="activeName === 3">
              满
              <el-input v-model="item.quantity"></el-input>元 ,
              减
              <el-input v-model="item.value"></el-input>元
              <i class="el-icon-remove mlr10px" @click="deleteLadderItem(index)"></i>
            </div>
          </div>

          <el-button @click="addLadder">增加阶梯</el-button>
        </div>
      </el-form-item>

      <!-- 确定 取消 -->
      <div class="confirm">
        <el-button type="primary" @click="confirmAdd('ruleForm')">确定</el-button>
        <el-button type="primary" @click="alreadyAdd('ruleForm')">验证全部input</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    storeName: {
      type: String,
      default: '',
    },
    storeId: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      activeName: '',
      storeDiscountParameterVOS: [],
      input1: [
        {
          quantity: '',
          value: '',
        },
      ],
      ruleForm: {
        type1: '',
      },
      option1: [
        {
          label: '满数量打折',
          value: 0,
        },
        {
          label: '满金额打折',
          value: 1,
        },
        {
          label: '满数量减免指定金额',
          value: 2,
        },
        {
          label: '满金额减免指定金额',
          value: 3,
        },
      ],

      rules: {
        type1: [
          {
            required: true,
            message: '请输入活动名称',
            trigger: ['blur', 'change'],
          },
        ],
        input1: [
          {
            required: true,
            validator: (rule, value, callback) => {
              // 校验 不能为空值
              let inputArr = []
              this.input1.forEach((item) => {
                inputArr.push(item.quantity)
                inputArr.push(item.value)
              })
              let checkInputTF = inputArr.every((item) => {
                return item
              })
              if (!checkInputTF) {
                callback(new Error('阶梯填写项不能为空'))
              }
              // 校验 具体输入
              let inputQuantity = []
              let inputValue = []
              this.input1.forEach((item) => {
                inputQuantity.push(item.quantity)
                inputValue.push(item.value)
              })
              // 校验 满 打折
              if (this.activeName < 2) {
                let checkInputQuantity = inputQuantity.every((item) => {
                  return /^[1-9]+$/g.test(item) // test正则方法：测试item是否符合指定的正则表达式
                })
                if (!checkInputQuantity) {
                  let text = this.activeName === 0 ? '件数' : '金额'
                  callback(new Error(`请输入正确的${text}`))
                }
                let checkInputValue = inputValue.every((item) => {
                  return /(^[1-9](\.\d)?$)|(^[0]\.[1-9]$)/g.test(item) // test正则方法：测试item是否符合指定的正则表达式
                })
                if (!checkInputValue) {
                  callback(new Error(`请输入正确的折扣`))
                }
              }
              // 校验 满 减免金额
              if (this.activeName > 1) {
                let checkInputQuantity = inputQuantity.every((item) => {
                  return /^[1-9]+$/g.test(item) // test正则方法：测试item是否符合指定的正则表达式
                })
                if (!checkInputQuantity) {
                  let text = this.activeName === 2 ? '件数' : '满金额'
                  callback(new Error(`请输入正确的${text}`))
                }
                let checkInputValue = inputValue.every((item) => {
                  return /^[1-9]+$/g.test(item) // test正则方法：测试item是否符合指定的正则表达式
                })
                if (!checkInputValue) {
                  callback(new Error(`请输入正确减免金额`))
                }
              }

              // 校验 重复的件数-满金额
              if (this.input1.length > 0) {
                let quantityAdd = []
                let valueAdd = []
                this.input1.forEach((item, index) => {
                  quantityAdd.push(item.quantity)
                  valueAdd.push(item.value)
                })
                let ary = quantityAdd.sort()
                let arys = valueAdd.sort()
                for (var i = 0; i < ary.length - 1; i++) {
                  if (ary[i] == ary[i + 1]) {
                    callback(new Error(`请输入 1不同的折扣方案`))
                  }
                }
                for (var i = 0; i < arys.length - 1; i++) {
                  if (arys[i] == arys[i + 1]) {
                    callback(new Error(`请输入 2不同的折扣方案`))
                  }
                }
              }

              // 减免的金额不能比 阶梯金额高
              if (this.activeName == 3) {
                let comparisonSum = this.input1.every((item, index) => {
                  return parseInt(item.quantity) <= parseInt(item.value)
                })
                if (comparisonSum) {
                  callback(new Error(`减免金额不能超过阶梯金额`))
                }
              }
            },
            trigger: ['change'],
          },
        ],
      },
    }
  },

  // 执行方法
  methods: {
    // 全部验证
    alreadyAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击删除 阶梯
    deleteLadderItem(index) {
      this.input1.splice(index, 1)
    },
    // 点击增加 阶梯
    addLadder() {
      this.input1.push({
        quantity: '',
        value: '',
      })
      this.addIndex()
    },
    addIndex() {
      this.storeDiscountParameterVOS = []
      const ladderDiscountType = this.activeName
      let discountType = null
      let type = null
      switch (ladderDiscountType) {
        case 0:
          discountType = 1
          type = 1
          break
        case 1:
          discountType = 0
          type = 1
          break
        case 2:
          discountType = 1
          type = 0
          break
        case 3:
          discountType = 0
          type = 0
          break
      }
      this.input1.forEach((item) => {
        const obj = {
          discountType,
          quantity: item.quantity,
          type,
          value: item.value,
        }
        this.storeDiscountParameterVOS.push(obj)

        console.log(this.storeDiscountParameterVOS)
      })
    },
    // 点击确定：验证门店 折扣方案类型
    confirmAdd(ruleForm) {
      console.log(555)
      this.$refs[ruleForm].validate((valid) => {
        console.log(valid)
        console.log(777)
        if (valid) {
          alert('submit!')
          let url = this.api.market
            .marketingMiddleground_createDiscountParameter
          let data = {
            storeDiscountParameterVOS: this.storeDiscountParameterVOS, // 折扣 金额
            storeId: this.storeId, // 门店id
            storeName: this.storeName, // 门店名称
          }
          this.request(url, data, true).then((res) => {
            this.$router.push('discount_manage_list')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击添加 阶梯折扣
    // confirmAdd() {
    //   // 把input数据添加到this.storeDiscountParameterVOS
    //   this.addIndex();
    //   // 检测门店是否已创建
    //   this.request(
    //     this.api.market.marketingMiddleground_confirmDiscountByStoreId,
    //     {
    //       storeId: this.storeId, // 门店id
    //       type: this.storeDiscountParameterVOS[0].type,
    //       discountType: this.storeDiscountParameterVOS[0].discountType,
    //       discount: this.storeDiscountParameterVOS[0].discountType,
    //     }
    //   ).then((res) => {
    //     if (res.confirm) {
    //       alert("已创建折扣方案!");
    //     } else {
    //       alert("可以创建");

    //       //  发送请求
    //       this.request(
    //         this.api.market.marketingMiddleground_createDiscountParameter,
    //         {
    //           storeDiscountParameterVOS: this.storeDiscountParameterVOS, // 折扣 金额
    //           storeId: this.storeId, // 门店id
    //           storeName: this.storeName, // 门店名称
    //         }
    //       ).then((res) => {
    //         this.$router.push("discount_manage_list");
    //       });
    //     }
    //   });
    // },

    // 选择折扣方式时
    selectDiscount(item) {
      this.activeName = item
      this.input1 = []
    },
    // 取消时 回到折扣列表
    cancel() {
      this.$router.push('discount_manage_list')
    },
  },
}
</script>
<style lang="less">
.ladderDiscount {
  height: 100%;
  background-color: #ffffff;
  margin: 0 10px 10px;
  padding: 40px;

  .el-tabs__item {
    height: 0px;
    background-color: #ffffff;
  }
  .el-input {
    width: 270px;
  }
  .confirm {
    margin-left: 150px;
  }
  .mitigate {
    width: 330px;
    border: 1px solid gray;
    border-radius: 2%;
    padding: 15px;
    .el-input {
      width: 90px;
    }
    .el-input__inner {
      height: 28px;
      width: 90px;
    }
    .el-button {
      margin: 17px;
      padding: 8px 18px;
    }
    .mlr10px {
      margin-left: 10px;
    }
  }
}
</style>
