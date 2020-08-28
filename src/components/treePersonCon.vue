<style scoped>
.ren li{
  margin-left: 35px;
}
.el-popover{
    height: 350px !important;
    overflow-y: scroll;
  }
 .jigou{
   line-height: 30px;
 }
 .jigou span,.ren span{
   cursor: pointer;
 }
</style>
<template>

  <div :style="{marginLeft:(gap*level)+'px'}">
    <div v-for="item in options" :key="item.id" >
      <span>{{item.name}}</span>
      <ul v-if="item.plist && item.plist.length>0" class="ren">
        <li
          v-for="per in item.plist"
          :key="per.userId"
          @click="clickPerson(per)"
          :selected="checkSelected(per)"
        > -- {{per.name}}</li>
      </ul>
      <ul v-if="item.sublist && item.sublist.length>0" class="jigou">
        <li v-for="jigou in item.sublist" :key="jigou.id">
          <tree-person-sub
            v-if="(jigou.sublist && jigou.sublist.length>0)||(jigou.plist&&jigou.plist.length>0)"
            :options="[jigou]"
            @selected="fnSelected"
            @fn-init-label="fnInitLabel"
            v-model="valModel"
            :level="level+1"
          ></tree-person-sub>
          <span v-else>{{jigou.name}}</span>
        </li>
      </ul>
    </div>
  </div>

</template>
<script>
export default {
  name: "tree-person-sub",
  props: {
    options: {
      default: function() {
        return [];
      }
    },
    value: "",
    level: {
      default: 0
    }
  },
  watch: {
    value(val) {
      this.valModel = val;
    },
    valModel(val) {
      this.$emit("input", val);
    }
  },
  data() {
    return {
      valModel: this.value,
      gap: 20
    };
  },
  methods: {
    clickPerson(item) {
      var uid = item.userId;
      this.fnSelected(uid, item.name);
    },
    fnSelected(uid, name) {
      this.$emit("selected", uid, name);
    },
    checkSelected(item) {
      var isSel = item.userId == this.valModel;
      if (isSel) {
        this.fnInitLabel(item.name);
      }
      return isSel;
    },
    fnInitLabel(name) {
      this.$emit("fn-init-label", name);
    }
  }
};
</script>
