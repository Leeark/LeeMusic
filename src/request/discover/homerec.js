import { request } from "../request";

// 获取轮播图
export function getBanner() {
  return request({
    url: "/banner",
  });
}

// 获取推荐歌单
export function getReclist(limit) {
  return request({
    url: "/personalized",
    params: {
      limit,
    },
  });
}

// 获取独家内容
export function getPrivatecontent() {
  return request({
    url: "personalized/privatecontent",
  });
}
