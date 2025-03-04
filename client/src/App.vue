<script setup>
import { ref } from "vue";
import { useAccountStore } from "./stores/account";
import { useToast } from "primevue";
import { useRouter } from "vue-router";
import Loader from "./components/shared/Loader.vue";
import AppSidebar from "@/components/shared/Sidebar.vue";

const toast_icon_keys = {
  success: "pi pi-check-circle",
  info: "pi pi-info-circle",
  warn: "pi pi-exclamation-circle",
  error: "pi pi-times-circle",
};

const toast = useToast();
const router = useRouter();

const page_loader = ref(true);
const accountStore = useAccountStore();

const local_token = localStorage.getItem("TOKEN");
if (local_token) {
  accountStore.token = local_token;
  accountStore
    .checkAuth()
    .catch((error) => {
      toast.add({
        severity: "warn",
        detail: error?.message ?? error,
        closable: true,
      });
      router.push({ name: "login" });
    })
    .finally(() => (page_loader.value = false));
} else page_loader.value = false;

router.beforeEach((to, from, next) => {
  if (!accountStore.token && to.meta.auth) next({ name: "login" });
  else if (accountStore.token && ["login", "register"].includes(to.name))
    next({ name: "dashboard" });
  else next();
});
</script>

<template>
  <Toast>
    <template #container="slotProps">
      <Message
        :severity="slotProps.message.severity"
        :closable="slotProps.message.closable"
        @close="slotProps.closeCallback"
      >
        <template #icon>
          <i
            :class="toast_icon_keys[slotProps.message.severity]"
            class="toast-severity-icon"
            v-if="
              Object.keys(toast_icon_keys).includes(slotProps.message.severity)
            "
          ></i>
        </template>
        <template #default>
          <p class="toast-detail">{{ slotProps.message.detail }}</p>
        </template>
      </Message>
    </template>
  </Toast>
  <transition name="fade">
    <Loader v-if="page_loader" />
  </transition>
  <div class="app-wrapper">
    <transition name="fade">
      <AppSidebar v-if="accountStore.token" />
    </transition>
    <RouterView v-slot="{ Component }" class="router">
      <transition name="fade" mode="out-in">
        <Component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-to {
  transition: opacity 85ms ease-in-out;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.app-wrapper {
  display: flex;
  height: 100vh;
  .router {
    flex: 1;
    overflow: auto;
    height: 100%;
  }
}
</style>

<style>
.toast-severity-icon {
  font-size: 1.15rem !important;
  margin-right: 0.35rem;
}
.toast-detail {
  line-height: 150%;
  font-size: 0.95rem;
}
</style>
