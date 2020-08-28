<template>
    <el-main>
        <slot name="topBar"></slot>
        <router-view ref="main"></router-view>
    </el-main>
</template>
<script>
  export default {
      name: "v-main",
  }
</script>
<style scoped>
</style>
