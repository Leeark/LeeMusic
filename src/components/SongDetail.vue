<template>
  <div class="songdetail-page">
    <div class="left-wrap">
      <div class="song-img">
        <img :src="playingSongInfo.al.picUrl" alt="" class="img" />
        <img :src="playingSongInfo.al.picUrl" alt="" class="bac" />
      </div>
      <div class="song-info">
        <div class="song-name" @click="toAlbum(playingSongInfo)">
          <span>{{ playingSongInfo.name }}</span>
        </div>
        <div class="ar-al">
          <span class="song-artist">{{ playingSongInfo.ar[0].name }} </span>—
          <span class="song-of-album" @click="toAlbum(playingSongInfo)">
            {{ playingSongInfo.al.name }}
          </span>
        </div>
      </div>
    </div>
    <div class="right-wrap">
      <div class="lyric-container">
        <div class="top-shadow"></div>
        <div class="top-margin"></div>
        <div class="lyrics-wrap" ref="lyrics">
          <div
            class="lyrics"
            v-for="(item, index) in translyric"
            :key="index"
            :class="{ current: index == currentRow }"
            @click="SetCurrentTime(item.time)"
          >
            <div class="lyric">{{ item.text }}</div>
          </div>
        </div>

        <div class="bottom-shadow"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import { getSongLyric } from "@/request/songsinfo.js";

  export default {
    name: "SongDetail",
    computed: {
      ...mapState(["playingSongInfo"]),
      currentTime: {
        get() {
          return this.$store.state.currentTime;
        },
        set(payload) {
          this.$store.commit("SaveCurrentTime", payload);
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
    },
    data() {
      return {
        // 存储对象：{time:***;text:''}
        translyric: [],
        currentRow: -1,
      };
    },
    created() {
      this.saveSongLyric(this.playingSongInfo.id);
    },
    mounted() {
      // this.disableScroll();
    },
  watch: {
      playingSongInfo: {
        deep: true,
        handler(info) {
          // console.log("我看见你了", info.id);
          this.translyric = [];
          this.saveSongLyric(info.id);
        },
      },
      currentTime() {
        if (this.currentTime != 0) {
          // 遍历格式化后的歌词数组
          this.translyric.forEach((item, index) => {
            // 如果歌曲当前秒数和歌词数组中的秒数相等
            // 这里写==可以在使用原生scroll实现歌词滚动的时候不抖动，如果写>=会抖动
            if (this.currentTime == item.time) {
              //.1 使用位移来实现歌词滚动
              // 位移之后无法移回去。怎么控制当前显示位置。
              this.$refs.lyrics.style.transform = `translateY(${
                -45 * index
              }px)`;
              this.currentRow = index;
              //用于判断当前歌词高亮显示(使用vuex是因为在footer中使用到了currentRow)
              //.2 使用原生scroll实现歌词滚动
              // // 当鼠标经过时停止滚动
              // if (!this.isActive) {
              //   this.$refs.scrollLyric.scrollTo({
              //     top: 45 * index,
              //     behavior: "smooth",
              //   });
              // }
            }
          });
        }
      },
    },
    methods: {
      saveSongLyric(id) {
        getSongLyric(id).then((res) => {
          if (res.data.nolyric) return; //如果没有歌词就return
          let lyrics = res.data.lrc.lyric;
          this.formatLyric(lyrics);
        });
      },
      SetCurrentTime(time) {
        this.currentTime = time;
        //由于设置throttle每隔一段时间拿到当前currenttime，所以不能将audio的时间直接watchcurrenttime，否则会出现时间回滚。
        // 那么如何使用该组件中的time控制另一个组件中的dom
        // 写成这样：
        // console.log("####", this.$parent.$refs.footer);
        this.$parent.$refs.footer.$refs.audio.currentTime = time;
      },
      toAlbum(song) {
        // 避免重复跳转同一个页面
        const path = `/album/${song.al.id}`;
        if (this.$route.path !== path) {
          this.$router.push("/album/" + song.al.id);
        }
        // 让歌词页消失
        this.showSongDetail = false;
      },
      formatLyric(text) {
        let arr = text.split("\n"); //原歌词文本已经换好行了方便很多，我们直接通过换行符“\n”进行切割
        let row = arr.length; //获取歌词行数
        for (let i = 0; i < row; i++) {
          let temp_row = arr[i]; //现在每一行格式大概就是这样"[00:04.302][02:10.00]hello world";
          let temp_arr = temp_row.split("]"); //我们可以通过“]”对时间和文本进行分离
          // pop()方法删除数组中的最后一个元素，并返回该删除的元素
          let text = temp_arr.pop(); //把歌词文本从数组中剔除出来，获取到歌词文本了！
          //再对剩下的歌词时间进行处理
          temp_arr.forEach((element) => {
            let obj = {};
            // 现在数组中的每个元素像这样：[00:04.302,[02:10.00
            // substr第一个参数：开始取的位置，第二个参数，取多少个
            let time_arr = element.substr(1, element.length - 1).split(":"); //先把多余的“[”去掉，再分离出分、秒
            let s = parseInt(time_arr[0]) * 60 + Math.round(time_arr[1]); //把时间转换成与currentTime相同的类型，方便待会实现滚动效果（转化成秒）
            obj.time = s;
            obj.text = text;
            this.translyric.push(obj); //每一行歌词对象存到组件的lyric歌词属性里
          });
        }
        this.translyric.sort((a, b) => {
          //设置一下排序规则
          //由于不同时间的相同歌词我们给排到一起了，所以这里要以时间顺序重新排列一下
          return a.time - b.time;
        });
        // this.$store.commit("SetLyric", this.lyric); //把歌词提交到store里，为了重新进入该组件时还能再次渲染
        // return this.lyric;
      },
    },
  };
</script>

<style lang="less" scoped>
  .songdetail-page {
    display: flex;
    align-items: flex-start;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 68px;
    z-index: 99;
    background: rgb(182, 195, 201);
    backdrop-filter: blur(30px);
    overflow: hidden;
    .left-wrap {
      flex: 1;
      align-self: center;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-end;
      margin: -2vh 2vw 0 9vw;
      position: relative;
      .song-img .img {
        width: 50vh;
        height: 50vh;
        border-radius: 20px;
        box-shadow: 0 6px 8px -2px rgba(47, 20, 20, 0.16);
      }
      .song-img .bac {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 240%;
        height: 240%;
        border-radius: 30%;
        transform: translate(0, -25%);
        filter: blur(300px) brightness(120%);
        cursor: initial;
      }
      .song-info {
        margin-top: 5vh;
        margin-right: 1vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;

        span {
          cursor: pointer;
        }

        span:hover {
          color: black;
          text-decoration: underline;
        }
        .song-name {
          font-size: 34px;
          font-weight: 800;
          color: rgb(0, 0, 0);
          display: -webkit-box;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-align: end;
        }
        .ar-al {
          font-size: 18px;
          margin-top: 3px;
          // margin-right: 3px;
          font-weight: 300;
          color: rgb(34, 33, 33);
          display: -webkit-box;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-align: end;
        }
      }
    }
    .right-wrap {
      flex: 1.5;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin: 2vh 0 60px 9vw;
      position: relative;
      .lyric-container {
        height: 86vh;
        overflow: scroll;

        // box-shadow: inset 0 1px rgba(98, 97, 97, 0.4),
        //   inset 0 -1px rgba(98, 97, 97, 0.4);
        .top-shadow {
          position: absolute;
          top: 0;
          left: 0;
          width: 38vw;
          box-shadow: 0 4px 6px 1px rgba(0, 0, 0, 0.1),
            0 2px 4px 1px rgba(0, 0, 0, 0.06);
        }
        .top-margin {
          margin-top: 20vh;
        }
        .bottom-shadow {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 38vw;
          box-shadow: 0 -4px 6px 1px rgba(0, 0, 0, 0.1),
            0 -2px 4px 1px rgba(0, 0, 0, 0.06);
        }
        .lyrics-wrap {
          transition: all ease 0.3s;
        }
        .lyrics {
          min-width: 500px;
          max-width: 600px;
          font-size: 24px;
          color: black;
          font-weight: 500;
          padding: 8px 0;
          padding-left: 5px;
          margin: 5px 0;
          padding-left: 5px;
          text-align: start;
          border-radius: 10px;
          cursor: pointer;
        }

        .lyrics.current {
          font-weight: 600;
          font-size: 30px;
          background-color: rgba(255, 255, 255, 0.3);
        }
      }
      .lyrics:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
</style>
