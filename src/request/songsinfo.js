import { request } from "./request";

// 获取歌曲播放链接
export function getSongUrl(id) {
  return request({
    url: "/song/url",
    params: {
      id,
    },
  });
}
// 检查歌曲是否可用
export function checkMusic(id) {
  return request({
    url: "/check/music",
    params: {
      id,
    },
  });
}
// 获取每首歌的详细信息
export function getSongsDetail(ids) {
  return request({
    url: "/song/detail",
    params: {
      ids, //音乐id(支持多个id, 用 , 隔开)
    },
  });
}
// 获取歌词
export function getSongLyric(id) {
  return request({
    url: "/lyric",
    params: {
      id,
    },
  });
}
// 获取专辑信息
export function getAlbum(id) {
  return request({
    url: "/album",
    params: {
      id,
    },
  });
}
