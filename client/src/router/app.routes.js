import HomeView from "@/views/DashboardView.vue";
import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";

export default [
  {
    path: "/",
    name: "dashboard",
    component: HomeView,
    meta: {
      auth: true
    },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
];
