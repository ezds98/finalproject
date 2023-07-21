import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue"
import Home from "../pages/Home.vue"
import Login from "../pages/Login.vue"
import ShoppingList from "@/pages/ShoppingList.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import DashboardPage from "@/pages/admin/DashboardPage.vue";
import CustomersPage from "@/pages/admin/CustomersPage.vue";
import ProductsPage from "@/pages/admin/ProductsPage.vue";
import SalesPage from "@/pages/admin/SalesPage.vue";
import SimpleFormRenderer from "@/components/SimpleFormRenderer.vue";
import ProductDescription from "@/pages/ProductDescription.vue";
import ProductList from "@/pages/ProductList.vue";
import ShopComplete from "@/pages/ShopComplete.vue";
import GamePage from "@/pages/GamePage.vue";
import PurchasePage from "@/pages/admin/PurchasePage.vue"
import UsersPage from "@/pages/admin/UsersPage.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/admin/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/admin",
      name: "Admin",
      component: AdminLayout,
      children:[
        {
          path: 'dashboard',
          meta: { title: 'Dashboard' },
          component: DashboardPage
        },
        {
          path: 'customers',
          meta: {title: 'Customer Page'},
          component: CustomersPage
        },
        {
          path: 'users',
          meta: {title: 'Users Page'},
          component: UsersPage
        },
        {
          path: 'products',
          meta: {title: 'Products Page'},
          component: ProductsPage
        },
        {
          path: 'sales',
          meta: {title: 'Sales Page'},
          component: PurchasePage
        },
        {
          path: 'purchases',
          meta: {title: 'Purchases Page'},
          component: SalesPage
        },
        {
          path: 'form',
          meta: {title: 'Customer Page'},
          component: SimpleFormRenderer
        }
      ]
    },
    {
      path: "/",
      name: "Main Layout",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: MainLayout,
      children: [
        {
          path:'',
          name:"Shop Home",
          component: Home
        },
        {
          path:'game',
          name:"Game",
          component: GamePage
        },
        {
          path:'products/list',
          name:"Product List",
          component: ProductList,
        },
        {
          path:'product/details/:id',
          name:"Product Description",
          component: ProductDescription
        },
        {
          path:'shopping-cart',
          name:"Shopping Cart",
          component: ShoppingList
        },
        {
          path:'shopping-complete',
          name:"Shopping Complete",
          component: ShopComplete
        }
      ]
    },
  ],
  scrollBehavior() {
    window.scrollTo(0,0);
  },
});

export default router;
