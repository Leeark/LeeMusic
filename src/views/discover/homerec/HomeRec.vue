<template>
  <div class="home-wrap">
    <!--轮播图 -->
    <HomeBanner :banner="banner" />
    <!-- 推荐歌单 -->
    <RecList :reclist="reclist" />
    <!-- 独家放送 -->
    <PrivateContent :privatecontent="privatecontent" />
  </div>
</template>

<script>
  // 页面数据获取
  import {
    getBanner,
    getReclist,
    getPrivatecontent,
  } from "@/request/discover/homerec.js";
  // 组件
  import HomeBanner from "./childcomps/HomeBanner";
  import RecList from "./childcomps/RecList";
  import PrivateContent from "./childcomps/PrivateContent";
  export default {
    components: { HomeBanner, RecList, PrivateContent },
    data() {
      return {
        banner: [],
        reclist: [],
        privatecontent: [],
      };
    },
    created() {
      // 获取轮播图数据
      getBanner().then((res) => {
        this.banner = res.data.banners;
        // console.log("#####", this.banner);
      });
      getReclist(15).then((res) => {
        this.reclist = res.data.result;
        // console.log("#####", this.reclist);
      });
      getPrivatecontent().then((res) => {
        this.privatecontent = res.data.result;
        // console.log("#####", this.privatecontent);
      });
    },
  };
</script>

<style lang="less">
  .home-wrap img:hover {
    box-shadow: 6px 6px 6px rgba(50, 53, 120, 0.6);
    opacity: 0.8;
  }
</style>
