import "primeicons/primeicons.css";
import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";

import vue3GoogleLogin from "vue3-google-login";

import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_APP_API_BASE;

const preset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#f6fbe3",
      100: "#ecf7c7",
      200: "#e1f2a6",
      300: "#d5ec81",
      400: "#c9e55b",
      500: "#b4d60e",
      600: "#9ec10a",
      700: "#85a406",
      800: "#6c8704",
      900: "#566b03",
      950: "#3e4a02",
    },
    colorScheme: {
      light: {
        primary: {
          color: "#b4d60e",
          inverseColor: "#323232",
          contrastColor: "#222222",
          hoverColor: "#a8c80d",
          activeColor: "#a8c80d",
        },
      },
    },
  },
});

const app = createApp(App);

app.provide("API_BASE", import.meta.env.VITE_APP_API_BASE);
app.provide("GOOGLE_CLIENT_ID", import.meta.env.VITE_APP_GOOGLE_CLIENT_ID);
app.use(createPinia());
app.use(router);
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
  autoLogin: true,
});
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset,
    options: {
      darkModeSelector: "light",
    },
  },
});
app.use(ToastService);

app.mount("#app");
