<template>
  <div id="footer">
    <div class="progress">
      <!-- 默认max是100 -->
      <vue-slider
        ref="slider"
        v-model="currentTime"
        :tooltip-formatter="formatTime"
        :max="song.duration"
        :drag-on-click="true"
        :dotSize="8"
        :height="3"
        :lazy="true"
        :duration="0"
        @change="changeAudioTime"
      ></vue-slider>
    </div>
    <div class="controls">
      <audio
        :src="songUrl"
        autoplay
        ref="audio"
        @loadedmetadata="onLoadedmetadata"
        @timeupdate="ThrottleGetCurrentTime"
        @ended="playmodel !== 3 ? loopPlay() : toggleSong(1)"
      ></audio>
      <div class="left-control">
        <div class="song-photo">
          <img v-lazy="playingSongInfo.al.picUrl" alt="" />
        </div>

        <div class="song-info">
          <span class="song-name"> {{ playingSongInfo.name }}</span>

          <span class="artist-name"> {{ playingSongInfo.ar[0].name }}</span>
        </div>
      </div>
      <div class="center-control">
        <div class="iconfont icon-presong" @click="toggleSong(-1)"></div>
        <div class="playstate" @click="changePlaySong()">
          <div
            class="iconfont"
            :class="isplay ? 'icon-play' : 'icon-pause'"
          ></div>
        </div>
        <div class="iconfont icon-nextsong" @click="toggleSong(1)"></div>
      </div>
      <div class="right-control">
        <div class="play-mode">
          <el-tooltip
            content="顺序播放"
            placement="top"
            effect="light"
            v-show="playmodel == 1"
          >
            <div class="iconfont icon-shunxu" @click="changePlayModel(2)"></div>
          </el-tooltip>
          <el-tooltip
            content="随机播放"
            placement="top"
            effect="light"
            v-show="playmodel == 2"
          >
            <div class="iconfont icon-random" @click="changePlayModel(3)"></div>
          </el-tooltip>
          <el-tooltip
            content="单曲循环"
            placement="top"
            effect="light"
            v-show="playmodel == 3"
          >
            <div class="iconfont icon-single" @click="changePlayModel(1)"></div>
          </el-tooltip>
        </div>
        <div class="voice-control">
          <div
            class="iconfont"
            :class="volume == 0 ? 'icon-muted' : 'icon-voice'"
          ></div>
          <div class="voice-bar">
            <vue-slider
              v-model="volume"
              :min="0"
              :max="1"
              :drag-on-click="true"
              :duration="0"
              tooltip="none"
              :dot-size="8"
              :interval="0.01"
              @change="changeVolume"
            ></vue-slider>
          </div>
        </div>
        <div class="iconfont icon-playlist" @click="togglePlayingList"></div>
        <div
          class="iconfont"
          :class="showSongDetail ? 'icon-down' : 'icon-up'"
          @click="toggleSongDetail"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
  import VueSlider from "vue-slider-component";
  import "@/assets/css/slider.css";
  import { mapState } from "vuex";
  import { checkMusic } from "@/request/songsinfo.js";
  import { formatTime, throttle, getRandom } from "@/common/utils.js";
  export default {
    name: "ThFooter",
    components: {
      VueSlider,
    },
    data() {
      return {
        playmodel: localStorage.getItem("playmodel") || 1,
        song: {
          duration: 600,
          formatduration: "00:00",
        },
        volume: localStorage.getItem("volume") || 0.5,
        isdragging: false,
      };
    },

    computed: {
      ...mapState(["songUrl", "playingList", "playingSongInfo"]),
      isplay: {
        get() {
          return this.$store.state.isplay;
        },
        set(payload) {
          this.$store.commit("ChangePlayState", payload);
        },
      },
      showSongDetail: {
        get() {
          return this.$store.state.showSongDetail;
        },
        set(payload) {
          this.$store.commit("ChangeSongDetailState", payload);
        },
      },
      showPlayingList: {
        get() {
          return this.$store.state.showPlayingList;
        },
        set(payload) {
          this.$store.commit("ChangePlayingListState", payload);
        },
      },
      currentTime: {
        get() {
          return this.$store.state.currentTime;
        },
        set(payload) {
          this.$store.commit("SaveCurrentTime", payload);
        },
      },
    },
    watch: {
      isplay() {
        this.isplay ? this.$refs.audio.play() : this.$refs.audio.pause();
      },
      // 因为涉及到拖动进度条改变audio 的 currenttime,不可以简单监视进度条。
    },
    created() {
      // 成功了！！！！！！！！！！！！
      this.ThrottleGetCurrentTime = throttle((e) => {
        if (!this.isplay) return;
        // 进度条在抖动，设置个intervalXXXXXXXXXXXXXX不可以，会溢出。
        const current = parseInt(e.target.currentTime);
        this.currentTime = current;
        // console.log("####", this.currentTime);
      }, 1000);
    },
    mounted() {
      this.$refs.audio.volume = this.volume;
    },

    // mounted() {
    //   this.isplay = false;
    // },
    methods: {
      // 播放和暂停按钮
      async changePlaySong() {
        // 刷新后的this.$refs.audio.src：http://localhost:8080/
        // 刚进入页面后没有URL，先发下请求。
        if (!this.songUrl) {
          this.$store.dispatch("saveSongUrl", this.playingSongInfo.id);
          // 请求到url后直接修改状态会报错：Uncaught (in promise) DOMException: The element has no supported sources.
          // 添加歌曲到当前播放列表
          this.$store.commit("AddSong", this.playingSongInfo);
          // 放进canplay的回调，写成
          this.$refs.audio.addEventListener("canplay", () => {
            this.isplay = true;
          });
        } else {
          this.isplay = !this.isplay;
        }
      },
      // 音频加载完毕do sth
      // 由于使用默认max=100，拖动进度条，提示框不会变，所以把歌曲总时长作为总长度。当前时间作为进度条。
      onLoadedmetadata(e) {
        // this.totalSecond = res.target.duration; //获取总秒数
        // console.log(this.totalSecond);

        this.song.duration = parseInt(e.target.duration);
        // console.log(this.song.duration);
        // console.log(this.song.duration);
        this.song.formatduration = formatTime(e.target.duration); //格式化为分钟
        // this.setItem("totalTime", this.totalTime); //缓存总时长分钟，用于刷新后显示
        // this.setItem("totalSecond", this.totalSecond);
      },
      // 在timeupdate里写setInterval，感觉栈溢出了，运用下节流函数。怎么使用节流？？？
      // GetCurrentTime(e) {
      //   if (!this.isplay) return;
      //   // 进度条在抖动，设置个intervalXXXXXXXXXXXXXX不可以，会溢出。
      //   const current = parseInt(e.target.currentTime);
      //   this.currentTime = current;
      // },

      // 进度条控制音频时间
      changeAudioTime(value) {
        this.$refs.audio.currentTime = value;
      },
      // 进度条控制音频音量
      changeVolume(value) {
        // 修改音量进度条
        this.volume = value;
        //  修改音频音量由watch监视this.volume的改变来做。
        localStorage.setItem("volume", value);
        this.$refs.audio.volume = value;
      },
      // 切换展示播放歌曲详情。
      toggleSongDetail() {
        this.showSongDetail = !this.showSongDetail;
      },
      togglePlayingList() {
        this.showPlayingList = !this.showPlayingList;
      },

      // 上一曲/下一曲
      toggleSong(type) {
        if (!this.playingList.length) {
          this.$message({
            message: "播放列表空空如也",
            type: "warning",
            center: true,
          });
          return;
        } else if (this.playingList.length == 1) {
          this.$message({
            message: "播放列表只有一首歌",
            type: "warning",
            center: true,
          });
          return;
        } else {
          // playmodel:1:顺序；2：随机；3：单曲循环。
          // 不写严格相等。写了严格相等会顺序播放，因为存在localstorage里的是字符串。
          if (this.playmodel != 2) {
            // 如果模式不是随机
            // 顺序播放 type等于-1上一曲 否则下一曲
            this.orderPlay(type);
          }
          // 随机播放
          else {
            // console.log("随机播放中");
            this.randomPlay();
          }
        }
      },
      // 播放模式

      // 切换播放模式
      changePlayModel(model) {
        // 先关闭循环播放
        this.$refs.audio.loop = false;
        this.playmodel = model;
        localStorage.setItem("playmodel", model);
      },
      // 检查切换的歌曲
      checkToggleSong(song) {
        checkMusic(song.id)
          .then(() => {
            // 通知actions获取url
            this.$store.dispatch("saveSongUrl", song.id);
            // 把当前歌曲的信息保存在store里。
            this.$store.commit("SaveSongInfo", song);
            this.isplay = true;
            // console.log(song.id, "检查完毕");
          })
          .catch(() => {
            this.$message({
              message: "暂无音源，已切换至下一首",
              type: "warning",
              center: true,
            });
            this.$store.commit("DeleteSong", song.id);
            // 切换至顺序的下一首。
            this.orderPlay(1);
          });
      },
      // 顺序播放
      orderPlay(type) {
        // -1上一首；1下一首
        // 找到当前播放歌曲的索引
        let nowIndex = this.playingList.findIndex((item) => {
          // 写了{}要写return，否则永远是-1
          return this.playingSongInfo.id == item.id;
        });
        // console.log("当前索引", nowIndex);
        let toggledIndex;
        switch (nowIndex) {
          // 默认情况:
          default:
            toggledIndex = type == -1 ? nowIndex - 1 : nowIndex + 1;
            break;
          // 列表中没有
          case -1:
            toggledIndex = 0;
            break;
          // 第一首
          // 判断type是上一首还是下一首
          case 0:
            toggledIndex =
              type == -1 ? this.playingList.length - 1 : nowIndex + 1;
            break;
          // 最后一首
          case this.playingList.length - 1:
            toggledIndex = type == -1 ? nowIndex - 1 : 0;
        }
        let toggledSong = this.playingList[toggledIndex];
        // console.log("切换索引", toggledIndex, toggledSong.id);
        this.checkToggleSong(toggledSong);
      },
      // 随机播放,有时会随机到自己，显得好像没变似的。
      randomPlay() {
        let randIndx = getRandom(0, this.playingList.length - 1);
        let randSong = this.playingList[randIndx];
        this.checkToggleSong(randSong);
      },
      // 单曲循环
      loopPlay() {
        this.$refs.audio.loop = true;
        // watch监听不到，需要手动切换isplay一下才能单曲循环，直接命令audioplay一下。
        // this.isplay = true;
        this.$refs.audio.play();
      },
      // 格式化时间
      formatTime(time) {
        // 如果超过了100000 基本都是毫秒为单位的了 先转成秒的
        time = parseInt(time);
        if (time > 10000) {
          time = Math.floor(time / 1000);
        } else {
          time = Math.floor(time);
        }
        // 计算分钟和秒
        let m = Math.floor(time / 60);
        let s = Math.floor(time % 60);
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        return m + ":" + s;
      },
    },
  };
</script>

<style lang="less" scoped>
  #footer {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    height: 68px;
    z-index: 999;
    background: #f8f8ff;
    backdrop-filter: saturate(80%) blur(20px);
    .iconfont {
      color: black;
      cursor: pointer;
      font-size: 18px;
      border-radius: 5px;
    }
    .iconfont:hover {
      background-color: rgba(211, 211, 211, 0.5);
    }
    // border-top: 1px solid #dddddd;
    .progress {
      margin-top: -6px;
    }
    .controls {
      padding: 0 10vw 0 10vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .left-control {
      flex: 1;
      height: 60px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .song-photo img {
        width: 48px;
        height: 48px;
        // object-fit: cover;
        border-radius: 5px;
        box-shadow: 0 6px 8px -2px rgb(0 0 0 16%);
      }
      .song-info {
        margin-left: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        text-align: flex-start;
        .song-name {
          font-weight: 600;
          font-size: 16px;
          color: var(--base-black);
          margin-bottom: 4px;
          display: -webkit-box;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        .artist-name {
          font-size: 12px;
          font-weight: 468;
          color: var(--base-black);
          opacity: 0.76;
          // margin-left: 2px;
          padding-left: 2px;
          border-left: 2px solid var(--info-color);
          // border-radius: 2px;
          line-height: 100%;
          display: -webkit-box;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
      }
    }
    .center-control {
      flex: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      // font-size: 40px;
      .icon-play,
      .icon-pause {
        margin: 0 2vw 0 2vw;
        font-size: 30px;
      }
      .icon-presong,
      .icon-nextsong {
        font-size: 22px;
        color: rgba(0, 0, 0, 0.8);
      }
    }
    .right-control {
      flex: 1;
      display: flex;
      justify-content: space-around;
      gap: 2vw;
      align-items: center;
      font-weight: 600;
      .play-mode,
      .icon-playlist,
      .icon-up,
      .icon-down {
        flex: 1;
      }
      .voice-control {
        flex: 2;
        display: flex;
        align-items: center;
        gap: 2px;
        .icon-voice,
        .icon-muted {
          flex: 1;
        }
        .voice-bar {
          flex: 3;
        }
      }
    }
  }
</style>
