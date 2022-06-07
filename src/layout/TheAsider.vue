<template>
  <div class="aside-wrap">
    <transition name="aside-fade">
      <div class="aside" v-if="isaside">
        <el-menu router default-active="">
          <el-menu-item
            v-for="item in subnavitem"
            :index="item.path"
            :key="item.path"
          >
            <span class="iconfont" :class="item.icon"></span>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
    </transition>

    <div class="aside-controller" @click="toggleAside">
      <div v-if="isaside" class="iconfont icon-up"></div>
      <div v-else class="iconfont icon-down"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TheAsider",
    data() {
      return {
        subnavitem: [
          { name: "发现音乐", path: "/discover", icon: "icon-fdmsc" },
          { name: "推荐视频", path: "/recvideo", icon: "icon-recvd" },
        ],
        isaside: true,
      };
    },
    methods: {
      toggleAside() {
        this.isaside = !this.isaside;
      },
    },
  };
</script>

<style lang="less" scoped>
  .aside-wrap {
    height: 100%;

    .aside {
      .el-menu {
        background-color: transparent;
        border: 0;
      }
    }

    // overflow: hidden;
    // border-right: 1px solid rgb(174, 169, 169);
    // .el-menu {
    //   border-right: 1px;
    // }
    .el-menu-item {
      height: 53px;
      line-height: 53px;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      background-color: transparent;
      border-radius: 8px;
    }
    .el-menu-item.is-active {
      color: var(--base-black);
      font-weight: 700;
      background: rgba(192, 192, 192, 0.2) !important;
    }
    .el-menu-item:hover {
      background: rgba(189, 189, 189, 0.2);
    }
  }
  span {
    padding-right: 8px;
  }

  // v-enter-active,
  // v-leave-active {
  //   transition: all 0.6s ease;
  // }
  // v-enter, v-leave-to
  // /* .slide-fade-leave-active for below version 2.1.8 */ {
  //   transform: translateY(-50%);
  //   opacity: 0;
  // }
  .aside-fade-enter-active,
  .aside-fade-leave-active {
    transition: all 0.6s ease;
  }
  .aside-fade-enter, .aside-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(-50%);
    opacity: 0;
  }
  .aside-controller {
    position: absolute;
    top: 0;
    left: 0;
    transition: all ease 0.3s;
    .icon-up,
    .icon-down {
      font-size: 20px;
      cursor: pointer;
    }
  }
  .aside-controller:active {
    transform: scale(1.2);
  }
</style>
