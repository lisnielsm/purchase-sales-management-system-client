import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Categoria from "../components/Categorias.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/categorias",
    name: "categorias",
    component: Categoria,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
