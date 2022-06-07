<template>
  <div id="app">
    <TheHeader></TheHeader>
    <div class="container">
      <TheAsider class="asider-container"></TheAsider>
      <TheMain class="main-container"></TheMain>
      <transition name="slide-up">
        <SongDetail
          v-if="Object.keys(playingSongInfo).length !== 0"
          v-show="showSongDetail"
        />
      </transition>
    </div>
    <!-- 设置ref,容易操纵audio的属性 -->
    <transition name="slide-left">
      <PlayingList v-show="showPlayingList" />
    </transition>
    <TheFooter
      ref="footer"
      v-if="Object.keys(playingSongInfo).length !== 0"
    ></TheFooter>
  </div>
</template>

<script>
  import TheHeader from "./layout/TheHeader/TheHeader";
  import TheMain from "./layout/TheMain";
  import TheFooter from "./layout/TheFooter";
  import TheAsider from "./layout/TheAsider";
  import SongDetail from "./components/SongDetail";
  import { mapState } from "vuex";
  import PlayingList from "./components/PlayingList";
  export default {
    name: "App",
    components: {
      TheHeader,
      TheMain,
      TheFooter,
      TheAsider,
      SongDetail,
      PlayingList,
    },
    data() {
      return {};
    },
    computed: {
      ...mapState(["showSongDetail", "showPlayingList", "playingSongInfo"]),
    },
    watch: {
      // 监视是否显示歌曲详情页，如果显示，禁止底层页面滚动。
      showSongDetail() {
        this.showSongDetail ? this.disableScroll() : this.openScroll();
      },
    },
    methods: {
      disableScroll() {
        let m = function (e) {
          e.preventDefault();
        };
        document.body.style.overflow = "hidden";
        document.addEventListener("touchmove", m, { passive: false });
      },
      openScroll() {
        let m = function (e) {
          e.preventDefault();
        };
        document.body.style.overflow = "";
        document.removeEventListener("touchmove", m, { passive: true });
      },
    },
  };
</script>

<style lang="less">
  @import "assets/css/base.css";
  /* #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;

    color: #2c3e50;
    margin-top: 60px;
  } */
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
  .container {
    padding: 68px 5vw;
    display: flex;
    justify-content: center;
    align-items: flex-start;

    .asider-container {
      position: absolute;
      left: 2vw;
    }
  }

  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: transform 0.4s ease;
  }
  .slide-up-enter,
  .slide-up-leave-to {
    transform: translateY(100%);
  }

  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: transform 0.4s ease;
  }
  .slide-left-enter,
  .slide-left-leave-to {
    transform: translateX(100%);
  }
</style>
