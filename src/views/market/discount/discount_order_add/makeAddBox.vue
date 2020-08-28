
<template>
  <div>
    <div v-for="(item,index) of items" :key="index">
      <input type="text" v-model="item.value" />
      <input type="text" v-model="item.value" />
    </div>
    <button @click="onAdd">添加</button>
    <button @click="deleteRow(index)">添加</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [{ value: "", box: "" }],
    };
  },
  methods: {
    onAdd() {
      // 把要添加的 对象加进去
      this.items.push({ value: "", box: "" });
    },
    deleteRow(index) {
      this.items.splice(index, 1);
    },
  },
};
</script>