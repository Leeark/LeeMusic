const state = {
  songUrl: "",
  showSongDetail: false,
  showPlayingList: false,
  isplay: false,
  playingSongInfo: JSON.parse(localStorage.getItem("playingSongInfo")) || {},
  currentTime: 0,
  playingList: JSON.parse(localStorage.getItem("playingList")) || [],
};
export default state;
