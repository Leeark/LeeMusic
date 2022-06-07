<template>
  <div class="prilist">
    <el-divider content-position="left">
      <h2 class="comptitle">独家放送</h2>
    </el-divider>
    <div class="list">
      <div class="item" v-for="(item, index) in privatecontent" :key="index">
        <img v-lazy="item.picUrl" alt="" />
        <!-- 独家放送标题 -->
        <div class="item-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PrivateContent",
    props: {
      privatecontent: {
        type: Array,
        default() {
          return [];
        },
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
    // grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
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
