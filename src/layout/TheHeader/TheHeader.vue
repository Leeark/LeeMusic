<template>
  <div class="head-wrap">
    <!-- 标题 -->
    <div class="title">
      <div class="iconfont icon-logo"></div>
      <span>LeeMusic</span>
    </div>
    <!-- 搜索 -->
    <div class="search"><SearchInput /></div>
    <!-- 登录 -->
    <div class="login-wrap">
      <div class="iconfont icon-user"></div>
      <span>点击头像登录</span>
    </div>
  </div>
</template>

<script>
  import SearchInput from "./Searchinput/SearchInput";
  export default {
    name: "TheHeader",
    components: {
      SearchInput,
    },
  };
</script>

<style lang="less" scoped>
  .head-wrap {
    position: fixed;
    top: 0;
    left: 0;
    height: 64px;
    width: 100%;
    z-index: 9;
    padding: 0 8vw 0 8vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 8px 8px;
    backdrop-filter: grayscale(10%) blur(10px);
    background-color: var(--themecolor);
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      color: rgb(255, 255, 255);
      .icon-logo {
        font-size: 30px;
        margin-right: 10px;
      }
      span {
        font-size: 20px;
      }
    }

    .search {
      flex: 1;
      margin-left: 2vw;
    }

    .login-wrap {
      flex: 4;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .icon-user {
        background-color: rgb(207, 207, 207);
        border-radius: 50%;
        font-size: 26px;
        margin-right: 12px;
      }
      span {
        font-size: 14px;
        color: rgb(49, 12, 85);
      }
    }
  }
</style>
