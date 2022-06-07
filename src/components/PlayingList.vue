<template>
  <div class="list-container">
    <div class="title">播放列表</div>
    <div class="content">
      <div
        class="playing-items"
        v-for="song in playingList"
        :key="song.id"
        :class="playingSongInfo.id == song.id ? 'current' : ''"
      >
        <div class="item-name" @click="PlayItem(song)">
          {{ song.name }}
        </div>
        <div class="delete" @click="DeleteItem(song)">
          <div class="iconfont icon-delete"></div>
        </div>
      </div>
    </div>
    <div class="clear" @click="ClearItems">
      <div class="iconfont icon-clear"></div>
      清空
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import { checkMusic } from "@/request/songsinfo.js";
  export default {
    name: "PlayingList",
    data() {
      return {};
    },
    computed: {
      ...mapState(["songUrl", "playingList", "playingSongInfo"]),
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
    methods: {
      PlayItem(song) {
        checkMusic(song.id)
          .then(() => {
            // 通知actions获取url
            this.$store.dispatch("saveSongUrl", song.id);
            // 已经在列表里了，不需要添加歌曲到当前播放列表:playingList.unshift整个对象。
            // this.$store.commit("AddSong", song);
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
      },
      DeleteItem(song) {
        // console.log(song.id);
        this.$store.commit("DeleteSong", song.id);
      },
      ClearItems() {
        this.$store.commit("Clear");
      },
    },
  };
</script>

<style lang="less" scoped>
  .list-container {
    position: fixed;
    right: 0;
    bottom: 68px;
    height: 60vh;
    width: 15vw;
    background-color: rgba(127, 120, 140, 0.1);
    backdrop-filter: grayscale(10%) blur(10px);
    z-index: 999;
    border-radius: 5px 0 0 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .title {
      flex: 1;
      height: 100%;
      width: 100%;
      border: solid 1px rgba(208, 197, 197, 0.2);
      border-radius: 5px 0 0 0;
      color: #260a41;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .content {
      flex: 10;
      font-size: 16px;
      color: rgba(33, 9, 57, 0.8);
      overflow: scroll;
      margin: -1px 0;
      height: 100%;
      width: 100%;
      .current {
        color: #250d42;
        font-size: 21px;
        font-weight: 600;
      }
      .playing-items {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 1px 10px 9px;
        border-radius: 5px;
        .item-name {
          flex: 5;
          text-align: start;
          margin-right: 4vw;
          display: -webkit-box;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          cursor: pointer;
        }
        .delete {
          flex: 1;
          .icon-delete {
            font-size: 0;
            visibility: hidden;
            opacity: 0;
            transition: all ease 0.2s;
          }
          .icon-delete:hover {
            font-size: 16px;
          }
        }
      }
      .playing-items:hover .icon-delete {
        font-size: 12px;
        visibility: visible;
        opacity: 1;
        cursor: pointer;
      }
      .playing-items:hover .item-name {
        opacity: 0.8;
      }
      .playing-items:hover {
        background-color: rgba(127, 120, 140, 0.18);
      }
    }
    .clear {
      flex: 1;
      height: 100%;
      width: 100%;
      border: solid 1px rgba(208, 197, 197, 0.2);
      border-radius: 0 0 0 5px;
      color: #260743;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .icon-clear {
        margin-top: 1px;
        color: gray;
        font-size: 12px;
      }
    }
  }
</style>
