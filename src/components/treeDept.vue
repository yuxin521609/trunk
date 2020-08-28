<!-- 树状选择器 -->
<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    :disabled="disabled"
    @show="onShowPopover"
    @hide="onHidePopover"
  >

    <el-tree
      ref="tree"
      class="select-tree"
      :highlight-current="true"
      :style="`min-width: ${treeWidth}`"
      :data="options"
      :props="props"
      :node-key="valType"
      :expand-on-click-node="true"
      :check-on-click-node="true"
      :default-expand-all="defaultExpandAll"
      :default-expanded-keys="defaultExpandedKeys"
      :current-node-key="valueModel"
      :filter-node-method="filterNode"
      @node-click="onClickNode"

    >
      <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i :class="node.icon"></i>
          {{ node.label }}
        </span>
      </span>-->
    </el-tree>
    <el-input
      slot="reference"
      ref="input"
      v-model="labelModel"
      clearable
      :disabled="disabled"
      suffix-icon="el-icon-arrow-down"
      @change="valueModel=''"
      :placeholder="placeholder"
    ></el-input>
  </el-popover>
</template>

<script>
export default {
  name: "tree-dept",
  props: {
    // 接收绑定参数
    value: null,
    valType: {
      default: "code",
      type: String
    },
    defaultExpandAll: {
      default: false,
      type: Boolean
    },
    // 输入框宽度
    width: String,
    type: {
      type: String,
      default: null
    },
    // 输入框占位符
    placeholder: {
      type: String,
      default: "请选择"
    },
    selType: {
      type: Number,
      default: null
    },
    // 是否禁用
    disabled: {
      type: Boolean
    }
  },
  watch: {
    value(val) {
      this.valueModel = val;
    },
    valueModel(val) {
      if (!val) {
        this.labelModel = "";
      }
    }
  },
  data() {
    return {
      options: [],
      // 菜单宽度
      treeWidth: "auto",
      // 输入框显示值
      labelModel: "",
      // 实际请求传值
      valueModel: this.value,
      props: {
        value: this.valType,
        label: "name",
        children: "sublist"
      },
      defaultExpandedKeys: []
    };
  },
  created() {
    if (this.valueModel != undefined)
      this.defaultExpandedKeys = [this.valueModel];

    this.getList();
    // 获取输入框宽度同步至树状菜单宽度
    this.$nextTick(() => {
      this.treeWidth = `${(this.width ||
        this.$refs.input.$refs.input.clientWidth) - 24}px`;
    });
  },
  updated() {
    var defaultNode = this.$refs.tree.getNode(this.valueModel);
    if (defaultNode) {
      this.labelModel = defaultNode.data[this.props.label];
    }
  },
  methods: {
    async getList() {
      var self = this;
      var requestParam;
      if (self.type) {
        requestParam = {
          type: self.type,
          used: true
        };
      } else {
        requestParam = {
          used: true
        };
      }

      var list = await this.request(this.api.user.DEPART_LIST_POST, requestParam);
      this.options = list;
    },
    filterNode(val, data) {
      if (!val) return true;
      var isCur = data[this.props.value] == val;
      if (isCur) {
        this.labelModel = data[this.props.label];
      }
      return isCur;
    },
    // 单击节点
    onClickNode(node) {
      console.log(node)
      if (
        this.selType == null ||
        (this.selType != null && this.selType == node.type)
      ) {
        this.labelModel = node[this.props.label];
        this.valueModel = node[this.props.value];
        this.$emit("getName",node)
        this.onCloseTree();
      }
    },
    // 隐藏树状菜单
    onCloseTree() {
      this.$refs.popover.showPopper = false;
    },
    // 显示时触发
    onShowPopover() {
      this.$refs.tree.filter(false);
    },
    // 隐藏时触发
    onHidePopover() {
      this.$emit("selected", this.valueModel);
      this.$emit("input", this.valueModel);
    }
  }
};
</script>

<style scoped>
 .el-input .el-input--suffix {
  cursor: pointer;
  overflow: hidden;
}
.el-input .el-input--suffix.rotate .el-input__suffix {
  transform: rotate(180deg);
}
.select-tree {
  max-height: 350px;
  overflow-y: scroll;
}
/* 菜单滚动条 */
.select-tree::-webkit-scrollbar {
  z-index: 11;
  width: 6px;
}
.select-tree::-webkit-scrollbar-track,
.select-tree::-webkit-scrollbar-corner {
  background: #fff;
}
.select-tree::-webkit-scrollbar-thumb {
  border-radius: 5px;
  width: 6px;
  background: #b4bccc;
}
.select-tree::-webkit-scrollbar-track-piece {
  background: #fff;
  width: 6px;
}
</style>

