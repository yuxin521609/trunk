<template>
  <el-select
    v-model="valModel"
    class="w-100"
    filterable
    clearable
    :multiple="multiple"
    :default-first-option="true"
    :placeholder="placeholder"
    :disabled="disabled"
  >
    <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code"></el-option>
  </el-select>
</template>
<script>
import * as types from "@/types/codeset";
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  props: {
    placeholder: "请选择",
    value: {
      default: null,
      type: Number | String
    },
    code: {
      required: true,
      default: null
    },
    multiple: {
      default: false,
      type: Boolean
    },
    // 是否禁用
    disabled: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      valModel: this.value,
      options: []
    };
  },
  watch: {
    value(val) {
      this.valModel = val;
    },
    valModel(val) {
      this.$emit("input", val);
    }
  },
  created() {
    if (this.code == undefined) console.error("param of code is not null");
    this.getList();
  },
  methods: {
    ...mapActions({
      getCodes: types.FN_FILTER_DATA
    }),
    async getList() {
      var res = await this.getCodes(this.code);
      var list = res.codeItemList.sort((a, b) => (a.sort > b.sort ? 1 : 0));
      this.options = list;
    }
  }
};
</script>
<style lang="less" scoped>
.w-100{
  width: 100%
}
</style>


