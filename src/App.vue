<template>
  <keep-alive v-if="$route.meta.keepAlive">
     <router-view></router-view>
  </keep-alive>
  <router-view v-else></router-view>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
    @import "./assets/css/common/public.css";
</style>
