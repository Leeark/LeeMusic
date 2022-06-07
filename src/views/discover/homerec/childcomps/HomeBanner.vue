<template>
  <div class="banner">
    <el-carousel :interval="4000" type="card" height="220px">
      <el-carousel-item v-for="(item, index) in banner" :key="index">
        <img :src="item.imageUrl" alt="" @click="playMusic(item)" />
        <!-- 轮播图小标题 -->
        <h3 class="medium">{{ item.typeTitle }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  // import { getSongUrl } from "@/request/songinfo/songinfo";
  export default {
    name: "HomeBanner",
    props: {
      banner: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    methods: {
      playMusic(item) {
        // // 异步请求放进actions里
        // // console.log("###", item);
        // getSongUrl(item.targetId).then((res) =>
        //   // console.log("&&&", res.data.data[0].url)
        //   {
        //     this.$store.dispatch("SaveSongUrl", res.data.data[0].url);
        //   }
        // );
        this.$store.dispatch("saveSongUrl", item.targetId);
      },
    },
  };
</script>

<style lang="less" scoped>
  .banner {
    position: relative;
    img {
      width: 100%;
    }
  }
  h3 {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 3px 8px;
    color: rgb(69, 72, 74);
    font-size: 12px;
    background: var(--themeColor);
    border-radius: 8px;
  }
  .el-carousel__item {
    border-radius: 10px;
  }
</style>
