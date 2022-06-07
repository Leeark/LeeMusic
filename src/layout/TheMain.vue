<template>
  <div id="main">
    <div class="main-wrap">
      <!-- 一级路由展示 -->
      <!-- 发现音乐/推荐视频/其他……歌单之类的 -->
      <router-view class="view-wrap"></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TheMain",
    data() {
      return {};
    },
  };
</script>

<style lang="less" scoped></style>
