import AppRoutes from "./app.routes";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: AppRoutes,
});

export default router;
