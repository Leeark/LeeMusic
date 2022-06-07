<template>
  <div class="search-wrap">
    <el-input placeholder="请输入内容" v-model="input" clearable size="small">
      <i slot="suffix" class="el-input__icon el-icon-search"></i>
    </el-input>
  </div>
</template>

<script>
  export default {
    name: "SearchInput",
    data() {
      return {
        input: "",
      };
    },
  };
</script>

<style lang="less" scoped>
  .search-wrap {
    position: relative;
    display: flex;
    align-items: center;
    .el-icon-search {
      cursor: pointer;
      &:hover {
        color: var(--themeColor);
        font-weight: 700;
      }
    }
  }
</style>
