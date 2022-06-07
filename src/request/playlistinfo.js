import { request } from "./request";
// 获取歌单详情
export function getPlaylist(id) {
  return request({
    url: "/playlist/detail",
    params: {
      id,
      //   timestamp:Date.parse(new Date())
    },
  });
}

// 收藏/取消收藏歌单
export function subPlaylist(t, id) {
  return request({
    url: "/playlist/subscribe",
    params: {
      t,
      id,
      //   timestamp: Date.parse(new Date()),
    },
  });
}
