<style lang="less" scoped></style>
<template>
  <span>
    <el-form-item :label="label" :prop="propsOptions.timeBegin">
      <el-date-picker v-model="formData[propsOptions.timeBegin]" type="date" placeholder="开始日期" :picker-options="pickerBeginOptions"></el-date-picker>
    </el-form-item>
    <el-form-item :prop="propsOptions.timeEnd">
      <el-date-picker v-model="formData[propsOptions.timeEnd]"  @change="handleEndPicker" type="date" placeholder="结束日期" :picker-options="pickerEndOptions"></el-date-picker>
    </el-form-item>
  </span>
</template>
<script>
  export default {
    name: 'time-interval-check',
    props: {
      // label文字
      label: {
        default: '创建时间：'
      },
      // 参数对象
      formData: {
        default() {
          return {}
        }
      },
      // 字段映射
      propsOptions: {
        default() {
          return {
            timeBegin: 'createTimeBegin',
            timeEnd: 'createTimeEnd',
          }
        }
      }
    },
    // 数据
    data() {
      return {
        // 时间禁选
        pickerBeginOptions: {
          disabledDate: (time) => {
            let timeEnd = this.formData[this.propsOptions.timeEnd];
            if (timeEnd) {
              return time.getTime() > timeEnd  ||  time.getTime() > Date.now();
            } else {
              return time.getTime() > Date.now();
            }
          }
        },
        pickerEndOptions: {
          disabledDate: (time) => {
            return time.getTime() < this.formData[this.propsOptions.timeBegin] || time.getTime() > Date.now();
          }
        },
      }
    },
    // 方法
    methods: {
      handleEndPicker() {
      const endTime = this.handleEndTime(this.formData[this.propsOptions.timeEnd]);
      this.formData[this.propsOptions.timeEnd] = endTime;
    },
    // 时间处理
    // eslint-disable-next-line consistent-return
    handleEndTime(val) {
      if (val != null) {
        const date = new Date(val);
        const t = (date.getTime() / 1000 + 86399) * 1000;
        return new Date(t);
      }
    }
    },
  }
</script>
