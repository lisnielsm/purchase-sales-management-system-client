import Vue from "vue";
import VueRouter from "vue-router";
import Categoria from "../components/Categoria.vue";
import Articulo from "../components/Articulo.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/categorias",
    name: "categorias",
    component: Categoria,
  },
  {
    path: "/articulos",
    name: "articulos",
    component: Articulo,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
