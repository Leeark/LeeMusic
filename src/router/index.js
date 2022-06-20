import Vue from "vue";
import VueRouter from "vue-router";

import DisCover from "../views/discover/DisCover";
import HomeRec from "../views/discover/homerec/HomeRec";
import RecsongList from "../views/discover/recsonglist/RecsongList";
import SongRank from "../views/discover/songrank/SongRank";
import SingerSelect from "../views/discover/singerselect/SingerSelect";
import LatestSongs from "../views/discover/latestsongs/LatestSongs";
import PlayList from "../components/PlayList";
import RecVideo from "../views/recvideo/RecVideo";
import AlbumDetail from "../components/AlbumDetail";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/discover",
  },
  {
    path: "/discover",
    component: DisCover,
    name: "Discover",
    redirect: "/discover/homerec",
    meta: {
      title: "Home",
    },
    children: [
      {
        path: "homerec",
        name: "Homerec",
        component: HomeRec,
        meta: {
          title: "Homerec",
        },
      },
      {
        path: "recsonglist",
        name: "Recsonglist",
        component: RecsongList,
        meta: {
          title: "Recsong",
        },
      },
      {
        path: "songrank",
        name: "Songrank",
        component: SongRank,
        meta: {
          title: "Songrank",
        },
      },
      {
        path: "singerselect",
        name: "Singerselect",
        component: SingerSelect,
        meta: {
          title: "Singers",
        },
      },
      {
        path: "latestsongs",
        name: "Latestsongs",
        component: LatestSongs,
        meta: {
          title: "Latest",
        },
      },
    ],
  },
  {
    path: "/recvideo",
    component: RecVideo,
    name: "Recvideo",
    meta: {
      title: "Recvideo",
    },
  },
  {
    path: "/playlist/:id",
    name: "Playlist",
    component: PlayList,
    meta: {
      title: "Playlist",
    },
  },
  {
    path: "/album/:id",
    name: "AlbumDetail",
    component: AlbumDetail,
    meta: {
      title: "Album",
    },
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | LeeMusic`;
  next();
});
export default router;
