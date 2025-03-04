<script setup>
import RegisterForm from "@/components/Register/RegisterForm.vue";
</script>

<template>
  <main class="register-view">
    <register-form></register-form>
  </main>
</template>

<style scoped>
main.register-view {
  height: 100vh;
  display: grid;
  place-items: center;
  background: var(--color-light);
}
</style>
