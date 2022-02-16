import Vue from "vue";
import VueRouter from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";
import Categoria from "../components/Categoria.vue";
import Articulo from "../components/Articulo.vue";
import Rol from "../components/Rol.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HelloWorld,
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
  {
    path: "/roles",
    name: "roles",
    component: Rol,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
