<style>
.el-popover{
    max-height: 400px !important;
    overflow-y: scroll;
    width: 280px;;
  }

</style>
<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    @show="onShowPopover"
    @hide="onHidePopover"
  >
    <tree-conent
      :options="options"
      v-model="valueModel"
      @selected="change"
      @fn-init-label="initLabel"
    ></tree-conent>
    <el-input
      slot="reference"
      ref="input"
      v-model="labelmodel"
      clearable
      suffix-icon="el-icon-arrow-down"
      @change="valueModel=''"
      :placeholder="placeholder"
    ></el-input>
  </el-popover>
</template>
<script>
import treeConent from "@/components/treePersonCon";
export default {
  name: "tree-person",
  props: {
    placeholder: "请选择",
    value: "",
    labelmodel:''
  },
  created(){

  },
  components: { treeConent },
  data() {
    return {
      options: [],
      valueModel: this.value
    };
  },
  watch: {
    value(val) {
      this.valueModel = val;
    },
    valueModel(val) {
      this.$emit("input", val);
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      let list = await this.request(this.api.user.DEPART_PERSON_LIST_POST);
      this.options = list;
    },
    change(val, name) {
      this.$emit('upData:labelmodel', name)
      // this.$emit("selected", val, name);
      this.$emit("input", {
        leaderId:val,
        leaderName:name
      });
      this.onCloseTree();
    },
    initLabel(name) {
      this.$emit('upData:labelmodel', name)
    },
    // 隐藏树状菜单
    onCloseTree() {
      this.$refs.popover.showPopper = false;
    },
    // 显示时触发
    onShowPopover() {},
    // 隐藏时触发
    onHidePopover() {
      this.$emit("input", this.valueModel);
    }
  }
};
</script>
