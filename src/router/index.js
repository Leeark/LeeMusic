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
    children: [
      {
        path: "homerec",
        name: "Homerec",
        component: HomeRec,
      },
      {
        path: "recsonglist",
        name: "Recsonglist",
        component: RecsongList,
      },
      {
        path: "songrank",
        name: "Songrank",
        component: SongRank,
      },
      {
        path: "singerselect",
        name: "Singerselect",
        component: SingerSelect,
      },
      {
        path: "latestsongs",
        name: "Latestsongs",
        component: LatestSongs,
      },
    ],
  },
  {
    path: "/recvideo",
    component: RecVideo,
    name: "Recvideo",
  },
  {
    path: "/playlist/:id",
    name: "Playlist",
    component: PlayList,
  },
  {
    path: "/album/:id",
    name: "AlbumDetail",
    component: AlbumDetail,
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
});

export default router;
