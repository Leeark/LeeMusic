const mutations = {
  SaveSongUrl(state, payload) {
    state.songUrl = payload;
    // console.log("mutations", state, state.songUrl);
  },
  ChangePlayState(state, payload) {
    state.isplay = payload;
  },
  SaveSongInfo(state, payload) {
    state.playingSongInfo = payload;
    // 把歌曲详情保存在缓存里
    localStorage.setItem(
      "playingSongInfo",
      JSON.stringify(state.playingSongInfo)
    );
  },
  ChangeSongDetailState(state, payload) {
    state.showSongDetail = payload;
  },
  ChangePlayingListState(state, payload) {
    state.showPlayingList = payload;
  },
  SaveCurrentTime(state, payload) {
    state.currentTime = payload;
    // console.log(payload, state.currentTime);
  },
  AddSong(state, song) {
    // 列表查找相同的歌曲
    let index = state.playingList.findIndex((item) => {
      return item.id == song.id;
    });
    //如果列表不存在相同的歌曲 再添加到播放列表
    if (index == -1) {
      // unshift() 方法将一个或多个元素添加到数组的开头，并返回该数组的新长度（该方法修改原有数组）。
      state.playingList.unshift(song);
      localStorage.setItem("playingList", JSON.stringify(state.playingList));
    }
  },

  AddAllSong(state, payload) {
    // 整个列表覆盖了之前的播放列表。XXXXXXXXXXXXXXXXXXXXX完全错误，把playlist数据直接赋值给playinglist，维护同一份数据。
    // 删除当前播放列表歌曲，歌单歌曲也会被删除。这是浅拷贝共享同一内存的原因
    // 需要深拷贝。
    state.playingList = JSON.parse(JSON.stringify(payload));
    localStorage.setItem("playingList", JSON.stringify(state.playingList));
  },
  DeleteSong(state, songId) {
    let index = state.playingList.findIndex((item) => {
      return songId == item.id;
    });
    // 按index删去N个元素
    state.playingList.splice(index, 1);
    localStorage.setItem("playingList", JSON.stringify(state.playingList));
  },
  Clear(state) {
    state.playingList = [];
    localStorage.removeItem("playingList");
  },
};
export default mutations;
