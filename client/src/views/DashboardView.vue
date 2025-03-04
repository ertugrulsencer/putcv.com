<script setup>
import ResumeList from "@/components/Dashboard/ResumeList.vue";
import Summary from "@/components/Dashboard/Summary.vue";
import CreateResume from "@/components/dialogs/CreateResume.vue";
import { useAccountStore } from "@/stores/account";
import { useResumeStore } from "@/stores/resume";
import { useToast } from "primevue";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();
const accountStore = useAccountStore();
const resumeStore = useResumeStore();

resumeStore.getList().catch((error) => {
  toast.add({
    severity: "error",
    detail: error.message,
    life: 3000,
    closable: true,
  });
});
</script>

<template>
  <main class="dashboard-view">
    <div class="container">
      <Summary />
      <ResumeList />
      <teleport to="body">
        <CreateResume />
      </teleport>
    </div>
  </main>
</template>

<style scoped>
.router {
  padding: 1.5rem 2rem;
}
</style>
