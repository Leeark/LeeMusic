<template>
  <div class="reclist">
    <el-divider content-position="left">
      <h2 class="comptitle">推荐歌单</h2>
    </el-divider>
    <div class="list">
      <div
        class="item"
        v-for="(item, index) in reclist"
        :key="index"
        @click="toPlaylist(item)"
      >
        <img v-lazy="item.picUrl" alt="" />
        <div class="item-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RecList",
    props: {
      reclist: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    methods: {
      toPlaylist(item) {
        // console.log(item);
        // 跳转到歌单页面，携带单个歌单的id作为params参数
        // 由于是一级路由，所以跳转后会覆盖同级路由，即首页推荐和推荐视频页面。
        this.$router.push("/Playlist/" + item.id);
      },
    },
  };
</script>

<style lang="less" scoped>
  .list {
    margin-top: 30px;
    display: grid;
    place-items: start center;
    gap: 28px;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(5, 1fr);
    .item {
      cursor: pointer;
      margin-bottom: 15px;
      img {
        width: 100%;
        height: 100%;
        border: 1px solid rgba(227, 227, 227, 0.81);
        border-radius: 10px;
      }

      .item-name {
        margin: 4px 8px 0px;
        text-align: left;
      }
    }
  }
</style>
