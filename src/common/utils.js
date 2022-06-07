export function formatTime(time) {
  // 如果超过了100000 基本都是毫秒为单位的了 先转成秒的
  time = parseInt(time);
  if (time > 10000) {
    time = Math.floor(time / 1000);
  } else {
    time = Math.floor(time);
  }
  // 计算分钟和秒
  let m = Math.floor(time / 60);
  let s = Math.floor(time % 60);
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  return m + ":" + s;
}

export function throttle(callback, wait) {
  // 定义开始时间
  let start = 0;
  // 返回结果是一个函数
  return function (e) {
    // 获取当前时间戳
    let now = Date.now();
    if (now - start >= wait) {
      // 如果满足条件 就执行回调函数
      callback.call(this, e);
      start = now;
    }
  };
}

export const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
