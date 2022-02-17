import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/HelloWorld.vue";
import Categoria from "../components/Categoria.vue";
import Articulo from "../components/Articulo.vue";
import Rol from "../components/Rol.vue";
import Usuario from "../components/Usuario.vue";
import Cliente from "../components/Cliente.vue";
import Proveedor from "../components/Proveedor.vue";
import Login from "../components/Login.vue";
import store from '../store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      administrador: true,
      almacenero: true,
      vendedor: true
    }
  },
  {
    path: '/categorias',
    name: 'categorias',
    component: Categoria,
    meta: {
      administrador: true,
      almacenero: true
    }
  },
  {
    path: '/articulos',
    name: 'articulos',
    component: Articulo,
    meta: {
      administrador: true,
      almacenero: true
    }
  },
  {
    path: '/roles',
    name: 'roles',
    component: Rol,
    meta: {
      administrador: true
    }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: Usuario,
    meta: {
      administrador: true
    }
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: Cliente,
    meta: {
      administrador: true,
      vendedor: true
    }
  },
  {
    path: '/proveedores',
    name: 'proveedores',
    component: Proveedor,
    meta: {
      administrador: true,
      almacenero: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      libre: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)) {
    next()
  } else if (store.state.usuario && store.state.usuario.rol == 'Administrador') {
    if (to.matched.some(record => record.meta.administrador)) {
      next()
    }
  } else if (store.state.usuario && store.state.usuario.rol == 'Almacenero') {
    if (to.matched.some(record => record.meta.almacenero)) {
      next()
    }
  } else if (store.state.usuario && store.state.usuario.rol == 'Vendedor') {
    if (to.matched.some(record => record.meta.vendedor)) {
      next()
    }
  } else {
    next({
      name: 'login'
    })
  }
})

export default router;
