<template>
  <div class="dis-wrap">
    <!-- 顶部导航栏 -->
    <TopNav :tabitem="topnavlist" />
    <!-- 展示内容区 -->
    <div class="content w">
      <!-- 二级路由展示 -->
      <!-- 首页推荐/精品歌单/歌曲排行/歌手查找 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import TopNav from "./TopNav";
  export default {
    components: {
      TopNav,
    },
    data() {
      return {
        topnavlist: [
          {
            name: "首页推荐",
            path: "/discover/homerec",
          },
          {
            name: "精品歌单",
            path: "/discover/recsonglist",
          },
          {
            name: "歌曲排行",
            path: "/discover/songrank",
          },
          {
            name: "歌手查找",
            path: "/discover/singerselect",
          },
          {
            name: "最新音乐",
            path: "/discover/latestsongs",
          },
        ],
      };
    },
  };
</script>

<style></style>
