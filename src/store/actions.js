import { getSongUrl } from "@/request/songsinfo.js";

const actions = {
  saveSongUrl({ commit }, payload) {
    // 用ID获取歌曲链接。
    getSongUrl(payload).then((res) =>
      //   console.log("&&&", res.data.data[0].url)
      {
        // console.log("actions", res.data.data[0].url);
        commit("SaveSongUrl", res.data.data[0].url);
      }
    );
  },
};
export default actions;
