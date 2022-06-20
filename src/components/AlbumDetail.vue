<template>
  <div class="playlist">
    <div class="list-title">
      <div class="cover"><img v-lazy="albuminfo.picUrl" alt="" /></div>
      <div class="info">
        <div class="title">{{ albuminfo.name }}</div>
        <!-- 加v-if防止undefined报错 -->
        <div class="creator" v-if="albuminfo.artist">
          歌手：{{ albuminfo.artist.name }}
          <span class="count">·共{{ albuminfo.size }}首歌</span>
        </div>
        <div class="description">
          {{ albuminfo.description }}
        </div>
        <div class="playall" @click="playAllsongs">播放全部</div>
      </div>
    </div>
    <div class="songs-table">
      <div
        class="songs-item"
        v-for="(song, index) in albumsongs"
        :key="song.id"
        :class="playingSongInfo.id == song.id ? 'playing' : ''"
      >
        <div class="order">{{ addZero(index + 1) }}</div>
        <div class="item-info">
          <div class="item-name">{{ song.name }}</div>
        </div>
        <div class="playstate">
          <div
            class="iconfont"
            :class="
              isplay && playingSongInfo.id == song.id
                ? 'icon-play'
                : 'icon-pause'
            "
            @click="changePlaySong(song)"
          ></div>
        </div>
        <div class="item-duration">{{ formatDuration(song.dt) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getAlbum, checkMusic } from "@/request/songsinfo.js";
  import { mapState } from "vuex";
  export default {
    name: "AlbumDetail",
    data() {
      return {
        albuminfo: {},
        albumsongs: [],
      };
    },
    computed: {
      ...mapState(["songUrl", "playingSongInfo"]),
      isplay: {
        get() {
          return this.$store.state.isplay;
        },
        set(payload) {
          // 递交mutation改变isplay的属性
          this.$store.commit("ChangePlayState", payload);
        },
      },
    },
    created() {
      this.getAlbumDetail();
    },
    //监视路由(参数)变化刷新页面。
    watch: {
      $route: "getAlbumDetail",
    },
    methods: {
      async getAlbumDetail() {
        const albumId = this.$route.params.id;
        console.log(albumId);
        const { data } = await getAlbum(albumId);
        this.albuminfo = data.album;
        this.albumsongs = data.songs;
      },
      changePlaySong(song) {
        //   成功拿到点击歌曲的id
        if (this.playingSongInfo.id == song.id) {
          // 判断正在播放的id与点击id是否一致
          // 一致播放状态就取反
          //   由于刷新页面第一次播放时this.playingSongInfo是个空对象，不满足该条件，能发请求。
          this.isplay = !this.isplay;
          return;
        } else {
          checkMusic(song.id)
            .then(() => {
              // 通知actions获取url
              this.$store.dispatch("saveSongUrl", song.id);
              // 添加歌曲到当前播放列表:playingList.unshift整个对象。
              this.$store.commit("AddSong", song);
              // 把当前歌曲的信息保存在store里:playingSongInfo。
              this.$store.commit("SaveSongInfo", song);
              this.isplay = true;
            })
            .catch(() => {
              this.$message({
                message: "暂无音源，听听其他的吧",
                type: "warning",
                center: true,
              });
              // playingList:state.playingList.splice(index, 1);
              this.$store.commit("DeleteSong", song.id);
            });
        }
      },
      playAllsongs() {
        //  state.playingList整个歌单列表。
        this.$store.commit("AddAllSong", this.albumsongs);
        // 播放第一首歌
        this.$store.dispatch("saveSongUrl", this.albumsongs[0].id);
        // 把当前歌曲的信息保存在store里:playingSongInfo。
        this.$store.commit("SaveSongInfo", this.albumsongs[0]);
        this.isplay = true;
      },
      formatDuration(time) {
        // 如果超过了100000 基本都是毫秒为单位的了 先转成秒的
        time = parseInt(time);
        if (time > 10000) {
          time = Math.floor(time / 1000);
        } else {
          time = Math.floor(time);
        }
        let m = Math.floor(time / 60);
        let s = Math.floor(time % 60);
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        return m + ":" + s;
      },
      addZero(num) {
        if (parseInt(num) < 10) {
          num = "0" + num;
        }
        return num;
      },
    },
  };
</script>

<style lang="less" scoped>
  .playlist {
    margin: 20px auto;
    width: 78vw;
  }

  .list-title {
    display: flex;
    // justify-content: center;
    .cover {
      //   border: 1px solid black;

      img {
        width: 268px;
        height: 268px;
        border-radius: 6px;
        border: 1px solid rgba(227, 227, 227, 0.81);
      }
    }
    .info {
      flex: 1;
      margin-left: 60px;
      text-align: start;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      max-height: 280px;
      position: relative;
      .title {
        font-size: 32px;
        font-weight: 800;
        color: rgb(0, 0, 0);
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .creator {
        font-size: 18px;
        opacity: 0.9;
        color: rgb(24, 24, 24);
        margin-top: 24px;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;

        .count {
          font-size: 12px;
          margin-left: 20px;
        }
      }

      .description {
        font-size: 14px;
        opacity: 0.68;
        color: rgb(43, 41, 41);
        margin-top: 28px;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        cursor: pointer;
      }

      .playall {
        position: absolute;
        left: 5px;
        bottom: 0;
        font-size: 22px;
        padding: 5px;
        color: rgb(77, 62, 126);
        font-weight: 600;
        background-color: rgba(109, 86, 186, 0.2);
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
        transition: all ease 0.3s;
      }
      .playall:active {
        transform: scale(1.2);
      }
    }
  }
  .iconfont {
    cursor: pointer;
    transition: all ease 0.3s;
  }
  .songs-table {
    margin-top: 32px;
    .songs-item {
      transition: all ease 0.3s;
      border-radius: 12px;
      padding: 8px 1vw;
      display: flex;
      align-items: center;
      justify-content: space-between;
      //   gap: 5px;
      .item-info {
        flex: 3;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        margin-left: 1vw;
        gap: 4px;
        .item-name {
          font-weight: 600;
          color: var(--base-black);
          font-size: 20px;
          cursor: default;
        }
      }
      .playstate {
        flex: 1.5;
        .iconfont {
          font-size: 0;
          visibility: hidden;
          opacity: 0;
        }
      }
      .item-duration {
        flex: 1;
        text-align: end;
        font-size: 18px;
        font-weight: 500;
        color: var(--base-black);
      }
    }
    .songs-item:hover {
      background-color: rgba(194, 196, 196, 0.1);
    }
    .songs-item.playing {
      background-color: rgb(90 40 201 / 10%);
    }
    .songs-item:hover .iconfont {
      font-size: 16px;
      visibility: visible;
      opacity: 1;
    }
  }
</style>
