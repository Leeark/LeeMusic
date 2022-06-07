import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
Vue.config.productionTip = false;

// 全局使用element UI
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

// 全局使用懒加载
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload, {
  loading: require("./assets/loading.gif"),
  error: require("./assets/default.png"),
  attempt: 2,
  observer: true,
});

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
