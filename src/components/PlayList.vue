<template>
  <div class="playlist">
    <div class="list-title">
      <div class="cover"><img v-lazy="playlist.coverImgUrl" alt="" /></div>
      <div class="info">
        <div class="title">{{ playlist.name }}</div>
        <div class="creator">
          创建者：<a
            :href="`https://music.163.com/#/user/home?id=${playlist.creator.userId}`"
            target="blank"
            >{{ playlist.creator.nickname }}</a
          >
          <span class="count">·共{{ playlist.trackCount }}首歌</span>
        </div>

        <div class="description">{{ playlist.description }}</div>
        <div class="playall" @click="playAllsongs">播放全部</div>
      </div>
    </div>
    <div class="songs-table">
      <div
        class="songs-item"
        v-for="song in songs"
        :key="song.id"
        :class="playingSongInfo.id == song.id ? 'playing' : ''"
      >
        <div class="item-picture">
          <img v-lazy="song.al.picUrl" alt="" loading="lazy" />
        </div>
        <div class="item-info">
          <div class="item-name">{{ song.name }}</div>

          <div class="item-artist">
            <div class="link">{{ song.ar[0].name }}</div>
          </div>
        </div>
        <div class="item-of-album">
          <div class="link" @click="toAlbum(song)">
            {{ song.al.name }}
          </div>
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
  import { getPlaylist } from "@/request/playlistinfo.js";
  import { getSongsDetail, checkMusic } from "@/request/songsinfo.js";
  import { mapState } from "vuex";
  export default {
    name: "PlayList",
    data() {
      return {
        playlistid: "",
        // 初始化需要用到的数据，防止报错
        // [Vue warn]: Error in render: "TypeError: Cannot read properties of undefined
        playlist: {
          id: 0,
          coverImgUrl: "",
          trackCount: 0,
          creator: {
            userId: "",
            nickname: "",
          },
        },
        songs: [],
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
      this.playlistid = this.$route.params.id;
      this.getPlaylistDetail();
    },
    mounted() {},
    methods: {
      async getPlaylistDetail() {
        const { data } = await getPlaylist(this.playlistid);
        //   获取歌单信息
        this.playlist = data.playlist;
        // console.log(this.playlist);
        // 返回歌曲id(数组形式)，转换为 字符串形式，以（，）分隔
        const tracksid = this.playlist.trackIds
          .map((item) => {
            return item.id;
          })
          .join(",");
        //   获取每首歌的信息
        getSongsDetail(tracksid).then((res) => {
          if (res.data.code == 200) {
            this.songs = res.data.songs;
            // console.log(this.songs);
            // 成功拿到了每首歌的id
            // console.log(this.songs.map((item) => item.id));
          }
        });
        // .catch(() => {
        //   this.$message({
        //     message: "当前网速较慢~",
        //     type: "warning",
        //     center: true,
        //   });
        // });
      },

      // bug:播放id和点击id相同，footer暂停后playlist里点击切换不了标签。
      // 原因：只是否有id，暂停后，点击不同歌曲，没有切换状态，一直是false。要加上播放状态的判断。
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
      //点击播放全部按钮后，删除playinglist数据，歌单和专辑数据也会变。
      playAllsongs() {
        //  state.playingList整个歌单列表。
        this.$store.commit("AddAllSong", this.songs);
        // 播放第一首歌
        this.$store.dispatch("saveSongUrl", this.songs[0].id);
        // 把当前歌曲的信息保存在store里:playingSongInfo。
        this.$store.commit("SaveSongInfo", this.songs[0]);
        this.isplay = true;
      },
      toAlbum(song) {
        this.$router.push("/album/" + song.al.id);
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
  .link,
  .iconfont {
    cursor: pointer;
    transition: all ease 0.3s;
  }
  .link:hover {
    color: rgba(88, 78, 156, 0.9);
  }
  .link:active,
  .iconfont:active {
    transform: scale(1.02);
  }
  .songs-table {
    margin-top: 32px;
    .songs-item {
      transition: all ease 0.3s;
      border-radius: 12px;
      padding: 4px 1vw;
      display: flex;
      align-items: center;
      text-align: start;
      //   justify-content: space-between;
      //   gap: 5px;
      .item-picture {
        height: 48px;
        width: 48px;
        border-radius: 8px;
        overflow: hidden;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .item-info {
        flex: 0.7;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        margin-left: 2vw;
        gap: 3px;
        .item-name {
          font-weight: 600;
          color: var(--base-black);
          font-size: 16px;
          cursor: default;
        }
        .item-artist {
          font-size: 12px;
          font-weight: 468;
          color: var(--base-black);
          opacity: 0.76;
        }
      }
      .item-of-album {
        flex: 1;
        text-align: start;
        font-weight: 500;
        color: var(--base-black);
      }
      .playstate {
        flex: 0.4;
        .iconfont {
          font-size: 0;
          visibility: hidden;
          opacity: 0;
        }
      }
      .item-duration {
        flex: 0.3;
        font-size: 14px;
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
      font-size: 14px;
      visibility: visible;
      opacity: 1;
    }
  }
</style>
