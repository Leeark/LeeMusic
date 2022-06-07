<template>
  <!-- 顶部导航 -->
  <div class="top-nav">
    <el-menu router :default-active="$route.path" mode="horizontal">
      <el-menu-item v-for="item in tabitem" :index="item.path" :key="item.path">
        {{ item.name }}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: "TopNav",
    props: {
      tabitem: {
        type: Array,
        default() {
          return [];
        },
      },
    },
  };
</script>

<style lang="less" scoped>
  .top-nav {
    width: 100%;
    display: flex;
    justify-content: center;
    // grid-template-columns: repeat(3, 1fr);
  }

  el-menu {
    border: 0;
  }
  el-menu-item {
    color: #303133;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
  }
  el-menu--horizontal > el-menu-item.is-active {
    border-bottom: 3px solid var(--mycompColor);
    font-size: 18px;
    color: var(--mycompColor);
  }
</style>
